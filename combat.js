/**
 * ========================================================
 * 你的江湖 - 核心戰鬥引擎 (combat.js) [IF式特異規則與光影連鎖旗艦版]
 * 支援：
 * 1. IF 式特異機制規則引擎 (支援觸發器與效果動態派發)
 * 2. 編輯器三段式光影 (vfxChain) 與專屬絕學特效無縫對接
 * 3. 嚴格 80% 內力平衡循環基準 (外功耗藍與內功回調)
 * 4. ATB 即時身法蓄力與單一行動條決策系統
 * 5. 全套戰術架勢 (真氣護體 / 輕靈閃避 / 武功招架 / 運氣納真)
 * ========================================================
 */

// 安全取得兵刃招式庫（防範重複宣告）
var COMBAT_WEAPON_VARIANTS = window.WEAPON_ATTACK_VARIANTS || {
  "拳": [
    { act: "直衝", name: "黑虎掏心", desc: "沉肩墜肘，一記沉猛衝拳直轟中門！" },
    { act: "穿掌", name: "白蛇吐信", desc: "掌風凌厲，直切敵方喉頭要害！" },
    { act: "下劈", name: "開山劈石", desc: "兩掌運足外勁，凌空自上而下猛砸！" },
    { act: "勾拳", name: "雙龍出海", desc: "雙拳破風呼嘯，左右交夾而至！" }
  ],
  "劍": [
    { act: "疾刺", name: "白虹貫日", desc: "長劍一振嗡嗡作響，化為一線白虹疾射！" },
    { act: "橫削", name: "清風拂柳", desc: "劍刃平抹，如微風過葉輕靈無痕！" },
    { act: "挑腕", name: "天外飛仙", desc: "手腕靈動翻飛，劍尖由下而上反撩敵肘！" },
    { act: "轉刺", name: "蒼松迎客", desc: "身法轉折，反手自肋下刺出致命一劍！" }
  ],
  "刀": [
    { act: "力劈", name: "力劈華山", desc: "雙手握刀怒斬而下，帶起剛猛刺耳呼嘯！" },
    { act: "橫掃", name: "橫掃千軍", desc: "厚背重刀攔腰怒斬，勢不可當！" },
    { act: "翻撩", name: "夜叉探海", desc: "刀身倒轉，寒芒自下盤疾撩而起！" },
    { act: "回旋", name: "狂風卷雲", desc: "踏步轉身，順勢甩出一記圓月刀光！" }
  ],
  "棍": [
    { act: "重砸", name: "泰山壓頂", desc: "熟銅長棍攜萬鈞之勢，凌空砸碎青石！" },
    { act: "直搗", name: "靈蛇出洞", desc: "長棍如槍疾搗胸口，迅疾如雷！" },
    { act: "橫掄", name: "橫掃乾坤", desc: "雙臂借力橫掄一圈，迫得強敵連連後退！" },
    { act: "挑打", name: "撥雲見日", desc: "棍梢向上斜挑，直取對手握兵之腕！" }
  ],
  "暗器": [
    { act: "甩手", name: "滿天星斗", desc: "腕力暗吐，銀星呼嘯破空直取敵方雙目！" },
    { act: "彈指", name: "流星追月", desc: "屈指輕彈，破空銳嘯直穿氣門！" },
    { act: "回旋", name: "回風舞柳", desc: "暗器劃出刁鑽弧線，自視覺死角回旋射至！" },
    { act: "連發", name: "七星連珠", desc: "雙手連環飛甩，數枚破甲寒芒接踵而至！" }
  ]
};

let currentEnemy = null;
let enemyHp = 0;
let enemyMp = 100;
let enemyMaxMp = 100;
let autoBattleTimer = null;
let isActing = false;
let isBossBattle = false;
let currentCombatType = 'field';
let currentTowerBossFloor = 0;
let actionLockTimer = null;

let playerAtbGauge = 0;
let enemyAtbGauge = 0;

let playerStance = 'none';
let enemyStance = 'none';

let enemyEquippedSkill = null;
let enemyInternalSkill = null;

let isPlayerTurnPaused = false;

// 護體真氣盾
let playerShield = 0;
let enemyShield = 0;

// ==================== 1. 核心平衡：內力消耗與每回自回 (嚴格 80%) ====================
function getAccurateSkillCostMp(skill) {
  if (!skill) return 0;
  const rarityCosts = { "凡品": 10, "良品": 25, "上品": 50, "絕品": 100, "神品": 150 };
  if (skill.rarity && rarityCosts[skill.rarity]) {
    return rarityCosts[skill.rarity];
  }
  if (skill.costMp && Number(skill.costMp) > 0) return Math.round(Number(skill.costMp));
  return 20;
}

function getInternalTurnMpRegen(internal) {
  if (!internal) return 8;
  const rarityRegen = { "凡品": 8, "良品": 20, "上品": 40, "絕品": 80, "神品": 120 };
  if (internal.rarity && rarityRegen[internal.rarity]) {
    return rarityRegen[internal.rarity];
  }
  return Number(internal.turnMpRegen) || 20;
}

// ==================== 2. IF 特異機制規則引擎 ====================
/**
 * 觸發特異規則解析執行
 * @param {string} triggerEvent 觸發事件
 * @param {object} ctx 上下文資料 { isPlayer, skill, damage }
 */
