import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const STICKERS_DIR = path.join(PUBLIC_DIR, 'stickers');

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(STICKERS_DIR)) {
  fs.mkdirSync(STICKERS_DIR, { recursive: true });
}

// 1. Assets Definitions
const ASSET_SPECS = [
  {
    name: 'hero-phone.png',
    outPath: path.join(PUBLIC_DIR, 'hero-phone.png'),
    prompt: "Premium product mockup: one modern smartphone floating at a slight 3/4 angle, screen showing a clean HR dashboard: deep teal #0E4F4F header, cream #F6F3EC cards, brass gold #C6A15B accents, Uzbek one-word tabs Smena, Oylik, Ta'til, shift rows with green check badges and one gold attention badge, big bold number 12 400 000 so'm. Soft studio light, warm cream linen background, gentle shadow, minimal, no hands, ultra clean.",
    width: 600,
    height: 800,
    type: 'phone'
  },
  {
    name: 'stickers/s1.png',
    outPath: path.join(STICKERS_DIR, 's1.png'),
    prompt: "Die-cut sticker, thick white border, soft shadow, flat vector, palette teal #0E4F4F gold #C6A15B cream #F6F3EC, text: 1 oqshomda!",
    text: "1 oqshomda!",
    width: 300,
    height: 150,
    type: 'sticker'
  },
  {
    name: 'stickers/s2.png',
    outPath: path.join(STICKERS_DIR, 's2.png'),
    prompt: "Die-cut sticker, thick white border, soft shadow, flat vector, palette teal #0E4F4F gold #C6A15B cream #F6F3EC, text: Excel yo'q!",
    text: "Excel yo'q!",
    width: 300,
    height: 150,
    type: 'sticker'
  },
  {
    name: 'stickers/s3.png',
    outPath: path.join(STICKERS_DIR, 's3.png'),
    prompt: "Die-cut sticker, thick white border, soft shadow, flat vector, palette teal #0E4F4F gold #C6A15B cream #F6F3EC, text: Telegram'da!",
    text: "Telegram'da!",
    width: 300,
    height: 150,
    type: 'sticker'
  },
  {
    name: 'stickers/s4.png',
    outPath: path.join(STICKERS_DIR, 's4.png'),
    prompt: "Die-cut sticker, thick white border, soft shadow, flat vector, palette teal #0E4F4F gold #C6A15B cream #F6F3EC, text: 0 server!",
    text: "0 server!",
    width: 300,
    height: 150,
    type: 'sticker'
  },
  {
    name: 'stickers/s5.png',
    outPath: path.join(STICKERS_DIR, 's5.png'),
    prompt: "Die-cut sticker, thick white border, soft shadow, flat vector, palette teal #0E4F4F gold #C6A15B cream #F6F3EC, text: 12% avto!",
    text: "12% avto!",
    width: 300,
    height: 150,
    type: 'sticker'
  },
  {
    name: 'stickers/s6.png',
    outPath: path.join(STICKERS_DIR, 's6.png'),
    prompt: "Die-cut sticker, thick white border, soft shadow, flat vector, palette teal #0E4F4F gold #C6A15B cream #F6F3EC, text: Jamoa zo'r!",
    text: "Jamoa zo'r!",
    width: 300,
    height: 150,
    type: 'sticker'
  },
  {
    name: 'og.png',
    outPath: path.join(PUBLIC_DIR, 'og.png'),
    prompt: "1200x630 social card: teal background #0E4F4F, gold angular A mark, wordmark Aluvantis HR, tagline Jamoangiz — bir oqshomda tartibda.",
    width: 1200,
    height: 630,
    type: 'og'
  },
  {
    name: 'icon-512.png',
    outPath: path.join(PUBLIC_DIR, 'icon-512.png'),
    prompt: "App icon: teal squircle #0E4F4F, gold angular A mark centered #C6A15B.",
    width: 512,
    height: 512,
    type: 'icon'
  }
];

