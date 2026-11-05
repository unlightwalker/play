/**
 * ========================================================
 * 你的江湖 - 系統中樞模組 (main.js) [境界動態晉升與天賦加成版]
 * 職責：
 * 1. 玩家核心模型與六維資料消毒 (sanitizePlayerData)
 * 2. 全域素質結算 (recalcPlayerStats，接線轉生輪迴印記、全天賦加成)
 * 3. 狀態欄 UI 刷新與十大境界評定演算法 (evaluatePlayerRealm)
 * 4. 閉目調息打坐系統 (接線：大道自然、孤僻怪傑、文弱書生、筋脈瘀阻)
 * 5. 定時本地存檔與雲端備份中樞 (manualSave, autoSave, loadSavedGame)
 * 6. 遊戲主啟動入口 (initGame)
 * ========================================================
 */

// ==================== 1. 玩家核心模型定義 ====================
var player = {
  name: "無名少俠",
  avatarId: 0,
  curLoc: "牛家村",
  sect: "無門無派",
  sectRank: "無",
  reincarnations: 0,
  talents: [],
  claimedMails: [],
  lastSectClaimTime: 0,
  towerFloor: 1,
  towerBgEarned: { exp: 0, gold: 0, learn: 0, floors: 0 },
  hasSeenIntro: false,
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

// ==================== 2. 玩家資料消毒與防呆 ====================
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
  if (!player.towerBgEarned) player.towerBgEarned = { exp: 0, gold: 0, learn: 0, floors: 0 };

  if (!player.equippedGear || typeof player.equippedGear !== 'object') {
    player.equippedGear = { weapon: null, armor: null };
  }
  if (!player.equippedGear.armor) {
    player.equippedGear.armor = { id: "a_init", name: "粗麻布衣", type: "armor", rarity: "凡品", def: 4, hp: 40, desc: "防禦 +4，氣血 +40" };
  }

  if (!Array.isArray(player.inventory)) player.inventory = [];
  player.inventory = player.inventory.filter(it => it && typeof it === 'object').map(item => {
    if (item.type === 'weapon' && typeof getWeaponType === 'function') {
      item.weaponType = getWeaponType(item);
    }
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

// ==================== 3. 全面屬性結算 (含轉生天賦) ====================
function recalcPlayerStats() {
  sanitizePlayerData();

  // 1. 裝備加成
  const statsGear = { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 };
  let gearAtk = 0, gearDef = 0, gearHp = 0;

  if (player.equippedGear && player.equippedGear.weapon) {
    const w = player.equippedGear.weapon;
    gearAtk += Number(w.atk) || 0;
    statsGear.speed += Number(w.speed) || 0;
    if (w.statBonus) {
      for (let k in w.statBonus) statsGear[k] = (statsGear[k] || 0) + (w.statBonus[k] || 0);
    }
  }
  if (player.equippedGear && player.equippedGear.armor) {
    const a = player.equippedGear.armor;
    gearDef += Number(a.def) || 0;
    gearHp += Number(a.hp) || 0;
    if (a.statBonus) {
      for (let k in a.statBonus) statsGear[k] = (statsGear[k] || 0) + (a.statBonus[k] || 0);
    }
  }

  // 2. 武學加成 (主修與被動)
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

  // 3. 宿命天賦加成
  const statsTalent = { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 };
  let talentHpAdd = 0, talentDefAdd = 0, talentHpPct = 0;
  let hasZeroDef = false, defDouble = false, atkPenaltyPct = 0;

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
      if (t.zeroDef) hasZeroDef = true;
      if (t.defPct) defDouble = true;
      if (t.atkPct) atkPenaltyPct += t.atkPct;

      // 天賦：輪迴印記 (每轉生一次全屬性基礎 +2)
      if (t.reinScale) {
        const bonus = (player.reincarnations || 0) * t.reinScale;
        ['arm', 'speed', 'bone', 'inner', 'int', 'luck'].forEach(k => statsTalent[k] += bonus);
      }
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

  let totalDef = player.baseDef + gearDef + kfDef + boneDef + talentDefAdd;
  if (defDouble) totalDef *= 2;
  if (hasZeroDef) totalDef = 0;
  player.def = Math.max(0, totalDef);

  player.speed = Math.max(10, player.stats.speed);

  let calculatedAtk = player.baseAtk + gearAtk + Math.floor(player.stats.arm * 0.65);
  if (atkPenaltyPct !== 0) {
    calculatedAtk = Math.floor(calculatedAtk * (1 + atkPenaltyPct));
  }
  player.currentAtk = Math.max(5, calculatedAtk);

  if (!player.hp || isNaN(player.hp) || player.hp > player.maxHp) player.hp = player.maxHp;

  updateWeaponSVG();
  updateProfileUI();
  if (typeof updateMailRedDot === 'function') updateMailRedDot();
  autoSave();
}

// ==================== 4. 武俠十大境界評定演算法 ====================
function evaluatePlayerRealm() {
  const score = (player.currentAtk || 20) * 4 + (player.def || 10) * 5 + Math.floor((player.maxHp || 350) * 0.15) + ((player.towerFloor || 1) * 25);
  
  if (score < 180)  return "凡夫俗子";
  if (score < 350)  return "初窺門徑";
  if (score < 600)  return "略有小成";
  if (score < 1000) return "駕輕就熟";
  if (score < 1600) return "融會貫通";
  if (score < 2400) return "爐火純青";
  if (score < 3400) return "出神入化";
  if (score < 4600) return "登峰造極";
  if (score < 6200) return "返璞歸真";
  if (score < 8000) return "震爍古今";
  return "天人合一";
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
  const realmEl = document.getElementById('disp-realm');

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

  // 境界動態刷新
  if (realmEl) {
    const curRealm = evaluatePlayerRealm();
    realmEl.innerText = curRealm;
    realmEl.style.color = (curRealm === "天人合一" || curRealm === "震爍古今" || curRealm === "返璞歸真") ? "var(--gold)" : "var(--cyan)";
  }

  // 兵刃色彩隨品階著色
  const w = player.equippedGear ? player.equippedGear.weapon : null;
  const wType = (typeof getWeaponType === 'function') ? getWeaponType(w) : "拳";
  if (wEl) {
    if (w) {
      const colorClass = (typeof getRarityColorClass === 'function') ? getRarityColorClass(w.rarity) : `color-${w.rarity}`;
      wEl.innerHTML = `<span class="${colorClass}">${w.name}</span> (${wType})`;
    } else {
      wEl.innerHTML = `<span style="color:#95a5a6;">空手 (拳)</span>`;
    }
  }

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

// ==================== 5. 打坐調息系統 (接線打坐天賦) ====================
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
    
    // 天賦：筋脈瘀阻 (無法自然產出修為)
    if (player.talents && player.talents.some(t => t.noMeditateExp)) {
      addExp = 0;
    }

    // 天賦：大道自然 (+100% 修為) / 孤僻怪傑 (+80% 修為)
    if (player.talents) {
      if (player.talents.some(t => t.id === "t_020")) addExp = Math.floor(addExp * 2.0);
      if (player.talents.some(t => t.id === "t_027")) addExp = Math.floor(addExp * 1.8);
    }

    player.exp += addExp;
    currentSessionExp += addExp;

    meditateTickCounter++;
    const learnInterval = Math.max(2, Math.floor(7 - player.stats.int * 0.1));
    if (meditateTickCounter % learnInterval === 0) {
      let learnGain = 1;
      // 天賦：文弱書生 (打坐額外產出 +3 學點)
      if (player.talents && player.talents.some(t => t.meditateLearnBonus)) {
        learnGain += 3;
      }
      player.learn += learnGain;
      currentSessionLearn += learnGain;
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

// ==================== 6. 存檔與定時中樞 ====================
var saveCountdown = 6.0;

function tickSaveCountdown() {
  saveCountdown -= 0.1;
  const indicator = document.getElementById('save-indicator');
  if (saveCountdown <= 0.05) {
    autoSave();
    if (indicator) {
      indicator.innerText = "[已存]";
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

function manualSave() {
  saveCountdown = 6.0;
  autoSave();
  const indicator = document.getElementById('save-indicator');
  if (indicator) {
    indicator.innerText = "[已存]";
    indicator.style.color = "#f1c40f";
    setTimeout(() => {
      indicator.style.color = "#2ecc71";
    }, 600);
  }
}

const MASTER_SAVE_KEY = "WUXIA_MASTER_SAVE";

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

  // 登入狀態下自動備份上傳 Firebase
  if (typeof uploadSaveToCloud === 'function') {
    uploadSaveToCloud();
  }
}

function loadSavedGame() {
  const raw = localStorage.getItem(MASTER_SAVE_KEY);
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
    return true;
  } catch (e) {
    console.error("本地存檔解析重置:", e);
    sanitizePlayerData();
    return false;
  }
}

// ==================== 7. 通用彈窗與改名 ====================
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

// ==================== 8. 系統啟動入口 ====================
function initGame() {
  try {
    const hasSave = loadSavedGame();
    recalcPlayerStats();
    if (typeof renderJianghuScenesOnMenu === 'function') renderJianghuScenesOnMenu();
    if (typeof renderNineGridMap === 'function') renderNineGridMap();
    if (typeof refreshChatForCurrentLocation === 'function') refreshChatForCurrentLocation();
    if (typeof updateMailRedDot === 'function') updateMailRedDot();

    // 首次進入遊戲且無存檔時觸發新手身世引導
    if (!hasSave && !player.hasSeenIntro && typeof checkAndShowNewbieIntro === 'function') {
      setTimeout(checkAndShowNewbieIntro, 300);
    }
  } catch (err) {
    console.error("系統啟動修復攔截:", err);
    sanitizePlayerData();
    recalcPlayerStats();
  }
}

initGame();

// 掛載全域函數
window.manualSave = manualSave;
window.autoSave = autoSave;
window.recalcPlayerStats = recalcPlayerStats;
window.evaluatePlayerRealm = evaluatePlayerRealm;
window.updateProfileUI = updateProfileUI;
window.openMeditateModal = openMeditateModal;
window.closeMeditateModal = closeMeditateModal;
window.openModal = openModal;
window.closeModal = closeModal;
window.confirmRename = confirmRename;