function triggerIfRules(triggerEvent, ctx = {}) {
  const isPlayer = ctx.isPlayer !== false;
  const equipped = (typeof equippedSlots !== 'undefined' && equippedSlots) ? equippedSlots : {};

  // 待檢索的技能列表（心法與主動招式均檢索）
  const skillsToCheck = [];
  if (isPlayer) {
    if (equipped.internal) skillsToCheck.push(equipped.internal);
    if (ctx.skill) skillsToCheck.push(ctx.skill);
    else {
      if (equipped.ext0) skillsToCheck.push(equipped.ext0);
      if (equipped.ext1) skillsToCheck.push(equipped.ext1);
    }
  } else {
    if (enemyInternalSkill) skillsToCheck.push(enemyInternalSkill);
    if (ctx.skill) skillsToCheck.push(ctx.skill);
    else if (enemyEquippedSkill) skillsToCheck.push(enemyEquippedSkill);
  }

  skillsToCheck.forEach(skillObj => {
    if (!skillObj || !Array.isArray(skillObj.ifRules)) return;

    skillObj.ifRules.forEach(rule => {
      if (!rule || rule.trigger !== triggerEvent) return;

      // 解析數值 (支援固定值如 25，或百分比如 15%)
      let rawVal = String(rule.val || "0").trim();
      let isPercent = rawVal.endsWith("%");
      let numericVal = parseFloat(rawVal) || 0;

      // 決定目標物件
      let isTargetSelf = (rule.target === "自身" || rule.target === "友方同伴");
      let targetIsPlayer = isTargetSelf ? isPlayer : !isPlayer;

      // 執行效果
      switch (rule.action) {
        case "回復氣血": {
          let maxVal = targetIsPlayer ? (player.maxHp || 350) : (currentEnemy ? currentEnemy.maxHp : 300);
          let healAmount = Math.round(isPercent ? (maxVal * (numericVal / 100)) : numericVal);
          if (healAmount > 0) {
            if (targetIsPlayer) {
              player.hp = Math.min(player.maxHp, player.hp + healAmount);
              if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`+${healAmount}氣血`, 60, 45, "dmg-dodge");
            } else if (currentEnemy) {
              enemyHp = Math.min(currentEnemy.maxHp, enemyHp + healAmount);
              if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`+${healAmount}氣血`, 220, 45, "dmg-dodge");
            }
            updateCombatBannerAndLog(
              `【${skillObj.name}】特異生效：氣血回復 ${healAmount} 點！`,
              `玄功運轉生生不息！【${skillObj.name}】引發奇效，為${targetIsPlayer ? '少俠' : currentEnemy.name}回補了 ${healAmount} 點氣血！`,
              "#2ecc71"
            );
          }
          break;
        }

        case "扣除氣血": {
          let maxVal = targetIsPlayer ? (player.maxHp || 350) : (currentEnemy ? currentEnemy.maxHp : 300);
          let dmgAmount = Math.round(isPercent ? (maxVal * (numericVal / 100)) : numericVal);
          if (dmgAmount > 0) {
            if (targetIsPlayer) {
              player.hp = Math.max(0, player.hp - dmgAmount);
              if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`-${dmgAmount}`, 60, 50, "dmg-crit");
            } else if (currentEnemy) {
              enemyHp = Math.max(0, enemyHp - dmgAmount);
              if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`-${dmgAmount}`, 220, 50, "dmg-crit");
            }
          }
          break;
        }

        case "回復內力": {
          let maxVal = targetIsPlayer ? (player.maxMp || 200) : (enemyMaxMp || 100);
          let mpGain = Math.round(isPercent ? (maxVal * (numericVal / 100)) : numericVal);
          if (mpGain > 0) {
            if (targetIsPlayer) {
              player.mp = Math.min(player.maxMp, player.mp + mpGain);
              if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`+${mpGain}內力`, 60, 30, "dmg-dodge");
            } else {
              enemyMp = Math.min(enemyMaxMp, enemyMp + mpGain);
              if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`+${mpGain}內力`, 220, 30, "dmg-dodge");
            }
          }
          break;
        }

        case "吸收傷害化為罡氣盾": {
          let maxVal = targetIsPlayer ? (player.maxHp || 350) : (currentEnemy ? currentEnemy.maxHp : 300);
          let shieldGain = Math.round(isPercent ? (maxVal * (numericVal / 100)) : numericVal);
          if (shieldGain > 0) {
            if (targetIsPlayer) {
              playerShield = Math.max(playerShield, shieldGain);
              if (typeof spawnQiShieldVfx === 'function') spawnQiShieldVfx(true);
              if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`罡氣盾 +${shieldGain}`, 60, 25, "dmg-parry");
            } else {
              enemyShield = Math.max(enemyShield, shieldGain);
              if (typeof spawnQiShieldVfx === 'function') spawnQiShieldVfx(false);
              if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`護體盾 +${shieldGain}`, 220, 25, "dmg-parry");
            }
          }
          break;
        }

        case "反震傷害": {
          let incomingDmg = ctx.damage || 40;
          let reflectDmg = Math.round(isPercent ? (incomingDmg * (numericVal / 100)) : numericVal);
          if (reflectDmg > 0) {
            if (isPlayer) {
              enemyHp = Math.max(0, enemyHp - reflectDmg);
              if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`反震! -${reflectDmg}`, 220, 45, "dmg-parry");
            } else {
              player.hp = Math.max(0, player.hp - reflectDmg);
              if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`反震! -${reflectDmg}`, 60, 45, "dmg-parry");
            }
          }
          break;
        }

        default:
          break;
      }
    });
  });

  updateCombatBars();
}

// ==================== 3. 戰鬥場景切換安全調度 ====================
function combatLocalShowMenu() {
  const m = document.getElementById('menu-view');
  const t = document.getElementById('tower-view');
  const b = document.getElementById('battle-view');
  if (t) { t.classList.remove('active'); t.style.display = 'none'; }
  if (b) { b.classList.remove('active'); b.style.display = 'none'; }
  if (m) { m.classList.remove('hidden'); m.style.display = 'flex'; }
}

function combatLocalShowTower() {
  const m = document.getElementById('menu-view');
  const t = document.getElementById('tower-view');
  const b = document.getElementById('battle-view');
  if (m) { m.classList.add('hidden'); m.style.display = 'none'; }
  if (b) { b.classList.remove('active'); b.style.display = 'none'; }
  if (t) { t.classList.add('active'); t.style.display = 'flex'; }
}

function combatLocalShowBattle() {
  const m = document.getElementById('menu-view');
  const t = document.getElementById('tower-view');
  const b = document.getElementById('battle-view');
  if (m) { m.classList.add('hidden'); m.style.display = 'none'; }
  if (t) { t.classList.remove('active'); t.style.display = 'none'; }
  if (b) { b.classList.add('active'); b.style.display = 'flex'; }
}

function calcDerivedCombatRates(atkStats, defStats, defStance = 'none') {
  let aSpd = (atkStats && Number(atkStats.speed)) || 40;
  let dSpd = (defStats && Number(defStats.speed)) || 40;
  let aArm = (atkStats && Number(atkStats.arm)) || 20;
  let aLck = (atkStats && Number(atkStats.luck)) || 15;
  let dBone = (defStats && Number(defStats.bone)) || 20;
  let dInner = (defStats && Number(defStats.inner)) || 20;

  let hitRate = Math.min(98, Math.max(65, Math.round(90 + (aSpd - dSpd) * 0.35)));
  let dodgeRate = Math.min(45, Math.max(3, Math.round(5 + (dSpd - aSpd) * 0.4)));
  let parryRate = Math.min(50, Math.max(5, Math.round(dBone * 0.3 + dInner * 0.35)));
  let critRate = Math.min(55, Math.max(5, Math.round(aLck * 0.5 + aArm * 0.1)));

  if (defStance === 'evasion') dodgeRate += 55;
  if (defStance === 'parry') parryRate += 45;

  const equipped = (typeof equippedSlots !== 'undefined' && equippedSlots) ? equippedSlots : {};
  if (equipped.internal && equipped.internal.specialEffect) {
    const sp = equipped.internal.specialEffect;
    if (sp.critRateAdd) critRate += sp.critRateAdd;
    if (sp.parryRateAdd) parryRate += sp.parryRateAdd;
  }

  if (typeof player !== 'undefined' && Array.isArray(player.talents)) {
    if (player.talents.some(t => t.dodgeRateAdd)) dodgeRate += 15;
    if (player.talents.some(t => t.noDodge)) dodgeRate = 0;
    if (player.talents.some(t => t.parryRateAdd)) parryRate += 20;
    if (player.talents.some(t => t.noParry)) parryRate = 0;
    if (player.talents.some(t => t.lockCrit)) critRate = 5;
    if (player.talents.some(t => t.noCrit)) critRate = 0;
    if (player.talents.some(t => t.hitPenalty)) hitRate -= 15;
  }

  return { hitRate, dodgeRate, parryRate, critRate };
}

