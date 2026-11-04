/**
 * ========================================================
 * 你的江湖 - 系統中樞模組 (main.js) [轉生天賦與首領動態掉寶版]
 * 包含：
 * 1. 玩家狀態模型（六維分解：先天 + 功法 + 奇遇 + 裝備 + 天賦）
 * 2. 歷練通天塔：身法決定攻速、臂力決定單擊、刀光特效與受創震顫
 * 3. 首領通天秘寶匣：神品(0.2%*層數)、絕品(2%*層數)動態結算與開箱
 * 4. 轉生重置通天塔層數、天賦繼承與屬性全域結算
 * 5. 悟性催化打坐調息產出修為與學點
 * 6. 存檔中樞（6.0s倒數提示、跨版本相容、離線收益）
 * ========================================================
 */

// ==================== 1. 玩家狀態模型與資料消毒 ====================
var player = {
  name: "無名少俠",
  avatarId: 0,
  curLoc: "牛家村",
  sect: "無門無派",
  sectRank: "無",
  reincarnations: 0,
  talents: [], // 當前生效的轉生天賦
  claimedMails: [],
  lastSectClaimTime: 0,
  towerFloor: 1,
  statsInnate: { arm: 15, speed: 40, bone: 15, inner: 10, int: 25, luck: 18 },
  statsEncounter: { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 },
  stats: { arm: 22, speed: 55, bone: 24, inner: 20, int: 25, luck: 18 },
  statSources: {},
  baseMaxHp: 300,
  maxHp: 350,
  hp: 350,
  baseAtk: 20,
  baseDef: 6,
  def: 10,
  baseSpeed: 40,
  speed: 55,
  exp: 120,
  learn: 120,
  combat: 15,
  gold: 80,
  spGauge: 0,
  equippedGear: { weapon: null, armor: null },
  inventory: []
};

var equippedSlots = { internal: null, qinggong: null, ext0: null, ext1: null };
var myLearnedKungfu = [];

function sanitizePlayerData() {
  if (!player.statsInnate) player.statsInnate = { arm: 15, speed: 40, bone: 15, inner: 10, int: 25, luck: 18 };
  if (!player.statsEncounter) player.statsEncounter = { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 };
  if (!player.stats) player.stats = { ...player.statsInnate };

  ['arm', 'speed', 'bone', 'inner', 'int', 'luck'].forEach(k => {
    player.statsInnate[k] = Number(player.statsInnate[k]) || 15;
    player.statsEncounter[k] = Number(player.statsEncounter[k]) || 0;
  });

  player.baseMaxHp = Number(player.baseMaxHp) || 300;
  player.baseDef = Number(player.baseDef) || 6;
  player.baseSpeed = Number(player.baseSpeed) || 40;
  player.baseAtk = Number(player.baseAtk) || 20;
  player.reincarnations = Number(player.reincarnations) || 0;
  player.avatarId = Number(player.avatarId) >= 0 ? Number(player.avatarId) : 0;
  player.towerFloor = Number(player.towerFloor) >= 1 ? Number(player.towerFloor) : 1;
  player.lastSectClaimTime = Number(player.lastSectClaimTime) || 0;
  player.gold = Number(player.gold) >= 0 ? Number(player.gold) : 80;
  player.exp = Number(player.exp) >= 0 ? Number(player.exp) : 120;
  player.learn = Number(player.learn) >= 0 ? Number(player.learn) : 120;
  player.combat = Number(player.combat) >= 0 ? Number(player.combat) : 15;

  if (!Array.isArray(player.talents)) player.talents = [];

  if (!player.equippedGear || typeof player.equippedGear !== 'object') player.equippedGear = {};
  if (!player.equippedGear.weapon) {
    player.equippedGear.weapon = { id: "w_init", name: "粗製木劍", type: "weapon", weaponType: "劍", rarity: "凡品", atk: 6, speed: 0, desc: "外攻 +6" };
  } else {
    player.equippedGear.weapon.weaponType = (typeof getWeaponType === 'function') ? getWeaponType(player.equippedGear.weapon) : "劍";
  }
  if (!player.equippedGear.armor) {
    player.equippedGear.armor = { id: "a_init", name: "粗麻布衣", type: "armor", rarity: "凡品", def: 4, hp: 40, desc: "防禦 +4，氣血 +40" };
  }

  if (!Array.isArray(player.inventory)) player.inventory = [];
  player.inventory = player.inventory.filter(it => it && typeof it === 'object').map(item => {
    if (item.type === 'weapon' && typeof getWeaponType === 'function') item.weaponType = getWeaponType(item);
    return item;
  });

  if (!Array.isArray(player.claimedMails)) player.claimedMails = [];
  if (!player.curLoc || typeof WORLD_MAP === 'undefined' || !WORLD_MAP[player.curLoc]) {
    player.curLoc = "牛家村";
  }

  if (!Array.isArray(myLearnedKungfu) || myLearnedKungfu.length === 0) {
    myLearnedKungfu = (typeof GLOBAL_SKILLS !== 'undefined') ? [
      GLOBAL_SKILLS[0], GLOBAL_SKILLS[1], GLOBAL_SKILLS[2], GLOBAL_SKILLS[3]
    ] : [];
  }

  if (!equippedSlots || typeof equippedSlots !== 'object') {
    equippedSlots = { internal: null, qinggong: null, ext0: null, ext1: null };
  }
  if (!equippedSlots.internal) equippedSlots.internal = myLearnedKungfu.find(k => k.type === 'internal') || null;
  if (!equippedSlots.qinggong) equippedSlots.qinggong = myLearnedKungfu.find(k => k.type === 'qinggong') || null;
  if (!equippedSlots.ext0) equippedSlots.ext0 = myLearnedKungfu.find(k => k.type === 'external') || null;
  if (!equippedSlots.ext1) {
    const extList = myLearnedKungfu.filter(k => k.type === 'external' && k !== equippedSlots.ext0);
    equippedSlots.ext1 = extList.length > 0 ? extList[0] : null;
  }
}

