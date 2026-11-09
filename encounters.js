/**
 * ========================================================
 * 你的江湖 - 奇遇事件引擎 (encounters.js)
 * 讀取 data_encounters.js（GLOBAL_ENCOUNTERS），於各觸發點判定並以地圖位置頁面（pg-encounter）演出劇情。
 * 觸發點（由各模組呼叫 Encounters.trigger(type, ctx)）：
 *   enter 抵達地點(town.js travelToTown) / talk 與人物交談(town.js talkToNpc) / scene 進入場景(town.js openSceneModal)
 *   meditate 打坐(main.js) / battle_win・battle_lose 戰鬥結束(combat.js) / craft 製作成功(crafting.js)
 *   rest 醫館療傷(town.js restAtInn) / gather 採集成功(gathering.js)
 * 玩家資料：player.encounterLog { id: 次數 }、player.encounterLast { id: 時間戳 }、player.encounterFlags { key: true }
 * ========================================================
 */

const ENCOUNTER_TRIGGERS = [
  { key: "enter", label: "抵達地點（移動時）", ctx: ["locs"] },
  { key: "talk", label: "與人物交談", ctx: ["npc", "locs"] },
  { key: "scene", label: "進入場景", ctx: ["scene", "locs"] },
  { key: "meditate", label: "打坐修練", ctx: ["locs"] },
  { key: "battle_win", label: "戰鬥勝利", ctx: ["npc", "locs"] },
  { key: "battle_lose", label: "戰鬥落敗", ctx: ["npc", "locs"] },
  { key: "craft", label: "製作成功", ctx: ["skill", "locs"] },
  { key: "rest", label: "醫館療傷", ctx: ["locs"] },
  { key: "gather", label: "採集 / 挖礦 / 砍伐成功", ctx: ["skill", "locs"] },
  { key: "companion_talk", label: "與俠客交談", ctx: ["companion"] },
  { key: "buy", label: "在商店購買物品", ctx: ["item", "locs"] },
  { key: "use_item", label: "服用丹藥", ctx: ["item"] },
  { key: "pawn", label: "典當物品", ctx: ["item", "locs"] },
  { key: "learn_skill", label: "習得武學（武館 / 門派 / 秘笈）", ctx: ["kungfu"] },
  { key: "kungfu_tier", label: "武學突破（重數提升）", ctx: ["kungfu", "tier"] },
  { key: "realm_up", label: "境界提升", ctx: ["realm"] },
  { key: "sect_join", label: "拜入門派", ctx: ["sect"] },
  { key: "sect_promote", label: "門階晉升", ctx: ["sect"] },
  { key: "flee", label: "走為上策脫身成功", ctx: ["locs"] },
  { key: "tower_boss_win", label: "擊敗通天塔首領（離開塔後演出）", ctx: ["floor"] },
  { key: "daily_login", label: "每日首次上線", ctx: [] },
  { key: "companion_recruit", label: "結識俠客", ctx: ["companion"] },
  { key: "companion_gift", label: "送禮給俠客", ctx: ["companion", "item"] },
  { key: "companion_errand_back", label: "俠客派遣歸來", ctx: ["companion"] },
  { key: "companion_levelup", label: "俠客升級", ctx: ["companion"] },
  { key: "companion_learn", label: "俠客學會武學", ctx: ["companion", "kungfu"] },
  { key: "companion_sworn", label: "與俠客結義", ctx: ["companion"] }
];
const ENCOUNTER_CONDITIONS = [
  { key: "gold_gte", label: "銀兩 ≥", fields: ["value"] },
  { key: "exp_gte", label: "修為 ≥", fields: ["value"] },
  { key: "learn_gte", label: "學點 ≥", fields: ["value"] },
  { key: "stat_gte", label: "屬性 ≥", fields: ["key", "value"] },
  { key: "stat_lt", label: "屬性 <", fields: ["key", "value"] },
  { key: "has_item", label: "持有物品", fields: ["ref", "count"] },
  { key: "knows_skill", label: "已習得武學", fields: ["ref"] },
  { key: "sect_is", label: "所屬門派為", fields: ["value"] },
  { key: "flag_set", label: "已有旗標", fields: ["key"] },
  { key: "flag_unset", label: "沒有旗標", fields: ["key"] },
  { key: "craft_gte", label: "生活技能等級 ≥（製作 / 採集）", fields: ["key", "value"] },
  { key: "tower_gte", label: "通天塔層數 ≥", fields: ["value"] },
  { key: "reinc_gte", label: "轉世次數 ≥", fields: ["value"] },
  { key: "done", label: "已完成其他奇遇", fields: ["ref"] },
  { key: "has_companion", label: "已結識俠客", fields: ["ref"] },
  { key: "no_companion", label: "尚未結識俠客", fields: ["ref"] },
  { key: "companion_party", label: "俠客正在隨行", fields: ["ref"] },
  { key: "companion_affinity_gte", label: "俠客好感 ≥", fields: ["ref", "value"] },
  { key: "companion_sworn", label: "已與俠客結義", fields: ["ref"] },
  { key: "not_today", label: "本日未觸發此奇遇", fields: [] },
  { key: "random_pct", label: "額外機率 %", fields: ["value"] },
  { key: "gold_lt", label: "銀兩 <", fields: ["value"] },
  { key: "hp_pct_lt", label: "氣血 % <", fields: ["value"] },
  { key: "hp_pct_gte", label: "氣血 % ≥", fields: ["value"] },
  { key: "combat_gte", label: "實戰心得 ≥", fields: ["value"] },
  { key: "realm_gte", label: "境界 ≥", fields: ["value"] },
  { key: "sect_rank_gte", label: "門階 ≥", fields: ["value"] },
  { key: "kungfu_tier_gte", label: "某武學重數 ≥", fields: ["ref", "value"] },
  { key: "weapon_type", label: "手持兵刃類別為", fields: ["value"] },
  { key: "loc_is", label: "目前位於地點", fields: ["value"] },
  { key: "area_is", label: "目前位於小地圖 / 門派", fields: ["value"] },
  { key: "time_between", label: "現實時間介於（時，可跨午夜）", fields: ["from", "to"] },
  { key: "weekday_is", label: "今天是星期", fields: ["value"] },
  { key: "encounter_times_gte", label: "某奇遇觸發次數 ≥", fields: ["ref", "value"] },
  { key: "talent_has", label: "擁有天賦（名稱）", fields: ["value"] },
  { key: "companion_count_gte", label: "俠客人數 ≥", fields: ["value"] },
  { key: "companion_level_gte", label: "俠客等級 ≥", fields: ["ref", "value"] },
  { key: "companion_knows", label: "俠客已會某武學", fields: ["ref", "skill"] }
];
// 境界順序（與 main.js evaluatePlayerRealm 一致）
const ENCOUNTER_REALMS = ["凡夫俗子", "初窺門徑", "略有小成", "駕輕就熟", "融會貫通", "爐火純青", "出神入化", "登峰造極", "返璞歸真", "震爍古今", "天人合一"];
const ENCOUNTER_RESULTS = [
  { key: "message", label: "顯示訊息", fields: ["text"] },
  { key: "gold", label: "銀兩 ±", fields: ["value"] },
  { key: "exp", label: "修為 ±", fields: ["value"] },
  { key: "learn", label: "學點 ±", fields: ["value"] },
  { key: "hp", label: "氣血 ±（不會致死）", fields: ["value"] },
  { key: "mp", label: "內力 ±", fields: ["value"] },
  { key: "heal", label: "氣血內力回滿", fields: [] },
  { key: "stat", label: "永久屬性 ±（奇遇加成）", fields: ["key", "value"] },
  { key: "maxhp", label: "永久氣血上限 ±", fields: ["value"] },
  { key: "item", label: "獲得物品", fields: ["ref", "count"] },
  { key: "remove_item", label: "失去物品", fields: ["ref", "count"] },
  { key: "book", label: "獲得武學秘笈", fields: ["ref"] },
  { key: "skill", label: "直接習得武學", fields: ["ref"] },
  { key: "craft_exp", label: "製作熟練度 +", fields: ["key", "value"] },
  { key: "flag", label: "設定旗標", fields: ["key"] },
  { key: "unflag", label: "清除旗標", fields: ["key"] },
  { key: "teleport", label: "傳送到地點", fields: ["value"] },
  { key: "battle", label: "進入戰鬥（勝負分支）", fields: ["enemy", "winNext", "loseNext"] },
  { key: "companion", label: "🤝 招募俠客", fields: ["ref"] },
  { key: "companion_affinity", label: "俠客好感 ±", fields: ["ref", "value"] },
  { key: "companion_skill", label: "俠客學會武學", fields: ["ref", "skill"] },
  { key: "companion_gear", label: "俠客獲得裝備", fields: ["ref", "item"] },
  { key: "companion_exp", label: "俠客經驗 +", fields: ["ref", "value"] },
  { key: "companion_say", label: "俠客說一句話", fields: ["ref", "text"] },
  { key: "companion_party", label: "俠客改為隨行出戰", fields: ["ref"] },
  { key: "companion_leave", label: "俠客離隊（告別）", fields: ["ref"] }
];
const ENCOUNTER_STAT_LABELS = { arm: "臂力", speed: "身法", bone: "根骨", inner: "內功", int: "悟性", luck: "福緣" };

