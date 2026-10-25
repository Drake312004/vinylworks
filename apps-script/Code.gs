/**
 * VINYL WORKS · FORGED  →  Order Form 2026 (Google Sheet)
 * Receives "Confirm" posts from the app and appends a row to the tab
 * "CONFIRMED QUOTES" (created automatically if missing).
 * Bind this script to the Order Form 2026 spreadsheet (Extensions > Apps Script).
 */
const TOKEN = 'CHANGE-ME-to-a-long-secret';   // must match the Token in the app's Settings
const TAB = 'CONFIRMED QUOTES';
const HEADERS = ['TIMESTAMP', 'QUOTE NO.', 'INVOICE', 'CUSTOMER NAME', 'CUSTOMER CONTACT',
  'ITEMS', 'SIZE', 'VINYL', 'INSTALLATION', 'SUBTOTAL', 'DEPOSIT', 'CLIENT PRICE',
  'BALANCE', 'TERMS', 'PAYMENT METHOD', 'STATUS',
  'COMPANY', 'PHONE', 'BILLING STREET', 'BILLING CITY', 'BILLING PROVINCE', 'BILLING POSTAL CODE',
  'SERVICE ADDRESS', 'CLIENT PO / REF', 'CLIENT GST/QST / NEQ', 'NOTES'];

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!TOKEN || d.token !== TOKEN) return out_({ ok: false, error: 'bad token' });
    if (d.action === 'jobDone') return out_(jobDone_(d));
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sh = sheet_();
      const ts = d.timestamp ? new Date(d.timestamp) : new Date();
      const sub = num_(d.subtotal) + num_(d.labour);
      sh.appendRow([ts, str_(d.quoteNo), str_(d.invoiceNo), str_(d.customer), str_(d.contact),
        str_(d.items), str_(d.size), str_(d.vinyl), str_(d.install), sub, num_(d.deposit),
        num_(d.total), num_(d.balance), str_(d.terms), str_(d.payment), str_(d.status || 'CONFIRMED'),
        str_(d.company), str_(d.phone), str_(d.billingStreet), str_(d.billingCity), str_(d.billingProvince),
        str_(d.billingPostal), str_(d.serviceAddress), str_(d.po), str_(d.clientTaxNo), str_(d.notes)]);
      const r = sh.getLastRow();
      sh.getRange(r, 1).setNumberFormat('yyyy-mm-dd hh:mm');
      sh.getRange(r, 10, 1, 4).setNumberFormat('$#,##0.00');
    } finally { lock.releaseLock(); }
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

// ---- COMPLETED & PAID: email the PDF, save it to Drive, log it ----
const MAIL_TO = 'forgedgraphicdesign@gmail.com';
const FOLDER = 'Forged Invoices 2026';
const JOB_TAB = 'COMPLETED JOBS';
const JOB_HEADERS = ['INVOICE NO.', 'INVOICE DATE', 'COMPLETED DATE', 'PAID DATE', 'CLIENT', 'TOTAL',
  'DEPOSIT', 'BALANCE', 'TERMS', 'PAYMENT METHOD', 'PAID', 'PDF LINK', 'UPDATED'];

function jobDone_(d) {
  const fn = String(d.filename || (d.invoiceNo || 'invoice') + '.pdf').replace(/[\\/:*?"<>|]/g, '_');
  const blob = Utilities.newBlob(Utilities.base64Decode(String(d.pdfBase64 || '')), 'application/pdf', fn);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const it = DriveApp.getFoldersByName(FOLDER);
    const folder = it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER);
    const old = folder.getFilesByName(fn);
    while (old.hasNext()) old.next().setTrashed(true);   // replace an older copy of the same invoice
    const file = folder.createFile(blob);
    MailApp.sendEmail({ to: MAIL_TO, subject: String(d.subject || 'JOB COMPLETED & PAID'),
      body: String(d.body || '') + '\n\nPDF in Drive: ' + file.getUrl(), attachments: [blob], name: 'VINYL WORKS' });
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(JOB_TAB);
    if (!sh) {
      sh = ss.insertSheet(JOB_TAB);
      sh.getRange(1, 1, 1, JOB_HEADERS.length).setValues([JOB_HEADERS]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
    const row = [str_(d.invoiceNo), str_(d.invoiceDate), str_(d.completedDate), str_(d.paidDate), str_(d.client),
      num_(d.total), num_(d.deposit), num_(d.balance), str_(d.terms), str_(d.method), str_(d.paid || 'YES'),
      file.getUrl(), new Date()];
    const n = sh.getLastRow();
    const nos = n > 1 ? sh.getRange(2, 1, n - 1, 1).getValues().map(r => String(r[0])) : [];
    const i = nos.indexOf(String(d.invoiceNo));
    const r = i >= 0 ? i + 2 : n + 1;
    sh.getRange(r, 1, 1, row.length).setValues([row]);
    sh.getRange(r, 6, 1, 3).setNumberFormat('$#,##0.00');
    sh.getRange(r, 13).setNumberFormat('yyyy-mm-dd hh:mm');
    return { ok: true, url: file.getUrl() };
  } finally { lock.releaseLock(); }
}

/** Run once from the editor: asks for Gmail/Drive permission and sends a test email. */
function testJobDone() {
  const pdf = Utilities.newBlob('%PDF-1.1\n%test\n', 'application/pdf').getBytes();
  Logger.log(JSON.stringify(jobDone_({ invoiceNo: 'KPI-TEST', subject: 'JOB COMPLETED & PAID - KPI-TEST - TEST - $0.00',
    body: 'Test, delete me', pdfBase64: Utilities.base64Encode(pdf), filename: 'KPI-TEST.pdf', client: 'TEST', paid: 'YES' })));
}

function doGet() { return out_({ ok: true, service: 'VINYL WORKS confirm hook' }); }

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(TAB);
  if (!sh) {
    sh = ss.insertSheet(TAB);
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
  } else if (sh.getLastColumn() < HEADERS.length) {
    // older tab (16 columns): add the new client-detail headers on the right
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  }
  return sh;
}
const num_ = v => (isFinite(+v) ? +v : 0);
const str_ = v => (v == null ? '' : String(v).slice(0, 500)).replace(/^[=+\-@]/, "'$&");
const out_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

/** Run once from the editor to test (creates the tab and a TEST row you can delete). */
function testInsert() {
  doPost({ postData: { contents: JSON.stringify({ token: TOKEN, quoteNo: 'Q-TEST', customer: 'TEST – delete me', total: 0, status: 'TEST' }) } });
}
