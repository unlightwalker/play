/**
 * ========================================================
 * 你的江湖 - 俠客（同伴）系統 (companions.js)
 * 讀取 data_companions.js（GLOBAL_COMPANIONS / COMPANION_CONFIG）
 * 1. 俠客只能透過奇遇的「招募俠客」結果加入（encounters.js）
 * 2. 好感度：交談、送禮、並肩作戰、派遣歸來；達門檻解鎖 派遣 / 結義。潛力（凡骨~天縱）決定升級成長係數
 * 3. 預設裝備與武學；招募後可更換裝備、研讀秘笈（或奇遇）學武
 * 4. 出戰助陣與護主（combat.js）、派遣採集 / 挖礦 / 砍伐 / 歷練（離線也計時）、協助製作、結義屬性加成與合擊技
 * 玩家資料：player.companions = { id: { affinity, lv, exp, gear{weapon,armor}, skills[], active, party, sworn, errand, daily } }
 * ========================================================
 */

// ==================== 火柴人外觀 ====================
const COMPANION_FIGURE_OPTIONS = {
  pose: [["stand", "站立"], ["guard", "架勢"], ["meditate", "盤坐"]],
  hair: [["none", "無"], ["topknot", "髮髻"], ["bun", "後髻"], ["long", "長髮"], ["bald", "光頭"], ["straw_hat", "斗笠"], ["scholar_hat", "方巾"], ["headband", "頭巾"], ["hood", "兜帽"], ["horns", "魔冠"]],
  weapon: [["none", "空手"], ["sword", "劍"], ["saber", "刀"], ["staff", "棍"], ["spear", "槍"], ["dagger", "匕首"], ["fan", "摺扇"], ["hammer", "鐵鎚"], ["pickaxe", "礦鎬"], ["axe", "斧頭"], ["sickle", "藥鐮"], ["bow", "弓"]],
  accessory: [["none", "無"], ["scarf", "圍巾"], ["cape", "披風"], ["beard", "長鬚"], ["sash", "腰帶"], ["mask", "面罩"], ["basket", "背簍"], ["gourd", "葫蘆"], ["apron", "圍裙"]]
};
const COMPANION_DEFAULT_FIGURE = { body: "#cad3df", skin: "#f5cba7", hair: "topknot", hairColor: "#2c2c2c", accent: "#f1c40f", weapon: "sword", accessory: "none", pose: "stand" };

function companionFigureSvg(figIn, opt = {}) {
  const f = Object.assign({}, COMPANION_DEFAULT_FIGURE, figIn || {});
  const sil = !!opt.silhouette;
  const C = sil ? { body: "#2b3442", skin: "#2b3442", hair: "#2b3442", accent: "#2b3442" } : { body: f.body, skin: f.skin, hair: f.hairColor, accent: f.accent };
  const P = {
    stand: { arms: "M50 42 L32 62 M50 42 L68 62", legs: "M50 78 L38 120 M50 78 L62 120", hand: [68, 62], lhand: [32, 62], hip: [50, 78] },
    guard: { arms: "M50 42 L32 50 L28 38 M50 42 L70 50 L84 44", legs: "M50 78 L32 119 M50 78 L70 117", hand: [84, 44], lhand: [28, 38], hip: [50, 78] },
    meditate: { arms: "M50 44 L35 64 L48 74 M50 44 L65 64 L52 74", legs: "M50 76 L26 96 L62 100 M50 76 L74 96 L38 100", hand: [65, 64], lhand: [35, 64], hip: [50, 76] }
  }[f.pose] || null;
  const p = P || { arms: "M50 42 L32 62 M50 42 L68 62", legs: "M50 78 L38 120 M50 78 L62 120", hand: [68, 62], lhand: [32, 62], hip: [50, 78] };
  const [hx, hy] = p.hand;
  const bodyEnd = f.pose === "meditate" ? 76 : 78;
  const s = (d, c, w = 4.5, extra = "") => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  let back = "", front = "", hairSvg = "", weapon = "";

  // 背後配件
  if (f.accessory === "cape") back += `<path d="M44 34 L28 96 L50 88 L72 96 L56 34 Z" fill="${sil ? C.body : f.accent}" opacity="${sil ? 1 : 0.55}"/>`;
  if (f.accessory === "basket") back += `<rect x="54" y="36" width="16" height="20" rx="3" fill="${sil ? C.body : "#8d6e63"}" stroke="${sil ? C.body : "#5d4037"}" stroke-width="2"/><path d="M56 41 H68 M56 46 H68 M56 51 H68" stroke="${sil ? C.body : "#5d4037"}" stroke-width="1.5"/>`;
  if (f.hair === "long") back += s("M42 18 Q38 32 40 44 M58 18 Q62 32 60 44", C.hair, 5);

  // 頭髮 / 帽子
  const H = {
    topknot: `<circle cx="50" cy="11" r="4" fill="${C.hair}"/><path d="M41 20 Q50 9 59 20" stroke="${C.hair}" stroke-width="3.5" fill="none"/>`,
    bun: `<circle cx="58" cy="15" r="4.5" fill="${C.hair}"/><path d="M41 20 Q50 9 59 20" stroke="${C.hair}" stroke-width="3.5" fill="none"/>`,
    long: `<path d="M41 21 Q50 8 59 21" stroke="${C.hair}" stroke-width="4" fill="none"/>`,
    bald: sil ? "" : `<circle cx="46" cy="18" r="2" fill="#fff" opacity="0.6"/>`,
    straw_hat: `<path d="M28 18 L50 5 L72 18 Z" fill="${sil ? C.hair : "#d4ac6e"}" stroke="${sil ? C.hair : "#8d6e3f"}" stroke-width="1.5"/>`,
    scholar_hat: `<rect x="42" y="7" width="16" height="7" rx="1" fill="${C.hair}"/><path d="M58 12 L66 18" stroke="${C.hair}" stroke-width="2"/>`,
    headband: `<path d="M41 18 H59" stroke="${sil ? C.hair : f.accent}" stroke-width="3"/><path d="M59 18 Q66 20 68 27 M59 18 Q67 16 71 21" stroke="${sil ? C.hair : f.accent}" stroke-width="2" fill="none"/><path d="M41 18 Q50 8 59 18" stroke="${C.hair}" stroke-width="3" fill="none"/>`,
    hood: `<path d="M39 26 Q38 9 50 8 Q62 9 61 26" stroke="${sil ? C.hair : f.accent}" stroke-width="4" fill="none"/>`,
    horns: `<path d="M43 15 L38 3 L47 12 M57 15 L62 3 L53 12" stroke="${sil ? C.hair : "#c0392b"}" stroke-width="3" fill="none"/><path d="M41 19 Q50 9 59 19" stroke="${C.hair}" stroke-width="3" fill="none"/>`
  };
  hairSvg = H[f.hair] || "";

  // 武器（持於右手）
  const A = sil ? C.body : f.accent;
  const W = {
    sword: s(`M${hx} ${hy} L${hx + 22} ${hy - 24}`, A, 3) + s(`M${hx - 3} ${hy - 5} L${hx + 4} ${hy + 3}`, A, 3),
    saber: s(`M${hx} ${hy} Q${hx + 14} ${hy - 6} ${hx + 24} ${hy - 26}`, A, 4),
    staff: s(`M${hx + 3} ${hy - 50} L${hx - 3} ${hy + 50}`, sil ? C.body : "#a0522d", 3.5),
    spear: s(`M${hx + 3} ${hy - 50} L${hx - 3} ${hy + 50}`, sil ? C.body : "#a0522d", 3) + `<path d="M${hx + 1} ${hy - 62} L${hx + 6} ${hy - 48} L${hx - 2} ${hy - 49} Z" fill="${A}"/>`,
    dagger: s(`M${hx} ${hy} L${hx + 10} ${hy - 10}`, A, 3),
    fan: `<path d="M${hx} ${hy} L${hx + 6} ${hy - 18} A18 18 0 0 1 ${hx + 18} ${hy - 6} Z" fill="${sil ? C.body : "#f5f0e1"}" stroke="${A}" stroke-width="1.5"/>`,
    hammer: s(`M${hx} ${hy} L${hx + 14} ${hy - 16}`, sil ? C.body : "#8d6e63", 3) + `<rect x="${hx + 9}" y="${hy - 25}" width="13" height="8" rx="1" transform="rotate(-48 ${hx + 15} ${hy - 21})" fill="${A}"/>`,
    pickaxe: s(`M${hx} ${hy} L${hx + 14} ${hy - 18}`, sil ? C.body : "#8d6e63", 3) + s(`M${hx + 4} ${hy - 24} Q${hx + 16} ${hy - 22} ${hx + 24} ${hy - 12}`, A, 3),
    axe: s(`M${hx} ${hy} L${hx + 14} ${hy - 18}`, sil ? C.body : "#8d6e63", 3) + `<path d="M${hx + 10} ${hy - 22} Q${hx + 22} ${hy - 26} ${hx + 22} ${hy - 12} Z" fill="${A}"/>`,
    sickle: s(`M${hx} ${hy} L${hx + 8} ${hy - 10}`, sil ? C.body : "#8d6e63", 3) + s(`M${hx + 8} ${hy - 10} Q${hx + 20} ${hy - 18} ${hx + 14} ${hy - 26}`, A, 2.5),
    bow: s(`M${p.lhand[0] - 2} ${p.lhand[1] - 22} Q${p.lhand[0] - 16} ${p.lhand[1]} ${p.lhand[0] - 2} ${p.lhand[1] + 22}`, A, 3) + s(`M${p.lhand[0] - 2} ${p.lhand[1] - 22} L${p.lhand[0] - 2} ${p.lhand[1] + 22}`, sil ? C.body : "#ddd", 1)
  };
  if (f.pose === "meditate" && ["sword", "saber", "staff", "spear"].includes(f.weapon)) weapon = s("M18 112 L82 112", A, 3); // 盤坐時兵刃橫放身前
  else weapon = W[f.weapon] || "";

  // 前方配件
  if (f.accessory === "scarf") front += s("M45 32 Q50 35 55 32 M46 33 Q36 36 28 33 Q34 39 26 42", sil ? C.body : f.accent, 3);
  if (f.accessory === "beard") front += s("M47 30 L45 41 M50 31 L50 44 M53 30 L55 41", sil ? C.body : "#dcdcdc", 2);
  if (f.accessory === "sash") front += s("M43 58 L57 54", sil ? C.body : f.accent, 4);
  if (f.accessory === "mask" && !sil) front += `<rect x="42" y="18" width="16" height="5" rx="2" fill="#2c3e50"/>`;
  if (f.accessory === "gourd") front += `<circle cx="${p.hip[0] - 9}" cy="${p.hip[1] - 6}" r="3.5" fill="${sil ? C.body : "#e67e22"}"/><circle cx="${p.hip[0] - 9}" cy="${p.hip[1] + 1}" r="5" fill="${sil ? C.body : "#e67e22"}"/>`;
  if (f.accessory === "apron") front += `<path d="M44 50 L56 50 L58 76 L42 76 Z" fill="${sil ? C.body : "#795548"}" opacity="0.85"/>`;

  const w = opt.width || 100, h = opt.height || 130;
  return `<svg class="comp-figure" viewBox="0 0 100 130" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    ${back}
    ${s(`M50 31 L50 ${bodyEnd}`, C.body, 5)}
    ${s(p.arms, C.body, 4.5)}
    ${s(p.legs, C.body, 5)}
    <circle cx="50" cy="22" r="9" fill="${C.skin}"/>
    ${hairSvg}${weapon}${front}
    ${sil ? `<text x="50" y="27" text-anchor="middle" font-size="11" fill="#5a6b82" font-weight="bold">?</text>` : ""}
  </svg>`;
}

