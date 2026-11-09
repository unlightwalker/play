/**
 * ========================================================
 * 你的江湖 - 製作系統 (crafting.js)
 * 讀取 data_crafting.js（CRAFT_SKILLS / CRAFT_CONFIG / CRAFT_RECIPES）
 * 製作工具是地圖上的 NPC（service: "craft"，craftSkill: 技能 key，toolLevel: 1~5），
 * 點擊工具後在地圖位置開啟製作頁（pg-craft）。
 * 玩家資料：player.craftSkills = { forge: { lv, exp }, alchemy: { lv, exp }, ... }
 * ========================================================
 */

const Crafting = (() => {
  let station = null; // { npcId, name, skill, toolLevel }

  const cfg = () => Object.assign({
    maxSkillLevel: 10, maxToolLevel: 5, toolNames: ["凡品", "良品", "上品", "絕品", "神品"],
    skillBonus: 5, toolBonus: 5, minRate: 5, maxRate: 100, failExpRatio: 0.3, failKeepRatio: 0.5, bonusOutputPerTool: 10
  }, (typeof CRAFT_CONFIG !== 'undefined' && CRAFT_CONFIG) || {});
  // 製作技能 + 採集類生活技能共用等級系統
  const skills = () => [
    ...((typeof CRAFT_SKILLS !== 'undefined' && Array.isArray(CRAFT_SKILLS)) ? CRAFT_SKILLS : []),
    ...((typeof GATHER_SKILLS !== 'undefined' && Array.isArray(GATHER_SKILLS)) ? GATHER_SKILLS : [])
  ];
  const recipes = () => (typeof CRAFT_RECIPES !== 'undefined' && Array.isArray(CRAFT_RECIPES)) ? CRAFT_RECIPES : [];
  const skillDef = key => skills().find(s => s.key === key) || { key, name: key, icon: "🛠️", titles: [], expToNext: [] };
  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function ensureData() {
    if (!player.craftSkills || typeof player.craftSkills !== 'object') player.craftSkills = {};
    skills().forEach(s => {
      const cur = player.craftSkills[s.key];
      if (!cur || typeof cur !== 'object') player.craftSkills[s.key] = { lv: 1, exp: 0 };
      else {
        cur.lv = Math.min(cfg().maxSkillLevel, Math.max(1, Number(cur.lv) || 1));
        cur.exp = Math.max(0, Number(cur.exp) || 0);
      }
    });
  }

  function skillState(key) {
    ensureData();
    return player.craftSkills[key] || (player.craftSkills[key] = { lv: 1, exp: 0 });
  }
  function expNeed(key, lv) {
    const t = skillDef(key).expToNext || [];
    return Number(t[lv - 1]) || (60 + (lv - 1) * 120);
  }
  function title(key, lv) {
    const t = skillDef(key).titles || [];
    return t[lv - 1] || `${lv} 級`;
  }
  // 工具等級在遊戲中以品階顯示（凡品 ~ 神品），顏色沿用物品品階色
  function toolGrade(lv) {
    const name = toolName(lv);
    return `<span class="color-${esc(name)}">${esc(name)}</span>`;
  }
  function toolName(lv) {
    const n = cfg().toolNames || [];
    return n[lv - 1] || `${lv} 級`;
  }

  function gainExp(key, amount) {
    const st = skillState(key);
    const max = cfg().maxSkillLevel;
    let ups = 0;
    st.exp += Math.max(0, Math.round(amount));
    while (st.lv < max && st.exp >= expNeed(key, st.lv)) {
      st.exp -= expNeed(key, st.lv);
      st.lv++;
      ups++;
    }
    if (st.lv >= max) st.exp = Math.min(st.exp, expNeed(key, max - 1));
    if (ups > 0) {
      const d = skillDef(key);
      if (typeof gameNotify === 'function') gameNotify(`${d.icon || '🛠️'}【${d.name}】提升至 ${st.lv} 級「${title(key, st.lv)}」！`, 'ok');
      if (typeof pushChatMessage === 'function') pushChatMessage('system', '【技藝精進】', `${d.name}提升至 ${st.lv} 級「${title(key, st.lv)}」。`, '#2ecc71');
    }
    return ups;
  }

  // 背包中某物品的持有數（材料/丹藥堆疊，裝備逐件計算）
  function countInBag(ref) {
    const tpl = typeof findItemByRef === 'function' ? findItemByRef(ref) : null;
    return player.inventory.reduce((n, it) => {
      const hit = it.templateId === ref || it.id === ref || (tpl && it.name === tpl.name && it.type === tpl.type);
      return hit ? n + (Number(it.count) || 1) : n;
    }, 0);
  }
  function removeFromBag(ref, count) {
    const tpl = typeof findItemByRef === 'function' ? findItemByRef(ref) : null;
    let left = count;
    for (let i = player.inventory.length - 1; i >= 0 && left > 0; i--) {
      const it = player.inventory[i];
      const hit = it.templateId === ref || it.id === ref || (tpl && it.name === tpl.name && it.type === tpl.type);
      if (!hit) continue;
      const have = Number(it.count) || 1;
      if (have > left) { it.count = have - left; left = 0; }
      else { left -= have; player.inventory.splice(i, 1); }
    }
    return count - left;
  }

  function successRate(r, lv, tool) {
    const c = cfg();
    const rate = (Number(r.rate) || 50) + (lv - (Number(r.reqLevel) || 1)) * c.skillBonus + (tool - (Number(r.reqTool) || 1)) * c.toolBonus;
    return Math.max(c.minRate, Math.min(c.maxRate, Math.round(rate)));
  }

  function check(r) {
    const st = skillState(r.skill);
    const tool = station ? station.toolLevel : 0;
    const lack = [];
    if (st.lv < (Number(r.reqLevel) || 1)) lack.push(`${skillDef(r.skill).name}需 ${r.reqLevel} 級`);
    if (tool < (Number(r.reqTool) || 1)) lack.push(`工具需${toolName(r.reqTool)}`);
    (r.materials || []).forEach(m => { if (countInBag(m.ref) < (Number(m.count) || 1)) lack.push('材料不足'); });
    if (player.gold < (Number(r.gold) || 0)) lack.push('銀兩不足');
    return [...new Set(lack)];
  }

  function itemName(ref) {
    const it = typeof findItemByRef === 'function' ? findItemByRef(ref) : null;
    return it ? it.name : ref;
  }
  function itemRarity(ref) {
    const it = typeof findItemByRef === 'function' ? findItemByRef(ref) : null;
    return it ? it.rarity : '凡品';
  }

  // 門派中的製作工具預設只限本門弟子使用（NPC 設 sectOnly: false 可開放給所有人）
  function ownerSect(npc) {
    const loc = (typeof WORLD_MAP !== 'undefined') ? WORLD_MAP[player.curLoc] : null;
    if (!loc || npc.sectOnly === false) return null;
    const sect = loc.area;
    return (sect && typeof SECT_DATABASE !== 'undefined' && SECT_DATABASE[sect]) ? sect : null;
  }
  function canUse(npc) {
    const sect = ownerSect(npc);
    return !sect || player.sect === sect;
  }

  function open(npcId) {
    const npc = typeof findTownNpc === 'function' ? findTownNpc(npcId) : null;
    if (!npc || npc.service !== 'craft') return;
    if (!canUse(npc)) {
      const sect = ownerSect(npc);
      if (typeof gameNotify === 'function') gameNotify(`🔒【${npc.name}】是${sect}的重器，只有${sect}弟子才能使用。`);
      if (typeof pushChatMessage === 'function') pushChatMessage('current', `[${player.curLoc}]`, `看守的弟子攔住了你：「此乃${sect}重地，外人不得擅動${npc.name}！」`, '#e67e22');
      return;
    }
    const max = cfg().maxToolLevel;
    station = { npcId, name: npc.name, skill: npc.craftSkill || 'forge', toolLevel: Math.max(1, Math.min(max, Number(npc.toolLevel) || 1)) };
    ensureData();
    render();
    if (typeof openModal === 'function') openModal('modal-craft');
  }

  function render() {
    const box = document.getElementById('craft-content');
    const titleEl = document.getElementById('craft-title');
    if (!box || !station) return;
    const d = skillDef(station.skill);
    const st = skillState(station.skill);
    const max = cfg().maxSkillLevel;
    const need = expNeed(station.skill, st.lv);
    const pct = st.lv >= max ? 100 : Math.min(100, Math.round(st.exp / need * 100));
    if (titleEl) titleEl.innerText = `${d.icon || '🛠️'} ${station.name}`;

    const list = recipes().filter(r => r.skill === station.skill)
      .sort((a, b) => (a.reqLevel - b.reqLevel) || (a.reqTool - b.reqTool));
    const toolStars = '★'.repeat(station.toolLevel) + '☆'.repeat(Math.max(0, cfg().maxToolLevel - station.toolLevel));

    let html = `
      <div class="craft-head">
        <div><b>${esc(d.name)}</b> ${st.lv} 級「${esc(title(station.skill, st.lv))}」
          <div class="craft-bar"><span style="width:${pct}%"></span></div>
          <small>${st.lv >= max ? '已臻化境' : `熟練度 ${st.exp} / ${need}`}</small></div>
        <div class="craft-tool"><small>工具品階</small><b>${toolGrade(station.toolLevel)}</b><small>${toolStars}</small></div>
      </div>
      <div class="craft-tip">技能與工具等級越高，成功率越高；工具高於需求時還有機會多產出一份。</div>`;

    if (list.length === 0) html += `<div style="text-align:center; color:#777; font-size:12px; padding:12px;">尚無可用的配方。</div>`;
    list.forEach(r => {
      const lack = check(r);
      const lockedLv = st.lv < r.reqLevel || station.toolLevel < r.reqTool;
      const rate = successRate(r, st.lv, station.toolLevel);
      const outCnt = Math.max(1, Number(r.output && r.output.count) || 1);
      const mats = (r.materials || []).map(m => {
        const have = countInBag(m.ref), needCnt = Number(m.count) || 1;
        return `<span class="${have >= needCnt ? 'ok' : 'no'}">${esc(itemName(m.ref))} ${have}/${needCnt}</span>`;
      }).join('');
      html += `
        <div class="bag-item-card craft-card ${lockedLv ? 'locked' : ''}">
          <div style="min-width:0;">
            <b class="color-${esc(itemRarity(r.output.ref))}">${esc(itemName(r.output.ref))}${outCnt > 1 ? ` ×${outCnt}` : ''}</b>
            <div><small style="color:#8a99ad;">需${esc(d.name)} ${r.reqLevel} 級・${toolGrade(r.reqTool)}以上工具</small></div>
            <div class="craft-mats">${mats}${r.gold ? `<span class="${player.gold >= r.gold ? 'ok' : 'no'}">銀兩 ${r.gold}</span>` : ''}</div>
            ${r.desc ? `<small style="color:#888;">${esc(r.desc)}</small>` : ''}
          </div>
          <div style="text-align:right; flex-shrink:0;">
            <div style="font-size:11px; color:${lockedLv ? '#666' : (rate >= 70 ? '#2ecc71' : rate >= 40 ? '#f1c40f' : '#e74c3c')};">${lockedLv ? '未達要求' : `成功率 ${rate}%`}</div>
            <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" ${lack.length ? 'disabled title="' + esc(lack.join('、')) + '"' : ''} onclick="Crafting.craft('${esc(r.id)}')">${lack.length ? esc(lack[0]) : '製作'}</button>
          </div>
        </div>`;
    });
    box.innerHTML = html;
  }

  function craft(recipeId) {
    if (!station) return;
    const r = recipes().find(x => x.id === recipeId);
    if (!r || check(r).length) { render(); return; }
    const c = cfg();
    const st = skillState(r.skill);
    const rate = successRate(r, st.lv, station.toolLevel);
    const ok = Math.random() * 100 < rate;
    player.gold -= Number(r.gold) || 0;
    const outName = itemName(r.output.ref);

    if (ok) {
      (r.materials || []).forEach(m => removeFromBag(m.ref, Number(m.count) || 1));
      let cnt = Math.max(1, Number(r.output.count) || 1);
      const extraChance = Math.max(0, station.toolLevel - (Number(r.reqTool) || 1)) * c.bonusOutputPerTool;
      const bonus = Math.random() * 100 < extraChance;
      if (bonus) cnt += 1;
      const name = typeof grantLootToBag === 'function' ? grantLootToBag('item', r.output.ref, cnt) : null;
      gainExp(r.skill, Number(r.exp) || 10);
      const msg = `成功製成【${name || outName}】${cnt > 1 ? ` ×${cnt}` : ''}${bonus ? '（工具精良，多得一份！）' : ''}`;
      if (typeof gameNotify === 'function') gameNotify(`✅ ${msg}`, 'ok');
      if (typeof pushChatMessage === 'function') pushChatMessage('system', `【${skillDef(r.skill).name}】`, msg, '#2ecc71');
    } else {
      const lost = [];
      (r.materials || []).forEach(m => {
        let gone = 0;
        for (let i = 0; i < (Number(m.count) || 1); i++) if (Math.random() >= c.failKeepRatio) gone++;
        if (gone > 0) { removeFromBag(m.ref, gone); lost.push(`${itemName(m.ref)}×${gone}`); }
      });
      gainExp(r.skill, (Number(r.exp) || 10) * c.failExpRatio);
      const msg = `製作【${outName}】失敗……${lost.length ? `損耗 ${lost.join('、')}` : '所幸材料無損'}`;
      if (typeof gameNotify === 'function') gameNotify(`💥 ${msg}`);
      if (typeof pushChatMessage === 'function') pushChatMessage('system', `【${skillDef(r.skill).name}】`, msg, '#e67e22');
    }
    if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
    render();
    if (ok && window.Encounters) Encounters.trigger('craft', { skill: r.skill, recipe: r.id });
  }

  // 內視 / 角色頁可用：所有製作技能摘要
  function summaryHtml() {
    ensureData();
    return skills().map(s => {
      const st = player.craftSkills[s.key];
      return `<span class="craft-chip">${s.icon || '🛠️'} ${esc(s.name)} ${st.lv} 級・${esc(title(s.key, st.lv))}</span>`;
    }).join('');
  }

  return { open, canUse, ownerSect, toolName, title, skillDef, render, craft, ensureData, gainExp, summaryHtml, countInBag, removeFromBag, skillState };
})();

