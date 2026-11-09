/**
 * ========================================================
 * 你的江湖 - 採集系統 (gathering.js)
 * 讀取 data_crafting.js（GATHER_SKILLS / GATHER_CONFIG），等級與熟練度沿用 crafting.js。
 * 採集物是地圖上的人物：service: "gather"、gatherSkill: "gather" | "mine" | "chop"、rarity: 品階、
 *   item: 產出物品 id、count: 每次數量、bonus: [{ ref, rate, count }] 額外掉落、cap / respawnMin: 可選的自訂上限 / 刷新分鐘
 * 玩家資料：player.gatherNodes = { "地點|人物id": { left: 剩餘數量, emptyAt: 採完的時間戳 } }
 * ========================================================
 */

const Gathering = (() => {
  const GRADES = ["凡品", "良品", "上品", "絕品", "神品"];
  let job = null; // { npcId, loc, timer, start, ms, auto }

  const cfg = () => Object.assign({
    levelsPerGrade: 2,
    cap: { "凡品": 20, "良品": 10, "上品": 4, "絕品": 2, "神品": 1 },
    respawnMin: { "凡品": 10, "良品": 15, "上品": 30, "絕品": 60, "神品": 120 },
    baseSeconds: { "凡品": 5, "良品": 8, "上品": 12, "絕品": 18, "神品": 25 },
    speedPerLevel: 0.06, minTimeRatio: 0.4, gapTimePenalty: 0.5, failByGap: [0, 35, 65], maxGap: 2,
    exp: { "凡品": 6, "良品": 14, "上品": 30, "絕品": 60, "神品": 120 }, failExpRatio: 0.3
  }, (typeof GATHER_CONFIG !== 'undefined' && GATHER_CONFIG) || {});
  const skills = () => (typeof GATHER_SKILLS !== 'undefined' && Array.isArray(GATHER_SKILLS)) ? GATHER_SKILLS : [];
  const skillDef = key => skills().find(s => s.key === key) || { key, name: key, verb: "採集", icon: "🌿" };
  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const gradeIdx = r => Math.max(0, GRADES.indexOf(r)); // 0~4
  const isNode = npc => npc && npc.service === 'gather';

  function ensureData() {
    if (!player.gatherNodes || typeof player.gatherNodes !== 'object') player.gatherNodes = {};
  }
  const nodeKey = (loc, npc) => `${loc}|${npc.id}`;
  function capOf(npc) { return Math.max(1, Number(npc.cap) || Number(cfg().cap[npc.rarity]) || 1); }
  function respawnMs(npc) { return Math.max(0.1, Number(npc.respawnMin) || Number(cfg().respawnMin[npc.rarity]) || 10) * 60000; }

  // 取得資源點狀態（含自動刷新）
  function state(loc, npc) {
    ensureData();
    const k = nodeKey(loc, npc);
    let st = player.gatherNodes[k];
    const cap = capOf(npc);
    if (!st) st = player.gatherNodes[k] = { left: cap, emptyAt: 0 };
    if (st.left <= 0 && st.emptyAt && Date.now() - st.emptyAt >= respawnMs(npc)) { st.left = cap; st.emptyAt = 0; }
    if (st.left > cap) st.left = cap;
    return st;
  }

  function skillLv(key) { return window.Crafting ? Crafting.skillState(key).lv : 1; }
  function skillGrade(lv) { return Math.min(GRADES.length - 1, Math.floor((lv - 1) / Math.max(1, cfg().levelsPerGrade))); }
  function gapOf(npc) { return gradeIdx(npc.rarity) - skillGrade(skillLv(npc.gatherSkill)); }
  function failRate(npc) {
    const g = gapOf(npc), t = cfg().failByGap || [0];
    if (g <= 0) return Number(t[0]) || 0;
    return Number(t[Math.min(g, t.length - 1)]) || 0;
  }
  function seconds(npc) {
    const c = cfg();
    const lv = skillLv(npc.gatherSkill);
    const base = Number(c.baseSeconds[npc.rarity]) || 5;
    const lvMul = Math.max(c.minTimeRatio, 1 - (lv - 1) * c.speedPerLevel);
    const gapMul = 1 + Math.max(0, gapOf(npc)) * c.gapTimePenalty;
    return Math.round(base * lvMul * gapMul * 10) / 10;
  }
  function blocked(npc) { return gapOf(npc) > cfg().maxGap; }
  function minLevelFor(npc) { return gradeIdx(npc.rarity) * cfg().levelsPerGrade + 1 - cfg().maxGap * cfg().levelsPerGrade; }
  function itemName(ref) { const it = typeof findItemByRef === 'function' ? findItemByRef(ref) : null; return it ? it.name : (ref || '？'); }
  function fmtLeft(ms) {
    const m = Math.ceil(ms / 60000);
    return m >= 60 ? `${Math.floor(m / 60)} 小時 ${m % 60} 分` : `${m} 分鐘`;
  }

  // NPC 面板中的採集區塊（取代一般的行動按鈕）
  function panelHtml(npc) {
    const loc = player.curLoc;
    const st = state(loc, npc);
    const d = skillDef(npc.gatherSkill);
    const lv = skillLv(npc.gatherSkill);
    const cap = capOf(npc);
    const fr = failRate(npc);
    const running = job && job.npcId === npc.id;
    let status;
    if (st.left <= 0) status = `<span style="color:#e67e22;">資源已枯竭，約 ${fmtLeft(respawnMs(npc) - (Date.now() - st.emptyAt))}後刷新</span>`;
    else status = `剩餘 <b style="color:#fff;">${st.left}</b> / ${cap}`;
    const skillLine = `${d.icon || ''} ${esc(d.name)} ${lv} 級（可採${GRADES[skillGrade(lv)]}）`;
    let action;
    if (blocked(npc)) action = `<button class="wuxia-btn" disabled style="color:#777; border-color:#444;">🔒 ${esc(d.name)}需達 ${minLevelFor(npc)} 級</button>`;
    else if (st.left <= 0) action = `<button class="wuxia-btn" disabled style="color:#777; border-color:#444;">⏳ 等待刷新</button>`;
    else if (running) action = `<button class="wuxia-btn" style="color:#e74c3c; border-color:#e74c3c;" onclick="Gathering.cancel()">✋ 停止</button>`;
    else action = `<button class="wuxia-btn" style="color:var(--green); border-color:var(--green);" onclick="Gathering.start('${esc(npc.id)}')">${d.icon || ''} ${esc(d.verb || d.name)}</button>`;
    return `
      <div class="gather-box">
        <div class="gather-info">
          <span>產出：<b class="color-${esc(((typeof findItemByRef === 'function' && findItemByRef(npc.item)) || {}).rarity || '凡品')}">${esc(itemName(npc.item))}</b>${Number(npc.count) > 1 ? ` ×${npc.count}` : ''}</span>
          <span>${status}</span>
          <span>${skillLine}</span>
          ${blocked(npc) ? '' : `<span>每次約 ${seconds(npc)} 秒${fr > 0 ? `・<b style="color:#e74c3c;">失敗率 ${fr}%</b>` : ''}</span>`}
        </div>
        <div class="gather-bar" id="gather-bar"><span></span><em></em></div>
        <div class="npc-actions">
          <button class="wuxia-btn" style="color:var(--cyan); border-color:var(--cyan);" onclick="talkToNpc('${esc(npc.id)}')">💬 查看</button>
          ${action}
          <label class="gather-auto"><input type="checkbox" id="gather-auto" ${job && job.auto ? 'checked' : ''} onchange="Gathering.setAuto(this.checked)"> 連續${esc(d.verb || d.name)}</label>
        </div>
      </div>`;
  }

  function refreshPanel(npcId) {
    if (typeof currentNpcPanelId !== 'undefined' && currentNpcPanelId === npcId && typeof openNpcPanel === 'function') openNpcPanel(npcId, true);
  }

  function start(npcId) {
    const npc = typeof findTownNpc === 'function' ? findTownNpc(npcId) : null;
    if (!isNode(npc) || job) return;
    const st = state(player.curLoc, npc);
    if (blocked(npc) || st.left <= 0) { refreshPanel(npcId); return; }
    const autoEl = document.getElementById('gather-auto');
    const ms = seconds(npc) * 1000;
    job = { npcId, loc: player.curLoc, start: performance.now(), ms, auto: !!(autoEl && autoEl.checked) };
    refreshPanel(npcId);
    const tick = () => {
      if (!job) return;
      // 離開人物面板、移動或進入戰鬥時中斷
      if (player.curLoc !== job.loc || (typeof currentNpcPanelId !== 'undefined' && currentNpcPanelId !== job.npcId) || (typeof currentPlacePage !== 'undefined' && currentPlacePage !== 'pg-npc') || (typeof isInBattle === 'function' && isInBattle())) { cancel(true); return; }
      const p = Math.min(1, (performance.now() - job.start) / job.ms);
      const bar = document.getElementById('gather-bar');
      if (bar) {
        bar.classList.add('on');
        bar.querySelector('span').style.width = `${(p * 100).toFixed(1)}%`;
        bar.querySelector('em').innerText = `${skillDef(npc.gatherSkill).verb || '採集'}中… ${((job.ms * (1 - p)) / 1000).toFixed(1)} 秒`;
      }
      if (p >= 1) finish(npc);
      else job.timer = requestAnimationFrame(tick);
    };
    job.timer = requestAnimationFrame(tick);
  }

  function finish(npc) {
    const auto = job.auto;
    job = null;
    const st = state(player.curLoc, npc);
    const d = skillDef(npc.gatherSkill);
    const c = cfg();
    const baseExp = Number(c.exp[npc.rarity]) || 5;
    if (Math.random() * 100 < failRate(npc)) {
      if (window.Crafting) Crafting.gainExp(npc.gatherSkill, baseExp * c.failExpRatio);
      if (typeof pushChatMessage === 'function') pushChatMessage('system', `【${d.name}】`, `${d.verb || d.name}【${npc.name}】失手了，什麼也沒得到……`, '#e67e22');
    } else {
      st.left = Math.max(0, st.left - 1);
      if (st.left === 0) st.emptyAt = Date.now();
      const got = [];
      const cnt = Math.max(1, Number(npc.count) || 1);
      const name = typeof grantLootToBag === 'function' ? grantLootToBag('item', npc.item, cnt) : null;
      if (name) got.push(cnt > 1 ? `${name}×${cnt}` : name);
      (Array.isArray(npc.bonus) ? npc.bonus : []).forEach(b => {
        if (!b || !b.ref || Math.random() * 100 >= (Number(b.rate) || 0)) return;
        const bc = Math.max(1, Number(b.count) || 1);
        const bn = grantLootToBag(b.kind || 'item', b.ref, bc);
        if (bn) got.push(`${bn}${bc > 1 ? '×' + bc : ''}（意外收穫）`);
      });
      if (window.Crafting) Crafting.gainExp(npc.gatherSkill, baseExp);
      if (typeof pushChatMessage === 'function') pushChatMessage('system', `【${d.name}】`, `${d.verb || d.name}【${npc.name}】，獲得 ${got.join('、') || '（無）'}${st.left === 0 ? `。資源已採盡，約 ${fmtLeft(respawnMs(npc))}後刷新` : `（剩餘 ${st.left}）`}`, '#2ecc71');
      if (window.Encounters) setTimeout(() => Encounters.trigger('gather', { skill: npc.gatherSkill }), 200);
    }
    if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
    refreshPanel(npc.id);
    if (auto && st.left > 0 && !blocked(npc) && !(window.Encounters && Encounters.isActive())) {
      const el = document.getElementById('gather-auto');
      if (el) el.checked = true;
      setTimeout(() => start(npc.id), 250);
    }
  }

  function cancel(silent) {
    if (!job) return;
    cancelAnimationFrame(job.timer);
    const id = job.npcId;
    job = null;
    if (!silent) refreshPanel(id);
  }
  function setAuto(on) { if (job) job.auto = on; }

  // 街頭 / 場景按鈕用的圖示
  function iconOf(npc) { return skillDef(npc.gatherSkill).icon || '🌿'; }

  return { panelHtml, start, cancel, setAuto, state, isNode, iconOf, ensureData, seconds, failRate, blocked, capOf };
})();

window.Gathering = Gathering;
