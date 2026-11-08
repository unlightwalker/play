/**
 * ========================================================
 * 你的江湖 - 入世、全圖與江湖情報站 (town.js) [動態武館與自動置底版]
 * 支援：
 * 1. 演武大武館動態讀取 GLOBAL_SKILLS 中來源為當前城鎮武館之所有武學
 * 2. 對話框發布任何新訊息或切換頻道時，自動滑動至最底端
 * 3. 訊息永久留存，五大頻道獨立開關過濾
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

// ==================== 1. 江湖各城鎮坐標與拓撲 (讀取 data_map.js) ====================
// 九宮格槽位：1=北(上) 7=南(下) 3=西(左) 5=東(右)
function getTownTopology(townName) {
  const town = (typeof WORLD_MAP !== 'undefined') ? WORLD_MAP[townName] : null;
  const ex = (town && town.exits) || {};
  const topo = {};
  if (ex.north && WORLD_MAP[ex.north]) topo[1] = ex.north;
  if (ex.south && WORLD_MAP[ex.south]) topo[7] = ex.south;
  if (ex.west && WORLD_MAP[ex.west]) topo[3] = ex.west;
  if (ex.east && WORLD_MAP[ex.east]) topo[5] = ex.east;
  return topo;
}

function renderNineGridMap() {
  const curName = (typeof player !== 'undefined' && player.curLoc) ? player.curLoc : "牛家村";
  const topo = getTownTopology(curName);

  const curTownData = (typeof WORLD_MAP !== 'undefined') ? WORLD_MAP[curName] : null;
  const coords = (curTownData && curTownData.grid) || [0, 0];
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

  const nb = (town, slot) => town ? getTownTopology(town)[slot] : undefined;
  let nwTown = nb(northTown, 3) || nb(westTown, 1);
  let neTown = nb(northTown, 5) || nb(eastTown, 1);
  let swTown = nb(southTown, 3) || nb(westTown, 7);
  let seTown = nb(southTown, 5) || nb(eastTown, 7);

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
  closePlacePanel();

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

    renderStreetNpcs(cur);
  } catch (err) {
    console.error(err);
  }
}

let currentSceneRef = null;
function refreshCurrentScene() {
  if (currentSceneRef && typeof currentPlacePage !== 'undefined' && currentPlacePage === 'pg-scene') openSceneModal(currentSceneRef);
}

function openSceneModal(sc) {
  currentSceneRef = sc;
  const titleEl = document.getElementById('scene-modal-title');
  const descEl = document.getElementById('scene-modal-desc');
  const content = document.getElementById('scene-modal-content');
  if (titleEl) titleEl.innerText = `${getSceneIcon(sc.type)} ${sc.name}`;
  if (descEl) descEl.innerText = sc.desc;
  if (!content) return;
  content.innerHTML = '';

  const sceneNpcs = getTownNpcs(player.curLoc).filter(n => (n.scene || "") === sc.id);

  if (sc.type === 'field_combat') {
    const foes = sceneNpcs.filter(n => n.attackable);
    const others = sceneNpcs.filter(n => !n.attackable);
    let html = `<div style="font-size:12px; color:#cad3df; margin-bottom:8px;"><b>【演武挑戰】</b> 選擇對手切磋印證武學：</div>`;
    html += foes.length > 0 ? foes.map(renderNpcCardHtml).join('') : `<div style="text-align:center; color:#777; font-size:12px; padding:12px;">此處暫無對手。</div>`;
    html += others.map(renderNpcCardHtml).join('');
    content.innerHTML = html;
    openModal('modal-scene');
    return;
  }

  if (sc.type === 'smithy' || sc.type === 'pharmacy') {
    const goods = Array.isArray(sc.goods) ? sc.goods : [];
    let html = `<div style="font-size:12px; color:#cad3df; margin-bottom:8px;"><b>【${sc.type === 'smithy' ? '鐵匠鍛造臺' : '藥鋪櫃台'}】</b> 購買後存入「行囊」：</div>`;
    goods.forEach(g => {
      const it = (typeof findItemByRef === 'function') ? findItemByRef(g.item) : null;
      if (!it) return;
      const price = Number(g.price) || it.cost || 10;
      const typeLabel = it.type === 'weapon' ? (typeof getWeaponType === 'function' ? getWeaponType(it) : '兵器') : (it.type === 'armor' ? '防具' : '丹藥');
      html += `
        <div class="bag-item-card">
          <div><b class="color-${it.rarity}">${it.name} (${typeLabel})</b><br><small style="color:#aaa;">${it.desc || ''}</small></div>
          <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyGoodsToBag('${it.id}', ${price})">${price}兩</button>
        </div>`;
    });
    if (goods.length === 0) html += `<div style="text-align:center; color:#777; font-size:12px; padding:12px;">今日貨架空空，請改日再來。</div>`;
    html += sceneNpcs.map(renderNpcCardHtml).join('');
    content.innerHTML = html;
    openModal('modal-scene');
    return;
  }

  if (sc.type === 'sect') {
    if (typeof openSectHallModal === 'function') {
      openSectHallModal(sc.sectName);
    }
    return;
  } else if (sc.type === 'kwoon') {
    // ★ 動態檢索全域武學庫中出處包含當前城鎮或武館的武學 ★
    const curTown = player.curLoc || "牛家村";
    const allSkills = (typeof GLOBAL_SKILLS !== 'undefined') ? GLOBAL_SKILLS : [];
    
    // 優先匹配包含當前城鎮名稱的技能，若為牛家村則包含「鄉野演武」或預設武館技
    let availableSkills = allSkills.filter(sk => {
      const src = sk.source || "";
      if (src.includes(curTown)) return true;
      if (curTown === "牛家村" && (src.includes("鄉野") || src.includes("牛家村"))) return true;
      return false;
    });

    // 保底：若當前城鎮無專屬武學，展示預設江湖基礎武學
    if (availableSkills.length === 0) {
      availableSkills = allSkills.filter(sk => sk.rarity === "凡品" || sk.rarity === "良品").slice(0, 4);
    }

    let kwoonHtml = `<div style="font-size:12px; color:#cad3df; margin-bottom:8px;"><b>【武館教頭研習】</b> 習得武學初始為【一重 0% 初學者】：</div>`;

    availableSkills.forEach(sk => {
      const isLearned = (typeof myLearnedKungfu !== 'undefined') && myLearnedKungfu.some(k => k.name === sk.name);
      const costLearn = sk.costLearn !== undefined ? sk.costLearn : (sk.rarity === "凡品" ? 40 : 60);
      const costGold = sk.costGold !== undefined ? sk.costGold : (sk.rarity === "凡品" ? 15 : 25);
      const colorClass = (typeof getRarityColorClass === 'function') ? getRarityColorClass(sk.rarity) : `color-${sk.rarity}`;
      const typeLabel = sk.type === 'external' ? `${sk.weaponReq || '外功'}` : (sk.type === 'internal' ? '心法' : '輕功');

      kwoonHtml += `
        <div class="bag-item-card">
          <div>
            <b class="${colorClass}">${sk.name}</b>
            <span class="rarity-badge rarity-${sk.rarity}">${sk.rarity}</span>
            <small style="color:var(--cyan); margin-left:3px;">[${typeLabel}]</small><br>
            <small style="color:#aaa;">${sk.specialDesc || sk.jinyongDesc || sk.effectDesc || '武館正統傳承'}</small>
          </div>
          <div>
            ${isLearned
              ? `<span style="font-size:11px; color:#2ecc71; font-weight:bold;">已通曉</span>`
              : `<button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="learnKwoonSkill('${sk.name}', ${costLearn}, ${costGold})">${costLearn}學點+${costGold}兩</button>`
            }
          </div>
        </div>
      `;
    });

    content.innerHTML = kwoonHtml + sceneNpcs.map(renderNpcCardHtml).join('');
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
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px; color:var(--gold); border-color:var(--gold);" onclick="openPawnshopModal()">典當行囊</button>
      </div>
    `;
    content.innerHTML += sceneNpcs.map(renderNpcCardHtml).join('');
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

// ==================== 城鎮人物 (NPC) ====================
function getTownNpcs(townName) {
  const town = (typeof WORLD_MAP !== 'undefined') ? WORLD_MAP[townName] : null;
  return (town && Array.isArray(town.npcs)) ? town.npcs : [];
}

function findTownNpc(npcId) {
  return getTownNpcs(player.curLoc).find(n => n.id === npcId) || null;
}

function renderNpcCardHtml(npc) {
  const stat = npc.attackable
    ? `<span style="color:#f1c40f; font-size:11px; margin-left:4px;">【${npc.realm || '江湖人'}】</span><br><small style="color:#aaa;">氣血 ${npc.maxHp} | 外攻 ${npc.atk} | 身法 ${npc.speed}</small>`
    : `<br><small style="color:#aaa;">${npc.desc || '江湖中人'}</small>`;
  const fightBtn = npc.attackable
    ? `<button class="wuxia-btn" style="padding:4px 10px; font-size:12px; color:#e74c3c; border-color:#e74c3c;" onclick="startDuelWithNpc('${npc.id}')">討伐切磋</button>`
    : '';
  return `
    <div class="bag-item-card">
      <div><b style="color:#fff;">👤 ${npc.name}</b>${stat}</div>
      <div style="display:flex; gap:4px;">
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px; color:var(--cyan); border-color:var(--cyan);" onclick="talkToNpc('${npc.id}')">交談</button>
        ${fightBtn}
      </div>
    </div>`;
}

// 入世區：列出站在街頭 (未指定場景) 的人物
function renderStreetNpcs(town) {
  const box = document.getElementById('jh-npc-grid');
  const title = document.getElementById('jh-npc-title');
  if (!box) return;
  const street = (town && Array.isArray(town.npcs)) ? town.npcs.filter(n => !n.scene) : [];
  box.innerHTML = '';
  if (title) title.style.display = street.length > 0 ? 'block' : 'none';
  street.forEach(npc => {
    const btn = document.createElement('button');
    btn.className = 'wuxia-btn';
    btn.innerHTML = `${npc.attackable ? '⚔️' : '👤'} ${npc.name}`;
    btn.onclick = () => openNpcPanel(npc.id);
    box.appendChild(btn);
  });
}

// 點擊人物：以面板暫時覆蓋地圖區（不彈窗）
let currentNpcPanelId = null;

function npcPortraitSvg(npc) {
  const col = npc.attackable ? '#e74c3c' : '#cad3df';
  const weapon = npc.attackable ? `<line x1="68" y1="48" x2="92" y2="26" stroke="#f39c12" stroke-width="4" stroke-linecap="round"/>` : '';
  return `<svg viewBox="0 0 100 120" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round">
    <circle cx="50" cy="22" r="10" fill="${col}"/>
    <line x1="50" y1="32" x2="50" y2="74"/><line x1="50" y1="42" x2="30" y2="62"/><line x1="50" y1="42" x2="68" y2="48"/>${weapon}
    <line x1="50" y1="74" x2="36" y2="112"/><line x1="50" y1="74" x2="64" y2="112"/></svg>`;
}

function openNpcPanel(npcId) {
  const npc = findTownNpc(npcId);
  const panel = document.getElementById('npc-panel');
  if (!npc || !panel) return;
  currentNpcPanelId = npcId;
  showPlacePage('pg-npc');

  const lines = (Array.isArray(npc.dialogues) && npc.dialogues.length > 0) ? npc.dialogues : ['……'];
  const stats = npc.attackable
    ? `<div class="npc-stats"><span>氣血 <b>${npc.maxHp}</b></span><span>外攻 <b>${npc.atk}</b></span><span>防禦 <b>${npc.def}</b></span><span>身法 <b>${npc.speed}</b></span></div>`
    : '';
  panel.className = `npc-panel ${npc.attackable ? 'foe' : ''}`;
  panel.innerHTML = `
    <div class="npc-portrait">${npcPortraitSvg(npc)}<span class="npc-tag">${npc.attackable ? '可討伐' : '江湖人'}</span></div>
    <div class="npc-body">
      <div class="npc-name">${npc.name}${npc.attackable ? `<small>【${npc.realm || '江湖人'}】</small>` : ''}</div>
      ${npc.desc ? `<div class="npc-desc">${npc.desc}</div>` : ''}
      ${stats}
      <div class="npc-bubble" id="npc-bubble">${lines[0]}</div>
      <div class="npc-actions">
        <button class="wuxia-btn" style="color:var(--cyan); border-color:var(--cyan);" onclick="talkToNpc('${npc.id}')">💬 交談</button>
        ${npc.attackable ? `<button class="wuxia-btn" style="color:#e74c3c; border-color:#e74c3c;" onclick="startDuelWithNpc('${npc.id}')">⚔️ 討伐切磋</button>` : ''}
      </div>
    </div>`;
  panel.dataset.lineIdx = '0';
}

function closeNpcPanel() {
  currentNpcPanelId = null;
  closePlacePanel('pg-npc');
}

function talkToNpc(npcId) {
  const npc = findTownNpc(npcId);
  if (!npc) return;
  const lines = (Array.isArray(npc.dialogues) && npc.dialogues.length > 0) ? npc.dialogues : ['……'];
  const panel = document.getElementById('npc-panel');
  const bubble = document.getElementById('npc-bubble');
  let line;
  if (currentNpcPanelId === npcId && panel && bubble) {
    // 面板中依序輪播台詞
    const idx = (Number(panel.dataset.lineIdx) + 1) % lines.length;
    panel.dataset.lineIdx = String(idx);
    line = lines[idx];
    bubble.innerText = line;
  } else {
    line = lines[Math.floor(Math.random() * lines.length)];
  }
  pushChatMessage('current', `[${player.curLoc}] ${npc.name}`, line, '#f1c40f');
}

function startDuelWithNpc(npcId) {
  const npc = findTownNpc(npcId);
  if (!npc || !npc.attackable) return;
  closeModal('modal-scene');
  closePlacePanel();
  startBattleAgainst(buildEnemyFromData(npc), false);
}

function refreshChatForCurrentLocation() {
  if (typeof WORLD_MAP === 'undefined') return;
  const loc = WORLD_MAP[player.curLoc] || WORLD_MAP["牛家村"];
  if (!loc) return;
  const talkers = getTownNpcs(loc.name).filter(n => Array.isArray(n.dialogues) && n.dialogues.length > 0);
  if (talkers.length === 0) return;
  const npc = talkers[Math.floor(Math.random() * talkers.length)];
  pushChatMessage('current', `[${loc.name}] ${npc.name}`, npc.dialogues[Math.floor(Math.random() * npc.dialogues.length)], '#f1c40f');
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
window.startDuelWithNpc = startDuelWithNpc;
window.talkToNpc = talkToNpc;
window.openNpcPanel = openNpcPanel;
window.closeNpcPanel = closeNpcPanel;
window.refreshChatForCurrentLocation = refreshChatForCurrentLocation;
window.appendCombatChat = appendCombatChat;