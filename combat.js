/**
 * ========================================================
 * 你的江湖 - 核心戰鬥引擎 (combat.js) [抗坍塌防黑屏版]
 * 職責：雙外功獨立 ATB、火柴人專屬動作、極致打擊感、高空翻騰閃避
 * ========================================================
 */

let currentEnemy = null;
let enemyHp = 0;
let autoBattleTimer = null;
let isActing = false;
let isBossBattle = false;

let ext0Gauge = 0;
let ext1Gauge = 0;
let enemySpGauge = 0;

function calcDerivedCombatRates(atkStats, defStats) {
  let aSpd = (atkStats && Number(atkStats.speed)) || 40;
  let dSpd = (defStats && Number(defStats.speed)) || 40;
  let aArm = (atkStats && Number(atkStats.arm)) || 20;
  let aLck = (atkStats && Number(atkStats.luck)) || 15;
  let dBone = (defStats && Number(defStats.bone)) || 20;
  let dInner = (defStats && Number(defStats.inner)) || 20;

  let hitRate = Math.min(98, Math.max(65, Math.floor(90 + (aSpd - dSpd) * 0.35)));
  let dodgeRate = Math.min(40, Math.max(3, Math.floor(5 + (dSpd - aSpd) * 0.4)));
  let parryRate = Math.min(45, Math.max(5, Math.floor(dBone * 0.3 + dInner * 0.35)));
  let critRate = Math.min(50, Math.max(5, Math.floor(aLck * 0.5 + aArm * 0.1)));

  return { hitRate, dodgeRate, parryRate, critRate };
}

// 核心修復：把 DOM 切換放第一行，確保擂台畫面瞬間彈出！
function startBattleAgainst(enemyObj, isBoss = false) {
  isBossBattle = isBoss;
  currentEnemy = { ...enemyObj };

  // 1. 第一時間強制切換畫面，徹底杜絕黑屏或畫面不見！
  const menuView = document.getElementById('menu-view');
  const battleView = document.getElementById('battle-view');
  if (menuView) menuView.classList.add('hidden');
  if (battleView) {
    battleView.classList.add('active');
    battleView.style.display = 'flex';
  }

  // 2. 數值防呆保護
  if (!currentEnemy.stats) {
    currentEnemy.stats = {
      arm: Math.floor(currentEnemy.atk * 0.7),
      speed: currentEnemy.speed || 40,
      bone: Math.floor(currentEnemy.def * 1.5),
      inner: Math.floor(currentEnemy.atk * 0.5),
      int: 20,
      luck: 15
    };
  }
  if (isNaN(currentEnemy.speed) || currentEnemy.speed <= 0) currentEnemy.speed = 40;

  enemyHp = currentEnemy.maxHp;
  player.hp = Math.max(1, player.hp || player.maxHp);
  ext0Gauge = 0;
  ext1Gauge = 0;
  enemySpGauge = 0;
  isActing = false;

  const curW = player.equippedGear ? player.equippedGear.weapon : null;
  const curWType = getWeaponType(curW);
  const curWName = curW ? curW.name : "赤手空拳";

  const titleEl = document.getElementById('battle-loc-title');
  if (titleEl) titleEl.innerText = `⚔️ 對陣【${currentEnemy.realm || '強敵'}】${currentEnemy.name}`;

  const bannerEl = document.getElementById('combat-banner');
  if (bannerEl) bannerEl.innerHTML = `交鋒開始！你手持【${curWName} (${curWType})】，雙外功獨立充能中！`;

  // 確保火柴人武器外觀更新
  if (typeof updateWeaponSVG === 'function') updateWeaponSVG();

  updateCombatBars();
  updateSkillMetersUI();

  if (autoBattleTimer) clearInterval(autoBattleTimer);
  autoBattleTimer = setInterval(battleTick, 70);
}

function stopBattleAndExit() {
  if (autoBattleTimer) clearInterval(autoBattleTimer);
  autoBattleTimer = null;

  const menuView = document.getElementById('menu-view');
  const battleView = document.getElementById('battle-view');
  if (battleView) {
    battleView.classList.remove('active');
    battleView.style.display = 'none';
  }
  if (menuView) {
    menuView.classList.remove('hidden');
    menuView.style.display = 'block';
  }

  if (typeof refreshChatForCurrentLocation === 'function') {
    refreshChatForCurrentLocation();
  }
}

