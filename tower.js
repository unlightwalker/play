/**
 * ========================================================
 * 你的江湖 - 歷練通天塔系統模組 (tower.js)
 * 1. 一般樓層自動 / 點擊攻擊，首領層須點擊「挑戰頭目」才會開戰
 * 2. 首領數值、寶箱機率與指定掉落讀取自 data_tower.js (TOWER_BOSSES)
 * 3. 雙聯情報面板、通天樓層軌道、戰利品即時於下方頻道發布通知
 * ========================================================
 */

let towerCurrentFloor = 1;
let towerMonster = null;
let towerTimer = null;
let isTowerModalOpen = false;
let isChallengingBoss = false;

const TOWER_HUMANOIDS = [
  {
    type: "bandit",
    name: "綠林悍刀客",
    svg: `<svg width="100" height="130" viewBox="0 0 100 130">
      <circle cx="50" cy="22" r="9" fill="#d35400"/>
      <path d="M40,20 L60,16 L50,12 Z" fill="#c0392b"/>
      <line x1="50" y1="31" x2="50" y2="78" stroke="#e67e22" stroke-width="5"/>
      <line x1="50" y1="42" x2="26" y2="58" stroke="#e67e22" stroke-width="4.5"/>
      <line x1="50" y1="42" x2="74" y2="52" stroke="#e67e22" stroke-width="4.5"/>
      <path d="M74,52 Q95,30 105,15" stroke="#f39c12" stroke-width="6" fill="none"/>
      <line x1="50" y1="78" x2="32" y2="122" stroke="#e67e22" stroke-width="5"/>
      <line x1="50" y1="78" x2="68" y2="122" stroke="#e67e22" stroke-width="5"/>
    </svg>`
  },
  {
    type: "swordsman",
    name: "青鋒叛門劍修",
    svg: `<svg width="100" height="130" viewBox="0 0 100 130">
      <circle cx="50" cy="22" r="9" fill="#2980b9"/>
      <circle cx="50" cy="14" r="3.5" fill="#f1c40f"/>
      <line x1="50" y1="31" x2="50" y2="78" stroke="#3498db" stroke-width="5"/>
      <line x1="50" y1="42" x2="28" y2="60" stroke="#3498db" stroke-width="4"/>
      <line x1="50" y1="42" x2="72" y2="48" stroke="#3498db" stroke-width="4"/>
      <line x1="72" y1="48" x2="108" y2="24" stroke="#5dade2" stroke-width="4"/>
      <line x1="70" y1="50" x2="74" y2="46" stroke="#fff" stroke-width="6"/>
      <line x1="50" y1="78" x2="34" y2="122" stroke="#3498db" stroke-width="5"/>
      <line x1="50" y1="78" x2="66" y2="122" stroke="#3498db" stroke-width="5"/>
    </svg>`
  },
  {
    type: "monk",
    name: "少林破戒金剛",
    svg: `<svg width="100" height="130" viewBox="0 0 100 130">
      <circle cx="50" cy="22" r="10" fill="#f39c12"/>
      <line x1="50" y1="32" x2="50" y2="80" stroke="#d35400" stroke-width="6"/>
      <circle cx="50" cy="44" r="14" fill="none" stroke="#e74c3c" stroke-width="2.5"/>
      <line x1="50" y1="45" x2="25" y2="62" stroke="#d35400" stroke-width="5"/>
      <line x1="50" y1="45" x2="75" y2="55" stroke="#d35400" stroke-width="5"/>
      <line x1="60" y1="75" x2="115" y2="20" stroke="#b87333" stroke-width="6"/>
      <line x1="50" y1="80" x2="30" y2="122" stroke="#d35400" stroke-width="6"/>
      <line x1="50" y1="80" x2="70" y2="122" stroke="#d35400" stroke-width="6"/>
    </svg>`
  },
  {
    type: "assassin",
    name: "百毒影殺死士",
    svg: `<svg width="100" height="130" viewBox="0 0 100 130">
      <circle cx="50" cy="22" r="9" fill="#8e44ad"/>
      <rect x="42" y="24" width="16" height="6" fill="#2c3e50"/>
      <line x1="50" y1="31" x2="50" y2="76" stroke="#9b59b6" stroke-width="4.5"/>
      <line x1="50" y1="40" x2="26" y2="56" stroke="#9b59b6" stroke-width="4"/>
      <line x1="50" y1="40" x2="74" y2="48" stroke="#9b59b6" stroke-width="4"/>
      <polygon points="74,48 94,40 86,54" fill="#2ecc71"/>
      <line x1="50" y1="76" x2="30" y2="120" stroke="#9b59b6" stroke-width="4.5"/>
      <line x1="50" y1="76" x2="70" y2="120" stroke="#9b59b6" stroke-width="4.5"/>
    </svg>`
  },
  {
    type: "heavy_warlord",
    name: "塞北披甲狂魔",
    svg: `<svg width="100" height="130" viewBox="0 0 100 130">
      <circle cx="50" cy="22" r="9" fill="#7f8c8d"/>
      <polygon points="40,14 60,14 50,4" fill="#95a5a6"/>
      <line x1="50" y1="31" x2="50" y2="80" stroke="#bdc3c7" stroke-width="7"/>
      <line x1="50" y1="44" x2="22" y2="60" stroke="#bdc3c7" stroke-width="6"/>
      <line x1="50" y1="44" x2="78" y2="52" stroke="#bdc3c7" stroke-width="6"/>
      <path d="M78,52 L112,22 L116,36 L86,60 Z" fill="#c0392b"/>
      <line x1="50" y1="80" x2="30" y2="124" stroke="#bdc3c7" stroke-width="6"/>
      <line x1="50" y1="80" x2="70" y2="124" stroke="#bdc3c7" stroke-width="6"/>
    </svg>`
  },
  {
    type: "boss_demon",
    name: "👑 通天魔尊・赤血魔皇",
    svg: `<svg width="100" height="130" viewBox="0 0 100 130">
      <circle cx="50" cy="22" r="10" fill="#c0392b" filter="drop-shadow(0 0 8px #ff4757)"/>
      <polygon points="36,12 50,2 64,12 50,16" fill="#f1c40f"/>
      <line x1="50" y1="32" x2="50" y2="80" stroke="#e74c3c" stroke-width="6.5"/>
      <path d="M42,34 L15,100 L36,92 L50,80 L64,92 L85,100 L58,34 Z" fill="rgba(192, 57, 43, 0.45)"/>
      <line x1="50" y1="44" x2="20" y2="60" stroke="#e74c3c" stroke-width="5"/>
      <line x1="50" y1="44" x2="80" y2="50" stroke="#e74c3c" stroke-width="5"/>
      <path d="M80,50 Q105,25 118,5" stroke="#f1c40f" stroke-width="6" fill="none"/>
      <line x1="50" y1="80" x2="28" y2="124" stroke="#e74c3c" stroke-width="6"/>
      <line x1="50" y1="80" x2="72" y2="124" stroke="#e74c3c" stroke-width="6"/>
    </svg>`
  }
];

