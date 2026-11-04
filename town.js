/**
 * ========================================================
 * 你的江湖 - 入世與城鎮模組 (town.js) [客棧回血修復版]
 * 職責：城鎮按鈕秒開、江湖行腳 (100城)、荒郊切磋、店鋪彈窗、客棧歇息回血
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

    // 1. 永遠存在的江湖行腳按鈕
    const travelBtn = document.createElement('button');
    travelBtn.className = 'wuxia-btn';
    travelBtn.style.borderColor = 'var(--cyan)';
    travelBtn.style.color = '#e8f8f5';
    travelBtn.style.fontWeight = 'bold';
    travelBtn.innerHTML = `🗺️ 江湖行腳`;
    travelBtn.onclick = openTravelModal;
    grid.appendChild(travelBtn);

    // 2. 城中特色場景
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
  recalcPlayerStats();
  refreshChatForCurrentLocation();
  alert(`🚶 你沿著古道翻山越嶺，耗費片刻抵達了【${destKey}】！`);
}

function openSceneModal(sc) {
  const titleEl = document.getElementById('scene-modal-title');
  const descEl = document.getElementById('scene-modal-desc');
  const content = document.getElementById('scene-modal-content');
  if (titleEl) titleEl.innerText = `${getSceneIcon(sc.type)} ${sc.name}`;
  if (descEl) descEl.innerText = sc.desc;
  if (!content) return;
  content.innerHTML = '';

  // 1. 荒郊演武切磋
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
  }
  // 2. 打鐵鋪
  else if (sc.type === 'smithy') {
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
  }
  // 3. 門派大殿
  else if (sc.type === 'sect') {
    if (typeof openSectHallModal === 'function') {
      openSectHallModal(sc.sectName);
    }
    return;
  }
  // 4. 武館
  else if (sc.type === 'kwoon') {
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
  }
  // 5. 客棧 (安歇回血)
  else if (sc.type === 'inn') {
    content.innerHTML = `
      <div class="bag-item-card">
        <div><b>上房安歇一宿</b><br><small style="color:#aaa;">舒舒服服睡上一覺，氣血瞬間完全回滿</small></div>
        <button class="wuxia-btn" style="padding:4px 10px; font-size:12px; color:var(--green); border-color:var(--green);" onclick="restAtInn(5)">5兩 歇息</button>
      </div>
    `;
  }
  // 6. 藥鋪
  else if (sc.type === 'pharmacy') {
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

// 客棧安歇回血功能實裝
function restAtInn(cost) {
  cost = Number(cost) || 5;
  if (player.gold < cost) {
    alert("盤纏不足，無法住店安歇！");
    return;
  }
  player.gold -= cost;
  player.hp = player.maxHp; // 氣血回滿

  if (typeof updateProfileUI === 'function') updateProfileUI();
  if (typeof autoSave === 'function') autoSave();
  closeModal('modal-scene');
  alert("🛏️ 上房安歇，酒暖被軟。通體真氣充沛，氣血已完全恢復圓滿！");
}

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

// 掛載至 window
window.restAtInn = restAtInn;