function battleTick() {
  if (isActing || !currentEnemy) return;

  const curW = player.equippedGear ? player.equippedGear.weapon : null;
  const wType = getWeaponType(curW);
  const wFactor = (typeof WEAPON_SPEED_FACTOR !== 'undefined') ? (WEAPON_SPEED_FACTOR[wType] || 1.0) : 1.0;
  const baseSpd = (Number(player.speed) > 0) ? Number(player.speed) : 45;

  const sk0 = equippedSlots.ext0;
  const isMatch0 = sk0 ? isSkillCompatibleWithWeapon(sk0, curW) : false;
  if (sk0 && isMatch0) {
    const rFactor0 = (typeof RARITY_SPEED_FACTOR !== 'undefined') ? (RARITY_SPEED_FACTOR[sk0.rarity] || 1.0) : 1.0;
    const tierBonus0 = 1 + (sk0.tier - 1) * 0.02;
    ext0Gauge += (baseSpd * wFactor * rFactor0 * tierBonus0) * 0.07;
  } else {
    ext0Gauge = 0;
  }

  const sk1 = equippedSlots.ext1;
  const isMatch1 = sk1 ? isSkillCompatibleWithWeapon(sk1, curW) : false;
  if (sk1 && isMatch1) {
    const rFactor1 = (typeof RARITY_SPEED_FACTOR !== 'undefined') ? (RARITY_SPEED_FACTOR[sk1.rarity] || 1.0) : 1.0;
    const tierBonus1 = 1 + (sk1.tier - 1) * 0.02;
    ext1Gauge += (baseSpd * wFactor * rFactor1 * tierBonus1) * 0.07;
  } else {
    ext1Gauge = 0;
  }

  if (!isMatch0 && !isMatch1) {
    ext0Gauge += (baseSpd * wFactor * 0.85) * 0.07;
  }

  const eSpeed = (currentEnemy && Number(currentEnemy.speed) > 0) ? Number(currentEnemy.speed) : 40;
  enemySpGauge += (eSpeed * 0.08);

  if (ext0Gauge > 100) ext0Gauge = 100;
  if (ext1Gauge > 100) ext1Gauge = 100;
  if (enemySpGauge > 100) enemySpGauge = 100;

  updateCombatBars();
  updateSkillMetersUI();

  if (ext0Gauge >= 100) {
    ext0Gauge = 0;
    executeSkillAttack(sk0, isMatch0, 0);
  } else if (ext1Gauge >= 100) {
    ext1Gauge = 0;
    executeSkillAttack(sk1, isMatch1, 1);
  } else if (enemySpGauge >= 100) {
    enemySpGauge = 0;
    executeEnemyAutoAttack();
  }
}

function updateSkillMetersUI() {
  const curW = player.equippedGear ? player.equippedGear.weapon : null;
  const wType = getWeaponType(curW);
  const wFactor = (typeof WEAPON_SPEED_FACTOR !== 'undefined') ? (WEAPON_SPEED_FACTOR[wType] || 1.0) : 1.0;

  const sk0 = equippedSlots.ext0;
  const isMatch0 = sk0 ? isSkillCompatibleWithWeapon(sk0, curW) : false;
  const nameEl0 = document.getElementById('sm-name-0');
  const spdEl0 = document.getElementById('sm-speed-0');
  const fillEl0 = document.getElementById('sm-fill-0');

  if (sk0) {
    const req = getSkillWeaponReq(sk0);
    if (isMatch0) {
      if (nameEl0) nameEl0.innerHTML = `${sk0.name} <small style="color:#2ecc71;">[✔ 契合:${wType}]</small>`;
      if (spdEl0) spdEl0.innerText = `速度: x${(wFactor * ((typeof RARITY_SPEED_FACTOR !== 'undefined') ? RARITY_SPEED_FACTOR[sk0.rarity] || 1 : 1)).toFixed(2)}`;
    } else {
      if (nameEl0) nameEl0.innerHTML = `${sk0.name} <small style="color:#e74c3c; font-weight:bold;">[⚠️ 兵刃不合(需${req})]</small>`;
      if (spdEl0) spdEl0.innerText = `停滯`;
    }
  } else {
    if (nameEl0) nameEl0.innerHTML = `<span style="color:#666;">招式壹：未配戴</span>`;
    if (spdEl0) spdEl0.innerText = `--`;
  }
  if (fillEl0) fillEl0.style.width = ext0Gauge + '%';

  const sk1 = equippedSlots.ext1;
  const isMatch1 = sk1 ? isSkillCompatibleWithWeapon(sk1, curW) : false;
  const nameEl1 = document.getElementById('sm-name-1');
  const spdEl1 = document.getElementById('sm-speed-1');
  const fillEl1 = document.getElementById('sm-fill-1');

  if (sk1) {
    const req = getSkillWeaponReq(sk1);
    if (isMatch1) {
      if (nameEl1) nameEl1.innerHTML = `${sk1.name} <small style="color:#2ecc71;">[✔ 契合:${wType}]</small>`;
      if (spdEl1) spdEl1.innerText = `速度: x${(wFactor * ((typeof RARITY_SPEED_FACTOR !== 'undefined') ? RARITY_SPEED_FACTOR[sk1.rarity] || 1 : 1)).toFixed(2)}`;
    } else {
      if (nameEl1) nameEl1.innerHTML = `${sk1.name} <small style="color:#e74c3c; font-weight:bold;">[⚠️ 兵刃不合(需${req})]</small>`;
      if (spdEl1) spdEl1.innerText = `停滯`;
    }
  } else {
    if (nameEl1) nameEl1.innerHTML = `<span style="color:#666;">招式貳：未配戴</span>`;
    if (spdEl1) spdEl1.innerText = `--`;
  }
  if (fillEl1) fillEl1.style.width = ext1Gauge + '%';

  const enemyFill = document.getElementById('sm-fill-enemy');
  const enemySpd = document.getElementById('sm-speed-enemy');
  if (enemyFill) enemyFill.style.width = enemySpGauge + '%';
  if (enemySpd) enemySpd.innerText = `身法: ${currentEnemy ? currentEnemy.speed : '--'}`;
}