// ==================== 成長曲線（讀取 data_tower.js 的 TOWER_REWARD_CONFIG） ====================
function towerCfg() {
  const d = { mobHp: { base: 80, mul: 14, pow: 1.6 }, exp: { base: 8, mul: 2.2, pow: 0.85 }, gold: { base: 3, mul: 0.9, pow: 0.8 },
    learn: { chanceBase: 20, chancePerFloor: 0.4, chanceMax: 60, floorsPerExtra: 25 }, bossRewardMult: 12,
    background: { intervalSec: 10, ratio: 0.5 }, clickCooldownMs: 120, attackSpeed: { min: 0.8, max: 3.2, k: 160 } };
  const c = (typeof TOWER_REWARD_CONFIG !== 'undefined' && TOWER_REWARD_CONFIG) || {};
  return { ...d, ...c, mobHp: { ...d.mobHp, ...(c.mobHp || {}) }, exp: { ...d.exp, ...(c.exp || {}) }, gold: { ...d.gold, ...(c.gold || {}) },
    learn: { ...d.learn, ...(c.learn || {}) }, background: { ...d.background, ...(c.background || {}) }, attackSpeed: { ...d.attackSpeed, ...(c.attackSpeed || {}) } };
}
const towerCurve = (f, k) => Math.floor((Number(k.base) || 0) + (Number(k.mul) || 0) * Math.pow(Math.max(1, f), Number(k.pow) || 1));
function towerMobHp(floor) { return Math.max(30, towerCurve(floor, towerCfg().mobHp)); }
function towerLearnChance(floor) { const l = towerCfg().learn; return Math.min(Number(l.chanceMax) || 60, (Number(l.chanceBase) || 0) + (Number(l.chancePerFloor) || 0) * floor); }
function towerLearnAmount(floor) { return 1 + Math.floor(floor / Math.max(1, Number(towerCfg().learn.floorsPerExtra) || 25)); }
// 天賦對通天塔的影響（收益、點擊、暴擊、回血…）
function towerBonuses() {
  const t = (typeof player !== 'undefined' && Array.isArray(player.talents)) ? player.talents : [];
  const goldTal = t.filter(x => Number(x.goldGainMult) > 0);
  const lossTal = t.filter(x => Number(x.towerExpLoss) > 0);
  return {
    goldMult: goldTal.reduce((n, x) => n * Number(x.goldGainMult), 1), goldFrom: goldTal.map(x => x.name),
    expLoss: lossTal.reduce((n, x) => n + Number(x.towerExpLoss), 0), lossFrom: lossTal.map(x => x.name),
    healPct: t.reduce((n, x) => n + (Number(x.towerHealPct) || 0), 0),
    clickHalf: t.some(x => x.towerClickHalf), lockCrit: (t.find(x => Number(x.lockCrit) > 0) || {}).lockCrit,
    chestGod: t.some(x => x.id === "t_007" || x.chestGodDoubled), skip: t.some(x => x.towerSkipFloor), list: t
  };
}
window.towerBonuses = towerBonuses;
// 一隻一般怪的收益；ratio 用於背景歷練；學點依機率給予；raw = true 時不計天賦加成
function towerKillReward(floor, ratio = 1, raw = false) {
  const c = towerCfg(), bn = raw ? { goldMult: 1, expLoss: 0 } : towerBonuses();
  const exp = Math.max(1, Math.floor(towerCurve(floor, c.exp) * ratio) - bn.expLoss);
  const gold = Math.max(0, Math.floor(towerCurve(floor, c.gold) * ratio * bn.goldMult));
  const learn = Math.random() * 100 < towerLearnChance(floor) * ratio ? towerLearnAmount(floor) : 0;
  return { exp, gold, learn };
}
// 攻擊速度曲線：身法越高越快，但會逐漸趨緩（次/秒 = 最低 +（最高 − 最低）×（1 − e^(−身法 / k)））
function towerAttacksPerSec(speed) {
  const a = towerCfg().attackSpeed;
  const s = Math.max(0, Number(speed) || 0);
  return (Number(a.min) || 0.8) + ((Number(a.max) || 3.2) - (Number(a.min) || 0.8)) * (1 - Math.exp(-s / (Number(a.k) || 160)));
}
window.towerAttacksPerSec = towerAttacksPerSec;
window.towerKillReward = towerKillReward;
window.towerMobHp = towerMobHp;

