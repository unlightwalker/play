/**
 * ========================================================
 * 你的江湖 - 歷練通天塔系統模組 (tower.js) [修正防刷與背景掛機版]
 * 支援：
 * 1. 人形強敵立繪、血條、身法攻速與外功均值掌力
 * 2. 擊敗首領 BOSS 後強制進入下一層（杜絕重複刷同一隻 BOSS 刷神裝）
 * 3. 背景掛機不再自動爬塔，改為原地持續擊殺當前普通怪物，每次擊殺即時發放獎勵
 * 4. 戰利品掉落（39層前無神品/絕品，40層起依層數漸進掉落）
 * ========================================================
 */

let towerCurrentFloor = 1;
let towerMonster = null;
let towerTimer = null;
let towerBossSeconds = 30;
let isTowerModalOpen = false;

// 人形強敵立繪模板
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

// 通天塔攻擊力＝可用外功平均攻擊力
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
    return Math.floor(baseAtk * 1.0 + player.stats.arm * 0.6);
  }

  let totalPower = 0;
  usableSkills.forEach(sk => {
    const mult = (Number(sk.baseMult) || 1.3) * (1 + (sk.tier - 1) * 0.18 + (sk.progress / 100) * 0.18);
    totalPower += (baseAtk * mult + player.stats.arm * 0.6);
  });

  return Math.max(10, Math.floor(totalPower / usableSkills.length));
}

function openTowerModal() {
  isTowerModalOpen = true;
  towerCurrentFloor = player.towerFloor || 1;

  // 結算背景掛機斬獲（不爬塔，累積打怪收益）
  if (player.towerBgEarned && (player.towerBgEarned.kills > 0 || player.towerBgEarned.exp > 0)) {
    const bg = player.towerBgEarned;
    alert(`🏔️ 少俠重回歷練塔！在背景調息間共斬獲 ${bg.kills || 0} 名試煉悍敵！\n累積收穫修為 +${bg.exp}、銀兩 +${bg.gold}兩、學點 +${bg.learn}！`);
    player.towerBgEarned = { exp: 0, gold: 0, learn: 0, kills: 0 };
  }

  initTowerFloor(towerCurrentFloor);
  openModal('modal-tower');
  startTowerAutoAttackEngine();
}

function closeTowerModal() {
  isTowerModalOpen = false;
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

// 初始化層數強敵
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

  const avgPower = getTowerAverageSkillAttackPower();
  const interval = getTowerAttackSpeedInterval();
  const freqPerSec = (1000 / interval).toFixed(1);

  if (armDmgEl) armDmgEl.innerText = `${avgPower} (外功均值)`;
  if (spdRateEl) spdRateEl.innerText = `${freqPerSec} 次/秒 (${interval}ms)`;

  // 當前層數每小時收益預估
  const floor = towerMonster.floor;
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
  const avgPower = getTowerAverageSkillAttackPower();
  const isCrit = Math.random() * 100 < (player.stats.luck * 0.5 + 5);

  let dmg = Math.floor(avgPower * 1.5 + Math.random() * (player.stats.arm * 0.5));
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
    const isBoss = towerMonster.isBoss;
    const earnExp = Math.floor(15 + floor * 4);
    const earnGold = Math.floor(5 + floor * 2);
    const earnLearn = Math.max(1, Math.floor(floor / 3));

    player.exp += earnExp;
    player.gold += earnGold;
    player.learn += earnLearn;
    player.combat += 1;

    // 天賦：通天徹地 (每擊殺 1 名強敵自動恢復 5% 氣血)
    if (player.talents && player.talents.some(t => t.id === "t_012")) {
      player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp * 0.05));
    }

    // 推進歷史極限層
    if (floor >= player.towerFloor) {
      player.towerFloor = floor + 1;
    }

    updateProfileUI();

    // 首領關掉落
    if (isBoss) {
      autoDropBossLootToBag(floor);
      // ★ 核心修復：擊敗首領後強制進入下一層，避免不勾選自動挑戰時無限原地刷同隻 BOSS ★
      setTimeout(() => initTowerFloor(floor + 1), 220);
      return;
    }

    // 普通怪物層：依玩家是否勾選自動前進決定
    const autoBox = document.getElementById('tower-auto-advance');
    const canAdvance = autoBox ? autoBox.checked : true;

    if (canAdvance) {
      setTimeout(() => initTowerFloor(floor + 1), 220);
    } else {
      setTimeout(() => initTowerFloor(floor), 220); // 停留在當前普通怪層重複刷怪
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

// 每 5 層首領掉落
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
      alert(`🎁 戰利品捷報！擊敗第 ${floor} 層首領，繳獲【${targetRarity}】秘笈【《${pickedSkill.name}秘笈》】已直接存入隨身「行囊」！`);
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
      alert(`🎁 戰利品捷報！擊敗第 ${floor} 層首領，拾得靈藥【${pickedItem.name}】已放入行囊！`);
    } else {
      player.inventory.push({ ...pickedItem, id: "drop_" + Date.now() });
      alert(`🎁 戰利品捷報！擊敗第 ${floor} 層首領，繳獲神兵【${pickedItem.name}】已放入行囊！`);
    }
  }

  recalcPlayerStats();
}

// ==================== ★ 背景掛機循環（純刷怪不爬塔，每次擊殺即時獲取獎勵） ★ ====================
setInterval(() => {
  if (isTowerModalOpen) return; // 彈窗打開時由手動/前台引擎負責

  const curLimit = player.towerFloor || 1;
  // 掛機所在的層數：如果是 BOSS 層 (5的倍數)，背景自動停在前一層普通層刷怪，不擅自擊殺 BOSS
  let farmFloor = curLimit;
  if (farmFloor % 5 === 0) {
    farmFloor = Math.max(1, farmFloor - 1);
  }

  // 每次擊殺產生的獎勵（與前台擊殺完全一致）
  const earnExp = Math.floor(15 + farmFloor * 4);
  const earnGold = Math.floor(5 + farmFloor * 2);
  const earnLearn = Math.max(1, Math.floor(farmFloor / 3));

  // 即時發放至玩家帳戶
  player.exp += earnExp;
  player.gold += earnGold;
  player.learn += earnLearn;
  player.combat += 1;

  // 累加背景統計
  if (!player.towerBgEarned) {
    player.towerBgEarned = { exp: 0, gold: 0, learn: 0, kills: 0 };
  }
  player.towerBgEarned.exp += earnExp;
  player.towerBgEarned.gold += earnGold;
  player.towerBgEarned.learn += earnLearn;
  player.towerBgEarned.kills = (player.towerBgEarned.kills || 0) + 1;

  // 更新主面板修為/銀兩/學點顯示
  if (typeof updateProfileUI === 'function') {
    updateProfileUI();
  }
}, 3600); // 依平均戰鬥節奏約每 3.6 秒擊殺一隻，即時入帳

// 掛載全域
window.openTowerModal = openTowerModal;
window.closeTowerModal = closeTowerModal;
window.strikeTowerTarget = strikeTowerTarget;