function playUniqueSkillAnimation(skillName, pRig, arm, curWType) {
  const vfxContainer = document.getElementById('arena-vfx-container');
  if (vfxContainer) vfxContainer.innerHTML = '';

  if (skillName.includes("彈指")) {
    pRig.classList.add('anim-tanzhi-body');
    if (vfxContainer) {
      const laser = document.createElement('div');
      laser.className = 'vfx-tanzhi-laser';
      vfxContainer.appendChild(laser);
      setTimeout(() => laser.remove(), 260);
    }
    return;
  }

  // 暗器專屬不良少年單手帥氣甩動
  if (curWType === "暗器" || skillName.includes("針") || skillName.includes("釘") || skillName.includes("鏢") || skillName.includes("花雨")) {
    pRig.classList.add('anim-thug-flick');
    return;
  }

  pRig.classList.add('anim-thrust-body');
  if (arm) arm.classList.add('anim-thrust-arm');
}

function clearPlayerAnimations(pRig, arm) {
  pRig.classList.remove(
    'anim-thrust-body', 'anim-tanzhi-body', 'anim-thug-flick',
    'anim-heavy-hit-player', 'anim-jump-dodge-player'
  );
  if (arm) arm.classList.remove('anim-thrust-arm');
}

function executeSkillAttack(skill, isMatch, slotIndex) {
  isActing = true;
  const pRig = document.getElementById('p-rig');
  const eRig = document.getElementById('e-rig');
  const arm = document.getElementById('p-arm');

  const curW = player.equippedGear ? player.equippedGear.weapon : null;
  const curWType = getWeaponType(curW);
  const curWName = curW ? curW.name : "赤手空拳";

  pRig.classList.remove('idle-stance');

  if (skill && isMatch) {
    playUniqueSkillAnimation(skill.name, pRig, arm, curWType);
  } else {
    pRig.classList.add('anim-thrust-body');
    if (arm) arm.classList.add('anim-thrust-arm');
  }

  setTimeout(() => {
    const rates = calcDerivedCombatRates(player.stats, currentEnemy.stats);
    const rollHit = Math.random() * 100;
    const rollDodge = Math.random() * 100;
    const rollParry = Math.random() * 100;
    const rollCrit = Math.random() * 100;

    // 1. 未命中
    if (rollHit > rates.hitRate) {
      spawnFloatingDmg("未命中!", 220, 55, "dmg-miss");
      const banner = document.getElementById('combat-banner');
      if (banner) banner.innerHTML = `你招式疾出，但被對手看破，<span style="color:#8395a7;">【攻擊落空】！</span>`;
      finishTurn();
      return;
    }

    // 2. 閃避：敵人縱身高跳避開貼地攻擊！
    if (rollDodge < rates.dodgeRate) {
      if (eRig) eRig.classList.add('anim-jump-dodge-enemy');
      spawnFloatingDmg("騰空閃避!", 220, 40, "dmg-dodge");
      const banner = document.getElementById('combat-banner');
      if (banner) banner.innerHTML = `【${currentEnemy.name}】身如靈鶴，<span style="color:#54a0ff;">【向上躍起翻騰】</span>避開了你的攻勢！`;
      finishTurn();
      return;
    }

    let actualMult = 0.6;
    let skillDesc = "平推粗招";
    let evalText = "基礎";

    if (skill && isMatch) {
      actualMult = (Number(skill.baseMult) || 1.3) * (1 + (skill.tier - 1) * 0.18 + (skill.progress / 100) * 0.18);
      evalText = (typeof getKungfuEval === 'function') ? getKungfuEval(skill.tier, skill.progress) : `${skill.tier}重`;
      skillDesc = skill.name;
    }

    let baseDmg = (player.currentAtk * actualMult) + (player.stats.arm * 0.7) - (currentEnemy.def * 0.5);
    baseDmg = Math.max(6, Math.floor(baseDmg + Math.random() * 7));

    // 3. 招架格擋
    let isParried = false;
    if (rollParry < rates.parryRate) {
      isParried = true;
      baseDmg = Math.floor(baseDmg * 0.5);
      if (eRig) eRig.classList.add('anim-parry');
      spawnFloatingDmg(`格擋! -${baseDmg}`, 220, 55, "dmg-parry");
      const banner = document.getElementById('combat-banner');
      if (banner) banner.innerHTML = `【${currentEnemy.name}】催動真氣，<span style="color:#feca57;">【招架格擋】</span>減免半數傷害！`;
    }

    // 4. 會心暴擊
    let isCrit = false;
    if (!isParried && rollCrit < rates.critRate) {
      isCrit = true;
      baseDmg = Math.floor(baseDmg * 1.6);
      spawnFloatingDmg(`暴擊! -${baseDmg}`, 220, 50, "dmg-crit");
      triggerScreenShake();
      if (eRig) eRig.classList.add('anim-heavy-hit-enemy'); // 暴烈受創頓挫後仰
      const banner = document.getElementById('combat-banner');
      if (banner) banner.innerHTML = `福至心靈！你引爆弱點造成<span style="color:#ff3838; font-weight:bold;">【會心暴擊】${baseDmg}</span> 點傷害！`;
    } else if (!isParried) {
      if (eRig) eRig.classList.add('anim-heavy-hit-enemy'); // 暴烈受創頓挫後仰
      spawnFloatingDmg(`-${baseDmg}`, 220, 55, "dmg-normal");

      const banner = document.getElementById('combat-banner');
      if (banner) {
        if (skill && isMatch) {
          banner.innerHTML = `施展【<b style="color:var(--cyan);">${skillDesc}</b>】（${evalText}），重挫對手 <b>${baseDmg}</b> 點！`;
        } else {
          banner.innerHTML = `<span style="color:#e74c3c; font-weight:bold;">⚠️ 兵刃不符！手持【${curWName}(${curWType})】無法催動絕技，只能平推造成 ${baseDmg} 點微傷！</span>`;
        }
      }
    }

    enemyHp = Math.max(0, enemyHp - baseDmg);
    updateCombatBars();

    if (skill && isMatch && !isParried) {
      if (typeof outputBattleNarrativeAndComment === 'function') {
        outputBattleNarrativeAndComment(skill.name, evalText, skill.jinyongDesc || "氣貫長虹！");
      }
    }

    if (enemyHp <= 0) {
      if (autoBattleTimer) clearInterval(autoBattleTimer);
      autoBattleTimer = null;
      player.exp += currentEnemy.exp;
      player.gold += currentEnemy.gold;
      player.combat += (currentEnemy.combat || 6);

      if (isBossBattle) {
        player.sectRank = "出師大成";
        if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
        setTimeout(() => {
          alert(`🏆 掌門長嘆：「青出於藍而勝於藍！少俠武功冠絕宗門，今日准你【出師大成】！」`);
          stopBattleAndExit();
        }, 300);
      } else {
        if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
        setTimeout(() => {
          alert(`🎉 切磋勝出！擊敗【${currentEnemy.name}】！獲得修為 +${currentEnemy.exp}、銀兩 +${currentEnemy.gold}兩！`);
          stopBattleAndExit();
        }, 300);
      }
    }

    finishTurn();
  }, 220);

  function finishTurn() {
    setTimeout(() => {
      clearPlayerAnimations(pRig, arm);
      if (eRig) eRig.classList.remove('anim-heavy-hit-enemy', 'anim-jump-dodge-enemy', 'anim-parry');
      pRig.classList.add('idle-stance');
      isActing = false;
    }, 400);
  }
}