// 取得首領設定：優先讀取 data_tower.js，未設定的樓層依公式生成
function getTowerBossConfig(floor) {
  const list = (typeof TOWER_BOSSES !== 'undefined' && Array.isArray(TOWER_BOSSES)) ? TOWER_BOSSES : [];
  const cfg = list.find(b => Number(b.floor) === Number(floor));
  if (cfg) return cfg;

  const maxHp = Math.floor(250 + Math.pow(floor, 1.45) * 6.5);
  const atk = Math.floor(18 + Math.pow(floor, 1.1) * 1.05);
  const def = Math.floor(8 + Math.pow(floor, 1.05) * 0.65);
  const speed = Math.floor(32 + Math.min(60, floor * 1.0));
  // 超過 100 層：每 100 層必出神品，其餘延續 95 層的機率
  const godRate = (floor % 100 === 0) ? 100 : 5;
  return {
    floor,
    name: `第 ${floor} 層首領・混沌天尊`,
    realm: "返璞歸真",
    maxHp, atk, def, speed,
    stats: { arm: Math.floor(atk * 0.7), speed, bone: Math.floor(def * 1.5), inner: Math.floor(atk * 0.6), int: 30, luck: 25 },
    exp: towerCurve(floor, towerCfg().exp) * (Number(towerCfg().bossRewardMult) || 12),
    gold: towerCurve(floor, towerCfg().gold) * (Number(towerCfg().bossRewardMult) || 12),
    combat: 15,
    skill: { name: "降龍十八掌・亢龍有悔", baseMult: 2.8, rarity: "神品" },
    internalName: "純陽太極功",
    chest: godRate >= 100 ? { entries: [{ kind: "pool", rarity: "神品", rate: 100 }] } : { entries: [
      { kind: "pool", rarity: "神品", rate: 4.5 }, { kind: "pool", rarity: "絕品", rate: 17 }, { kind: "pool", rarity: "上品", rate: 41.5 },
      { kind: "pool", rarity: "良品", rate: 27 }, { kind: "gold", min: floor * 8, max: floor * 20, rate: 10 }] },
    drops: []
  };
}

// 寶箱內容：新格式 { entries: [...] }；舊格式（godRate / supremeRate / upperRate）自動換算
function towerChestEntries(cfg) {
  const c = (cfg && cfg.chest) || {};
  if (Array.isArray(c.entries)) return c.entries;
  const god = Number(c.godRate) || 0, sup = Math.min(100 - god, Number(c.supremeRate) || 0), rest = Math.max(0, 100 - god - sup), up = Number(c.upperRate ?? 50);
  return [["神品", god], ["絕品", sup], ["上品", rest * up / 100], ["良品", rest * (100 - up) / 100]].filter(x => x[1] > 0).map(([rarity, rate]) => ({ kind: "pool", rarity, rate }));
}
function towerChestPool(rarity) {
  return (typeof GLOBAL_ITEMS !== 'undefined') ? GLOBAL_ITEMS.filter(i => i.rarity === rarity && !i.noChest && i.type !== 'material') : [];
}
function towerEntryRarity(e) {
  if (e.kind === 'pool') return e.rarity;
  if (e.kind === 'item') { const it = findItemByRef(e.ref); return it ? it.rarity : ''; }
  if (e.kind === 'book') { const sk = findSkillByRef(e.ref); return sk ? sk.rarity : ''; }
  return '';
}
function towerEntryLabel(e) {
  if (e.kind === 'pool') return `隨機${e.rarity}裝備／靈藥`;
  if (e.kind === 'gold') return `銀兩 ${e.min ?? 0}~${e.max ?? e.min ?? 0} 兩`;
  if (e.kind === 'book') { const sk = findSkillByRef(e.ref); return sk ? `《${sk.name}秘笈》` : e.ref; }
  const it = findItemByRef(e.ref); return `${it ? it.name : e.ref}${Number(e.count) > 1 ? ` ×${e.count}` : ''}`;
}
window.towerChestEntries = towerChestEntries;