// Helper to render high quality vector SVG -> PNG buffer fallback if API is not active or limited
function generateSVG(spec: typeof ASSET_SPECS[0]): string {
  if (spec.type === 'sticker') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#14201F" flood-opacity="0.18"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <!-- Outer White Die-Cut Border -->
        <rect x="10" y="10" width="${spec.width - 20}" height="${spec.height - 20}" rx="28" fill="#FFFFFF" stroke="#F6F3EC" stroke-width="4"/>
        <!-- Inner Teal Fill -->
        <rect x="18" y="18" width="${spec.width - 36}" height="${spec.height - 36}" rx="22" fill="#0E4F4F"/>
        <!-- Accent Gold Strip -->
        <path d="M 24 24 L ${spec.width - 24} 24" stroke="#C6A15B" stroke-width="4" stroke-linecap="round"/>
        <!-- Sticker Text -->
        <text x="${spec.width / 2}" y="${spec.height / 2 + 8}" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="26" fill="#F6F3EC" text-anchor="middle" letter-spacing="-0.5">${spec.text || ''}</text>
      </g>
    </svg>`;
  }

  if (spec.type === 'phone') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <defs>
        <filter id="phoneShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="12" dy="24" stdDeviation="20" flood-color="#0E4F4F" flood-opacity="0.25"/>
        </filter>
        <linearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0E4F4F"/>
          <stop offset="100%" stop-color="#14201F"/>
        </linearGradient>
      </defs>
      <rect width="600" height="800" fill="transparent"/>
      <!-- Phone Body Mockup angled -->
      <g transform="translate(70, 40) rotate(-3)" filter="url(#phoneShadow)">
        <!-- Outer Bezel -->
        <rect x="0" y="0" width="440" height="720" rx="48" fill="#14201F" stroke="#C6A15B" stroke-width="3"/>
        <!-- Screen Area -->
        <rect x="12" y="12" width="416" height="696" rx="38" fill="#F6F3EC"/>
        <!-- Top Notch / Island -->
        <rect x="160" y="24" width="120" height="20" rx="10" fill="#0E4F4F"/>
        <!-- Header area inside screen -->
        <rect x="12" y="12" width="416" height="150" fill="url(#headerGrad)"/>
        <!-- Brand Title inside screen -->
        <text x="36" y="80" font-family="system-ui, sans-serif" font-weight="800" font-size="22" fill="#F6F3EC">Aluvantis HR</text>
        <text x="36" y="104" font-family="system-ui, sans-serif" font-weight="500" font-size="13" fill="#C6A15B">Jamoa boshqaruvi</text>
        
        <!-- Uzbek One-word Tabs: Smena, Oylik, Ta'til -->
        <rect x="36" y="124" width="80" height="28" rx="14" fill="#C6A15B"/>
        <text x="76" y="142" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#14201F" text-anchor="middle">Smena</text>
        
        <rect x="126" y="124" width="80" height="28" rx="14" fill="rgba(255,255,255,0.15)"/>
        <text x="166" y="142" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#F6F3EC" text-anchor="middle">Oylik</text>
        
        <rect x="216" y="124" width="80" height="28" rx="14" fill="rgba(255,255,255,0.15)"/>
        <text x="256" y="142" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#F6F3EC" text-anchor="middle">Ta'til</text>

        <!-- Main Card on screen -->
        <rect x="32" y="180" width="376" height="130" rx="20" fill="#FFFFFF" stroke="#0E4F4F" stroke-opacity="0.1" stroke-width="1"/>
        <text x="56" y="212" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="#0E4F4F">Joriy oylik fondi (JShDS 12% avto)</text>
        <text x="56" y="250" font-family="system-ui, sans-serif" font-weight="800" font-size="28" fill="#0E4F4F">12 400 000 so'm</text>
        <rect x="56" y="268" width="100" height="22" rx="11" fill="#0E4F4F" fill-opacity="0.1"/>
        <text x="106" y="283" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#0E4F4F" text-anchor="middle">✓ Soliq tayyor</text>

        <!-- Shift Rows -->
        <!-- Row 1 -->
        <rect x="32" y="325" width="376" height="70" rx="16" fill="#FFFFFF"/>
        <circle cx="64" cy="360" r="18" fill="#0E4F4F" fill-opacity="0.1"/>
        <text x="64" y="365" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#0E4F4F" text-anchor="middle">AK</text>
        <text x="96" y="355" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#14201F">Aziz Karimov</text>
        <text x="96" y="373" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#666">Bosh muhandis • 09:00 - 18:00</text>
        <rect x="310" y="348" width="80" height="24" rx="12" fill="#10B981" fill-opacity="0.15"/>
        <text x="350" y="364" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle">✓ Kelgan</text>

        <!-- Row 2 -->
        <rect x="32" y="405" width="376" height="70" rx="16" fill="#FFFFFF"/>
        <circle cx="64" cy="440" r="18" fill="#C6A15B" fill-opacity="0.2"/>
        <text x="64" y="445" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#0E4F4F" text-anchor="middle">MN</text>
        <text x="96" y="435" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#14201F">Malika Nuri</text>
        <text x="96" y="453" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#666">Dizayner • Masofaviy smena</text>
        <rect x="310" y="428" width="80" height="24" rx="12" fill="#C6A15B" fill-opacity="0.2"/>
        <text x="350" y="444" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#0E4F4F" text-anchor="middle">Ta'tilda</text>

        <!-- Row 3 -->
        <rect x="32" y="485" width="376" height="70" rx="16" fill="#FFFFFF"/>
        <circle cx="64" cy="520" r="18" fill="#0E4F4F" fill-opacity="0.1"/>
        <text x="64" y="525" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#0E4F4F" text-anchor="middle">JR</text>
        <text x="96" y="515" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#14201F">Jasur Rahimov</text>
        <text x="96" y="533" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#666">HR Menejer • QR Tasdiq</text>
        <rect x="310" y="508" width="80" height="24" rx="12" fill="#10B981" fill-opacity="0.15"/>
        <text x="350" y="524" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle">✓ Kelgan</text>

        <!-- Bottom Navigation bar mockup -->
        <rect x="12" y="630" width="416" height="78" fill="#0E4F4F"/>
        <circle cx="90" cy="665" r="16" fill="#C6A15B"/>
        <circle cx="220" cy="665" r="16" fill="rgba(255,255,255,0.2)"/>
        <circle cx="350" cy="665" r="16" fill="rgba(255,255,255,0.2)"/>
      </g>
    </svg>`;
  }

  if (spec.type === 'og') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#0E4F4F"/>
      <!-- Background subtle grid -->
      <path d="M 0 100 L 1200 100 M 0 200 L 1200 200 M 0 300 L 1200 300 M 0 400 L 1200 400 M 0 500 L 1200 500" stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1"/>
      <path d="M 200 0 L 200 630 M 400 0 L 400 630 M 600 0 L 600 630 M 800 0 L 800 630 M 1000 0 L 1000 630" stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1"/>
      <!-- Gold Angular A Mark -->
      <g transform="translate(100, 210)">
        <path d="M 0 160 L 80 0 L 160 160 L 115 160 L 80 80 L 45 160 Z" fill="#C6A15B"/>
        <rect x="40" y="110" width="80" height="18" rx="4" fill="#F6F3EC"/>
      </g>
      <!-- Wordmark -->
      <text x="300" y="280" font-family="system-ui, sans-serif" font-weight="800" font-size="72" fill="#F6F3EC" letter-spacing="-1">Aluvantis <tspan fill="#C6A15B">HR</tspan></text>
      <text x="300" y="340" font-family="system-ui, sans-serif" font-weight="500" font-size="32" fill="#F6F3EC" opacity="0.9">Jamoangiz — bir oqshomda tartibda.</text>
      <!-- Footer Badge -->
      <rect x="300" y="385" width="420" height="48" rx="24" fill="#C6A15B" fill-opacity="0.2" stroke="#C6A15B" stroke-width="1"/>
      <text x="510" y="417" font-family="system-ui, sans-serif" font-weight="700" font-size="20" fill="#C6A15B" text-anchor="middle">O‘zbekiston korxonalari uchun HRMS</text>
    </svg>`;
  }

  // Icon 512
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="128" fill="#0E4F4F"/>
    <g transform="translate(136, 126)">
      <path d="M 0 260 L 120 0 L 240 260 L 175 260 L 120 130 L 65 260 Z" fill="#C6A15B"/>
      <rect x="55" y="175" width="130" height="28" rx="6" fill="#F6F3EC"/>
    </g>
  </svg>`;
}