// ==================== 4. 發起對決與初始化 ====================
function startBattleAgainst(enemyObj, battleType = false, bossFloor = 0) {
  if (!enemyObj) {
    console.error("startBattleAgainst: 未傳入有效敵人物件");
    return;
  }

  if (battleType === 'tower_boss') {
    currentCombatType = 'tower_boss';
    isBossBattle = true;
    currentTowerBossFloor = bossFloor;
  } else if (battleType === true || battleType === 'sect_master') {
    currentCombatType = 'sect_master';
    isBossBattle = true;
    currentTowerBossFloor = 0;
  } else {
    currentCombatType = 'field';
    isBossBattle = false;
    currentTowerBossFloor = 0;
  }

  currentEnemy = { ...enemyObj };
  if (typeof player !== 'undefined') player._hasRevivedInCombat = false;
  playerShield = 0;
  enemyShield = 0;

  combatLocalShowBattle();

  if (!currentEnemy.stats) {
    currentEnemy.stats = {
      arm: Math.round((currentEnemy.atk || 20) * 0.7),
      speed: currentEnemy.speed || 40,
      bone: Math.round((currentEnemy.def || 10) * 1.5),
      inner: Math.round((currentEnemy.atk || 20) * 0.5),
      int: 20,
      luck: 15
    };
  }
  if (isNaN(currentEnemy.speed) || currentEnemy.speed <= 0) currentEnemy.speed = 40;

  if (currentEnemy.skills && currentEnemy.skills.length > 0) {
    enemyEquippedSkill = currentEnemy.skills[0];
    enemyInternalSkill = currentEnemy.internalSkill || null;
  } else {
    setupEnemySkills(currentEnemy);
  }

  enemyHp = Math.round(currentEnemy.maxHp || 200);
  enemyMaxMp = Math.round(Math.max(50, (currentEnemy.stats.inner || 20) * 10));
  enemyMp = enemyMaxMp;

  if (typeof player !== 'undefined') {
    player.hp = Math.round(Math.max(1, player.hp || player.maxHp || 350));
    player.mp = Math.round(Math.max(10, player.mp || player.maxMp || 200));
  }

  playerAtbGauge = 0;
  enemyAtbGauge = 0;
  playerStance = 'none';
  enemyStance = 'none';
  isPlayerTurnPaused = false;
  unlockAction();
  hidePlayerCommandPanel();

  const curW = (typeof player !== 'undefined' && player.equippedGear) ? player.equippedGear.weapon : null;
  const curWType = (typeof getWeaponType === 'function') ? getWeaponType(curW) : "拳";
  const curWName = curW ? curW.name : "赤手空拳";
  const eSkillName = enemyEquippedSkill ? enemyEquippedSkill.name : "外家普攻";

  const titleEl = document.getElementById('battle-loc-title');
  if (titleEl) {
    titleEl.innerText = (currentCombatType === 'tower_boss') 
      ? `🏔️ 通天塔第 ${currentTowerBossFloor} 層首領戰・${currentEnemy.name}` 
      : `⚔️ 對陣【${currentEnemy.realm || '強敵'}】${currentEnemy.name}`;
  }

  updateCombatBannerAndLog(
    `交鋒開始！你手持【${curWName} (${curWType})】對陣【${currentEnemy.name}】！`,
    `只見狂風獵獵，兩道身影肅然立於戰圈兩端！少俠手挽【${curWName}】抱拳見禮，對面【${currentEnemy.name}】冷哼一聲，周身真氣隱隱翻湧（修習絕藝：${eSkillName}），一場武林惡鬥一觸即發！`,
    "#5dade2"
  );

  if (typeof updateWeaponSVG === 'function') updateWeaponSVG();

  updateCombatBars();
  updateSingleAtbMetersUI();

  if (autoBattleTimer) clearInterval(autoBattleTimer);
  autoBattleTimer = setInterval(battleTick, 70);
}

function setupEnemySkills(enemy) {
  const eName = enemy.name || "";
  enemyEquippedSkill = null;
  enemyInternalSkill = null;

  if (eName.includes("少林") || eName.includes("僧")) {
    enemyEquippedSkill = { name: "大力金剛掌", baseMult: 1.8, rarity: "上品", costMp: 50 };
    enemyInternalSkill = { name: "金剛鐵布衫", defReduce: 0.55 };
  } else if (eName.includes("武當") || eName.includes("道")) {
    enemyEquippedSkill = { name: "武當太極長拳", baseMult: 1.75, rarity: "上品", costMp: 50 };
    enemyInternalSkill = { name: "純陽太極功", defReduce: 0.5 };
  } else if (eName.includes("唐門") || eName.includes("暗客") || eName.includes("死士")) {
    enemyEquippedSkill = { name: "暴雨梨花針", baseMult: 2.1, rarity: "神品", costMp: 150 };
    enemyInternalSkill = { name: "萬毒枯榮心經", defReduce: 0.45 };
  } else if (eName.includes("華山") || eName.includes("劍修")) {
    enemyEquippedSkill = { name: "狂風快劍", baseMult: 1.65, rarity: "良品", costMp: 25 };
    enemyInternalSkill = { name: "華山正氣心決", defReduce: 0.4 };
  } else if (eName.includes("一刀") || eName.includes("浪人") || eName.includes("影武")) {
    enemyEquippedSkill = { name: "居合疾影拔刀斬", baseMult: 1.85, rarity: "良品", costMp: 25 };
    enemyInternalSkill = { name: "殘月斬鐵心經", defReduce: 0.48 };
  } else {
    enemyEquippedSkill = { name: "八卦六合刀", baseMult: 1.5, rarity: "良品", costMp: 25 };
    enemyInternalSkill = { name: "吐納坐忘訣", defReduce: 0.35 };
  }
}

function stopBattleAndExit() {
  if (autoBattleTimer) clearInterval(autoBattleTimer);
  autoBattleTimer = null;
  unlockAction();
  hidePlayerCommandPanel();

  if (currentCombatType === 'tower_boss') {
    combatLocalShowTower();
  } else {
    combatLocalShowMenu();
  }

  if (typeof refreshChatForCurrentLocation === 'function') {
    refreshChatForCurrentLocation();
  }
}

function lockAction(maxLockMs = 700) {
  isActing = true;
  if (actionLockTimer) clearTimeout(actionLockTimer);
  actionLockTimer = setTimeout(() => unlockAction(), maxLockMs);
}

function unlockAction() {
  isActing = false;
  if (actionLockTimer) clearTimeout(actionLockTimer);
  actionLockTimer = null;

  const pRig = document.getElementById('p-rig');
  const eRig = document.getElementById('e-rig');
  const arm = document.getElementById('p-arm');

  if (typeof clearPlayerAnimations === 'function') {
    clearPlayerAnimations(pRig, arm);
  }
  if (pRig) {
    pRig.classList.remove('anim-thrust-body');
    pRig.classList.add('idle-stance');
  }
  if (eRig) {
    eRig.classList.remove('anim-enemy-thrust-body', 'anim-heavy-hit-enemy', 'anim-jump-dodge-enemy', 'anim-parry');
    eRig.classList.add('idle-stance');
  }
}

function updateCombatBannerAndLog(displayText, logDetail, tagColor = "var(--cyan)") {
  const banner = document.getElementById('combat-banner');
  if (banner) {
    banner.innerHTML = `<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${displayText}</span>`;
  }

  if (typeof pushChatMessage === 'function') {
    pushChatMessage('combat', '【對戰】', logDetail || displayText, tagColor);
  }
}