function getTowerBossEnemy(floor) {
  return buildEnemyFromData(getTowerBossConfig(floor));
}

function getTowerAverageSkillAttackPower() {
  const curW = player.equippedGear ? player.equippedGear.weapon : null;
  const activeSkills = [equippedSlots.ext0, equippedSlots.ext1].filter(Boolean);
  const usableSkills = [];

  activeSkills.forEach(sk => {
    if (typeof isSkillCompatibleWithWeapon === 'function' && isSkillCompatibleWithWeapon(sk, curW)) {
      usableSkills.push(sk);
    }
  });

  const baseAtk = player.currentAtk || player.baseAtk || 20;

  if (usableSkills.length === 0) {
    return Math.floor(baseAtk * 1.0 + (player.stats ? player.stats.arm : 20) * 0.6);
  }

  let totalPower = 0;
  usableSkills.forEach(sk => {
    const mult = (Number(sk.baseMult) || 1.3) * (1 + (sk.tier - 1) * 0.18 + (sk.progress / 100) * 0.18);
    totalPower += (baseAtk * mult + (player.stats ? player.stats.arm : 20) * 0.6);
  });

  return Math.max(10, Math.floor(totalPower / usableSkills.length));
}

function openTowerModal() {
  isTowerModalOpen = true;
  isChallengingBoss = false;
  towerCurrentFloor = player.towerFloor || 1;

  if (player.towerBgEarned && (player.towerBgEarned.kills > 0 || player.towerBgEarned.exp > 0)) {
    const bg = player.towerBgEarned;
    const msg = `少俠重回歷練塔！在背景調息間共斬獲 ${bg.kills || 0} 名試煉悍敵，累積收穫修為 +${bg.exp}、銀兩 +${bg.gold}兩、學點 +${bg.learn}！`;
    if (typeof appendCombatChat === 'function') {
      appendCombatChat("【歷練收穫】", msg, "var(--gold)");
    }
    player.towerBgEarned = { exp: 0, gold: 0, learn: 0, kills: 0 };
  }

  showStageView('tower');

  initTowerFloor(towerCurrentFloor);
  startTowerAutoAttackEngine();
}

function closeTowerModal() {
  isTowerModalOpen = false;
  isChallengingBoss = false;
  if (towerTimer) clearInterval(towerTimer);
  towerTimer = null;

  showStageView('menu');

  if (typeof refreshChatForCurrentLocation === 'function') {
    refreshChatForCurrentLocation();
  }
  if (window.Encounters) setTimeout(() => Encounters.flush(), 400);
}

function returnToTowerAfterBoss(isVictory = false) {
  isChallengingBoss = false;
  showStageView('tower');

  towerCurrentFloor = player.towerFloor || 1;
  initTowerFloor(towerCurrentFloor);

  if (!isVictory) {
    const autoBox = document.getElementById('tower-auto-advance');
    if (autoBox) autoBox.checked = false;
  }

  startTowerAutoAttackEngine();
}

function getTowerAttackSpeedInterval() {
  const currentSpeed = (player.stats && Number(player.stats.speed)) || 50;
  return Math.round(1000 / towerAttacksPerSec(currentSpeed));
}

function startTowerAutoAttackEngine() {
  if (towerTimer) clearInterval(towerTimer);
  const interval = getTowerAttackSpeedInterval();
  towerTimer = setInterval(towerAutoLoop, interval);
}

function initTowerFloor(floor) {
  const isBoss = (floor % 5 === 0);
  let baseHp = towerMobHp(floor);
  const hp = isBoss ? Math.floor(baseHp * 2.5) : baseHp;

  const template = isBoss 
    ? TOWER_HUMANOIDS[TOWER_HUMANOIDS.length - 1] 
    : TOWER_HUMANOIDS[(floor - 1) % (TOWER_HUMANOIDS.length - 1)];
  const bossCfg = isBoss ? getTowerBossConfig(floor) : null;
  const monsterHp = isBoss ? Number(bossCfg.maxHp) : Math.max(80, hp);

  towerMonster = {
    floor,
    name: isBoss ? `👑 ${bossCfg.name}` : `第 ${floor} 層・${template.name}`,
    svg: template.svg,
    isBoss,
    maxHp: monsterHp,
    hp: monsterHp
  };

  updateTowerUI();
}

