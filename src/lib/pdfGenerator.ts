import { jsPDF } from 'jspdf';
import { PayrollRecord, Employee, Company } from '../types';
import { formatUZS } from './uzbekistanHrmsCalculations';

export function generatePayslipPdf(
  arg1: any,
  arg2: any,
  arg3: any
) {
  let record: PayrollRecord;
  let employee: Employee;
  let company: Company;

  if (arg1 && 'gross_salary' in arg1) {
    record = arg1;
    employee = arg2;
    company = arg3;
  } else {
    company = arg1;
    employee = arg2;
    record = arg3;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Background accent header
  doc.setFillColor(14, 79, 79); // #0E4F4F
  doc.rect(0, 0, 210, 36, 'F');

  // Title
  doc.setTextColor(246, 243, 236); // #F6F3EC
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('HISOB-KITOB VARAQASI (PAYSLIP)', 20, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Davr: ${record.year}-yil, ${record.month}-oy | O'zbekiston Respublikasi Mehnat Kodeksi`, 20, 26);

  // Gold accent line
  doc.setDrawColor(198, 161, 91); // #C6A15B
  doc.setLineWidth(1.5);
  doc.line(20, 32, 190, 32);

  // Company Details
  doc.setTextColor(20, 32, 31);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Tashkilot:', 20, 46);
  doc.setFont('helvetica', 'normal');
  doc.text(company.legal_name, 50, 46);

  doc.setFont('helvetica', 'bold');
  doc.text('INN:', 20, 52);
  doc.setFont('helvetica', 'normal');
  doc.text(company.tax_id, 50, 52);

  doc.setFont('helvetica', 'bold');
  doc.text('Manzil:', 20, 58);
  doc.setFont('helvetica', 'normal');
  doc.text(company.address, 50, 58);

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(20, 64, 190, 64);

  // Employee Information
  doc.setFont('helvetica', 'bold');
  doc.text('Xodim:', 20, 72);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.full_name, 50, 72);

  doc.setFont('helvetica', 'bold');
  doc.text('Lavozim:', 20, 78);
  doc.setFont('helvetica', 'normal');
  doc.text(`${employee.position} (${employee.department})`, 50, 78);

  doc.setFont('helvetica', 'bold');
  doc.text('PINFL / INN:', 20, 84);
  doc.setFont('helvetica', 'normal');
  doc.text(`${employee.pinfl} / ${employee.inn}`, 50, 84);

  doc.setFont('helvetica', 'bold');
  doc.text('Bank hisob raqami:', 20, 90);
  doc.setFont('helvetica', 'normal');
  doc.text(`${employee.bank_account} (${employee.bank_name})`, 60, 90);

  // Salary Table Box
  doc.setFillColor(246, 243, 236);
  doc.roundedRect(20, 98, 170, 90, 3, 3, 'F');
  doc.setDrawColor(14, 79, 79);
  doc.roundedRect(20, 98, 170, 90, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(14, 79, 79);
  doc.text('DAROMADLAR VA USHLANMALAR TAFSILOTI', 26, 108);

  let y = 118;
  doc.setFontSize(10);
  doc.setTextColor(20, 32, 31);

  const addRow = (label: string, value: string, isBold = false, isNegative = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    if (isNegative) doc.setTextColor(214, 69, 69);
    else if (isBold) doc.setTextColor(14, 79, 79);
    else doc.setTextColor(20, 32, 31);

    doc.text(label, 26, y);
    doc.text(value, 184, y, { align: 'right' });
    y += 8;
  };

  addRow('Bazaviy oklad (Base salary):', formatUZS(record.base_salary));
  if (record.bonuses > 0) addRow('Mukofot puli (Bonuses):', formatUZS(record.bonuses));
  if (record.overtime_pay > 0) addRow('Qo‘shimcha ish soatlari (Overtime):', formatUZS(record.overtime_pay));
  if (record.allowances > 0) addRow('Ustama to‘lovlar (Allowances):', formatUZS(record.allowances));

  addRow('JAMI HISOBLANGAN DAROMAD (Gross):', formatUZS(record.gross_salary), true);

  y += 2;
  doc.setDrawColor(200, 200, 200);
  doc.line(26, y - 4, 184, y - 4);

  addRow('JShDS solig‘i (12%):', `-${formatUZS(record.tax_jshds)}`, false, true);
  addRow('Shaxsiy INPS badali (0.1%):', `-${formatUZS(record.tax_pension_employee)}`, false, true);
  addRow('Ish beruvchi ijtimoiy solig‘i (12%):', `${formatUZS(record.tax_social)} (Korxona hisobidan)`, false);

  // Net Disbursed Box
  doc.setFillColor(14, 79, 79);
  doc.roundedRect(20, 196, 170, 22, 3, 3, 'F');
  doc.setTextColor(246, 243, 236);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('QO‘LGA TEGADIGAN SOF ISH HAQI (Net Pay):', 26, 210);
  doc.setTextColor(198, 161, 91); // Gold
  doc.text(formatUZS(record.net_salary), 184, 210, { align: 'right' });

  // Verification & Signatures
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Ushbu hujjat «Aluvantis HRMS» avtomatlashtirilgan tizimida shakllantirilgan va E-IMZO bilan tasdiqlangan.', 20, 234);
  doc.text(`Elektron hujjat raqami: ALV-${record.year}${String(record.month).padStart(2, '0')}-${record.id} | Holati: ${record.status.toUpperCase()}`, 20, 240);

  doc.setDrawColor(198, 161, 91);
  doc.setLineWidth(0.5);
  doc.line(20, 260, 80, 260);
  doc.text('Bosh hisobchi imzosi: ______________', 20, 266);

  doc.line(130, 260, 190, 260);
  doc.text('Xodim tanishdi: ______________', 130, 266);

  // Save PDF
  doc.save(`Aluvantis_Payslip_${employee.full_name.replace(/\s+/g, '_')}_${record.year}_${record.month}.pdf`);
}
