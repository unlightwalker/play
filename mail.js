/**
 * ========================================================
 * 你的江湖 - 官方動態信件系統 (mail.js) [連通雲端版]
 * 支援：
 * 1. 本地預設官方信件 + Firebase Firestore 全服廣播即時同步
 * 2. 領取狀態持久化保存
 * ========================================================
 */

const DEFAULT_OFFICIAL_MAILS = [
  {
    id: "mail_2026_launch_welcome",
    title: "【江湖昭告】天下英豪聚，仗劍踏紅塵！",
    sender: "天機閣閣主",
    date: "開天闢地",
    content: "各位少俠安好！江湖路遠，風雲詭譎。天機閣特備薄禮一份，助少俠強健筋骨、踏上登峰造極之路！",
    attachments: {
      gold: 100,
      exp: 200,
      learn: 80,
      items: [
        {
          id: "item_init_snow",
          name: "少林大還丹",
          type: "pill",
          rarity: "良品",
          healHp: 300,
          desc: "少林秘製聖藥，服下後 15 分鐘內氣血上限 +300（並補足相應氣血）。",
          count: 2
        }
      ]
    }
  },
  {
    id: "mail_tangmen_launch",
    title: "【江湖盛會】蜀中唐門現世・神品暗器現江湖！",
    sender: "唐家堡 唐老太君",
    date: "巴蜀風雲",
    content: "巴蜀重慶府唐門千機暗器與獨門劇毒名震天下！為廣結天下英才，特贈門派神品暗器與精緻開鋒硬幣！",
    attachments: {
      gold: 50,
      items: [
        {
          id: "mail_coin_50",
          name: "台幣50元",
          type: "weapon",
          weaponType: "暗器",
          rarity: "良品",
          atk: 20,
          speed: 8,
          desc: "【活動限定】金光燦爛的五十元硬幣，破空傷人，外攻+20，身法+8！"
        }
      ],
      skills: [
        {
          id: "kf_tanzhi_gift",
          name: "彈指神通",
          type: "external",
          weaponReq: "暗器",
          rarity: "神品",
          tier: 1,
          progress: 0,
          baseMult: 3.20,
          uniqueVfx: "tanzhi",
          statBonus: { speed: 25, arm: 10 },
          jinyongDesc: "指尖微曲隨即一彈，一道森森氣勁如離弦之箭激射而出！"
        }
      ]
    }
  }
];

let officialMailbox = [...DEFAULT_OFFICIAL_MAILS];

async function fetchOfficialMails(isManual = false) {
  const syncLabel = document.getElementById('mail-sync-time');
  if (syncLabel) syncLabel.innerText = "正在連線天機閣驛站...";

  // 1. 若 Firebase db 可用，自 Firestore 抓取全服廣播信件
  if (typeof db !== 'undefined' && db) {
    try {
      const snap = await db.collection("official_broadcast_mails").orderBy("timestamp", "desc").limit(20).get();
      const cloudMails = [];
      snap.forEach(doc => {
        cloudMails.push({ id: doc.id, ...doc.data() });
      });

      // 合併去重（以 id 為準）
      const map = new Map();
      DEFAULT_OFFICIAL_MAILS.forEach(m => map.set(m.id, m));
      cloudMails.forEach(m => map.set(m.id, m));
      officialMailbox = Array.from(map.values());
    } catch (e) {
      console.warn("[Mail] 讀取雲端全服信件暫緩，載入本地快取信箱:", e);
    }
  }

  if (!player.claimedMails || !Array.isArray(player.claimedMails)) {
    player.claimedMails = [];
  }

  renderMailboxUI();
  updateMailRedDot();

  if (syncLabel) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    syncLabel.innerText = `天機閣驛站連通 (${timeStr} 更新)`;
  }

  if (isManual) {
    gameNotify("📬 飛鴿傳書更新完畢！已為少俠查驗最新江湖驛信！");
  }
}

function openMailModal() {
  fetchOfficialMails(false);
  openModal('modal-mail');
}

function updateMailRedDot() {
  const dot = document.getElementById('mail-red-dot');
  const badge = document.getElementById('mail-unread-badge');
  if (!player.claimedMails) player.claimedMails = [];

  const unclaimedCount = officialMailbox.filter(m => !player.claimedMails.includes(m.id)).length;
  if (dot) dot.style.display = unclaimedCount > 0 ? "block" : "none";
  // 信件已移到設定頁：頭像上也顯示紅點提醒
  const avatarDot = document.getElementById('avatar-mail-dot');
  if (avatarDot) avatarDot.style.display = unclaimedCount > 0 ? "block" : "none";
  if (badge) {
    badge.style.display = unclaimedCount > 0 ? "inline-block" : "none";
    badge.innerText = `${unclaimedCount} 未領`;
  }
}

