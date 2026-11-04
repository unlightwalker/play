/**
 * ========================================================
 * 你的江湖 - 系統中樞模組 (main.js) [完整修復版]
 * 內建：不良少年拋銅錢姿勢、六維屬性來源分解、自動存檔倒數、打坐、信件
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
  claimedMails: [],
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
  player.gold = Number(player.gold) >= 0 ? Number(player.gold) : 80;
  player.exp = Number(player.exp) >= 0 ? Number(player.exp) : 120;
  player.learn = Number(player.learn) >= 0 ? Number(player.learn) : 120;
  player.combat = Number(player.combat) >= 0 ? Number(player.combat) : 15;

  if (!player.equippedGear || typeof player.equippedGear !== 'object') player.equippedGear = {};
  if (!player.equippedGear.weapon) {
    player.equippedGear.weapon = { id: "w_init", name: "粗製木劍", type: "weapon", weaponType: "劍", rarity: "凡品", atk: 6, speed: 0, desc: "外攻 +6" };
  } else {
    player.equippedGear.weapon.weaponType = getWeaponType(player.equippedGear.weapon);
  }
  if (!player.equippedGear.armor) {
    player.equippedGear.armor = { id: "a_init", name: "粗麻布衣", type: "armor", rarity: "凡品", def: 4, hp: 40, desc: "防禦 +4，氣血 +40" };
  }

  if (!Array.isArray(player.inventory)) player.inventory = [];
  player.inventory = player.inventory.filter(it => it && typeof it === 'object').map(item => {
    if (item.type === 'weapon') item.weaponType = getWeaponType(item);
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

// ==================== 2. 六維屬性結算 (先天+功法+奇遇+裝備) ====================
function recalcPlayerStats() {
  sanitizePlayerData();

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

  player.statSources = {};
  ['arm', 'speed', 'bone', 'inner', 'int', 'luck'].forEach(k => {
    const innate = player.statsInnate[k] || 0;
    const kf = statsKungfu[k] || 0;
    const enc = player.statsEncounter[k] || 0;
    const gear = statsGear[k] || 0;
    player.stats[k] = innate + kf + enc + gear;
    player.statSources[k] = { innate, kf, enc, gear, total: player.stats[k] };
  });

  const boneHp = player.stats.bone * 6;
  const boneDef = Math.floor(player.stats.bone * 0.5);

  player.maxHp = player.baseMaxHp + gearHp + kfHp + boneHp;
  player.def = player.baseDef + gearDef + kfDef + boneDef;
  player.speed = player.stats.speed;
  player.currentAtk = player.baseAtk + gearAtk + Math.floor(player.stats.arm * 0.65);

  if (isNaN(player.speed) || player.speed <= 0) player.speed = 45;
  if (isNaN(player.maxHp) || player.maxHp <= 0) player.maxHp = 350;
  if (isNaN(player.currentAtk) || player.currentAtk <= 0) player.currentAtk = 25;
  if (isNaN(player.def) || player.def <= 0) player.def = 10;
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
  if (wEl) wEl.innerText = w ? `${w.name} (${getWeaponType(w)})` : "空手 (拳)";
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

// ==================== 3. 不良少年站姿：拋銅錢待機與插口袋 ====================
function updateWeaponSVG() {
  const container = document.getElementById('stick-player-weapon');
  const leftArm = document.getElementById('p-left-arm-line');
  if (!container) return;

  const w = player.equippedGear ? player.equippedGear.weapon : null;
  const wType = getWeaponType(w);

  if (wType === "暗器") {
    // 1. 左手帥氣插在口袋
    if (leftArm) {
      leftArm.setAttribute('x1', '50');
      leftArm.setAttribute('y1', '38');
      leftArm.setAttribute('x2', '45');
      leftArm.setAttribute('y2', '65');
    }
    // 2. 右手拿著銅錢/錢包向上翻轉拋接
    container.innerHTML = `
      <g class="tossing-coin">
        <circle cx="75" cy="44" r="5" fill="#f1c40f" stroke="#e67e22" stroke-width="1.5"/>
        <path d="M73,42 L77,46 M77,42 L73,46" stroke="#b8860b" stroke-width="1"/>
      </g>
    `;
  } else {
    // 恢復常規戒備手臂
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

// ==================== 4. 打坐掛機系統 ====================
var meditateTimer = null;
var currentSessionExp = 0;

function openMeditateModal() {
  currentSessionExp = 0;
  const gainEl = document.getElementById('meditate-exp-gain');
  const mentalEl = document.getElementById('meditate-mental-name');
  if (gainEl) gainEl.innerText = "+0";
  if (mentalEl) mentalEl.innerText = equippedSlots.internal ? equippedSlots.internal.name : "自然吐納";
  openModal('modal-meditate');

  if (meditateTimer) clearInterval(meditateTimer);
  meditateTimer = setInterval(() => {
    let add = 2 + Math.floor(player.stats.int * 0.12);
    if (equippedSlots.internal) add += Math.floor(equippedSlots.internal.tier * 0.8);
    player.exp += add;
    currentSessionExp += add;
    if (gainEl) gainEl.innerText = `+${currentSessionExp} 修為 (悟性加成)`;
    updateProfileUI();
  }, 1000);
}

function closeMeditateModal() {
  if (meditateTimer) clearInterval(meditateTimer);
  meditateTimer = null;
  closeModal('modal-meditate');
}

// ==================== 5. 存檔倒數 [6.0s] ====================
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

// ==================== 6. 存檔讀檔中樞 ====================
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

// ==================== 7. 信件與禮包 ====================
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

// ==================== 8. 通用彈窗與改名 ====================
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

// ==================== 9. 系統立即安全啟動 ====================
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