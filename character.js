/**
 * ========================================================
 * 你的江湖 - 角色養成模組 (character.js) [素質透視與彈窗版]
 * 支援點擊查看：先天 + 功法 + 奇遇 + 裝備 來源分解
 * ========================================================
 */

// 8 款武俠風格手繪向量頭像 (帶滿版寬高約束)
var WUXIA_AVATARS = [
  { id: 0, title: "斗笠劍客", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1e272e"/><path d="M15,45 Q50,15 85,45 Z" fill="#b8860b"/><path d="M30,45 Q50,75 70,45" fill="#f5cd79"/><rect x="44" y="52" width="12" height="3" fill="#333"/><line x1="20" y1="46" x2="80" y2="46" stroke="#d4a373" stroke-width="2"/><path d="M25,85 Q50,60 75,85" fill="#2980b9"/></svg>` },
  { id: 1, title: "白衣女俠", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#2c3e50"/><circle cx="50" cy="45" r="20" fill="#f8c291"/><path d="M28,42 Q50,18 72,42 Q65,65 50,62 Q35,65 28,42 Z" fill="#1e272e"/><circle cx="43" cy="45" r="2.5" fill="#2f3542"/><circle cx="57" cy="45" r="2.5" fill="#2f3542"/><path d="M47,54 Q50,56 53,54" stroke="#e84118" stroke-width="1.5" fill="none"/><line x1="30" y1="26" x2="70" y2="24" stroke="#f1c40f" stroke-width="2.5"/><path d="M25,90 Q50,65 75,90" fill="#ecf0f1"/></svg>` },
  { id: 2, title: "唐門暗客", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#130f40"/><circle cx="50" cy="46" r="20" fill="#f5cd79"/><path d="M30,46 Q50,65 70,46 L70,68 Q50,85 30,68 Z" fill="#301934"/><circle cx="42" cy="42" r="2.5" fill="#be2edd"/><circle cx="58" cy="42" r="2.5" fill="#be2edd"/><path d="M22,35 Q50,15 78,35 L74,22 Q50,8 26,22 Z" fill="#4834d4"/><path d="M20,92 Q50,68 80,92" fill="#574b90"/></svg>` },
  { id: 3, title: "少林武僧", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#2d3436"/><circle cx="50" cy="46" r="22" fill="#eccc68"/><circle cx="42" cy="43" r="2.5" fill="#222"/><circle cx="58" cy="43" r="2.5" fill="#222"/><circle cx="45" cy="30" r="1.5" fill="#fff"/><circle cx="50" cy="30" r="1.5" fill="#fff"/><circle cx="55" cy="30" r="1.5" fill="#fff"/><circle cx="45" cy="35" r="1.5" fill="#fff"/><circle cx="50" cy="35" r="1.5" fill="#fff"/><circle cx="55" cy="35" r="1.5" fill="#fff"/><path d="M22,90 Q50,68 78,90" fill="#e17055"/></svg>` },
  { id: 4, title: "武當道尊", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1b2a47"/><circle cx="50" cy="48" r="20" fill="#f8c291"/><circle cx="50" cy="22" r="8" fill="#111"/><line x1="40" y1="22" x2="60" y2="22" stroke="#d4a373" stroke-width="2.5"/><path d="M25,92 Q50,68 75,92" fill="#2980b9"/><circle cx="44" cy="45" r="2" fill="#222"/><circle cx="56" cy="45" r="2.5" fill="#222"/></svg>` },
  { id: 5, title: "紅衣魔煞", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#2c1a1d"/><circle cx="50" cy="46" r="20" fill="#fad390"/><path d="M24,42 Q50,15 76,42 Q70,70 50,65 Q30,70 24,42 Z" fill="#2c2c54"/><path d="M46,55 Q50,57 54,55" stroke="#e74c3c" stroke-width="2" fill="none"/><circle cx="43" cy="44" r="2.5" fill="#c0392b"/><circle cx="57" cy="44" r="2.5" fill="#c0392b"/><path d="M22,92 Q50,68 78,92" fill="#b71540"/></svg>` },
  { id: 6, title: "金刀豪俠", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#2c3a29"/><circle cx="50" cy="48" r="20" fill="#e0a96d"/><path d="M30,35 L70,35 L68,26 L32,26 Z" fill="#f1c40f"/><path d="M36,58 Q50,70 64,58 Z" fill="#333"/><circle cx="42" cy="45" r="2.5" fill="#222"/><circle cx="58" cy="45" r="2.5" fill="#222"/><path d="M22,92 Q50,70 78,92" fill="#7f8c8d"/></svg>` },
  { id: 7, title: "丐幫義士", svg: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#3d2c1d"/><circle cx="50" cy="48" r="21" fill="#d4a373"/><path d="M26,38 Q50,15 74,38 L72,32 L28,32 Z" fill="#574b90"/><circle cx="43" cy="46" r="2.5" fill="#111"/><circle cx="57" cy="46" r="2.5" fill="#111"/><path d="M46,56 Q50,58 54,56" stroke="#222" stroke-width="1.5" fill="none"/><path d="M22,92 Q50,66 78,92" fill="#556b2f"/></svg>` }
];
window.WUXIA_AVATARS = WUXIA_AVATARS;

// ==================== 頭像面板與六維來源透視 ====================
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

  // 渲染六維數字與其四項分解來源
  const names = {
    arm: "臂力",
    speed: "身法",
    bone: "根骨",
    inner: "內功",
    int: "悟性",
    luck: "福緣"
  };

  ['arm', 'speed', 'bone', 'inner', 'int', 'luck'].forEach(k => {
    const valEl = document.getElementById(`st-${k}`);
    const srcEl = document.getElementById(`st-${k}-source`);
    const src = (player.statSources && player.statSources[k]) ? player.statSources[k] : {
      innate: player.stats[k], kf: 0, enc: 0, gear: 0, total: player.stats[k]
    };

    if (valEl) valEl.innerText = src.total;
    if (srcEl) {
      srcEl.innerText = `[先天${src.innate} + 功法${src.kf} + 奇遇${src.enc} + 裝備${src.gear}]`;
    }
  });

  openModal('modal-hero-profile');
}

// 點擊屬性方塊查看詳細彈窗
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
    innate: player.stats[statKey], kf: 0, enc: 0, gear: 0, total: player.stats[statKey]
  };

  alert(`【${names[statKey]} 來源詳情】\n` +
        `------------------------------------\n` +
        `• 先天根基：${src.innate}\n` +
        `• 功法加成：${src.kf} (主修功法與修煉造詣)\n` +
        `• 奇遇靈藥：${src.enc} (服食丹藥/特殊機緣)\n` +
        `• 裝備加持：${src.gear} (神兵寶甲附帶)\n` +
        `------------------------------------\n` +
        `合計總值：${src.total} 點`);
}

function selectAvatar(id) {
  player.avatarId = id;
  updateProfileUI();
  autoSave();
  openHeroProfileModal();
}

// ==================== 武學分類篩選與參悟 ====================
var currentKungfuFilter = "全部";

function setKungfuFilter(filterType, btnEl) {
  currentKungfuFilter = filterType;
  document.querySelectorAll('.kf-filter-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderLearnedKungfuList();
}

function openKungfuModal() {
  renderKungfuSlots();
  renderLearnedKungfuList();
  const expEl = document.getElementById('kf-cur-exp');
  if (expEl) expEl.innerText = player.exp;
  openModal('modal-kungfu');
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

  if (kf) {
    card.classList.add('filled');
    const evalText = (typeof getKungfuEval === 'function') ? getKungfuEval(kf.tier, kf.progress) : `${kf.tier}重`;
    const req = (typeof getSkillWeaponReq === 'function') ? getSkillWeaponReq(kf) : "任意";

    let matchBadge = "";
    if (kf.type === 'external') {
      const isMatch = (typeof isSkillCompatibleWithWeapon === 'function') ? isSkillCompatibleWithWeapon(kf, player.equippedGear.weapon) : true;
      if (isMatch) {
        matchBadge = `<span style="color:#2ecc71; font-size:10px; margin-left:3px;">[✔ 契合:${req}]</span>`;
      } else {
        card.classList.add('mismatched');
        matchBadge = `<span style="color:#e74c3c; font-size:10px; margin-left:3px; font-weight:bold;">[⚠️ 兵刃不符:需${req}]</span>`;
      }
    }

    text.innerHTML = `
      <span class="rarity-badge rarity-${kf.rarity}">${kf.rarity}</span>
      ${kf.name} <small style="color:#f1c40f;">(${kf.tier}重・${evalText})</small>
      ${matchBadge}
    `;
  } else {
    card.classList.remove('filled');
    text.innerHTML = `<span style="color:#666; font-size:12px;">【空置・點擊下方佩戴】</span>`;
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
    box.innerHTML = `<div style="text-align:center; color:#666; font-size:12px; padding:20px;">當前分類下無習得之武學。可前往各城鎮武館或門派請教！</div>`;
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
    const costExp = Math.max(10, Math.floor(rawCost * (1 - (player.stats.int * 0.005))));
    const reqW = (typeof getSkillWeaponReq === 'function') ? getSkillWeaponReq(kf) : "任意";

    // 六維成長展示
    let statText = "";
    if (kf.statBonus) {
      const names = { arm: "臂力", speed: "身法", bone: "根骨", inner: "內功" };
      const mult = 1 + (kf.tier - 1) * 0.2 + (kf.progress / 100) * 0.2;
      statText = Object.keys(kf.statBonus).map(k => `${names[k]}+${Math.floor(kf.statBonus[k] * mult)}`).join(' ');
    }

    let detailStats = "";
    if (kf.type === 'external') {
      const curMult = ((Number(kf.baseMult) || 1.3) * (1 + (kf.tier - 1) * 0.18 + (kf.progress / 100) * 0.18)).toFixed(2);
      const isMatch = (typeof isSkillCompatibleWithWeapon === 'function') ? isSkillCompatibleWithWeapon(kf, curW) : true;
      detailStats = `威力：<b style="color:var(--cyan);">${curMult}x</b> | 兵刃: <b>${reqW}</b> ${isMatch ? '<span style="color:#2ecc71;">(契合)</span>' : '<span style="color:#e74c3c;">(不符)</span>'}`;
    } else if (kf.type === 'internal') {
      const curHp = Math.floor((Number(kf.baseHpBonus) || 50) * (1 + (kf.tier - 1) * 0.22));
      detailStats = `氣血+${curHp} 防禦+${Math.floor((Number(kf.baseDefBonus) || 4) * (1 + (kf.tier - 1) * 0.22))}`;
    } else if (kf.type === 'qinggong') {
      const curSpd = Math.floor((Number(kf.baseSpeedBonus) || 12) * (1 + (kf.tier - 1) * 0.25));
      detailStats = `身法+${curSpd}`;
    }

    const card = document.createElement('div');
    card.className = `kungfu-master-card ${kf.rarity}`;
    card.innerHTML = `
      <div class="kf-header">
        <div>
          <b style="color:#fff; font-size:13.5px;">${kf.name}</b>
          <span class="rarity-badge rarity-${kf.rarity}">${kf.rarity}</span>
          <span style="font-size:11px; color:#8ca0b3; margin-left:4px;">[${kf.type === 'external' ? '外功' : (kf.type === 'internal' ? '心法' : '輕功')}]</span>
        </div>
        <span class="eval-badge ${isMastered ? 'eval-大圓滿' : ''}">${isMastered ? '★ 大圓滿 ★' : `【${evalText}】`}</span>
      </div>

      <div style="font-size:11.5px; color:#cfd9e6; margin-top:3px;">
        造詣：<b>第 ${kf.tier} 重</b> (${kf.progress}%)
        <span style="margin-left:6px; color:#f1c40f;">${statText ? `[六維: ${statText}]` : ''}</span>
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
            ${isMastered ? '已至大圓滿' : `參悟 (+25% 耗${costExp}修為)`}
          </button>
        </div>
      </div>
    `;
    box.appendChild(card);
  });
}

function unequipSlot(slotKey) {
  if (!equippedSlots[slotKey]) return;
  equippedSlots[slotKey] = null;
  recalcPlayerStats();
  renderKungfuSlots();
  renderLearnedKungfuList();
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
  const cost = Math.max(10, Math.floor(rawCost * (1 - (player.stats.int * 0.005))));

  if (player.exp < cost) {
    alert(`修為不足！【${kf.name}】乃【${kf.rarity}】絕學，突破需消耗 ${cost} 點修為！請打坐或切磋累積！`);
    return;
  }

  player.exp -= cost;
  kf.progress += 25;

  if (kf.progress >= 100) {
    if (kf.tier < 10) {
      kf.tier += 1;
      kf.progress = 0;
      const evalT = (typeof getKungfuEval === 'function') ? getKungfuEval(kf.tier, 0) : `${kf.tier}重`;
      alert(`⚡ 功力大進！【${kf.name}】突破桎梏晉升至【第 ${kf.tier} 重】！六維大幅躍進！`);
    } else {
      kf.progress = 100;
      alert(`🎉 震爍古今！【${kf.name}】達到【十重大圓滿】之無上境地！六維全面昇華！`);
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
    alert("學點或銀兩不足！");
    return;
  }
  const sk = (typeof GLOBAL_SKILLS !== 'undefined') ? GLOBAL_SKILLS.find(s => s.name === name) : null;
  const template = sk || { name, type: "external", weaponReq: "任意", rarity: "良品", tier: 1, progress: 0, baseMult: 1.6, statBonus: { arm: 4 }, jinyongDesc: "外家絕招！" };

  if (myLearnedKungfu.some(k => k.name === name)) {
    alert("你早已領會此門武學！");
    return;
  }

  player.learn -= costLearn;
  player.gold -= costGold;
  myLearnedKungfu.push({ ...template, id: "kf_" + Date.now() });

  recalcPlayerStats();
  closeModal('modal-scene');
  alert(`🎉 參悟成功！你習得了【${name}】！初始為【初學者（一重 0%）】，請至「武學」佩戴！`);
}

// ==================== 行囊與靈藥服用 (靈藥加成歸入奇遇) ====================
function openBagModal() { renderBagUI(); openModal('modal-bag'); }

function renderBagUI() {
  const w = player.equippedGear ? player.equippedGear.weapon : null;
  const a = player.equippedGear ? player.equippedGear.armor : null;

  const wNameEl = document.getElementById('bag-cur-weapon-name');
  const aNameEl = document.getElementById('bag-cur-armor-name');
  if (wNameEl) wNameEl.innerText = w ? `${w.name} [${getWeaponType(w)}] (${w.desc})` : "赤手空拳 [拳]";
  if (aNameEl) aNameEl.innerText = a ? `${a.name} (${a.desc})` : "赤膊布身";

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

    let actionBtn = "";
    if (item.type === 'weapon' || item.type === 'armor') {
      actionBtn = `<button class="wuxia-btn" style="padding:3px 10px; font-size:11px; color:var(--cyan);" onclick="equipGearFromBag(${idx})">裝備</button>`;
    } else if (item.type === 'pill') {
      actionBtn = `<button class="wuxia-btn" style="padding:3px 10px; font-size:11px; color:#2ecc71;" onclick="usePillFromBag(${idx})">服下</button>`;
    }

    card.innerHTML = `
      <div>
        <b style="color:#fff; font-size:13px;">${item.name}</b>
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

  if (item.type === 'weapon') {
    const oldWeapon = player.equippedGear.weapon;
    player.equippedGear.weapon = item;
    player.inventory.splice(itemIdx, 1);
    if (oldWeapon) player.inventory.push(oldWeapon);
    alert(`🗡️ 你已自背包裝備上了【${item.name}】！`);
  } else if (item.type === 'armor') {
    const oldArmor = player.equippedGear.armor;
    player.equippedGear.armor = item;
    player.inventory.splice(itemIdx, 1);
    if (oldArmor) player.inventory.push(oldArmor);
    alert(`🛡️ 你已自背包披上了【${item.name}】！`);
  }

  recalcPlayerStats();
  renderBagUI();
}

function unequipGear(slotType) {
  const current = player.equippedGear ? player.equippedGear[slotType] : null;
  if (!current) return;
  player.inventory.push(current);
  player.equippedGear[slotType] = null;
  recalcPlayerStats();
  renderBagUI();
}

function usePillFromBag(itemIdx) {
  const item = player.inventory[itemIdx];
  if (!item || item.type !== 'pill') return;

  if (item.healHp) {
    player.hp = Math.min(player.maxHp, player.hp + item.healHp);
    alert(`💊 服下【${item.name}】，氣血恢復 ${item.healHp} 點！`);
  } else if (item.hpAdd || item.speedAdd) {
    player.baseMaxHp += (item.hpAdd || 0);
    // 靈藥加成歸入【奇遇】
    player.statsEncounter.speed = (player.statsEncounter.speed || 0) + (item.speedAdd || 0);
    alert(`💊 服下【${item.name}】，奇遇造化湧現，永久氣血 +${item.hpAdd || 0}，身法 +${item.speedAdd || 0}！`);
  }

  if (item.count && item.count > 1) {
    item.count -= 1;
  } else {
    player.inventory.splice(itemIdx, 1);
  }

  recalcPlayerStats();
  renderBagUI();
}

function buyItemToBag(name, cost) {
  if (player.gold < cost) { alert("銀兩不足！"); return; }
  const template = (typeof GLOBAL_ITEMS !== 'undefined') ? GLOBAL_ITEMS.find(i => i.name === name) : null;
  const itemObj = template ? { ...template } : {
    name, type: "weapon", weaponType: "劍", rarity: "良品", atk: 18, speed: 4, desc: "精良兵刃"
  };
  player.gold -= cost;
  player.inventory.push({ ...itemObj, id: "item_" + Date.now() });
  recalcPlayerStats();
  closeModal('modal-scene');
  alert(`🛍️ 購置成功！【${name}】已放入行囊！`);
}

function buyPillToBag(name, cost) {
  if (player.gold < cost) { alert("銀兩不足！"); return; }
  const template = (typeof GLOBAL_ITEMS !== 'undefined') ? GLOBAL_ITEMS.find(i => i.name === name) : null;
  const pillObj = template ? { ...template } : {
    name, type: "pill", rarity: "良品", healHp: 120, desc: "滋補靈丹"
  };
  player.gold -= cost;
  const existing = player.inventory.find(i => i.name === name);
  if (existing) {
    existing.count = (existing.count || 1) + 1;
  } else {
    player.inventory.push({ ...pillObj, id: "pill_" + Date.now(), count: 1 });
  }
  recalcPlayerStats();
  closeModal('modal-scene');
  alert(`💊 購買成功！【${name}】已放入行囊！`);
}

// ==================== 轉世輪迴 (重置先天，歸零奇遇) ====================
var selectedReincarnationHeritage = [];

function openReincarnationModal() {
  closeModal('modal-hero-profile');
  const allowed = 1 + (player.reincarnations || 0);
  const allowEl = document.getElementById('reincarnate-allowed-count');
  if (allowEl) allowEl.innerText = allowed;
  selectedReincarnationHeritage = [];

  const list = document.getElementById('reincarnate-selection-list');
  if (!list) return;
  list.innerHTML = '';

  myLearnedKungfu.forEach(kf => {
    const d = document.createElement('div');
    d.className = 'bag-item-card';
    const evalT = (typeof getKungfuEval === 'function') ? getKungfuEval(kf.tier, kf.progress) : `${kf.tier}重`;
    d.innerHTML = `
      <div>
        <b style="color:#fff;">【武學】${kf.name}</b>
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
      d.innerHTML = `
        <div>
          <b style="color:#fff;">【裝備】${item.name}</b>
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
      alert(`第 ${1 + player.reincarnations} 世輪迴最多只可保留 ${allowed} 項遺產！`);
      checkbox.checked = false;
      return;
    }
    selectedReincarnationHeritage.push({ type, id });
  } else {
    selectedReincarnationHeritage = selectedReincarnationHeritage.filter(h => !(h.type === type && h.id === id));
  }
}

function confirmReincarnation() {
  if (!confirm(`少俠確定要破虛轉世重修嗎？\n已勾選保留 ${selectedReincarnationHeritage.length} 項遺產，轉世後將邁入【第 ${player.reincarnations + 2} 世】！`)) return;

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

  player.reincarnations = (player.reincarnations || 0) + 1;
  player.sect = "無門無派";
  player.sectRank = "無";
  player.curLoc = "牛家村";
  player.gold = 80;
  player.exp = 100;
  player.learn = 80;
  player.combat = 10;
  
  // 新一世先天重骰
  player.statsInnate = {
    arm: 15 + Math.floor(Math.random() * 8),
    speed: 40 + Math.floor(Math.random() * 12),
    bone: 15 + Math.floor(Math.random() * 8),
    inner: 10 + Math.floor(Math.random() * 8),
    int: 20 + Math.floor(Math.random() * 8),
    luck: 15 + Math.floor(Math.random() * 10)
  };
  player.statsEncounter = { arm: 0, speed: 0, bone: 0, inner: 0, int: 0, luck: 0 };

  myLearnedKungfu = (typeof GLOBAL_SKILLS !== 'undefined') ? [
    GLOBAL_SKILLS[0], GLOBAL_SKILLS[1], GLOBAL_SKILLS[2], GLOBAL_SKILLS[3]
  ] : [];

  keptKungfus.forEach(k => {
    if (!myLearnedKungfu.some(x => x.name === k.name)) {
      myLearnedKungfu.push(k);
    }
  });

  player.equippedGear = {
    weapon: { id: "w_init", name: "粗製木劍", type: "weapon", weaponType: "劍", rarity: "凡品", atk: 6, speed: 0, desc: "外攻 +6" },
    armor: { id: "a_init", name: "粗麻布衣", type: "armor", rarity: "凡品", def: 4, hp: 40, desc: "防禦 +4，氣血 +40" }
  };

  player.inventory = [
    { id: "i_pill_init", name: "小金創散", type: "pill", rarity: "凡品", healHp: 120, desc: "調和氣血", count: 2 },
    ...keptGears
  ];

  equippedSlots = {
    internal: myLearnedKungfu.find(k => k.type === 'internal') || myLearnedKungfu[2],
    qinggong: myLearnedKungfu.find(k => k.type === 'qinggong') || myLearnedKungfu[3],
    ext0: myLearnedKungfu[0],
    ext1: myLearnedKungfu[1]
  };

  closeModal('modal-reincarnation');
  recalcPlayerStats();
  if (typeof renderJianghuScenesOnMenu === 'function') renderJianghuScenesOnMenu();
  if (typeof refreshChatForCurrentLocation === 'function') refreshChatForCurrentLocation();
  alert(`✨ 雷劫洗禮，破虛飛昇！少俠已轉生入【第 ${player.reincarnations + 1} 世】！`);
}