function renderTowerFloorChain(curFloor) {
  const track = document.getElementById('tower-chain-track');
  if (!track) return;
  track.innerHTML = '';

  const start = Math.max(1, curFloor - 1);
  const nextBoss = Math.ceil(curFloor / 5) * 5;
  const nodes = [];

  for (let f = start; f <= Math.max(curFloor + 1, nextBoss); f++) {
    if (nodes.length >= 4) break;
    nodes.push(f);
  }
  if (!nodes.includes(nextBoss)) {
    nodes.push(nextBoss);
  }

  nodes.forEach((f, idx) => {
    const isCurrent = (f === curFloor);
    const isBoss = (f % 5 === 0);
    const d = document.createElement('div');
    d.className = `tower-chain-node ${isCurrent ? 'active-node' : ''} ${isBoss ? 'boss-node' : ''}`;
    
    if (isBoss) {
      d.innerHTML = isCurrent ? `👑【第${f}層 首領決戰】` : `👑 ${f}層 🎁`;
    } else {
      d.innerHTML = isCurrent ? `【第${f}層 當前】` : `${f}層`;
    }

    track.appendChild(d);

    if (idx < nodes.length - 1) {
      const arrow = document.createElement('span');
      arrow.style.color = '#475569';
      arrow.innerText = '➔';
      track.appendChild(arrow);
    }
  });
}