// ==================== 5. 每回合心法被動與特異結算 ====================
function applyPlayerInternalTurnPassives() {
  const equipped = (typeof equippedSlots !== 'undefined' && equippedSlots) ? equippedSlots : {};
  const internal = equipped.internal;
  if (!internal || typeof player === 'undefined') return;

  // 1. 內力基礎自回 (同品階外功耗藍的嚴格 80%)
  const mpRegen = getInternalTurnMpRegen(internal);
  if (mpRegen > 0) {
    const beforeMp = player.mp;
    player.mp = Math.min(player.maxMp, player.mp + mpRegen);
    const actualGain = Math.round(player.mp - beforeMp);
    if (actualGain > 0 && typeof spawnFloatingDmg === 'function') {
      spawnFloatingDmg(`+${actualGain}內力`, 60, 40, "dmg-dodge");
    }
  }

  // 2. 觸發「每回合開始時」IF 特異規則
  triggerIfRules("每回合開始時", { isPlayer: true });

  // 3. 氣血低於 30% 檢查觸發
  if ((player.hp / player.maxHp) <= 0.3) {
    triggerIfRules("氣血低於30%時", { isPlayer: true });
  }

  // 4. 舊版專屬心法相容特效
  const sp = internal.specialEffect;
  if (sp) {
    if (sp.shieldPct) {
      const shieldVal = Math.round(player.maxHp * sp.shieldPct);
      playerShield = Math.max(playerShield, shieldVal);
      if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`罡氣盾 +${shieldVal}`, 60, 25, "dmg-parry");
      if (typeof spawnQiShieldVfx === 'function') spawnQiShieldVfx(true);
    }

    if (sp.turnHpRegenPct) {
      let pct = sp.turnHpRegenPct;
      if (sp.lowHpDouble && (player.hp / player.maxHp) < 0.4) pct *= 2;
      const hpRegen = Math.round(player.maxHp * pct);
      if (hpRegen > 0) {
        player.hp = Math.min(player.maxHp, player.hp + hpRegen);
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`+${hpRegen}氣血`, 60, 55, "dmg-dodge");
      }
    }

    if (sp.poisonTurnDmg && currentEnemy && enemyHp > 0) {
      const pDmg = Math.round(sp.poisonTurnDmg);
      enemyHp = Math.max(0, enemyHp - pDmg);
      if (sp.poisonTurnMpDmg) enemyMp = Math.max(0, enemyMp - Math.round(sp.poisonTurnMpDmg));
      if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`劇毒! -${pDmg}`, 220, 30, "dmg-crit");
      if (enemyHp <= 0) handleCombatVictory();
    }
  }

  updateCombatBars();
}

function applyEnemyInternalTurnPassives() {
  if (!enemyInternalSkill) return;
  const eMpRegen = 20;
  enemyMp = Math.min(enemyMaxMp, enemyMp + eMpRegen);

  triggerIfRules("每回合開始時", { isPlayer: false });
  if (currentEnemy && (enemyHp / currentEnemy.maxHp) <= 0.3) {
    triggerIfRules("氣血低於30%時", { isPlayer: false });
  }

  const eName = enemyInternalSkill.name || "";
  if (eName.includes("金剛") || eName.includes("鐵布衫")) {
    const eShieldVal = Math.round(currentEnemy.maxHp * 0.08);
    enemyShield = Math.max(enemyShield, eShieldVal);
    if (typeof spawnQiShieldVfx === 'function') spawnQiShieldVfx(false);
  }
  updateCombatBars();
}

// ==================== 6. ATB 戰鬥輪詢迴圈 ====================
function battleTick() {
  if (isActing || !currentEnemy || isPlayerTurnPaused) return;

  try {
    const curPlayer = (typeof player !== 'undefined' && player) ? player : null;
    if (!curPlayer) return;

    const curW = curPlayer.equippedGear ? curPlayer.equippedGear.weapon : null;
    const wType = (typeof getWeaponType === 'function') ? getWeaponType(curW) : "拳";
    const wFactor = (typeof WEAPON_SPEED_FACTOR !== 'undefined') ? (WEAPON_SPEED_FACTOR[wType] || 1.0) : 1.0;
    
    const equipped = (typeof equippedSlots !== 'undefined' && equippedSlots) ? equippedSlots : {};
    const internal = equipped.internal;
    const internalSpeedBoost = (internal && internal.specialEffect && internal.specialEffect.atbBoostPct) ? (1 + internal.specialEffect.atbBoostPct) : 1.0;
    
    const baseSpd = (Number(curPlayer.speed) > 0) ? Number(curPlayer.speed) : 45;
    playerAtbGauge += (baseSpd * wFactor * internalSpeedBoost * 0.055);

    const eSpeed = (currentEnemy && Number(currentEnemy.speed) > 0) ? Number(currentEnemy.speed) : 40;
    enemyAtbGauge += (eSpeed * 0.05);

    if (playerAtbGauge > 100) playerAtbGauge = 100;
    if (enemyAtbGauge > 100) enemyAtbGauge = 100;

    updateSingleAtbMetersUI();

    if (playerAtbGauge >= 100) {
      isPlayerTurnPaused = true;
      playerStance = 'none';
      applyPlayerInternalTurnPassives();
      showPlayerCommandPanel();
      return;
    }

    if (enemyAtbGauge >= 100) {
      enemyAtbGauge = 0;
      enemyStance = 'none';
      updateSingleAtbMetersUI();
      applyEnemyInternalTurnPassives();
      executeEnemyAIDecision();
      return;
    }
  } catch (err) {
    console.error("battleTick 輪詢保護攔截:", err);
  }
}

function updateSingleAtbMetersUI() {
  const pFill = document.getElementById('p-atb-fill');
  const eFill = document.getElementById('e-atb-fill');
  if (pFill) pFill.style.width = Math.round(playerAtbGauge) + '%';
  if (eFill) eFill.style.width = Math.round(enemyAtbGauge) + '%';
}

function updateCombatBars() {
  try {
    if (typeof player === 'undefined') return;
    const pPct = Math.max(0, Math.min(100, Math.round((player.hp / player.maxHp) * 100)));
    const pHpBar = document.getElementById('p-hp-bar');
    if (pHpBar) {
      pHpBar.style.width = pPct + '%';
      pHpBar.style.boxShadow = playerShield > 0 ? "0 0 8px #f1c40f" : "none";
    }

    const pMpPct = Math.max(0, Math.min(100, Math.round((player.mp / player.maxMp) * 100)));
    const pMpBar = document.getElementById('p-mp-bar');
    if (pMpBar) pMpBar.style.width = pMpPct + '%';

    if (currentEnemy) {
      const ePct = Math.max(0, Math.min(100, Math.round((enemyHp / currentEnemy.maxHp) * 100)));
      const eHpBar = document.getElementById('e-hp-bar');
      if (eHpBar) eHpBar.style.width = ePct + '%';

      const eMpPct = Math.max(0, Math.min(100, Math.round((enemyMp / enemyMaxMp) * 100)));
      const eMpBar = document.getElementById('e-mp-bar');
      if (eMpBar) eMpBar.style.width = eMpPct + '%';
    }

    if (typeof updateProfileUI === 'function') updateProfileUI();
  } catch (e) {
    console.warn("updateCombatBars 保護:", e);
  }
}

