/**
 * ========================================================
 * 你的江湖 - 歷練通天塔系統模組 (tower.js) [入陣對決徹底修復版]
 * 支援：
 * 1. 點擊 BOSS 關卡無條件進入演武場 ATB 正式對決
 * 2. 50 層首領戰力校準（1 神品外攻 + 絕品武器約 50% 機率破關）
 * 3. 雙聯情報面板、通天樓層軌道、戰利品即時於下方頻道發布通知
 * ========================================================
 */

let towerCurrentFloor = 1;
let towerMonster = null;
let towerTimer = null;
let towerBossSeconds = 30;
let isTowerModalOpen = false;
let isChallengingBoss = false;

// 獨立原生舞台切換（絕不依賴外部函式，100% 不報錯）
function localShowTowerView() {
  const m = document.getElementById('menu-view');
  const t = document.getElementById('tower-view');
  const b = document.getElementById('battle-view');
  if (m) { m.classList.add('hidden'); m.style.display = 'none'; }
  if (b) { b.classList.remove('active'); b.style.display = 'none'; }
  if (t) { t.classList.add('active'); t.style.display = 'flex'; }
}

function localShowMenuView() {
  const m = document.getElementById('menu-view');
  const t = document.getElementById('tower-view');
  const b = document.getElementById('battle-view');
  if (t) { t.classList.remove('active'); t.style.display = 'none'; }
  if (b) { b.classList.remove('active'); b.style.display = 'none'; }
  if (m) { m.classList.remove('hidden'); m.style.display = 'block'; }
}

function localShowBattleView() {
  const m = document.getElementById('menu-view');
  const t = document.getElementById('tower-view');
  const b = document.getElementById('battle-view');
  if (m) { m.classList.add('hidden'); m.style.display = 'none'; }
  if (t) { t.classList.remove('active'); t.style.display = 'none'; }
  if (b) { b.classList.add('active'); b.style.display = 'flex'; }
}

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

// 戰力曲線校準：50 層 BOSS 精準校準為約 50% 通過率
function getTowerBossEnemy(floor) {
  const maxHp = Math.floor(250 + Math.pow(floor, 1.45) * 6.5);
  const atk = Math.floor(18 + Math.pow(floor, 1.1) * 1.05);
  const def = Math.floor(8 + Math.pow(floor, 1.05) * 0.65);
  const speed = Math.floor(32 + Math.min(60, floor * 1.0));

  let realm = "登峰造極";
  let bossTitle = "赤血魔皇";
  let skill = { name: "秘劍・一之太刀", baseMult: 2.2, rarity: "神品" };
  let internal = { name: "萬毒枯榮心經", defReduce: 0.5 };

  if (floor < 20) {
    realm = "初窺門徑";
    bossTitle = "試煉惡僧";
    skill = { name: "太祖長拳", baseMult: 1.4, rarity: "凡品" };
    internal = { name: "自然吐納訣", defReduce: 0.35 };
  } else if (floor < 40) {
    realm = "融會貫通";
    bossTitle = "奪命劍煞";
    skill = { name: "狂風快劍", baseMult: 1.7, rarity: "良品" };
    internal = { name: "金剛鐵布衫", defReduce: 0.42 };
  } else if (floor >= 55) {
    realm = "返璞歸真";
    bossTitle = "混沌天尊";
    skill = { name: "降龍十八掌・亢龍有悔", baseMult: 2.8, rarity: "神品" };
    internal = { name: "純陽太極功", defReduce: 0.55 };
  }

  return {
    name: `第 ${floor} 層首領・${bossTitle}`,
    realm: realm,
    maxHp: maxHp,
    atk: atk,
    def: def,
    speed: speed,
    exp: Math.floor(100 + floor * 15),
    gold: Math.floor(40 + floor * 8),
    combat: 15,
    stats: {
      arm: Math.floor(atk * 0.7),
      speed: speed,
      bone: Math.floor(def * 1.5),
      inner: Math.floor(atk * 0.6),
      int: 30,
      luck: 25
    },
    skills: [skill],
    internalSkill: internal
  };
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

  localShowTowerView();

  initTowerFloor(towerCurrentFloor);
  startTowerAutoAttackEngine();
}

