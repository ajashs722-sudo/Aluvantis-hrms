import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoStrokeDraw } from '../components/brand/LogoStrokeDraw';
import {
  Building,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { SweepButton } from '../components/ui/SweepButton';
import {
  decodeGoogleJwt,
  getGoogleClientId,
  GoogleUserProfile,
} from '../lib/googleAuth';

interface GoogleAuthPageProps {
  onBackToLanding: () => void;
  onAuthSuccess: (userData: {
    name: string;
    email: string;
    companyName?: string;
    picture?: string;
    role?: string;
  }) => void;
}

export const GoogleAuthPage: React.FC<GoogleAuthPageProps> = ({
  onBackToLanding,
  onAuthSuccess,
}) => {
  const [step, setStep] = useState<'signin' | 'wizard'>('signin');
  const [wizardMode, setWizardMode] = useState<'create' | 'join'>('create');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Authenticated Profile info
  const [userProfile, setUserProfile] = useState<GoogleUserProfile>({
    name: 'Dilnoza Karimova',
    email: 'dilnoza@aluvantis.uz',
    picture: '',
  });

  const [existingUser, setExistingUser] = useState<{
    name: string;
    email: string;
    companyName?: string;
    picture?: string;
    role?: string;
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('aluvantis_is_authenticated');
      const savedUserStr = localStorage.getItem('aluvantis_user');
      if (isAuth === 'true' && savedUserStr) {
        try {
          return JSON.parse(savedUserStr);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  // Wizard fields
  const [companyName, setCompanyName] = useState('«Aluvantis Technologies» MChJ');
  const [taxId, setTaxId] = useState('308912456');
  const [employeeCount, setEmployeeCount] = useState('25-50');
  const [inviteCode, setInviteCode] = useState('');

  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = getGoogleClientId();

    // Initialize Google Identity Services if client ID is configured
    if (typeof window !== 'undefined' && window.google?.accounts?.id && clientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              const decoded = decodeGoogleJwt(response.credential);
              if (decoded) {
                setUserProfile(decoded);
                setStep('wizard');
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnContainerRef.current) {
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: 320,
          });
        }
      } catch (err) {
        console.warn('Google GSI init:', err);
      }
    }
  }, [step]);

  const handleGoogleSignInClick = () => {
    setLoading(true);
    setToastMessage(null);

    const clientId = getGoogleClientId();

    if (typeof window !== 'undefined' && window.google?.accounts?.oauth2 && clientId) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (response) => {
            setLoading(false);
            if (response.error) {
              setToastMessage({
                type: 'error',
                text: `Google orqali kirishda xatolik yuz berdi: ${response.error}`,
              });
              return;
            }
            if (response.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${response.access_token}` },
                });
                if (res.ok) {
                  const googleUser = await res.json();
                  const profile: GoogleUserProfile = {
                    id: googleUser.sub,
                    name: googleUser.name || 'Google Foydalanuvchisi',
                    email: googleUser.email || '',
                    picture: googleUser.picture,
                  };
                  setUserProfile(profile);
                  setStep('wizard');
                  return;
                }
              } catch (e) {
                console.error(e);
              }
            }
          },
        });
        tokenClient.requestAccessToken();
        return;
      } catch (err) {
        console.warn('Google OAuth Token Client fallback:', err);
      }
    }

    // Direct access if Client ID is not configured yet
    setTimeout(() => {
      setLoading(false);
      const profile: GoogleUserProfile = {
        name: 'Dilnoza Karimova',
        email: 'dilnoza@aluvantis.uz',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      setUserProfile(profile);
      setStep('wizard');
    }, 450);
  };

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wizardMode === 'create' && !companyName.trim()) {
      setToastMessage({
        type: 'error',
        text: 'Iltimos, korxona nomini kiriting.',
      });
      return;
    }
    if (wizardMode === 'join' && !inviteCode.trim()) {
      setToastMessage({
        type: 'error',
        text: 'Iltimos, taklif kodini kiriting.',
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuthSuccess({
        name: userProfile.name || 'Dilnoza Karimova',
        email: userProfile.email || 'dilnoza@aluvantis.uz',
        companyName: wizardMode === 'create' ? companyName : 'O‘zbekiston Savdo Xoldingi',
        picture: userProfile.picture,
        role: 'admin',
      });
    }, 400);
  };

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 md:p-10 bg-gradient-to-br from-[#0E4F4F] via-[#14201F] to-[#0A3838] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#C6A15B]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] rounded-full bg-[#0E4F4F]/40 blur-[130px] pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/90 border border-white/20 backdrop-blur-xl shadow-md transition cursor-pointer z-30"
      >
        <span>← Bosh sahifa</span>
      </button>

      {/* Glass Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-18 right-6 z-50 flex items-center gap-3 p-4 rounded-2xl backdrop-blur-xl border shadow-2xl text-xs font-semibold max-w-sm ${
              toastMessage.type === 'error'
                ? 'bg-[#D64545]/90 text-white border-[#D64545]/40'
                : 'bg-emerald-900/90 text-emerald-100 border-emerald-500/40'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />
            )}
            <span className="flex-1 leading-snug">{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 rounded-md hover:bg-white/20 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-8 sm:my-12">
        {/* Left Column: Glass Card Auth */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl p-6 sm:p-8 md:p-10 rounded-[32px] border border-white/20 shadow-2xl space-y-6">
            {/* Logo */}
            <div className="flex justify-center text-center py-2">
              <img
                src="/brand-logo-transparent.png"
                alt="Aluvantis HR Logo"
                className="h-28 sm:h-32 w-auto object-contain drop-shadow-lg"
              />
            </div>

            {step === 'signin' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1.5">
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    {existingUser ? 'Xush kelibsiz!' : 'Tizimga kirish'}
                  </h1>
                  <p className="text-xs text-white/75 max-w-xs mx-auto leading-relaxed">
                    {existingUser
                      ? 'Sizning hisobingiz tizimda faol. Boshqaruv paneliga to‘g‘ridan-to‘g‘ri kirishingiz mumkin.'
                      : 'Xodimlarni boshqarish, davomat va soliq hisob-kitoblari tizimiga xavfsiz ulaning.'}
                  </p>
                </div>

                {existingUser ? (
                  <div className="space-y-4 pt-1">
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center space-y-2">
                      <div className="w-14 h-14 rounded-full mx-auto overflow-hidden ring-2 ring-[#C6A15B] shadow-lg">
                        <img
                          src={existingUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={existingUser.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-display font-bold text-white text-base">{existingUser.name}</p>
                        <p className="text-xs text-white/70">{existingUser.email}</p>
                        <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C6A15B] text-[#0E4F4F]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0E4F4F] animate-ping" />
                          Faol sessiya
                        </div>
                      </div>
                    </div>

                    <SweepButton
                      solid={true}
                      gold={true}
                      dir="left"
                      onClick={() => onAuthSuccess(existingUser)}
                      className="w-full justify-center min-h-[52px]"
                    >
                      <span>Dashboard’ga kirish →</span>
                    </SweepButton>

                    <div className="text-center pt-1">
                      <button
                        onClick={() => {
                          localStorage.removeItem('aluvantis_is_authenticated');
                          localStorage.removeItem('aluvantis_user');
                          setExistingUser(null);
                        }}
                        className="text-xs text-white/60 hover:text-white underline cursor-pointer transition"
                      >
                        Boshqa hisob orqali kirish (Chiqish)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex flex-col items-center gap-3">
                  <SweepButton
                    solid={true}
                    gold={true}
                    dir="left"
                    onClick={handleGoogleSignInClick}
                    disabled={loading}
                    className="w-full justify-center min-h-[52px]"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{loading ? 'Ulanmoqda...' : 'Google orqali kirish'}</span>
                  </SweepButton>

                  <div ref={googleBtnContainerRef} className="hidden" />
                </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: WIZARD & COMPANY SETUP */}
            {step === 'wizard' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* User Preview */}
                <div className="p-3 rounded-2xl bg-black/30 border border-white/15 flex items-center gap-3">
                  {userProfile.picture ? (
                    <img
                      src={userProfile.picture}
                      alt={userProfile.name}
                      className="w-10 h-10 rounded-full border border-[#C6A15B] object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#C6A15B] text-[#14201F] font-bold flex items-center justify-center text-sm">
                      {userProfile.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <span>{userProfile.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <div className="text-[11px] text-white/60 truncate">{userProfile.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('signin')}
                    className="text-[10px] text-[#C6A15B] hover:underline cursor-pointer"
                  >
                    O‘zgartirish
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <h2 className="font-display font-bold text-xl text-white">
                    Korxona sozlamasi
                  </h2>
                </div>

                <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/30 border border-white/10 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setWizardMode('create')}
                    className={`py-2.5 rounded-xl transition cursor-pointer ${
                      wizardMode === 'create'
                        ? 'bg-[#C6A15B] text-[#14201F] shadow-sm font-bold'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Yangi Korxona
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardMode('join')}
                    className={`py-2.5 rounded-xl transition cursor-pointer ${
                      wizardMode === 'join'
                        ? 'bg-[#C6A15B] text-[#14201F] shadow-sm font-bold'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Taklif Kodi
                  </button>
                </div>

                <form onSubmit={handleWizardSubmit} className="space-y-3.5">
                  {wizardMode === 'create' ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-[#C6A15B]" />
                          Korxona nomi
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="«Aluvantis Technologies» MChJ"
                          className="w-full px-4 py-2.5 rounded-xl bg-black/20 text-white placeholder-white/40 border border-white/20 text-xs focus:outline-none focus:border-[#C6A15B]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-white/80">
                            STIR (INN)
                          </label>
                          <input
                            type="text"
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value)}
                            placeholder="308912456"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 text-white placeholder-white/40 border border-white/20 text-xs focus:outline-none focus:border-[#C6A15B]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-white/80">
                            Xodimlar soni
                          </label>
                          <select
                            value={employeeCount}
                            onChange={(e) => setEmployeeCount(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-black/30 text-white border border-white/20 text-xs focus:outline-none focus:border-[#C6A15B]"
                          >
                            <option value="1-10" className="bg-[#14201F]">1 - 10 nafar</option>
                            <option value="10-25" className="bg-[#14201F]">10 - 25 nafar</option>
                            <option value="25-50" className="bg-[#14201F]">25 - 50 nafar</option>
                            <option value="50-250" className="bg-[#14201F]">50 - 250 nafar</option>
                            <option value="250+" className="bg-[#14201F]">250+ nafar</option>
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-[#C6A15B]" />
                        Taklif kodi (Invite Code)
                      </label>
                      <input
                        type="text"
                        required
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        placeholder="ALV-8942-UZ"
                        className="w-full px-4 py-3 rounded-xl bg-black/20 text-white placeholder-white/40 border border-white/20 text-xs uppercase font-mono focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>
                  )}

                  <div className="pt-2">
                    <SweepButton
                      solid={true}
                      gold={true}
                      dir="left"
                      type="submit"
                      disabled={loading}
                      className="w-full justify-center min-h-[50px]"
                    >
                      <div className="flex items-center gap-2">
                        <span>{loading ? 'Yuklanmoqda...' : 'HRMS Paneliga o‘tish'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </SweepButton>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>

        {/* Desktop Right Column: Clean Visuals */}
        <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-center relative">
          {/* Sticker s3 ("Telegram'da!") */}
          <motion.div
            initial={prefersReduced ? {} : { scale: 0, opacity: 0, rotate: -6 }}
            animate={prefersReduced ? {} : { scale: 1, opacity: 1, rotate: -6, y: [-4, 6, -4] }}
            transition={{
              scale: { type: 'spring', stiffness: 260, damping: 20 },
              y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute top-2 -left-6 z-20 pointer-events-none select-none drop-shadow-2xl"
          >
            <img src="/stickers/s3.svg" alt="Telegram'da!" className="w-36 h-auto" />
          </motion.div>

          {/* Sticker s6 ("Jamoa zo'r!") */}
          <motion.div
            initial={prefersReduced ? {} : { scale: 0, opacity: 0, rotate: 7 }}
            animate={prefersReduced ? {} : { scale: 1, opacity: 1, rotate: 7, y: [6, -4, 6] }}
            transition={{
              scale: { type: 'spring', stiffness: 260, damping: 20, delay: 0.15 },
              y: { duration: 4.1, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute -bottom-4 -right-4 z-20 pointer-events-none select-none drop-shadow-2xl"
          >
            <img src="/stickers/s6.svg" alt="Jamoa zo'r!" className="w-36 h-auto" />
          </motion.div>

          {/* Phone Mockup visual */}
          <div className="relative group">
            <img
              src="/hero-phone.svg"
              alt="Aluvantis HR Preview"
              className="w-[250px] h-auto -rotate-2 rounded-[32px] drop-shadow-2xl opacity-95 select-none pointer-events-none"
            />
            <div className="absolute inset-0 rounded-[32px] ring-1 ring-white/20 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
