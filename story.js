/**
 * ========================================================
 * 你的江湖 - 新手引導專屬模組 (story.js)
 * 專門負責：
 * 1. 首次進入遊戲的身世卷軸
 * 2. 隨機 2 個宿命天賦與 5 次重抽
 * ========================================================
 */

// 宣告在專屬命名空間中，避免與任何檔案重複宣告衝突
var StoryEngine = {
  rerollsLeft: 5,
  currentTalents: []
};

function checkAndShowNewbieIntro() {
  if (localStorage.getItem("WUXIA_MASTER_SAVE") || player.hasSeenIntro) return;
  StoryEngine.rerollsLeft = 5;
  rollStarterTalents();
  openModal('modal-newbie-intro');
}

function rollStarterTalents() {
  const pool = (typeof GLOBAL_TALENTS !== 'undefined' && Array.isArray(GLOBAL_TALENTS)) ? [...GLOBAL_TALENTS] : [];
  StoryEngine.currentTalents = [];
  for (let i = 0; i < 2 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    StoryEngine.currentTalents.push(pool.splice(idx, 1)[0]);
  }
  renderStarterTalentsUI();
}

function rerollStarterTalents() {
  if (StoryEngine.rerollsLeft <= 0) {
    alert("五次天命重擲機會已耗盡！");
    return;
  }
  StoryEngine.rerollsLeft--;
  rollStarterTalents();
}

function renderStarterTalentsUI() {
  const box = document.getElementById('starter-talents-box');
  const cntEl = document.getElementById('starter-reroll-count');
  if (cntEl) cntEl.innerText = StoryEngine.rerollsLeft;
  if (!box) return;

  box.innerHTML = '';
  StoryEngine.currentTalents.forEach(t => {
    const d = document.createElement('div');
    const colorClass = (typeof getRarityColorClass === 'function') ? getRarityColorClass(t.rarity) : `color-${t.rarity}`;
    d.style.cssText = "background:#121720; border:1px solid #334155; border-left:3px solid var(--gold); border-radius:4px; padding:8px 10px; margin-bottom:6px; text-align:left;";
    d.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <b class="${colorClass}" style="font-size:12.5px;">【${t.name}】</b>
        <span class="rarity-badge rarity-${t.rarity}">${t.rarity}</span>
      </div>
      <div style="font-size:11px; color:#cad3df; margin-top:3px;">${t.desc}</div>
    `;
    box.appendChild(d);
  });
}

function confirmStarterIntro() {
  player.hasSeenIntro = true;
  player.talents = [...StoryEngine.currentTalents];
  
  // 天賦：謫仙轉世 (初始帶300修為)
  if (player.talents.some(t => t.initExp)) {
    player.exp += 300;
  }
  // 天賦：窮困潦倒
  if (player.talents.some(t => t.zeroStartGold)) {
    player.gold = 0;
  }

  closeModal('modal-newbie-intro');
  recalcPlayerStats();
  if (typeof autoSave === 'function') autoSave();
  alert("🏮 命格已定，少俠自牛家村長堤悠悠醒轉，踏上了波瀾壯闊的江湖旅途！");
}

window.checkAndShowNewbieIntro = checkAndShowNewbieIntro;
window.rerollStarterTalents = rerollStarterTalents;
window.confirmStarterIntro = confirmStarterIntro;