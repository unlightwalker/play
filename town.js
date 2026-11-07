/**
 * ========================================================
 * 你的江湖 - 入世、全圖與江湖情報站 (town.js) [自動置底滾動版]
 * 支援：
 * 1. 對話框發布任何新訊息或切換頻道時，自動平滑滑動至最底端顯示最新消息
 * 2. 訊息永久留存，不隨換地圖、過圖而清空
 * 3. 五大頻道獨立彩色／暗灰開關過濾
 * ========================================================
 */

function getSceneIcon(type) {
  if (type === 'smithy') return '🔨';
  if (type === 'kwoon') return '🥋';
  if (type === 'sect') return '🏯';
  if (type === 'inn') return '🍶';
  if (type === 'pharmacy') return '💊';
  if (type === 'field_combat') return '⚔️';
  return '🏮';
}

// ==================== ★ 全局情報日誌系統 ★ ====================
let globalChatLogs = [
  { id: 1, time: "晨光", channel: "world", tag: "【江湖昭告】", text: "南宋烽煙動盪，各路英豪匯聚江南，神兵絕學現世！", color: "#5dade2" },
  { id: 2, time: "即刻", channel: "system", tag: "【天機指引】", text: "點擊上方「打坐」可修煉內力，「歷練」可挑戰通天塔！", color: "#ff9f43" }
];

const chatChannels = {
  all: true,
  system: true,
  world: true,
  current: true,
  combat: true
};

let isChatExpanded = false;

function pushChatMessage(channel, tag, text, color = "#cad3df") {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  globalChatLogs.push({
    id: Date.now() + Math.random(),
    time: timeStr,
    channel: channel,
    tag: tag,
    text: text,
    color: color
  });

  if (globalChatLogs.length > 200) {
    globalChatLogs.shift();
  }

  renderChatMessages();
}
window.pushChatMessage = pushChatMessage;

function toggleChatChannel(chName) {
  if (chName === 'all') {
    const newState = !chatChannels.all;
    ['all', 'system', 'world', 'current', 'combat'].forEach(k => {
      chatChannels[k] = newState;
    });
  } else {
    chatChannels[chName] = !chatChannels[chName];
    chatChannels.all = (chatChannels.system && chatChannels.world && chatChannels.current && chatChannels.combat);
  }

  updateChannelButtonsUI();
  renderChatMessages();
}
window.toggleChatChannel = toggleChatChannel;