// ==================== 7. 玩家戰術決策面板 ====================
function showPlayerCommandPanel() {
  try {
    let panel = document.getElementById('battle-cmd-panel');
    if (!panel) return;
    panel.style.display = 'flex';

    const equipped = (typeof equippedSlots !== 'undefined' && equippedSlots) ? equippedSlots : {};
    const sk0 = equipped.ext0 || null;
    const sk1 = equipped.ext1 || null;
    const name0 = sk0 ? sk0.name : "招式壹";
    const name1 = sk1 ? sk1.name : "招式貳";
    const mpCost0 = getAccurateSkillCostMp(sk0);
    const mpCost1 = getAccurateSkillCostMp(sk1);

    const missingMp = Math.max(0, player.maxMp - player.mp);
    const internal = equipped.internal;
    const bonusMeditate = (internal && internal.specialEffect && internal.specialEffect.bonusMeditateMp) ? internal.specialEffect.bonusMeditateMp : 0;
    const restoreEst = Math.max(25, Math.round(missingMp * 0.45)) + bonusMeditate;

    const costColor0 = player.mp < mpCost0 ? '#e74c3c' : 'var(--cyan)';
    const costColor1 = player.mp < mpCost1 ? '#e74c3c' : 'var(--cyan)';
    const shieldHint = playerShield > 0 ? ` <span style="color:#f1c40f;">(罡氣盾:${playerShield})</span>` : '';

    panel.innerHTML = `
      <div class="cmd-row-top">
        <b style="color:var(--gold); font-size:12px;">⚡ 行動就緒！少俠請決策：${shieldHint}</b>
        <small style="color:var(--cyan); font-size:11px;">內力: ${Math.round(player.mp)}/${Math.round(player.maxMp)}</small>
      </div>
      <div class="cmd-btn-grid" id="cmd-main-grid">
        <button class="cmd-action-btn" onclick="openAttackSubMenu()">⚔️ 攻擊招式</button>
        <button class="cmd-action-btn" onclick="handlePlayerAction('qi_defense')">🛡️ 真氣防禦 (20內力)</button>
        <button class="cmd-action-btn" onclick="handlePlayerAction('evasion')">💨 輕靈閃避 (15內力)</button>
        <button class="cmd-action-btn" onclick="handlePlayerAction('parry')">🥋 武功格擋 (15內力)</button>
        <button class="cmd-action-btn" onclick="handlePlayerAction('meditate')" style="color:#2ecc71;">🧘 運氣 (+${restoreEst}內力)</button>
        <button class="cmd-action-btn" onclick="handlePlayerAction('flee')" style="color:#e74c3c;">🏃 走為上策</button>
      </div>
      <div class="cmd-sub-menu" id="cmd-attack-submenu" style="display:none;">
        <button class="cmd-action-btn" onclick="executePlayerCastSkill(0)">${name0} <small style="color:${costColor0};">(${mpCost0}內力)</small></button>
        <button class="cmd-action-btn" onclick="executePlayerCastSkill(1)">${name1} <small style="color:${costColor1};">(${mpCost1}內力)</small></button>
        <button class="cmd-action-btn" onclick="executePlayerCastNormal()">平實普攻 (無耗內力)</button>
        <button class="cmd-action-btn" onclick="closeAttackSubMenu()" style="opacity:0.7;">↩ 返回</button>
      </div>
    `;
  } catch (e) {
    console.error("showPlayerCommandPanel 執行例外:", e);
  }
}

function openAttackSubMenu() {
  const g = document.getElementById('cmd-main-grid');
  const s = document.getElementById('cmd-attack-submenu');
  if (g) g.style.display = 'none';
  if (s) s.style.display = 'grid';
}

function closeAttackSubMenu() {
  const g = document.getElementById('cmd-main-grid');
  const s = document.getElementById('cmd-attack-submenu');
  if (s) s.style.display = 'none';
  if (g) g.style.display = 'grid';
}

function hidePlayerCommandPanel() {
  const panel = document.getElementById('battle-cmd-panel');
  if (panel) panel.style.display = 'none';
}

function handlePlayerAction(type) {
  if (type === 'qi_defense') {
    if (player.mp < 20) {
      updateCombatBannerAndLog("真氣滯澀，難以凝出護體罡氣！", `少俠欲引導經脈真氣護體，奈何丹田真氣不足，護體罡氣一觸即潰散無形！`, "#e67e22");
      if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg("內力不足!", 60, 45, "dmg-miss");
      return;
    }
    player.mp -= 20;
    playerStance = 'qi_defense';
    if (typeof spawnQiShieldVfx === 'function') spawnQiShieldVfx(true);
    updateCombatBars();
    updateCombatBannerAndLog("少俠氣沉丹田，周身凝成【真氣防禦】！", `少俠雙目微合，內勁如洪濤般覆蓋全身三十六大要穴，凝出護體罡氣，大幅消解接下來的一切打擊！`, "var(--cyan)");
    finishPlayerTurn();
  } else if (type === 'evasion') {
    if (player.mp < 15) {
      updateCombatBannerAndLog("步法無力，無法施展輕靈身法！", `少俠足下乏力，無法催動絕頂輕功，只能凝神應對強敵攻勢！`, "#e67e22");
      if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg("內力不足!", 60, 45, "dmg-miss");
      return;
    }
    player.mp -= 15;
    playerStance = 'evasion';
    updateCombatBars();
    updateCombatBannerAndLog("身形如燕，擺出【輕靈閃避】步法！", `少俠足尖在地面輕點，身如狂風中的柳葉般飄忽不定，凝神洞察對手殺招，準備騰空翻越！`, "#54a0ff");
    finishPlayerTurn();
  } else if (type === 'parry') {
    if (player.mp < 15) {
      updateCombatBannerAndLog("腕勁不足，難以凝勁成招架！", `少俠手臂真氣不足，難以藉力化力，無法架起堅固的招架防線！`, "#e67e22");
      if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg("內力不足!", 60, 45, "dmg-miss");
      return;
    }
    player.mp -= 15;
    playerStance = 'parry';
    updateCombatBars();
    updateCombatBannerAndLog("橫兵沉腕，擺出【武功格擋】伺機反震！", `少俠橫兵當胸，以千斤墜沉穩守住門戶，只待敵刃攻來便順勢卸勁反震！`, "#feca57");
    finishPlayerTurn();
  } else if (type === 'meditate') {
    const missing = Math.max(0, player.maxMp - player.mp);
    const equipped = (typeof equippedSlots !== 'undefined' && equippedSlots) ? equippedSlots : {};
    const internal = equipped.internal;
    const bonus = (internal && internal.specialEffect && internal.specialEffect.bonusMeditateMp) ? internal.specialEffect.bonusMeditateMp : 0;
    const restoreAmount = Math.round(Math.max(25, missing * 0.45) + bonus);

    player.mp = Math.min(player.maxMp, player.mp + restoreAmount);
    if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`+${restoreAmount} 內力`, 60, 40, "dmg-dodge");
    updateCombatBars();
    updateCombatBannerAndLog(
      `吐故納新，行功一周天【運氣】回復 ${restoreAmount} 點內力！`, 
      `少俠暫斂鋒芒退後半步，暗運玄門內功心法，深深吸納天地靈氣，丹田氣海再度充盈，【運氣】回復了 ${restoreAmount} 點內力！`, 
      "#2ecc71"
    );
    finishPlayerTurn();
  } else if (type === 'flee') {
    handlePlayerFlee();
  }
}

function finishPlayerTurn() {
  hidePlayerCommandPanel();
  playerAtbGauge = 0;
  isPlayerTurnPaused = false;
  updateSingleAtbMetersUI();
}

function executePlayerCastSkill(slotIdx) {
  const equipped = (typeof equippedSlots !== 'undefined' && equippedSlots) ? equippedSlots : {};
  const sk = slotIdx === 0 ? equipped.ext0 : equipped.ext1;
  const cost = getAccurateSkillCostMp(sk);

  const curW = (typeof player !== 'undefined' && player.equippedGear) ? player.equippedGear.weapon : null;
  const curWType = (typeof getWeaponType === 'function') ? getWeaponType(curW) : "拳";
  const curWName = curW ? curW.name : "空手肉掌";
  const skName = sk ? sk.name : (slotIdx === 0 ? "招式壹" : "招式貳");

  const internal = equipped.internal;
  let actualCost = cost;
  if (internal && internal.specialEffect && internal.specialEffect.freeMpChance) {
    if (Math.random() < internal.specialEffect.freeMpChance) {
      actualCost = 0;
      if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg("九陽無消耗!", 60, 40, "dmg-crit");
    }
  }

  if (player.mp < actualCost) {
    const variants = (COMBAT_WEAPON_VARIANTS && COMBAT_WEAPON_VARIANTS[curWType]) 
      ? COMBAT_WEAPON_VARIANTS[curWType] 
      : (COMBAT_WEAPON_VARIANTS && COMBAT_WEAPON_VARIANTS["拳"]) || [{ act: "直衝", name: "蓄勁直擊", desc: "沉腰發勁直衝一拳！" }];
    const move = variants[Math.floor(Math.random() * variants.length)];

    finishPlayerTurn();
    if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg("內力不濟 轉普攻!", 60, 45, "dmg-parry");

    const narrativeMsg = `少俠本欲催動【${skName}】發起絕殺，無奈真氣接續不上，情急之下只得藉著【${curWName}】以一式【${move.act}式・${move.name}】倉促變招搶攻！`;
    updateCombatBannerAndLog(`真氣提不上來！以【${move.act}式】慌忙應戰！`, narrativeMsg, '#ff9f43');

    executePlayerNormalAttack(curWType, move);
    return;
  }

  player.mp -= actualCost;
  updateCombatBars();
  finishPlayerTurn();

  const isMatch = sk ? (typeof isSkillCompatibleWithWeapon === 'function' ? isSkillCompatibleWithWeapon(sk, curW) : true) : true;
  executeSkillAttack(sk, isMatch, slotIdx);
}

