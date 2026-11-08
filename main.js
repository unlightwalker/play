/**
 * ========================================================
 * 你的江湖 - 系統中樞模組 (main.js) [1~10重線性插值與六維結算完整版]
 * 支援：
 * 1. 支援武學 1 重至 10 重 (tier10Bonus) 線性插值計算，第 1 重起即享有先天加成
 * 2. 氣血／內力／修為／學點／銀兩多於或等於 5 位數時自動以 k 顯示 (如 12345 ➔ 12.3k)
 * 3. 內力上限 = 內功 × 10 (maxMp)
 * 4. 非戰鬥期間氣血與內力每秒自動回復 2%
 * ========================================================
 */

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
  towerBgEarned: { exp: 0, gold: 0, learn: 0, kills: 0 },
  hasSeenIntro: false,
  statsInnate: { arm: 15, speed: 40, bone: 15, inner: 10, int: 25, luck: 18 },
  statsEncounter: { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 },
  stats: { arm: 22, speed: 55, bone: 24, inner: 20, int: 25, luck: 18 },
  statSources: {},
  baseMaxHp: 300,
  maxHp: 350,
  hp: 350,
  maxMp: 200,
  mp: 200,
  baseAtk: 20,
  baseDef: 6,
  def: 10,
  baseSpeed: 40,
  speed: 55,
  exp: 120,
  learn: 120,
  combat: 15,
  gold: 80,
  equippedGear: { weapon: null, armor: null },
  inventory: []
};

var equippedSlots = { internal: null, qinggong: null, ext0: null, ext1: null };
var myLearnedKungfu = [];

function formatNumberWithK(num) {
  const n = Number(num) || 0;
  if (Math.abs(n) >= 10000) {
    return (n / 1000).toFixed(1) + "k";
  }
  return String(n);
}
window.formatNumberWithK = formatNumberWithK;

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
  if (!player.towerBgEarned) player.towerBgEarned = { exp: 0, gold: 0, learn: 0, kills: 0 };

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
    myLearnedKungfu = getStarterKungfuList();
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

// ==================== 舞台切換 (主選單 / 通天塔 / 戰鬥) ====================
function showStageView(view) {
  if (view !== 'menu' && typeof stopMeditation === 'function') stopMeditation();
  const m = document.getElementById('menu-view');
  const t = document.getElementById('tower-view');
  const b = document.getElementById('battle-view');
  if (m) {
    m.classList.toggle('hidden', view !== 'menu');
    m.style.display = (view === 'menu') ? 'flex' : 'none';
  }
  if (t) {
    t.classList.toggle('active', view === 'tower');
    t.style.display = (view === 'tower') ? 'flex' : 'none';
  }
  if (b) {
    b.classList.toggle('active', view === 'battle');
    b.style.display = (view === 'battle') ? 'flex' : 'none';
  }
}

// 以武學範本建立一份全新的習得紀錄（一重 0%）
function createLearnedKungfu(template) {
  return { ...template, id: "kf_" + Date.now() + "_" + Math.floor(Math.random() * 1000), templateId: template.id || null, starter: undefined, tier: 1, progress: 0 };
}

// 新手 / 轉世初始武學：取 data_skills.js 中標記 starter 的武學
function getStarterKungfuList() {
  if (typeof GLOBAL_SKILLS === 'undefined') return [];
  let list = GLOBAL_SKILLS.filter(s => s.starter);
  if (list.length === 0) list = GLOBAL_SKILLS.slice(0, 4);
  return list.map(createLearnedKungfu);
}

// 依武學名稱 / 範本 id 找出資料檔中的最新武學設定
function findKungfuTemplate(kf) {
  if (!kf) return null;
  if (typeof GLOBAL_SKILLS !== 'undefined') {
    const byId = kf.templateId ? GLOBAL_SKILLS.find(s => s.id === kf.templateId) : null;
    if (byId) return byId;
    const byName = GLOBAL_SKILLS.find(s => s.name === kf.name);
    if (byName) return byName;
  }
  if (typeof SECT_DATABASE !== 'undefined') {
    for (const sName in SECT_DATABASE) {
      const sk = (SECT_DATABASE[sName].skills || []).find(s => s.name === kf.name);
      if (sk) return sk;
    }
  }
  return null;
}

function findItemTemplate(item) {
  if (!item || typeof GLOBAL_ITEMS === 'undefined') return null;
  return GLOBAL_ITEMS.find(i => i.id === item.templateId) || GLOBAL_ITEMS.find(i => i.name === item.name) || null;
}