function updateTowerUI() {
  if (!towerMonster) return;
  const floor = towerMonster.floor;

  renderTowerFloorChain(floor);

  const floorEl = document.getElementById('tower-floor-title');
  const nameEl = document.getElementById('tower-target-name');
  const hpText = document.getElementById('tower-hp-text');
  const hpFill = document.getElementById('tower-hp-fill');
  const figureEl = document.getElementById('tower-enemy-figure');
  const armDmgEl = document.getElementById('tower-arm-dmg');
  const spdRateEl = document.getElementById('tower-spd-rate');
  const bossAura = document.getElementById('tower-boss-aura');
  const actionBtn = document.getElementById('btn-tower-action');

  if (floorEl) floorEl.innerText = `第 ${floor} 層 (歷史極限: 第 ${player.towerFloor} 層)`;
  if (nameEl) {
    nameEl.innerText = towerMonster.name;
    nameEl.style.color = towerMonster.isBoss ? '#f1c40f' : '#cad3df';
  }

  if (hpText) hpText.innerText = `${towerMonster.hp} / ${towerMonster.maxHp}`;
  if (hpFill) {
    const pct = Math.max(0, Math.min(100, (towerMonster.hp / towerMonster.maxHp) * 100));
    hpFill.style.width = pct + '%';
    hpFill.style.background = towerMonster.isBoss ? 'linear-gradient(90deg, #f39c12, #e74c3c)' : '#2ecc71';
  }

  if (bossAura) {
    bossAura.style.display = towerMonster.isBoss ? 'block' : 'none';
  }

  if (figureEl && figureEl.innerHTML !== towerMonster.svg) {
    figureEl.innerHTML = towerMonster.svg;
  }

  const avgPower = getTowerAverageSkillAttackPower();
  const interval = getTowerAttackSpeedInterval();
  const freqPerSec = (1000 / interval).toFixed(1);

  if (armDmgEl) armDmgEl.innerText = `${avgPower}`;
  if (spdRateEl) spdRateEl.innerText = `${(1000 / interval).toFixed(2)} 次/秒`;

  // 時收：以目前樓層的自動攻擊估算（首領層以下一層計算），並套用天賦加成
  const c = towerCfg(), bn = towerBonuses();
  const farmFloor = towerMonster.isBoss ? Math.max(1, floor - 1) : floor;
  const autoDmg = Math.max(5, Math.floor(avgPower * 0.85));
  const hitsPerKill = Math.max(1, Math.ceil(towerMobHp(farmFloor) / autoDmg));
  const killSec = (hitsPerKill * interval + 220) / 1000;
  const killsPerHour = Math.floor(3600 / killSec);
  const hrExp = Math.max(0, Math.floor((towerCurve(farmFloor, c.exp) - bn.expLoss) * killsPerHour));
  const hrGold = Math.floor(towerCurve(farmFloor, c.gold) * bn.goldMult * killsPerHour);
  const hrLearn = Math.floor(towerLearnChance(farmFloor) / 100 * towerLearnAmount(farmFloor) * killsPerHour);
  const killEl = document.getElementById('tower-kill-rate');
  if (killEl) killEl.innerText = `每隻約 ${killSec.toFixed(1)} 秒（${hitsPerKill} 擊）・約 ${killsPerHour} 隻/時`;

  const expHrEl = document.getElementById('tower-hr-exp');
  const goldHrEl = document.getElementById('tower-hr-gold');
  const lrnHrEl = document.getElementById('tower-hr-learn');
  if (expHrEl) expHrEl.innerText = `+${hrExp}/hr`;
  if (goldHrEl) goldHrEl.innerText = `+${hrGold}兩/hr`;
  if (lrnHrEl) lrnHrEl.innerText = `+${hrLearn}/hr`;

  const talentsLine = document.getElementById('tower-active-talents');
  if (talentsLine) {
    const parts = [];
    if (bn.goldMult !== 1) parts.push(`銀兩 ×${+bn.goldMult.toFixed(2)}（${bn.goldFrom.join('、')}）`);
    if (bn.expLoss) parts.push(`每隻修為 −${bn.expLoss}（${bn.lossFrom.join('、')}）`);
    if (bn.healPct) parts.push(`擊殺回血 ${Math.round(bn.healPct * 100)}%`);
    if (bn.clickHalf) parts.push('點擊威力減半');
    if (bn.lockCrit) parts.push(`暴擊率固定 ${bn.lockCrit}%`);
    if (bn.chestGod) parts.push('首領寶箱神品機率 ×2');
    if (bn.skip) parts.push('每 10 層跳過 1 層');
    const bg = c.background;
    talentsLine.innerHTML = `${parts.length ? `命格加成：${parts.join('、')}` : '命格加成：無（轉生可覺醒天賦）'}<br><span style="color:#6f7f94;">離開通天塔時背景歷練：每 ${bg.intervalSec} 秒一隻、收益 ×${bg.ratio}</span>`;
  }

  const nextBoss = Math.ceil(floor / 5) * 5;
  const remain = nextBoss - floor;
  const bossCdEl = document.getElementById('tower-boss-countdown');
  const previewText = document.getElementById('tower-boss-preview-text');

  if (bossCdEl) {
    bossCdEl.innerHTML = remain === 0 
      ? `<b style="color:#ff4757;">⚠️ 第 ${floor} 層首領坐鎮！準備好後點擊「挑戰頭目」</b>` 
      : `距離首領戰尚餘: <b style="color:var(--gold);">${remain}</b> 層`;
  }
  if (previewText) {
    // 寶箱摘要：機率最高的神品 / 絕品項目與銀兩
    const entries = towerChestEntries(getTowerBossConfig(nextBoss));
    const total = entries.reduce((n, e) => n + (Number(e.rate) || 0), 0) || 1;
    const pct = e => +(Number(e.rate) / total * 100).toFixed(1);
    const parts = [];
    const sum = r => entries.filter(e => e.kind !== 'gold' && towerEntryRarity(e) === r).reduce((n, e) => n + pct(e), 0);
    if (sum("神品") >= 100) parts.push("必出【神品】");
    else {
      ["神品", "絕品"].forEach(r => { const v = sum(r); if (v > 0) parts.push(`${r} ${+v.toFixed(1)}%`); });
      const gold = entries.filter(e => e.kind === 'gold').reduce((n, e) => n + pct(e), 0);
      if (gold > 0) parts.push(`銀兩 ${+gold.toFixed(1)}%`);
      parts.push("點擊看全部");
    }
    previewText.innerText = `第 ${nextBoss} 層寶箱：${parts.join("、")}`;
  }

  // 按鈕動態切換
  if (actionBtn) {
    if (towerMonster.isBoss) {
      actionBtn.innerHTML = `⚔️ 挑戰頭目`;
      actionBtn.style.borderColor = '#ff4757';
      actionBtn.style.color = '#ff7675';
    } else {
      actionBtn.innerHTML = `💥 催動掌力狂擊！`;
      actionBtn.style.borderColor = 'var(--gold)';
      actionBtn.style.color = 'var(--gold)';
    }
  }
}

function showNextBossLootDetail() {
  if (!towerMonster) return;
  const nextBoss = Math.ceil(towerMonster.floor / 5) * 5;
  const cfg = getTowerBossConfig(nextBoss);
  const entries = towerChestEntries(cfg);
  const total = entries.reduce((n, e) => n + (Number(e.rate) || 0), 0) || 1;
  const chestLines = entries.filter(e => Number(e.rate) > 0).map(e => `• ${towerEntryLabel(e)}（${(Number(e.rate) / total * 100).toFixed(1)}%）`).join('\n');
  const extra = (cfg.drops || []).map(d => {
    const ref = d.kind === 'book' ? findSkillByRef(d.ref) : findItemByRef(d.ref);
    const name = ref ? (d.kind === 'book' ? `《${ref.name}秘笈》` : ref.name) : d.ref;
    return `• ${name} x${d.count || 1}（${d.rate}%）`;
  }).join('\n');
  gameNotify(`🎁【${cfg.name}・掉落一覽】\n` +
        `------------------------------------\n` +
        `寶箱（必定開出以下其中一項）：\n${chestLines}\n` +
        (extra ? `首領掉落：\n${extra}\n` : '首領掉落：無\n') +
        `------------------------------------\n` +
        `擊敗該層首領時自動開啟繳獲並存入行囊！`);
}