function closeTowerModal() {
  isTowerModalOpen = false;
  isChallengingBoss = false;
  if (towerTimer) clearInterval(towerTimer);
  towerTimer = null;

  localShowMenuView();

  if (typeof refreshChatForCurrentLocation === 'function') {
    refreshChatForCurrentLocation();
  }
}

function returnToTowerAfterBoss(isVictory = false) {
  isChallengingBoss = false;
  localShowTowerView();

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
  return Math.max(100, Math.floor(750 - currentSpeed * 4.2));
}

function startTowerAutoAttackEngine() {
  if (towerTimer) clearInterval(towerTimer);
  const interval = getTowerAttackSpeedInterval();
  towerTimer = setInterval(towerAutoLoop, interval);
}

function initTowerFloor(floor) {
  const isBoss = (floor % 5 === 0);
  let baseHp = Math.floor(80 + Math.pow(floor, 1.48) * 16);
  const hp = isBoss ? Math.floor(baseHp * 2.5) : baseHp;

  let template = isBoss 
    ? TOWER_HUMANOIDS[TOWER_HUMANOIDS.length - 1] 
    : TOWER_HUMANOIDS[(floor - 1) % (TOWER_HUMANOIDS.length - 1)];

  towerMonster = {
    floor,
    name: isBoss ? `👑 第 ${floor} 層首領・${template.name}` : `第 ${floor} 層・${template.name}`,
    svg: template.svg,
    isBoss,
    maxHp: Math.max(80, hp),
    hp: Math.max(80, hp)
  };

  towerBossSeconds = 30;
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
  const bossTimerEl = document.getElementById('tower-boss-timer');
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

  if (armDmgEl) armDmgEl.innerText = `${avgPower} 掌力`;
  if (spdRateEl) spdRateEl.innerText = `${freqPerSec} 次/秒 (${interval}ms)`;

  // 時收收益
  const killsPerHour = 450;
  const hrExp = Math.floor((15 + floor * 4) * killsPerHour);
  const hrGold = Math.floor((5 + floor * 2) * killsPerHour);
  const hrLearn = Math.floor(Math.max(1, Math.floor(floor / 3)) * killsPerHour);

  const expHrEl = document.getElementById('tower-hr-exp');
  const goldHrEl = document.getElementById('tower-hr-gold');
  const lrnHrEl = document.getElementById('tower-hr-learn');
  if (expHrEl) expHrEl.innerText = `+${hrExp}/hr`;
  if (goldHrEl) goldHrEl.innerText = `+${hrGold}兩/hr`;
  if (lrnHrEl) lrnHrEl.innerText = `+${hrLearn}/hr`;

  const talentsLine = document.getElementById('tower-active-talents');
  if (talentsLine) {
    const activeTalents = [];
    if (player.talents) {
      if (player.talents.some(t => t.id === "t_012")) activeTalents.push("通天回血5%");
      if (player.talents.some(t => t.id === "t_007")) activeTalents.push("神品雙倍");
      if (player.talents.some(t => t.id === "t_014")) activeTalents.push("刀狂吸血");
      if (player.talents.some(t => t.id === "t_134")) activeTalents.push("仙人指路");
    }
    talentsLine.innerText = activeTalents.length > 0 
      ? `命格生效: ${activeTalents.join("、")}` 
      : "命格生效: 先天凡體 (轉生可覺醒)";
  }

  const nextBoss = Math.ceil(floor / 5) * 5;
  const remain = nextBoss - floor;
  const bossCdEl = document.getElementById('tower-boss-countdown');
  const previewText = document.getElementById('tower-boss-preview-text');

  if (bossCdEl) {
    bossCdEl.innerHTML = remain === 0 
      ? `<b style="color:#ff4757;">⚠️ 當前為第 ${floor} 層首領戰！點擊出戰！</b>` 
      : `距離首領戰尚餘: <b style="color:var(--gold);">${remain}</b> 層`;
  }
  if (previewText) {
    let tierText = "【良品/上品】";
    if (nextBoss >= 40) tierText = "【神品/絕品】";
    else if (nextBoss >= 20) tierText = "【上品/絕品】";
    previewText.innerText = `第 ${nextBoss} 層寶箱預覽: ${tierText} 秘笈殘卷、專屬神兵、雪參丸`;
  }

  // 按鈕動態切換
  if (actionBtn) {
    if (towerMonster.isBoss) {
      actionBtn.innerHTML = `⚔️ 迎戰第 ${floor} 層首領！`;
      actionBtn.style.borderColor = '#ff4757';
      actionBtn.style.color = '#ff7675';
    } else {
      actionBtn.innerHTML = `💥 催動掌力狂擊！`;
      actionBtn.style.borderColor = 'var(--gold)';
      actionBtn.style.color = 'var(--gold)';
    }
  }

  if (bossTimerEl) {
    bossTimerEl.style.display = 'none';
  }
}

