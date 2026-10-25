# Connect "Confirm" to your Order Form 2026 sheet (about 5 min, one time)

1. Open **Order Form 2026** in Google Sheets.
2. **Extensions → Apps Script**. Delete whatever is in `Code.gs` and paste everything from `Code.gs` (this folder).
3. On the line `const TOKEN = 'CHANGE-ME-to-a-long-secret';` replace the text between quotes with your own secret (e.g. `forged-7Hq2-vinyl-93kd`). Click **Save** (💾).
4. Optional test: pick `testInsert` in the function menu → **Run** → allow access (Advanced → Go to project → Allow). A tab **CONFIRMED QUOTES** appears with a TEST row — delete that row.
5. **Deploy → New deployment** → gear ⚙️ → **Web app**.
   - Description: `VINYL WORKS confirm`
   - **Execute as: Me**
   - **Who has access: Anyone**
   - **Deploy** → authorize if asked → **copy the Web app URL** (ends in `/exec`).
6. In the VINYL WORKS app: **Rapide / Quick** tab → **⚙️ Réglages / Settings** → paste the URL and the same token → **Save**.
7. Do a quote and tap **✅ Confirm** — a row appears in CONFIRMED QUOTES.

Notes
- The app can't read the sheet's reply (browser rule), so it shows "sent" once the request goes out. If no row appears, check the token and that access is **Anyone**.
- Every confirm is also kept on the phone under **Confirmés / Confirmed**, even with no internet or no URL set.
- If you edit the script later: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy** (the URL stays the same).
- Your existing tabs (OCT 2026, VINYL PRICES) are never touched.