function executeEnemyAutoAttack() {
  isActing = true;
  const pRig = document.getElementById('p-rig');
  const eRig = document.getElementById('e-rig');

  if (eRig) {
    eRig.classList.remove('idle-stance');
    eRig.classList.add('anim-enemy-thrust-body');
  }

  setTimeout(() => {
    const rates = calcDerivedCombatRates(currentEnemy.stats, player.stats);
    const rollHit = Math.random() * 100;
    const rollDodge = Math.random() * 100;
    const rollParry = Math.random() * 100;

    // 玩家閃避：向上躍起避開攻擊！
    if (rollHit > rates.hitRate || rollDodge < rates.dodgeRate) {
      pRig.classList.add('anim-jump-dodge-player');
      spawnFloatingDmg("騰空閃避!", 60, 40, "dmg-dodge");
      const banner = document.getElementById('combat-banner');
      if (banner) banner.innerHTML = `你輕靈一縱，<span style="color:#54a0ff;">【向上躍起避過】</span>了對手的貼地殺招！`;
      finishEnemyTurn();
      return;
    }

    let eDmg = Math.max(6, Math.floor(currentEnemy.atk + (currentEnemy.stats.arm * 0.6) - (player.def * 0.6) + Math.random() * 6));

    if (rollParry < rates.parryRate) {
      eDmg = Math.floor(eDmg * 0.5);
      pRig.classList.add('anim-parry');
      spawnFloatingDmg(`格擋! -${eDmg}`, 60, 55, "dmg-parry");
      const banner = document.getElementById('combat-banner');
      if (banner) banner.innerHTML = `你橫兵引勁，<span style="color:#feca57;">【格擋招架】</span>減免了半數傷害！`;
    } else {
      // 玩家被重創：暴烈受創後仰頓挫！
      pRig.classList.add('anim-heavy-hit-player');
      spawnFloatingDmg(`-${eDmg}`, 60, 55, "dmg-crit");
      const banner = document.getElementById('combat-banner');
      if (banner) banner.innerHTML = `【${currentEnemy.name}】猛烈發難，震創你 <b>${eDmg}</b> 點氣血！`;
    }

    player.hp = Math.max(0, player.hp - eDmg);
    updateCombatBars();

    if (player.hp <= 0) {
      alert("傷重不支，少俠只得暫行退避調養...");
      player.hp = Math.floor(player.maxHp * 0.3);
      stopBattleAndExit();
      if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
    }

    finishEnemyTurn();
  }, 220);

  function finishEnemyTurn() {
    setTimeout(() => {
      if (eRig) {
        eRig.classList.remove('anim-enemy-thrust-body');
        eRig.classList.add('idle-stance');
      }
      pRig.classList.remove('anim-heavy-hit-player', 'anim-jump-dodge-player', 'anim-parry');
      isActing = false;
    }, 400);
  }
}

