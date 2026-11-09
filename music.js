/**
 * ========================================================
 * 你的江湖 - 背景音樂 (music.js)
 * 1. 播放 data_settings.js 中的播放清單：bgm/（純音樂）、song/（有人聲的歌曲）
 * 2. 清單為空時，以 Web Audio 即時生成五聲音階（宮商角徵羽）的古琴風撥弦旋律
 * 瀏覽器規定需使用者點擊後才能發聲，因此開啟後會在下一次點擊時開始播放。
 * ========================================================
 */
const JianghuMusic = (() => {
  let ctx = null, master = null, reverb = null, timer = null, playing = false;
  let volume = 0.5, step = 0, degree = 5;
  // G 宮調五聲音階（相對半音）：宮 商 角 徵 羽
  const SCALE = [0, 2, 4, 7, 9];
  const BASE = 196; // G3

  const freqOf = d => BASE * Math.pow(2, (Math.floor(d / 5) * 12 + SCALE[((d % 5) + 5) % 5]) / 12);

  function ensureCtx() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = volume * 0.22;
    // 簡易殘響：兩條回授延遲
    reverb = ctx.createGain();
    reverb.gain.value = 0.35;
    [0.23, 0.37].forEach(t => {
      const d = ctx.createDelay(1);
      d.delayTime.value = t;
      const fb = ctx.createGain();
      fb.gain.value = 0.32;
      reverb.connect(d); d.connect(fb); fb.connect(d); d.connect(master);
    });
    master.connect(ctx.destination);
  }

  // 撥弦：三角波 + 泛音，快速起音、指數衰減，低通濾波讓音色溫潤
  function pluck(freq, when, dur, gain) {
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    const g = ctx.createGain(), f = ctx.createBiquadFilter();
    o1.type = 'triangle'; o1.frequency.value = freq;
    o2.type = 'sine'; o2.frequency.value = freq * 2.01;
    f.type = 'lowpass';
    f.frequency.setValueAtTime(2600, when);
    f.frequency.exponentialRampToValueAtTime(500, when + dur);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    const g2 = ctx.createGain(); g2.gain.value = 0.25;
    o1.connect(g); o2.connect(g2); g2.connect(g);
    g.connect(f); f.connect(master); f.connect(reverb);
    o1.start(when); o2.start(when);
    o1.stop(when + dur + 0.05); o2.stop(when + dur + 0.05);
  }

  function tick() {
    if (!playing || !ctx) return;
    const now = ctx.currentTime + 0.05;
    step++;
    // 每 8 拍落一個低音根音
    if (step % 8 === 1) pluck(freqOf(degree % 5 === 3 ? -2 : -5), now, 3.2, 0.5);
    // 旋律：在兩個八度間隨機漫步，偶爾休止、偶爾滑音雙音
    if (Math.random() > 0.18) {
      degree = Math.max(0, Math.min(10, degree + [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]));
      pluck(freqOf(degree), now, 1.8, 0.42);
      if (Math.random() < 0.15) pluck(freqOf(degree + 2), now + 0.12, 1.4, 0.25);
    }
    timer = setTimeout(tick, [420, 560, 560, 700, 840, 1120][Math.floor(Math.random() * 6)]);
  }

  // ==================== 播放清單（bgm/ 純音樂、song/ 歌曲）；清單為空時改播上方的古琴旋律 ====================
  let mode = "none", audio = null, queue = [], current = null;
  const playlist = m => {
    const cfg = (typeof GAME_CONFIG !== 'undefined' && GAME_CONFIG.music) || {};
    return (Array.isArray(cfg[m]) ? cfg[m] : []).map(t => typeof t === 'string' ? { file: t, title: t.split('/').pop() } : t).filter(t => t && t.file);
  };
  function nextTrack() {
    const list = playlist(mode);
    if (!list.length) return null;
    if (!queue.length) {
      queue = list.slice();
      const cfg = (typeof GAME_CONFIG !== 'undefined' && GAME_CONFIG.music) || {};
      if (cfg.shuffle !== false) for (let i = queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [queue[i], queue[j]] = [queue[j], queue[i]]; }
      if (current && queue.length > 1 && queue[0].file === current.file) queue.push(queue.shift()); // 避免同一首連播
    }
    return queue.shift();
  }
  function playFile() {
    const t = nextTrack();
    if (!t) return false;
    current = t;
    if (!audio) {
      audio = new Audio();
      audio.addEventListener('ended', () => { errors = 0; if (mode !== 'none') playFile(); });
      audio.addEventListener('playing', () => { errors = 0; });
      // 檔案不存在或無法播放：換下一首；整份清單都失敗時改播內建旋律
      audio.addEventListener('error', () => {
        if (mode === 'none') return;
        errors++;
        if (errors >= playlist(mode).length) { fallback(); return; }
        setTimeout(playFile, 500);
      });
    }
    audio.src = encodeURI(t.file);
    audio.volume = volume;
    audio.play().catch(() => {});
    if (typeof onTrackChange === 'function') onTrackChange(t);
    return true;
  }
  let onTrackChange = null, errors = 0;
  function fallback() {
    if (audio) audio.pause();
    current = { title: "內建古琴旋律", builtin: true };
    if (typeof onTrackChange === 'function') onTrackChange(current);
    ensureCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (!playing) { playing = true; tick(); }
  }
  function stopAll() {
    playing = false;
    clearTimeout(timer);
    if (audio) { audio.pause(); }
  }

  return {
    // 切換音樂模式："none" 無音樂 / "song" 音樂 / "bgm" 純音樂
    setMode(m) {
      mode = m || "none";
      stopAll();
      queue = [];
      current = null;
      errors = 0;
      if (mode === "none") { if (typeof onTrackChange === 'function') onTrackChange(null); return; }
      if (!playFile()) fallback(); // 清單是空的：改播內建旋律
    },
    next() { if (mode !== "none" && audio && current && !current.builtin) playFile(); },
    current: () => current,
    onTrack(fn) { onTrackChange = fn; },
    start() {
      ensureCtx();
      if (!ctx) return false;
      if (ctx.state === 'suspended') ctx.resume();
      if (playing) return true;
      playing = true;
      tick();
      return true;
    },
    stop() {
      playing = false;
      clearTimeout(timer);
    },
    setVolume(v) {
      volume = Math.max(0, Math.min(1, Number(v) || 0));
      if (master) master.gain.value = volume * 0.22;
      if (audio) audio.volume = volume;
    },
    isPlaying: () => playing
  };
})();

window.JianghuMusic = JianghuMusic;
