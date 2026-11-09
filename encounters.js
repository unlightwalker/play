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
  { key: "gather", label: "採集 / 挖礦 / 砍伐成功", ctx: ["skill", "locs"] }
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
  { key: "done", label: "已完成其他奇遇", fields: ["ref"] }
];
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
  { key: "battle", label: "進入戰鬥（勝負分支）", fields: ["enemy", "winNext", "loseNext"] }
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

  function checkCond(c) {
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
      default: return true;
    }
  }
  const allMet = conds => (Array.isArray(conds) ? conds : []).every(checkCond);

  function matches(enc, type, ctx) {
    const t = enc.trigger || {};
    if (enc.enabled === false || t.type !== type) return false;
    if (Array.isArray(t.locs) && t.locs.length > 0 && !t.locs.includes(player.curLoc)) return false;
    if ((type === 'talk' || type === 'battle_win' || type === 'battle_lose') && t.npc && t.npc !== ctx.npc) return false;
    if (type === 'scene' && t.scene && t.scene !== ctx.scene && t.scene !== ctx.sceneType) return false;
    if ((type === 'craft' || type === 'gather') && t.skill && t.skill !== ctx.skill) return false;
    if (enc.once && (player.encounterLog[enc.id] || 0) > 0) return false;
    if (Number(enc.cooldown) > 0 && Date.now() - (player.encounterLast[enc.id] || 0) < Number(enc.cooldown) * 60000) return false;
    return allMet(enc.conditions);
  }

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

  function start(enc, force) {
    ensureData();
    if (!enc || !Array.isArray(enc.steps) || enc.steps.length === 0) return;
    player.encounterLog[enc.id] = (player.encounterLog[enc.id] || 0) + 1;
    player.encounterLast[enc.id] = Date.now();
    cur = { enc, stepId: enc.start || enc.steps[0].id, log: [] };
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
    for (const r of (Array.isArray(results) ? results : [])) {
      if (!r || !r.type) continue;
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
    const choices = (Array.isArray(step.choices) ? step.choices : []).filter(c => allMet(c.conditions));
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
    const c = (step.choices || []).filter(x => allMet(x.conditions))[i];
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

  // 編輯器預覽 / 除錯：直接演出指定奇遇（不檢查條件）
  function play(id) {
    const enc = list().find(e => e.id === id);
    if (enc) { cur = null; start(enc, true); }
  }

  return { trigger, choose, go, finish, afterBattle, play, ensureData, isActive: () => !!cur };
})();

window.Encounters = Encounters;
window.ENCOUNTER_TRIGGERS = ENCOUNTER_TRIGGERS;
window.ENCOUNTER_CONDITIONS = ENCOUNTER_CONDITIONS;
window.ENCOUNTER_RESULTS = ENCOUNTER_RESULTS;