function updateChannelButtonsUI() {
  ['all', 'system', 'world', 'current', 'combat'].forEach(k => {
    const btn = document.getElementById(`ch-btn-${k}`);
    if (btn) {
      if (chatChannels[k]) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
}
window.updateChannelButtonsUI = updateChannelButtonsUI;

function renderChatMessages() {
  const container = document.getElementById('chat-messages-container');
  const box = document.getElementById('chat-list');
  if (!container) return;
  container.innerHTML = '';

  const filtered = globalChatLogs.filter(msg => chatChannels[msg.channel]);

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:#555; padding:25px; font-size:11.5px;">當前頻道暫無訊息。可於上方開啟更多頻道！</div>`;
    return;
  }

  filtered.forEach(msg => {
    const d = document.createElement('div');
    d.style.marginBottom = '4px';
    d.style.lineHeight = '1.5';
    d.style.fontSize = '12px';
    d.innerHTML = `
      <span style="color:#64748b; font-family:monospace; font-size:10.5px;">[${msg.time}]</span>
      <span style="font-weight:bold; margin-right:3px;">${msg.tag}</span>
      <span style="color:${msg.color};">${msg.text}</span>
    `;
    container.appendChild(d);
  });

  const scrollToBottom = () => {
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  };

  scrollToBottom();
  setTimeout(scrollToBottom, 10);
  setTimeout(scrollToBottom, 60);
}
window.renderChatMessages = renderChatMessages;

function toggleChatExpand(e) {
  if (e) e.stopPropagation();
  isChatExpanded = !isChatExpanded;
  applyChatExpandState();
}
window.toggleChatExpand = toggleChatExpand;

function handleChatBoxClick(e) {
  if (!isChatExpanded) {
    isChatExpanded = true;
    applyChatExpandState();
  }
}
window.handleChatBoxClick = handleChatBoxClick;

function applyChatExpandState() {
  const phone = document.getElementById('phone-app');
  const expandBtn = document.getElementById('btn-toggle-expand');
  const hintEl = document.getElementById('basic-mode-hint');

  if (isChatExpanded) {
    if (phone) phone.classList.add('chat-expanded');
    if (expandBtn) expandBtn.innerHTML = '✕ 收起';
    if (hintEl) hintEl.style.display = 'inline-block';
  } else {
    if (phone) phone.classList.remove('chat-expanded');
    if (expandBtn) expandBtn.innerHTML = '⛶ 放大';
    if (typeof switchToNormalMode === 'function') {
      switchToNormalMode();
    }
  }

  renderChatMessages();
}

// ==================== 1. 江湖各城鎮坐標與拓撲 ====================
const TOWN_COORDINATES = {
  "臨安府":   [ 0, -1],
  "牛家村":   [ 0,  0],
  "嘉興":     [ 0,  1],
  "蘇州府":   [ 0,  2],
  "太湖":     [-1,  2],
  "無錫城":   [ 0,  3],
  "宜興鎮":   [-1,  3],
  "揚州城":   [ 0,  4],
  "金陵城":   [-1,  4],
  "鎮江府":   [ 1,  4],
  "福州府":   [ 0, -3],
  "泉州府":   [ 0, -4],
  "澎湖灣":   [ 1, -4],
  "福爾摩沙": [ 2, -4],
  "東瀛":     [ 2, -3],
  "潮州府":   [ 0, -5],
  "廣州府":   [-1, -5],
  "佛山鎮":   [-2, -5],
  "香港":     [-1, -6],
  "澳門":     [-2, -6],
  "襄陽城":   [-2,  4],
  "武當山":   [-3,  4],
  "漢中府":   [-4,  4],
  "重慶府":   [-3,  3],
  "登封鎮":   [-1,  5],
  "少室山":   [-1,  6],
  "開封府":   [ 0,  5],
  "洛陽城":   [-2,  5],
  "華山險道": [-3,  5],
  "長安古都": [-4,  5],
  "終南山道": [-3,  6],
  "真定府":   [-4,  6],
  "北京城":   [-4,  7]
};

const JIANGHU_TOPOLOGY = {
  "牛家村":   { 1: "嘉興", 7: "臨安府" },
  "嘉興":     { 1: "蘇州府", 7: "牛家村" },
  "蘇州府":   { 1: "無錫城", 7: "嘉興", 3: "太湖" },
  "太湖":     { 1: "宜興鎮", 5: "蘇州府" },
  "無錫城":   { 1: "揚州城", 7: "蘇州府", 3: "宜興鎮" },
  "宜興鎮":   { 5: "無錫城", 7: "太湖" },
  "揚州城":   { 7: "無錫城", 3: "金陵城", 5: "鎮江府" },
  "金陵城":   { 5: "揚州城", 3: "襄陽城", 1: "登封鎮" },
  "鎮江府":   { 3: "揚州城" },
  "臨安府":   { 1: "牛家村", 7: "福州府" },
  "福州府":   { 1: "臨安府", 7: "泉州府" },
  "泉州府":   { 1: "福州府", 5: "澎湖灣", 7: "潮州府" },
  "澎湖灣":   { 3: "泉州府", 5: "福爾摩沙" },
  "福爾摩沙": { 3: "澎湖灣", 1: "東瀛" },
  "東瀛":     { 7: "福爾摩沙" },
  "潮州府":   { 1: "泉州府", 3: "廣州府" },
  "廣州府":   { 5: "潮州府", 3: "佛山鎮", 7: "香港" },
  "佛山鎮":   { 5: "廣州府", 7: "澳門" },
  "香港":     { 1: "廣州府", 3: "澳門" },
  "澳門":     { 1: "佛山鎮", 5: "香港" },
  "襄陽城":   { 5: "金陵城", 3: "武當山", 7: "重慶府" },
  "武當山":   { 5: "襄陽城", 3: "漢中府" },
  "漢中府":   { 5: "武當山", 1: "長安古都" },
  "重慶府":   { 1: "襄陽城" },
  "登封鎮":   { 7: "金陵城", 3: "洛陽城", 5: "開封府", 1: "少室山" },
  "少室山":   { 7: "登封鎮" },
  "開封府":   { 3: "登封鎮" },
  "洛陽城":   { 5: "登封鎮", 3: "華山險道" },
  "華山險道": { 5: "洛陽城", 3: "長安古都" },
  "長安古都": { 5: "華山險道", 7: "漢中府", 1: "真定府" },
  "真定府":   { 7: "長安古都", 1: "北京城" },
  "北京城":   { 7: "真定府" }
};

function renderNineGridMap() {
  const curName = (typeof player !== 'undefined' && player.curLoc) ? player.curLoc : "牛家村";
  const topo = JIANGHU_TOPOLOGY[curName] || {};

  const coords = TOWN_COORDINATES[curName] || [0, 0];
  const coordEl = document.getElementById('map-coord-display');
  if (coordEl) coordEl.innerText = `(${coords[0]}, ${coords[1]})`;

  const cityEl = document.getElementById('jh-current-city');
  if (cityEl) cityEl.innerText = curName;

  const board = document.getElementById('main-inline-nine-grid');
  if (!board) return;
  board.innerHTML = '';

  const gridAssignments = new Array(9).fill(null);
  gridAssignments[4] = { name: curName, isCenter: true };

  const crossSlots = [1, 5, 7, 3];
  crossSlots.forEach(slot => {
    if (topo[slot]) gridAssignments[slot] = { name: topo[slot], isWalkable: true };
  });

  const northTown = topo[1];
  const southTown = topo[7];
  const eastTown  = topo[5];
  const westTown  = topo[3];

  let nwTown = (northTown && JIANGHU_TOPOLOGY[northTown] && JIANGHU_TOPOLOGY[northTown][3]) || (westTown && JIANGHU_TOPOLOGY[westTown] && JIANGHU_TOPOLOGY[westTown][1]);
  let neTown = (northTown && JIANGHU_TOPOLOGY[northTown] && JIANGHU_TOPOLOGY[northTown][5]) || (eastTown && JIANGHU_TOPOLOGY[eastTown] && JIANGHU_TOPOLOGY[eastTown][1]);
  let swTown = (southTown && JIANGHU_TOPOLOGY[southTown] && JIANGHU_TOPOLOGY[southTown][3]) || (westTown && JIANGHU_TOPOLOGY[westTown] && JIANGHU_TOPOLOGY[westTown][7]);
  let seTown = (southTown && JIANGHU_TOPOLOGY[southTown] && JIANGHU_TOPOLOGY[southTown][5]) || (eastTown && JIANGHU_TOPOLOGY[eastTown] && JIANGHU_TOPOLOGY[eastTown][7]);

  if (nwTown && nwTown !== curName && !gridAssignments.some(g => g && g.name === nwTown)) gridAssignments[0] = { name: nwTown, isDistant: true };
  if (neTown && neTown !== curName && !gridAssignments.some(g => g && g.name === neTown)) gridAssignments[2] = { name: neTown, isDistant: true };
  if (swTown && swTown !== curName && !gridAssignments.some(g => g && g.name === swTown)) gridAssignments[6] = { name: swTown, isDistant: true };
  if (seTown && seTown !== curName && !gridAssignments.some(g => g && g.name === seTown)) gridAssignments[8] = { name: seTown, isDistant: true };

  for (let i = 0; i < 9; i++) {
    const nodeData = gridAssignments[i];
    const cell = document.createElement('div');
    cell.className = 'inline-grid-cell';

    if (nodeData && nodeData.isCenter) {
      cell.classList.add('current-pos');
      cell.innerHTML = `<div>${nodeData.name}</div>`;
      cell.title = `當前所在：${nodeData.name}`;
    } else if (nodeData && nodeData.isWalkable) {
      cell.classList.add('walkable');
      cell.innerHTML = `<div>${nodeData.name}</div>`;
      cell.title = `點擊前往【${nodeData.name}】`;
      cell.onclick = () => travelToTown(nodeData.name);
    } else if (nodeData && nodeData.isDistant) {
      cell.style.background = "#111620";
      cell.style.color = "#5a6b82";
      cell.style.border = "1px dashed #222c3a";
      cell.innerHTML = `<div>${nodeData.name}</div>`;
      cell.title = `【遠眺】${nodeData.name}`;
    } else {
      cell.style.background = "transparent";
      cell.style.border = "1px dashed #1a222e";
      cell.innerHTML = ``;
    }

    board.appendChild(cell);
  }
}

function travelToTown(destKey) {
  if (typeof WORLD_MAP === 'undefined' || !WORLD_MAP[destKey]) return;
  player.lastTown = player.curLoc;
  player.curLoc = destKey;

  renderNineGridMap();
  renderJianghuScenesOnMenu();
  if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
  refreshChatForCurrentLocation();
}

function renderJianghuScenesOnMenu() {
  try {
    let cur = (typeof WORLD_MAP !== 'undefined') ? WORLD_MAP[player.curLoc] : null;
    if (!cur) {
      player.curLoc = "牛家村";
      cur = (typeof WORLD_MAP !== 'undefined') ? WORLD_MAP["牛家村"] : null;
    }
    if (!cur) return;

    renderNineGridMap();

    const cityEl = document.getElementById('jh-current-city');
    if (cityEl) cityEl.innerText = cur.name;

    const grid = document.getElementById('jh-scenes-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (cur.scenes && Array.isArray(cur.scenes)) {
      cur.scenes.forEach(sc => {
        const btn = document.createElement('button');
        btn.className = 'wuxia-btn';
        btn.innerHTML = `${getSceneIcon(sc.type)} ${sc.name}`;
        btn.onclick = () => openSceneModal(sc);
        grid.appendChild(btn);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

function openSceneModal(sc) {
  const titleEl = document.getElementById('scene-modal-title');
  const descEl = document.getElementById('scene-modal-desc');
  const content = document.getElementById('scene-modal-content');
  if (titleEl) titleEl.innerText = `${getSceneIcon(sc.type)} ${sc.name}`;
  if (descEl) descEl.innerText = sc.desc;
  if (!content) return;
  content.innerHTML = '';

  if (sc.type === 'field_combat') {
    const loc = WORLD_MAP[player.curLoc] || WORLD_MAP["牛家村"];
    const enemies = (loc && loc.fieldEnemies) ? loc.fieldEnemies : [];
    let enemyListHtml = `<div style="font-size:12px; color:#cad3df; margin-bottom:8px;"><b>【演武挑戰】</b> 選擇對手切磋印證武學：</div>`;
    enemies.forEach((e, idx) => {
      enemyListHtml += `
        <div class="bag-item-card">
          <div>
            <b style="color:#fff;">${e.name}</b>
            <span style="color:#f1c40f; font-size:11px; margin-left:4px;">【${e.realm}】</span><br>
            <small style="color:#aaa;">氣血 ${e.maxHp} | 外攻 ${e.atk} | 身法 ${e.speed}</small>
          </div>
          <button class="wuxia-btn" style="padding:4px 10px; font-size:12px; color:#e74c3c; border-color:#e74c3c;" onclick="startDuelWithEnemy(${idx})">討伐切磋</button>
        </div>
      `;
    });
    content.innerHTML = enemyListHtml;
  } else if (sc.type === 'smithy') {
    content.innerHTML = `
      <div style="font-size:12px; color:#cad3df; margin-bottom:8px;"><b>【鐵匠鍛造臺】</b> 購買後存入「行囊」：</div>
      <div class="bag-item-card">
        <div><b class="color-良品">百煉青鋼劍 (劍)</b><br><small style="color:#aaa;">外攻 +18，身法 +6</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyItemToBag('百煉青鋼劍', 60)">60兩</button>
      </div>
      <div class="bag-item-card">
        <div><b class="color-良品">冷月厚背刀 (刀)</b><br><small style="color:#aaa;">外攻 +22，身法 +2</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyItemToBag('冷月厚背刀', 65)">65兩</button>
      </div>
      <div class="bag-item-card">
        <div><b class="color-良品">齊眉熟銅棍 (棍)</b><br><small style="color:#aaa;">外攻 +20，防禦 +8</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyItemToBag('齊眉熟銅棍', 65)">65兩</button>
      </div>
      <div class="bag-item-card">
        <div><b class="color-良品">鑌鐵指虎爪 (拳套)</b><br><small style="color:#aaa;">外攻 +18，身法 +6，防禦 +4</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyItemToBag('鑌鐵指虎爪', 55)">55兩</button>
      </div>
      <div class="bag-item-card">
        <div><b class="color-良品">精鋼鎖子甲 (防具)</b><br><small style="color:#aaa;">防禦 +15，氣血 +120</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyItemToBag('精鋼鎖子甲', 85)">85兩</button>
      </div>
    `;
  } else if (sc.type === 'sect') {
    if (typeof openSectHallModal === 'function') {
      openSectHallModal(sc.sectName);
    }
    return;
  } else if (sc.type === 'kwoon') {
    content.innerHTML = `
      <div style="font-size:12px; color:#cad3df; margin-bottom:8px;"><b>【武館教頭研習】</b> 習得武學為【一重 0% 初學者】：</div>
      <div class="bag-item-card">
        <div><b class="color-良品">漫天花雨手法 (暗器・良品)</b><br><small style="color:#aaa;">需配備暗器施展</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="learnKwoonSkill('漫天花雨手法', 60, 25)">60學點+25兩</button>
      </div>
      <div class="bag-item-card">
        <div><b class="color-良品">八卦六合刀 (刀法・良品)</b><br><small style="color:#aaa;">需配備刀類兵刃施展</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="learnKwoonSkill('八卦六合刀', 50, 20)">50學點+20兩</button>
      </div>
      <div class="bag-item-card">
        <div><b class="color-良品">金剛鐵布衫 (心法・良品)</b><br><small style="color:#aaa;">常駐防禦 +12，氣血 +90</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="learnKwoonSkill('金剛鐵布衫', 60, 25)">60學點+25兩</button>
      </div>
    `;
  } else if (sc.type === 'inn') {
    content.innerHTML = `
      <div class="bag-item-card">
        <div><b>上房安歇一宿</b><br><small style="color:#aaa;">氣血與內力瞬間完全回滿</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px; color:var(--green); border-color:var(--green);" onclick="restAtInn(5)">5兩 歇息</button>
      </div>
      <div class="bag-item-card">
        <div><b>品茗聽說書</b><br><small style="color:#aaa;">聽前代名宿軼事，增長見聞</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px; color:var(--cyan); border-color:var(--cyan);" onclick="listenStoryteller(10)">10兩 品茗</button>
      </div>
      <div class="bag-item-card">
        <div><b>百寶閣收購櫃台</b><br><small style="color:#aaa;">高價收購各色神兵雜物</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px; color:var(--gold); border-color:var(--gold);" onclick="closeModal('modal-scene'); openPawnshopModal();">典當行囊</button>
      </div>
    `;
  }

  openModal('modal-scene');
}

function restAtInn(cost) {
  cost = Number(cost) || 5;
  if (player.gold < cost) { alert("盤纏不足！"); return; }
  player.gold -= cost;
  player.hp = player.maxHp;
  player.mp = player.maxMp;

  if (typeof updateProfileUI === 'function') updateProfileUI();
  if (typeof autoSave === 'function') autoSave();
  closeModal('modal-scene');
  pushChatMessage('system', '【客棧調養】', '上房安歇一宿，酒暖被軟。氣血與內力皆已恢復圓滿！', '#2ecc71');
}

function listenStoryteller(cost) {
  cost = Number(cost) || 10;
  if (player.gold < cost) { alert("碎銀不足！"); return; }
  player.gold -= cost;
  player.learn += 30;

  if (typeof updateProfileUI === 'function') updateProfileUI();
  if (typeof autoSave === 'function') autoSave();
  pushChatMessage('system', '【品茗聽書】', '一盞清茗，半晌評書！聽聞前代宗師掌故，學點 +30！', '#f1c40f');
}

const ITEM_PAWN_VALUES = { "凡品": 8, "良品": 30, "上品": 90, "絕品": 180, "神品": 350 };
function getItemPawnPrice(item) {
  if (!item) return 2;
  if (item.cost) return Math.max(2, Math.floor(item.cost * 0.5));
  return ITEM_PAWN_VALUES[item.rarity] || 10;
}

function openPawnshopModal() { renderPawnshopUI(); openModal('modal-pawnshop'); }

function renderPawnshopUI() {
  const goldDisp = document.getElementById('pawn-gold-disp');
  if (goldDisp) goldDisp.innerText = `${player.gold}兩`;

  const box = document.getElementById('pawn-item-list');
  if (!box) return;
  box.innerHTML = '';

  if (!player.inventory || player.inventory.length === 0) {
    box.innerHTML = `<div style="text-align:center; color:#888; font-size:12px; padding:25px;">隨身行囊空空如也。</div>`;
    return;
  }

  player.inventory.forEach((item, idx) => {
    const price = getItemPawnPrice(item);
    const card = document.createElement('div');
    card.className = 'bag-item-card';

    const colorClass = (typeof getRarityColorClass === 'function') ? getRarityColorClass(item.rarity) : `color-${item.rarity}`;
    const countBadge = item.count ? `<span style="color:var(--gold); font-size:11px;">x${item.count}</span>` : '';
    const typeLabel = (item.type === 'weapon') 
      ? `[${(typeof getWeaponType === 'function') ? getWeaponType(item) : '兵器'}]` 
      : (item.type === 'armor' ? '[防具]' : (item.type === 'book' ? '[秘笈]' : '[丹藥]'));

    card.innerHTML = `
      <div>
        <b class="${colorClass}" style="font-size:13px;">${item.name}</b>
        <span class="rarity-badge rarity-${item.rarity}">${item.rarity}</span>
        <small style="color:var(--cyan); margin-left:3px;">${typeLabel}</small>
        ${countBadge}
        <div style="font-size:11px; color:#8ca0b3; margin-top:2px;">${item.desc || '尋常物事'}</div>
      </div>
      <div>
        <button class="wuxia-btn" style="padding:4px 9px; font-size:11.5px; border-color:var(--gold); color:var(--gold);" onclick="sellItemToPawn(${idx})">
          典當 +${price}兩
        </button>
      </div>
    `;
    box.appendChild(card);
  });
}

function sellItemToPawn(idx) {
  const item = player.inventory[idx];
  if (!item) return;
  const price = getItemPawnPrice(item);

  if (item.rarity === '神品' || item.rarity === '絕品') {
    if (!confirm(`【百寶閣提醒】${item.name} 乃當世罕見【${item.rarity}】，確定典當換取 ${price} 兩？`)) return;
  }

  player.gold += price;
  if (item.count && item.count > 1) item.count -= 1;
  else player.inventory.splice(idx, 1);

  if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
  renderPawnshopUI();
  if (typeof renderBagUI === 'function') renderBagUI();
}

function quickSellJunk() {
  if (!player.inventory || player.inventory.length === 0) { alert("行囊空空！"); return; }
  let totalGain = 0;
  player.inventory = player.inventory.filter(item => {
    if (item.rarity === "凡品") {
      const cnt = item.count || 1;
      totalGain += getItemPawnPrice(item) * cnt;
      return false;
    }
    return true;
  });

  player.gold += totalGain;
  if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
  renderPawnshopUI();
  if (typeof renderBagUI === 'function') renderBagUI();
  pushChatMessage('system', '【當鋪典當】', `一鍵典當凡品雜物，共收入碎銀 +${totalGain} 兩！`, '#f1c40f');
}

function startDuelWithEnemy(idx) {
  closeModal('modal-scene');
  const enemies = (WORLD_MAP[player.curLoc] && WORLD_MAP[player.curLoc].fieldEnemies) ? WORLD_MAP[player.curLoc].fieldEnemies : [];
  if (enemies && enemies[idx]) {
    const rawEnemy = enemies[idx];
    const enemyData = {
      ...rawEnemy,
      stats: rawEnemy.stats || {
        arm: Math.round((rawEnemy.atk || 20) * 0.7),
        speed: rawEnemy.speed || 40,
        bone: Math.round((rawEnemy.def || 10) * 1.5),
        inner: Math.round((rawEnemy.atk || 20) * 0.5),
        int: 20,
        luck: 15
      }
    };
    if (typeof startBattleAgainst === 'function') {
      startBattleAgainst(enemyData, false);
    } else {
      console.error("startBattleAgainst 函式尚未掛載！");
    }
  }
}

function refreshChatForCurrentLocation() {
  if (typeof WORLD_MAP === 'undefined') return;
  const loc = WORLD_MAP[player.curLoc] || WORLD_MAP["牛家村"];
  if (!loc || !loc.npcs) return;

  const randNpc = loc.npcs[Math.floor(Math.random() * loc.npcs.length)];
  pushChatMessage('current', `[${loc.name}] ${randNpc.u}`, randNpc.critic, '#f1c40f');
}

function appendCombatChat(tag, msg, tagColor) {
  pushChatMessage('system', tag, msg, tagColor);
}

// 全域掛載
window.renderNineGridMap = renderNineGridMap;
window.travelToTown = travelToTown;
window.renderJianghuScenesOnMenu = renderJianghuScenesOnMenu;
window.openSceneModal = openSceneModal;
window.restAtInn = restAtInn;
window.listenStoryteller = listenStoryteller;
window.openPawnshopModal = openPawnshopModal;
window.renderPawnshopUI = renderPawnshopUI;
window.sellItemToPawn = sellItemToPawn;
window.quickSellJunk = quickSellJunk;
window.startDuelWithEnemy = startDuelWithEnemy;
window.refreshChatForCurrentLocation = refreshChatForCurrentLocation;
window.appendCombatChat = appendCombatChat;