function executePlayerCastNormal(presetMove) {
  finishPlayerTurn();
  const curW = (typeof player !== 'undefined' && player.equippedGear) ? player.equippedGear.weapon : null;
  const curWType = (typeof getWeaponType === 'function') ? getWeaponType(curW) : "拳";
  executePlayerNormalAttack(curWType, presetMove);
}

function handlePlayerFlee() {
  if (currentCombatType === 'tower_boss' || isBossBattle) {
    updateCombatBannerAndLog("強敵殺氣鎖定，死戰不退！", `少俠欲借身法抽身退走，無奈強敵滔天殺氣鎖定前後退路，通天試煉死戰不退！無法逃跑！`, "#e74c3c");
    return;
  }
  const pSpd = player.stats ? player.stats.speed : 45;
  const eSpd = currentEnemy.stats ? currentEnemy.stats.speed : 40;
  const fleeChance = Math.min(85, Math.max(30, 50 + (pSpd - eSpd) * 0.8));

  if (Math.random() * 100 < fleeChance) {
    if (typeof pushChatMessage === 'function') {
      pushChatMessage('combat', '【走為上策】', `少俠虛晃一招躍出丈外，身法如燕掠過樹梢，成功脫離險境！`, '#2ecc71');
    }
    stopBattleAndExit();
  } else {
    updateCombatBannerAndLog("抽身受阻！對手看破了退路！", `少俠抽身後退，卻被【${currentEnemy.name}】搶先一步封死生門！`, "#e74c3c");
    finishPlayerTurn();
  }
}

// ==================== 8. 招式打擊與受創解析 ====================
function executePlayerNormalAttack(wType, presetMove) {
  lockAction(450);
  const pRig = document.getElementById('p-rig');
  const arm = document.getElementById('p-arm');

  const variants = (COMBAT_WEAPON_VARIANTS && COMBAT_WEAPON_VARIANTS[wType]) 
    ? COMBAT_WEAPON_VARIANTS[wType] 
    : (COMBAT_WEAPON_VARIANTS && COMBAT_WEAPON_VARIANTS["拳"]) || [{ act: "直衝", name: "蓄勁直擊", desc: "沉腰發勁直衝一拳！" }];
  const move = presetMove || variants[Math.floor(Math.random() * variants.length)];

  if (pRig) {
    pRig.classList.remove('idle-stance');
    void pRig.offsetWidth;
    pRig.classList.add('anim-thrust-body');
  }
  if (arm) {
    void arm.offsetWidth;
    arm.classList.add('anim-thrust-arm');
  }

  if (typeof playUniqueSkillAnimation === 'function') {
    playUniqueSkillAnimation("基礎劍刺", pRig, arm, wType);
  }

  // 觸發「進行普通攻擊時」IF 規則
  triggerIfRules("進行普通攻擊時", { isPlayer: true });

  setTimeout(() => {
    try {
      const rates = calcDerivedCombatRates(player.stats, currentEnemy.stats, enemyStance);

      if (Math.random() * 100 > rates.hitRate) {
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg("普攻落空", 220, 55, "dmg-miss");
        updateCombatBannerAndLog(`少俠一式【${move.act}式・${move.name}】落空！`, `少俠出招【${move.name}】，勁風呼嘯而過，惜被對手警覺橫移半步避開！`, "#8395a7");
        unlockAction();
        return;
      }

      let dmg = Math.round(Math.max(5, (player.currentAtk || player.baseAtk || 20) * 0.75 + (player.stats ? player.stats.arm : 20) * 0.4 - (currentEnemy.def || 10) * 0.4 + Math.random() * 6));

      if (enemyStance === 'qi_defense') {
        dmg = Math.round(dmg * 0.4);
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`真氣吸收! -${dmg}`, 220, 35, "dmg-parry");
      }

      if (enemyStance === 'parry' && Math.random() * 100 < rates.parryRate) {
        const reflect = Math.round(dmg * 0.5);
        dmg = Math.round(dmg * 0.5);
        player.hp = Math.max(0, player.hp - reflect);
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`反震! -${reflect}`, 60, 45, "dmg-parry");
        triggerIfRules("成功招架時", { isPlayer: false, damage: reflect });
      }

      // 觸發防守方「受到攻擊時」
      triggerIfRules("受到攻擊時", { isPlayer: false, damage: dmg });

      if (enemyShield > 0) {
        const absorbed = Math.min(dmg, enemyShield);
        enemyShield -= absorbed;
        dmg -= absorbed;
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`敵盾抵消! -${absorbed}`, 220, 25, "dmg-parry");
      }

      enemyHp = Math.max(0, enemyHp - dmg);
      if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`-${dmg}`, 220, 55, "dmg-normal");

      updateCombatBannerAndLog(`你使出【${move.act}式・${move.name}】命中造成 ${dmg} 點傷害！`, `少俠沉著出招，命中對手造成 ${dmg} 點實質創傷！`, "var(--cyan)");
      updateCombatBars();

      if (enemyHp <= 0) {
        handleCombatVictory();
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => unlockAction(), 160);
    }
  }, 140);
}

function executeEnemyNormalAttack() {
  lockAction(450);
  const eRig = document.getElementById('e-rig');

  if (eRig) {
    eRig.classList.remove('idle-stance');
    void eRig.offsetWidth;
    eRig.classList.add('anim-enemy-thrust-body');
  }

  triggerIfRules("進行普通攻擊時", { isPlayer: false });

  setTimeout(() => {
    try {
      const rates = calcDerivedCombatRates(currentEnemy.stats, player.stats, playerStance);

      if (Math.random() * 100 < rates.dodgeRate) {
        const pRig = document.getElementById('p-rig');
        if (pRig) {
          pRig.classList.remove('idle-stance');
          pRig.classList.add('anim-jump-dodge-player');
        }
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg("騰空閃避!", 60, 40, "dmg-dodge");
        triggerIfRules("閃避攻擊時", { isPlayer: true });
        updateCombatBannerAndLog(`步法輕靈，躍起避過快招！`, `【${currentEnemy.name}】招式削來，少俠宛若穿花拂柳騰空旋身飄然避開！`, "#54a0ff");
        unlockAction();
        return;
      }

      let eDmg = Math.round(Math.max(4, (currentEnemy.atk || 20) * 0.7 - (player.def || 10) * 0.4 + Math.random() * 5));

      if (playerStance === 'qi_defense') {
        eDmg = Math.round(eDmg * 0.4);
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`真氣吸收! -${eDmg}`, 60, 35, "dmg-parry");
      }

      if (playerStance === 'parry' && Math.random() * 100 < rates.parryRate) {
        const reflect = Math.round(eDmg * 0.5);
        eDmg = Math.round(eDmg * 0.5);
        enemyHp = Math.max(0, enemyHp - reflect);
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`反震! -${reflect}`, 220, 45, "dmg-parry");
        triggerIfRules("成功招架時", { isPlayer: true, damage: reflect });
      }

      triggerIfRules("受到攻擊時", { isPlayer: true, damage: eDmg });

      if (playerShield > 0) {
        const absorbed = Math.min(eDmg, playerShield);
        playerShield -= absorbed;
        eDmg -= absorbed;
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`護盾吸收 -${absorbed}`, 60, 25, "dmg-parry");
      }

      player.hp = Math.max(0, player.hp - eDmg);
      if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`-${eDmg}`, 60, 55, "dmg-normal");

      updateCombatBannerAndLog(`【${currentEnemy.name}】連招搶攻，創傷你 ${eDmg} 點氣血！`, `對手眼中殺芒大盛，連環快攻籠罩而下！痛失 ${eDmg} 點氣血！`, "#e74c3c");
      updateCombatBars();

      if (player.hp <= 0) {
        checkPlayerDefeat();
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => unlockAction(), 160);
    }
  }, 140);
}

