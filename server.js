const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── DATA DIRECTORY ──
const DATA = path.join(__dirname, 'data');
if (!fs.existsSync(DATA)) fs.mkdirSync(DATA);

function readJSON(file, def) {
  try { return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8')); } catch { return def; }
}
function writeJSON(file, data) {
  try { fs.writeFileSync(path.join(DATA, file), JSON.stringify(data)); } catch(e) { console.warn('Write fail:', e.message); }
}

let globalSkins = readJSON('skins.json', []);
let bgData = readJSON('background.json', { type: 'color', value: '#0a0a0a' });

// ── LOCAL ABILITY FALLBACK ──
const ABILITY_MAP = [
  { keys: ['teleport'], id: 'teleport', name: 'Teleportation', emoji: '🔮', effects: { teleport: true, cooldown: 8 } },
  { keys: ['speed', 'fast', 'swift', 'quick'], id: 'speed', name: 'Super Speed', emoji: '⚡', effects: { speedMult: 2.5 } },
  { keys: ['fly', 'float', 'hover', 'levitat', 'soar', 'wing'], id: 'fly', name: 'Flight', emoji: '🦋', effects: { canFly: true } },
  { keys: ['invisib', 'stealth', 'ghost', 'vanish', 'phantom'], id: 'invis', name: 'Invisibility', emoji: '👻', effects: { invisible: true } },
  { keys: ['shield', 'invincib', 'protect', 'armor', 'immune'], id: 'shield', name: 'Shield', emoji: '🛡', effects: { shielded: true } },
  { keys: ['fire', 'flame', 'burn', 'blaze', 'pyro', 'inferno'], id: 'fire', name: 'Fire Control', emoji: '🔥', effects: { element: 'fire', damageMult: 1.5 } },
  { keys: ['heal', 'regen', 'health restore'], id: 'heal', name: 'Healing', emoji: '💚', effects: { healRate: 5 } },
  { keys: ['giant', 'enlarge', 'titan', 'grow big'], id: 'giant', name: 'Giant Size', emoji: '🏔', effects: { sizeScale: 2.5 } },
  { keys: ['tiny', 'shrink', 'micro', 'miniatur'], id: 'tiny', name: 'Tiny Size', emoji: '🔬', effects: { sizeScale: 0.4 } },
  { keys: ['clone', 'duplicat', 'copy', 'mirror', 'split'], id: 'clone', name: 'Cloning', emoji: '👥', effects: { canClone: true } },
  { keys: ['freeze', 'ice', 'frost', 'cryo'], id: 'freeze', name: 'Ice Freeze', emoji: '❄', effects: { element: 'ice', canFreeze: true } },
  { keys: ['lightning', 'thunder', 'electric', 'bolt', 'shock'], id: 'lightning', name: 'Lightning', emoji: '⚡', effects: { element: 'lightning', damageMult: 1.8, range: 150 } },
  { keys: ['time stop', 'timestop', 'stop time', 'freeze time'], id: 'timestop', name: 'Time Stop', emoji: '⏱', effects: { canStopTime: true, cooldown: 30 } },
  { keys: ['mind control', 'hypno', 'control others'], id: 'mindctrl', name: 'Mind Control', emoji: '🧠', effects: { canControl: true } },
  { keys: ['strong', 'strength', 'mighty', 'muscl', 'brute'], id: 'strength', name: 'Super Strength', emoji: '💪', effects: { damageMult: 3, range: 80 } },
  { keys: ['super jump', 'high jump', 'leap', 'spring', 'bounce'], id: 'superjump', name: 'Super Jump', emoji: '🦘', effects: { jumpForce: 3 } },
  { keys: ['swim', 'aqua', 'mermaid', 'underwater'], id: 'swim', name: 'Aquatic', emoji: '🌊', effects: { canSwim: true, speedMult: 1.8 } },
  { keys: ['shadow', 'dark control', 'darkness', 'night vision'], id: 'shadow', name: 'Shadow Walk', emoji: '🌑', effects: { invisible: true, element: 'dark' } },
  { keys: ['poison', 'toxic', 'venom', 'acid'], id: 'poison', name: 'Poison', emoji: '☠', effects: { element: 'poison', poisonOnHit: true } },
  { keys: ['magnet', 'attract', 'magnetic', 'metal control'], id: 'magnet', name: 'Magnetism', emoji: '🧲', effects: { magnetic: true } },
  { keys: ['laser', 'beam', 'optic', 'eye blast'], id: 'laser', name: 'Laser Eyes', emoji: '👁', effects: { element: 'laser', damageMult: 2, range: 200 } },
  { keys: ['wind', 'air control', 'air bend', 'gust'], id: 'wind', name: 'Wind Control', emoji: '💨', effects: { element: 'wind', canFly: true } },
  { keys: ['earth', 'rock control', 'ground control'], id: 'earth', name: 'Earth Control', emoji: '🪨', effects: { element: 'earth', canSummonWalls: true } },
  { keys: ['telepathy', 'telepath', 'read mind'], id: 'telepathy', name: 'Telepathy', emoji: '🔮', effects: { telepathy: true, intelligence: 2 } },
  { keys: ['shapeshift', 'transform', 'morph', 'change form'], id: 'shapeshift', name: 'Shapeshifting', emoji: '🦎', effects: { shapeshift: true } },
  { keys: ['rage', 'berserk', 'power up', 'frenzy'], id: 'rage', name: 'Rage Mode', emoji: '😤', effects: { damageMult: 4, speedMult: 1.5, healRate: -1 } },
  { keys: ['summon', 'call allies', 'conjure', 'create'], id: 'summon', name: 'Summoning', emoji: '✨', effects: { canSummon: true, cooldown: 20 } },
  { keys: ['plant', 'nature', 'vine', 'flora'], id: 'nature', name: 'Nature Control', emoji: '🌿', effects: { element: 'nature', canGrow: true } },
  { keys: ['sonic', 'sound control', 'scream wave'], id: 'sonic', name: 'Sonic Scream', emoji: '📢', effects: { element: 'sound', range: 180, damageMult: 1.3 } },
  { keys: ['dragon', 'dragon power', 'breath'], id: 'dragon', name: 'Dragon Power', emoji: '🐉', effects: { element: 'fire', damageMult: 2.5, canFly: true, sizeScale: 1.5 } },
  { keys: ['portal', 'wormhole', 'dimension'], id: 'portal', name: 'Portal Creation', emoji: '🌀', effects: { teleport: true, cooldown: 3, canMakePortals: true } },
  { keys: ['immortal', 'undying', 'unkillable', 'revive'], id: 'immortal', name: 'Immortality', emoji: '♾', effects: { immortal: true } },
  { keys: ['gravity', 'zero g', 'weightless', 'float objects'], id: 'gravity', name: 'Gravity Control', emoji: '🌍', effects: { gravityCtrl: true, canFly: true } },
];

function localAbilityParse(text) {
  const lo = text.toLowerCase();
  const found = [];
  ABILITY_MAP.forEach(ab => {
    if (ab.keys.some(k => lo.includes(k)) && !found.find(f => f.id === ab.id))
      found.push({ ...ab });
  });
  if (found.length === 0) {
    text.split(/,|\band\b/i).map(s => s.trim()).filter(s => s.length > 1).forEach(p => {
      const c = p.replace(/[^a-zA-Z\s]/g, '').trim();
      if (c.length > 1)
        found.push({ id: 'c_' + c.slice(0, 14).replace(/\s/g, '_').toLowerCase(), name: c[0].toUpperCase() + c.slice(1), emoji: '✨', effects: { specialEffect: c } });
    });
  }
  return found;
}

function localBehaviorParse(text) {
  const lo = text.toLowerCase();
  let mood = 'neutral', aggression = 0.3, speed = 1.0, social = 0.5, intelligence = 0.5;
  const traits = [], special = [];
  if (/aggress|angry|hostile|violent|rage|mean/.test(lo)) { mood = 'aggressive'; aggression = 0.9; }
  else if (/friend|kind|nice|helpful|social/.test(lo)) { mood = 'friendly'; social = 0.9; }
  else if (/scared|shy|timid|afraid|fear/.test(lo)) { mood = 'scared'; aggression = 0.0; }
  else if (/lazy|tired|bored|loaf|slow/.test(lo)) { mood = 'lazy'; speed = 0.4; }
  else if (/curious|explore|wander|adventur/.test(lo)) { mood = 'curious'; intelligence = 0.8; }
  else if (/happy|cheer|joyful|playful/.test(lo)) { mood = 'happy'; social = 0.8; }
  else if (/sad|depress|unhappy|grief/.test(lo)) { mood = 'sad'; speed = 0.6; }
  else if (/random|chaotic|crazy|wild/.test(lo)) { mood = 'chaotic'; }
  if (/hunger|always eat|food/.test(lo)) { traits.push('hungry'); special.push('always seeking food'); }
  if (/sprint|rush|hurry|fast/.test(lo)) { traits.push('sprinter'); speed = 1.5; }
  if (/leader|boss|chief/.test(lo)) { traits.push('leader'); intelligence = 0.9; }
  if (/build|construct|craft/.test(lo)) { traits.push('builder'); }
  if (/fight|warrior|combat/.test(lo)) { traits.push('fighter'); aggression = 0.7; }
  return { mood, aggression, speed, social, intelligence, traits, description: text, special };
}

// ── AI ENDPOINT ──
app.post('/api/ai', async (req, res) => {
  const { prompt, type = 'ability' } = req.body;
  if (!prompt || !prompt.trim()) {
    return res.json({ result: type === 'ability' ? [] : localBehaviorParse(''), fallback: true });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log('No API key — using local parser');
    return res.json({ result: type === 'ability' ? localAbilityParse(prompt) : localBehaviorParse(prompt), fallback: true });
  }

  const systems = {
    ability: `You are "AbilityAI" — the intelligence engine for "Ability Game", a simulation game where bots have abilities.
Your job: Read ANY input and create game-ready abilities. You MUST use web_search for:
- SCP entries (SCP-173 = can't move when observed + neck snap; SCP-096 = extreme speed when face seen; etc.)
- Anime characters (Goku = ki blast + flight + zenkai; Naruto = shadow clones + rasengan + sage mode)
- Game characters, superheroes, mythology, movies, any fictional reference
- Unknown terms — search before guessing

Return ONLY a raw JSON array (absolutely no markdown fences, no text before or after):
[{"id":"unique_id","name":"Ability Name","emoji":"🔮","description":"Game effect description","effects":{"speedMult":1.0,"damageMult":1.0,"canFly":false,"teleport":false,"invisible":false,"healRate":0,"sizeScale":1.0,"element":"none","specialEffect":"","cooldown":5,"range":100,"canFreeze":false,"immortal":false,"canSummon":false,"canClone":false}}]`,

    behavior: `You are "BehaviorAI" for "Ability Game". Interpret any personality/behavior description. Search web for fictional character references (e.g. "acts like SCP-173" or "like a zombie").
Return ONLY raw JSON (no markdown):
{"mood":"aggressive|friendly|scared|lazy|curious|happy|sad|chaotic|neutral","aggression":0.5,"speed":1.0,"social":0.5,"intelligence":0.5,"traits":["list"],"description":"one sentence","special":["specific behavior description"]}`
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systems[type] || systems.ability,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: String(prompt) }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText.slice(0, 200));
      return res.json({ result: type === 'ability' ? localAbilityParse(prompt) : localBehaviorParse(prompt), fallback: true });
    }

    const data = await response.json();
    const textContent = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('');

    // Try to extract JSON from response
    const arrMatch = textContent.match(/\[[\s\S]*?\]/);
    const objMatch = textContent.match(/\{[\s\S]*\}/);
    const jsonStr = (type === 'ability' ? arrMatch : objMatch) ? (type === 'ability' ? arrMatch[0] : objMatch[0]) : null;

    if (jsonStr) {
      try {
        return res.json({ result: JSON.parse(jsonStr) });
      } catch {}
    }

    // Clean and retry
    const clean = textContent.replace(/```json\n?|\n?```/g, '').trim();
    try {
      return res.json({ result: JSON.parse(clean) });
    } catch {
      return res.json({ result: type === 'ability' ? localAbilityParse(prompt) : localBehaviorParse(prompt), fallback: true });
    }
  } catch (e) {
    console.error('AI fetch error:', e.message);
    return res.json({ result: type === 'ability' ? localAbilityParse(prompt) : localBehaviorParse(prompt), fallback: true });
  }
});