// 讀檔後：把存檔中的武學 / 裝備套上資料檔最新數值（保留重數、進度、數量等個人進度）
function syncSaveWithGameData() {
  myLearnedKungfu.forEach(kf => {
    const tpl = findKungfuTemplate(kf);
    if (!tpl) return;
    const keep = { id: kf.id, tier: Number(kf.tier) || 1, progress: Number(kf.progress) || 0 };
    Object.keys(kf).forEach(k => { if (!(k in keep)) delete kf[k]; });
    Object.assign(kf, tpl, keep, { templateId: tpl.id || null });
    delete kf.starter;
  });

  const syncItem = (item) => {
    if (!item || item.type === 'book') {
      if (item && item.skillData) {
        const tpl = findKungfuTemplate(item.skillData);
        if (tpl) item.skillData = { ...tpl };
      }
      return item;
    }
    const tpl = findItemTemplate(item);
    if (!tpl) return item;
    const keep = { id: item.id };
    if (item.count) keep.count = item.count;
    Object.keys(item).forEach(k => delete item[k]);
    return Object.assign(item, tpl, keep, { templateId: tpl.id });
  };
  if (Array.isArray(player.inventory)) player.inventory.forEach(syncItem);
  if (player.equippedGear) {
    syncItem(player.equippedGear.weapon);
    syncItem(player.equippedGear.armor);
  }
}

// 取得武學在指定重數與進度下的屬性加成 (支援 1 重至 10 重平滑線性插值)
function getKungfuInterpolatedStat(kf, statKey) {
  if (!kf) return 0;

  const b1 = (kf.statBonus && kf.statBonus[statKey] !== undefined) ? Number(kf.statBonus[statKey]) : 0;
  const b10 = (kf.tier10Bonus && kf.tier10Bonus[statKey] !== undefined) 
    ? Number(kf.tier10Bonus[statKey]) 
    : (b1 * 3);

  // 1 重 0% ~ 10 重 100% 映射為 0.0 ~ 1.0
  const curTier = Math.min(10, Math.max(1, Number(kf.tier) || 1));
  const curProg = Math.min(100, Math.max(0, Number(kf.progress) || 0));
  
  if (curTier >= 10 && curProg >= 100) return b10;

  const totalProgress = (curTier - 1) + (curProg / 100); // 0.0 ~ 9.0
  const ratio = Math.max(0, Math.min(1, totalProgress / 9));

  return Math.floor(b1 + (b10 - b1) * ratio);
}

// 武學重數倍率（戰鬥、屬性與介面顯示共用）
function getKungfuTierMult(kf) {
  return 1 + (Math.max(1, Number(kf.tier) || 1) - 1) * 0.18 + ((Number(kf.progress) || 0) / 100) * 0.18;
}

// 心法氣血/防禦、輕功身法基礎值（相容門派武學的 baseHp / baseDef / baseSpeed 欄位）
function getKungfuBaseValue(kf, kind) {
  if (kind === 'hp') return Number(kf.baseHpBonus ?? kf.baseHp) || 50;
  if (kind === 'def') return Number(kf.baseDefBonus ?? kf.baseDef) || 4;
  return Number(kf.baseSpeedBonus ?? kf.baseSpeed) || 12;
}

