# ⚔ Ability Game v2.0
*made by Kii Akira*

A full simulation game with AI-powered abilities, Minecraft pixel theme, 3D isometric mode, mobs, crafting, building, skin shop, and more.

## 🚀 Deploy to Render (Node.js Web Service)

1. Push all files to your GitHub repo (replace the old files)
2. Go to **render.com** → New → **Web Service** (NOT Static Site)
3. Connect your GitHub repo
4. Settings:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variable:
   - Key: `ANTHROPIC_API_KEY`  Value: your API key (optional — game works without it using local AI)
6. Click **Create Web Service**

## 🔑 Developer Account
- Username: `Kii`
- Password: `KiiAkira098`
- Unlocks: Dev Tools panel, background editor, set videos/images as background

## 🤖 AI Abilities
- With `ANTHROPIC_API_KEY`: Real AI parses ANY text, searches web for SCP entries, anime characters, game characters etc.
- Without API key: Local parser handles 30+ ability types automatically

## Features
- Minecraft pixel art theme throughout
- 2D and 3D isometric toggle
- 14 mob types (chicken, cow, shark, wolf, lion etc.)
- Building & crafting system
- Possess & control bots with joystick
- Global skin shop with pixel editor
- Disasters, weather, rules system
- Auto-save + persistent login
- Developer background editor
