# Connect VINYL WORKS to Google (about 10 min, one time)

This turns on two buttons:
- **✅ Confirm** (Quick tab): adds a row to **CONFIRMED QUOTES**.
- **✅ COMPLETED & PAID** (on a reopened invoice): emails the invoice PDF to forgedgraphicdesign@gmail.com, saves the PDF in the Drive folder **Forged Invoices 2026**, and adds or updates a row in **COMPLETED JOBS**.

1. On your computer, sign in to Google as **forgedgraphicdesign@gmail.com**. You need to own the sheet, so do the ownership transfer first.
2. Open **Order Form 2026** → **Extensions → Apps Script**.
3. Delete everything in `Code.gs` and paste everything from `Code.gs` (this folder).
4. Find `const TOKEN = 'CHANGE-ME-to-a-long-secret';`. Replace the text between the quotes with your own secret (e.g. `forged-7Hq2-vinyl-93kd`) → **Save** 💾.
5. **Authorize (important):** pick `testJobDone` in the function menu → **Run**.
   - Google asks for permission → **Review permissions** → choose forgedgraphicdesign@gmail.com.
   - "Google hasn't verified this app" → **Advanced → Go to (project) (unsafe)** → **Allow**. This is your own script. It asks to **send email as you**, **see and create Drive files**, and **edit your spreadsheets**.
   - You get a test email "JOB COMPLETED & PAID - KPI-TEST…", a **Forged Invoices 2026** folder with KPI-TEST.pdf, and a **COMPLETED JOBS** tab with a test row. Delete the test row and the file.
6. **Deploy → New deployment** → gear ⚙️ → **Web app**.
   - **Execute as: Me**
   - **Who has access: Anyone**
   - **Deploy** → copy the **Web app URL** (ends in `/exec`).
7. In the app: **Quick** tab → **⚙️ Settings** → paste the URL and the same token → **Save**.
8. Test: save an invoice → **🧾 Invoices** → Open → **✅ COMPLETED & PAID**. You should get the email with the PDF.

Notes
- The app can't read Google's reply (browser rule), so "Sent" means the request went out. If no email arrives, check the token, and that access is **Anyone**.
- If the URL isn't set or there's no internet, the app falls back to the share sheet or email (send it yourself).
- If you edit the script later: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy** (the URL stays the same).
- Your other tabs (OCT 2026, VINYL PRICES) are never touched.