let lastTowerClick = 0;
function strikeTowerTarget() {
  if (!towerMonster || towerMonster.hp <= 0) return;
  const now = performance.now();
  if (now - lastTowerClick < (Number(towerCfg().clickCooldownMs) || 0)) return;
  lastTowerClick = now;

  // 首領關卡：不會自動開戰，須點擊「挑戰頭目」
  if (towerMonster.isBoss) {
    spawnTowerFloatingDmg("點擊「挑戰頭目」開戰", false);
    return;
  }

  const avgPower = getTowerAverageSkillAttackPower();
  const bn = towerBonuses();
  const critRate = bn.lockCrit ? Number(bn.lockCrit) : Math.min(60, (player.stats ? player.stats.luck : 15) * 0.5 + 5);
  const isCrit = Math.random() * 100 < critRate;

  let dmg = Math.floor(avgPower * 1.5 + Math.random() * ((player.stats ? player.stats.arm : 20) * 0.5));
  if (bn.clickHalf) dmg = Math.floor(dmg * 0.5);
  if (isCrit) dmg = Math.floor(dmg * 1.8);

  dealTowerDamage(dmg, isCrit, true);
}

// 下方行動按鈕：首領層 = 挑戰頭目，一般層 = 狂擊
function onTowerActionButton() {
  if (!towerMonster) return;
  if (towerMonster.isBoss) challengeTowerBoss(towerMonster.floor);
  else strikeTowerTarget();
}

// 發起首領正式入陣戰鬥（僅由玩家點擊「挑戰頭目」觸發）
function challengeTowerBoss(floor) {
  if (isChallengingBoss) return;
  isChallengingBoss = true;

  if (towerTimer) {
    clearInterval(towerTimer);
    towerTimer = null;
  }

  try {
    startBattleAgainst(getTowerBossEnemy(floor), 'tower_boss', floor);
  } catch (err) {
    console.error("首領戰發起保護:", err);
    isChallengingBoss = false;
    showStageView('tower');
  }
}

function towerAutoLoop() {
  if (!towerMonster || towerMonster.hp <= 0 || isChallengingBoss) return;

  // 首領層等待玩家手動挑戰
  if (towerMonster.isBoss) return;

  const avgPower = getTowerAverageSkillAttackPower();
  const autoDmg = Math.max(5, Math.floor(avgPower * 0.85));
  dealTowerDamage(autoDmg, false, false);
}

