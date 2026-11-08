

// ★ 請在此處填入你在 Firebase 控制台第一階段取得的真實配置 ★
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoezeH-Uf_Mvx7H_zpe6S6y2kpt7-tHg0",
  authDomain: "unlightwalker.firebaseapp.com",
  databaseURL: "https://unlightwalker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "unlightwalker",
  storageBucket: "unlightwalker.firebasestorage.app",
  messagingSenderId: "166316206169",
  appId: "1:166316206169:web:69fece8a88b29e9716e948",
  measurementId: "G-4ZMBQ9FH3Y"
};

// 初始化 Firebase 實例 (使用 Compat 模式，純前端免打包直跑)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// 當前登入的雲端玩家與 GM 狀態
let currentCloudUser = null;
let isCurrentPlayerGM = false;

// ==================== 1. 監聽玩家登入狀態 ====================
auth.onAuthStateChanged(async (user) => {
  const authStatusLabel = document.getElementById('auth-status-label');
  const btnAuthOpen = document.getElementById('btn-auth-open');
  const gmSection = document.getElementById('dynamic-gm-section');

  if (user) {
    currentCloudUser = user;
    const isGuest = user.isAnonymous;
    const dispName = isGuest ? "👤 遊客連線中" : `☁️ ${user.email.split('@')[0]}`;
    
    if (authStatusLabel) authStatusLabel.innerText = dispName;
    if (btnAuthOpen) btnAuthOpen.innerText = "帳號中心";

    console.log(`[Firebase] 玩家連線成功: ${user.uid} (${isGuest ? '遊客' : user.email})`);

    // 登入後立即自雲端讀取存檔與驗證是否具備 GM 權限 (isGM: true)
    await loadCloudSave(user.uid);
  } else {
    currentCloudUser = null;
    isCurrentPlayerGM = false;
    if (authStatusLabel) authStatusLabel.innerText = "⚡ 本地遊玩中";
    if (btnAuthOpen) btnAuthOpen.innerText = "登入 / 註冊";
    if (gmSection) gmSection.innerHTML = '';
  }
});

// ==================== 2. 帳密註冊、登入與登出 ====================
async function handleUserRegister(email, password) {
  if (!email || !password) {
    alert("請填寫完整的電子郵件與密碼！");
    return;
  }
  if (password.length < 6) {
    alert("密碼長度需至少 6 位字元！");
    return;
  }

  try {
    const cred = await auth.createUserWithEmailAndPassword(email.trim(), password);
    alert(`🎉 俠客帳號註冊成功！歡迎踏入江湖：${email}`);
    closeModal('modal-auth');

    // 註冊成功後，建立初始文件並將當前本地遊戲進度直接上傳雲端
    await uploadSaveToCloud();
  } catch (err) {
    alert(`⚠️ 註冊失敗：${err.message}`);
  }
}

async function handleUserLogin(email, password) {
  if (!email || !password) {
    alert("請輸入電子郵件與密碼！");
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email.trim(), password);
    alert(`✨ 登入成功！已連通雲端藏經閣！`);
    closeModal('modal-auth');
  } catch (err) {
    alert(`⚠️ 登入失敗：${err.message}`);
  }
}

async function handleUserLogout() {
  if (confirm("確定要登出當前帳號並切換回本地模式嗎？")) {
    await auth.signOut();
    alert("已安全登出帳號。");
    closeModal('modal-auth');
  }
}

// 支援遊客快速試玩模式 (免輸入帳密)
async function handleGuestLogin() {
  try {
    await auth.signInAnonymously();
    alert("已啟用遊客雲端連線模式！");
    closeModal('modal-auth');
  } catch (err) {
    alert(`遊客連線失敗：${err.message}`);
  }
}

