import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Bell,
  RefreshCw,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Employee, Company } from '../types';

interface TelegramBotPageProps {
  company: Company;
  employees: Employee[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  isAction?: boolean;
}

export const TelegramBotPage: React.FC<TelegramBotPageProps> = ({
  company,
  employees,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Assalomu alaykum! Men Aluvantis HR rasmiy botiman (@aluvantis_hrms_bot).\n\nHisobingizni ulash uchun telefon raqamingizni yuboring yoki quyidagi buyruqlardan foydalaning:\n/start - Boshlash\n/checkin - Davomatni qayd etish\n/status - Bugungi holat\n/leave - Ta’til so‘rash\n/payslip - Oxirgi oylik hisob-kitob varaqasi (PDF)\n/shifts - Kelgusi smenalarim',
      time: '09:00',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = '';
      const lower = query.toLowerCase();

      if (lower.startsWith('/start')) {
        botReply = `Xush kelibsiz! Siz «${company.name}» tizimida muvaffaqiyatli autentifikatsiyadan o‘tdingiz.\n\nSizning rolingiz: Xodim\nIsh joyi: Toshkent Bosh Ofisi\n/checkin yoki /status buyruqlarini yuboring.`;
      } else if (lower.startsWith('/checkin')) {
        botReply = `✅ Sizning kirishingiz qayd etildi!\n\n📍 Manzil: Toshkent Bosh Ofisi (41.311081, 69.240562)\n⏰ Vaqt: ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}\nHolati: O‘z vaqtida (Ontime)\n\nYaxshi ish kuni tilaymiz!`;
      } else if (lower.startsWith('/status')) {
        botReply = `📊 Bugungi davomat holatingiz:\n\n• Holat: Ishda (Present)\n• Kirish vaqti: 08:55\n• Smena: 09:00 - 18:00 (8 soat)\n• Qolgan vaqt: 4 soat 20 daqiqa`;
      } else if (lower.startsWith('/leave')) {
        botReply = `✈️ Yangi ta’til arizasi yaratish:\n\nSizda 17 kun yillik mehnat ta’tili qolgan.\nAriza berish uchun sanalarni ko‘rsating (Masalan: /leave 2026-09-25 2026-09-29 Yillik ta'til) yoki HR portal orqali yuboring.`;
      } else if (lower.startsWith('/payslip')) {
        botReply = `📄 2026-yil Sentabr oyi uchun hisob-kitob varaqangiz tayyor!\n\n• Gross oklad: 18,000,000 UZS\n• JShDS (12%): -2,160,000 UZS\n• INPS (0.1%): -18,000 UZS\n• Qo'lga tegadigan (Net): 15,822,000 UZS\n\nRasmiy QR-kodli PDF varaqangiz ilova qilindi.`;
      } else if (lower.startsWith('/shifts')) {
        botReply = `🗓 Kelgusi 3 kunlik ish jadvali:\n\n• 20-Sen (Yak): Dam olish\n• 21-Sen (Dush): 09:00 - 18:00 (Ertalabki)\n• 22-Sen (Sesh): 09:00 - 18:00 (Ertalabki)`;
      } else if (lower.startsWith('/admin')) {
        botReply = `📢 Boshqaruv xabarnomasi:\n\nBugun 8 nafar xodimdan 8 nafari ish joyida. 1 ta ta’til arizasi tasdiq kutilmoqda.`;
      } else {
        botReply = `Tushunarsiz buyruq. Quyidagi buyruqlardan birini tanlang:\n/checkin - Davomat\n/status - Holat\n/payslip - Hisob-kitob\n/shifts - Smenalar\n/leave - Ta’til`;
      }

      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0E4F4F]">
            Telegram Bot Integratsiyasi
          </h2>
          <p className="text-xs text-gray-500">
            Xodimlar va rahbarlar uchun qulay Telegram bot (@aluvantis_hrms_bot)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Webhook: Faol</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Config & Commands list */}
        <div className="space-y-4">
          <div className="aluvantis-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#0E4F4F] font-bold text-sm">
              <Bot className="w-4 h-4 text-[#C6A15B]" />
              <span>Bot sozlamalari</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-gray-500 text-[11px] block">Bot Foydalanuvchi nomi:</label>
                <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200 mt-0.5">
                  <span className="font-mono text-blue-600 font-semibold">@aluvantis_hrms_bot</span>
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-[11px] block">Telegram Bot Token:</label>
                <div className="p-2 rounded-xl bg-gray-50 border border-gray-200 mt-0.5 font-mono text-gray-600 text-[11px] truncate">
                  7189204851:AAFl-kR9qT_xYz92...
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-[11px] block">HR Bildirishnomalar kanali ID:</label>
                <div className="p-2 rounded-xl bg-gray-50 border border-gray-200 mt-0.5 font-mono text-gray-600 text-[11px]">
                  -1002938472910 (@aluvantis_hr_alerts)
                </div>
              </div>
            </div>
          </div>

          {/* Quick command buttons */}
          <div className="aluvantis-card p-5 space-y-3">
            <h4 className="font-bold text-xs text-[#0E4F4F]">Tezkor bot buyruqlari</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { cmd: '/start', label: 'Boshlash' },
                { cmd: '/checkin', label: 'Davomat' },
                { cmd: '/status', label: 'Bugungi holat' },
                { cmd: '/payslip', label: 'Hisob-kitob (PDF)' },
                { cmd: '/shifts', label: 'Smenalar' },
                { cmd: '/leave', label: 'Ta’til arizasi' },
              ].map((item) => (
                <button
                  key={item.cmd}
                  onClick={() => handleSendMessage(item.cmd)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-[#0E4F4F]/10 border border-gray-200 text-left transition"
                >
                  <p className="font-mono font-bold text-[#0E4F4F] text-[11px]">{item.cmd}</p>
                  <p className="text-[10px] text-gray-500">{item.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Interactive Telegram Chat Simulator */}
        <div className="lg:col-span-2 aluvantis-card p-0 overflow-hidden flex flex-col h-[600px] border-[#0E4F4F]/20 shadow-md">
          {/* Telegram Header */}
          <div className="bg-[#2AABEE] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#2AABEE] flex items-center justify-center font-bold">
                <Bot className="w-6 h-6 text-[#2AABEE]" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Aluvantis HR Bot</h3>
                <p className="text-[11px] text-white/80">bot • har doim online</p>
              </div>
            </div>
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
              O‘zbek tili
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFE7DE]/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md rounded-2xl p-3.5 text-xs shadow-xs space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-[#EEFFDE] text-gray-900 rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <span className="block text-[9px] text-gray-400 text-right">{msg.time}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-2 text-xs text-gray-400 rounded-bl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-200" />
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Xabar yoki buyruq yozing (masalan, /checkin)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-2 rounded-2xl bg-gray-100 border-none text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#2AABEE]"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-full bg-[#2AABEE] text-white hover:bg-[#2297d4] transition active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
