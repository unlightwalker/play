/**
 * ========================================================
 * 你的江湖 - 門派系統模組 (sect.js) [天賦接線版]
 * 支援：
 * 1. 宗門晉升、出師挑戰
 * 2. 領取例銀俸祿（接線【窮困潦倒】無法領取、【門派親善】額外增給）
 * 3. 拜師接線【一代宗師】直入內門弟子、【孤僻怪傑】拒入宗門
 * ========================================================
 */

function openSectHallModal(sName) {
  sName = sName || player.sect;
  if (!sName || sName === "無門無派") {
    gameNotify("少俠當前孤身一人，尚未拜入門派！可前往重慶唐門、華山、全真、少林、武當或金刀門拜師！");
    return;
  }

  const sData = (typeof SECT_DATABASE !== 'undefined') ? SECT_DATABASE[sName] : null;
  if (!sData) return;

  const titleEl = document.getElementById('sect-hall-title');
  if (titleEl) titleEl.innerText = `🏯 ${sName}・傳功大殿`;
  const content = document.getElementById('sect-hall-content');
  const isMySect = player.sect === sName;

  let html = `
    <div style="background:#131822; padding:10px; border-radius:5px; border:1px solid #333f52; margin-bottom:12px;">
      <div style="display:flex; justify-content:space-between;">
        <b style="color:var(--green); font-size:14px;">${sData.leaderName}</b>
        <span style="color:var(--gold); font-size:12px;">身份：${isMySect ? player.sectRank : '香客/外人'}</span>
      </div>
      <div style="font-size:12px; color:#aaa; margin-top:2px;">傳功掌事：<span style="color:#5dade2;">${sData.elderName}</span></div>
    </div>
  `;

  if (!isMySect) {
    html += `
      <p style="font-size:12px; color:#bbb; line-height:1.5;">欲拜入【${sName}】，須在此宣誓恪守門規。初入一律為【外門弟子】（身具特異命格者除外）。</p>
      <button class="wuxia-btn" style="width:100%; margin-top:10px; border-color:#2ecc71; color:#2ecc71; font-weight:bold; padding:9px;" onclick="joinSect('${sName}')">
        🙇 叩拜拜入【${sName}】
      </button>
    `;
  } else {
    html += `
      <div style="background:#171d27; border:1px solid #3d4a60; padding:10px; border-radius:4px; margin-bottom:12px;">
        <div style="font-size:12px; font-weight:bold; color:#cad3df;">【宗門位階晉升與出師】</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; margin-bottom:8px;">
          <span style="font-size:12px; color:#aaa;">當前身份：<b style="color:var(--cyan);">${player.sectRank}</b></span>
          ${getRankActionBtn(sName)}
        </div>
        <button class="wuxia-btn" style="width:100%; padding:7px; font-size:12px; border-color:var(--gold); color:var(--gold); font-weight:bold;" onclick="claimSectDaily()">
          💰 領取宗門例銀俸祿 (+30兩銀、+50學點)
        </button>
      </div>
    `;

    html += `<div style="font-size:12.5px; font-weight:bold; color:var(--gold); margin-bottom:6px;">【傳功長老武學傳授】</div>`;
    sData.skills.forEach(sk => {
      const isLearned = myLearnedKungfu.some(k => k.name === sk.name);
      const isRankSatisfied = canLearnRank(player.sectRank, sk.reqRank);
      const statCheck = checkStatsReq(player.stats, sk.reqStats);

      let reqBadge = `<small style="color:#8ca0b3;">門階：【${sk.reqRank}】</small>`;
      if (!statCheck.ok) {
        reqBadge += `<br><small style="color:#e74c3c;">素質不足：${statCheck.reason}</small>`;
      }

      html += `
        <div class="bag-item-card">
          <div>
            <b style="color:#fff;">${sk.name}</b>
            <span class="rarity-badge rarity-${sk.rarity}">${sk.rarity}</span>
            <small style="color:#f1c40f; margin-left:3px;">[需兵刃:${sk.weaponReq}]</small><br>
            ${reqBadge}
          </div>
          <div>
            ${isLearned 
              ? `<span style="font-size:11px; color:#2ecc71; font-weight:bold;">已習得</span>` 
              : `<button class="wuxia-btn" style="padding:4px 8px; font-size:11px; ${(isRankSatisfied && statCheck.ok) ? 'color:var(--gold);' : 'opacity:0.4;'}" 
                  onclick="learnFromElder('${sName}', '${sk.name}')" ${(isRankSatisfied && statCheck.ok) ? '' : 'disabled'}>
                  ${sk.costLearn}學點請教
                </button>`
            }
          </div>
        </div>
      `;
    });
  }

  content.innerHTML = html;
  openModal('modal-sect-hall');
}