// ==================== 3. 雲端同步存檔與 GM 身份辨識 ====================
// 上傳存檔至雲端 (支援保留原有 isGM 等元數據)
async function uploadSaveToCloud() {
  if (!currentCloudUser) return;
  try {
    const saveData = {
      player: typeof player !== 'undefined' ? player : {},
      equippedSlots: typeof equippedSlots !== 'undefined' ? {
        internalId: equippedSlots.internal ? equippedSlots.internal.id : null,
        qinggongId: equippedSlots.qinggong ? equippedSlots.qinggong.id : null,
        ext0Id: equippedSlots.ext0 ? equippedSlots.ext0.id : null,
        ext1Id: equippedSlots.ext1 ? equippedSlots.ext1.id : null
      } : {},
      myLearnedKungfu: typeof myLearnedKungfu !== 'undefined' ? myLearnedKungfu : [],
      saveTimestamp: Date.now()
    };

    // 使用 set merge 模式，絕不覆蓋 Firestore 中手動給予的 isGM: true
    await db.collection("player_saves").doc(currentCloudUser.uid).set(saveData, { merge: true });
    console.log("[Firebase] 雲端存檔同步成功！");
  } catch (e) {
    console.error("[Firebase] 雲端存檔同步失敗:", e);
  }
}

// 從雲端下載存檔並動態辨識 GM 權限
async function loadCloudSave(uid) {
  try {
    const docRef = db.collection("player_saves").doc(uid);
    const doc = await docRef.get();

    if (doc.exists) {
      const data = doc.data();

      // ★ 核心需求：從帳戶資料庫中讀取辨識是否為 GM ★
      isCurrentPlayerGM = (data.isGM === true || data.role === 'gm');
      console.log(`[Firebase] 帳戶權限校驗完成，GM 身份：${isCurrentPlayerGM}`);

      // 動態更新帳號中心內的 GM 專屬功能區
      renderDynamicGMSection(isCurrentPlayerGM);

      // 下載角色存檔資料
      if (data.player && typeof player !== 'undefined') {
        player = Object.assign(player, data.player);
      }
      if (Array.isArray(data.myLearnedKungfu) && typeof myLearnedKungfu !== 'undefined') {
        myLearnedKungfu = data.myLearnedKungfu;
      }
      if (typeof syncSaveWithGameData === 'function') syncSaveWithGameData();
      if (data.equippedSlots && typeof equippedSlots !== 'undefined') {
        equippedSlots.internal = myLearnedKungfu.find(k => k.id === data.equippedSlots.internalId) || null;
        equippedSlots.qinggong = myLearnedKungfu.find(k => k.id === data.equippedSlots.qinggongId) || null;
        equippedSlots.ext0 = myLearnedKungfu.find(k => k.id === data.equippedSlots.ext0Id) || null;
        equippedSlots.ext1 = myLearnedKungfu.find(k => k.id === data.equippedSlots.ext1Id) || null;
      }

      // 觸發全域刷新
      if (typeof sanitizePlayerData === 'function') sanitizePlayerData();
      if (typeof recalcPlayerStats === 'function') recalcPlayerStats();
      if (typeof renderJianghuScenesOnMenu === 'function') renderJianghuScenesOnMenu();
      if (typeof renderNineGridMap === 'function') renderNineGridMap();
      if (typeof refreshChatForCurrentLocation === 'function') refreshChatForCurrentLocation();

      console.log("☁️ 雲端角色進度與武林狀態載入完畢！");
    } else {
      // 首次登入尚無雲端存檔時，自動將當前本地進度建立上傳
      await uploadSaveToCloud();
    }
  } catch (e) {
    console.error("[Firebase] 讀取雲端存檔失敗:", e);
  }
}