function renderMailboxUI() {
  const box = document.getElementById('mail-list-container');
  if (!box) return;
  box.innerHTML = '';

  if (officialMailbox.length === 0) {
    box.innerHTML = `<div style="text-align:center; color:#888; font-size:12px; padding:30px;">暫無江湖驛信。</div>`;
    return;
  }

  officialMailbox.forEach(mail => {
    const isClaimed = player.claimedMails.includes(mail.id);
    const card = document.createElement('div');
    card.style.cssText = `
      background: #141923;
      border: 1px solid ${isClaimed ? '#2d3748' : '#3d4a60'};
      border-left: 3.5px solid ${isClaimed ? '#718096' : 'var(--gold)'};
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 10px;
    `;

    let attachmentDesc = [];
    if (mail.attachments) {
      if (mail.attachments.gold) attachmentDesc.push(`碎銀 ${mail.attachments.gold}兩`);
      if (mail.attachments.exp) attachmentDesc.push(`修為 ${mail.attachments.exp}點`);
      if (mail.attachments.learn) attachmentDesc.push(`學點 ${mail.attachments.learn}點`);
      if (mail.attachments.items) {
        mail.attachments.items.forEach(it => attachmentDesc.push(`【${it.rarity || '良品'}】${it.name}`));
      }
      if (mail.attachments.skills) {
        mail.attachments.skills.forEach(sk => attachmentDesc.push(`【${sk.rarity || '神品'}武學】${sk.name}`));
      }
    }

    const attachHtml = attachmentDesc.length > 0
      ? `<div style="background:#1b2230; border:1px dashed #34495e; padding:5px 8px; border-radius:4px; font-size:11.5px; color:var(--gold); margin:6px 0;">
          🎁 隨函附件：${attachmentDesc.join('、')}
        </div>`
      : '';

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <b style="color:${isClaimed ? '#a0aec0' : '#fff'}; font-size:13px;">${mail.title}</b>
        <small style="color:#718096; font-size:10px;">${mail.sender}・${mail.date || '即時'}</small>
      </div>
      <div style="font-size:12px; color:#cfd9e6; line-height:1.6; margin-bottom:6px;">
        ${mail.content}
      </div>
      ${attachHtml}
      <div style="display:flex; justify-content:flex-end; margin-top:6px;">
        <button class="wuxia-btn" style="padding:4px 12px; font-size:11.5px; ${isClaimed ? 'opacity:0.4; border-color:#555; color:#888;' : 'border-color:#2ecc71; color:#2ecc71; font-weight:bold;'}" 
          onclick="claimSingleMail('${mail.id}')" ${isClaimed ? 'disabled' : ''}>
          ${isClaimed ? '✔ 附件已領取' : '🎁 領取此信附件'}
        </button>
      </div>
    `;
    box.appendChild(card);
  });
}

function claimSingleMail(mailId) {
  const mail = officialMailbox.find(m => m.id === mailId);
  if (!mail) return;

  if (player.claimedMails && player.claimedMails.includes(mailId)) {
    gameNotify("此信件之附件早已領取完畢！");
    return;
  }

  if (mail.attachments) {
    if (mail.attachments.gold) player.gold += Number(mail.attachments.gold);
    if (mail.attachments.exp) player.exp += Number(mail.attachments.exp);
    if (mail.attachments.learn) player.learn += Number(mail.attachments.learn);

    if (Array.isArray(mail.attachments.items)) {
      mail.attachments.items.forEach(it => {
        player.inventory.push({ ...it, id: "mail_item_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4) });
      });
    }

    if (Array.isArray(mail.attachments.skills)) {
      mail.attachments.skills.forEach(sk => {
        if (!myLearnedKungfu.some(k => k.name === sk.name)) {
          myLearnedKungfu.push({ ...sk, id: "mail_kf_" + Date.now(), tier: 1, progress: 0 });
        }
      });
    }
  }

  player.claimedMails.push(mailId);
  if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
  if (typeof autoSave === 'function') autoSave();

  renderMailboxUI();
  updateMailRedDot();
  gameNotify(`🎉 領取成功！已收錄《${mail.title}》的隨函贈禮！`);
}

function sendOfficialMail(mailObj) {
  if (!mailObj || !mailObj.title) return;
  const newMail = {
    id: "mail_gm_" + Date.now(),
    title: mailObj.title,
    sender: mailObj.sender || "天機閣特使",
    date: "即時快馬",
    content: mailObj.content || "天機閣賜下江湖快信，請少俠查收。",
    attachments: mailObj.attachments || {}
  };
  officialMailbox.unshift(newMail);
  updateMailRedDot();
  if (document.getElementById('modal-mail').classList.contains('show')) {
    renderMailboxUI();
  }
}

window.openMailModal = openMailModal;
window.fetchOfficialMails = fetchOfficialMails;
window.claimSingleMail = claimSingleMail;
window.updateMailRedDot = updateMailRedDot;
window.sendOfficialMail = sendOfficialMail;