import React, { useState } from 'react';
import {
  FileText,
  FileCheck2,
  Download,
  Printer,
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  Eye,
  KeyRound,
  X,
  Building,
} from 'lucide-react';
import { HRDocument, Employee, Company, DocumentType } from '../types';
import { generateEImzoSignature } from '../lib/uzbekistanHrmsCalculations';

interface DocumentsPageProps {
  company: Company;
  documents: HRDocument[];
  employees: Employee[];
  onAddDocument: (doc: HRDocument) => void;
  onSignDocument: (docId: number, signatureHash: string) => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  company,
  documents,
  employees,
  onAddDocument,
  onSignDocument,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<HRDocument | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signingSuccess, setSigningSuccess] = useState(false);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);

  // New Document Form
  const [newDocType, setNewDocType] = useState<DocumentType>('contract');
  const [newDocTitle, setNewDocTitle] = useState('Mehnat shartnomasi №24-MK');
  const [newDocEmpId, setNewDocEmpId] = useState<number>(employees[0]?.id || 1);

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: HRDocument = {
      id: Date.now(),
      company_id: company.id,
      employee_id: Number(newDocEmpId),
      document_type: newDocType,
      type: newDocType,
      title: newDocTitle,
      file_url: `/docs/${newDocType}_${Date.now()}.pdf`,
      status: 'draft',
      created_at: new Date().toISOString(),
    };
    onAddDocument(newDoc);
    setIsNewDocModalOpen(false);
  };

  const handlePerformEImzoSign = (doc: HRDocument) => {
    setIsSigning(true);
    setTimeout(() => {
      const eimzo = generateEImzoSignature(
        company.legal_name,
        company.tax_id,
        'Yusupova Nilufar (Bosh hisobchi)'
      );
      onSignDocument(doc.id, eimzo.signature);
      setIsSigning(false);
      setSigningSuccess(true);
      if (selectedDoc?.id === doc.id) {
        setSelectedDoc({
          ...doc,
          status: 'signed',
          signedWithEimzo: true,
          eimzoSignatureHash: eimzo.signature,
          eimzoSignerName: eimzo.signerName,
          eimzoTimestamp: eimzo.timestamp,
        });
      }
      setTimeout(() => setSigningSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0E4F4F]">
            Kadrlar hujjatlari va E-IMZO
          </h2>
          <p className="text-xs text-gray-500">
            O‘zbekiston Respublikasi elektron raqamli imzo (E-IMZO) orqali yuridik kuchga ega shartnomalar
          </p>
        </div>

        <button
          onClick={() => setIsNewDocModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0E4F4F] text-white hover:bg-[#093535] shadow-xs active:scale-95 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi hujjat yaratish</span>
        </button>
      </div>

      {signingSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Hujjat E-IMZO kaliti bilan muvaffaqiyatli imzolandi! Davlat reestriga kiritildi.
          </span>
        </div>
      )}

      {/* Templates Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="aluvantis-card p-4 border-[#0E4F4F]/20 space-y-2">
          <div className="flex items-center gap-2 text-[#0E4F4F] font-bold text-xs">
            <FileCheck2 className="w-4 h-4 text-[#C6A15B]" />
            <span>Mehnat shartnomasi (Yangi MK)</span>
          </div>
          <p className="text-[11px] text-gray-500">
            2023-yil 30-aprelda kuchga kirgan Mehnat kodeksiga to‘liq mos keluvchi rasmiy andoza.
          </p>
        </div>

        <div className="aluvantis-card p-4 border-[#0E4F4F]/20 space-y-2">
          <div className="flex items-center gap-2 text-[#0E4F4F] font-bold text-xs">
            <FileText className="w-4 h-4 text-[#C6A15B]" />
            <span>Ishga qabul qilish buyrug‘i</span>
          </div>
          <p className="text-[11px] text-gray-500">
            Oklad, sinov muddati va bo‘lim biriktirish bilan T-1 shaklidagi rasmiy buyruq.
          </p>
        </div>

        <div className="aluvantis-card p-4 border-[#0E4F4F]/20 space-y-2">
          <div className="flex items-center gap-2 text-[#0E4F4F] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
            <span>Moddiy javobgarlik shartnomasi</span>
          </div>
          <p className="text-[11px] text-gray-500">
            Kassir, omborchi va moddiy qiymatdor xodimlar uchun to‘liq javobgarlik akti.
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="aluvantis-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
            Mavjud kadrlar hujjatlari ro‘yxati
          </h3>
          <span className="text-xs text-gray-400">{documents.length} ta hujjat</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <th className="p-3">Hujjat nomi</th>
                <th className="p-3">Xodim</th>
                <th className="p-3">Hujjat turi</th>
                <th className="p-3">Holati</th>
                <th className="p-3">E-IMZO xeshi</th>
                <th className="p-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => {
                const emp = employees.find((e) => e.id === doc.employee_id);
                return (
                  <tr key={doc.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-3 font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0E4F4F] shrink-0" />
                      <span>{doc.title}</span>
                    </td>

                    <td className="p-3 font-medium text-gray-800">
                      {emp?.full_name || 'Barcha xodimlar'}
                    </td>

                    <td className="p-3 capitalize text-gray-600">
                      {doc.type}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          doc.status === 'signed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status === 'signed' ? 'E-IMZO Tasdiqlangan' : 'Qoralama'}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-[10px] text-gray-500 max-w-xs truncate">
                      {doc.eimzoSignatureHash ? (
                        <span className="text-emerald-700 font-semibold">
                          {doc.eimzoSignatureHash.slice(0, 16)}...
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#0E4F4F] hover:text-white transition text-gray-600"
                          title="Ko‘rish"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {doc.status !== 'signed' && (
                          <button
                            onClick={() => handlePerformEImzoSign(doc)}
                            disabled={isSigning}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0E4F4F] text-white text-[10px] font-semibold hover:bg-[#093535]"
                          >
                            <KeyRound className="w-3 h-3 text-[#C6A15B]" />
                            <span>E-IMZO</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Drawer / Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-[#0E4F4F]/10 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#0E4F4F] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base">{selectedDoc.title}</h3>
                <p className="text-xs text-white/70">O‘zbekiston Respublikasi Mehnat qonunchiligi hujjati</p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Body */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4 font-serif text-gray-800 leading-relaxed bg-[#F6F3EC]/30">
              <div className="text-center space-y-1 pb-4 border-b border-gray-300">
                <h4 className="font-bold text-sm tracking-wide uppercase font-display text-[#0E4F4F]">
                  {company.legal_name}
                </h4>
                <p className="text-[11px] font-sans text-gray-600">
                  STIR (INN): {company.tax_id} | Manzil: {company.address}
                </p>
                <h5 className="font-bold text-xs pt-2 uppercase text-gray-900 font-sans">
                  {selectedDoc.title}
                </h5>
                <p className="text-[10px] font-sans text-gray-400">Toshkent shahri • 2026-yil</p>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <p>
                  <strong>1. Umumiy qoidalar:</strong> Ushbu hujjat O‘zbekiston Respublikasining 2022-yil
                  28-oktabrdagi O‘RQ-798-sonli qonuni bilan tasdiqlangan Mehnat kodeksiga muvofiq
                  ish beruvchi «{company.name}» va xodim o‘rtasida tuzildi.
                </p>
                <p>
                  <strong>2. Mehnat sharoitlari:</strong> Haftalik ish vaqti davomiyligi 40 soatdan
                  oshmasligi, yillik asosiy mehnat ta’tili kamida 21 kalendar kunidan iborat bo‘lishi
                  belgilandi.
                </p>
                <p>
                  <strong>3. Mehnatga haq to‘lash:</strong> Xodimga oylik maosh O‘zbekiston so‘mida (UZS)
                  har oyning 5-sanasiga qadar bank kartasiga (Uzcard/Humo) to‘liq o‘tkaziladi.
                </p>
              </div>

              {/* Digital E-IMZO stamp */}
              {selectedDoc.eimzoSignatureHash ? (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500/40 text-emerald-900 space-y-1 font-sans">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>ELEKTRON RAQAMLI IMZO BILAN TASDIQLANGAN (E-IMZO)</span>
                  </div>
                  <p className="text-[11px]">
                    <strong>Imzolovchi:</strong> {selectedDoc.eimzoSignerName || 'Yusupova Nilufar (Bosh hisobchi)'}
                  </p>
                  <p className="text-[10px] font-mono text-emerald-700 break-all">
                    <strong>SHA-256 Xesh:</strong> {selectedDoc.eimzoSignatureHash}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Sana: {selectedDoc.eimzoTimestamp || '2026-09-19T10:00:00+05:00'} | Holati: Haqiqiy (Yuridik kuchga ega)
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-center justify-between font-sans">
                  <span>Ushbu hujjat hali E-IMZO bilan imzolanmagan.</span>
                  <button
                    onClick={() => handlePerformEImzoSign(selectedDoc)}
                    className="px-3 py-1 bg-[#0E4F4F] text-white rounded-lg text-xs font-semibold"
                  >
                    E-IMZO bilan imzolash
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Chop etish</span>
              </button>

              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0E4F4F] text-white"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Doc Modal */}
      {isNewDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-5 border border-[#0E4F4F]/10 space-y-4 text-xs">
            <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
              Yangi hujjat andozasini yaratish
            </h3>

            <form onSubmit={handleCreateDocument} className="space-y-3">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Hujjat nomi</label>
                <input
                  type="text"
                  required
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Turi</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                >
                  <option value="contract">Mehnat shartnomasi</option>
                  <option value="nda">Tijorat sirini saqlash (NDA)</option>
                  <option value="order">Ishga qabul qilish buyrug‘i</option>
                  <option value="policy">Kompaniya ichki mehnat tartib-qoidasi</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Xodim</label>
                <select
                  value={newDocEmpId}
                  onChange={(e) => setNewDocEmpId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.position})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewDocModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0E4F4F] text-white font-semibold"
                >
                  Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
