# 🌟 Budzy – Slack Onboarding Bot

Budzy is a friendly Slack onboarding bot that says hi to new teammates, adds an app home, and replies to `/budzy`.

---

## 🚀 Quick Start

### 1️⃣ Deploy on Render
1. Go to [https://render.com](https://render.com) → click **New → Web Service**.
2. Connect your GitHub repo (this one!).
3. Keep defaults, then set:
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/healthz`
4. Add these Environment Variables (you’ll get them from Slack later):
   - `SLACK_BOT_TOKEN`
   - `SLACK_SIGNING_SECRET`

---

### 2️⃣ Create a Slack App
1. Go to [https://api.slack.com/apps](https://api.slack.com/apps).
2. Click **Create New App → From an app manifest**.
3. Choose your workspace, then paste in the `slack_app_manifest.yml` file (coming next).
4. Replace `https://YOUR-RENDER-DOMAIN` with your Render URL.
5. Click **Next → Create**.

---

### 3️⃣ Test Budzy
After your Render service finishes deploying:
- In Slack, open **Apps → Budzy** → Home tab says “Welcome to Budzy 👋”
- Type `/budzy` → Budzy replies ✅
- Invite or add a teammate → they get a DM ✅

---

**Made with ❤️ using [Bolt for JavaScript](https://slack.dev/bolt-js).**