function updateCombatBars() {
  const pPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const pHpBar = document.getElementById('p-hp-bar');
  if (pHpBar) pHpBar.style.width = pPct + '%';

  if (currentEnemy) {
    const ePct = Math.max(0, Math.min(100, (enemyHp / currentEnemy.maxHp) * 100));
    const eHpBar = document.getElementById('e-hp-bar');
    if (eHpBar) eHpBar.style.width = ePct + '%';
  }
}

function spawnFloatingDmg(text, left, top, cssClass) {
  const arena = document.getElementById('arena-box');
  if (!arena) return;
  const p = document.createElement('div');
  p.className = `dmg-num ${cssClass}`;
  p.innerText = text;
  p.style.left = left + 'px';
  p.style.top = top + 'px';
  arena.appendChild(p);
  setTimeout(() => p.remove(), 650);
}

function triggerScreenShake() {
  const app = document.getElementById('phone-app');
  if (!app) return;
  app.classList.remove('shake');
  void app.offsetWidth;
  app.classList.add('shake');
}

window.startBattleAgainst = startBattleAgainst;
window.stopBattleAndExit = stopBattleAndExit;
window.calcDerivedCombatRates = calcDerivedCombatRates;
window.updateSkillMetersUI = updateSkillMetersUI;
window.updateCombatBars = updateCombatBars;