// ── SKINS ENDPOINTS ──
app.get('/api/skins', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  res.json({ skins: globalSkins.slice(page * 20, page * 20 + 20), total: globalSkins.length });
});

app.post('/api/skins/publish', (req, res) => {
  const { name, creator, price, pixels, description, category } = req.body;
  if (!name || !creator || !pixels) return res.status(400).json({ error: 'Missing required fields' });
  const skin = { id: 'sk_' + Date.now() + '_' + Math.random().toString(36).slice(2), name: String(name).slice(0, 30), creator: String(creator).slice(0, 20), price: Math.min(9000000, Math.max(0, parseInt(price) || 0)), pixels, description: String(description || '').slice(0, 100), category: category || 'general', downloads: 0, createdAt: Date.now() };
  globalSkins.unshift(skin);
  if (globalSkins.length > 2000) globalSkins.length = 2000;
  writeJSON('skins.json', globalSkins);
  res.json({ success: true, skin });
});

app.post('/api/skins/:id/buy', (req, res) => {
  const skin = globalSkins.find(s => s.id === req.params.id);
  if (!skin) return res.status(404).json({ error: 'Not found' });
  skin.downloads = (skin.downloads || 0) + 1;
  writeJSON('skins.json', globalSkins);
  res.json({ success: true, skin });
});

// ── BACKGROUND ENDPOINT (dev only) ──
app.get('/api/background', (req, res) => res.json(bgData));

app.post('/api/background', (req, res) => {
  const { devPassword, type, value } = req.body;
  const DEV_PASS = process.env.DEV_PASSWORD || 'KiiAkira098';
  if (devPassword !== DEV_PASS) return res.status(403).json({ error: 'Wrong developer password' });
  bgData = { type: type || 'color', value: value || '#0a0a0a' };
  writeJSON('background.json', bgData);
  res.json({ success: true });
});

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => res.json({ status: 'ok', aiEnabled: !!process.env.ANTHROPIC_API_KEY }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🎮 Ability Game running on port ${PORT}`));
