/**
 * ========================================================
 * 你的江湖 - 角色養成模組 (character.js) [完整無缺版]
 * 支援：
 * 1. 內嵌式武學參悟面板（基礎欄置頂，地圖入世隱去，保留對話框）
 * 2. 突破資訊改由對話框以橙色文字即時發布
 * 3. 卸除後自動動態呈現「基礎xx法」，並具備 100% 契合度
 * 4. 六維透視、頭像更換、天賦檢視、行囊管理、轉世輪迴
 * ========================================================
 */

// 取得稀有度對應文字色彩 Class
function getRarityColorClass(rarity) {
  if (!rarity) return "color-凡品";
  return `color-${rarity}`;
}

// 動態推導未佩戴時的基礎自悟武學名稱
function getBasicSkillName(slotKey) {
  if (slotKey === 'internal') return '基礎心法';
  if (slotKey === 'qinggong') return '基礎輕功';
  const curW = (typeof player !== 'undefined' && player.equippedGear) ? player.equippedGear.weapon : null;
  const wType = (typeof getWeaponType === 'function') ? getWeaponType(curW) : "拳";
  if (wType === "暗器") return "基礎暗器手法";
  return `基礎${wType}法`;
}

// ==================== 1. 8 款武俠風格手繪向量頭像 ====================
var WUXIA_AVATARS = [
  { id: 0, title: "斗笠劍客", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1e272e"/><path d="M15,45 Q50,15 85,45 Z" fill="#b8860b"/><path d="M30,45 Q50,75 70,45" fill="#f5cd79"/><rect x="44" y="52" width="12" height="3" fill="#333"/><line x1="20" y1="46" x2="80" y2="46" stroke="#d4a373" stroke-width="2"/><path d="M25,85 Q50,60 75,85" fill="#2980b9"/></svg>` },
  { id: 1, title: "白衣女俠", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="46" r="46" fill="#2c3e50"/><circle cx="50" cy="45" r="20" fill="#f8c291"/><path d="M28,42 Q50,18 72,42 Q65,65 50,62 Q35,65 28,42 Z" fill="#1e272e"/><circle cx="43" cy="45" r="2.5" fill="#2f3542"/><circle cx="57" cy="45" r="2.5" fill="#2f3542"/><path d="M47,54 Q50,56 53,54" stroke="#e84118" stroke-width="1.5" fill="none"/><line x1="30" y1="26" x2="70" y2="24" stroke="#f1c40f" stroke-width="2.5"/><path d="M25,90 Q50,65 75,90" fill="#ecf0f1"/></svg>` },
  { id: 2, title: "唐門暗客", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#130f40"/><circle cx="50" cy="46" r="20" fill="#f5cd79"/><path d="M30,46 Q50,65 70,46 L70,68 Q50,85 30,68 Z" fill="#301934"/><circle cx="42" cy="42" r="2.5" fill="#be2edd"/><circle cx="58" cy="42" r="2.5" fill="#be2edd"/><path d="M22,35 Q50,15 78,35 L74,22 Q50,8 26,22 Z" fill="#4834d4"/><path d="M20,92 Q50,68 80,92" fill="#574b90"/></svg>` },
  { id: 3, title: "少林武僧", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#2d3436"/><circle cx="50" cy="46" r="22" fill="#eccc68"/><circle cx="42" cy="43" r="2.5" fill="#222"/><circle cx="58" cy="43" r="2.5" fill="#222"/><circle cx="45" cy="30" r="1.5" fill="#fff"/><circle cx="50" cy="30" r="1.5" fill="#fff"/><circle cx="55" cy="30" r="1.5" fill="#fff"/><circle cx="45" cy="35" r="1.5" fill="#fff"/><circle cx="50" cy="35" r="1.5" fill="#fff"/><circle cx="55" cy="35" r="1.5" fill="#fff"/><path d="M22,90 Q50,68 78,90" fill="#e17055"/></svg>` },
  { id: 4, title: "武當道尊", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1b2a47"/><circle cx="50" cy="48" r="20" fill="#f8c291"/><circle cx="50" cy="22" r="8" fill="#111"/><line x1="40" y1="22" x2="60" y2="22" stroke="#d4a373" stroke-width="2.5"/><path d="M25,92 Q50,68 75,92" fill="#2980b9"/><circle cx="44" cy="45" r="2" fill="#222"/><circle cx="56" cy="45" r="2.5" fill="#222"/></svg>` },
  { id: 5, title: "紅衣魔煞", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#2c1a1d"/><circle cx="50" cy="46" r="20" fill="#fad390"/><path d="M24,42 Q50,15 76,42 Q70,70 50,65 Q30,70 24,42 Z" fill="#2c2c54"/><path d="M46,55 Q50,57 54,55" stroke="#e74c3c" stroke-width="2" fill="none"/><circle cx="43" cy="44" r="2.5" fill="#c0392b"/><circle cx="57" cy="44" r="2.5" fill="#c0392b"/><path d="M22,92 Q50,68 78,92" fill="#b71540"/></svg>` },
  { id: 6, title: "金刀豪俠", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#2c3a29"/><circle cx="50" cy="48" r="20" fill="#e0a96d"/><path d="M30,35 L70,35 L68,26 L32,26 Z" fill="#f1c40f"/><path d="M36,58 Q50,70 64,58 Z" fill="#333"/><circle cx="42" cy="45" r="2.5" fill="#222"/><circle cx="58" cy="45" r="2.5" fill="#222"/><path d="M22,92 Q50,70 78,92" fill="#7f8c8d"/></svg>` },
  { id: 7, title: "丐幫義士", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#3d2c1d"/><circle cx="50" cy="48" r="21" fill="#d4a373"/><path d="M26,38 Q50,15 74,38 L72,32 L28,32 Z" fill="#574b90"/><circle cx="43" cy="46" r="2.5" fill="#111"/><circle cx="57" cy="46" r="2.5" fill="#111"/><path d="M46,56 Q50,58 54,56" stroke="#222" stroke-width="1.5" fill="none"/><path d="M22,92 Q50,66 78,92" fill="#556b2f"/></svg>` }
];
window.WUXIA_AVATARS = WUXIA_AVATARS;

// ==================== 2. 身體素質透視面板與天賦檢視 ====================
function openHeroProfileModal() {
  const gBox = document.getElementById('avatar-gallery-box');
  if (gBox) {
    gBox.innerHTML = '';
    WUXIA_AVATARS.forEach(av => {
      const d = document.createElement('div');
      d.className = `avatar-option ${player.avatarId === av.id ? 'active' : ''}`;
      d.innerHTML = `
        <div style="width:40px; height:40px; display:flex; justify-content:center; align-items:center;">
          ${av.svg}
        </div>
        <div class="avatar-title">${av.title}</div>
      `;
      d.onclick = () => selectAvatar(av.id);
      gBox.appendChild(d);
    });
  }

  ['arm', 'speed', 'bone', 'inner', 'int', 'luck'].forEach(k => {
    const valEl = document.getElementById(`st-${k}`);
    const srcEl = document.getElementById(`st-${k}-source`);
    const src = (player.statSources && player.statSources[k]) ? player.statSources[k] : {
      innate: player.stats[k], kf: 0, enc: 0, gear: 0, talent: 0, total: player.stats[k]
    };

    if (valEl) valEl.innerText = src.total;
    if (srcEl) {
      srcEl.innerText = `[先天${src.innate} + 功法${src.kf} + 奇遇${src.enc} + 裝備${src.gear}${src.talent ? ' + 天賦' + src.talent : ''}]`;
    }
  });

  const cBox = document.getElementById('hero-craft-display');
  if (cBox && window.Crafting) cBox.innerHTML = Crafting.summaryHtml();
  const tBox = document.getElementById('hero-talents-display');
  const tCount = document.getElementById('hero-talent-count');
  const talents = (Array.isArray(player.talents)) ? player.talents : [];

  if (tCount) tCount.innerText = `(${talents.length} 個)`;
  if (tBox) {
    tBox.innerHTML = '';
    if (talents.length === 0) {
      tBox.innerHTML = `
        <div style="background:#131720; border:1px dashed #354052; border-radius:4px; padding:10px; text-align:center; color:#8ca0b3; font-size:11.5px;">
          此生尚未覺醒任何宿命天賦。<br><small style="color:#666;">（轉世輪迴或天命顯聖後可獲得）</small>
        </div>
      `;
    } else {
      talents.forEach(t => {
        const card = document.createElement('div');
        let borderColor = '#95a5a6';
        if (t.rarity === '神品') borderColor = 'var(--gold)';
        else if (t.rarity === '絕品') borderColor = 'var(--purple)';
        else if (t.rarity === '上品') borderColor = 'var(--cyan)';
        else if (t.rarity === '良品') borderColor = 'var(--green)';

        card.style.cssText = `background:#141822; border:1px solid #334155; border-left:3.5px solid ${borderColor}; border-radius:4px; padding:6px 10px; margin-bottom:5px; cursor:pointer;`;
        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <b class="${getRarityColorClass(t.rarity)}" style="font-size:12px;">${t.name}</b>
            <span class="rarity-badge rarity-${t.rarity}" style="font-size:9.5px; padding:0 3px;">${t.rarity}</span>
          </div>
          <div style="font-size:11px; color:#cbd5e1; margin-top:2px;">${t.desc}</div>
        `;
        card.onclick = () => {
          gameNotify(`【天賦・${t.name}】（${t.rarity}）\n${t.desc}`);
        };
        tBox.appendChild(card);
      });
    }
  }

  const reinBtn = document.getElementById('btn-reincarnate-trigger');
  if (reinBtn) {
    if ((player.towerFloor || 1) <= 50) {
      reinBtn.style.opacity = "0.5";
      reinBtn.innerHTML = `🔒 破虛輪迴 (需通關通天塔第50層，當前第${player.towerFloor || 1}層)`;
    } else {
      reinBtn.style.opacity = "1";
      reinBtn.innerHTML = `🔮 破虛輪迴・轉世重修 (當前：第 ${player.reincarnations + 1} 世)`;
    }
  }

  openModal('modal-hero-profile');
}

function showStatDetail(statKey) {
  const names = {
    arm: "臂力 (剛猛 / 外攻輸出 / 破除格擋)",
    speed: "身法 (敏捷 / 攻擊命中 / 閃避躲閃)",
    bone: "根骨 (體質 / 氣血上限 / 硬功招架)",
    inner: "內功 (真氣 / 護體罡氣 / 內力上限)",
    int: "悟性 (智慧 / 參悟修為節省)",
    luck: "福緣 (機緣 / 會心暴擊率)"
  };
  const src = (player.statSources && player.statSources[statKey]) ? player.statSources[statKey] : {
    innate: player.stats[statKey], kf: 0, enc: 0, gear: 0, talent: 0, total: player.stats[statKey]
  };

  gameNotify(`【${names[statKey]} 來源詳情】\n` +
        `------------------------------------\n` +
        `• 先天根基：${src.innate}\n` +
        `• 功法加成：${src.kf}\n` +
        `• 奇遇靈藥：${src.enc}\n` +
        `• 裝備加持：${src.gear}\n` +
        `• 宿命天賦：${src.talent || 0}\n` +
        `------------------------------------\n` +
        `合計總值：${src.total} 點`);
}

function selectAvatar(id) {
  player.avatarId = id;
  if (typeof updateProfileUI === 'function') updateProfileUI();
  if (typeof autoSave === 'function') autoSave();
  openHeroProfileModal();
}

// ==================== 3. 武學內嵌視圖（不再彈窗，基礎置頂，隱去地圖入世） ====================
let isKungfuInlineOpen = false;
var currentKungfuFilter = "全部";

function toggleKungfuInlineView() {
  isKungfuInlineOpen = !isKungfuInlineOpen;
  const secMap = document.getElementById('sec-map');
  const secScenes = document.getElementById('sec-scenes');
  const secKungfu = document.getElementById('sec-kungfu');
  const hintEl = document.getElementById('basic-mode-hint');
  const kfBtn = document.getElementById('btn-kungfu-toggle');

  if (isKungfuInlineOpen) {
    if (typeof closePlacePanel === 'function') closePlacePanel();
    if (secMap) secMap.style.display = 'none';
    if (secScenes) secScenes.style.display = 'none';
    if (secKungfu) secKungfu.style.display = 'block';
    if (hintEl) hintEl.style.display = 'inline-block';
    if (kfBtn) {
      kfBtn.style.background = '#2980b9';
      kfBtn.style.borderColor = 'var(--cyan)';
      kfBtn.innerText = '武學 ✔';
    }
    renderKungfuSlots();
    renderLearnedKungfuList();
    const expEl = document.getElementById('kf-cur-exp');
    if (expEl) expEl.innerText = player.exp;
  } else {
    switchToNormalMode();
  }
}

function switchToNormalMode() {
  isKungfuInlineOpen = false;
  const secMap = document.getElementById('sec-map');
  const secScenes = document.getElementById('sec-scenes');
  const secKungfu = document.getElementById('sec-kungfu');
  const hintEl = document.getElementById('basic-mode-hint');
  const kfBtn = document.getElementById('btn-kungfu-toggle');

  // 地點面板開啟中時維持覆蓋地圖
  const placeOpen = (typeof currentPlacePage !== 'undefined' && currentPlacePage);
  if (secMap) secMap.style.display = placeOpen ? 'none' : 'block';
  if (secScenes) secScenes.style.display = 'block';
  if (secKungfu) secKungfu.style.display = 'none';
  if (hintEl) hintEl.style.display = 'none';
  if (kfBtn) {
    kfBtn.style.background = '';
    kfBtn.style.borderColor = '#9b59b6';
    kfBtn.innerText = '武學';
  }
}

function setKungfuFilter(filterType, btnEl) {
  currentKungfuFilter = filterType;
  document.querySelectorAll('.kf-filter-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderLearnedKungfuList();
}

function renderKungfuSlots() {
  renderSingleSlot('internal', 'slot-name-internal', 'slot-card-internal');
  renderSingleSlot('qinggong', 'slot-name-qinggong', 'slot-card-qinggong');
  renderSingleSlot('ext0', 'slot-name-ext0', 'slot-card-ext0');
  renderSingleSlot('ext1', 'slot-name-ext1', 'slot-card-ext1');
}

function renderSingleSlot(slotKey, textId, cardId) {
  const kf = equippedSlots[slotKey];
  const card = document.getElementById(cardId);
  const text = document.getElementById(textId);
  if (!card || !text) return;
  card.classList.remove('mismatched');

  const unequipBtn = card.querySelector('.slot-btn-unequip');

  if (kf) {
    card.classList.add('filled');
    if (unequipBtn) unequipBtn.style.display = 'inline-block';

    const evalText = (typeof getKungfuEval === 'function') ? getKungfuEval(kf.tier, kf.progress) : `${kf.tier}重`;
    const req = (typeof getSkillWeaponReq === 'function') ? getSkillWeaponReq(kf) : "任意";
    const colorClass = getRarityColorClass(kf.rarity);

    let matchBadge = "";
    if (kf.type === 'external') {
      const isMatch = (typeof isSkillCompatibleWithWeapon === 'function') 
        ? isSkillCompatibleWithWeapon(kf, player.equippedGear ? player.equippedGear.weapon : null) 
        : true;

      if (isMatch) {
        matchBadge = `<span style="color:#2ecc71; font-size:10px; margin-left:3px;">[✔ 契合:${req}]</span>`;
      } else {
        card.classList.add('mismatched');
        matchBadge = `<span style="color:#e74c3c; font-size:10px; margin-left:3px; font-weight:bold;">[⚠️ 兵刃未符:普攻]</span>`;
      }
    }

    text.innerHTML = `
      <span class="rarity-badge rarity-${kf.rarity}">${kf.rarity}</span>
      <span class="${colorClass}">${kf.name}</span> <small style="color:#f1c40f;">(${kf.tier}重・${evalText})</small>
      ${matchBadge}
    `;
  } else {
    card.classList.remove('filled');
    if (unequipBtn) unequipBtn.style.display = 'none';

    const basicName = getBasicSkillName(slotKey);
    const subDesc = (slotKey === 'internal') ? '[自悟導引吐納]' : (slotKey === 'qinggong' ? '[自悟身法步法]' : '[自悟平實招式]');

    text.innerHTML = `
      <span class="rarity-badge rarity-凡品">凡品</span>
      <span class="color-凡品" style="font-weight:bold;">${basicName}</span>
      <small style="color:#8ca0b3; font-size:11px; margin-left:2px;">${subDesc}</small>
    `;
  }
}

function renderLearnedKungfuList() {
  const box = document.getElementById('learned-kungfu-list');
  if (!box) return;
  box.innerHTML = '';

  const curW = player.equippedGear ? player.equippedGear.weapon : null;

  const filteredList = myLearnedKungfu.filter(kf => {
    if (currentKungfuFilter === "全部") return true;
    if (currentKungfuFilter === "心法") return kf.type === "internal";
    if (currentKungfuFilter === "輕功") return kf.type === "qinggong";
    if (kf.type === "external") {
      const req = (typeof getSkillWeaponReq === 'function') ? getSkillWeaponReq(kf) : "任意";
      return req === currentKungfuFilter;
    }
    return false;
  });

  if (filteredList.length === 0) {
    box.innerHTML = `<div style="text-align:center; color:#666; font-size:12px; padding:20px;">當前分類下無習得之武學。可翻閱行囊秘笈或向門派武館請教！</div>`;
    return;
  }

  filteredList.forEach(kf => {
    const isEquipped = (
      equippedSlots.internal === kf ||
      equippedSlots.qinggong === kf ||
      equippedSlots.ext0 === kf ||
      equippedSlots.ext1 === kf
    );
    const evalText = (typeof getKungfuEval === 'function') ? getKungfuEval(kf.tier, kf.progress) : `${kf.tier}重`;
    const isMastered = (kf.tier >= 10 && kf.progress >= 100);
    const rawCost = (typeof getUpgradeExpCost === 'function') ? getUpgradeExpCost(kf.rarity, kf.tier) : 75;
    
    let costExp = Math.max(10, Math.floor(rawCost * (1 - (player.stats.int * 0.005))));
    if (kf.type === 'internal' && player.talents && player.talents.some(t => t.kfCostDec)) {
      costExp = Math.floor(costExp * 0.7);
    }
    if (player.talents && player.talents.some(t => t.doubleKfCost)) {
      costExp = costExp * 2;
    }

    const reqW = (typeof getSkillWeaponReq === 'function') ? getSkillWeaponReq(kf) : "任意";
    const colorClass = getRarityColorClass(kf.rarity);

    // 六維加成：與實際結算 (main.js getKungfuInterpolatedStat) 完全一致
    const statNames = { arm: "臂力", speed: "身法", bone: "根骨", inner: "內功", int: "悟性", luck: "福緣" };
    const statText = Object.keys(statNames)
      .map(k => ({ k, v: getKungfuInterpolatedStat(kf, k) }))
      .filter(s => s.v !== 0)
      .map(s => `${statNames[s.k]}${s.v > 0 ? '+' : ''}${s.v}`)
      .join(' ');

    const tierMult = getKungfuTierMult(kf);
    let detailStats = "";
    if (kf.type === 'external') {
      const curMult = ((Number(kf.baseMult) || 1.3) * tierMult).toFixed(2);
      const isMatch = (typeof isSkillCompatibleWithWeapon === 'function') ? isSkillCompatibleWithWeapon(kf, curW) : true;
      detailStats = `威力：<b style="color:var(--cyan);">${curMult}x</b> | 兵刃: <b>${reqW}</b> ${isMatch ? '<span style="color:#2ecc71;">(契合)</span>' : '<span style="color:#e74c3c;">(未符)</span>'}`;
    } else if (kf.type === 'internal') {
      detailStats = `氣血+${Math.floor(getKungfuBaseValue(kf, 'hp') * tierMult)} 防禦+${Math.floor(getKungfuBaseValue(kf, 'def') * tierMult)}`;
    } else if (kf.type === 'qinggong') {
      detailStats = `身法+${Math.floor(getKungfuBaseValue(kf, 'speed') * tierMult)}`;
    }

    const jumpProgressVal = (player.talents && player.talents.some(t => t.kfJumpProgress)) ? 50 : 25;

    const card = document.createElement('div');
    card.className = `kungfu-master-card ${kf.rarity}`;
    card.innerHTML = `
      <div class="kf-header">
        <div>
          <b class="${colorClass}" style="font-size:13.5px;">${kf.name}</b>
          <span class="rarity-badge rarity-${kf.rarity}">${kf.rarity}</span>
          <span style="font-size:11px; color:#8ca0b3; margin-left:4px;">[${kf.type === 'external' ? '外功' : (kf.type === 'internal' ? '心法' : '輕功')}]</span>
        </div>
        <span class="eval-badge ${isMastered ? 'eval-大圓滿' : ''}">${isMastered ? '★ 大圓滿 ★' : `【${evalText}】`}</span>
      </div>

      <div style="font-size:11.5px; color:#cfd9e6; margin-top:3px;">
        造詣：<b>第 ${kf.tier} 重</b> (${kf.progress}%)
        <span style="margin-left:6px; color:#f1c40f;">${statText ? `[${statText}]` : ''}</span>
        <span style="margin-left:6px; color:#aaa;">${detailStats}</span>
      </div>

      <div class="kf-tier-bar">
        <div class="kf-tier-fill" style="width: ${isMastered ? 100 : kf.progress}%;"></div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
        <div>${getEquipButtons(kf, isEquipped)}</div>
        <div>
          <button class="wuxia-btn" style="padding:3px 8px; font-size:11.5px; border-color:var(--gold); color:var(--gold);" 
            onclick="upgradeKungfu('${kf.id}')" ${isMastered ? 'disabled style="opacity:0.5;"' : ''}>
            ${isMastered ? '已至大圓滿' : `參悟 (+${jumpProgressVal}% 耗${costExp}修為)`}
          </button>
        </div>
      </div>
    `;
    box.appendChild(card);
  });
}

function unequipSlot(slotKey) {
  if (!equippedSlots[slotKey]) return;
  const oldName = equippedSlots[slotKey].name;
  equippedSlots[slotKey] = null;
  recalcPlayerStats();
  renderKungfuSlots();
  renderLearnedKungfuList();

  const basicName = getBasicSkillName(slotKey);
  if (typeof pushChatMessage === 'function') {
    pushChatMessage('system', '【功法歸元】', `卸下【${oldName}】，身歸自然，該槽位轉化為【${basicName}】！`, '#ff9f43');
  }
}

function equipKungfu(id, targetSlot) {
  const kf = myLearnedKungfu.find(k => k.id === id);
  if (!kf) return;

  if (kf.type === 'internal') {
    equippedSlots.internal = kf;
  } else if (kf.type === 'qinggong') {
    equippedSlots.qinggong = kf;
  } else if (kf.type === 'external') {
    if (targetSlot === 0) {
      if (equippedSlots.ext1 === kf) equippedSlots.ext1 = null;
      equippedSlots.ext0 = kf;
    } else {
      if (equippedSlots.ext0 === kf) equippedSlots.ext0 = null;
      equippedSlots.ext1 = kf;
    }
  }

  recalcPlayerStats();
  renderKungfuSlots();
  renderLearnedKungfuList();
}

function getEquipButtons(kf, isEquipped) {
  if (isEquipped) return `<span style="font-size:11px; color:#2ecc71; font-weight:bold;">✔ 已配戴</span>`;
  if (kf.type === 'internal') return `<button class="wuxia-btn" style="padding:3px 8px; font-size:11px;" onclick="equipKungfu('${kf.id}')">佩戴心法</button>`;
  if (kf.type === 'qinggong') return `<button class="wuxia-btn" style="padding:3px 8px; font-size:11px;" onclick="equipKungfu('${kf.id}')">佩戴輕功</button>`;
  if (kf.type === 'external') {
    return `
      <button class="wuxia-btn" style="padding:3px 6px; font-size:11px;" onclick="equipKungfu('${kf.id}', 0)">招式壹</button>
      <button class="wuxia-btn" style="padding:3px 6px; font-size:11px; margin-left:3px;" onclick="equipKungfu('${kf.id}', 1)">招式貳</button>
    `;
  }
  return '';
}

function upgradeKungfu(id) {
  const kf = myLearnedKungfu.find(k => k.id === id);
  if (!kf) return;
  if (kf.tier >= 10 && kf.progress >= 100) return;

  const rawCost = (typeof getUpgradeExpCost === 'function') ? getUpgradeExpCost(kf.rarity, kf.tier) : 75;
  let cost = Math.max(10, Math.floor(rawCost * (1 - (player.stats.int * 0.005))));

  if (kf.type === 'internal' && player.talents && player.talents.some(t => t.kfCostDec)) {
    cost = Math.floor(cost * 0.7);
  }
  if (player.talents && player.talents.some(t => t.doubleKfCost)) {
    cost = cost * 2;
  }

  if (player.exp < cost) {
    if (typeof pushChatMessage === 'function') {
      pushChatMessage('system', '【修為不足】', `【${kf.name}】突破需耗費 ${cost} 點修為！請打坐調息或通天歷練累積！`, '#e74c3c');
    }
    return;
  }

  player.exp -= cost;

  let jumpProgress = 25;
  if (player.talents && player.talents.some(t => t.kfJumpProgress)) {
    jumpProgress = 50;
  }

  kf.progress += jumpProgress;

  if (kf.progress >= 100) {
    if (kf.tier < 10) {
      kf.tier += 1;
      kf.progress = 0;
      if (typeof pushChatMessage === 'function') {
        pushChatMessage(
          'system', 
          '【武學突破】', 
          `⚡ 功力大進！少俠參悟有得，【${kf.name}】突破桎梏晉升至【第 ${kf.tier} 重】！六維大幅躍進！`, 
          '#ff9f43'
        );
      }
    } else {
      kf.progress = 100;
      if (typeof pushChatMessage === 'function') {
        pushChatMessage(
          'system', 
          '【十重大圓滿】', 
          `🎉 震爍古今！【${kf.name}】歷經苦修，達到【十重大圓滿】之無上化境！六維全面昇華！`, 
          '#ff793f'
        );
      }
    }
  }

  recalcPlayerStats();
  const expEl = document.getElementById('kf-cur-exp');
  if (expEl) expEl.innerText = player.exp;
  renderKungfuSlots();
  renderLearnedKungfuList();
}

function learnKwoonSkill(name, costLearn, costGold) {
  if (player.learn < costLearn || player.gold < costGold) {
    gameNotify("學點或銀兩不足！");
    return;
  }
  const sk = (typeof GLOBAL_SKILLS !== 'undefined') ? GLOBAL_SKILLS.find(s => s.name === name) : null;
  if (!sk) { gameNotify("武館查無此門武學！"); return; }

  if (myLearnedKungfu.some(k => k.name === name)) {
    gameNotify("你早已領會此門武學！");
    return;
  }

  player.learn -= costLearn;
  player.gold -= costGold;
  myLearnedKungfu.push(createLearnedKungfu(sk));

  recalcPlayerStats();
  if (typeof refreshCurrentScene === 'function') refreshCurrentScene();
  if (typeof pushChatMessage === 'function') {
    pushChatMessage('system', '【武館研習】', `參悟成功！你習得了【${name}】！初始為【初學者（一重 0%）】，請至「武學」配戴！`, '#ff9f43');
  }
}

function studyKungfuBook(itemIdx) {
  const item = player.inventory[itemIdx];
  if (!item || item.type !== 'book' || !item.skillData) return;

  const sk = item.skillData;
  if (myLearnedKungfu.some(k => k.name === sk.name)) {
    gameNotify(`少俠早已通曉【${sk.name}】，無需重複研讀！`);
    return;
  }

  const reqLearn = item.costLearn || 40;
  if (player.learn < reqLearn) {
    gameNotify(`悟性學點不足！研讀《${item.name}》需體悟耗費 ${reqLearn} 點學點！`);
    return;
  }

  player.learn -= reqLearn;
  myLearnedKungfu.push(createLearnedKungfu(sk));

  player.inventory.splice(itemIdx, 1);
  recalcPlayerStats();
  renderBagUI();
  if (typeof pushChatMessage === 'function') {
    pushChatMessage('system', '【秘笈研讀】', `挑燈夜讀！你參透了《${item.name}》精妙奧義，正式習得【${sk.name}】！`, '#ff9f43');
  }
}

// ==================== 4. 行囊管理與更換兵刃連動 ====================
function openBagModal() { renderBagUI(); openModal('modal-bag'); }

function renderBagUI() {
  const w = player.equippedGear ? player.equippedGear.weapon : null;
  const a = player.equippedGear ? player.equippedGear.armor : null;

  const wNameEl = document.getElementById('bag-cur-weapon-name');
  const aNameEl = document.getElementById('bag-cur-armor-name');
  
  if (wNameEl) {
    if (w) {
      wNameEl.innerHTML = `<span class="${getRarityColorClass(w.rarity)}">${w.name}</span> [${getWeaponType(w)}] <small style="color:#aaa;">(${w.desc || '已配備'})</small>`;
    } else {
      wNameEl.innerHTML = `<span style="color:#95a5a6;">空手 (拳)</span> <small style="color:#777;">[徒手搏擊]</small>`;
    }
  }
  if (aNameEl) {
    if (a) {
      aNameEl.innerHTML = `<span class="${getRarityColorClass(a.rarity)}">${a.name}</span> <small style="color:#aaa;">(${a.desc || '已穿戴'})</small>`;
    } else {
      aNameEl.innerHTML = `<span style="color:#95a5a6;">赤膊布身</span> <small style="color:#777;">[無防具]</small>`;
    }
  }

  const list = document.getElementById('bag-inventory-list');
  if (!list) return;
  list.innerHTML = '';

  if (!player.inventory || player.inventory.length === 0) {
    list.innerHTML = `<div style="text-align:center; color:#666; font-size:12px; padding:20px;">行囊空空如也。</div>`;
    return;
  }

  player.inventory.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'bag-item-card';
    const colorClass = getRarityColorClass(item.rarity);

    let actionBtn = "";
    if (item.type === 'weapon' || item.type === 'armor') {
      actionBtn = `<button class="wuxia-btn" style="padding:3px 10px; font-size:11px; color:var(--cyan);" onclick="equipGearFromBag(${idx})">裝備</button>`;
    } else if (item.type === 'pill') {
      actionBtn = `<button class="wuxia-btn" style="padding:3px 10px; font-size:11px; color:#2ecc71;" onclick="usePillFromBag(${idx})">服下</button>`;
    } else if (item.type === 'book') {
      actionBtn = `<button class="wuxia-btn" style="padding:3px 10px; font-size:11px; color:var(--gold);" onclick="studyKungfuBook(${idx})">研習(${item.costLearn || 40}學點)</button>`;
    } else if (item.type === 'material') {
      actionBtn = `<span style="font-size:11px; color:#a1887f;">[材料]</span>`;
    }

    card.innerHTML = `
      <div>
        <b class="${colorClass}" style="font-size:13px;">${item.name}</b>
        <span class="rarity-badge rarity-${item.rarity}">${item.rarity}</span>
        ${item.type === 'weapon' ? `<span style="font-size:10px; color:#f1c40f; margin-left:3px;">[${getWeaponType(item)}]</span>` : ''}
        ${item.count ? `<span style="font-size:11px; color:var(--gold);">x${item.count}</span>` : ''}
        <div style="font-size:11px; color:#8ca0b3; margin-top:2px;">${item.desc}</div>
      </div>
      <div>${actionBtn}</div>
    `;
    list.appendChild(card);
  });
}

function equipGearFromBag(itemIdx) {
  const item = player.inventory[itemIdx];
  if (!item) return;

  if (item.type === 'armor' && player.talents && player.talents.some(t => t.noArmor)) {
    gameNotify("你身具【苦行頭陀】宿命，不可穿戴任何防具衣甲！");
    return;
  }

  if (item.type === 'weapon') {
    const oldWeapon = player.equippedGear.weapon;
    player.equippedGear.weapon = item;
    player.inventory.splice(itemIdx, 1);
    if (oldWeapon) player.inventory.push(oldWeapon);
    gameNotify(`🗡️ 你已自行囊裝備上了【${item.name}】！`);
  } else if (item.type === 'armor') {
    const oldArmor = player.equippedGear.armor;
    player.equippedGear.armor = item;
    player.inventory.splice(itemIdx, 1);
    if (oldArmor) player.inventory.push(oldArmor);
    gameNotify(`🛡️ 你已自行囊披上了【${item.name}】！`);
  }

  recalcPlayerStats();
  renderBagUI();
  renderKungfuSlots();
}

function unequipGear(slotType) {
  if (!player.equippedGear) return;
  const current = player.equippedGear[slotType];
  if (!current) {
    gameNotify(slotType === 'weapon' ? "當前早已是赤手空拳，無需卸除！" : "當前並未穿戴任何護甲！");
    return;
  }

  player.inventory.push(current);
  player.equippedGear[slotType] = null;

  recalcPlayerStats();
  renderBagUI();
  renderKungfuSlots();
  gameNotify(slotType === 'weapon' ? "🗡️ 已收兵刃入鞘，身歸自然，切換為【空手 (拳)】！" : "🛡️ 已卸下護甲！");
}

function usePillFromBag(itemIdx) {
  const item = player.inventory[itemIdx];
  if (!item || item.type !== 'pill') return;

  const isTaotie = (player.talents && player.talents.some(t => t.pillMult));
  const mult = isTaotie ? 2.0 : 1.0;

  if (item.healHp) {
    const healVal = Math.floor(item.healHp * mult);
    player.hp = Math.min(player.maxHp, player.hp + healVal);
    gameNotify(`💊 服下【${item.name}】${isTaotie ? '（饕餮吞天效果翻倍）' : ''}，氣血恢復 ${healVal} 點！`);
  } else if (item.hpAdd || item.speedAdd || item.expAdd) {
    const hpGain = Math.floor((item.hpAdd || 0) * mult);
    const spdGain = Math.floor((item.speedAdd || 0) * mult);
    const expGain = Math.floor((item.expAdd || 0) * mult);

    player.baseMaxHp += hpGain;
    player.statsEncounter.speed = (player.statsEncounter.speed || 0) + spdGain;
    if (expGain) player.exp += expGain;

    gameNotify(`💊 服下【${item.name}】${isTaotie ? '（饕餮吞天效果翻倍）' : ''}，奇遇造化湧現：氣血上限 +${hpGain}，身法 +${spdGain}${expGain ? '，修為 +' + expGain : ''}！`);
  }

  if (item.count && item.count > 1) {
    item.count -= 1;
  } else {
    player.inventory.splice(itemIdx, 1);
  }

  recalcPlayerStats();
  renderBagUI();
}

// ==================== 物品入囊 (商店購買 / 戰利品掉落共用) ====================
function findItemByRef(ref) {
  if (typeof GLOBAL_ITEMS === 'undefined') return null;
  return GLOBAL_ITEMS.find(i => i.id === ref) || GLOBAL_ITEMS.find(i => i.name === ref) || null;
}

function findSkillByRef(ref) {
  if (typeof GLOBAL_SKILLS === 'undefined') return null;
  return GLOBAL_SKILLS.find(s => s.id === ref) || GLOBAL_SKILLS.find(s => s.name === ref) || null;
}

/**
 * 放入行囊；kind: "item" (物品 id/名稱) 或 "book" (武學 id/名稱 → 秘笈)
 * 回傳放入的物品名稱，找不到資料時回傳 null
 */
function grantLootToBag(kind, ref, count = 1) {
  count = Math.max(1, Number(count) || 1);
  if (kind === 'book') {
    const sk = findSkillByRef(ref);
    if (!sk) return null;
    const rarity = sk.rarity || "良品";
    for (let i = 0; i < count; i++) {
      player.inventory.push({
        id: "book_" + Date.now() + "_" + i,
        name: `《${sk.name}秘笈》`,
        type: "book",
        rarity,
        costLearn: (rarity === "神品") ? 180 : (rarity === "絕品" ? 100 : 50),
        skillData: { ...sk },
        desc: `記載著【${rarity}】絕技【${sk.name}】精深心法的秘笈殘卷。研讀需體悟耗費學點。`
      });
    }
    return `《${sk.name}秘笈》`;
  }

  const tpl = findItemByRef(ref);
  if (!tpl) return null;
  if (tpl.type === 'pill' || tpl.type === 'material') {
    const existing = player.inventory.find(i => i.type === tpl.type && i.name === tpl.name);
    if (existing) existing.count = (existing.count || 1) + count;
    else player.inventory.push({ ...tpl, templateId: tpl.id, id: "pill_" + Date.now(), count });
  } else {
    for (let i = 0; i < count; i++) {
      player.inventory.push({ ...tpl, templateId: tpl.id, id: "item_" + Date.now() + "_" + i });
    }
  }
  return tpl.name;
}

// 依掉落表 [{kind, ref, rate, count}] 擲骰，回傳獲得的物品名稱清單
function rollDropTable(drops, sourceName) {
  const got = [];
  if (!Array.isArray(drops)) return got;
  drops.forEach(d => {
    if (!d || !d.ref) return;
    if (Math.random() * 100 >= (Number(d.rate) || 0)) return;
    const name = grantLootToBag(d.kind || 'item', d.ref, d.count);
    if (name) {
      const cnt = Math.max(1, Number(d.count) || 1);
      got.push(cnt > 1 ? `${name} x${cnt}` : name);
    }
  });
  if (got.length > 0 && typeof pushChatMessage === 'function') {
    pushChatMessage('system', '【戰利品】', `擊敗【${sourceName}】，拾得 ${got.join('、')}，已放入行囊！`, '#f1c40f');
  }
  return got;
}

// ==================== 奇遇：依物品 encounter 設定，在移動 / 打坐時機率獲得 ====================
// encounter: { chance: 每次判定機率 %, on: "travel" | "meditate" | "both", towns: [城鎮名…]（空 = 任何地點）, text: 奇遇描述 }
function rollEncounters(on) {
  if (typeof GLOBAL_ITEMS === 'undefined' || !player) return null;
  const here = player.curLoc;
  const pool = GLOBAL_ITEMS.filter(it => {
    const e = it.encounter;
    if (!e || !(Number(e.chance) > 0)) return false;
    if (e.on && e.on !== 'both' && e.on !== on) return false;
    if (Array.isArray(e.towns) && e.towns.length > 0 && !e.towns.includes(here)) return false;
    return true;
  });
  for (const it of pool.sort(() => Math.random() - 0.5)) {
    if (Math.random() * 100 < Number(it.encounter.chance)) {
      const name = grantLootToBag('item', it.id, 1);
      if (!name) continue;
      const text = it.encounter.text || (on === 'meditate' ? '靜坐之間，忽有所感' : '途中偶遇機緣');
      if (typeof gameNotify === 'function') gameNotify(`✨【奇遇】${text}，獲得【${name}】！`, 'ok');
      if (typeof pushChatMessage === 'function') pushChatMessage('system', '【奇遇】', `${text}，獲得【${name}】！`, '#f1c40f');
      if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
      return name;
    }
  }
  return null;
}

// 商店購買（場景 goods 清單）
function buyGoodsToBag(ref, price) {
  price = Number(price) || 0;
  const tpl = findItemByRef(ref);
  if (!tpl) { gameNotify("掌櫃翻遍貨架也找不到這件貨品！"); return; }
  if (player.gold < price) { gameNotify("銀兩不足！"); return; }
  player.gold -= price;
  grantLootToBag('item', tpl.id || tpl.name, 1);
  recalcPlayerStats();
  if (typeof refreshCurrentScene === 'function') refreshCurrentScene();
  gameNotify(`🛍️ 購置成功！【${tpl.name}】已放入行囊！（餘 ${player.gold} 兩）`);
}

// ==================== 5. 轉生輪迴 (通天塔 50 層限制與 10 選 N) ====================
let selectedReincarnationHeritage = [];
let draftedTalentOptions = [];
let selectedDraftedTalents = [];

function openReincarnationModal() {
  if ((player.towerFloor || 1) <= 50) {
    gameNotify(`🔒 天道封印：通天試煉塔未破！\n少俠需通關通天塔【第 50 層】（當前極限：第 ${player.towerFloor || 1} 層），淬煉無上道果後方可破碎虛空轉世重修！`);
    return;
  }

  closeModal('modal-hero-profile');
  const allowed = 1 + (player.reincarnations || 0);
  const allowEl = document.getElementById('reincarnate-allowed-count');
  if (allowEl) allowEl.innerText = allowed;

  selectedReincarnationHeritage = [];
  selectedDraftedTalents = [];

  const s1 = document.getElementById('reincarnate-step-1');
  const s2 = document.getElementById('reincarnate-step-2');
  if (s1) s1.style.display = 'block';
  if (s2) s2.style.display = 'none';

  const list = document.getElementById('reincarnate-selection-list');
  if (!list) return;
  list.innerHTML = '';

  if (player.talents && player.talents.length > 0) {
    player.talents.forEach(t => {
      const d = document.createElement('div');
      d.className = 'bag-item-card';
      const colorClass = getRarityColorClass(t.rarity);
      d.innerHTML = `
        <div>
          <b class="${colorClass}">【天賦】${t.name}</b>
          <span class="rarity-badge rarity-${t.rarity}">${t.rarity}</span>
          <div style="font-size:10.5px; color:#aaa;">${t.desc}</div>
        </div>
        <input type="checkbox" onchange="toggleReincarnationHeritage('talent', '${t.id}', this)" style="transform:scale(1.3); cursor:pointer;">
      `;
      list.appendChild(d);
    });
  }

  myLearnedKungfu.forEach(kf => {
    const d = document.createElement('div');
    d.className = 'bag-item-card';
    const evalT = (typeof getKungfuEval === 'function') ? getKungfuEval(kf.tier, kf.progress) : `${kf.tier}重`;
    const colorClass = getRarityColorClass(kf.rarity);
    d.innerHTML = `
      <div>
        <b class="${colorClass}">【武學】${kf.name}</b>
        <span class="rarity-badge rarity-${kf.rarity}">${kf.rarity}</span>
        <small style="color:#f1c40f;">(${kf.tier}重・${evalT})</small>
      </div>
      <input type="checkbox" onchange="toggleReincarnationHeritage('kf', '${kf.id}', this)" style="transform:scale(1.3); cursor:pointer;">
    `;
    list.appendChild(d);
  });

  const allGears = [...player.inventory];
  if (player.equippedGear.weapon) allGears.push(player.equippedGear.weapon);
  if (player.equippedGear.armor) allGears.push(player.equippedGear.armor);

  allGears.forEach(item => {
    if (item.type === 'weapon' || item.type === 'armor') {
      const d = document.createElement('div');
      d.className = 'bag-item-card';
      const colorClass = getRarityColorClass(item.rarity);
      d.innerHTML = `
        <div>
          <b class="${colorClass}">【裝備】${item.name}</b>
          <span class="rarity-badge rarity-${item.rarity}">${item.rarity}</span>
          <small style="color:#aaa;">(${item.desc})</small>
        </div>
        <input type="checkbox" onchange="toggleReincarnationHeritage('gear', '${item.id}', this)" style="transform:scale(1.3); cursor:pointer;">
      `;
      list.appendChild(d);
    }
  });

  openModal('modal-reincarnation');
}

function toggleReincarnationHeritage(type, id, checkbox) {
  const allowed = 1 + (player.reincarnations || 0);
  if (checkbox.checked) {
    if (selectedReincarnationHeritage.length >= allowed) {
      gameNotify(`第 ${1 + player.reincarnations} 世輪迴最多只可保留 ${allowed} 項遺產！`);
      checkbox.checked = false;
      return;
    }
    selectedReincarnationHeritage.push({ type, id });
  } else {
    selectedReincarnationHeritage = selectedReincarnationHeritage.filter(h => !(h.type === type && h.id === id));
  }
}

function goToTalentDraftStep() {
  const nextReincarnations = (player.reincarnations || 0) + 1;
  const pickLimit = Math.min(3, Math.max(0, nextReincarnations - 1));

  const s1 = document.getElementById('reincarnate-step-1');
  const s2 = document.getElementById('reincarnate-step-2');
  if (s1) s1.style.display = 'none';
  if (s2) s2.style.display = 'block';

  const pickEl = document.getElementById('draft-pick-count');
  const hintEl = document.getElementById('draft-rule-hint');
  if (pickEl) pickEl.innerText = pickLimit;
  if (hintEl) hintEl.innerText = `(轉生第 ${nextReincarnations} 次：可自 10 個天賦中挑選 ${pickLimit} 個)`;

  const pool = (typeof GLOBAL_TALENTS !== 'undefined' && Array.isArray(GLOBAL_TALENTS)) ? [...GLOBAL_TALENTS] : [];
  draftedTalentOptions = [];
  for (let i = 0; i < 10 && pool.length > 0; i++) {
    const randIdx = Math.floor(Math.random() * pool.length);
    draftedTalentOptions.push(pool.splice(randIdx, 1)[0]);
  }

  renderTalentDraftUI(pickLimit);
}

function renderTalentDraftUI(pickLimit) {
  const box = document.getElementById('talent-draft-container');
  if (!box) return;
  box.innerHTML = '';

  if (pickLimit === 0) {
    box.innerHTML = `<div style="text-align:center; color:#aaa; font-size:12px; padding:20px;">首次轉世尚無法自天道中領悟新天賦，第 2 次轉生起方可挑選！請直接點擊下方踏入下一世！</div>`;
    return;
  }

  draftedTalentOptions.forEach(talent => {
    const isSelected = selectedDraftedTalents.some(t => t.id === talent.id);
    const card = document.createElement('div');
    card.className = 'bag-item-card';
    card.style.cursor = 'pointer';
    card.style.borderColor = isSelected ? 'var(--cyan)' : '#354052';
    card.style.background = isSelected ? '#1b2a38' : '#141822';
    const colorClass = getRarityColorClass(talent.rarity);

    card.innerHTML = `
      <div style="flex:1;">
        <b class="${colorClass}">${talent.name}</b>
        <span class="rarity-badge rarity-${talent.rarity}">${talent.rarity}</span>
        <div style="font-size:11.5px; color:#cbd5e1; margin-top:3px; line-height:1.4;">${talent.desc}</div>
      </div>
      <input type="checkbox" ${isSelected ? 'checked' : ''} style="transform:scale(1.3); pointer-events:none; margin-left:8px;">
    `;

    card.onclick = () => {
      toggleDraftPick(talent, pickLimit);
    };

    box.appendChild(card);
  });
}

function toggleDraftPick(talent, pickLimit) {
  const existIdx = selectedDraftedTalents.findIndex(t => t.id === talent.id);
  if (existIdx >= 0) {
    selectedDraftedTalents.splice(existIdx, 1);
  } else {
    if (selectedDraftedTalents.length >= pickLimit) {
      gameNotify(`當前最多只可挑選 ${pickLimit} 個天賦！`);
      return;
    }
    selectedDraftedTalents.push(talent);
  }
  renderTalentDraftUI(pickLimit);
}

function confirmReincarnationWithTalents() {
  const nextReincarnations = (player.reincarnations || 0) + 1;
  const pickLimit = Math.min(3, Math.max(0, nextReincarnations - 1));

  if (selectedDraftedTalents.length < pickLimit && pickLimit > 0) {
    if (!confirm(`尚有 ${pickLimit - selectedDraftedTalents.length} 個天賦未選取，確定要直接轉生嗎？`)) {
      return;
    }
  }

  const keptTalents = [];
  selectedReincarnationHeritage.filter(h => h.type === 'talent').forEach(h => {
    const t = player.talents.find(item => item.id === h.id);
    if (t) keptTalents.push(t);
  });

  const keptKungfus = [];
  selectedReincarnationHeritage.filter(h => h.type === 'kf').forEach(h => {
    const kf = myLearnedKungfu.find(k => k.id === h.id);
    if (kf) keptKungfus.push({ ...kf });
  });

  const keptGears = [];
  const allGears = [...player.inventory];
  if (player.equippedGear.weapon) allGears.push(player.equippedGear.weapon);
  if (player.equippedGear.armor) allGears.push(player.equippedGear.armor);

  selectedReincarnationHeritage.filter(h => h.type === 'gear').forEach(h => {
    const g = allGears.find(item => item.id === h.id);
    if (g) keptGears.push({ ...g });
  });

  player.reincarnations = nextReincarnations;
  player.towerFloor = 1;
  player.sect = "無門無派";
  player.sectRank = "無";
  player.curLoc = "牛家村";
  player.gold = 80;
  player.exp = 100;
  player.learn = 80;
  player.combat = 10;

  player.talents = [...keptTalents, ...selectedDraftedTalents];

  player.statsInnate = {
    arm: 15 + Math.floor(Math.random() * 8),
    speed: 40 + Math.floor(Math.random() * 12),
    bone: 15 + Math.floor(Math.random() * 8),
    inner: 10 + Math.floor(Math.random() * 8),
    int: 20 + Math.floor(Math.random() * 8),
    luck: 15 + Math.floor(Math.random() * 10)
  };
  player.statsEncounter = { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 };

  myLearnedKungfu = getStarterKungfuList();

  keptKungfus.forEach(k => {
    if (!myLearnedKungfu.some(x => x.name === k.name)) {
      myLearnedKungfu.push(k);
    }
  });

  player.equippedGear = {
    weapon: null,
    armor: { id: "a_init", name: "粗麻布衣", type: "armor", rarity: "凡品", def: 4, hp: 40, desc: "防禦 +4，氣血 +40" }
  };

  player.inventory = [
    { id: "i_pill_init", name: "小金創散", type: "pill", rarity: "凡品", healHp: 120, desc: "調和氣血", count: 2 },
    ...keptGears
  ];

  const externals = myLearnedKungfu.filter(k => k.type === 'external');
  equippedSlots = {
    internal: myLearnedKungfu.find(k => k.type === 'internal') || null,
    qinggong: myLearnedKungfu.find(k => k.type === 'qinggong') || null,
    ext0: externals[0] || null,
    ext1: externals[1] || null
  };

  closeModal('modal-reincarnation');
  recalcPlayerStats();
  if (typeof renderJianghuScenesOnMenu === 'function') renderJianghuScenesOnMenu();
  if (typeof renderNineGridMap === 'function') renderNineGridMap();
  if (typeof refreshChatForCurrentLocation === 'function') refreshChatForCurrentLocation();

  const talentNames = player.talents.map(t => `【${t.name}】`).join(' ');
  gameNotify(`✨ 雷劫洗禮，破虛飛昇！少俠已邁入【第 ${player.reincarnations + 1} 世】！\n通天試煉塔已重置至第 1 層！\n本世共承載天命：\n${talentNames || '無'}`);
}

window.getRarityColorClass = getRarityColorClass;
window.getBasicSkillName = getBasicSkillName;
window.openHeroProfileModal = openHeroProfileModal;
window.showStatDetail = showStatDetail;
window.selectAvatar = selectAvatar;
window.setKungfuFilter = setKungfuFilter;
window.toggleKungfuInlineView = toggleKungfuInlineView;
window.switchToNormalMode = switchToNormalMode;
window.renderKungfuSlots = renderKungfuSlots;
window.renderLearnedKungfuList = renderLearnedKungfuList;
window.unequipSlot = unequipSlot;
window.equipKungfu = equipKungfu;
window.upgradeKungfu = upgradeKungfu;
window.learnKwoonSkill = learnKwoonSkill;
window.studyKungfuBook = studyKungfuBook;
window.openBagModal = openBagModal;
window.renderBagUI = renderBagUI;
window.equipGearFromBag = equipGearFromBag;
window.unequipGear = unequipGear;
window.usePillFromBag = usePillFromBag;
window.buyGoodsToBag = buyGoodsToBag;
window.grantLootToBag = grantLootToBag;
window.rollEncounters = rollEncounters;
window.rollDropTable = rollDropTable;
window.findItemByRef = findItemByRef;
window.findSkillByRef = findSkillByRef;
window.openReincarnationModal = openReincarnationModal;
window.toggleReincarnationHeritage = toggleReincarnationHeritage;
window.goToTalentDraftStep = goToTalentDraftStep;
window.toggleDraftPick = toggleDraftPick;
window.confirmReincarnationWithTalents = confirmReincarnationWithTalents;