// ==================== 2. 全面屬性結算 (含轉生天賦) ====================
function recalcPlayerStats() {
  sanitizePlayerData();

  // 1. 裝備加成
  const statsGear = { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 };
  let gearAtk = 0, gearDef = 0, gearHp = 0;

  if (player.equippedGear.weapon) {
    const w = player.equippedGear.weapon;
    gearAtk += Number(w.atk) || 0;
    statsGear.speed += Number(w.speed) || 0;
    if (w.statBonus) {
      for (let k in w.statBonus) statsGear[k] = (statsGear[k] || 0) + (w.statBonus[k] || 0);
    }
  }
  if (player.equippedGear.armor) {
    const a = player.equippedGear.armor;
    gearDef += Number(a.def) || 0;
    gearHp += Number(a.hp) || 0;
    if (a.statBonus) {
      for (let k in a.statBonus) statsGear[k] = (statsGear[k] || 0) + (a.statBonus[k] || 0);
    }
  }

  // 2. 武學加成
  const statsKungfu = { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 };
  let kfHp = 0, kfDef = 0;

  const activeSkills = [equippedSlots.internal, equippedSlots.qinggong, equippedSlots.ext0, equippedSlots.ext1].filter(Boolean);
  activeSkills.forEach(kf => {
    const mult = 1 + (kf.tier - 1) * 0.2 + (kf.progress / 100) * 0.2;
    if (kf.statBonus) {
      for (let k in kf.statBonus) {
        if (k !== 'int' && k !== 'luck') {
          statsKungfu[k] += Math.floor(kf.statBonus[k] * mult);
        }
      }
    }
    if (kf.type === 'internal') {
      kfHp += Math.floor((Number(kf.baseHpBonus) || 50) * mult);
      kfDef += Math.floor((Number(kf.baseDefBonus) || 4) * mult);
    }
    if (kf.type === 'qinggong') {
      statsKungfu.speed += Math.floor((Number(kf.baseSpeedBonus) || 12) * mult);
    }
  });

  myLearnedKungfu.forEach(kf => {
    const passiveAdd = Math.floor(kf.tier / 3);
    if (passiveAdd > 0 && kf.statBonus) {
      for (let k in kf.statBonus) {
        if (k !== 'int' && k !== 'luck') {
          statsKungfu[k] += passiveAdd;
        }
      }
    }
  });

  // 3. 轉生天賦六維加成與特殊機制加成
  const statsTalent = { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 };
  let talentHpAdd = 0, talentDefAdd = 0, talentHpPct = 0;

  if (Array.isArray(player.talents)) {
    player.talents.forEach(t => {
      if (t.stats) {
        for (let k in t.stats) {
          statsTalent[k] = (statsTalent[k] || 0) + (t.stats[k] || 0);
        }
      }
      if (t.hpAdd) talentHpAdd += t.hpAdd;
      if (t.defAdd) talentDefAdd += t.defAdd;
      if (t.hpPct) talentHpPct += t.hpPct;
    });
  }

  // 4. 六維綜合分解結算
  player.statSources = {};
  ['arm', 'speed', 'bone', 'inner', 'int', 'luck'].forEach(k => {
    const innate = player.statsInnate[k] || 0;
    const kf = statsKungfu[k] || 0;
    const enc = player.statsEncounter[k] || 0;
    const gear = statsGear[k] || 0;
    const tal = statsTalent[k] || 0;
    player.stats[k] = innate + kf + enc + gear + tal;
    player.statSources[k] = { innate, kf, enc, gear, talent: tal, total: player.stats[k] };
  });

  const boneHp = player.stats.bone * 6;
  const boneDef = Math.floor(player.stats.bone * 0.5);

  let rawMaxHp = player.baseMaxHp + gearHp + kfHp + boneHp + talentHpAdd;
  if (talentHpPct !== 0) {
    rawMaxHp = Math.floor(rawMaxHp * (1 + talentHpPct));
  }
  player.maxHp = Math.max(100, rawMaxHp);

  player.def = Math.max(1, player.baseDef + gearDef + kfDef + boneDef + talentDefAdd);
  player.speed = Math.max(10, player.stats.speed);
  player.currentAtk = Math.max(5, player.baseAtk + gearAtk + Math.floor(player.stats.arm * 0.65));

  if (!player.hp || isNaN(player.hp) || player.hp > player.maxHp) player.hp = player.maxHp;

  updateWeaponSVG();
  updateProfileUI();
  updateMailUI();
  autoSave();
}