// ==================== 4. 動態 GM 操作面板渲染 ====================
// 僅當資料庫中包含 isGM: true 時，才在帳號中心動態生成控制項
function renderDynamicGMSection(isGM) {
  const gmSection = document.getElementById('dynamic-gm-section');
  if (!gmSection) return;

  if (isGM) {
    gmSection.innerHTML = `
      <div style="border-top:1.5px dashed #e74c3c; padding-top:10px; margin-top:10px; text-align:left;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <b style="color:#ff4757; font-size:12px;">👑 天機閣管理員 (GM 權限已認證)</b>
          <small style="color:#f1c40f; font-size:10px;">資料庫直連</small>
        </div>
        <input type="text" id="gm-mail-title" placeholder="全服信件標題 (如：開服盛典補貼)" class="wuxia-btn" style="width:100%; padding:6px; margin-bottom:5px; background:#111; text-align:left; cursor:text; font-size:11.5px;">
        <textarea id="gm-mail-content" placeholder="信件公告內文..." class="wuxia-btn" style="width:100%; height:50px; padding:6px; margin-bottom:5px; background:#111; text-align:left; cursor:text; resize:none; font-size:11.5px;"></textarea>
        
        <div style="display:flex; gap:6px; margin-bottom:8px;">
          <input type="number" id="gm-mail-gold" placeholder="附送碎銀(兩)" class="wuxia-btn" style="flex:1; padding:5px; background:#111; text-align:left; cursor:text; font-size:11px;">
          <input type="number" id="gm-mail-learn" placeholder="附送學點" class="wuxia-btn" style="flex:1; padding:5px; background:#111; text-align:left; cursor:text; font-size:11px;">
        </div>

        <button class="wuxia-btn" style="width:100%; border-color:#e74c3c; color:#ff4757; font-weight:bold; padding:7px; font-size:12px;" onclick="executeGMBroadcastMail()">
          🚀 發布全服官方信件
        </button>
      </div>
    `;
  } else {
    gmSection.innerHTML = ''; // 非 GM 保持完全空白，不留任何痕跡
  }
}

// 執行 GM 全服發信
async function executeGMBroadcastMail() {
  if (!isCurrentPlayerGM) {
    alert("權限不足！只有資料庫認證的 GM 帳號方可發送信件！");
    return;
  }

  const titleEl = document.getElementById('gm-mail-title');
  const contentEl = document.getElementById('gm-mail-content');
  const goldEl = document.getElementById('gm-mail-gold');
  const learnEl = document.getElementById('gm-mail-learn');

  const title = titleEl ? titleEl.value.trim() : "";
  const content = contentEl ? contentEl.value.trim() : "";
  const gold = goldEl ? Number(goldEl.value) || 0 : 0;
  const learn = learnEl ? Number(learnEl.value) || 0 : 0;

  if (!title || !content) {
    alert("請填寫信件標題與公告內文！");
    return;
  }

  const mailData = {
    id: "mail_cloud_" + Date.now(),
    title: title,
    sender: "天機閣・管理員",
    date: "即時詔令",
    content: content,
    attachments: {
      gold: gold,
      learn: learn
    },
    timestamp: Date.now()
  };

  try {
    // 寫入 Firestore 的公共廣播集合中
    await db.collection("official_broadcast_mails").add(mailData);

    // 同步將這封信直接插入到本機客戶端的信箱中
    if (typeof sendOfficialMail === 'function') {
      sendOfficialMail(mailData);
    }

    alert(`📢 全服詔令發布成功！已派發《${title}》！`);
    if (titleEl) titleEl.value = "";
    if (contentEl) contentEl.value = "";
    if (goldEl) goldEl.value = "";
    if (learnEl) learnEl.value = "";
  } catch (err) {
    alert(`發布失敗：${err.message}`);
  }
}

// ==================== 5. 掛載全域供呼叫 ====================
window.handleUserRegister = handleUserRegister;
window.handleUserLogin = handleUserLogin;
window.handleUserLogout = handleUserLogout;
window.handleGuestLogin = handleGuestLogin;
window.uploadSaveToCloud = uploadSaveToCloud;
window.loadCloudSave = loadCloudSave;
window.executeGMBroadcastMail = executeGMBroadcastMail;