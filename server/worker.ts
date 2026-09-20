// Cloudflare Worker API Backend for Aluvantis HR
// Bindings: DB (D1), SESSIONS (KV), CACHE (KV), RATELIMIT (KV), FILES (R2)

export interface Env {
  DB: any; // D1Database
  SESSIONS: any; // KVNamespace
  CACHE: any; // KVNamespace
  RATELIMIT: any; // KVNamespace
  FILES: any; // R2Bucket
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
  JWT_SECRET?: string;
  TELEGRAM_BOT_TOKEN?: string;
  ENVIRONMENT?: string;
}

// Helpers
function jsonResponse(data: any, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers,
    },
  });
}

// Simple WebCrypto-based HMAC-SHA256 JWT
async function signJwt(payload: any, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  const b64 = (obj: any) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const unsignedToken = `${b64(header)}.${b64(payload)}`;
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(unsignedToken));
  const b64Sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${unsignedToken}.${b64Sig}`;
}

async function verifyJwt(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const unsignedToken = `${headerB64}.${payloadB64}`;
    const sigStr = atob(sigB64.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBuf = new Uint8Array(sigStr.split('').map((c) => c.charCodeAt(0)));

    const valid = await crypto.subtle.verify('HMAC', key, sigBuf, enc.encode(unsignedToken));
    if (!valid) return null;

    const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);

    // Expiry check
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const clientIp = request.headers.get('cf-connecting-ip') || '127.0.0.1';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Rate Limiter via KV (100 req/min/IP)
    if (env.RATELIMIT) {
      const rateKey = `rate:${clientIp}:${Math.floor(Date.now() / 60000)}`;
      const current = await env.RATELIMIT.get(rateKey);
      const count = current ? parseInt(current, 10) : 0;
      if (count > 100) {
        return jsonResponse(
          { error: 'So‘rovlar soni me’yordan oshdi. Bir daqiqadan so‘ng qayta urinib ko‘ring.' },
          429
        );
      }
      await env.RATELIMIT.put(rateKey, (count + 1).toString(), { expirationTtl: 120 });
    }

    // 1. Health check
    if (pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        service: 'Aluvantis HR Cloudflare Worker',
        timestamp: new Date().toISOString(),
        bindings: {
          d1: !!env.DB,
          kv_sessions: !!env.SESSIONS,
          kv_cache: !!env.CACHE,
          r2_files: !!env.FILES,
        },
      });
    }

    // 2. Google OAuth Start
    if (pathname === '/api/auth/google') {
      const clientId = env.GOOGLE_CLIENT_ID || 'DEMO_CLIENT_ID';
      const redirectUri = env.GOOGLE_REDIRECT_URI || `${url.origin}/api/auth/google/callback`;
      const state = crypto.randomUUID();

      if (env.SESSIONS) {
        await env.SESSIONS.put(`oauth_state:${state}`, '1', { expirationTtl: 600 });
      }

      const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      googleAuthUrl.searchParams.set('client_id', clientId);
      googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
      googleAuthUrl.searchParams.set('response_type', 'code');
      googleAuthUrl.searchParams.set('scope', 'openid email profile');
      googleAuthUrl.searchParams.set('state', state);
      googleAuthUrl.searchParams.set('prompt', 'select_account');

      return Response.redirect(googleAuthUrl.toString(), 302);
    }

    // 3. Google OAuth Callback
    if (pathname === '/api/auth/google/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (!code) {
        return jsonResponse({ error: 'Google avtorizatsiya kodi topilmadi' }, 400);
      }

      // Check state
      if (env.SESSIONS && state) {
        const stored = await env.SESSIONS.get(`oauth_state:${state}`);
        if (!stored) {
          return jsonResponse({ error: 'Xavfsizlik tekshiruvi (OAuth state) yaroqsiz' }, 403);
        }
        await env.SESSIONS.delete(`oauth_state:${state}`);
      }

      try {
        // Exchange code with Google
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: env.GOOGLE_CLIENT_ID || '',
            client_secret: env.GOOGLE_CLIENT_SECRET || '',
            redirect_uri: env.GOOGLE_REDIRECT_URI || `${url.origin}/api/auth/google/callback`,
            grant_type: 'authorization_code',
          }),
        });

        const tokenData: any = await tokenRes.json();
        if (!tokenData.access_token) {
          throw new Error('Google token olishda xatolik');
        }

        // Fetch User Info
        const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const profile: any = await userRes.json();

        // Upsert into D1
        let userId = 1;
        let roleName = 'admin';
        if (env.DB) {
          // Check if exists
          const existing = await env.DB.prepare('SELECT id, role_id, company_id FROM users WHERE google_sub = ?')
            .bind(profile.sub)
            .first();

          if (existing) {
            userId = existing.id;
            await env.DB.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?')
              .bind(profile.name, profile.email, userId)
              .run();
          } else {
            // First user or employee
            const countUsers = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first();
            const isFirst = (countUsers?.count || 0) === 0;
            const assignedRole = isFirst ? 1 : 4; // 1: admin, 4: employee

            const inserted = await env.DB.prepare(
              'INSERT INTO users (google_sub, email, name, role_id, is_active) VALUES (?, ?, ?, ?, 1) RETURNING id'
            )
              .bind(profile.sub, profile.email, profile.name, assignedRole)
              .first();
            userId = inserted?.id || 1;
          }
        }

        // Issue JWT (15 mins) & Session in KV (7 days)
        const jwtSecret = env.JWT_SECRET || 'aluvantis_secret_key_change_in_production_2026';
        const sessionToken = crypto.randomUUID();
        const jwt = await signJwt(
          {
            sub: userId,
            email: profile.email,
            name: profile.name,
            role: roleName,
            session_id: sessionToken,
            exp: Math.floor(Date.now() / 1000) + 900,
          },
          jwtSecret
        );

        if (env.SESSIONS) {
          await env.SESSIONS.put(
            `session:${sessionToken}`,
            JSON.stringify({ userId, email: profile.email, role: roleName, profile }),
            { expirationTtl: 604800 }
          );
        }

        // Redirect back with token cookie or redirect to root
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/?auth_success=1',
            'Set-Cookie': `aluvantis_jwt=${jwt}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=900`,
          },
        });
      } catch (err: any) {
        return jsonResponse({ error: 'Google avtorizatsiyasida nosozlik', details: err.message }, 500);
      }
    }

    // 4. Authenticated /api/auth/me
    if (pathname === '/api/auth/me') {
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '');
      if (!token) {
        return jsonResponse({ error: 'Tizimga kirmagansiz' }, 401);
      }
      const verified = await verifyJwt(token, env.JWT_SECRET || 'aluvantis_secret_key_change_in_production_2026');
      if (!verified) {
        return jsonResponse({ error: 'Sessiya muddati tugagan' }, 401);
      }
      return jsonResponse({ user: verified });
    }

    // 5. Cloudflare R2 Blob Storage file delivery (/files/:key)
    if (pathname.startsWith('/api/assets/')) {
      const assetName = pathname.replace('/api/assets/', '');
      
      // Check R2 or KV
      if (env.FILES) {
        const object = await env.FILES.get(`assets/${assetName}`);
        if (object) {
          const headers = new Headers();
          object.writeHttpMetadata(headers);
          headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          return new Response(object.body, { headers });
        }
      }
      if (env.CACHE) {
        const cached = await env.CACHE.get(`asset:${assetName}`, 'arrayBuffer');
        if (cached) {
          return new Response(cached, {
            headers: {
              'Content-Type': assetName.endsWith('.png') ? 'image/png' : 'image/svg+xml',
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      }
      return jsonResponse({ error: 'Asset stored in static assets', asset: assetName }, 200);
    }

    if (pathname.startsWith('/files/')) {
      const key = pathname.replace('/files/', '');
      if (!env.FILES) {
        return jsonResponse({ error: 'R2 storage sozlanmagan' }, 503);
      }
      const object = await env.FILES.get(key);
      if (!object) {
        return jsonResponse({ error: 'Fayl topilmadi' }, 404);
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return new Response(object.body, { headers });
    }

    // 6. D1 Relational REST API endpoints
    if (pathname === '/api/employees' && env.DB) {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM employees ORDER BY id DESC').all();
        return jsonResponse({ employees: results });
      }
      if (request.method === 'POST') {
        const body: any = await request.json();
        const res = await env.DB.prepare(
          'INSERT INTO employees (company_id, full_name, position, hire_date, base_salary) VALUES (?, ?, ?, ?, ?) RETURNING id'
        )
          .bind(body.company_id || 1, body.full_name, body.position, body.hire_date, body.base_salary)
          .first();
        return jsonResponse({ success: true, id: res?.id }, 201);
      }
    }

    // Fallback: 404 for unknown /api/
    if (pathname.startsWith('/api/')) {
      return jsonResponse({ error: 'API yo‘nalishi topilmadi' }, 404);
    }

    return new Response('Not Found', { status: 404 });
  },
};