const COMPANION_ROLES = [["fighter", "⚔️ 武鬥"], ["assassin", "🗡️ 刺客"], ["healer", "💊 醫者"], ["gatherer", "🌿 採集"], ["miner", "⛏️ 礦工"], ["woodsman", "🪓 樵夫"], ["craftsman", "🔨 匠人"], ["villain", "👹 魔頭"]];
const COMPANION_ERRANDS = [["gather", "🌿 採集藥草"], ["mine", "⛏️ 開採礦石"], ["chop", "🪓 砍伐林木"], ["tower", "🏔️ 通天塔歷練"]];
const COMPANION_LINE_KINDS = [["greet", "初次結識"], ["talk", "交談"], ["gift", "收到禮物"], ["giftFav", "收到喜歡的禮物"], ["assist", "出手助陣"], ["win", "並肩獲勝"], ["lose", "戰敗"], ["errandBack", "派遣歸來"], ["sworn", "結義"]];
const COMPANION_DEFAULT_LINES = {
  greet: ["往後還請多多關照。"], talk: ["今日天氣不錯。", "江湖路遠，有個照應總是好的。"], gift: ["多謝。"], giftFav: ["這正是我想要的！"],
  assist: ["看招！", "我來助你！"], win: ["痛快！"], lose: ["下回再討回來。"], errandBack: ["我回來了，收穫不少。"], sworn: ["從今往後，你我便是兄弟！"]
};

// ==================== 俠客系統 ====================
const COMPANION_POTENTIAL_DEFAULT = [
  { rarity: "凡品", name: "凡骨", growth: 1.0 }, { rarity: "良品", name: "良材", growth: 1.25 }, { rarity: "上品", name: "俊傑", growth: 1.5 },
  { rarity: "絕品", name: "奇才", growth: 1.8 }, { rarity: "神品", name: "天縱", growth: 2.2 }
];

