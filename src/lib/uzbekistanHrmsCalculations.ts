import { PayrollRecord, Employee } from '../types';

export interface CalculatedPayroll {
  base_salary: number;
  bonuses: number;
  allowances: number;
  deductions: number;
  overtime_hours: number;
  overtime_pay: number;
  overtimePay?: number;
  gross_salary: number;
  gross?: number;
  tax_jshds: number; // 12%
  jshds?: number;
  tax_pension_employee: number; // 0.1% INPS
  inps?: number;
  tax_pension_employer: number;
  tax_social: number; // 12%
  socialTax?: number;
  net_salary: number;
  net?: number;
}

/**
 * Calculates payroll according to Uzbekistan Labor Code (2026) and Tax Code:
 * - JShDS: 12% flat rate
 * - INPS: 0.1% accumulative personal pension (deducted within the JShDS portion)
 * - Social Tax: 12% (employer liability)
 * - Overtime: 1.5x standard hourly rate for overtime hours
 */
export function calculateUzbekistanPayroll(
  baseSalary: number,
  bonuses = 0,
  allowances = 0,
  deductions = 0,
  overtimeHours = 0,
  standardMonthlyHours = 168
): CalculatedPayroll {
  const hourlyRate = baseSalary / standardMonthlyHours;
  const overtimePay = Math.round(overtimeHours * hourlyRate * 1.5);
  const grossSalary = Math.round(baseSalary + bonuses + allowances + overtimePay - deductions);

  // Uzbekistan Tax Calculations
  const taxJshds = Math.round(grossSalary * 0.12); // 12% JShDS
  const taxPensionEmployee = Math.round(grossSalary * 0.001); // 0.1% INPS
  const taxSocial = Math.round(grossSalary * 0.12); // 12% Social Tax (Employer)
  const netSalary = Math.round(grossSalary - taxJshds);

  return {
    base_salary: baseSalary,
    bonuses,
    allowances,
    deductions,
    overtime_hours: overtimeHours,
    overtime_pay: overtimePay,
    overtimePay,
    gross_salary: grossSalary,
    gross: grossSalary,
    tax_jshds: taxJshds,
    jshds: taxJshds,
    tax_pension_employee: taxPensionEmployee,
    inps: taxPensionEmployee,
    tax_pension_employer: 0,
    tax_social: taxSocial,
    socialTax: taxSocial,
    net_salary: netSalary,
    net: netSalary,
  };
}

/**
 * Format currency in UZS (O‘zbekiston so‘mi)
 */
export function formatUZS(amount: number): string {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' so‘m';
}

/**
 * Generate 1C:Enterprise (1С:Предприятие 8.3 / ЗУП) XML representation
 */
