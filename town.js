/**
 * ========================================================
 * 你的江湖 - 入世與城鎮模組 (town.js) [百寶閣典當與聽書版]
 * 包含：
 * 1. 所在地動態場景渲染（鐵匠坊、武館、客棧、荒郊演武擂台）
 * 2. 百寶閣當鋪（多餘兵刃、護甲、丹藥回收典當成銀兩，一鍵典當凡品）
 * 3. 悅來客棧（安歇回滿氣血、品茗聽說書獲取學點、進入當鋪變現）
 * 4. 江湖行腳古道跨地圖傳送
 * 5. 切磋過招與各地 NPC 金庸筆意閒聊
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

// ==================== 1. 主畫面動態入世場景渲染 ====================
function renderJianghuScenesOnMenu() {
  try {
    let cur = (typeof WORLD_MAP !== 'undefined') ? WORLD_MAP[player.curLoc] : null;
    if (!cur) {
      player.curLoc = "牛家村";
      cur = (typeof WORLD_MAP !== 'undefined') ? WORLD_MAP["牛家村"] : null;
    }
    if (!cur) return;

    const cityEl = document.getElementById('jh-current-city');
    if (cityEl) cityEl.innerText = cur.name;

    const grid = document.getElementById('jh-scenes-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const travelBtn = document.createElement('button');
    travelBtn.className = 'wuxia-btn';
    travelBtn.style.borderColor = 'var(--cyan)';
    travelBtn.style.color = '#e8f8f5';
    travelBtn.style.fontWeight = 'bold';
    travelBtn.innerHTML = `🗺️ 江湖行腳`;
    travelBtn.onclick = openTravelModal;
    grid.appendChild(travelBtn);

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
    console.error("入世選單渲染例外修復:", err);
  }
}

// ==================== 2. 江湖行腳古道路網傳送 ====================
function openTravelModal() {
  const cur = (typeof WORLD_MAP !== 'undefined') ? WORLD_MAP[player.curLoc] : null;
  if (!cur) return;

  const nameEl = document.getElementById('travel-cur-name');
  const descEl = document.getElementById('travel-cur-desc');
  if (nameEl) nameEl.innerText = `📍 當前所在：${cur.name}（${cur.sect}）`;
  if (descEl) descEl.innerText = cur.desc;

  const box = document.getElementById('travel-paths-container');
  if (!box) return;
  box.innerHTML = '';

  cur.paths.forEach(destKey => {
    const dest = WORLD_MAP[destKey];
    if (dest) {
      const btn = document.createElement('button');
      btn.className = 'path-btn';
      btn.innerHTML = `
        <div style="font-weight:bold; color:var(--cyan);">沿官道前往 ➔ ${dest.name}</div>
        <div style="font-size:11px; color:#aaa;">所屬勢力：${dest.sect}</div>
      `;
      btn.onclick = () => travelTo(destKey);
      box.appendChild(btn);
    }
  });

  openModal('modal-travel');
}

function travelTo(destKey) {
  if (typeof WORLD_MAP === 'undefined' || !WORLD_MAP[destKey]) return;
  player.curLoc = destKey;
  closeModal('modal-travel');
  renderJianghuScenesOnMenu();
  if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
  refreshChatForCurrentLocation();
  alert(`🚶 你沿著古道翻山越嶺，耗費片刻抵達了【${destKey}】！`);
}

// ==================== 3. 各城鎮建築功能彈窗 ====================
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
        <div><b>百煉青鋼劍 (劍)</b><br><small style="color:#aaa;">外攻 +18，身法 +6</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyItemToBag('百煉青鋼劍', 60)">60兩</button>
      </div>
      <div class="bag-item-card">
        <div><b>冷月厚背刀 (刀)</b><br><small style="color:#aaa;">外攻 +22，身法 +2</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyItemToBag('冷月厚背刀', 65)">65兩</button>
      </div>
      <div class="bag-item-card">
        <div><b>齊眉熟銅棍 (棍)</b><br><small style="color:#aaa;">外攻 +20，防禦 +8</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyItemToBag('齊眉熟銅棍', 65)">65兩</button>
      </div>
      <div class="bag-item-card">
        <div><b>破甲透骨釘 (暗器)</b><br><small style="color:#aaa;">外攻 +24，身法 +10</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyItemToBag('破甲透骨釘', 75)">75兩</button>
      </div>
      <div class="bag-item-card">
        <div><b>精鋼鎖子甲 (防具)</b><br><small style="color:#aaa;">防禦 +15，氣血 +120</small></div>
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
        <div><b>漫天花雨手法 (暗器・良品)</b><br><small style="color:#aaa;">需配備暗器施展</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="learnKwoonSkill('漫天花雨手法', 60, 25)">60學點+25兩</button>
      </div>
      <div class="bag-item-card">
        <div><b>八卦六合刀 (刀法・良品)</b><br><small style="color:#aaa;">需配備刀類兵刃施展</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="learnKwoonSkill('八卦六合刀', 50, 20)">50學點+20兩</button>
      </div>
      <div class="bag-item-card">
        <div><b>金剛鐵布衫 (心法・良品)</b><br><small style="color:#aaa;">常駐防禦 +12，氣血 +90</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="learnKwoonSkill('金剛鐵布衫', 60, 25)">60學點+25兩</button>
      </div>
    `;
  } else if (sc.type === 'inn') {
    content.innerHTML = `
      <div class="bag-item-card">
        <div><b>上房安歇一宿</b><br><small style="color:#aaa;">舒舒服服睡上一覺，氣血瞬間完全回滿</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px; color:var(--green); border-color:var(--green);" onclick="restAtInn(5)">5兩 歇息</button>
      </div>
      <div class="bag-item-card">
        <div><b>品茗聽說書</b><br><small style="color:#aaa;">聽說書先生演繹江湖掌故秘辛，增長見聞</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px; color:var(--cyan); border-color:var(--cyan);" onclick="listenStoryteller(10)">10兩 品茗</button>
      </div>
      <div class="bag-item-card">
        <div><b>百寶閣收購櫃台</b><br><small style="color:#aaa;">當鋪掌櫃常駐客棧，高價收購各色神兵雜物</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px; color:var(--gold); border-color:var(--gold);" onclick="closeModal('modal-scene'); openPawnshopModal();">典當行囊</button>
      </div>
    `;
  } else if (sc.type === 'pharmacy') {
    content.innerHTML = `
      <div class="bag-item-card">
        <div><b>通脈易筋丸</b><br><small style="color:#aaa;">永久氣血上限 +60、身法 +5</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyPillToBag('通脈易筋丸', 45)">45兩</button>
      </div>
      <div class="bag-item-card">
        <div><b>小金創散</b><br><small style="color:#aaa;">立刻恢復 120 點氣血</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px;" onclick="buyPillToBag('小金創散', 10)">10兩</button>
      </div>
    `;
  }

  openModal('modal-scene');
}

// ==================== 4. 客棧安歇與聽說書 ====================
function restAtInn(cost) {
  cost = Number(cost) || 5;
  if (player.gold < cost) {
    alert("盤纏不足，無法住店安歇！");
    return;
  }
  player.gold -= cost;
  player.hp = player.maxHp;

  if (typeof updateProfileUI === 'function') updateProfileUI();
  if (typeof autoSave === 'function') autoSave();
  closeModal('modal-scene');
  alert("🛏️ 上房安歇，酒暖被軟。通體真氣充沛，氣血已完全恢復圓滿！");
}

function listenStoryteller(cost) {
  cost = Number(cost) || 10;
  if (player.gold < cost) {
    alert("碎銀不足，難以點上一壺好茶聽書！");
    return;
  }
  player.gold -= cost;
  player.learn += 30;

  if (typeof updateProfileUI === 'function') updateProfileUI();
  if (typeof autoSave === 'function') autoSave();
  alert("☕ 一盞清茗，半晌評書！聽聞前代宗師掌故秘辛，茅塞頓開，學點 +30！");
}

// ==================== 5. 百寶閣當鋪（多餘行囊典當換銀兩） ====================
const ITEM_PAWN_VALUES = {
  "凡品": 8,
  "良品": 30,
  "上品": 90,
  "絕品": 180,
  "神品": 350
};

function getItemPawnPrice(item) {
  if (!item) return 2;
  if (item.cost) return Math.max(2, Math.floor(item.cost * 0.5));
  return ITEM_PAWN_VALUES[item.rarity] || 10;
}

function openPawnshopModal() {
  renderPawnshopUI();
  openModal('modal-pawnshop');
}

function renderPawnshopUI() {
  const goldDisp = document.getElementById('pawn-gold-disp');
  if (goldDisp) goldDisp.innerText = `${player.gold}兩`;

  const box = document.getElementById('pawn-item-list');
  if (!box) return;
  box.innerHTML = '';

  if (!player.inventory || player.inventory.length === 0) {
    box.innerHTML = `<div style="text-align:center; color:#888; font-size:12px; padding:25px;">隨身行囊空空如也，無可典當之物。</div>`;
    return;
  }

  player.inventory.forEach((item, idx) => {
    const price = getItemPawnPrice(item);
    const card = document.createElement('div');
    card.className = 'bag-item-card';

    const countBadge = item.count ? `<span style="color:var(--gold); font-size:11px;">x${item.count}</span>` : '';
    const typeLabel = (item.type === 'weapon') 
      ? `[${(typeof getWeaponType === 'function') ? getWeaponType(item) : '兵器'}]` 
      : (item.type === 'armor' ? '[防具]' : '[丹藥]');

    card.innerHTML = `
      <div>
        <b style="color:#fff; font-size:13px;">${item.name}</b>
        <span class="rarity-badge rarity-${item.rarity}">${item.rarity}</span>
        <small style="color:var(--cyan); margin-left:3px;">${typeLabel}</small>
        ${countBadge}
        <div style="font-size:11px; color:#8ca0b3; margin-top:2px;">
          ${item.desc || '江湖尋常物事'}
        </div>
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
    if (!confirm(`【百寶閣提醒】${item.name} 乃當世罕見的【${item.rarity}】，確定要以 ${price} 兩銀子典當換取嗎？`)) {
      return;
    }
  }

  player.gold += price;

  if (item.count && item.count > 1) {
    item.count -= 1;
  } else {
    player.inventory.splice(idx, 1);
  }

  if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
  renderPawnshopUI();
  if (typeof renderBagUI === 'function') renderBagUI();
}

function quickSellJunk() {
  if (!player.inventory || player.inventory.length === 0) {
    alert("行囊中並無任何物品！");
    return;
  }

  const junkItems = player.inventory.filter(i => i.rarity === "凡品");
  if (junkItems.length === 0) {
    alert("行囊中沒有【凡品】雜物可快速典當！");
    return;
  }

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
  alert(`🏮 掌櫃清點完畢！一鍵典當凡品雜物，共收入碎銀 +${totalGain} 兩！`);
}

// ==================== 6. 切磋與場景對話 ====================
function startDuelWithEnemy(idx) {
  closeModal('modal-scene');
  const enemies = (WORLD_MAP[player.curLoc] && WORLD_MAP[player.curLoc].fieldEnemies) ? WORLD_MAP[player.curLoc].fieldEnemies : [];
  if (enemies && enemies[idx] && typeof startBattleAgainst === 'function') {
    startBattleAgainst(enemies[idx]);
  }
}

function refreshChatForCurrentLocation() {
  const box = document.getElementById('chat-list');
  if (!box || typeof WORLD_MAP === 'undefined') return;
  box.innerHTML = '';
  const loc = WORLD_MAP[player.curLoc] || WORLD_MAP["牛家村"];
  if (!loc || !loc.npcs) return;
  loc.npcs.forEach(npc => {
    const d = document.createElement('div');
    d.innerHTML = `<span class="chat-tag">[${loc.name}]</span> <span class="chat-user">${npc.u}:</span> <span>${npc.critic}</span>`;
    box.appendChild(d);
  });
}

function outputBattleNarrativeAndComment(skillName, evalText, jinyongProse) {
  const loc = (typeof WORLD_MAP !== 'undefined') ? (WORLD_MAP[player.curLoc] || WORLD_MAP["牛家村"]) : null;
  if (!loc || !loc.npcs) return;
  const randNpc = loc.npcs[Math.floor(Math.random() * loc.npcs.length)];
  appendCombatChat("【金庸筆意】", `少俠催動【${skillName}】（造詣：${evalText}），${jinyongProse}`, "#5dade2");
  setTimeout(() => {
    appendCombatChat(`[${loc.name}] ${randNpc.u}`, randNpc.critic, "#f1c40f");
  }, 180);
}

function appendCombatChat(tag, msg, tagColor) {
  const box = document.getElementById('chat-list');
  if (!box) return;
  const d = document.createElement('div');
  d.innerHTML = `<span style="color:${tagColor}; font-weight:bold;">${tag}:</span> <span class="jinyong-narrative">${msg}</span>`;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function addChatMsg(user, msg) {
  appendCombatChat(`[${user}]`, msg, "#2ecc71");
}

// 掛載至全域
window.renderJianghuScenesOnMenu = renderJianghuScenesOnMenu;
window.openTravelModal = openTravelModal;
window.travelTo = travelTo;
window.openSceneModal = openSceneModal;
window.restAtInn = restAtInn;
window.listenStoryteller = listenStoryteller;
window.openPawnshopModal = openPawnshopModal;
window.renderPawnshopUI = renderPawnshopUI;
window.sellItemToPawn = sellItemToPawn;
window.quickSellJunk = quickSellJunk;
window.startDuelWithEnemy = startDuelWithEnemy;
window.refreshChatForCurrentLocation = refreshChatForCurrentLocation;
window.outputBattleNarrativeAndComment = outputBattleNarrativeAndComment;
window.appendCombatChat = appendCombatChat;
window.addChatMsg = addChatMsg;