function updateProfileUI() {
  const nameEl = document.getElementById('disp-name');
  const locEl = document.getElementById('disp-loc');
  const spdEl = document.getElementById('disp-speed');
  const atkEl = document.getElementById('disp-atk');
  const avEl = document.getElementById('avatar-img-disp');
  const reinLabel = document.getElementById('avatar-reincarnation-label');
  const reinTag = document.getElementById('disp-reincarnation');
  const reinBtn = document.getElementById('reincarnate-count-btn');
  const wEl = document.getElementById('disp-weapon');
  const hpEl = document.getElementById('disp-hp');
  const expEl = document.getElementById('res-exp');
  const lrnEl = document.getElementById('res-learn');
  const cbtEl = document.getElementById('res-combat');
  const gldEl = document.getElementById('res-gold');
  const sEl = document.getElementById('disp-sect');

  if (nameEl) nameEl.innerText = player.name;
  if (locEl) locEl.innerText = player.curLoc;
  if (spdEl) spdEl.innerText = player.speed;
  if (atkEl) atkEl.innerText = player.currentAtk || player.baseAtk;

  const avatarList = (typeof WUXIA_AVATARS !== 'undefined') ? WUXIA_AVATARS : (window.WUXIA_AVATARS || []);
  const curAv = avatarList[player.avatarId] || avatarList[0];
  if (avEl && curAv) avEl.innerHTML = curAv.svg;

  if (reinLabel) reinLabel.innerText = `第 ${player.reincarnations + 1} 世`;
  if (reinTag) reinTag.innerText = `第 ${player.reincarnations + 1} 世`;
  if (reinBtn) reinBtn.innerText = `${player.reincarnations + 1}`;

  const w = player.equippedGear ? player.equippedGear.weapon : null;
  const wType = (typeof getWeaponType === 'function') ? getWeaponType(w) : "拳";
  if (wEl) wEl.innerText = w ? `${w.name} (${wType})` : "空手 (拳)";
  if (hpEl) hpEl.innerText = `${player.hp} / ${player.maxHp}`;
  if (expEl) expEl.innerText = player.exp;
  if (lrnEl) lrnEl.innerText = player.learn;
  if (cbtEl) cbtEl.innerText = player.combat;
  if (gldEl) gldEl.innerText = `${player.gold}兩`;

  if (sEl) {
    if (player.sect !== "無門無派") {
      sEl.innerText = `${player.sect} (${player.sectRank})`;
      sEl.className = "val-sect";
    } else {
      sEl.innerText = "無門無派";
      sEl.className = "val-none";
    }
  }
}