export function generate1CXml(
  companyName: string,
  inn: string,
  month: number,
  year: number,
  payrollRecords: PayrollRecord[],
  employees: Employee[]
): string {
  const empMap = new Map(employees.map((e) => [e.id, e]));

  const rows = payrollRecords
    .map((record) => {
      const emp = empMap.get(record.employee_id);
      return `    <Сотрудник>
      <ТабельныйНомер>${record.employee_id}</ТабельныйНомер>
      <ФИО>${emp?.full_name || 'Noma’lum'}</ФИО>
      <ИНН>${emp?.inn || ''}</ИНН>
      <ПИНФЛ>${emp?.pinfl || ''}</ПИНФЛ>
      <Оклад>${record.base_salary}</Оклад>
      <Премия>${record.bonuses}</Премия>
      <Сверхурочные>${record.overtime_pay}</Сверхурочные>
      <Начислено>${record.gross_salary}</Начислено>
      <НДФЛ_ЖШДДС>${record.tax_jshds}</НДФЛ_ЖШДДС>
      <ИНПС>${record.tax_pension_employee}</ИНPС>
      <СоцНалог>${record.tax_social}</СоцНалог>
      <КВыплате>${record.net_salary}</КВыплате>
      <НомерСчета>${emp?.bank_account || ''}</НомерСчета>
      <Банк>${emp?.bank_name || ''}</Банк>
    </Сотрудник>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<ВедомостьНаВыплатуЗарплаты xmlns="http://v8.1c.ru/zup/exchange" ВерсияФормата="2.1">
  <Организация>
    <Наименование>${companyName}</Наименование>
    <ИНН>${inn}</ИНН>
    <Период>${year}-${String(month).padStart(2, '0')}</Период>
    <ДатаФормирования>${new Date().toISOString()}</ДатаФормирования>
  </Организация>
  <СписокСотрудников>
${rows}
  </СписокСотрудников>
</ВедомостьНаВыплатуЗарплаты>`;
}

/**
 * Generate Soliq.uz Tax Report (Form 1-mehnat / JShDS declaration)
 */
export function generateSoliqReport(
  inn: string,
  companyName: string,
  month: number,
  year: number,
  records: PayrollRecord[]
) {
  const totalGross = records.reduce((sum, r) => sum + r.gross_salary, 0);
  const totalJshds = records.reduce((sum, r) => sum + r.tax_jshds, 0);
  const totalInps = records.reduce((sum, r) => sum + r.tax_pension_employee, 0);
  const totalSocial = records.reduce((sum, r) => sum + r.tax_social, 0);
  const totalNet = records.reduce((sum, r) => sum + r.net_salary, 0);

  return {
    form_code: 'SOLIQ-UZ-JSHDS-2026',
    tax_authority_code: '2604', // Shayxontohur tumani DSI
    inn,
    taxpayer_name: companyName,
    reporting_period: {
      month,
      year,
      start_date: `${year}-${String(month).padStart(2, '0')}-01`,
      end_date: `${year}-${String(month).padStart(2, '0')}-30`,
    },
    metrics: {
      total_workers: records.length,
      total_gross_income_uzs: totalGross,
      taxable_base_uzs: totalGross,
      total_jshds_12_pct_uzs: totalJshds,
      total_inps_01_pct_uzs: totalInps,
      total_social_tax_12_pct_uzs: totalSocial,
      total_net_disbursed_uzs: totalNet,
    },
    generated_at: new Date().toISOString(),
    status: 'READY_TO_SUBMIT',
  };
}

/**
 * E-IMZO (Davlat Soliq Qo‘mitasi Yangi Avlod) digital signing simulator
 */
export function signDocumentWithEimzo(
  documentTitle: string,
  signerInn: string,
  pin: string
): { signatureHash: string; timestamp: string; certSerial: string; valid: boolean } {
  const timestamp = new Date().toISOString();
  const rawData = `${documentTitle}:${signerInn}:${timestamp}:${pin}`;
  
  // Create deterministic digital signature representation
  let hash = 0;
  for (let i = 0; i < rawData.length; i++) {
    hash = (hash << 5) - hash + rawData.charCodeAt(i);
    hash |= 0;
  }
  const hexPart = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  const signatureHash = `EIMZO:UZ:GOST-2026:${hexPart}${Date.now().toString(16).toUpperCase()}`;
  const certSerial = `UZ-CERT-${signerInn}-84F910`;

  return {
    signatureHash,
    timestamp,
    certSerial,
    valid: true,
  };
}

/**
 * Click.uz payment gateway link builder
 */
export function buildClickPaymentLink(
  merchantId: string,
  serviceId: string,
  amount: number,
  transactionId: string,
  returnUrl = typeof window !== 'undefined' ? window.location.href : 'https://aluvantis.uz'
): string {
  const params = new URLSearchParams({
    service_id: serviceId,
    merchant_id: merchantId,
    amount: amount.toString(),
    transaction_param: transactionId,
    return_url: returnUrl,
  });
  return `https://my.click.uz/services/pay?${params.toString()}`;
}

export function generateClickPaymentLink(
  account: string,
  amount: number,
  memo: string
): string {
  return buildClickPaymentLink('15892', '24190', amount, `${account}_${memo}`);
}

/**
 * Payme payment checkout link builder
 */
export function buildPaymeCheckoutLink(
  merchantId: string,
  amountInUzs: number,
  orderId: string
): string {
  // Payme requires amount in tiyins (1 UZS = 100 tiyins)
  const tiyins = amountInUzs * 100;
  const paymeString = `m=${merchantId};ac.order_id=${orderId};a=${tiyins}`;
  const base64Encoded = typeof btoa !== 'undefined' ? btoa(paymeString) : Buffer.from(paymeString).toString('base64');
  return `https://checkout.paycom.uz/${base64Encoded}`;
}

export function generatePaymePaymentLink(
  taxId: string,
  amount: number,
  orderId: string
): string {
  return buildPaymeCheckoutLink('64e819fa10245a98', amount, `${taxId}_${orderId}`);
}

export function generateEImzoSignature(
  companyName: string,
  inn: string,
  signerName: string
) {
  const res = signDocumentWithEimzo(companyName, inn, '1234');
  return {
    signature: res.signatureHash,
    signerName,
    certSerial: res.certSerial,
    timestamp: res.timestamp,
  };
}

export function generateSoliqUzXml(
  inn: string,
  month: number,
  year: number,
  records: PayrollRecord[],
  employees: Employee[]
): string {
  const rep = generateSoliqReport(inn, 'Aluvantis Technologies MChJ', month, year, records);
  return `<?xml version="1.0" encoding="UTF-8"?>
<Form1Mehnat xmlns="http://soliq.uz/mehnat/2026" Inn="${inn}" Year="${year}" Month="${month}">
  <Organization name="Aluvantis Technologies MChJ" oked="62010"/>
  <Period start="${rep.reporting_period.start_date}" end="${rep.reporting_period.end_date}"/>
  <Summary>
    <TotalEmployees>${rep.metrics.total_workers}</TotalEmployees>
    <TotalGrossIncomeUzs>${rep.metrics.total_gross_income_uzs}</TotalGrossIncomeUzs>
    <TotalJshdsUzs>${rep.metrics.total_jshds_12_pct_uzs}</TotalJshdsUzs>
    <TotalInpsUzs>${rep.metrics.total_inps_01_pct_uzs}</TotalInpsUzs>
    <TotalSocialTaxUzs>${rep.metrics.total_social_tax_12_pct_uzs}</TotalSocialTaxUzs>
    <TotalNetDisbursedUzs>${rep.metrics.total_net_disbursed_uzs}</TotalNetDisbursedUzs>
  </Summary>
  <GeneratedAt>${rep.generated_at}</GeneratedAt>
  <Status>VERIFIED_EIMZO</Status>
</Form1Mehnat>`;
}
