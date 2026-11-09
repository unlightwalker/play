/**
 * ========================================================
 * 你的江湖 - 手機觸控保護 (touch_guard.js)
 * 1. 連續點擊（雙擊）不會放大畫面；雙指縮放也被停用（iOS Safari 會忽略 user-scalable=no，需以程式攔截）
 * 2. 手指左右拖動時，整個頁面不會被左右拉動；可以左右捲動的區塊（例如武學分類列）仍可正常捲動
 * ========================================================
 */
(() => {
  const isField = el => el && el.closest && el.closest('input, textarea, select, [contenteditable="true"]');

  // iOS：雙指縮放手勢
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(ev =>
    document.addEventListener(ev, e => e.preventDefault(), { passive: false }));

  // 雙指觸控（縮放）
  document.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });

  // 連點放大：300ms 內第二次觸碰結束時取消預設行為，並補送 click 讓按鈕照常觸發
  let lastTouchEnd = 0;
  document.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - lastTouchEnd < 320 && !isField(e.target)) {
      e.preventDefault();
      const t = e.changedTouches && e.changedTouches[0];
      const target = t ? document.elementFromPoint(t.clientX, t.clientY) : e.target;
      if (target && typeof target.click === 'function') target.click();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // 左右拖動：只有在手指所在處沒有可左右捲動的區塊時才攔截
  let sx = 0, sy = 0, decided = null;
  const canScrollX = el => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const st = getComputedStyle(n);
      if ((st.overflowX === 'auto' || st.overflowX === 'scroll') && n.scrollWidth > n.clientWidth + 1) return true;
    }
    return false;
  };
  document.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; decided = null;
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
    if (decided === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      decided = Math.abs(dx) > Math.abs(dy) && !canScrollX(e.target) && !isField(e.target) ? 'block' : 'allow';
    }
    if (decided === 'block') e.preventDefault();
  }, { passive: false });
})();