window.Crafting = Crafting;

// ==================== 商店材料每日限量（所有商店共通，每天 resetHour 點補貨） ====================
const ShopStock = (() => {
  const cfg = () => Object.assign({ resetHour: 12, types: ["material"], byRarity: { "凡品": 30, "良品": 10, "上品": 3, "絕品": 1, "神品": 1 } },
    (typeof SHOP_STOCK_CONFIG !== 'undefined' && SHOP_STOCK_CONFIG) || {});
  // 目前這一輪的起點（最近一次 resetHour 點）
  function cycleStart(now = new Date()) {
    const d = new Date(now);
    d.setHours(Math.max(0, Math.min(23, Number(cfg().resetHour) || 0)), 0, 0, 0);
    if (now < d) d.setDate(d.getDate() - 1);
    return d.getTime();
  }
  function nextReset() { const d = new Date(cycleStart()); d.setDate(d.getDate() + 1); return d; }
  function data() {
    const start = cycleStart();
    if (!player.shopStock || player.shopStock.cycle !== start) player.shopStock = { cycle: start, bought: {} };
    return player.shopStock;
  }
  // 每日上限；0 / null = 不限量
  function limitOf(item) {
    if (!item) return 0;
    if (item.dailyStock !== undefined && item.dailyStock !== null && item.dailyStock !== "") return Math.max(0, Number(item.dailyStock) || 0);
    if (!(cfg().types || []).includes(item.type)) return 0;
    return Math.max(0, Number((cfg().byRarity || {})[item.rarity]) || 0);
  }
  function left(item) {
    const lim = limitOf(item);
    if (!lim) return Infinity;
    return Math.max(0, lim - (data().bought[item.id] || 0));
  }
  function consume(item, n = 1) {
    if (!limitOf(item)) return;
    const d = data();
    d.bought[item.id] = (d.bought[item.id] || 0) + n;
  }
  function resetText() {
    const d = nextReset(), now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return `${sameDay ? '今日' : '明日'} ${String(d.getHours()).padStart(2, '0')}:00 補貨`;
  }
  return { limitOf, left, consume, resetText, nextReset, cycleStart };
})();
window.ShopStock = ShopStock;
window.openCraftStation = npcId => Crafting.open(npcId);