function spawnTowerSlash(isCrit) {
  const container = document.getElementById('tower-slash-layer');
  if (!container) return;

  const angles = [-35, 25, -60, 45, 0, -15];
  const randAngle = angles[Math.floor(Math.random() * angles.length)];
  const colors = isCrit ? ["#ff4757", "#f1c40f"] : ["#f1c40f", "#ffffff", "#5dade2"];
  const randColor = colors[Math.floor(Math.random() * colors.length)];

  const slash = document.createElement('div');
  slash.className = 'tower-slash-arc';
  slash.style.setProperty('--slash-angle', `${randAngle}deg`);
  slash.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <path d="M10,85 Q50,20 90,15" stroke="${randColor}" stroke-width="${isCrit ? 8 : 5}" fill="none" stroke-linecap="round" filter="drop-shadow(0 0 8px ${randColor})"/>
      <path d="M25,90 Q55,35 85,25" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>
  `;
  container.appendChild(slash);

  const fig = document.getElementById('tower-enemy-figure');
  if (fig) {
    fig.classList.remove('anim-tower-recoil');
    void fig.offsetWidth;
    fig.classList.add('anim-tower-recoil');
  }

  setTimeout(() => slash.remove(), 280);
}

function dealTowerDamage(dmg, isCrit, isClick) {
  towerMonster.hp = Math.max(0, towerMonster.hp - dmg);

  spawnTowerSlash(isCrit);
  spawnTowerFloatingDmg(dmg, isCrit);
  updateTowerUI();

  if (towerMonster.hp <= 0) {
    const floor = towerMonster.floor;
    const { exp: earnExp, gold: earnGold, learn: earnLearn } = towerKillReward(floor);

    player.exp += earnExp;
    player.gold += earnGold;
    player.learn += earnLearn;
    player.combat += 1;

    if (player.talents && player.talents.some(t => t.id === "t_012")) {
      player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp * 0.05));
    }

    if (floor >= player.towerFloor) {
      player.towerFloor = floor + 1;
    }

    updateProfileUI();

    // 勾選「自動挑戰下一層」則前進（遇首領層停下等待挑戰），否則留在本層反覆歷練
    const autoBox = document.getElementById('tower-auto-advance');
    const canAdvance = autoBox ? autoBox.checked : true;
    setTimeout(() => initTowerFloor(canAdvance ? floor + 1 : floor), 220);
  }
}

function spawnTowerFloatingDmg(dmg, isCrit) {
  const container = document.getElementById('tower-target-box');
  if (!container) return;
  const p = document.createElement('div');
  p.className = `dmg-num ${isCrit ? 'dmg-crit' : 'dmg-normal'}`;
  p.innerText = (typeof dmg === 'string') ? dmg : ((isCrit ? "暴擊! -" : "-") + dmg);
  p.style.left = (30 + Math.random() * 80) + 'px';
  p.style.top = (20 + Math.random() * 40) + 'px';
  container.appendChild(p);
  setTimeout(() => p.remove(), 600);
}

function autoDropBossLootToBag(floor) {
  const cfg = getTowerBossConfig(floor);
  // 依各項機率（權重）開出一項；命格「氣運之子」使神品項目的機率加倍
  const godDouble = player.talents && player.talents.some(t => t.id === "t_007" || t.chestGodDoubled);
  const entries = towerChestEntries(cfg).filter(e => Number(e.rate) > 0)
    .map(e => ({ e, w: Number(e.rate) * (godDouble && towerEntryRarity(e) === "神品" ? 2 : 1) }));
  const total = entries.reduce((n, x) => n + x.w, 0);
  let roll = Math.random() * total, pick = entries[entries.length - 1];
  for (const x of entries) { if (roll < x.w) { pick = x; break; } roll -= x.w; }

  let gotName = null, rarity = "";
  if (pick) {
    const e = pick.e;
    if (e.kind === 'gold') {
      const lo = Math.max(0, Number(e.min) || 0), hi = Math.max(lo, Number(e.max) || lo);
      const amt = Math.floor(lo + Math.random() * (hi - lo + 1));
      player.gold += amt;
      gotName = `銀兩 ${amt} 兩`;
    } else if (e.kind === 'pool') {
      const pool = towerChestPool(e.rarity);
      const it = pool.length ? pool[Math.floor(Math.random() * pool.length)] : findItemByRef("item_snow_ginseng");
      if (it) gotName = grantLootToBag('item', it.id || it.name, 1);
      rarity = e.rarity;
    } else {
      gotName = grantLootToBag(e.kind === 'book' ? 'book' : 'item', e.ref, e.count);
      rarity = towerEntryRarity(e);
    }
  }
  const color = rarity === "神品" ? "var(--gold)" : (rarity === "絕品" ? "var(--purple)" : "var(--cyan)");
  if (gotName && typeof appendCombatChat === 'function') {
    appendCombatChat("【首領寶箱】", `擊敗第 ${floor} 層首領，寶箱開出${rarity ? `【${rarity}】` : ''}【${gotName}】${pick && pick.e.kind === 'gold' ? '' : '，已存入隨身「行囊」'}！`, color);
  }

  rollDropTable(cfg.drops, cfg.name);
  recalcPlayerStats();
}

// 背景掛機
// 背景歷練：不在通天塔時，每 background.intervalSec 秒以 ratio 倍收益結算一隻
let towerBgLast = Date.now();
setInterval(() => {
  if (isTowerModalOpen || isChallengingBoss) { towerBgLast = Date.now(); return; }
  const bg = towerCfg().background;
  if (Date.now() - towerBgLast < (Number(bg.intervalSec) || 10) * 1000) return;
  towerBgLast = Date.now();

  const curLimit = player.towerFloor || 1;
  let farmFloor = curLimit;
  if (farmFloor % 5 === 0) {
    farmFloor = Math.max(1, farmFloor - 1);
  }

  const { exp: earnExp, gold: earnGold, learn: earnLearn } = towerKillReward(farmFloor, Number(bg.ratio) || 0.5);

  player.exp += earnExp;
  player.gold += earnGold;
  player.learn += earnLearn;
  player.combat += 1;

  if (!player.towerBgEarned) {
    player.towerBgEarned = { exp: 0, gold: 0, learn: 0, kills: 0 };
  }
  player.towerBgEarned.exp += earnExp;
  player.towerBgEarned.gold += earnGold;
  player.towerBgEarned.learn += earnLearn;
  player.towerBgEarned.kills = (player.towerBgEarned.kills || 0) + 1;

  if (typeof updateProfileUI === 'function') {
    updateProfileUI();
  }
}, 1000);

window.openTowerModal = openTowerModal;
window.closeTowerModal = closeTowerModal;
window.strikeTowerTarget = strikeTowerTarget;
window.showNextBossLootDetail = showNextBossLootDetail;
window.challengeTowerBoss = challengeTowerBoss;
window.onTowerActionButton = onTowerActionButton;
window.returnToTowerAfterBoss = returnToTowerAfterBoss;
window.autoDropBossLootToBag = autoDropBossLootToBag;