// 領取宗門例銀與學點 (接線天賦)
function claimSectDaily() {
  const now = Date.now();
  const lastClaim = player.lastSectClaimTime || 0;
  const cooldown = 180000; // 3分鐘 CD
  if (now - lastClaim < cooldown) {
    const remainSec = Math.ceil((cooldown - (now - lastClaim)) / 1000);
    gameNotify(`宗門俸祿每隔段時間發放，掌門交代請稍後再來領取！（尚餘約 ${remainSec} 秒）`);
    return;
  }

  // 天賦：窮困潦倒 (無法領取俸祿)
  if (player.talents && player.talents.some(t => t.noSectDaily)) {
    gameNotify("你身負【窮困潦倒】厄運，門派長老揮手將你逐出庫房，未能領取俸祿！");
    return;
  }

  player.lastSectClaimTime = now;
  let addGold = 30;
  let addLearn = 50;

  // 天賦：門派親善 (額外多領 15 兩、20 學點)
  if (player.talents && player.talents.some(t => t.sectDailyBonusGold)) {
    addGold += 15;
    addLearn += 20;
  }

  player.gold += addGold;
  player.learn += addLearn;

  if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
  if (typeof autoSave === 'function') autoSave();
  gameNotify(`💰 掌門賜下本期宗門例銀 ${addGold} 兩、學點 ${addLearn} 點！勉勵你刻苦用功！`);
}

function checkStatsReq(userStats, reqStats) {
  if (!reqStats) return { ok: true, reason: "" };
  for (let key in reqStats) {
    if (userStats[key] < reqStats[key]) {
      const names = { arm: "臂力", speed: "身法", bone: "根骨", inner: "內功", int: "悟性", luck: "福緣" };
      return { ok: false, reason: `需【${names[key]}】達到 ${reqStats[key]} 點` };
    }
  }
  return { ok: true, reason: "" };
}

function canLearnRank(userRank, reqRank) {
  const ranks = (typeof SECT_RANKS !== 'undefined') ? SECT_RANKS : ["外門弟子", "內門弟子", "真傳弟子", "長老", "出師大成"];
  const need = ranks.indexOf(reqRank);
  if (!reqRank) return true;
  // 不存在的門階一律視為最高門階，避免任何人都能學
  return ranks.indexOf(userRank) >= (need >= 0 ? need : ranks.length - 1);
}

function getRankActionBtn(sName) {
  if (player.sectRank === "外門弟子") {
    return `<button class="wuxia-btn" style="padding:3px 8px; font-size:11px;" onclick="promoteRank('內門弟子', 30, 200)">晉升內門 (實戰30/修為200)</button>`;
  } else if (player.sectRank === "內門弟子") {
    return `<button class="wuxia-btn" style="padding:3px 8px; font-size:11px;" onclick="promoteRank('真傳弟子', 60, 400)">晉升真傳 (實戰60/修為400)</button>`;
  } else if (player.sectRank === "真傳弟子") {
    return `<button class="wuxia-btn" style="padding:3px 8px; font-size:11px; border-color:var(--purple); color:var(--purple);" onclick="promoteRank('長老', 100, 800)">晉升長老 (實戰100/修為800)</button>`;
  } else if (player.sectRank === "長老") {
    return `<button class="wuxia-btn" style="padding:3px 8px; font-size:11px; border-color:#e74c3c; color:#e74c3c; font-weight:bold;" onclick="challengeMaster('${sName}')">⚔️ 挑戰掌門・出師！</button>`;
  } else if (player.sectRank === "出師大成") {
    return `<span style="font-size:11.5px; color:#2ecc71; font-weight:bold;">★ 已出師大成・一代宗師 ★</span>`;
  }
  return '';
}