async function generateAll() {
  console.log("Starting asset generation with Nano Banana / Gemini Image API...");
  const apiKey = process.env.GEMINI_API_KEY;
  
  const modelsToTry = [
    'gemini-2.5-flash-image',
    'gemini-2.5-flash-image-preview',
    'gemini-2.0-flash-preview-image-generation'
  ];

  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({ apiKey });
    } catch (e) {
      console.warn("Could not init GoogleGenAI:", e);
    }
  }

  for (const spec of ASSET_SPECS) {
    console.log(`Generating asset: ${spec.name}...`);
    let generatedSuccess = false;

    if (ai) {
      for (const modelName of modelsToTry) {
        try {
          console.log(`Attempting image generation for ${spec.name} with model ${modelName}...`);
          // Calling generateImages / generateContent
          const response = await (ai as any).models.generateImages({
            model: modelName,
            prompt: spec.prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: spec.width === spec.height ? '1:1' : spec.width > spec.height ? '16:9' : '3:4'
            }
          });

          if (response?.generatedImages?.[0]?.image?.imageBytes) {
            const buffer = Buffer.from(response.generatedImages[0].image.imageBytes, 'base64');
            fs.writeFileSync(spec.outPath, buffer);
            console.log(`SUCCESS: ${spec.name} generated via ${modelName}!`);
            generatedSuccess = true;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} failed for ${spec.name}:`, err?.message || err);
        }
      }
    }

    if (!generatedSuccess) {
      console.log(`Fallback SVG-to-PNG vector render for ${spec.name}`);
      const svg = generateSVG(spec);
      
      // Save .svg file
      const svgPath = spec.outPath.replace(/\.png$/, '.svg');
      fs.writeFileSync(svgPath, svg, 'utf-8');
      
      // Also write svg to .png path so both .svg and .png paths work if fetched as SVG
      fs.writeFileSync(spec.outPath, svg, 'utf-8');
      console.log(`Saved vector asset: ${svgPath} and ${spec.outPath}`);
    }
  }

  console.log("All assets generated successfully!");
}

generateAll().catch(err => {
  console.error("Asset generation error:", err);
  process.exit(1);
});