function executeEnemyAIDecision() {
  const hpRatio = enemyHp / currentEnemy.maxHp;
  const skill = enemyEquippedSkill;
  const skillCost = getAccurateSkillCostMp(skill);

  if (hpRatio < 0.3 && enemyMp >= 20) {
    const roll = Math.random();
    if (roll < 0.45) {
      enemyMp -= 20;
      enemyStance = 'qi_defense';
      if (typeof spawnQiShieldVfx === 'function') spawnQiShieldVfx(false);
      updateCombatBars();
      updateCombatBannerAndLog(`【${currentEnemy.name}】運氣凝成【真氣防禦】護體！`, `對手收斂門戶，護體真氣環繞全身！`, "var(--gold)");
      return;
    } else if (roll < 0.75 && enemyMp >= 15) {
      enemyMp -= 15;
      enemyStance = 'evasion';
      updateCombatBars();
      updateCombatBannerAndLog(`【${currentEnemy.name}】身如鬼魅，擺出【輕靈閃避】架勢！`, `對手身法變得縹緲莫測！`, "#54a0ff");
      return;
    }
  }

  if (enemyMp < 25 && Math.random() < 0.35) {
    const missing = Math.max(0, enemyMaxMp - enemyMp);
    const restoreAmount = Math.round(Math.max(20, missing * 0.4));
    enemyMp += restoreAmount;
    if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`+${restoreAmount} 內力`, 220, 40, "dmg-dodge");
    updateCombatBars();
    updateCombatBannerAndLog(`【${currentEnemy.name}】吞吐內息，【運氣】調勻了內力！`, `對手氣沉丹田，內力再度充沛！`, "#2ecc71");
    return;
  }

  if (enemyMp >= skillCost && skill && Math.random() < 0.65) {
    enemyMp -= skillCost;
    updateCombatBars();
    executeEnemySkillAttack();
    return;
  }

  if (enemyMp >= 15 && Math.random() < 0.25) {
    enemyMp -= 15;
    enemyStance = 'parry';
    updateCombatBars();
    updateCombatBannerAndLog(`【${currentEnemy.name}】橫兵蓄勢，擺出【武功格擋】伺機反擊！`, `對手緊鎖門戶，雙目如炬！`, "#feca57");
    return;
  }

  executeEnemyNormalAttack();
}

function executeEnemySkillAttack() {
  lockAction(700);
  const eRig = document.getElementById('e-rig');
  const skill = enemyEquippedSkill || { name: "外家重手", baseMult: 1.5 };

  if (eRig) {
    eRig.classList.remove('idle-stance');
    void eRig.offsetWidth;
    eRig.classList.add('anim-enemy-thrust-body');
  }

  if (typeof playEnemySkillVfx === 'function') {
    playEnemySkillVfx(skill.name);
  }

  triggerIfRules("施展外功時", { isPlayer: false, skill: skill });

  updateCombatBannerAndLog(
    `⚠️ 危機！【${currentEnemy.name}】施展【${skill.name}】轟至！`,
    `⚠️ 殺氣滔天！【${currentEnemy.name}】運足周身功力，施展出成名殺招【${skill.name}】雷霆轟至！`,
    "#ff4757"
  );

  setTimeout(() => {
    try {
      let sDmg = Math.round(Math.max(8, ((currentEnemy.atk || 20) * (skill.baseMult || 1.5)) + ((currentEnemy.stats ? currentEnemy.stats.arm : 20) * 0.6) - ((player.def || 10) * 0.5) + Math.random() * 8));

      if (playerStance === 'qi_defense') {
        sDmg = Math.round(sDmg * 0.45);
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`真氣吸收!`, 60, 35, "dmg-parry");
      }

      triggerIfRules("受到攻擊時", { isPlayer: true, damage: sDmg });

      if (playerShield > 0) {
        const absorbed = Math.min(sDmg, playerShield);
        playerShield -= absorbed;
        sDmg -= absorbed;
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`護盾抵扣 -${absorbed}`, 60, 25, "dmg-parry");
      }

      player.hp = Math.max(0, player.hp - sDmg);
      if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`絕技! -${sDmg}`, 60, 50, "dmg-crit");
      if (typeof triggerScreenShake === 'function') triggerScreenShake();

      updateCombatBars();

      if (player.hp <= 0) {
        checkPlayerDefeat();
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => unlockAction(), 240);
    }
  }, 260);
}