const Companions = (() => {
  let selected = null, sub = "";
  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const list = () => (typeof GLOBAL_COMPANIONS !== 'undefined' && Array.isArray(GLOBAL_COMPANIONS)) ? GLOBAL_COMPANIONS : [];
  const def = id => list().find(c => c.id === id) || null;
  function cfg() {
    const d = { maxParty: 1, maxErrand: 2, maxSworn: 3, unlock: { errand: 30, sworn: 100 },
      affinity: { talk: 1, talkPerDay: 1, giftPerDay: 3, gift: { "凡品": 2, "良品": 4, "上品": 8, "絕品": 15, "神品": 25 }, favoriteMult: 3, battleWin: 1, battleWinPerDay: 5, errandDone: 2 },
      assist: { damageRatio: 0.4, speedRatio: 1, inTowerBoss: true, healPct: 8, comboAtHpPct: 50, guardChance: 25, affinityAtkPer100: 50 },
      craftBonus: 5, potential: COMPANION_POTENTIAL_DEFAULT,
      level: { max: 60, expBase: 40, expPow: 1.5, statPerLv: 0.04, expShare: 0.5, expShareTarget: "party" },
      training: { floor: 50, roomMult: 1, hours: [1, 4, 8] },
      errand: { hours: [1, 4, 8], affinityBonusPer100: 50, towerRatio: 0.3, specialtyMult: 1.5, yields: {} } };
    const c = (typeof COMPANION_CONFIG !== 'undefined' && COMPANION_CONFIG) || {};
    return { ...d, ...c, unlock: { ...d.unlock, ...(c.unlock || {}) }, affinity: { ...d.affinity, ...(c.affinity || {}), gift: { ...d.affinity.gift, ...((c.affinity || {}).gift || {}) } },
      assist: { ...d.assist, ...(c.assist || {}) }, level: { ...d.level, ...(c.level || {}) }, errand: { ...d.errand, ...(c.errand || {}) }, training: { ...d.training, ...(c.training || {}) },
      potential: Array.isArray(c.potential) && c.potential.length ? c.potential : d.potential };
  }
  const lines = (c, kind) => { const l = (c.lines && c.lines[kind]) || []; return l.length ? l : COMPANION_DEFAULT_LINES[kind]; };
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const fullName = c => `${c.title ? c.title + "・" : ""}${c.name}`;
  const today = () => (window.ShopStock ? ShopStock.cycleStart() : new Date().setHours(0, 0, 0, 0));
  const fire = (type, ctx) => { if (window.Encounters) setTimeout(() => Encounters.trigger(type, ctx), 300); };
  const findItem = ref => (typeof findItemByRef === 'function' ? findItemByRef(ref) : null);
  const findSkill = ref => (typeof findSkillByRef === 'function' ? findSkillByRef(ref) : null);

  // ---- 潛力 ----
  function potentialOf(c) {
    const p = cfg().potential;
    return p.find(x => x.rarity === c.potential) || p[0];
  }

  function ensureData() {
    if (!player.companions || typeof player.companions !== 'object') player.companions = {};
    Object.keys(player.companions).forEach(id => { if (!def(id)) delete player.companions[id]; }); // 資料已刪除的俠客
  }
  function st(id) {
    ensureData();
    const s = player.companions[id];
    if (!s) return null;
    if (!s.daily || s.daily.day !== today()) s.daily = { day: today(), talk: 0, gift: 0, win: 0 };
    if (!s.lv) s.lv = 1;
    if (!s.exp) s.exp = 0;
    if (!s.gear) s.gear = { weapon: null, armor: null };
    if (!Array.isArray(s.skills)) s.skills = defaultSkills(def(id));
    if (!s.slots || typeof s.slots !== 'object') s.slots = defaultSlots(def(id), s.skills, s.active);
    delete s.active;
    return s;
  }
  // 武學欄位：外功 / 心法 / 輕功 各一；只有佩戴中的武學提供素質
  const SLOT_TYPE = { ext: 'external', internal: 'internal', qinggong: 'qinggong' };
  function defaultSlots(c, skills, active) {
    const of = t => skills.find(n => (findSkill(n) || {}).type === t) || "";
    const ext = (active && skills.includes(active)) ? active : ((c.activeSkill && skills.includes(c.activeSkill)) ? c.activeSkill : of('external'));
    return { ext, internal: of('internal'), qinggong: of('qinggong') };
  }
  function defaultSkills(c) {
    const out = [...(Array.isArray(c.skills) ? c.skills : [])];
    if (c.skill && c.skill.name && !out.includes(c.skill.name)) out.push(c.skill.name); // 舊格式
    return out.filter(n => findSkill(n));
  }
  const recruitedIds = () => { ensureData(); return list().filter(c => player.companions[c.id]).map(c => c.id); };
  const partyIds = () => recruitedIds().filter(id => st(id).party);
  const errandIds = () => recruitedIds().filter(id => st(id).errand);
  const swornIds = () => recruitedIds().filter(id => st(id).sworn);

  function say(c, kind, channel = 'current', text) {
    if (typeof pushChatMessage === 'function') pushChatMessage(channel, `[俠客] ${fullName(c)}`, text || pick(lines(c, kind)), '#9b59b6');
  }

  function recruit(id, silent) {
    const c = def(id);
    if (!c) return false;
    ensureData();
    if (player.companions[id]) return false;
    const g = c.gear || {};
    const mk = ref => { const t = ref && findItem(ref); return t ? { ...t, templateId: t.id, id: "cg_" + Date.now() + Math.floor(Math.random() * 1000) } : null; };
    const skills = defaultSkills(c);
    player.companions[id] = { affinity: Math.max(0, Math.min(100, Number(c.startAffinity) || 10)), recruitedAt: Date.now(), party: false, sworn: false, errand: null,
      lv: 1, exp: 0, gear: { weapon: mk(g.weapon), armor: mk(g.armor) }, skills, slots: defaultSlots(c, skills) };
    if (!silent) {
      if (typeof gameNotify === 'function') gameNotify(`🤝【${fullName(c)}】願與你同行！可在「俠客」中查看。`, 'ok');
      say(c, 'greet', 'system');
    }
    if (partyIds().length < cfg().maxParty) player.companions[id].party = true;
    fire('companion_recruit', { companion: id });
    return true;
  }
  function addAffinity(id, n) {
    const s = st(id), c = def(id);
    if (!s || !c || !n) return 0;
    const before = s.affinity;
    s.affinity = Math.max(0, Math.min(100, before + n));
    const u = cfg().unlock;
    [["errand", "派遣"], ["sworn", "結義"]].forEach(([k, l]) => {
      if (before < u[k] && s.affinity >= u[k] && typeof pushChatMessage === 'function')
        pushChatMessage('system', '【俠客】', `與【${fullName(c)}】的好感達到 ${u[k]}，解鎖「${l}」！`, '#9b59b6');
    });
    return s.affinity - before;
  }

  // ---- 等級（潛力決定成長係數） ----
  function expNeed(lv) { const l = cfg().level; return Math.round((Number(l.expBase) || 40) * Math.pow(lv, Number(l.expPow) || 1.5)); }
  function addExp(id, n, quiet) {
    const s = st(id), c = def(id), l = cfg().level;
    if (!s || !n) return 0;
    let ups = 0;
    s.exp += Math.max(0, Math.round(n));
    while (s.lv < l.max && s.exp >= expNeed(s.lv)) { s.exp -= expNeed(s.lv); s.lv++; ups++; }
    if (s.lv >= l.max) s.exp = 0;
    if (ups && typeof pushChatMessage === 'function') pushChatMessage('system', '【俠客】', `【${fullName(c)}】功力精進，升到 ${s.lv} 級！`, '#9b59b6');
    if (ups) fire('companion_levelup', { companion: id, level: s.lv });
    return ups;
  }

  // ---- 俠客的六維：基礎六維 ×（1 +（等級 − 1）× 每級成長 × 潛力成長係數）＋ 佩戴中武學的素質加成 ----
  const STAT_KEYS = ["arm", "speed", "bone", "inner", "int", "luck"];
  const ROLE_BASE = {
    fighter: { arm: 16, speed: 42, bone: 15, inner: 10, int: 18, luck: 15 }, assassin: { arm: 13, speed: 55, bone: 11, inner: 9, int: 20, luck: 18 },
    healer: { arm: 9, speed: 38, bone: 13, inner: 16, int: 26, luck: 16 }, gatherer: { arm: 11, speed: 38, bone: 14, inner: 10, int: 20, luck: 20 },
    miner: { arm: 18, speed: 30, bone: 19, inner: 9, int: 14, luck: 14 }, woodsman: { arm: 15, speed: 42, bone: 15, inner: 9, int: 15, luck: 16 },
    craftsman: { arm: 16, speed: 30, bone: 17, inner: 11, int: 20, luck: 13 }, villain: { arm: 21, speed: 46, bone: 17, inner: 15, int: 18, luck: 12 }
  };
  function baseStats(c) { return Object.assign({}, ROLE_BASE[c.role] || ROLE_BASE.fighter, c.stats6 || {}); }
  function equippedSkills(s) { return ['ext', 'internal', 'qinggong'].map(k => findSkill(s.slots[k])).filter(Boolean); }
  function sixStats(id) {
    const c = def(id), s = st(id), g = potentialOf(c).growth, per = Number(cfg().level.statPerLv) || 0.04;
    const base = baseStats(c), eq = equippedSkills(s), out = {};
    STAT_KEYS.forEach(k => {
      const fromLv = Math.round((Number(base[k]) || 10) * (1 + (s.lv - 1) * per * g));
      const fromKf = eq.reduce((n, sk) => n + (Number((sk.statBonus || {})[k]) || 0), 0);
      out[k] = fromLv + fromKf;
    });
    return out;
  }
  // 戰鬥數值：攻擊 = 基礎攻擊 + 兵刃 + 臂力 × 0.65；身法 = 身法素質 + 兵刃；護主 = 護甲防禦 + 根骨 × 0.3
  function stats(id) {
    const c = def(id), s = st(id), six = sixStats(id);
    const w = s.gear.weapon, a = s.gear.armor;
    const atk = Math.round((Number(c.atk) || 20) + (w ? Number(w.atk) || 0 : 0) + six.arm * 0.65);
    const speed = Math.round(six.speed + (w ? Number(w.speed) || 0 : 0));
    const guard = a ? Math.round((Number(a.def) || 0) + six.bone * 0.3) : 0;
    const extSk = findSkill(s.slots.ext);
    const usable = extSk && (typeof isSkillCompatibleWithWeapon === 'function' ? isSkillCompatibleWithWeapon(extSk, w) : true);
    return { atk, speed, guard, six, skill: usable ? extSk : null, skillBlocked: extSk && !usable ? extSk : null, weaponType: typeof getWeaponType === 'function' ? getWeaponType(w) : '拳' };
  }
  // 玩家獲得修為時，俠客獲得一定比例的經驗（預設：隨行的俠客 50%）
  function shareExp(delta) {
    const l = cfg().level;
    const ids = l.expShareTarget === 'all' ? recruitedIds() : partyIds();
    const n = Math.floor(delta * (Number(l.expShare) || 0));
    if (n > 0) ids.forEach(id => addExp(id, n, true));
  }

  // 結義屬性加成（main.js recalcPlayerStats 呼叫）
  function statBonus(k) {
    return swornIds().reduce((n, id) => { const b = def(id).swornBonus; return n + (b && b.stat === k ? Number(b.value) || 0 : 0); }, 0);
  }
  function craftBonus(skill) { return partyIds().some(id => def(id).craftSkill === skill) ? (Number(cfg().craftBonus) || 0) : 0; }

  // ==================== 戰鬥（combat.js 呼叫） ====================
  function forBattle(combatType) {
    if (combatType === 'tower_boss' && !cfg().assist.inTowerBoss) return null;
    const id = partyIds()[0];
    if (!id) return null;
    const c = def(id), s = st(id), x = stats(id);
    const wType = x.weaponType;
    const wFactor = (typeof WEAPON_SPEED_FACTOR !== 'undefined' && WEAPON_SPEED_FACTOR[wType]) || 1;
    return { id, name: fullName(c), short: c.name, figure: c.figure, sworn: !!s.sworn, affinity: s.affinity, wFactor,
      atk: x.atk, speed: x.speed, guard: x.guard, skillName: x.skill ? x.skill.name : "", skillMult: x.skill ? (Number(x.skill.baseMult) || 1.2) : 1,
      vfx: (x.skill && x.skill.vfxChain && x.skill.vfxChain.mid && x.skill.vfxChain.mid !== '無動畫') ? x.skill.vfxChain.mid : (c.vfx || ""),
      healPct: healPctOf(c, s), combo: c.combo && c.combo.name ? c.combo : null, def: c };
  }
  // 療傷能力：俠客本身設定，或佩戴具療傷效果的心法（自然回春 / 九陽）
  const HEAL_EFFECTS = ["nature_regen", "divine_jiuyang"];
  function healPctOf(c, s) {
    const own = Number(c.healPct) || 0;
    const inner = findSkill(s.slots.internal);
    const fromSkill = inner && inner.specialEffect && HEAL_EFFECTS.includes(inner.specialEffect.type) ? (Number(cfg().assist.healPct) || 8) : 0;
    return Math.max(own, fromSkill);
  }
  function battleLine(bc, kind) { if (Math.random() < 0.35) say(bc.def, kind); }
  function afterBattle(outcome, combatType, enemy) {
    const id = partyIds()[0];
    if (!id || (combatType === 'tower_boss' && !cfg().assist.inTowerBoss)) return;
    const c = def(id), s = st(id), a = cfg().affinity;
    if (outcome === 'win') {
      if (s.daily.win < a.battleWinPerDay) { s.daily.win++; addAffinity(id, a.battleWin); }
      setTimeout(() => say(c, 'win'), 900);
    } else if (outcome === 'lose') setTimeout(() => say(c, 'lose'), 900);
  }

  // ==================== 派遣 ====================
  function errandRewards(id) {
    const c = def(id), s = st(id), e = s.errand, conf = cfg().errand;
    const mult = (1 + s.affinity / 100 * (Number(conf.affinityBonusPer100) || 0) / 100) * (c.errand === e.type ? (Number(conf.specialtyMult) || 1) : 1);
    const got = [];
    if (e.type === 'tower') {
      const floor = Math.max(1, (player.towerFloor || 1) - 1);
      const bg = (typeof TOWER_REWARD_CONFIG !== 'undefined' && TOWER_REWARD_CONFIG.background) || { intervalSec: 10 };
      const kills = Math.floor(e.hours * 3600 / (Number(bg.intervalSec) || 10) * mult);
      let exp = 0, gold = 0, learn = 0;
      for (let i = 0; i < kills; i++) { const r = typeof towerKillReward === 'function' ? towerKillReward(floor, Number(conf.towerRatio) || 0.3) : { exp: 5, gold: 2, learn: 0 }; exp += r.exp; gold += r.gold; learn += r.learn; }
      player.exp += exp; player.gold += gold; player.learn += learn;
      got.push(`修為 +${exp}`, `銀兩 +${gold}`, `學點 +${learn}`);
    } else {
      (((conf.yields || {})[e.type]) || []).forEach(y => {
        const ex = (Number(y.perHour) || 0) * e.hours * mult;
        const n = Math.floor(ex) + (Math.random() < ex % 1 ? 1 : 0);
        if (n > 0 && typeof grantLootToBag === 'function') { const nm = grantLootToBag('item', y.ref, n); if (nm) got.push(`${nm}×${n}`); }
      });
    }
    return got;
  }
  function claimErrand(id) {
    const s = st(id), c = def(id);
    if (!s || !s.errand || Date.now() < s.errand.until) return;
    const type = s.errand.type;
    const got = type === 'train' ? trainRewards(id) : errandRewards(id);
    s.errand = null;
    addAffinity(id, cfg().affinity.errandDone);
    if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
    if (typeof gameNotify === 'function') gameNotify(`🎒【${fullName(c)}】派遣歸來：${got.join('、') || '這趟空手而回'}`, 'ok');
    if (typeof pushChatMessage === 'function') pushChatMessage('system', '【派遣歸來】', `${fullName(c)}：${got.join('、') || '空手而回'}`, '#9b59b6');
    say(c, 'errandBack');
    render();
    fire('companion_errand_back', { companion: id, errand: type });
  }
  // ---- 修練：每小時經驗 = 通天塔第 N 層背景歷練的每小時修為 × 練功室加成（房屋系統尚未實裝，目前 ×1）----
  function trainExpPerHour() {
    const t = cfg().training;
    const bg = (typeof TOWER_REWARD_CONFIG !== 'undefined' && TOWER_REWARD_CONFIG.background) || { intervalSec: 10, ratio: 0.5 };
    const perKill = typeof towerKillReward === 'function' ? towerKillReward(Number(t.floor) || 50, 1, true).exp : 69;
    return Math.round(perKill * 3600 / (Number(bg.intervalSec) || 10) * (Number(bg.ratio) || 0.5) * (Number(t.roomMult) || 1));
  }
  function trainRewards(id) {
    const s = st(id), n = Math.round(trainExpPerHour() * s.errand.hours);
    const ups = addExp(id, n);
    return [`經驗 +${n}${ups ? `（升 ${ups} 級）` : ''}`];
  }
  function startTrain(id, hours) {
    const s = st(id);
    if (!s || s.errand) return;
    if (errandIds().length >= cfg().maxErrand) { gameNotify(`派遣與修練同時最多 ${cfg().maxErrand} 位俠客。`); return; }
    s.party = false;
    s.errand = { type: 'train', hours: Number(hours), start: Date.now(), until: Date.now() + Number(hours) * 3600000 };
    sub = "";
    gameNotify(`【${fullName(def(id))}】閉關修練，${hours} 小時後出關。`);
    render();
  }
  // 俠客經驗丹（物品 companionExp）
  function usePill(id, invIdx) {
    const it = player.inventory[invIdx], c = def(id);
    if (!it || !(Number(it.companionExp) > 0) || !st(id)) return;
    if (st(id).lv >= cfg().level.max) { gameNotify(`${c.name}已達最高等級。`); return; }
    const n = Number(it.companionExp);
    if (it.count && it.count > 1) it.count -= 1; else player.inventory.splice(invIdx, 1);
    const ups = addExp(id, n);
    gameNotify(`💊【${fullName(c)}】服下${it.name}，經驗 +${n}${ups ? `，升了 ${ups} 級！` : ''}`, 'ok');
    render();
  }
  function startErrand(id, type, hours) {
    const s = st(id), u = cfg().unlock;
    if (!s || s.affinity < u.errand || s.errand) return;
    if (errandIds().length >= cfg().maxErrand) { gameNotify(`最多同時派遣 ${cfg().maxErrand} 位俠客。`); return; }
    s.party = false;
    s.errand = { type, hours: Number(hours), start: Date.now(), until: Date.now() + Number(hours) * 3600000 };
    sub = "";
    gameNotify(`【${fullName(def(id))}】出發了，${hours} 小時後歸來。`);
    render();
  }
  function recallErrand(id) {
    const s = st(id);
    if (!s || !s.errand || !confirm('提前召回不會有任何收穫，確定召回？')) return;
    s.errand = null;
    render();
  }

  // ==================== 裝備與武學 ====================
  function equip(id, invIdx) {
    const s = st(id), it = player.inventory[invIdx];
    if (!s || !it || (it.type !== 'weapon' && it.type !== 'armor')) return;
    const slot = it.type;
    const old = s.gear[slot];
    player.inventory.splice(invIdx, 1);
    s.gear[slot] = it;
    if (old) player.inventory.push(old);
    gameNotify(`【${fullName(def(id))}】換上了【${it.name}】${old ? `，換下的【${old.name}】已放回行囊` : ''}。`);
    sub = "";
    render();
  }
  function unequip(id, slot) {
    const s = st(id);
    if (!s || !s.gear[slot]) return;
    player.inventory.push(s.gear[slot]);
    gameNotify(`已卸下【${s.gear[slot].name}】，放回行囊。`);
    s.gear[slot] = null;
    render();
  }
  // 俠客學武：只能研讀秘笈或透過奇遇
  function learnSkill(id, ref, silent) {
    const s = st(id), c = def(id), sk = findSkill(ref);
    if (!s || !sk) return false;
    if (s.skills.includes(sk.name)) { if (!silent) gameNotify(`${c.name}早已學會【${sk.name}】。`); return false; }
    s.skills.push(sk.name);
    const slot = Object.keys(SLOT_TYPE).find(k => SLOT_TYPE[k] === sk.type);
    if (slot && !s.slots[slot]) s.slots[slot] = sk.name;
    if (!silent) gameNotify(`📖【${fullName(c)}】學會了【${sk.name}】！`, 'ok');
    fire('companion_learn', { companion: id, kungfu: sk.name });
    return true;
  }
  function studyBook(id, invIdx) {
    const it = player.inventory[invIdx];
    if (!it || it.type !== 'book' || !it.skillData) return;
    if (!learnSkill(id, it.skillData.id || it.skillData.name)) return;
    if (it.count && it.count > 1) it.count -= 1; else player.inventory.splice(invIdx, 1);
    sub = "";
    render();
  }
  function setSlot(id, slot, name) {
    const s = st(id);
    if (!s || !SLOT_TYPE[slot]) return;
    if (name && (!s.skills.includes(name) || (findSkill(name) || {}).type !== SLOT_TYPE[slot])) return;
    s.slots[slot] = name || "";
    render();
  }

  // ==================== 互動 ====================
  function toggleParty(id) {
    const s = st(id);
    if (!s || s.errand) return;
    if (s.party) s.party = false;
    else {
      partyIds().forEach(o => { if (partyIds().length >= cfg().maxParty) st(o).party = false; });
      s.party = true;
      say(def(id), 'greet');
    }
    if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
    render();
  }
  function talk(id) {
    const s = st(id), c = def(id), a = cfg().affinity;
    if (!s) return;
    // 交談觸發指定奇遇（編輯器中開啟才會生效）
    const te = c.talkEncounter;
    if (te && te.on && te.id && window.Encounters && Encounters.tryStart(te.id, Number(te.chance ?? 100), { companion: id })) return;
    if (window.Encounters && Encounters.trigger('companion_talk', { companion: id })) return;
    const line = pick(lines(c, 'talk'));
    say(c, 'talk', 'current', line);
    let gain = 0;
    if (s.daily.talk < a.talkPerDay) { s.daily.talk++; gain = addAffinity(id, a.talk); }
    if (gain) render();
    const box = document.getElementById('comp-bubble');
    if (box) box.innerHTML = `<span>${esc(line)}</span>${gain ? `<em>好感 +${gain}</em>` : ''}`;
  }
  function giveGift(id, invIdx) {
    const s = st(id), c = def(id), a = cfg().affinity;
    const it = player.inventory[invIdx];
    if (!s || !it) return;
    if (s.daily.gift >= a.giftPerDay) { gameNotify(`今天已經送過 ${a.giftPerDay} 次禮了，明日再來吧。`); return; }
    const ref = it.templateId || it.id;
    const fav = (c.favorites || []).includes(ref) || (c.favorites || []).includes(it.name);
    const gain = Math.round((a.gift[it.rarity] || 2) * (fav ? a.favoriteMult : 1));
    if (it.count && it.count > 1) it.count -= 1; else player.inventory.splice(invIdx, 1);
    s.daily.gift++;
    const real = addAffinity(id, gain);
    say(c, fav ? 'giftFav' : 'gift');
    gameNotify(`🎁 送給【${fullName(c)}】${it.name}${fav ? '（正合心意！）' : ''}，好感 +${real}`, 'ok');
    render();
    fire('companion_gift', { companion: id, item: ref });
  }
  function swear(id) {
    const s = st(id), c = def(id);
    if (!s || s.sworn || s.affinity < cfg().unlock.sworn) return;
    if (swornIds().length >= cfg().maxSworn) { gameNotify(`最多只能與 ${cfg().maxSworn} 位俠客結義。`); return; }
    if (!confirm(`與【${fullName(c)}】義結金蘭？結義後無法解除。`)) return;
    s.sworn = true;
    say(c, 'sworn', 'system');
    const b = c.swornBonus;
    gameNotify(`🍶 與【${fullName(c)}】結為異姓兄弟！${b && b.stat ? `永久${({ arm: '臂力', speed: '身法', bone: '根骨', inner: '內功', int: '悟性', luck: '福緣' })[b.stat] || b.stat} +${b.value}` : ''}${c.combo && c.combo.name ? `，解鎖合擊技【${c.combo.name}】` : ''}`, 'ok');
    if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
    render();
    fire('companion_sworn', { companion: id });
  }
  // 奇遇結果用：俠客離隊（移除，但不影響資料）
  function leave(id) { ensureData(); if (!player.companions[id]) return false; const g = player.companions[id].gear || {}; ['weapon', 'armor'].forEach(k => { if (g[k]) player.inventory.push(g[k]); }); delete player.companions[id]; if (selected === id) selected = null; if (typeof recalcPlayerStats === 'function') recalcPlayerStats(); return true; }
  function setParty(id) { const s = st(id); if (!s || s.errand) return false; partyIds().forEach(o => { st(o).party = false; }); s.party = true; return true; }
  function giveGearFromTemplate(id, ref) {
    const s = st(id), t = findItem(ref);
    if (!s || !t || (t.type !== 'weapon' && t.type !== 'armor')) return null;
    const old = s.gear[t.type];
    s.gear[t.type] = { ...t, templateId: t.id, id: "cg_" + Date.now() };
    if (old) player.inventory.push(old);
    return t.name;
  }

  // ==================== 俠客頁面 ====================
  function open() { ensureData(); if (!selected || !player.companions[selected]) selected = recruitedIds()[0] || null; sub = ""; render(); if (typeof openModal === 'function') openModal('modal-companions'); }
  function select(id) { selected = id; sub = ""; render(); }
  function setSub(v) { sub = sub === v ? "" : v; render(); }
  const fmtLeft = ms => { const m = Math.max(0, Math.ceil(ms / 60000)); return m >= 60 ? `${Math.floor(m / 60)} 小時 ${m % 60} 分` : `${m} 分鐘`; };

  function statusText(id) {
    const s = st(id);
    if (s.errand) {
      const train = s.errand.type === 'train';
      return Date.now() >= s.errand.until ? `<b style="color:#2ecc71;">${train ? '修練完成' : '派遣歸來'}，可領取</b>` : `${train ? '🧘 閉關修練中' : '派遣中・' + ((COMPANION_ERRANDS.find(e => e[0] === s.errand.type) || [, '派遣'])[1])}・${fmtLeft(s.errand.until - Date.now())}`;
    }
    return s.party ? `<b style="color:var(--gold);">⚔️ 隨行出戰</b>` : '休息中';
  }
  function bar(v, max, cls) { return `<div class="comp-aff ${cls || ''}"><span style="width:${Math.min(100, v / Math.max(1, max) * 100)}%"></span></div>`; }

  function detailHtml(id) {
    const c = def(id), s = st(id), u = cfg().unlock, a = cfg().affinity, x = stats(id), pot = potentialOf(c), maxLv = cfg().level.max;
    const STAT_LABEL = { arm: '臂力', speed: '身法', bone: '根骨', inner: '內功', int: '悟性', luck: '福緣' };
    const roleL = (COMPANION_ROLES.find(r => r[0] === c.role) || [, ''])[1];
    const lock = (need, label) => `<button class="wuxia-btn" disabled title="好感達 ${need} 解鎖" style="color:#666; border-color:#3a4250;">🔒 ${label} ${need}</button>`;
    const btn = (label, fn, color = 'var(--cyan)', on = false) => `<button class="wuxia-btn ${on ? 'on' : ''}" style="color:${color}; border-color:${color};" onclick="${fn}">${label}</button>`;
    let subHtml = "";
    if (sub === 'gift') {
      const items = player.inventory.map((it, i) => ({ it, i })).filter(v => v.it.type !== 'book');
      subHtml = `<div class="comp-sub"><div class="comp-sub-title">🎁 送禮（今日 ${s.daily.gift} / ${a.giftPerDay}）　${(c.favorites || []).length ? '喜歡：' + c.favorites.map(f => { const t = findItem(f); return t ? t.name : f; }).join('、') : ''}</div>
        ${items.length ? items.map(({ it, i }) => { const fav = (c.favorites || []).includes(it.templateId || it.id) || (c.favorites || []).includes(it.name); return `<div class="bag-item-card"><div><b class="color-${it.rarity}">${esc(it.name)}</b>${it.count > 1 ? ` <small>×${it.count}</small>` : ''}${fav ? ' <small style="color:#e84393;">❤ 喜歡</small>' : ''}<br><small style="color:#8ca0b3;">好感 +${Math.round((a.gift[it.rarity] || 2) * (fav ? a.favoriteMult : 1))}</small></div><button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="Companions.giveGift('${id}', ${i})">贈送</button></div>`; }).join('') : '<div class="comp-empty">行囊中沒有可贈送的物品。</div>'}</div>`;
    } else if (sub === 'errand') {
      subHtml = `<div class="comp-sub"><div class="comp-sub-title">🧭 派遣（同時最多 ${cfg().maxErrand} 位，離線也會計時；專長：${(COMPANION_ERRANDS.find(e => e[0] === c.errand) || [, '無'])[1]}，收穫 ×${cfg().errand.specialtyMult}）</div>
        ${COMPANION_ERRANDS.map(([k, l]) => `<div class="bag-item-card"><div><b>${l}</b>${c.errand === k ? ' <small style="color:var(--gold);">★ 專長</small>' : ''}<br><small style="color:#8ca0b3;">${k === 'tower' ? '代為歷練通天塔，帶回修為、銀兩、學點' : (((cfg().errand.yields || {})[k]) || []).map(y => { const t = findItem(y.ref); return t ? t.name : y.ref; }).join('、')}</small></div>
          <div style="display:flex; gap:4px;">${(cfg().errand.hours || [1, 4, 8]).map(h => `<button class="wuxia-btn" style="padding:4px 8px; font-size:12px;" onclick="Companions.startErrand('${id}', '${k}', ${h})">${h}時</button>`).join('')}</div></div>`).join('')}</div>`;
    } else if (sub === 'gear') {
      const items = player.inventory.map((it, i) => ({ it, i })).filter(v => v.it.type === 'weapon' || v.it.type === 'armor');
      subHtml = `<div class="comp-sub"><div class="comp-sub-title">🗡️ 為${esc(c.name)}更換裝備（從行囊中選擇；換下的裝備會放回行囊）</div>
        ${['weapon', 'armor'].map(k => { const g = s.gear[k]; return `<div class="bag-item-card"><div><small style="color:#8ca0b3;">${k === 'weapon' ? '兵刃' : '護甲'}</small> ${g ? `<b class="color-${g.rarity}">${esc(g.name)}</b>` : '<span style="color:#777;">（無）</span>'}</div>${g ? `<button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="Companions.unequip('${id}', '${k}')">卸下</button>` : ''}</div>`; }).join('')}
        ${items.length ? items.map(({ it, i }) => `<div class="bag-item-card"><div><b class="color-${it.rarity}">${esc(it.name)}</b> <small style="color:#8ca0b3;">${it.type === 'weapon' ? `[${typeof getWeaponType === 'function' ? getWeaponType(it) : '兵刃'}] 攻擊 +${it.atk || 0}` : `[護甲] 防禦 ${it.def || 0}`}</small></div><button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="Companions.equip('${id}', ${i})">裝備</button></div>`).join('') : '<div class="comp-empty">行囊中沒有兵刃或護甲。</div>'}</div>`;
    } else if (sub === 'skills') {
      const books = player.inventory.map((it, i) => ({ it, i })).filter(v => v.it.type === 'book' && v.it.skillData);
      const slotRow = (slot, label) => {
        const opts = s.skills.filter(n => (findSkill(n) || {}).type === SLOT_TYPE[slot]);
        const cur = findSkill(s.slots[slot]);
        const bad = slot === 'ext' && cur && typeof isSkillCompatibleWithWeapon === 'function' && !isSkillCompatibleWithWeapon(cur, s.gear.weapon);
        return `<div class="bag-item-card"><div style="flex:1;"><small style="color:#8ca0b3;">${label}</small><br>
          <select class="comp-select" onchange="Companions.setSlot('${id}', '${slot}', this.value)"><option value="">（未佩戴）</option>${opts.map(n => `<option value="${esc(n)}" ${n === s.slots[slot] ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>
          ${cur ? `<small style="color:#8ca0b3; display:block; margin-top:2px;">${Object.entries(cur.statBonus || {}).filter(([, v]) => v).map(([k, v]) => `${STAT_LABEL[k] || k}+${v}`).join(' ') || '無素質加成'}${bad ? '・<span style="color:#e74c3c;">兵刃不符，改用普通攻擊</span>' : ''}</small>` : ''}</div></div>`;
      };
      subHtml = `<div class="comp-sub"><div class="comp-sub-title">📖 ${esc(c.name)}的武學：只有佩戴中的武學會提供素質（新武學只能研讀秘笈或透過奇遇學會）</div>
        ${slotRow('ext', '外功招式（出手時使用）')}${slotRow('internal', '心法')}${slotRow('qinggong', '輕功')}
        <div class="comp-sub-title" style="margin-top:8px;">🗂️ 已學會（${s.skills.length}）：${s.skills.map(n => { const k = findSkill(n); return k ? `<span class="color-${k.rarity}">${esc(n)}</span>` : esc(n); }).join('、') || '無'}</div>
        <div class="comp-sub-title" style="margin-top:8px;">📚 行囊中的秘笈</div>
        ${books.length ? books.map(({ it, i }) => `<div class="bag-item-card"><div><b class="color-${it.rarity}">${esc(it.name)}</b></div>${s.skills.includes(it.skillData.name) ? '<span style="font-size:11px; color:#2ecc71;">已學會</span>' : `<button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="Companions.studyBook('${id}', ${i})">交給${esc(c.name)}研讀</button>`}</div>`).join('') : '<div class="comp-empty">行囊中沒有秘笈。</div>'}</div>`;
    } else if (sub === 'train') {
      const per = trainExpPerHour();
      subHtml = `<div class="comp-sub"><div class="comp-sub-title comp-help-row"><span>🧘 每小時經驗為：${per}</span><button class="comp-help" onclick="gameNotify('🏠 提升家宅中練功房等級，可提高修練效率。')">?</button></div>
        <div style="display:flex; gap:6px;">${(cfg().training.hours || [1, 4, 8]).map(h => `<button class="wuxia-btn" style="flex:1; font-size:12px;" onclick="Companions.startTrain('${id}', ${h})">${h} 小時<br><small style="color:#8ca0b3;">+${per * h}</small></button>`).join('')}</div></div>`;
    } else if (sub === 'pill') {
      const pills = player.inventory.map((it, i) => ({ it, i })).filter(v => Number(v.it.companionExp) > 0);
      subHtml = `<div class="comp-sub"><div class="comp-sub-title">💊 給${esc(c.name)}服用俠客經驗丹</div>
        ${pills.length ? pills.map(({ it, i }) => `<div class="bag-item-card"><div><b class="color-${it.rarity}">${esc(it.name)}</b>${it.count > 1 ? ` <small>×${it.count}</small>` : ''}<br><small style="color:#8ca0b3;">經驗 +${it.companionExp}</small></div><button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="Companions.usePill('${id}', ${i})">服用</button></div>`).join('') : '<div class="comp-empty">行囊中沒有俠客經驗丹。</div>'}</div>`;
    }
    const busy = !!s.errand;
    const ready = busy && Date.now() >= s.errand.until;
    return `
      <div class="comp-detail">
        <div class="comp-portrait">${companionFigureSvg(c.figure, { width: 118, height: 154 })}${s.sworn ? '<span class="comp-sworn">結義</span>' : ''}</div>
        <div class="comp-info">
          <div class="comp-name">${esc(fullName(c))} <small>${esc(roleL)}${c.realm ? `・${esc(c.realm)}` : ''}</small></div>
          <div class="comp-line">潛力 <b class="color-${pot.rarity}">${esc(pot.name)}</b><small style="color:#8a99ad;">（成長 ×${pot.growth}）</small>　${s.lv >= maxLv ? `<b>${s.lv} 級（已滿）</b>` : `<b>${s.lv}</b> 級 ${bar(s.exp, expNeed(s.lv), 'exp')}`}</div>
          <div class="comp-line">好感 <b>${s.affinity}</b> ${bar(s.affinity, 100)}</div>
          <div class="comp-six">${STAT_KEYS.map(k => `<span>${STAT_LABEL[k]}<b>${x.six[k]}</b></span>`).join('')}</div>
          <div class="comp-line">攻擊 <b>${x.atk}</b>　身法 <b>${x.speed}</b>${x.guard ? `　護主 <b>${x.guard}</b>` : ''}　招式：${x.skill ? esc(x.skill.name) : (x.skillBlocked ? `<span style="color:#e74c3c;">${esc(x.skillBlocked.name)}（兵刃不符）</span>` : '普通攻擊')}</div>
          <div class="comp-line">🗡️ ${s.gear.weapon ? esc(s.gear.weapon.name) : '空手'}　🛡️ ${s.gear.armor ? esc(s.gear.armor.name) : '無護甲'}</div>
          <div class="comp-line">${statusText(id)}${Number(c.healPct) > 0 ? '・兼療傷' : ''}${c.craftSkill ? `・協助${c.craftSkill === 'forge' ? '鍛造' : c.craftSkill === 'alchemy' ? '製藥' : esc(c.craftSkill)}` : ''}${s.sworn && c.combo && c.combo.name ? `・合擊【${esc(c.combo.name)}】` : ''}</div>
          <div class="npc-bubble" id="comp-bubble"><span>${esc(pick(lines(c, 'talk')))}</span></div>
        </div>
      </div>
      <div class="comp-actions">
        ${busy ? (ready ? btn('🎒 領取收穫', `Companions.claimErrand('${id}')`, '#2ecc71') : btn('↩ 召回', `Companions.recallErrand('${id}')`, '#e67e22'))
          : btn(s.party ? '🛌 休息' : '⚔️ 出戰', `Companions.toggleParty('${id}')`, 'var(--gold)', s.party)}
        ${btn('💬 交談', `Companions.talk('${id}')`)}
        ${btn('🎁 送禮', `Companions.setSub('gift')`, '#e84393', sub === 'gift')}
        ${btn('🗡️ 裝備', `Companions.setSub('gear')`, '#5dade2', sub === 'gear')}
        ${btn('📖 武學', `Companions.setSub('skills')`, 'var(--cyan)', sub === 'skills')}
        ${busy ? '' : btn('🧘 修練', `Companions.setSub('train')`, '#a29bfe', sub === 'train')}
        ${btn('💊 服丹', `Companions.setSub('pill')`, '#e67e22', sub === 'pill')}
        ${busy ? '' : (s.affinity >= u.errand ? btn('🧭 派遣', `Companions.setSub('errand')`, '#2ecc71', sub === 'errand') : lock(u.errand, '派遣'))}
        ${s.sworn ? '' : (s.affinity >= u.sworn ? btn('🍶 結義', `Companions.swear('${id}')`, 'var(--gold)') : lock(u.sworn, '結義'))}
      </div>
      ${subHtml}`;
  }

  function render() {
    const box = document.getElementById('companion-content');
    if (!box) return;
    ensureData();
    const ids = recruitedIds();
    if (selected && !player.companions[selected]) selected = ids[0] || null;
    const conf = cfg();
    const unmet = list().filter(c => !player.companions[c.id] && !c.hidden);
    let html = `<div class="comp-summary">出戰 ${partyIds().length} / ${conf.maxParty}　派遣 ${errandIds().length} / ${conf.maxErrand}　結義 ${swornIds().length} / ${conf.maxSworn}</div>`;
    if (!ids.length) html += `<div class="comp-empty" style="padding:22px 10px;">尚未結識任何俠客。<br>行走江湖，或許會遇到願意與你同行的人……</div>`;
    else {
      html += selected ? detailHtml(selected) : '';
      html += `<div class="comp-grid">${ids.map(id => { const c = def(id), s = st(id), pot = potentialOf(c); return `
        <div class="comp-card ${id === selected ? 'sel' : ''}" onclick="Companions.select('${id}')">
          ${companionFigureSvg(c.figure, { width: 46, height: 60 })}
          <div><b>${esc(c.name)}</b> <small class="color-${pot.rarity}">${esc(pot.name)}</small>${s.sworn ? ' <small style="color:var(--gold);">結義</small>' : ''}<br><small>${s.lv} 級・好感 ${s.affinity}</small><br><small class="comp-st">${statusText(id).replace(/<[^>]+>/g, '')}</small></div>
        </div>`; }).join('')}</div>`;
    }
    if (unmet.length) html += `<div class="comp-sub-title" style="margin-top:12px;">📜 江湖名冊（尚未結識 ${unmet.length} 人）</div>
      <div class="comp-grid">${unmet.map(c => `<div class="comp-card unmet">${companionFigureSvg(c.figure, { width: 46, height: 60, silhouette: true })}<div><b>？？？</b><br><small>${esc(c.hint || '行蹤不明')}</small></div></div>`).join('')}</div>`;
    box.innerHTML = html;
  }

  // 派遣歸來提醒（每 30 秒檢查）
  setInterval(() => {
    if (typeof player === 'undefined' || !player.companions) return;
    errandIds().forEach(id => {
      const s = st(id);
      if (Date.now() >= s.errand.until && !s.errand.notified) {
        s.errand.notified = true;
        if (typeof pushChatMessage === 'function') pushChatMessage('system', '【俠客】', `${fullName(def(id))}派遣歸來了，到「俠客」中領取收穫吧！`, '#9b59b6');
      }
    });
  }, 30000);

  return { cfg, ensureData, recruit, addAffinity, addExp, statBonus, craftBonus, forBattle, battleLine, afterBattle, stats, potentialOf,
    open, select, setSub, toggleParty, talk, giveGift, swear, startErrand, claimErrand, recallErrand, render,
    roleBase: ROLE_BASE, equip, unequip, learnSkill, studyBook, setSlot, startTrain, usePill, shareExp, trainExpPerHour, sixStats, leave, setParty, giveGearFromTemplate, say: (id, text) => { const c = def(id); if (c) say(c, 'talk', 'current', text); },
    has: id => !!(player.companions && player.companions[id]), affinityOf: id => (st(id) || {}).affinity || 0, levelOf: id => (st(id) || {}).lv || 0,
    count: () => recruitedIds().length, knows: (id, sk) => !!(st(id) && st(id).skills.includes(sk)),
    inParty: id => partyIds().includes(id), isSworn: id => swornIds().includes(id), def, fullName };
})();

window.Companions = Companions;

// 玩家修為增加時分給俠客（載入存檔時以 window.__expShareMute 暫停）
window.hookCompanionExpShare = function hookPlayerExp() {
  if (typeof player === 'undefined') return;
  const desc = Object.getOwnPropertyDescriptor(player, 'exp');
  if (desc && desc.get) return;
  let v = Number(player.exp) || 0;
  Object.defineProperty(player, 'exp', {
    enumerable: true, configurable: true,
    get() { return v; },
    set(n) {
      const d = Number(n) - v;
      v = Number(n) || 0;
      if (d > 0 && !window.__expShareMute && player.companions) { try { Companions.shareExp(d); } catch (e) { console.error(e); } }
    }
  });
};
window.companionFigureSvg = companionFigureSvg;
window.COMPANION_FIGURE_OPTIONS = COMPANION_FIGURE_OPTIONS;
window.COMPANION_ROLES = COMPANION_ROLES;
window.COMPANION_ERRANDS = COMPANION_ERRANDS;
window.COMPANION_LINE_KINDS = COMPANION_LINE_KINDS;
window.COMPANION_DEFAULT_FIGURE = COMPANION_DEFAULT_FIGURE;
window.COMPANION_POTENTIAL_DEFAULT = COMPANION_POTENTIAL_DEFAULT;
window.COMPANION_ROLE_BASE = Companions.roleBase;