function recalcPlayerStats() {
  sanitizePlayerData();

  // 1. 裝備加成
  const statsGear = { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 };
  let gearAtk = 0, gearDef = 0, gearHp = 0;

  // 兵刃與防具的 外攻/身法/防禦/氣血/六維 皆生效（與 editor.html 設定欄位一致）
  [player.equippedGear && player.equippedGear.weapon, player.equippedGear && player.equippedGear.armor].forEach(g => {
    if (!g) return;
    gearAtk += Number(g.atk) || 0;
    statsGear.speed += Number(g.speed) || 0;
    gearDef += Number(g.def) || 0;
    gearHp += Number(g.hp) || 0;
    if (g.statBonus) {
      for (let k in g.statBonus) statsGear[k] = (statsGear[k] || 0) + (Number(g.statBonus[k]) || 0);
    }
  });

  // 2. 武學加成 (支援自 1 重起即時計算插值)
  const statsKungfu = { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 };
  let kfHp = 0, kfDef = 0;

  const activeSkills = [equippedSlots.internal, equippedSlots.qinggong, equippedSlots.ext0, equippedSlots.ext1].filter(Boolean);

  // (1) 裝備中的武學主動加成
  activeSkills.forEach(kf => {
    ['arm', 'speed', 'bone', 'inner', 'int', 'luck'].forEach(k => {
      statsKungfu[k] += getKungfuInterpolatedStat(kf, k);
    });

    const mult = getKungfuTierMult(kf);
    if (kf.type === 'internal') {
      kfHp += Math.floor(getKungfuBaseValue(kf, 'hp') * mult);
      kfDef += Math.floor(getKungfuBaseValue(kf, 'def') * mult);
    }
    if (kf.type === 'qinggong') {
      statsKungfu.speed += Math.floor(getKungfuBaseValue(kf, 'speed') * mult);
    }
  });

  // (2) 未裝備之武學反哺加成 (打折回饋)
  myLearnedKungfu.forEach(kf => {
    const isEquipped = activeSkills.includes(kf);
    if (!isEquipped) {
      ['arm', 'speed', 'bone', 'inner'].forEach(k => {
        const val = getKungfuInterpolatedStat(kf, k);
        statsKungfu[k] += Math.floor(val * 0.35);
      });

      if (kf.type === 'internal') {
        kfHp += Math.floor(kf.tier * 12);
        kfDef += Math.floor(kf.tier * 2);
      } else if (kf.type === 'qinggong') {
        statsKungfu.speed += Math.floor(kf.tier * 1.5);
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

  // 內力上限 = 內功 × 10
  player.maxMp = Math.max(50, player.stats.inner * 10);
  if (!player.mp || isNaN(player.mp) || player.mp > player.maxMp) {
    player.mp = player.maxMp;
  }

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
  const mpEl = document.getElementById('disp-mp');
  const expEl = document.getElementById('res-exp');
  const lrnEl = document.getElementById('res-learn');
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

  if (realmEl) {
    const curRealm = evaluatePlayerRealm();
    realmEl.innerText = curRealm;
    realmEl.style.color = (curRealm === "天人合一" || curRealm === "震爍古今" || curRealm === "返璞歸真") ? "var(--gold)" : "var(--cyan)";
  }

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

  if (hpEl) hpEl.innerText = `${formatNumberWithK(player.hp)} / ${formatNumberWithK(player.maxHp)}`;
  if (mpEl) mpEl.innerText = `${formatNumberWithK(player.mp)} / ${formatNumberWithK(player.maxMp)}`;
  if (expEl) expEl.innerText = formatNumberWithK(player.exp);
  if (lrnEl) lrnEl.innerText = formatNumberWithK(player.learn);
  if (gldEl) gldEl.innerText = `${formatNumberWithK(player.gold)}兩`;

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
  if (typeof renderStickWeapon === 'function') renderStickWeapon(wType, container, leftArm);
}

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

  updateProfileUI();

  if (meditateTimer) clearInterval(meditateTimer);
  meditateTimer = setInterval(() => {
    let addExp = 2 + Math.floor(player.stats.int * 0.12);
    if (equippedSlots.internal) addExp += Math.floor(equippedSlots.internal.tier * 0.8);
    
    if (player.talents && player.talents.some(t => t.noMeditateExp)) addExp = 0;

    if (player.talents) {
      if (player.talents.some(t => t.id === "t_020")) addExp = Math.floor(addExp * 2.0);
      if (player.talents.some(t => t.id === "t_027")) addExp = Math.floor(addExp * 1.8);
    }

    player.exp += addExp;
    currentSessionExp += addExp;

    player.hp = Math.min(player.maxHp, player.hp + 5);
    player.mp = Math.min(player.maxMp, player.mp + 8);

    meditateTickCounter++;
    const learnInterval = Math.max(2, Math.floor(7 - player.stats.int * 0.1));
    if (meditateTickCounter % learnInterval === 0) {
      let learnGain = 1;
      if (player.talents && player.talents.some(t => t.meditateLearnBonus)) learnGain += 3;
      player.learn += learnGain;
      currentSessionLearn += learnGain;
    }

    if (gainEl) {
      gainEl.innerText = `+${formatNumberWithK(currentSessionExp)} 修為 | +${formatNumberWithK(currentSessionLearn)} 學點 (悟性催化)`;
    }
    updateProfileUI();
  }, 1000);
}

function stopMeditation() {
  if (!meditateTimer) return;
  clearInterval(meditateTimer);
  meditateTimer = null;
  updateProfileUI();
  if (typeof pushChatMessage === 'function' && (currentSessionExp > 0 || currentSessionLearn > 0)) {
    pushChatMessage('system', '【收功】', `打坐收功，本次共得修為 +${formatNumberWithK(currentSessionExp)}、學點 +${formatNumberWithK(currentSessionLearn)}。`, '#2ecc71');
  }
}

function closeMeditateModal() {
  stopMeditation();
  closeModal('modal-meditate');
}

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
    if (indicator) indicator.innerText = `[${saveCountdown.toFixed(1)}s]`;
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
    syncSaveWithGameData();
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

// ==================== 地點面板：取代彈窗，暫時覆蓋地圖區 ====================
// 下列功能改為在主畫面地圖位置展開；其餘 (帳號、角色典籍、轉世、改名…) 仍為對話框
const PLACE_PAGES = {
  'modal-scene': 'pg-scene',
  'modal-sect-hall': 'pg-sect',
  'modal-pawnshop': 'pg-pawn',
  'modal-bag': 'pg-bag',
  'modal-mail': 'pg-mail',
  'modal-meditate': 'pg-meditate',
  'npc': 'pg-npc'
};
let currentPlacePage = null;

function showPlacePage(pageId) {
  if (currentPlacePage === 'pg-meditate' && pageId !== 'pg-meditate') stopMeditation();
  // 武學內嵌畫面開啟時先切回一般畫面
  if (typeof isKungfuInlineOpen !== 'undefined' && isKungfuInlineOpen && typeof switchToNormalMode === 'function') switchToNormalMode();
  showStageView('menu');
  const secMap = document.getElementById('sec-map');
  const secPlace = document.getElementById('sec-place');
  if (secMap) secMap.style.display = 'none';
  if (secPlace) secPlace.style.display = 'block';
  document.querySelectorAll('#sec-place .place-page').forEach(p => p.classList.toggle('active', p.id === pageId));
  currentPlacePage = pageId;
  const menu = document.getElementById('menu-view');
  if (menu && secPlace) menu.scrollTop = Math.max(0, secPlace.offsetTop - 8);
}

function closePlacePanel(pageId) {
  if (pageId && currentPlacePage !== pageId) return;
  if (currentPlacePage === 'pg-meditate') stopMeditation();
  currentPlacePage = null;
  const secPlace = document.getElementById('sec-place');
  if (secPlace) secPlace.style.display = 'none';
  const kf = document.getElementById('sec-kungfu');
  const secMap = document.getElementById('sec-map');
  if (secMap && !(kf && kf.style.display === 'block')) secMap.style.display = 'block';
}

function openModal(id) {
  if (PLACE_PAGES[id]) { showPlacePage(PLACE_PAGES[id]); return; }
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

function closeModal(id) {
  if (PLACE_PAGES[id]) { closePlacePanel(PLACE_PAGES[id]); return; }
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

function initGame() {
  try {
    const hasSave = loadSavedGame();
    recalcPlayerStats();
    if (typeof renderJianghuScenesOnMenu === 'function') renderJianghuScenesOnMenu();
    if (typeof renderNineGridMap === 'function') renderNineGridMap();
    if (typeof refreshChatForCurrentLocation === 'function') refreshChatForCurrentLocation();
    if (typeof updateMailRedDot === 'function') updateMailRedDot();

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

// 非戰鬥期間：氣血與內力每秒自動回復 2%
setInterval(() => {
  const battleView = document.getElementById('battle-view');
  if (battleView && battleView.classList.contains('active')) return;

  if (typeof player !== 'undefined' && player.maxHp && player.maxMp) {
    let changed = false;

    if (player.hp < player.maxHp) {
      const hpRegen = Math.max(1, Math.floor(player.maxHp * 0.02));
      player.hp = Math.min(player.maxHp, player.hp + hpRegen);
      changed = true;
    }

    if (player.mp < player.maxMp) {
      const mpRegen = Math.max(1, Math.floor(player.maxMp * 0.02));
      player.mp = Math.min(player.maxMp, player.mp + mpRegen);
      changed = true;
    }

    if (changed && typeof updateProfileUI === 'function') {
      updateProfileUI();
    }
  }
}, 1000);

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
window.getKungfuInterpolatedStat = getKungfuInterpolatedStat;
window.getKungfuTierMult = getKungfuTierMult;
window.getKungfuBaseValue = getKungfuBaseValue;
window.showStageView = showStageView;
window.showPlacePage = showPlacePage;
window.closePlacePanel = closePlacePanel;
window.stopMeditation = stopMeditation;
window.createLearnedKungfu = createLearnedKungfu;
window.getStarterKungfuList = getStarterKungfuList;
window.syncSaveWithGameData = syncSaveWithGameData;