const Encounters = (() => {
  let cur = null;          // { enc, stepId, log: [] }
  let pendingBattle = null; // { enc, winNext, loseNext, log }
  const list = () => (typeof GLOBAL_ENCOUNTERS !== 'undefined' && Array.isArray(GLOBAL_ENCOUNTERS)) ? GLOBAL_ENCOUNTERS : [];
  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const fill = s => String(s ?? "").replace(/\{name\}/g, player.name || "少俠").replace(/\{loc\}/g, player.curLoc || "");

  function ensureData() {
    if (!player.encounterLog || typeof player.encounterLog !== 'object') player.encounterLog = {};
    if (!player.encounterLast || typeof player.encounterLast !== 'object') player.encounterLast = {};
    if (!player.encounterFlags || typeof player.encounterFlags !== 'object') player.encounterFlags = {};
  }

  function itemCount(ref) {
    if (window.Crafting) return Crafting.countInBag(ref);
    return player.inventory.filter(i => i.templateId === ref || i.id === ref || i.name === ref).reduce((n, i) => n + (Number(i.count) || 1), 0);
  }

  const dayStart = () => (window.ShopStock ? ShopStock.cycleStart() : new Date().setHours(0, 0, 0, 0));
  function checkCond(c, enc) {
    if (!c || !c.type) return true;
    const v = Number(c.value) || 0;
    const st = player.stats || {};
    switch (c.type) {
      case "gold_gte": return player.gold >= v;
      case "exp_gte": return player.exp >= v;
      case "learn_gte": return player.learn >= v;
      case "stat_gte": return (Number(st[c.key]) || 0) >= v;
      case "stat_lt": return (Number(st[c.key]) || 0) < v;
      case "has_item": return itemCount(c.ref) >= Math.max(1, Number(c.count) || 1);
      case "knows_skill": return (typeof myLearnedKungfu !== 'undefined') && myLearnedKungfu.some(k => k.name === c.ref || k.templateId === c.ref || k.id === c.ref);
      case "sect_is": return (player.sect || "無門無派") === (c.value || "無門無派");
      case "flag_set": return !!player.encounterFlags[c.key];
      case "flag_unset": return !player.encounterFlags[c.key];
      case "craft_gte": return window.Crafting ? Crafting.skillState(c.key).lv >= v : false;
      case "tower_gte": return (Number(player.towerFloor) || 1) >= v;
      case "reinc_gte": return (Number(player.reincarnations) || 0) >= v;
      case "done": return (player.encounterLog[c.ref] || 0) > 0;
      case "has_companion": return !!(window.Companions && Companions.has(c.ref));
      case "no_companion": return !(window.Companions && Companions.has(c.ref));
      case "companion_party": return !!(window.Companions && Companions.inParty(c.ref));
      case "companion_affinity_gte": return !!(window.Companions && Companions.has(c.ref) && Companions.affinityOf(c.ref) >= v);
      case "companion_sworn": return !!(window.Companions && Companions.isSworn(c.ref));
      case "not_today": return !enc || (player.encounterLast[enc.id] || 0) < dayStart();
      case "random_pct": return Math.random() * 100 < v;
      case "gold_lt": return player.gold < v;
      case "hp_pct_lt": return player.hp / Math.max(1, player.maxHp) * 100 < v;
      case "hp_pct_gte": return player.hp / Math.max(1, player.maxHp) * 100 >= v;
      case "combat_gte": return (Number(player.combat) || 0) >= v;
      case "realm_gte": return typeof evaluatePlayerRealm === 'function' && ENCOUNTER_REALMS.indexOf(evaluatePlayerRealm()) >= ENCOUNTER_REALMS.indexOf(c.value);
      case "sect_rank_gte": { const ranks = (typeof SECT_RANKS !== 'undefined') ? SECT_RANKS : []; return player.sect !== "無門無派" && ranks.indexOf(player.sectRank) >= Math.max(0, ranks.indexOf(c.value)); }
      case "kungfu_tier_gte": { const k = (typeof myLearnedKungfu !== 'undefined') ? myLearnedKungfu.find(x => x.name === c.ref || x.id === c.ref) : null; return !!k && (Number(k.tier) || 1) >= v; }
      case "weapon_type": return (typeof getWeaponType === 'function' ? getWeaponType(player.equippedGear && player.equippedGear.weapon) : '拳') === c.value;
      case "loc_is": return player.curLoc === c.value;
      case "area_is": { const l = (typeof WORLD_MAP !== 'undefined') ? WORLD_MAP[player.curLoc] : null; return !!l && l.area === c.value; }
      case "time_between": { const h = new Date().getHours(), f = Number(c.from) || 0, t = Number(c.to) || 0; return f <= t ? (h >= f && h < t) : (h >= f || h < t); }
      case "weekday_is": return new Date().getDay() === v;
      case "encounter_times_gte": return (player.encounterLog[c.ref] || 0) >= v;
      case "talent_has": return (player.talents || []).some(t => t.name === c.value || t.id === c.value);
      case "companion_count_gte": return !!window.Companions && Companions.count() >= v;
      case "companion_level_gte": return !!window.Companions && Companions.levelOf(c.ref) >= v;
      case "companion_knows": return !!window.Companions && Companions.knows(c.ref, c.skill);
      default: return true;
    }
  }
  const allMet = (conds, enc) => (Array.isArray(conds) ? conds : []).every(c => checkCond(c, enc));

  function matches(enc, type, ctx) {
    const t = enc.trigger || {};
    if (enc.enabled === false || t.type !== type) return false;
    if (Array.isArray(t.locs) && t.locs.length > 0 && !t.locs.includes(player.curLoc)) return false;
    if ((type === 'talk' || type === 'battle_win' || type === 'battle_lose') && t.npc && t.npc !== ctx.npc) return false;
    if (type === 'scene' && t.scene && t.scene !== ctx.scene && t.scene !== ctx.sceneType) return false;
    if ((type === 'craft' || type === 'gather') && t.skill && t.skill !== ctx.skill) return false;
    // 通用情境：設定了就必須相符
    for (const k of ["item", "kungfu", "sect", "companion", "realm"]) if (t[k] && ctx[k] !== undefined && t[k] !== ctx[k]) return false;
    if (Number(t.tier) > 0 && Number(ctx.tier) < Number(t.tier)) return false;
    if (Number(t.floor) > 0 && ctx.floor !== undefined && Number(ctx.floor) < Number(t.floor)) return false;
    if (enc.once && (player.encounterLog[enc.id] || 0) > 0) return false;
    if (Number(enc.cooldown) > 0 && Date.now() - (player.encounterLast[enc.id] || 0) < Number(enc.cooldown) * 60000) return false;
    return allMet(enc.conditions, enc);
  }
  // 直接指定奇遇（人物「交談觸發奇遇」開關使用）：不看觸發方式，但仍檢查啟用、次數、冷卻與條件
  function tryStart(id, chance = 100, ctx = {}) {
    if (typeof player === 'undefined') return false;
    if (cur && typeof currentPlacePage !== 'undefined' && currentPlacePage !== 'pg-encounter') cur = null;
    if (cur || (typeof isInBattle === 'function' && isInBattle())) return false;
    ensureData();
    const enc = list().find(e => e.id === id);
    if (!enc || enc.enabled === false) return false;
    if (enc.once && (player.encounterLog[enc.id] || 0) > 0) return false;
    if (Number(enc.cooldown) > 0 && Date.now() - (player.encounterLast[enc.id] || 0) < Number(enc.cooldown) * 60000) return false;
    if (!allMet(enc.conditions, enc)) return false;
    if (Math.random() * 100 >= Number(chance)) return false;
    start(enc);
    return true;
  }
  // 不適合當下演出的時機（例如通天塔中）先排隊，回到地圖時再判定
  let queued = [];
  function queue(type, ctx) { queued.push([type, ctx || {}]); }
  function flush() { const q = queued; queued = []; for (const [type, ctx] of q) if (trigger(type, ctx)) break; }

  // 回傳 true 表示已觸發奇遇（呼叫端可略過原本的行為）
  function trigger(type, ctx = {}) {
    if (typeof player === 'undefined') return false;
    // 玩家用其他方式離開了奇遇頁面時，視為奇遇已結束
    if (cur && typeof currentPlacePage !== 'undefined' && currentPlacePage !== 'pg-encounter') cur = null;
    if (cur) return false;
    if (typeof isInBattle === 'function' && isInBattle()) return false;
    ensureData();
    const pool = list().filter(e => matches(e, type, ctx));
    for (const enc of pool.sort(() => Math.random() - 0.5)) {
      const chance = enc.trigger && enc.trigger.chance !== undefined ? Number(enc.trigger.chance) : 100;
      if (Math.random() * 100 < chance) { start(enc); return true; }
    }
    return false;
  }

  function start(enc, force, replay) {
    ensureData();
    if (!enc || !Array.isArray(enc.steps) || enc.steps.length === 0) return;
    if (!replay) {
      player.encounterLog[enc.id] = (player.encounterLog[enc.id] || 0) + 1;
      player.encounterLast[enc.id] = Date.now();
    }
    cur = { enc, stepId: enc.start || enc.steps[0].id, log: [], replay: !!replay };
    if (typeof pushChatMessage === 'function') pushChatMessage('system', '【奇遇】', `觸發奇遇「${enc.name}」！`, '#f1c40f');
    if (typeof openModal === 'function') openModal('modal-encounter');
    enterStep(cur.stepId);
  }

  function stepOf(id) { return cur && cur.enc.steps.find(s => s.id === id); }

  function enterStep(id) {
    const step = stepOf(id);
    if (!step) { finish(); return; }
    cur.stepId = id;
    cur.log = [];
    const stop = applyResults(step.results);
    if (stop) return;
    render();
  }

  // 套用結果；遇到戰鬥時回傳 true（劇情暫停，待戰後續演）
  function applyResults(results) {
    const replayNoReward = cur && cur.replay && !settings().replayRewards;
    for (const r of (Array.isArray(results) ? results : [])) {
      if (!r || !r.type) continue;
      // 重溫主線：只演出劇情，不再給獎勵；戰鬥直接當作勝利
      if (replayNoReward && r.type !== 'message' && r.type !== 'companion_say') {
        if (r.type === 'battle') { const w = r.winNext; cur.log.push(`（重溫：略過與【${(r.enemy || {}).name || '對手'}】的戰鬥）`); if (w && stepOf(w)) { setTimeout(() => enterStep(w), 0); return true; } }
        continue;
      }
      const v = Number(r.value) || 0;
      const sign = n => (n >= 0 ? `+${n}` : `${n}`);
      switch (r.type) {
        case "message": cur.log.push(fill(r.text)); break;
        case "gold": player.gold = Math.max(0, player.gold + v); cur.log.push(`銀兩 ${sign(v)}`); break;
        case "exp": player.exp = Math.max(0, player.exp + v); cur.log.push(`修為 ${sign(v)}`); break;
        case "learn": player.learn = Math.max(0, player.learn + v); cur.log.push(`學點 ${sign(v)}`); break;
        case "hp": player.hp = Math.max(1, Math.min(player.maxHp, player.hp + v)); cur.log.push(`氣血 ${sign(v)}`); break;
        case "mp": player.mp = Math.max(0, Math.min(player.maxMp, player.mp + v)); cur.log.push(`內力 ${sign(v)}`); break;
        case "heal": player.hp = player.maxHp; player.mp = player.maxMp; cur.log.push("氣血與內力完全恢復"); break;
        case "stat":
          if (ENCOUNTER_STAT_LABELS[r.key]) {
            player.statsEncounter[r.key] = (Number(player.statsEncounter[r.key]) || 0) + v;
            cur.log.push(`${ENCOUNTER_STAT_LABELS[r.key]} 永久 ${sign(v)}`);
          }
          break;
        case "maxhp": player.baseMaxHp = Math.max(1, player.baseMaxHp + v); cur.log.push(`氣血上限 永久 ${sign(v)}`); break;
        case "item": case "book": {
          const name = typeof grantLootToBag === 'function' ? grantLootToBag(r.type === 'book' ? 'book' : 'item', r.ref, r.count) : null;
          if (name) cur.log.push(`獲得【${name}】${Number(r.count) > 1 ? ` ×${r.count}` : ''}`);
          break;
        }
        case "remove_item": {
          const n = window.Crafting ? Crafting.removeFromBag(r.ref, Math.max(1, Number(r.count) || 1)) : 0;
          const it = typeof findItemByRef === 'function' ? findItemByRef(r.ref) : null;
          if (n) cur.log.push(`失去【${it ? it.name : r.ref}】×${n}`);
          break;
        }
        case "skill": {
          const tpl = typeof findSkillByRef === 'function' ? findSkillByRef(r.ref) : null;
          if (tpl && typeof myLearnedKungfu !== 'undefined' && !myLearnedKungfu.some(k => k.name === tpl.name)) {
            myLearnedKungfu.push(typeof createLearnedKungfu === 'function' ? createLearnedKungfu(tpl) : { ...tpl, tier: 1, progress: 0 });
            cur.log.push(`習得武學【${tpl.name}】`);
          }
          break;
        }
        case "companion": {
          const cd = window.Companions && Companions.def(r.ref);
          if (cd && Companions.recruit(r.ref, true)) cur.log.push(`🤝【${cd.title ? cd.title + '・' : ''}${cd.name}】願與你同行！`);
          else if (cd) cur.log.push(`${cd.name}已經與你同行了。`);
          break;
        }
        case "companion_affinity": {
          const cd = window.Companions && Companions.def(r.ref);
          if (cd && Companions.has(r.ref)) { const g = Companions.addAffinity(r.ref, v); cur.log.push(`與${cd.name}的好感 ${g >= 0 ? '+' : ''}${g}`); }
          break;
        }
        case "companion_skill": {
          const cd = window.Companions && Companions.def(r.ref);
          const sk = typeof findSkillByRef === 'function' ? findSkillByRef(r.skill) : null;
          if (cd && sk && Companions.has(r.ref) && Companions.learnSkill(r.ref, r.skill, true)) cur.log.push(`${cd.name}學會了【${sk.name}】`);
          break;
        }
        case "companion_gear": {
          const cd = window.Companions && Companions.def(r.ref);
          const nm = cd && Companions.has(r.ref) ? Companions.giveGearFromTemplate(r.ref, r.item) : null;
          if (nm) cur.log.push(`${cd.name}換上了【${nm}】`);
          break;
        }
        case "companion_exp": { const cd = window.Companions && Companions.def(r.ref); if (cd && Companions.has(r.ref)) { Companions.addExp(r.ref, v); cur.log.push(`${cd.name}經驗 +${v}`); } break; }
        case "companion_say": { const cd = window.Companions && Companions.def(r.ref); if (cd) { Companions.say(r.ref, fill(r.text)); cur.log.push(`${cd.name}：「${fill(r.text)}」`); } break; }
        case "companion_party": { const cd = window.Companions && Companions.def(r.ref); if (cd && Companions.has(r.ref) && Companions.setParty(r.ref)) cur.log.push(`${cd.name}與你並肩同行`); break; }
        case "companion_leave": { const cd = window.Companions && Companions.def(r.ref); if (cd && Companions.leave(r.ref)) cur.log.push(`${cd.name}離開了隊伍`); break; }
        case "craft_exp": if (window.Crafting) { Crafting.gainExp(r.key, v); cur.log.push(`製作熟練度 +${v}`); } break;
        case "flag": player.encounterFlags[r.key] = true; break;
        case "unflag": delete player.encounterFlags[r.key]; break;
        case "teleport":
          if (typeof WORLD_MAP !== 'undefined' && WORLD_MAP[r.value]) {
            player.lastTown = player.curLoc;
            player.curLoc = r.value;
            cur.log.push(`來到了【${r.value}】`);
            if (typeof renderJianghuScenesOnMenu === 'function') renderJianghuScenesOnMenu();
          }
          break;
        case "battle": {
          const data = r.enemy || {};
          if (typeof startBattleAgainst !== 'function' || typeof buildEnemyFromData !== 'function') break;
          pendingBattle = { enc: cur.enc, winNext: r.winNext || "", loseNext: r.loseNext || "", log: cur.log.slice() };
          const enemy = buildEnemyFromData({ name: "神秘人", realm: "江湖人", maxHp: 300, atk: 30, def: 10, speed: 40, exp: 40, gold: 10, ...data });
          if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
          cur = null;
          if (typeof closePlacePanel === 'function') closePlacePanel();
          startBattleAgainst(enemy, false);
          return true;
        }
      }
    }
    if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
    return false;
  }

  function render() {
    const step = stepOf(cur.stepId);
    const box = document.getElementById('encounter-content');
    const title = document.getElementById('encounter-title');
    if (!box || !step) return;
    if (title) title.innerText = `✨ 奇遇・${cur.enc.name}`;
    const choices = (Array.isArray(step.choices) ? step.choices : []).filter(c => allMet(c.conditions, cur.enc));
    let html = `<div class="enc-story">${step.speaker ? `<div class="enc-speaker">${esc(fill(step.speaker))}</div>` : ''}<p>${esc(fill(step.text)).replace(/\n/g, '<br>')}</p></div>`;
    if (cur.log.length) html += `<div class="enc-results">${cur.log.map(l => `<div>✦ ${esc(l)}</div>`).join('')}</div>`;
    html += `<div class="enc-choices">`;
    if (choices.length) {
      choices.forEach((c, i) => {
        const chk = c.check && c.check.stat ? `<small>（${ENCOUNTER_STAT_LABELS[c.check.stat] || c.check.stat}判定）</small>` : (c.check && Number(c.check.rate) > 0 ? `<small>（${c.check.rate}% 機率）</small>` : '');
        html += `<button class="wuxia-btn" onclick="Encounters.choose(${i})">${esc(fill(c.text))} ${chk}</button>`;
      });
    } else if (step.next && stepOf(step.next)) {
      html += `<button class="wuxia-btn" onclick="Encounters.go('${esc(step.next)}')">繼續 ▸</button>`;
    } else {
      html += `<button class="wuxia-btn" style="color:var(--gold); border-color:var(--gold);" onclick="Encounters.finish()">結束奇遇</button>`;
    }
    html += `</div>`;
    box.innerHTML = html;
    if (typeof updateProfileUI === 'function') updateProfileUI();
  }

  function choose(i) {
    if (!cur) return;
    const step = stepOf(cur.stepId);
    const c = (step.choices || []).filter(x => allMet(x.conditions, cur.enc))[i];
    if (!c) return;
    let pass = true;
    if (c.check && c.check.stat) pass = (Number((player.stats || {})[c.check.stat]) || 0) >= (Number(c.check.value) || 0);
    if (pass && c.check && Number(c.check.rate) > 0) pass = Math.random() * 100 < Number(c.check.rate);
    const next = pass ? c.next : (c.failNext || "");
    cur.log = [];
    if (pass && applyResults(c.results)) return;
    if (next && stepOf(next)) {
      const carried = cur.log.slice();
      enterStep(next);
      if (cur && carried.length) { cur.log = carried.concat(cur.log); render(); }
    } else {
      render();
      const box = document.querySelector('#encounter-content .enc-choices');
      if (box) box.innerHTML = `<button class="wuxia-btn" style="color:var(--gold); border-color:var(--gold);" onclick="Encounters.finish()">結束奇遇</button>`;
    }
  }

  function go(id) { if (cur) enterStep(id); }

  function finish() {
    cur = null;
    if (typeof closePlacePanel === 'function') closePlacePanel('pg-encounter');
    if (typeof renderJianghuScenesOnMenu === 'function') renderJianghuScenesOnMenu();
    if (typeof updateProfileUI === 'function') updateProfileUI();
  }

  // combat.js stopBattleAndExit 呼叫
  function afterBattle(outcome, enemy, combatType) {
    ensureData();
    if (pendingBattle) {
      const pb = pendingBattle;
      pendingBattle = null;
      const next = outcome === 'win' ? pb.winNext : (outcome === 'lose' ? pb.loseNext : "");
      cur = { enc: pb.enc, stepId: next, log: [] };
      setTimeout(() => {
        if (typeof openModal === 'function') openModal('modal-encounter');
        if (next && stepOf(next)) enterStep(next);
        else {
          cur.log = [outcome === 'win' ? '你戰勝了對手。' : (outcome === 'lose' ? '你落敗了……' : '你脫身離去。')];
          cur.stepId = '__end';
          const box = document.getElementById('encounter-content');
          if (box) box.innerHTML = `<div class="enc-results">${cur.log.map(l => `<div>✦ ${esc(l)}</div>`).join('')}</div><div class="enc-choices"><button class="wuxia-btn" onclick="Encounters.finish()">結束奇遇</button></div>`;
        }
      }, 300);
      return true;
    }
    const npcId = enemy && enemy.id;
    if (combatType === 'tower_boss') return false; // 通天塔戰鬥不觸發，以免打斷爬塔流程
    if (outcome === 'win' || outcome === 'lose') {
      setTimeout(() => trigger(outcome === 'win' ? 'battle_win' : 'battle_lose', { npc: npcId }), 700);
    }
    return false;
  }

  // ==================== 奇遇頁面：主線進度與重溫 ====================
  function settings() {
    return Object.assign({ mainlineTitle: "江湖主線", replayCooldownMin: 30, replayRewards: false, showLockedTitles: false, showSideLog: true },
      (typeof ENCOUNTER_SETTINGS !== 'undefined' && ENCOUNTER_SETTINGS) || {});
  }
  const mainline = () => list().filter(e => e.mainline && e.enabled !== false).sort((a, b) => (Number(a.mainOrder) || 0) - (Number(b.mainOrder) || 0));
  function replayLeft(id) {
    const last = (player.encounterReplay || {})[id] || 0;
    return Math.max(0, last + (Number(settings().replayCooldownMin) || 0) * 60000 - Date.now());
  }
  function openLog() {
    ensureData();
    if (!player.encounterReplay) player.encounterReplay = {};
    const box = document.getElementById('enclog-content');
    const set = settings();
    const main = mainline();
    const doneN = main.filter(e => (player.encounterLog[e.id] || 0) > 0).length;
    const curIdx = main.findIndex(e => !(player.encounterLog[e.id] > 0));
    let html = `<div class="enclog-progress"><b>${esc(set.mainlineTitle)}</b><span>${doneN} / ${main.length}</span><div class="comp-aff"><span style="width:${main.length ? doneN / main.length * 100 : 0}%"></span></div></div>`;
    if (!main.length) html += `<div class="comp-empty" style="padding:20px;">主線尚未開放，敬請期待。</div>`;
    main.forEach((e, i) => {
      const done = (player.encounterLog[e.id] || 0) > 0;
      const isCur = i === curIdx;
      const locked = !done && !isCur;
      const title = locked && !set.showLockedTitles ? '？？？' : esc(e.name);
      const left = done ? replayLeft(e.id) : 0;
      html += `<div class="enclog-card ${done ? 'done' : isCur ? 'cur' : 'locked'}">
        <div class="enclog-head"><span>${done ? '✅' : isCur ? '▶' : '🔒'} ${e.chapter ? `<small>${esc(e.chapter)}</small>` : ''}${title}</span>
          ${done ? (left > 0 ? `<button class="wuxia-btn" disabled style="color:#666; border-color:#3a4250;">${Math.ceil(left / 60000)} 分後可重溫</button>` : `<button class="wuxia-btn" onclick="Encounters.replay('${esc(e.id)}')">📖 重溫</button>`) : ''}</div>
        ${isCur ? `<div class="enclog-hint">${esc(e.mainHint || '繼續行走江湖，機緣自會到來……')}</div>` : ''}
      </div>`;
    });
    if (set.showSideLog) {
      const side = list().filter(e => !e.mainline && (player.encounterLog[e.id] || 0) > 0);
      html += `<div class="comp-sub-title" style="margin-top:12px;">📜 江湖見聞（已遇過的支線奇遇 ${side.length}）</div>`;
      html += side.length ? `<div class="enclog-side">${side.map(e => `<span>${esc(e.name)}${player.encounterLog[e.id] > 1 ? ` ×${player.encounterLog[e.id]}` : ''}</span>`).join('')}</div>` : `<div class="comp-empty">尚未遇過任何支線奇遇。</div>`;
    }
    if (box) box.innerHTML = html;
    if (typeof openModal === 'function') openModal('modal-encounter-log');
  }
  function replay(id) {
    const enc = list().find(e => e.id === id);
    if (!enc || !(player.encounterLog[id] > 0) || replayLeft(id) > 0) return;
    if (!player.encounterReplay) player.encounterReplay = {};
    player.encounterReplay[id] = Date.now();
    cur = null;
    start(enc, true, true);
    if (cur && !settings().replayRewards) cur.log.push('（重溫中：只演出劇情，不會再次獲得獎勵）');
    render();
  }

  // 編輯器預覽 / 除錯：直接演出指定奇遇（不檢查條件）
  function play(id) {
    const enc = list().find(e => e.id === id);
    if (enc) { cur = null; start(enc, true); }
  }

  return { trigger, tryStart, queue, flush, openLog, replay, choose, go, finish, afterBattle, play, ensureData, isActive: () => !!cur };
})();

window.Encounters = Encounters;
window.ENCOUNTER_TRIGGERS = ENCOUNTER_TRIGGERS;
window.ENCOUNTER_CONDITIONS = ENCOUNTER_CONDITIONS;
window.ENCOUNTER_RESULTS = ENCOUNTER_RESULTS;
window.ENCOUNTER_REALMS = ENCOUNTER_REALMS;

window.openEncounterLog = () => Encounters.openLog();
