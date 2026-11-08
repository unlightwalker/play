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
    exp: Math.floor(100 + floor * 15),
    gold: Math.floor(40 + floor * 8),
    combat: 15,
    skill: { name: "降龍十八掌・亢龍有悔", baseMult: 2.8, rarity: "神品" },
    internalName: "純陽太極功",
    chest: { godRate, supremeRate: godRate >= 100 ? 0 : 19, upperRate: 60, bookRate: 50 },
    drops: []
  };
}

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
      ? `<b style="color:#ff4757;">⚠️ 第 ${floor} 層首領坐鎮！準備好後點擊「挑戰頭目」</b>` 
      : `距離首領戰尚餘: <b style="color:var(--gold);">${remain}</b> 層`;
  }
  if (previewText) {
    const c = getTowerBossConfig(nextBoss).chest || {};
    const god = Number(c.godRate) || 0, sup = Number(c.supremeRate) || 0;
    const parts = [];
    if (god >= 100) parts.push("必出【神品】");
    else {
      if (god > 0) parts.push(`神品 ${god}%`);
      if (sup > 0) parts.push(`絕品 ${sup}%`);
      parts.push("其餘為上品 / 良品");
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
  const chest = cfg.chest || {};
  const god = Number(chest.godRate) || 0;
  const sup = Number(chest.supremeRate) || 0;
  const extra = (cfg.drops || []).map(d => {
    const ref = d.kind === 'book' ? findSkillByRef(d.ref) : findItemByRef(d.ref);
    const name = ref ? (d.kind === 'book' ? `《${ref.name}秘笈》` : ref.name) : d.ref;
    return `• ${name} x${d.count || 1}（${d.rate}%）`;
  }).join('\n');
  gameNotify(`🎁【${cfg.name}・寶箱掉落池】\n` +
        `------------------------------------\n` +
        `寶箱品階：神品 ${god}%、絕品 ${sup}%，其餘為上品/良品\n` +
        `開出秘笈機率：${Number(chest.bookRate ?? 50)}%（否則為同品階裝備/靈藥）\n` +
        (extra ? `額外掉落：\n${extra}\n` : '') +
        `------------------------------------\n` +
        `擊敗該層首領時自動開啟繳獲並存入行囊！`);
}

function strikeTowerTarget() {
  if (!towerMonster || towerMonster.hp <= 0) return;

  // 首領關卡：不會自動開戰，須點擊「挑戰頭目」
  if (towerMonster.isBoss) {
    spawnTowerFloatingDmg("點擊「挑戰頭目」開戰", false);
    return;
  }

  const avgPower = getTowerAverageSkillAttackPower();
  const isCrit = Math.random() * 100 < ((player.stats ? player.stats.luck : 15) * 0.5 + 5);

  let dmg = Math.floor(avgPower * 1.5 + Math.random() * ((player.stats ? player.stats.arm : 20) * 0.5));
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
  const chest = cfg.chest || {};
  let godRate = Number(chest.godRate) || 0;
  if (godRate > 0 && player.talents && player.talents.some(t => t.id === "t_007")) {
    godRate = Math.min(100, godRate * 2.0);
  }
  const supremeRate = Math.min(100 - godRate, Number(chest.supremeRate) || 0);
  const upperRate = Number(chest.upperRate ?? 50);
  const bookRate = Number(chest.bookRate ?? 50);

  const roll = Math.random() * 100;
  let targetRarity;
  if (roll < godRate) targetRarity = "神品";
  else if (roll < godRate + supremeRate) targetRarity = "絕品";
  else targetRarity = (Math.random() * 100 < upperRate) ? "上品" : "良品";

  const color = targetRarity === "神品" ? "var(--gold)" : (targetRarity === "絕品" ? "var(--purple)" : "var(--cyan)");
  const pickRandom = (arr) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

  let gotName = null;
  if (Math.random() * 100 < bookRate) {
    const sk = pickRandom((typeof GLOBAL_SKILLS !== 'undefined') ? GLOBAL_SKILLS.filter(s => s.rarity === targetRarity) : []);
    if (sk) gotName = grantLootToBag('book', sk.id || sk.name, 1);
  }
  if (!gotName) {
    const it = pickRandom((typeof GLOBAL_ITEMS !== 'undefined') ? GLOBAL_ITEMS.filter(i => i.rarity === targetRarity && !i.noChest && i.type !== 'material') : [])
      || findItemByRef("item_snow_ginseng");
    if (it) gotName = grantLootToBag('item', it.id || it.name, 1);
  }
  if (gotName && typeof appendCombatChat === 'function') {
    appendCombatChat("【首領寶箱】", `擊敗第 ${floor} 層首領，繳獲【${targetRarity}】【${gotName}】已存入隨身「行囊」！`, color);
  }

  rollDropTable(cfg.drops, cfg.name);
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
window.onTowerActionButton = onTowerActionButton;
window.returnToTowerAfterBoss = returnToTowerAfterBoss;
window.autoDropBossLootToBag = autoDropBossLootToBag;