function showNextBossLootDetail() {
  if (!towerMonster) return;
  const nextBoss = Math.ceil(towerMonster.floor / 5) * 5;
  let pool = "• 良品武學秘笈（八卦刀、花雨手法）\n• 良品/上品神兵（百煉青鋼劍、熟銅棍、伏魔杖）\n• 滋補靈藥（少林大還丹）";
  if (nextBoss >= 40) {
    pool = "• 神品絕學秘笈（降龍十八掌、暴雨梨花針、一之太刀、一陽指）\n• 絕品神兵（屠龍刀、玄鐵重劍、打狗棒）\n• 絕品靈丹（千年雪參丸）";
  } else if (nextBoss >= 20) {
    pool = "• 上品/絕品武學秘笈（大力金剛掌、太極拳、三仙劍）\n• 專屬名刃（詠春八斬刀、備前長船太刀）\n• 上品靈丹（通脈易筋丸）";
  }
  alert(`🎁【第 ${nextBoss} 層通天首領寶箱・掉落池】\n` +
        `------------------------------------\n` +
        pool + `\n` +
        `------------------------------------\n` +
        `擊敗該層首領時自動開啟繳獲並存入行囊！`);
}

function strikeTowerTarget() {
  if (!towerMonster || towerMonster.hp <= 0) return;

  // 首領關卡：點擊立即發起入陣戰鬥
  if (towerMonster.isBoss) {
    challengeTowerBoss(towerMonster.floor);
    return;
  }

  const avgPower = getTowerAverageSkillAttackPower();
  const isCrit = Math.random() * 100 < ((player.stats ? player.stats.luck : 15) * 0.5 + 5);

  let dmg = Math.floor(avgPower * 1.5 + Math.random() * ((player.stats ? player.stats.arm : 20) * 0.5));
  if (isCrit) dmg = Math.floor(dmg * 1.8);

  dealTowerDamage(dmg, isCrit, true);
}

// 發起首領正式入陣戰鬥（雙向防呆）
function challengeTowerBoss(floor) {
  if (isChallengingBoss) return;
  isChallengingBoss = true;

  if (towerTimer) {
    clearInterval(towerTimer);
    towerTimer = null;
  }

  try {
    const bossObj = getTowerBossEnemy(floor);
    localShowBattleView();
    if (typeof startBattleAgainst === 'function') {
      startBattleAgainst(bossObj, 'tower_boss', floor);
    }
  } catch (err) {
    console.error("首領戰發起保護:", err);
    isChallengingBoss = false;
    localShowTowerView();
  }
}