function promoteRank(newRank, reqCombat, reqExp) {
  if (player.combat < reqCombat || player.exp < reqExp) {
    gameNotify(`晉升門檻不足！需實戰心得達 ${reqCombat} 點、修為達 ${reqExp} 點！`);
    return;
  }
  player.sectRank = newRank;
  recalcPlayerStats();
  openSectHallModal(player.sect);
  gameNotify(`🎉 恭賀！你的宗門身份已正式晉升為【${newRank}】！`);
}

function challengeMaster(sName) {
  closeModal('modal-sect-hall');
  const sData = (typeof SECT_DATABASE !== 'undefined') ? SECT_DATABASE[sName] : null;
  if (!sData) return;
  gameNotify(`⚡ 你身為【${sName}】長老，正式向【${sData.leaderName}】發起出師印證切磋！`);
  if (typeof startBattleAgainst === 'function') {
    startBattleAgainst(buildEnemyFromData(sData.leaderStats), true);
  }
}

function learnFromElder(sName, skillName) {
  const sData = SECT_DATABASE[sName];
  if (!sData) return;
  const sk = sData.skills.find(s => s.name === skillName);
  if (!sk) return;

  const statCheck = checkStatsReq(player.stats, sk.reqStats);
  if (!statCheck.ok) {
    gameNotify(`身體素質未達要求！${statCheck.reason}`);
    return;
  }
  if (player.learn < sk.costLearn) {
    gameNotify(`學點不足！請教【${sk.name}】需 ${sk.costLearn} 學點！`);
    return;
  }
  player.learn -= sk.costLearn;

  // 武學庫 (data_skills.js) 有同名武學時以武學庫設定為準，否則使用門派內的設定
  myLearnedKungfu.push(createLearnedKungfu(findSkillByRef(sk.name) || sk));

  recalcPlayerStats();
  openSectHallModal(sName);
  gameNotify(`📖 傳功長老親授要訣！你習得了【${sk.rarity}】絕學【${sk.name}】！請至「武學」佩戴！`);
}

function joinSect(sName) {
  if (player.sect !== "無門無派") { gameNotify("欺師滅祖乃江湖大忌！不可另投他派！"); return; }

  // 天賦：孤僻怪傑 (不可拜入任何門派)
  if (player.talents && player.talents.some(t => t.noSect)) {
    gameNotify("你身具【孤僻怪傑】命格，心性獨往獨來，受不得任何門派規矩約束！");
    return;
  }

  player.sect = sName;

  // 天賦：一代宗師 (初始即為內門弟子)
  if (player.talents && player.talents.some(t => t.sectDirectInner)) {
    player.sectRank = "內門弟子";
    gameNotify(`🙇 掌門撫鬚大笑：「奇才！真乃天生武骨！」破格直接晉升你為【${sName}】內門弟子！`);
  } else {
    player.sectRank = "外門弟子";
    gameNotify(`🙇 三拜九叩！你已成為【${sName}】外門弟子！`);
  }

  recalcPlayerStats();
  openSectHallModal(sName);
}

window.openSectHallModal = openSectHallModal;
window.claimSectDaily = claimSectDaily;
window.joinSect = joinSect;
window.promoteRank = promoteRank;
window.challengeMaster = challengeMaster;
window.learnFromElder = learnFromElder;