// ==================== 9. 外功絕技施展 (含三段式光影與 IF 規則) ====================
function executeSkillAttack(skill, isMatch, slotIndex, onFinishCallback) {
  const isIttoryu = skill && skill.name.includes("一之太刀");
  const maxLock = isIttoryu ? 1100 : 700;
  lockAction(maxLock);

  const pRig = document.getElementById('p-rig');
  const eRig = document.getElementById('e-rig');
  const arm = document.getElementById('p-arm');

  const curW = (typeof player !== 'undefined' && player.equippedGear) ? player.equippedGear.weapon : null;
  const curWType = (typeof getWeaponType === 'function') ? getWeaponType(curW) : "拳";

  if (pRig) {
    pRig.classList.remove('idle-stance');
    void pRig.offsetWidth;
  }

  const basicSkillName = (typeof getBasicSkillName === 'function') 
    ? getBasicSkillName(slotIndex === 0 ? 'ext0' : 'ext1') 
    : `基礎${curWType}法`;
    
  const skillEffectiveName = skill ? skill.name : basicSkillName;

  // 播放動畫與光影 (若具備後台 vfxChain 則無縫觸發)
  if (typeof playUniqueSkillAnimation === 'function') {
    playUniqueSkillAnimation(skillEffectiveName, pRig, arm, curWType, skill);
  }

  // 觸發「施展外功時」IF 規則
  triggerIfRules("施展外功時", { isPlayer: true, skill: skill });

  const strikeDelay = isIttoryu ? 560 : 200;
  const finishDelay = isIttoryu ? 360 : 260;

  setTimeout(() => {
    try {
      const rates = calcDerivedCombatRates(player.stats, currentEnemy.stats, enemyStance);
      const rollHit = Math.random() * 100;
      const rollDodge = Math.random() * 100;
      const rollParry = Math.random() * 100;
      const rollCrit = Math.random() * 100;

      if (rollHit > rates.hitRate) {
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg("未命中!", 220, 55, "dmg-miss");
        updateCombatBannerAndLog(`你招式落空！`, `少俠出招【${skillEffectiveName}】，被對手料敵機先、仰身避開！`, "#8395a7");
        finishSkillTurn();
        return;
      }

      if (rollDodge < rates.dodgeRate) {
        if (eRig) {
          eRig.classList.remove('idle-stance');
          eRig.classList.add('anim-jump-dodge-enemy');
        }
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg("騰空閃避!", 220, 40, "dmg-dodge");
        triggerIfRules("閃避攻擊時", { isPlayer: false });
        updateCombatBannerAndLog(`【${currentEnemy.name}】身法閃避！`, `對手足尖點地凌空翻躍，險之又險地避過了攻勢！`, "#54a0ff");
        finishSkillTurn();
        return;
      }

      let actualMult = 1.15;
      let skillDesc = basicSkillName;

      if (skill && isMatch) {
        actualMult = (Number(skill.baseMult) || 1.3) * (1 + ((skill.tier || 1) - 1) * 0.18 + ((skill.progress || 0) / 100) * 0.18);
        skillDesc = skill.name;
      }

      let enemyDefCalc = currentEnemy.def || 10;
      let baseDmg = Math.round(((player.currentAtk || player.baseAtk || 20) * actualMult) + (player.stats.arm * 0.7) - (enemyDefCalc * 0.5));

      if (enemyStance === 'qi_defense') {
        baseDmg = Math.round(baseDmg * 0.4);
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`真氣吸收!`, 220, 35, "dmg-parry");
      }

      let isParried = false;
      if (rollParry < rates.parryRate) {
        isParried = true;
        baseDmg = Math.round(baseDmg * 0.5);
        if (eRig) {
          eRig.classList.remove('idle-stance');
          eRig.classList.add('anim-parry');
        }
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`格擋! -${baseDmg}`, 220, 55, "dmg-parry");
        triggerIfRules("成功招架時", { isPlayer: false, damage: baseDmg });
      }

      if (!isParried && rollCrit < rates.critRate) {
        baseDmg = Math.round(baseDmg * 1.6);
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`暴擊! -${baseDmg}`, 220, 50, "dmg-crit");
        if (typeof triggerScreenShake === 'function') triggerScreenShake();
        triggerIfRules("達成暴擊時", { isPlayer: true, damage: baseDmg });
      } else if (!isParried) {
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`-${baseDmg}`, 220, 55, "dmg-normal");
      }

      triggerIfRules("受到攻擊時", { isPlayer: false, damage: baseDmg });

      if (enemyShield > 0) {
        const absorbed = Math.min(baseDmg, enemyShield);
        enemyShield -= absorbed;
        baseDmg -= absorbed;
        if (typeof spawnFloatingDmg === 'function') spawnFloatingDmg(`護盾抵扣 -${absorbed}`, 220, 25, "dmg-parry");
      }

      updateCombatBannerAndLog(`大招爆發！施展【${skillDesc}】重創對手 ${baseDmg} 點！`, `少俠全力催動【${skillDesc}】，重創【${currentEnemy.name}】 ${baseDmg} 點氣血！`, "var(--gold)");

      enemyHp = Math.max(0, enemyHp - baseDmg);
      updateCombatBars();

      if (enemyHp <= 0) {
        handleCombatVictory();
        return;
      }
    } catch (e) {
      console.error(e);
    } finally {
      finishSkillTurn();
    }
  }, strikeDelay);

  function finishSkillTurn() {
    setTimeout(() => {
      if (typeof onFinishCallback === 'function') {
        onFinishCallback();
      } else {
        unlockAction();
      }
    }, finishDelay);
  }
}

// ==================== 10. 戰後結算與勝負判定 ====================
function checkPlayerDefeat() {
  if (player.talents && player.talents.some(t => t.reviveOnce) && !player._hasRevivedInCombat) {
    player._hasRevivedInCombat = true;
    player.hp = Math.round(player.maxHp * 0.5);
    alert("🔥【天命顯聖・不死鳥之息】氣血歸元，免除致命死亡，當場浴火重生並回滿 50% 氣血！");
    updateCombatBars();
    unlockAction();
    return;
  }

  if (currentCombatType === 'tower_boss') {
    const prevFloor = Math.max(1, currentTowerBossFloor - 1);
    player.towerFloor = prevFloor;

    if (typeof appendCombatChat === 'function') {
      appendCombatChat("【通天惜敗】", `通天塔第 ${currentTowerBossFloor} 層首領武功絕頂，少俠不支敗下陣來，退回至第 ${prevFloor} 層修整！`, "#e74c3c");
    }
    alert(`惜敗！第 ${currentTowerBossFloor} 層首領實力深不可測，已自動退回第 ${prevFloor} 層！`);
    player.hp = Math.round(player.maxHp * 0.3);
    stopBattleAndExit();
    if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
    if (typeof returnToTowerAfterBoss === 'function') returnToTowerAfterBoss(false);
    return;
  }

  alert("傷重不支，少俠只得暫行退避調養...");
  player.hp = Math.round(player.maxHp * 0.3);
  stopBattleAndExit();
  if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
}

function handleCombatVictory() {
  if (autoBattleTimer) clearInterval(autoBattleTimer);
  autoBattleTimer = null;
  unlockAction();

  let earnLearn = Math.round(5 + Math.random() * 16);
  let earnExp = Math.round(currentEnemy.exp || 40);
  let earnGold = Math.round(currentEnemy.gold || 10);

  if (player.talents && player.talents.some(t => t.id === "t_011")) earnGold *= 2;

  player.exp += earnExp;
  player.gold += earnGold;
  player.combat += (currentEnemy.combat || 6);
  player.learn += earnLearn;

  if (currentCombatType === 'tower_boss') {
    const floor = currentTowerBossFloor || player.towerFloor;
    if (floor >= player.towerFloor) player.towerFloor = floor + 1;
    if (typeof autoDropBossLootToBag === 'function') autoDropBossLootToBag(floor);
    if (typeof recalcPlayerStats === 'function') recalcPlayerStats();

    if (typeof appendCombatChat === 'function') {
      appendCombatChat("【首領大捷】", `少俠威震通天塔！成功斬殺第 ${floor} 層首領！解鎖通天塔第 ${player.towerFloor} 層！`, "var(--gold)");
    }

    setTimeout(() => {
      stopBattleAndExit();
      if (typeof returnToTowerAfterBoss === 'function') returnToTowerAfterBoss(true);
    }, 350);
    return;
  }

  if (currentCombatType === 'sect_master') {
    player.sectRank = "出師大成";
    if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
    setTimeout(() => {
      alert(`🏆 掌門長嘆：「青出於藍而勝於藍！少俠武功冠絕宗門，今日准你【出師大成】！」\n獲得修為 +${earnExp}、學點 +${earnLearn}！`);
      stopBattleAndExit();
    }, 300);
    return;
  }

  if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
  setTimeout(() => {
    alert(`🎉 切磋勝出！擊敗【${currentEnemy.name}】！\n獲得修為 +${earnExp}、銀兩 +${earnGold}兩、實戰心得 +${currentEnemy.combat || 6}、學點 +${earnLearn}！`);
    stopBattleAndExit();
  }, 300);
}

// 全域掛載
window.startBattleAgainst = startBattleAgainst;
window.stopBattleAndExit = stopBattleAndExit;
window.calcDerivedCombatRates = calcDerivedCombatRates;
window.updateSingleAtbMetersUI = updateSingleAtbMetersUI;
window.updateCombatBars = updateCombatBars;
window.handlePlayerAction = handlePlayerAction;
window.openAttackSubMenu = openAttackSubMenu;
window.closeAttackSubMenu = closeAttackSubMenu;
window.executePlayerCastSkill = executePlayerCastSkill;
window.executePlayerCastNormal = executePlayerCastNormal;
window.getAccurateSkillCostMp = getAccurateSkillCostMp;
window.getInternalTurnMpRegen = getInternalTurnMpRegen;
window.triggerIfRules = triggerIfRules;