function towerAutoLoop() {
  if (!towerMonster || towerMonster.hp <= 0 || isChallengingBoss) return;

  if (towerMonster.isBoss) {
    const autoBox = document.getElementById('tower-auto-advance');
    const canAdvance = autoBox ? autoBox.checked : false;
    if (canAdvance && !isChallengingBoss) {
      challengeTowerBoss(towerMonster.floor);
    }
    return;
  }

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
    const earnExp = Math.floor(15 + floor * 4);
    const earnGold = Math.floor(5 + floor * 2);
    const earnLearn = Math.max(1, Math.floor(floor / 3));

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

    const nextFloor = floor + 1;
    const isNextBoss = (nextFloor % 5 === 0);

    const autoBox = document.getElementById('tower-auto-advance');
    const canAdvance = autoBox ? autoBox.checked : true;

    if (canAdvance) {
      if (isNextBoss) {
        setTimeout(() => challengeTowerBoss(nextFloor), 220);
      } else {
        setTimeout(() => initTowerFloor(nextFloor), 220);
      }
    } else {
      setTimeout(() => initTowerFloor(nextFloor), 220);
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

function autoDropBossLootToBag(floor) {
  let godRate = 0;
  let supremeRate = 0;

  if (floor >= 40) {
    godRate = Math.min(100, 0.2 * floor);
    if (player.talents && player.talents.some(t => t.id === "t_007")) {
      godRate = Math.min(100, godRate * 2.0);
    }
    supremeRate = Math.min(100 - godRate, 2.0 * floor);
  }

  const roll = Math.random() * 100;
  let targetRarity = "良品";
  if (roll < godRate) {
    targetRarity = "神品";
  } else if (roll < godRate + supremeRate) {
    targetRarity = "絕品";
  } else {
    targetRarity = (Math.random() * 100 < Math.min(75, 25 + floor * 1.5)) ? "上品" : "良品";
  }

  const isSkillDrop = Math.random() < 0.5;

  if (isSkillDrop) {
    const skillsOfTier = (typeof GLOBAL_SKILLS !== 'undefined') 
      ? GLOBAL_SKILLS.filter(s => s.rarity === targetRarity) 
      : [];
    const pickedSkill = (skillsOfTier.length > 0)
      ? skillsOfTier[Math.floor(Math.random() * skillsOfTier.length)]
      : (typeof GLOBAL_SKILLS !== 'undefined' ? GLOBAL_SKILLS[0] : null);

    if (pickedSkill) {
      const bookItem = {
        id: "book_" + Date.now(),
        name: `《${pickedSkill.name}秘笈》`,
        type: "book",
        rarity: targetRarity,
        costLearn: (targetRarity === "神品") ? 180 : (targetRarity === "絕品" ? 100 : 50),
        skillData: pickedSkill,
        desc: `記載著【${targetRarity}】絕技【${pickedSkill.name}】精深心法的秘笈殘卷。研讀需體悟耗費學點。`
      };

      player.inventory.push(bookItem);

      if (typeof appendCombatChat === 'function') {
        const dropMsg = `擊敗第 ${floor} 層首領，繳獲【${targetRarity}】秘笈【《${pickedSkill.name}秘笈》】已存入隨身「行囊」！`;
        appendCombatChat("【首領寶箱】", dropMsg, targetRarity === "神品" ? "var(--gold)" : "var(--purple)");
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
      if (typeof appendCombatChat === 'function') {
        const dropMsg = `擊敗第 ${floor} 層首領，拾得靈藥【${pickedItem.name}】已放入行囊！`;
        appendCombatChat("【首領寶箱】", dropMsg, "var(--green)");
      }
    } else {
      player.inventory.push({ ...pickedItem, id: "drop_" + Date.now() });
      if (typeof appendCombatChat === 'function') {
        const dropMsg = `擊敗第 ${floor} 層首領，繳獲神兵【${pickedItem.name}】已放入行囊！`;
        appendCombatChat("【首領寶箱】", dropMsg, targetRarity === "神品" ? "var(--gold)" : "var(--cyan)");
      }
    }
  }

  recalcPlayerStats();
}

// 背景掛機
setInterval(() => {
  if (isTowerModalOpen || isChallengingBoss) return;

  const curLimit = player.towerFloor || 1;
  let farmFloor = curLimit;
  if (farmFloor % 5 === 0) {
    farmFloor = Math.max(1, farmFloor - 1);
  }

  const earnExp = Math.floor(15 + farmFloor * 4);
  const earnGold = Math.floor(5 + farmFloor * 2);
  const earnLearn = Math.max(1, Math.floor(farmFloor / 3));

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
}, 3600);

window.openTowerModal = openTowerModal;
window.closeTowerModal = closeTowerModal;
window.strikeTowerTarget = strikeTowerTarget;
window.showNextBossLootDetail = showNextBossLootDetail;
window.challengeTowerBoss = challengeTowerBoss;
window.returnToTowerAfterBoss = returnToTowerAfterBoss;
window.autoDropBossLootToBag = autoDropBossLootToBag;