function updateWeaponSVG() {
  const container = document.getElementById('stick-player-weapon');
  const leftArm = document.getElementById('p-left-arm-line');
  if (!container) return;

  const w = player.equippedGear ? player.equippedGear.weapon : null;
  const wType = (typeof getWeaponType === 'function') ? getWeaponType(w) : "拳";

  if (wType === "暗器") {
    if (leftArm) {
      leftArm.setAttribute('x1', '50');
      leftArm.setAttribute('y1', '38');
      leftArm.setAttribute('x2', '45');
      leftArm.setAttribute('y2', '65');
    }
    container.innerHTML = `
      <g class="tossing-coin">
        <circle cx="75" cy="44" r="5" fill="#f1c40f" stroke="#e67e22" stroke-width="1.5"/>
        <path d="M73,42 L77,46 M77,42 L73,46" stroke="#b8860b" stroke-width="1"/>
      </g>
    `;
  } else {
    if (leftArm) {
      leftArm.setAttribute('x1', '50');
      leftArm.setAttribute('y1', '38');
      leftArm.setAttribute('x2', '28');
      leftArm.setAttribute('y2', '56');
    }

    if (wType === "劍") {
      container.innerHTML = `<line x1="84" y1="40" x2="114" y2="18" stroke="#f1c40f" stroke-width="4.5"/><line x1="81" y1="43" x2="87" y2="37" stroke="#ffffff" stroke-width="6"/>`;
    } else if (wType === "刀") {
      container.innerHTML = `<path d="M84,40 Q105,25 118,10" stroke="#f39c12" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    } else if (wType === "棍") {
      container.innerHTML = `<line x1="58" y1="62" x2="124" y2="8" stroke="#b87333" stroke-width="5" stroke-linecap="round"/>`;
    } else {
      container.innerHTML = `<circle cx="86" cy="40" r="5" fill="#f1c40f" stroke="#ffffff" stroke-width="1.5"/>`;
    }
  }
}

// ==================== 3. 打坐系統 (悟性催化產出學點) ====================
var meditateTimer = null;
var currentSessionExp = 0;
var currentSessionLearn = 0;
var meditateTickCounter = 0;

function openMeditateModal() {
  currentSessionExp = 0;
  currentSessionLearn = 0;
  meditateTickCounter = 0;

  const gainEl = document.getElementById('meditate-exp-gain');
  const mentalEl = document.getElementById('meditate-mental-name');
  if (gainEl) gainEl.innerText = "+0 修為 | +0 學點";
  if (mentalEl) mentalEl.innerText = equippedSlots.internal ? equippedSlots.internal.name : "自然吐納";
  openModal('modal-meditate');

  if (meditateTimer) clearInterval(meditateTimer);
  meditateTimer = setInterval(() => {
    let addExp = 2 + Math.floor(player.stats.int * 0.12);
    if (equippedSlots.internal) addExp += Math.floor(equippedSlots.internal.tier * 0.8);
    
    // 天賦【大道自然】修煉產出翻倍
    if (player.talents && player.talents.some(t => t.id === "t_020")) {
      addExp = Math.floor(addExp * 2.0);
    }

    player.exp += addExp;
    currentSessionExp += addExp;

    meditateTickCounter++;
    const learnInterval = Math.max(2, Math.floor(7 - player.stats.int * 0.1));
    if (meditateTickCounter % learnInterval === 0) {
      player.learn += 1;
      currentSessionLearn += 1;
    }

    if (gainEl) {
      gainEl.innerText = `+${currentSessionExp} 修為 | +${currentSessionLearn} 學點 (悟性催化)`;
    }
    updateProfileUI();
  }, 1000);
}

function closeMeditateModal() {
  if (meditateTimer) clearInterval(meditateTimer);
  meditateTimer = null;
  closeModal('modal-meditate');
}

// ==================== 4. 無盡歷練與通天首領秘寶匣 ====================
let towerCurrentFloor = 1;
let towerMonster = null;
let towerTimer = null;
let towerBossSeconds = 30;
let pendingChestReward = null;

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

function openTowerModal() {
  towerCurrentFloor = player.towerFloor || 1;
  initTowerFloor(towerCurrentFloor);
  openModal('modal-tower');
  startTowerAutoAttackEngine();
}

function closeTowerModal() {
  if (towerTimer) clearInterval(towerTimer);
  towerTimer = null;
  closeModal('modal-tower');
}

function getTowerAttackSpeedInterval() {
  const currentSpeed = (player.stats && Number(player.stats.speed)) || 50;
  return Math.max(100, Math.floor(750 - currentSpeed * 4.2));
}

function startTowerAutoAttackEngine() {
  if (towerTimer) clearInterval(towerTimer);
  const interval = getTowerAttackSpeedInterval();
  towerTimer = setInterval(towerAutoLoop, interval);
}

function initTowerFloor(floor) {
  const isBoss = (floor % 5 === 0);
  const baseHp = Math.floor(120 * Math.pow(1.18, floor - 1));
  const hp = isBoss ? baseHp * 2.8 : baseHp;

  let humanoidTemplate = null;
  if (isBoss) {
    humanoidTemplate = TOWER_HUMANOIDS[5];
  } else {
    humanoidTemplate = TOWER_HUMANOIDS[(floor - 1) % (TOWER_HUMANOIDS.length - 1)];
  }

  towerMonster = {
    floor,
    name: isBoss ? `👑 第 ${floor} 層首領・${humanoidTemplate.name}` : `第 ${floor} 層・${humanoidTemplate.name}`,
    svg: humanoidTemplate.svg,
    isBoss,
    maxHp: Math.max(80, Math.floor(hp)),
    hp: Math.max(80, Math.floor(hp))
  };

  towerBossSeconds = 30;
  updateTowerUI();
}

function updateTowerUI() {
  if (!towerMonster) return;
  const floorEl = document.getElementById('tower-floor-title');
  const nameEl = document.getElementById('tower-target-name');
  const hpText = document.getElementById('tower-hp-text');
  const hpFill = document.getElementById('tower-hp-fill');
  const figureEl = document.getElementById('tower-enemy-figure');
  const bossTimerEl = document.getElementById('tower-boss-timer');
  const armDmgEl = document.getElementById('tower-arm-dmg');
  const spdRateEl = document.getElementById('tower-spd-rate');

  if (floorEl) floorEl.innerText = `第 ${towerMonster.floor} 層 (歷史極限: 第 ${player.towerFloor} 層)`;
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

  if (figureEl && figureEl.innerHTML !== towerMonster.svg) {
    figureEl.innerHTML = towerMonster.svg;
  }

  const currentArm = (player.stats && Number(player.stats.arm)) || 20;
  const currentSpeed = (player.stats && Number(player.stats.speed)) || 50;
  const clickDmgEstimate = Math.floor(currentArm * 4.2 + (player.currentAtk || player.baseAtk) * 1.5);
  const interval = getTowerAttackSpeedInterval();
  const freqPerSec = (1000 / interval).toFixed(1);

  if (armDmgEl) armDmgEl.innerText = `${clickDmgEstimate} 威力`;
  if (spdRateEl) spdRateEl.innerText = `${freqPerSec} 次/秒 (${interval}ms)`;

  if (bossTimerEl) {
    if (towerMonster.isBoss) {
      bossTimerEl.style.display = 'inline-block';
      bossTimerEl.innerText = `⏳ 首領狂暴倒數: ${Math.ceil(towerBossSeconds)}s`;
    } else {
      bossTimerEl.style.display = 'none';
    }
  }
}

function strikeTowerTarget() {
  if (!towerMonster || towerMonster.hp <= 0) return;

  const currentArm = (player.stats && Number(player.stats.arm)) || 20;
  const isCrit = Math.random() * 100 < (player.stats.luck * 0.5 + 5);

  let dmg = Math.floor(currentArm * 4.2 + (player.currentAtk || player.baseAtk) * 1.5 + Math.random() * (currentArm * 0.8));
  if (isCrit) dmg = Math.floor(dmg * 1.8);

  dealTowerDamage(dmg, isCrit, true);
}

function towerAutoLoop() {
  if (!towerMonster || towerMonster.hp <= 0) return;

  if (towerMonster.isBoss) {
    const intervalSec = getTowerAttackSpeedInterval() / 1000;
    towerBossSeconds -= intervalSec;
    if (towerBossSeconds <= 0) {
      alert("⚠️ 首領狂暴震天一吼將你震退！時間耗盡，自動退回上一層修整！");
      initTowerFloor(Math.max(1, towerMonster.floor - 1));
      return;
    }
  }

  const currentArm = (player.stats && Number(player.stats.arm)) || 20;
  const autoDmg = Math.max(3, Math.floor(currentArm * 1.6 + (player.currentAtk || player.baseAtk) * 0.6));
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
    const isBoss = towerMonster.isBoss;
    const earnExp = Math.floor(15 + floor * 4);
    const earnGold = Math.floor(5 + floor * 2);
    const earnLearn = Math.max(1, Math.floor(floor / 3));

    player.exp += earnExp;
    player.gold += earnGold;
    player.learn += earnLearn;
    player.combat += 1;

    // 天賦【通天徹地】每擊敗 1 名敵人回血 5%
    if (player.talents && player.talents.some(t => t.id === "t_012")) {
      player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp * 0.05));
    }

    if (floor >= player.towerFloor) {
      player.towerFloor = floor + 1;
    }

    updateProfileUI();

    // 擊敗首領 BOSS 觸發專屬戰利品寶箱
    if (isBoss) {
      setTimeout(() => {
        triggerBossChest(floor);
      }, 350);
    }

    const autoBox = document.getElementById('tower-auto-advance');
    const canAdvance = autoBox ? autoBox.checked : true;

    if (canAdvance) {
      setTimeout(() => initTowerFloor(floor + 1), 220);
    } else {
      setTimeout(() => initTowerFloor(floor), 220);
    }
  }
}

function spawnTowerFloatingDmg(dmg, isCrit) {
  const container = document.getElementById('tower-target-box');
  if (!container) return;
  const p = document.createElement('div');
  p.className = `dmg-num ${isCrit ? 'dmg-crit' : 'dmg-normal'}`;
  p.innerText = (isCrit ? "暴擊! -" : "-") + dmg;
  p.style.left = (30 + Math.random() * 80) + 'px';
  p.style.top = (20 + Math.random() * 40) + 'px';
  container.appendChild(p);
  setTimeout(() => p.remove(), 600);
}

// ==================== 5. 通天首領秘寶開箱 (神品 0.2%*層數、絕品 2%*層數) ====================
function triggerBossChest(floor) {
  pendingChestReward = { floor };
  const numEl = document.getElementById('chest-floor-num');
  const resBox = document.getElementById('chest-result-box');
  const openBtn = document.getElementById('btn-open-chest');
  const icon = document.getElementById('chest-icon');

  if (numEl) numEl.innerText = floor;
  if (resBox) {
    resBox.style.display = 'none';
    resBox.innerHTML = '';
  }
  if (openBtn) {
    openBtn.style.display = 'block';
    openBtn.innerText = "✨ 破開禁制・開啟秘寶匣！";
    openBtn.disabled = false;
    openBtn.onclick = openTowerChest;
  }
  if (icon) icon.innerText = "📦";

  openModal('modal-chest');
}

function openTowerChest() {
  if (!pendingChestReward) return;
  const floor = pendingChestReward.floor;
  const openBtn = document.getElementById('btn-open-chest');
  const resBox = document.getElementById('chest-result-box');
  const icon = document.getElementById('chest-icon');

  if (openBtn) openBtn.disabled = true;

  // 1. 基礎資源掉落 (隨層數成長)
  let droppedGold = Math.floor(30 + floor * 10 + Math.random() * 25);
  let droppedExp = Math.floor(60 + floor * 20);
  let droppedLearn = Math.floor(15 + floor * 4);

  player.gold += droppedGold;
  player.exp += droppedExp;
  player.learn += droppedLearn;

  // 2. 動態機率計算：神品 0.2% * floor，絕品 2.0% * floor
  let godRate = Math.min(100, 0.2 * floor);
  // 天賦【氣運之子】神品掉率翻倍
  if (player.talents && player.talents.some(t => t.id === "t_007")) {
    godRate = Math.min(100, godRate * 2.0);
  }
  const supremeRate = Math.min(100 - godRate, 2.0 * floor);

  const roll = Math.random() * 100;

  let targetRarity = "良品";
  if (roll < godRate) {
    targetRarity = "神品";
  } else if (roll < godRate + supremeRate) {
    targetRarity = "絕品";
  } else {
    targetRarity = (Math.random() * 100 < Math.min(70, 20 + floor * 1.5)) ? "上品" : "良品";
  }

  if (icon) {
    if (targetRarity === "神品") icon.innerText = "🌟";
    else if (targetRarity === "絕品") icon.innerText = "✨";
    else icon.innerText = "🎁";
  }

  let rewardHtml = `
    <div style="color:var(--gold); font-weight:bold; margin-bottom:6px;">
      🎁 第 ${floor} 層首領秘寶開啟！
      <span style="font-size:11px; color:#aaa; font-weight:normal;">[神品率: ${godRate.toFixed(1)}% | 絕品率: ${supremeRate.toFixed(1)}%]</span>
    </div>
    <div style="font-size:12px; color:#cfd9e6; line-height:1.7;">
      • 繳獲碎銀：<b style="color:var(--gold);">+${droppedGold} 兩</b><br>
      • 汲取修為：<b style="color:#f1c40f;">+${droppedExp} 點</b><br>
      • 體悟學點：<b style="color:var(--cyan);">+${droppedLearn} 點</b><br>
  `;

  // 3. 戰利品類型判定：50% 武學殘卷 / 50% 神兵護甲靈藥
  const isSkillDrop = Math.random() < 0.5;

  if (isSkillDrop) {
    const skillsOfTier = (typeof GLOBAL_SKILLS !== 'undefined')
      ? GLOBAL_SKILLS.filter(s => s.rarity === targetRarity)
      : [];

    const pickedSkill = (skillsOfTier.length > 0)
      ? skillsOfTier[Math.floor(Math.random() * skillsOfTier.length)]
      : (typeof GLOBAL_SKILLS !== 'undefined' ? GLOBAL_SKILLS[0] : null);

    if (pickedSkill) {
      const alreadyLearned = myLearnedKungfu.some(k => k.name === pickedSkill.name);

      if (!alreadyLearned) {
        myLearnedKungfu.push({
          ...pickedSkill,
          id: "kf_drop_" + Date.now(),
          tier: 1,
          progress: 0
        });
        rewardHtml += `• <span class="rarity-badge rarity-${targetRarity}">【${targetRarity}武學出世】</span> 習得絕技【<b style="color:#fff;">${pickedSkill.name}</b>】（需${pickedSkill.weaponReq}）！<br>`;
      } else {
        const bonusLearn = (targetRarity === "神品") ? 180 : (targetRarity === "絕品" ? 100 : 50);
        player.learn += bonusLearn;
        rewardHtml += `• <span style="color:#9b59b6; font-weight:bold;">【武學重悟】</span> 翻閱【${pickedSkill.name}】精妙殘卷，觸類旁通，額外獲取 <b style="color:var(--cyan);">+${bonusLearn} 學點</b>！<br>`;
      }
    }
  } else {
    const itemsOfTier = (typeof GLOBAL_ITEMS !== 'undefined')
      ? GLOBAL_ITEMS.filter(i => i.rarity === targetRarity)
      : [];

    let pickedItem = null;
    if (itemsOfTier.length > 0) {
      pickedItem = { ...itemsOfTier[Math.floor(Math.random() * itemsOfTier.length)] };
    } else {
      pickedItem = {
        name: "千年雪參丸", type: "pill", rarity: "絕品",
        hpAdd: 250, speedAdd: 15, expAdd: 250, cost: 200,
        desc: "極品雪參靈丹，永久氣血+250，身法+15，修為+250！"
      };
    }

    if (pickedItem.type === 'pill') {
      const existing = player.inventory.find(i => i.name === pickedItem.name);
      if (existing) {
        existing.count = (existing.count || 1) + 1;
      } else {
        player.inventory.push({ ...pickedItem, id: "drop_" + Date.now(), count: 1 });
      }
      rewardHtml += `• <span class="rarity-badge rarity-${targetRarity}">【${targetRarity}奇珍】</span> 拾得靈丹【<b style="color:#fff;">${pickedItem.name}</b>】已放入行囊！<br>`;
    } else {
      player.inventory.push({ ...pickedItem, id: "drop_" + Date.now() });
      rewardHtml += `• <span class="rarity-badge rarity-${targetRarity}">【${targetRarity}神兵】</span> 繳獲【<b style="color:#fff;">${pickedItem.name}</b>】已放入行囊！<br>`;
    }
  }

  rewardHtml += `</div>`;
  if (resBox) {
    resBox.innerHTML = rewardHtml;
    resBox.style.display = 'block';
  }

  if (openBtn) {
    openBtn.innerText = "✔ 收下寶物";
    openBtn.disabled = false;
    openBtn.onclick = () => {
      closeModal('modal-chest');
      recalcPlayerStats();
    };
  }

  recalcPlayerStats();
}

// ==================== 6. 存檔倒數 [6.0s] 提示 ====================
var saveCountdown = 6.0;

function tickSaveCountdown() {
  saveCountdown -= 0.1;
  const indicator = document.getElementById('save-indicator');
  if (saveCountdown <= 0.05) {
    autoSave();
    if (indicator) {
      indicator.innerText = "[存]";
      indicator.style.color = "#f1c40f";
    }
    saveCountdown = 6.0;
    setTimeout(() => {
      if (indicator) indicator.style.color = "#2ecc71";
    }, 500);
  } else {
    if (indicator) {
      indicator.innerText = `[${saveCountdown.toFixed(1)}s]`;
    }
  }
}
setInterval(tickSaveCountdown, 100);

// ==================== 7. 存檔讀檔中樞 ====================
const MASTER_SAVE_KEY = "WUXIA_MASTER_SAVE";
const HISTORICAL_KEYS = [
  "WUXIA_MASTER_SAVE",
  "WUXIA_YOUR_JIANGHU_SAVE_V7",
  "WUXIA_YOUR_JIANGHU_SAVE_V6",
  "WUXIA_YOUR_JIANGHU_SAVE_V5",
  "WUXIA_YOUR_JIANGHU_SAVE_V4"
];

function autoSave() {
  const saveData = {
    player,
    equippedSlots: {
      internalId: equippedSlots.internal ? equippedSlots.internal.id : null,
      qinggongId: equippedSlots.qinggong ? equippedSlots.qinggong.id : null,
      ext0Id: equippedSlots.ext0 ? equippedSlots.ext0.id : null,
      ext1Id: equippedSlots.ext1 ? equippedSlots.ext1.id : null
    },
    myLearnedKungfu,
    saveTimestamp: Date.now()
  };
  localStorage.setItem(MASTER_SAVE_KEY, JSON.stringify(saveData));
}

function loadSavedGame() {
  let raw = null;
  for (let k of HISTORICAL_KEYS) {
    const s = localStorage.getItem(k);
    if (s) { raw = s; break; }
  }
  if (!raw) {
    sanitizePlayerData();
    return false;
  }

  try {
    const data = JSON.parse(raw);
    if (data && data.player) {
      player = Object.assign(player, data.player);
    }
    if (data && Array.isArray(data.myLearnedKungfu) && data.myLearnedKungfu.length > 0) {
      myLearnedKungfu = data.myLearnedKungfu;
    }
    if (data && data.equippedSlots) {
      equippedSlots.internal = myLearnedKungfu.find(k => k.id === data.equippedSlots.internalId) || null;
      equippedSlots.qinggong = myLearnedKungfu.find(k => k.id === data.equippedSlots.qinggongId) || null;
      equippedSlots.ext0 = myLearnedKungfu.find(k => k.id === data.equippedSlots.ext0Id) || null;
      equippedSlots.ext1 = myLearnedKungfu.find(k => k.id === data.equippedSlots.ext1Id) || null;
    }

    sanitizePlayerData();

    const offlineSeconds = Math.floor((Date.now() - (data.saveTimestamp || Date.now())) / 1000);
    if (offlineSeconds > 20) {
      const offlineExp = Math.min(600, Math.floor(offlineSeconds / 10));
      player.exp += offlineExp;
      setTimeout(() => {
        alert(`🌙 離線調息結算：獲得修為 +${offlineExp} 點！`);
      }, 400);
    }
    return true;
  } catch (e) {
    console.error("跨版本存檔解析重置", e);
    sanitizePlayerData();
    return false;
  }
}

// ==================== 8. 信件與活動禮包 ====================
function openMailModal() {
  updateMailUI();
  openModal('modal-mail');
}

function updateMailUI() {
  const isClaimed = Array.isArray(player.claimedMails) && player.claimedMails.includes('tangmen_launch');
  const btn = document.getElementById('btn-claim-mail');
  const dot = document.getElementById('mail-red-dot');

  if (btn) {
    if (isClaimed) {
      btn.disabled = true;
      btn.innerText = "✔ 附件已領取";
      btn.style.opacity = "0.5";
      btn.style.borderColor = "#555";
      btn.style.color = "#888";
    } else {
      btn.disabled = false;
      btn.innerText = "🎁 一鍵領取附件";
      btn.style.opacity = "1";
      btn.style.borderColor = "#2ecc71";
      btn.style.color = "#2ecc71";
    }
  }
  if (dot) dot.style.display = isClaimed ? "none" : "block";
}

function claimTangmenLaunchGift() {
  if (player.claimedMails && player.claimedMails.includes('tangmen_launch')) {
    alert("少俠已領取過這封信件的附件了！");
    return;
  }
  if (!Array.isArray(player.claimedMails)) player.claimedMails = [];
  player.claimedMails.push('tangmen_launch');

  const coinTemplate = (typeof GLOBAL_ITEMS !== 'undefined') ? GLOBAL_ITEMS.find(i => i.name === "台幣50元") : null;
  const coin = coinTemplate ? { ...coinTemplate } : {
    name: "台幣50元", type: "weapon", weaponType: "暗器", rarity: "良品",
    atk: 20, speed: 8, def: 0, hp: 0, desc: "【活動限定】金光燦爛的五十元硬幣。(外攻+20，身法+8)"
  };
  player.inventory.push({ ...coin, id: "coin_" + Date.now() });

  const tanzhiTemplate = (typeof GLOBAL_SKILLS !== 'undefined') ? GLOBAL_SKILLS.find(s => s.name === "彈指神通") : null;
  const tanzhi = tanzhiTemplate ? { ...tanzhiTemplate } : {
    name: "彈指神通", type: "external", weaponReq: "暗器", rarity: "神品",
    tier: 1, progress: 0, baseMult: 3.20, uniqueVfx: "tanzhi", statBonus: { speed: 25, arm: 10 },
    jinyongDesc: "指尖微曲隨即一彈，一道森森氣勁如離弦之箭激射而出！"
  };
  myLearnedKungfu.push({ ...tanzhi, id: "tanzhi_" + Date.now() });

  recalcPlayerStats();
  updateMailUI();
  closeModal('modal-mail');
  alert("🎉 附件領取成功！\n1. 【良品】限定暗器【台幣50元】已放入「行囊」！\n2. 【神品】暗器絕學【彈指神通】已收錄至「武學」！");
}

// ==================== 9. 通用彈窗與改名 ====================
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

function confirmRename() {
  const input = document.getElementById('input-rename');
  if (!input) return;
  const val = input.value.trim();
  if (val) {
    player.name = val;
    updateProfileUI();
    closeModal('modal-name');
  }
}

// ==================== 10. 系統啟動入口 ====================
function initGame() {
  try {
    loadSavedGame();
    recalcPlayerStats();
    if (typeof renderJianghuScenesOnMenu === 'function') renderJianghuScenesOnMenu();
    if (typeof refreshChatForCurrentLocation === 'function') refreshChatForCurrentLocation();
    updateMailUI();
  } catch (err) {
    console.error("系統中樞啟動攔截修復:", err);
    sanitizePlayerData();
    recalcPlayerStats();
    if (typeof renderJianghuScenesOnMenu === 'function') renderJianghuScenesOnMenu();
    if (typeof refreshChatForCurrentLocation === 'function') refreshChatForCurrentLocation();
    updateMailUI();
  }
}

initGame();

// 掛載至全域
window.openTowerModal = openTowerModal;
window.closeTowerModal = closeTowerModal;
window.strikeTowerTarget = strikeTowerTarget;
window.openTowerChest = openTowerChest;
window.openModal = openModal;
window.closeModal = closeModal;
window.confirmRename = confirmRename;
window.recalcPlayerStats = recalcPlayerStats;
window.autoSave = autoSave;