/**
 * ========================================================
 * 你的江湖 - 戰鬥特效與動畫獨立模組 (combat_vfx.js)
 * 【Canvas 光影引擎版】
 *
 * 1. 所有招式光影以 Canvas 即時繪製：錐形刀光、拖尾、粒子、衝擊波、閃光、真實頓幀
 * 2. VFX_PRESET_MAP 的特效名稱維持不變，editor.html 與既有武學設定 (vfxChain) 直接沿用
 * 3. 支援前搖(攻擊方) / 命中(受擊方) / 收招殘影(自選位置)，敵方絕招自動左右鏡像
 * 4. 出招衝刺、施法、受擊後仰等角色動作亦由此模組統一調度（遊戲與編輯器共用）
 * ========================================================
 */

// ==================== 0. 數學與色彩工具 ====================
const VFX_TAU = Math.PI * 2;
const vClamp = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const vLerp = (a, b, t) => a + (b - a) * t;
const vEaseOut = t => 1 - Math.pow(1 - vClamp(t), 3);
const vEaseIn = t => Math.pow(vClamp(t), 3);
const vEaseInOut = t => { t = vClamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const vRand = (a, b) => a + Math.random() * (b - a);
const vFade = (t, fin, fout) => Math.min(fin > 0 ? vClamp(t / fin) : 1, fout > 0 ? vClamp((1 - t) / fout) : 1);

const _vfxRgbCache = {};
function vfxRgba(hex, a) {
  let c = _vfxRgbCache[hex];
  if (!c) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
    c = _vfxRgbCache[hex] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  return `rgba(${c[0]},${c[1]},${c[2]},${a < 0 ? 0 : a > 1 ? 1 : a})`;
}

// ==================== 1. Canvas 舞台與主迴圈 ====================
const VFX_ENGINE = { hitstopUntil: 0, debugFreeze: false };

function getVfxStage(container) {
  let st = container.__vfxStage;
  if (!st || st.canvas.parentNode !== container) {
    const canvas = document.createElement('canvas');
    canvas.className = 'vfx-canvas';
    canvas.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(canvas);
    st = { container, canvas, ctx: canvas.getContext('2d'), items: [], parts: [], W: 0, H: 0, dpr: 1, last: 0, running: false };
    container.__vfxStage = st;
  }
  const W = container.clientWidth || 398, H = container.clientHeight || 200;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (W !== st.W || H !== st.H || dpr !== st.dpr) {
    st.W = W; st.H = H; st.dpr = dpr;
    st.canvas.width = Math.round(W * dpr);
    st.canvas.height = Math.round(H * dpr);
  }
  return st;
}

function runVfxStage(st) {
  if (st.running) return;
  st.running = true;
  st.last = performance.now();
  requestAnimationFrame(t => tickVfxStage(st, t));
}

function tickVfxStage(st, now) {
  let dt = Math.min(50, now - st.last);
  st.last = now;
  // 頓幀：刀光等特效凍結，命中閃光 / 火花 (live) 照常播放
  if (VFX_ENGINE.debugFreeze) {
    st.items.forEach(it => { it.start += dt; });
    dt = 0;
  } else if (now < VFX_ENGINE.hitstopUntil) {
    st.items.forEach(it => { if (!it.live) it.start += dt; });
  }

  const ctx = st.ctx;
  ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
  ctx.clearRect(0, 0, st.W, st.H);

  st.items = st.items.filter(it => now - it.start < it.dur);
  for (const it of st.items) {
    const t = (now - it.start) / it.dur;
    if (t < 0) continue;
    ctx.save();
    ctx.globalCompositeOperation = it.blend;
    if (it.mirror) { ctx.translate(st.W, 0); ctx.scale(-1, 1); }
    try { it.draw(ctx, t, st, it); } catch (e) { console.warn('VFX draw', e); }
    ctx.restore();
  }

  const k = dt / 16.67;
  st.parts = st.parts.filter(p => (p.age += dt) < p.life);
  for (const p of st.parts) {
    if (k > 0) {
      const dr = Math.pow(p.drag, k);
      p.vx *= dr;
      p.vy = p.vy * dr + p.g * k;
      p.x += p.vx * k;
      p.y += p.vy * k;
      p.rot += p.vr * k;
    }
    drawVfxParticle(ctx, p, st);
  }

  if (st.items.length || st.parts.length) {
    requestAnimationFrame(t => tickVfxStage(st, t));
  } else {
    st.running = false;
    ctx.clearRect(0, 0, st.W, st.H);
  }
}

function drawVfxParticle(ctx, p, st) {
  const u = p.age / p.life;
  const a = (1 - u) * (u < 0.1 ? u / 0.1 : 1) * p.alpha;
  if (a <= 0) return;
  ctx.save();
  ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
  if (p.mirror) { ctx.translate(st.W, 0); ctx.scale(-1, 1); }
  ctx.globalCompositeOperation = p.blend;
  const s = p.size * (p.shrink ? (1 - u * 0.7) : 1);
  if (p.shape === 'spark' || p.shape === 'needle') {
    const len = p.len * (p.shape === 'needle' ? 1 : (1 - u * 0.5));
    const sp = Math.hypot(p.vx, p.vy) || 1;
    ctx.strokeStyle = vfxRgba(p.color, a);
    ctx.lineWidth = s;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.vx / sp * len, p.y - p.vy / sp * len);
    ctx.stroke();
    if (p.shape === 'spark') {
      ctx.strokeStyle = vfxRgba('#ffffff', a);
      ctx.lineWidth = s * 0.45;
      ctx.stroke();
    }
  } else if (p.shape === 'petal') {
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = vfxRgba(p.color, a);
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.45, 0, 0, VFX_TAU);
    ctx.fill();
  } else if (p.shape === 'shard') {
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = vfxRgba(p.color, a);
    ctx.beginPath();
    ctx.moveTo(-s, -s * 0.6);
    ctx.lineTo(s * 0.9, -s * 0.2);
    ctx.lineTo(-s * 0.2, s);
    ctx.closePath();
    ctx.fill();
  } else {
    const r = s * (p.shape === 'ember' ? (0.8 + Math.sin(p.age * 0.05 + p.rot) * 0.25) : 1);
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.2);
    g.addColorStop(0, vfxRgba('#ffffff', a));
    g.addColorStop(0.3, vfxRgba(p.color, a * 0.9));
    g.addColorStop(1, vfxRgba(p.color, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 2.2, 0, VFX_TAU);
    ctx.fill();
  }
  ctx.restore();
}

// ==================== 2. 繪圖基本元件 ====================
const VD = {
  glow(ctx, x, y, r, col, a) {
    if (a <= 0 || r <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, vfxRgba('#ffffff', a));
    g.addColorStop(0.25, vfxRgba(col, a * 0.85));
    g.addColorStop(1, vfxRgba(col, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, VFX_TAU);
    ctx.fill();
  },

  // 錐形月牙刀光：u0~u1 為顯示的弧段比例，頭粗尾細
  crescentPath(ctx, cx, cy, r, a0, a1, w, u0, u1) {
    const N = 28;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const k = i / N, a = vLerp(a0, a1, vLerp(u0, u1, k));
      const th = w * 0.5 * Math.sin(Math.PI * Math.pow(k, 1.6));
      const x = cx + Math.cos(a) * (r + th), y = cy + Math.sin(a) * (r + th);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    for (let i = N; i >= 0; i--) {
      const k = i / N, a = vLerp(a0, a1, vLerp(u0, u1, k));
      const th = w * 0.5 * Math.sin(Math.PI * Math.pow(k, 1.6));
      ctx.lineTo(cx + Math.cos(a) * (r - th), cy + Math.sin(a) * (r - th));
    }
    ctx.closePath();
  },
  crescent(ctx, cx, cy, r, a0, a1, w, col, alpha, u0 = 0, u1 = 1) {
    if (alpha <= 0 || u1 - u0 < 0.005) return;
    VD.crescentPath(ctx, cx, cy, r, a0, a1, w * 1.9, u0, u1);
    ctx.fillStyle = vfxRgba(col, alpha * 0.35);
    ctx.fill();
    VD.crescentPath(ctx, cx, cy, r, a0, a1, w, u0, u1);
    ctx.shadowBlur = w * 1.6;
    ctx.shadowColor = vfxRgba(col, alpha);
    ctx.fillStyle = vfxRgba(col, alpha * 0.9);
    ctx.fill();
    ctx.shadowBlur = 0;
    VD.crescentPath(ctx, cx, cy, r, a0, a1, w * 0.38, u0, u1);
    ctx.fillStyle = vfxRgba('#ffffff', alpha);
    ctx.fill();
  },

  line(ctx, x0, y0, x1, y1, w, col, a, core = true) {
    if (a <= 0) return;
    ctx.lineCap = 'round';
    ctx.shadowBlur = w * 2;
    ctx.shadowColor = vfxRgba(col, a);
    ctx.strokeStyle = vfxRgba(col, a);
    ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.shadowBlur = 0;
    if (core) {
      ctx.strokeStyle = vfxRgba('#ffffff', a);
      ctx.lineWidth = Math.max(1, w * 0.35);
      ctx.stroke();
    }
  },

  // 漸層拖尾 (尾端透明 → 頭端亮)
  trail(ctx, x0, y0, x1, y1, w, col, a) {
    if (a <= 0) return;
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, vfxRgba(col, 0));
    g.addColorStop(0.7, vfxRgba(col, a * 0.6));
    g.addColorStop(1, vfxRgba('#ffffff', a));
    ctx.strokeStyle = g;
    ctx.lineCap = 'round';
    ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  },

  ring(ctx, x, y, r, w, col, a, squash = 1) {
    if (a <= 0 || r <= 0) return;
    ctx.shadowBlur = w * 3;
    ctx.shadowColor = vfxRgba(col, a);
    ctx.strokeStyle = vfxRgba(col, a);
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * squash, 0, 0, VFX_TAU);
    ctx.stroke();
    ctx.shadowBlur = 0;
  },

  // 十字星芒
  glint(ctx, x, y, size, col, a, rot = 0) {
    if (a <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    for (let i = 0; i < 2; i++) {
      const g = ctx.createLinearGradient(-size, 0, size, 0);
      g.addColorStop(0, vfxRgba(col, 0));
      g.addColorStop(0.5, vfxRgba('#ffffff', a));
      g.addColorStop(1, vfxRgba(col, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-size, 0); ctx.lineTo(0, -size * 0.07); ctx.lineTo(size, 0); ctx.lineTo(0, size * 0.07);
      ctx.closePath();
      ctx.fill();
      ctx.rotate(Math.PI / 2);
    }
    ctx.restore();
    VD.glow(ctx, x, y, size * 0.35, col, a);
  }
};

// ==================== 3. 特效建構器 ====================
function makeVfx(container, opt = {}) {
  const st = getVfxStage(container);
  const W = st.W, H = st.H, mirror = !!opt.mirror;
  const bodyY = H - 88;
  const A = { x: 82, y: bodyY }, T = { x: W - 82, y: bodyY }, C = { x: W / 2, y: bodyY };
  const fx = {
    st, W, H, A, T, C, mirror,
    groundY: H - 22,
    at(pos) { return pos === 'attacker' ? A : (pos === 'center' ? C : T); },
    // 出手起點：效果在攻擊方本地播放時，從其身後一點起手
    from(F) { return F === A ? { x: A.x - 30, y: A.y } : { x: A.x + 34, y: A.y - 4 }; },
    add(delay, dur, draw, o = {}) {
      st.items.push({ start: performance.now() + delay, dur, draw, blend: o.blend || 'lighter', mirror: mirror && !o.noMirror, live: !!o.live });
      runVfxStage(st);
    },
    later(delay, fn) { setTimeout(fn, Math.max(0, delay)); },
    particle(p) {
      st.parts.push(Object.assign({ vx: 0, vy: 0, g: 0, drag: 0.94, age: 0, life: 500, size: 2, color: '#ffffff', shape: 'dot', rot: 0, vr: 0, len: 10, alpha: 1, blend: 'lighter', shrink: true, mirror }, p));
      runVfxStage(st);
    },
    burst(delay, x, y, o = {}) {
      fx.later(delay, () => {
        const n = o.n || 12;
        const [a0, a1] = o.angle || [0, VFX_TAU];
        for (let i = 0; i < n; i++) {
          const ang = vLerp(a0, a1, (i + Math.random()) / n);
          const sp = vRand(...(o.speed || [2, 6]));
          fx.particle({
            x: x + vRand(-(o.spread || 0), o.spread || 0), y: y + vRand(-(o.spread || 0), o.spread || 0),
            vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
            g: o.g || 0, drag: o.drag || 0.92,
            life: vRand(...(o.life || [300, 550])), size: vRand(...(o.size || [1.5, 3])),
            color: Array.isArray(o.color) ? o.color[i % o.color.length] : (o.color || '#ffffff'),
            shape: o.shape || 'spark', len: o.len || 12, vr: vRand(-0.2, 0.2), rot: Math.random() * VFX_TAU,
            blend: o.blend || 'lighter', shrink: o.shrink !== false
          });
        }
      });
    },
    shake(delay = 0) { fx.later(delay, () => triggerScreenShake()); },
    hitstop(delay, ms = 70) { fx.later(delay, () => triggerHitStop(ms, container.closest('.arena') || null)); },
    flash(delay, col = '#ffffff', dur = 180, alpha = 0.55) {
      fx.add(delay, dur, (ctx, t) => { ctx.fillStyle = vfxRgba(col, alpha * (1 - t)); ctx.fillRect(0, 0, W, H); }, { noMirror: true, live: true });
    },
    dim(delay, dur, alpha = 0.72) {
      fx.add(delay, dur, (ctx, t) => {
        ctx.fillStyle = `rgba(2,4,10,${alpha * vFade(t, 0.15, 0.3)})`;
        ctx.fillRect(0, 0, W, H);
      }, { blend: 'source-over', noMirror: true });
    },
    // 標準命中：閃光 + 衝擊環 + 火花 (+ 頓幀震屏)
    impact(delay, x, y, col, power = 1) {
      fx.add(delay, 260 + power * 80, (ctx, t) => {
        VD.glow(ctx, x, y, (26 + power * 22) * vEaseOut(t * 2.5), col, (1 - t) * 0.95);
        VD.ring(ctx, x, y, (10 + 46 * power) * vEaseOut(t), 4 * (1 - t) + 0.5, col, 1 - t);
      }, { live: true });
      fx.burst(delay, x, y, { n: Math.round(8 + power * 10), color: [col, '#ffffff'], speed: [3, 6 + power * 4], life: [220, 460], len: 10 + power * 6 });
      if (power >= 1) { fx.hitstop(delay, 55 + power * 20); fx.shake(delay); }
    },
    slash(delay, cx, cy, r, a0, a1, w, col, dur = 320) {
      fx.add(delay, dur, (ctx, t) => {
        const head = vEaseOut(t / 0.42);
        const tail = t < 0.35 ? 0 : vEaseIn((t - 0.35) / 0.65) * 0.98;
        VD.crescent(ctx, cx, cy, r, a0, a1, w, col, t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45, tail, Math.max(tail + 0.01, head));
      });
    },
    bolt(delay, x0, y0, x1, y1, o = {}) {
      const dur = o.dur || 220, col = o.color || '#ffffff', w = o.width || 4, tl = o.trail || 0.45;
      fx.add(delay, dur, (ctx, t) => {
        const h = (o.ease || vEaseIn)(vClamp(t / 0.8));
        const tt = Math.max(0, h - tl);
        const hx = vLerp(x0, x1, h), hy = vLerp(y0, y1, h);
        const a = t < 0.8 ? 1 : (1 - t) / 0.2;
        VD.trail(ctx, vLerp(x0, x1, tt), vLerp(y0, y1, tt), hx, hy, w * 2.6, col, a * 0.5);
        VD.trail(ctx, vLerp(x0, x1, tt), vLerp(y0, y1, tt), hx, hy, w, col, a);
        VD.glow(ctx, hx, hy, w * 4, col, a);
      });
    }
  };
  return fx;
}

// ==================== 4. 招式光影庫 (名稱供 editor.html 與 vfxChain 使用) ====================
// ranged: 遠程/氣勁類招式，施展時角色原地運功而非衝刺
const VFX_RANGED = new Set(["金龍衝霄", "萬佛金光", "太極陰陽陣", "一陽指純陽柱", "暴雨梨花針", "漫天飛花", "青翠極光箭", "祖靈萬魂刺", "百步青蛇鏢", "驚濤巨浪", "剛猛拳罡波"]);

const VFX_PRESET_MAP = {
  "無動畫": () => {},

  // 居合：黑幕 → 一線橫貫全場 → 延遲白閃爆裂、櫻花飛散
  "一之居合斬": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    fx.dim(0, 720, 0.78);
    fx.add(60, 520, (ctx, t) => {
      const grow = vEaseOut(t / 0.22);
      const thick = t < 0.35 ? 2 : (t < 0.55 ? vLerp(2, 9, (t - 0.35) / 0.2) : 9 * (1 - (t - 0.55) / 0.45));
      VD.line(ctx, -10, F.y, -10 + (fx.W + 20) * grow, F.y, thick + 1, '#7fe9ff', t < 0.6 ? 1 : (1 - t) / 0.4);
    });
    fx.add(80, 360, (ctx, t) => VD.glint(ctx, F.x, F.y, 70 * vEaseOut(t * 2), '#bff4ff', 1 - t, 0.4));
    fx.flash(250, '#ffffff', 200, 0.65);
    fx.impact(250, F.x, F.y, '#7fe9ff', 2);
    fx.burst(260, F.x, F.y, { n: 22, shape: 'petal', color: ['#ffb7c5', '#ff8fab', '#ffe4ec'], speed: [1.5, 4.5], life: [700, 1100], size: [3, 5], g: 0.04, drag: 0.96, shrink: false });
  },

  // 金龍：金色龍身蜿蜒飛向敵人，龍首發光，沿途灑落金鱗
  "金龍衝霄": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos), S = fx.from(F);
    const x0 = S.x, x1 = F.x + 10, y0 = S.y, y1 = F.y;
    const path = u => ({ x: vLerp(x0, x1, u), y: vLerp(y0, y1, u) - 34 * Math.sin(u * Math.PI) + 12 * Math.sin(u * VFX_TAU * 2.2) });
    const dur = 620;
    fx.add(0, dur, (ctx, t) => {
      const h = vEaseInOut(vClamp(t / 0.62));
      const a = t < 0.7 ? 1 : (1 - t) / 0.3;
      const N = 26;
      for (let pass = 0; pass < 2; pass++) {
        let prev = null;
        for (let i = 0; i <= N; i++) {
          const u = Math.max(0, h - 0.5 + 0.5 * i / N);
          const p = path(u);
          if (prev) {
            const k = i / N;
            ctx.strokeStyle = pass === 0 ? vfxRgba('#f5a623', a * 0.55 * k) : vfxRgba('#fff3c4', a * k);
            ctx.lineWidth = pass === 0 ? 4 + 14 * k : 1.5 + 4 * k;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y); ctx.stroke();
          }
          prev = p;
        }
      }
      const hd = path(h), hd2 = path(Math.max(0, h - 0.02));
      const ang = Math.atan2(hd.y - hd2.y, hd.x - hd2.x);
      VD.glow(ctx, hd.x, hd.y, 26, '#f5c542', a);
      ctx.save();
      ctx.translate(hd.x, hd.y); ctx.rotate(ang);
      ctx.strokeStyle = vfxRgba('#ffe08a', a); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(4, -4); ctx.quadraticCurveTo(-10, -18, -24, -14); ctx.moveTo(4, 4); ctx.quadraticCurveTo(-10, 18, -24, 14); ctx.stroke();
      ctx.restore();
    });
    for (let i = 0; i < 6; i++) {
      const u = i / 6;
      const p = path(u);
      fx.burst(u * dur * 0.6, p.x, p.y, { n: 4, color: ['#f5c542', '#fff3c4'], shape: 'ember', speed: [0.3, 1.2], life: [400, 700], size: [1.5, 2.5], g: 0.03 });
    }
    fx.impact(dur * 0.62, F.x, F.y, '#f5c542', 1.5);
  },

  // 萬佛金光：巨大金掌自天而降，佛光萬丈，掌心卍字
  "萬佛金光": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    fx.add(0, 640, (ctx, t, st, it) => {
      const a = t < 0.7 ? 1 : (1 - t) / 0.3;
      const drop = vEaseIn(vClamp(t / 0.42));
      const y = vLerp(F.y - 120, F.y - 14, drop), s = t < 0.42 ? 0.9 : 0.9 + (t - 0.42) * 0.6;
      // 佛光
      ctx.save();
      ctx.translate(F.x, y);
      ctx.rotate(t * 0.8);
      for (let i = 0; i < 14; i++) {
        ctx.rotate(VFX_TAU / 14);
        const g = ctx.createLinearGradient(0, 0, 0, -90);
        g.addColorStop(0, vfxRgba('#ffd86b', a * 0.45));
        g.addColorStop(1, vfxRgba('#ffd86b', 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(0, -90); ctx.lineTo(4, 0); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      VD.ring(ctx, F.x, y, 46 * s, 2, '#ffe9a8', a * 0.7);
      // 金掌
      ctx.save();
      ctx.translate(F.x, y); ctx.scale(s, s);
      ctx.shadowBlur = 22; ctx.shadowColor = vfxRgba('#f5a623', a);
      ctx.fillStyle = vfxRgba('#f7c948', a * 0.9);
      ctx.strokeStyle = vfxRgba('#f7c948', a * 0.9);
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-22, -8, 44, 44, 12); else ctx.rect(-22, -8, 44, 44);
      ctx.fill();
      ctx.lineWidth = 10;
      [[-16, -34], [-5.5, -44], [5.5, -43], [16, -33]].forEach(([fxp, top]) => { ctx.beginPath(); ctx.moveTo(fxp, -6); ctx.lineTo(fxp, top); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(-20, 18); ctx.lineTo(-34, -2); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
      // 卍 (不鏡像)
      ctx.save();
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      const gx = it.mirror ? st.W - F.x : F.x;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = vfxRgba('#fff8e1', a);
      ctx.font = `900 ${Math.round(24 * s)}px "STKaiti","Kaiti TC",serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('卍', gx, y + 14 * s);
      ctx.restore();
    });
    fx.add(270, 420, (ctx, t) => VD.ring(ctx, F.x, fx.groundY, 120 * vEaseOut(t), 5 * (1 - t), '#ffd86b', 1 - t, 0.22));
    fx.impact(270, F.x, F.y, '#ffd86b', 1.8);
  },

  // 太極：陰陽魚旋轉成陣，外圈八卦符線逆轉，最後真氣炸開
  "太極陰陽陣": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    const r = 32;
    fx.add(0, 560, (ctx, t) => {
      const sc = vEaseOut(t / 0.3) * (t > 0.75 ? 1 + (t - 0.75) * 1.6 : 1);
      const a = t < 0.75 ? 1 : (1 - t) / 0.25;
      ctx.save();
      ctx.translate(F.x, F.y);
      ctx.scale(sc, sc);
      ctx.rotate(t * VFX_TAU * 1.6);
      ctx.globalAlpha = a;
      ctx.shadowBlur = 18; ctx.shadowColor = '#5dade2';
      ctx.fillStyle = '#0b1a33'; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI / 2, Math.PI * 1.5); ctx.fill();
      ctx.fillStyle = '#f2f7ff'; ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#0b1a33'; ctx.beginPath(); ctx.arc(0, -r / 2, r / 2, 0, VFX_TAU); ctx.fill();
      ctx.fillStyle = '#f2f7ff'; ctx.beginPath(); ctx.arc(0, r / 2, r / 2, 0, VFX_TAU); ctx.fill();
      ctx.fillStyle = '#f2f7ff'; ctx.beginPath(); ctx.arc(0, -r / 2, r / 7, 0, VFX_TAU); ctx.fill();
      ctx.fillStyle = '#0b1a33'; ctx.beginPath(); ctx.arc(0, r / 2, r / 7, 0, VFX_TAU); ctx.fill();
      ctx.strokeStyle = '#8fd3ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r, 0, VFX_TAU); ctx.stroke();
      ctx.restore();
    }, { blend: 'source-over' });
    fx.add(0, 560, (ctx, t) => {
      const a = vFade(t, 0.2, 0.3);
      ctx.save();
      ctx.translate(F.x, F.y);
      ctx.rotate(-t * VFX_TAU);
      ctx.strokeStyle = vfxRgba('#8fd3ff', a);
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 10; ctx.shadowColor = vfxRgba('#5dade2', a);
      for (let i = 0; i < 8; i++) {
        ctx.rotate(VFX_TAU / 8);
        for (let j = 0; j < 3; j++) {
          const rr = 44 + j * 5;
          const broken = (i + j) % 2 === 0;
          ctx.beginPath();
          if (broken) { ctx.moveTo(-7, -rr); ctx.lineTo(-2, -rr); ctx.moveTo(2, -rr); ctx.lineTo(7, -rr); }
          else { ctx.moveTo(-7, -rr); ctx.lineTo(7, -rr); }
          ctx.stroke();
        }
      }
      ctx.restore();
    });
    fx.impact(420, F.x, F.y, '#5dade2', 1.2);
  },

  // 一陽指：純陽光柱自天貫地
  "一陽指純陽柱": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    fx.add(0, 520, (ctx, t) => {
      const drop = vEaseIn(vClamp(t / 0.16));
      const w = t < 0.16 ? 3 : (t < 0.6 ? 22 + Math.sin(t * 90) * 3 : 22 * (1 - (t - 0.6) / 0.4));
      const a = t < 0.6 ? 1 : (1 - t) / 0.4;
      const bottom = vLerp(-10, fx.groundY, drop);
      const g = ctx.createLinearGradient(F.x - w, 0, F.x + w, 0);
      g.addColorStop(0, vfxRgba('#f39c12', 0));
      g.addColorStop(0.35, vfxRgba('#f7c948', a * 0.8));
      g.addColorStop(0.5, vfxRgba('#ffffff', a));
      g.addColorStop(0.65, vfxRgba('#f7c948', a * 0.8));
      g.addColorStop(1, vfxRgba('#f39c12', 0));
      ctx.fillStyle = g;
      ctx.fillRect(F.x - w * 1.6, -10, w * 3.2, bottom + 10);
      VD.glow(ctx, F.x, fx.groundY, 40 * a, '#f7c948', a);
    });
    fx.add(80, 460, (ctx, t) => VD.ring(ctx, F.x, fx.groundY, 70 * vEaseOut(t), 4 * (1 - t), '#ffd86b', 1 - t, 0.25));
    fx.burst(90, F.x, fx.groundY, { n: 16, shape: 'ember', color: ['#f7c948', '#ffffff'], angle: [-Math.PI * 0.9, -Math.PI * 0.1], speed: [1, 3.5], g: -0.02, life: [500, 800], size: [1.5, 3] });
    fx.impact(80, F.x, F.y, '#f7c948', 1.4);
  },

  // 三仙品字劍：三道劍氣以品字陣型先後貫穿
  "三仙品字劍": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos), S = fx.from(F);
    [[-22, -10], [14, 4], [14, 18]].forEach(([dy0, dy1], i) => {
      const d = i * 75;
      fx.bolt(d, S.x, S.y + dy0, F.x + 18, F.y + dy0 * 0.25 + (i === 0 ? 0 : 6), { color: '#8fe3ff', width: 3.2, dur: 210, trail: 0.6 });
      fx.add(d + 150, 200, (ctx, t) => VD.glint(ctx, F.x, F.y + (i === 0 ? -6 : 6), 34 * vEaseOut(t * 2), '#bdefff', 1 - t, i * 0.5));
      fx.impact(d + 165, F.x, F.y, '#8fe3ff', i === 2 ? 1.3 : 0.5);
    });
  },

  // 狂風迅影：三道青色風刃連環飛斬
  "狂風迅影": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos), S = fx.from(F);
    [-20, 2, 22].forEach((dy, i) => {
      fx.add(i * 70, 300, (ctx, t) => {
        const cx = vLerp(S.x - 10, F.x - 20, vEaseOut(t / 0.7));
        const a = t < 0.7 ? 1 : (1 - t) / 0.3;
        VD.crescent(ctx, cx, F.y + dy, 32, -1.15, 1.15, 7, '#5cffb0', a);
      });
      fx.burst(i * 70 + 60, F.x, F.y + dy, { n: 6, color: '#5cffb0', angle: [-0.5, 0.5], speed: [3, 6], life: [200, 350] });
    });
    fx.impact(210, F.x, F.y, '#5cffb0', 1);
  },

  // 金刀地裂：刀勁劈落，地面裂縫一路竄燒並爆出碎石火焰
  "金刀地裂": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos), S = fx.from(F);
    const gy = fx.groundY;
    const pts = [];
    for (let x = S.x; x <= F.x + 34; x += 9) pts.push([x, gy + (Math.random() * 6 - 3)]);
    fx.slash(0, F.x - 40, F.y - 10, 62, -1.3, 0.9, 10, '#f7b733', 300);
    fx.add(60, 560, (ctx, t) => {
      const n = Math.max(2, Math.floor(pts.length * vEaseOut(t / 0.4)));
      const a = t < 0.6 ? 1 : (1 - t) / 0.4;
      ctx.lineJoin = 'round';
      for (const [w, col, al] of [[9, '#e74c3c', 0.35], [4, '#f39c12', 0.9], [1.5, '#ffffff', 1]]) {
        ctx.strokeStyle = vfxRgba(col, a * al);
        ctx.lineWidth = w;
        ctx.beginPath();
        for (let i = 0; i < n; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]);
        ctx.stroke();
      }
    });
    fx.burst(250, F.x, gy, { n: 14, shape: 'shard', blend: 'source-over', color: ['#8d6e63', '#5d4037', '#a1887f'], angle: [-Math.PI * 0.85, -Math.PI * 0.15], speed: [3, 7], g: 0.35, drag: 0.98, life: [500, 800], size: [3, 6], shrink: false });
    fx.burst(250, F.x, gy, { n: 18, shape: 'ember', color: ['#f39c12', '#e74c3c', '#ffd86b'], angle: [-Math.PI * 0.9, -Math.PI * 0.1], speed: [2, 5], g: -0.04, life: [400, 700] });
    fx.impact(250, F.x, F.y + 10, '#f39c12', 1.6);
  },

  // 八卦旋轉刃：八卦刀輪高速旋轉飛出，連續削磨
  "八卦旋轉刃": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos), S = fx.from(F);
    fx.add(0, 560, (ctx, t) => {
      const m = vEaseOut(vClamp(t / 0.4));
      const x = vLerp(S.x, F.x, m), y = vLerp(S.y, F.y, m) - Math.sin(m * Math.PI) * 14;
      const a = t < 0.8 ? 1 : (1 - t) / 0.2;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(t * 40);
      ctx.shadowBlur = 14; ctx.shadowColor = vfxRgba('#f1c40f', a);
      ctx.strokeStyle = vfxRgba('#f7d774', a);
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) { const an = i / 8 * VFX_TAU; i ? ctx.lineTo(Math.cos(an) * 30, Math.sin(an) * 30) : ctx.moveTo(30, 0); }
      ctx.stroke();
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const an = i / 8 * VFX_TAU + Math.PI / 8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(an) * 18, Math.sin(an) * 18);
        ctx.lineTo(Math.cos(an) * 40, Math.sin(an) * 40);
        ctx.stroke();
      }
      ctx.restore();
      VD.glow(ctx, x, y, 22, '#f1c40f', a * 0.6);
    });
    [230, 300, 370].forEach((d, i) => fx.impact(d, F.x + vRand(-6, 6), F.y + vRand(-8, 8), '#f1c40f', i === 2 ? 1.2 : 0.4));
  },

  // 詠春十字斬：八斬刀交叉劈出十字
  "詠春十字斬": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    fx.slash(0, F.x - 90, F.y - 90, 120, 0.25, 1.3, 9, '#ff5e5e', 300);
    fx.slash(90, F.x - 90, F.y + 90, 120, -0.25, -1.3, 9, '#ff5e5e', 300);
    fx.add(150, 300, (ctx, t) => VD.glint(ctx, F.x, F.y, 60 * vEaseOut(t * 2), '#ffc2c2', 1 - t, Math.PI / 4));
    fx.impact(160, F.x, F.y, '#ff5e5e', 1.3);
  },

  // 驚濤巨浪：捲起的浪頭推向敵人，浪花四濺
  "驚濤巨浪": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos), S = fx.from(F);
    const gy = fx.groundY;
    fx.add(0, 620, (ctx, t) => {
      const m = vEaseOut(vClamp(t / 0.55));
      const cx = vLerp(S.x - 30, F.x - 10, m);
      const hgt = 80 * (t < 0.55 ? 0.5 + m * 0.5 : 1 - (t - 0.55) / 0.45 * 0.6);
      const a = t < 0.65 ? 1 : (1 - t) / 0.35;
      ctx.beginPath();
      ctx.moveTo(cx - 90, gy);
      ctx.quadraticCurveTo(cx - 30, gy - hgt * 0.4, cx, gy - hgt);
      ctx.quadraticCurveTo(cx + 26, gy - hgt * 1.08, cx + 38, gy - hgt * 0.72);
      ctx.quadraticCurveTo(cx + 20, gy - hgt * 0.7, cx + 22, gy - hgt * 0.5);
      ctx.quadraticCurveTo(cx + 36, gy - hgt * 0.2, cx + 50, gy);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, gy - hgt, 0, gy);
      g.addColorStop(0, vfxRgba('#7fd6ff', a * 0.95));
      g.addColorStop(0.6, vfxRgba('#1e88e5', a * 0.6));
      g.addColorStop(1, vfxRgba('#0d47a1', 0));
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = vfxRgba('#ffffff', a);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 30, gy - hgt * 0.45);
      ctx.quadraticCurveTo(cx, gy - hgt * 1.02, cx + 38, gy - hgt * 0.72);
      ctx.stroke();
    });
    for (let i = 0; i < 5; i++) {
      const u = i / 5;
      fx.burst(u * 340, vLerp(S.x, F.x, u), gy - 60, { n: 4, shape: 'dot', color: ['#bfe9ff', '#ffffff'], angle: [-Math.PI * 0.9, -Math.PI * 0.4], speed: [1, 3], g: 0.12, life: [350, 550], size: [1.2, 2.2] });
    }
    fx.burst(340, F.x, F.y, { n: 22, shape: 'dot', color: ['#7fd6ff', '#ffffff'], angle: [-Math.PI, 0], speed: [2, 6], g: 0.2, drag: 0.97, life: [450, 750], size: [1.5, 2.8] });
    fx.impact(340, F.x, F.y, '#4fc3f7', 1.4);
  },

  // 幻影無影拳：殘影疊出，瞬間百拳
  "幻影無影拳": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    for (let i = 0; i < 9; i++) {
      const dy = vRand(-24, 24), dx = vRand(-10, 10), d = i * 38;
      fx.bolt(d, F.x - 70, F.y + dy, F.x + dx, F.y + dy * 0.6, { color: '#6ec6ff', width: 5, dur: 110, trail: 0.7, ease: t => t });
      fx.add(d + 90, 200, (ctx, t) => {
        VD.glow(ctx, F.x + dx, F.y + dy * 0.6, 18 * (1 - t * 0.5), '#6ec6ff', 1 - t);
        VD.ring(ctx, F.x + dx, F.y + dy * 0.6, 22 * vEaseOut(t), 2 * (1 - t), '#bfe5ff', 1 - t);
      });
    }
    fx.impact(9 * 38 + 60, F.x, F.y, '#6ec6ff', 1.4);
  },

  // 虎鶴雙形：三道虎爪撕裂，鶴嘴疾啄
  "虎鶴利爪": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    [-14, 0, 14].forEach((off, i) => {
      fx.add(i * 35, 300, (ctx, t) => {
        const h = vEaseOut(t / 0.35);
        const a = t < 0.5 ? 1 : (1 - t) / 0.5;
        const x0 = F.x + 26 + off, y0 = F.y - 40, x1 = F.x - 26 + off, y1 = F.y + 36;
        VD.line(ctx, x0, y0, vLerp(x0, x1, h), vLerp(y0, y1, h), 4.5 * (1 - t * 0.6), '#ff7043', a);
      });
    });
    fx.bolt(160, F.x - 80, F.y - 4, F.x + 12, F.y - 4, { color: '#ffffff', width: 3, dur: 140, trail: 0.8 });
    fx.burst(250, F.x, F.y, { n: 8, shape: 'petal', color: '#f5f5f5', speed: [1.5, 3.5], g: 0.05, life: [500, 800], size: [2.5, 4], shrink: false });
    fx.impact(110, F.x, F.y, '#ff7043', 0.8);
    fx.impact(260, F.x, F.y - 4, '#ffffff', 1);
  },

  // 日字連環衝拳：直線連打，拳勁接連轟入
  "日字連環衝拳": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos), S = fx.from(F);
    for (let i = 0; i < 5; i++) {
      const dy = (i % 2 ? 8 : -6), d = i * 60;
      fx.bolt(d, S.x + 20, S.y + dy, F.x - 6, F.y + dy, { color: '#ffa94d', width: 6, dur: 130, trail: 0.5, ease: t => t });
      fx.impact(d + 105, F.x - 6, F.y + dy, '#ffa94d', i === 4 ? 1.2 : 0.35);
    }
  },

  // 幽冥紫焰踢：紫焰踢弧由下往上旋起，鬼火升騰
  "幽冥紫焰踢": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    fx.slash(0, F.x - 20, F.y + 10, 58, 2.2, -0.6, 14, '#b26bff', 380);
    fx.burst(80, F.x, F.y + 20, { n: 26, shape: 'ember', color: ['#b26bff', '#ff6bd6', '#e0c3ff'], angle: [-Math.PI * 0.95, -Math.PI * 0.05], speed: [0.8, 3], g: -0.06, drag: 0.96, life: [500, 900], size: [2, 3.5] });
    fx.impact(180, F.x, F.y, '#b26bff', 1.3);
  },

  // 地趟龍捲風：貼地掃腿捲起龍捲
  "地趟龍捲風": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    const gy = fx.groundY;
    fx.add(0, 680, (ctx, t) => {
      const a = vFade(t, 0.15, 0.3);
      const grow = vEaseOut(t / 0.4);
      for (let i = 0; i < 11; i++) {
        const k = i / 10;
        const y = gy - k * 110 * grow;
        const rx = 6 + k * 34;
        const sway = Math.sin(t * 14 + k * 3) * 6 * k;
        ctx.strokeStyle = vfxRgba(i % 2 ? '#dfe6e9' : '#9fb3c8', a * (0.4 + 0.5 * (1 - k)));
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(F.x + sway, y, rx, rx * 0.22, 0, (t * 20 + i) % VFX_TAU, (t * 20 + i) % VFX_TAU + Math.PI * 1.5);
        ctx.stroke();
      }
    });
    fx.burst(40, F.x, gy - 8, { n: 18, shape: 'shard', blend: 'source-over', color: ['#7f8c8d', '#95a5a6'], angle: [-Math.PI, 0], speed: [1.5, 4], g: 0.12, life: [500, 800], size: [2, 4], shrink: false });
    fx.add(0, 400, (ctx, t) => VD.ring(ctx, F.x, gy, 60 * vEaseOut(t), 3 * (1 - t), '#dfe6e9', 1 - t, 0.22));
    fx.impact(260, F.x, F.y + 10, '#dfe6e9', 1);
  },

  // 十二路譚腿：三記低掃彈腿，腿影如鞭
  "十二路譚弧": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    [[0, 18], [90, -2], [180, 28]].forEach(([d, dy], i) => {
      fx.slash(d, F.x - 34, F.y + dy, 44, 2.6, 0.25, 7, '#6ec6ff', 240);
      fx.impact(d + 70, F.x, F.y + dy, '#6ec6ff', i === 2 ? 1 : 0.4);
    });
    fx.burst(200, F.x, fx.groundY, { n: 10, shape: 'shard', blend: 'source-over', color: '#7f8c8d', angle: [-Math.PI * 0.9, -Math.PI * 0.1], speed: [1, 3], g: 0.2, life: [350, 600], size: [2, 3.5], shrink: false });
  },

  // 暴雨梨花針：數十枚銀針扇形暴射
  "暴雨梨花針": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos), S = fx.from(F);
    fx.add(0, 220, (ctx, t) => VD.glow(ctx, S.x, S.y, 26 * vEaseOut(t * 2), '#c8f7ff', 1 - t));
    for (let i = 0; i < 30; i++) {
      const tx = F.x + vRand(-22, 22), ty = F.y + vRand(-34, 34);
      const sy = S.y + vRand(-12, 12);
      const d = vRand(0, 220);
      fx.add(d, 170, (ctx, t) => {
        const h = t;
        const x = vLerp(S.x, tx, h), y = vLerp(sy, ty, h);
        const ang = Math.atan2(ty - sy, tx - S.x);
        VD.line(ctx, x - Math.cos(ang) * 16, y - Math.sin(ang) * 16, x, y, 1.4, '#c8f7ff', 1, false);
      });
      if (i % 3 === 0) fx.burst(d + 160, tx, ty, { n: 3, color: '#c8f7ff', speed: [1, 3], life: [150, 280], len: 6, size: [1, 1.5] });
    }
    fx.add(300, 260, (ctx, t) => VD.glint(ctx, F.x, F.y, 46 * vEaseOut(t * 2), '#c8f7ff', 1 - t, 0.3));
    fx.impact(300, F.x, F.y, '#9be7ff', 1.2);
  },

  // 漫天飛花：花瓣如雨圍繞敵人迴旋後齊射
  "漫天飛花": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    const petals = Array.from({ length: 34 }, () => ({ a: Math.random() * VFX_TAU, r: vRand(40, 80), s: vRand(2.5, 4.5), sp: vRand(4, 7), c: ['#ff8fab', '#ffb7c5', '#ffe4ec', '#ff6b8b'][Math.floor(Math.random() * 4)] }));
    fx.add(0, 700, (ctx, t) => {
      const a = vFade(t, 0.12, 0.25);
      const close = vEaseIn(vClamp((t - 0.35) / 0.3));
      for (const p of petals) {
        const ang = p.a + t * p.sp;
        const rr = p.r * (1 - close * 0.92);
        const x = F.x + Math.cos(ang) * rr, y = F.y + Math.sin(ang) * rr * 0.6;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang * 2);
        ctx.fillStyle = vfxRgba(p.c, a);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.s, p.s * 0.45, 0, 0, VFX_TAU);
        ctx.fill();
        ctx.restore();
      }
    }, { blend: 'source-over' });
    fx.burst(470, F.x, F.y, { n: 24, shape: 'petal', color: ['#ff8fab', '#ffb7c5', '#ffe4ec'], speed: [2, 5], g: 0.03, drag: 0.95, life: [600, 1000], size: [2.5, 4], shrink: false, blend: 'source-over' });
    fx.impact(470, F.x, F.y, '#ff8fab', 1.2);
  },

  // 青翠極光箭：極光拖尾的翠綠光箭
  "青翠極光箭": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos), S = fx.from(F);
    fx.add(0, 200, (ctx, t) => VD.glow(ctx, S.x, S.y, 20 * vEaseOut(t * 2), '#4dffc3', 1 - t));
    fx.bolt(60, S.x, S.y, F.x, F.y, { color: '#4dffc3', width: 5, dur: 230, trail: 0.85 });
    fx.add(60, 360, (ctx, t) => {
      const a = 1 - t;
      for (let i = 1; i <= 4; i++) {
        const u = i / 5;
        if (u > vEaseIn(t * 1.25) + 0.05) continue;
        VD.ring(ctx, vLerp(S.x, F.x, u), vLerp(S.y, F.y, u), 7 + i * 1.5, 1.4, '#a6ffe3', a * 0.8, 1.6);
      }
    });
    fx.impact(245, F.x, F.y, '#4dffc3', 1.2);
  },

  // 祖靈萬魂刺：地底竄出翠綠骨刺，祖靈魂火繚繞
  "祖靈萬魂刺": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    const gy = fx.groundY;
    [-36, -20, -6, 8, 22, 36, 0].forEach((dx, i) => {
      const h = i === 6 ? 92 : vRand(40, 70);
      fx.add(i * 40, 420, (ctx, t) => {
        const up = vEaseOut(t / 0.25), a = t < 0.6 ? 1 : (1 - t) / 0.4;
        const x = F.x + dx, top = gy - h * up;
        const g = ctx.createLinearGradient(0, top, 0, gy);
        g.addColorStop(0, vfxRgba('#ffffff', a));
        g.addColorStop(0.3, vfxRgba('#4dff88', a));
        g.addColorStop(1, vfxRgba('#0b6e3a', a * 0.2));
        ctx.fillStyle = g;
        ctx.shadowBlur = 10; ctx.shadowColor = vfxRgba('#4dff88', a);
        ctx.beginPath(); ctx.moveTo(x - 6, gy); ctx.lineTo(x + (dx > 0 ? 3 : -3), top); ctx.lineTo(x + 6, gy); ctx.closePath(); ctx.fill();
      });
    });
    fx.burst(120, F.x, gy - 20, { n: 16, shape: 'ember', color: ['#4dff88', '#b9ffd1'], angle: [-Math.PI * 0.85, -Math.PI * 0.15], speed: [0.6, 2], g: -0.05, drag: 0.97, life: [700, 1100], size: [2, 3.5] });
    fx.flash(250, '#4dff88', 200, 0.25);
    fx.impact(250, F.x, F.y, '#4dff88', 1.5);
  },

  // 百步青蛇鏢：鏢身如青蛇蜿蜒疾竄，命中毒液飛濺
  "百步青蛇鏢": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos), S = fx.from(F);
    const path = u => ({ x: vLerp(S.x, F.x, u), y: vLerp(S.y, F.y, u) + Math.sin(u * VFX_TAU * 2) * 12 * (1 - u) });
    fx.add(0, 340, (ctx, t) => {
      const h = vEaseIn(vClamp(t / 0.8));
      const a = t < 0.8 ? 1 : (1 - t) / 0.2;
      for (let i = 0; i < 14; i++) {
        const u = h - i * 0.025;
        if (u < 0) break;
        const p = path(u);
        VD.glow(ctx, p.x, p.y, 7 * (1 - i / 14), '#3ddc84', a * (1 - i / 14));
      }
      const p = path(h), q = path(Math.max(0, h - 0.02));
      const ang = Math.atan2(p.y - q.y, p.x - q.x);
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(ang);
      ctx.fillStyle = vfxRgba('#d8ffe8', a);
      ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-4, -4); ctx.lineTo(-1, 0); ctx.lineTo(-4, 4); ctx.closePath(); ctx.fill();
      ctx.restore();
    });
    fx.burst(275, F.x, F.y, { n: 16, shape: 'dot', color: ['#3ddc84', '#a8ff60'], angle: [-Math.PI, 0], speed: [1.5, 4], g: 0.18, life: [400, 700], size: [1.5, 2.5] });
    fx.impact(275, F.x, F.y, '#3ddc84', 1);
  },

  // 迅影拔刀芒：一閃即逝的橫向拔刀光
  "迅影拔刀芒": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    fx.add(0, 160, (ctx, t) => {
      for (let i = 0; i < 5; i++) {
        const y = F.y - 20 + i * 10;
        VD.trail(ctx, F.x - 130 + t * 40, y, F.x - 60 + t * 60, y, 1.5, '#9bd4ff', (1 - t) * 0.8);
      }
    });
    fx.slash(30, F.x - 10, F.y + 60, 76, -2.35, -0.75, 8, '#9bd4ff', 240);
    fx.impact(110, F.x, F.y, '#9bd4ff', 1.1);
  },

  // 瘋魔砸地震：長杖掄圓重砸地面，震波與碎石齊飛
  "瘋魔砸地震": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos);
    const gy = fx.groundY;
    const px = F.x - 46;
    fx.add(0, 420, (ctx, t) => {
      const sw = vEaseIn(vClamp(t / 0.45));
      const ang = vLerp(-Math.PI * 0.55, 0.05, sw);
      const a = t < 0.65 ? 1 : (1 - t) / 0.35;
      const len = 112;
      const x1 = px + Math.cos(ang) * len, y1 = gy - 4 + Math.sin(ang) * len;
      for (let k = 1; k <= 3; k++) {
        const pa = vLerp(-Math.PI * 0.55, 0.05, Math.max(0, sw - k * 0.08));
        VD.line(ctx, px, gy - 4, px + Math.cos(pa) * len, gy - 4 + Math.sin(pa) * len, 6, '#e67e22', a * 0.2 / k, false);
      }
      VD.line(ctx, px, gy - 4, x1, y1, 7, '#ff9f43', a);
    });
    fx.add(190, 520, (ctx, t) => {
      VD.ring(ctx, F.x + 20, gy, 140 * vEaseOut(t), 6 * (1 - t), '#ffb74d', 1 - t, 0.2);
      VD.ring(ctx, F.x + 20, gy, 90 * vEaseOut(t), 3 * (1 - t), '#ffffff', 1 - t, 0.2);
    });
    fx.burst(190, F.x + 20, gy, { n: 20, shape: 'shard', blend: 'source-over', color: ['#795548', '#a1887f', '#5d4037'], angle: [-Math.PI * 0.9, -Math.PI * 0.1], speed: [3, 8], g: 0.38, drag: 0.98, life: [500, 900], size: [3, 6], shrink: false });
    fx.burst(190, F.x + 20, gy - 6, { n: 14, shape: 'dot', color: '#d7ccc8', angle: [-Math.PI, 0], speed: [1, 3], g: -0.01, drag: 0.95, life: [500, 800], size: [3, 5], blend: 'source-over' });
    fx.impact(190, F.x + 10, F.y + 16, '#ffb74d', 2);
  },

  // 剛猛拳罡波：拳罡凝成光球轟出，沿途留下震波圈
  "剛猛拳罡波": (container, pos, o) => {
    const fx = makeVfx(container, o), F = fx.at(pos), S = fx.from(F);
    fx.add(0, 300, (ctx, t) => {
      const m = vEaseIn(vClamp(t / 0.75));
      const x = vLerp(S.x, F.x, m), y = vLerp(S.y, F.y, m);
      const a = t < 0.75 ? 1 : (1 - t) / 0.25;
      VD.glow(ctx, x, y, 24 + 10 * m, '#ff9f43', a);
      for (let i = 1; i <= 3; i++) {
        const u = m - i * 0.18;
        if (u <= 0) continue;
        VD.ring(ctx, vLerp(S.x, F.x, u), vLerp(S.y, F.y, u), 10 + i * 4, 1.6, '#ffd8a8', a * (1 - i / 4), 1.7);
      }
    });
    fx.impact(225, F.x, F.y, '#ff9f43', 1.4);
  }
};

// 普通攻擊的輕量光影（依兵刃）
function playBasicStrikeVfx(container, wType) {
  const fx = makeVfx(container), T = fx.T;
  if (wType === "劍") {
    fx.bolt(60, T.x - 70, T.y - 4, T.x + 4, T.y - 2, { color: '#dff6ff', width: 2.5, dur: 120, trail: 0.7, ease: t => t });
    fx.impact(150, T.x, T.y, '#bfe9ff', 0.4);
  } else if (wType === "刀") {
    fx.slash(60, T.x - 30, T.y + 30, 46, -2.3, -0.6, 6, '#ffd59e', 220);
    fx.impact(140, T.x, T.y, '#ffd59e', 0.4);
  } else if (wType === "棍") {
    fx.slash(50, T.x - 40, T.y + 10, 56, -1.9, 0.4, 7, '#e6b980', 240);
    fx.impact(150, T.x, T.y, '#e6b980', 0.5);
  } else if (wType === "暗器") {
    fx.bolt(40, fx.A.x + 30, fx.A.y, T.x, T.y, { color: '#f7d774', width: 2.2, dur: 140, trail: 0.4 });
    fx.impact(160, T.x, T.y, '#f7d774', 0.3);
  } else {
    fx.impact(150, T.x - 4, T.y, '#ffffff', 0.5);
  }
}

// 依武學名稱 / 兵刃自動配對光影（未設定 vfxChain 時使用）
const VFX_NAME_RULES = [
  [/一之太刀|居合/, "一之居合斬"], [/拔刀/, "迅影拔刀芒"], [/彈指|吹箭|箭/, "青翠極光箭"], [/降龍|龍/, "金龍衝霄"],
  [/金剛掌|佛|般若|如來/, "萬佛金光"], [/太極|武當/, "太極陰陽陣"], [/一陽指|指/, "一陽指純陽柱"], [/三仙/, "三仙品字劍"],
  [/快劍|狂風|風/, "狂風迅影"], [/金刀|乾坤|斷刀|劈/, "金刀地裂"], [/八斬|詠春|十字/, "詠春十字斬"], [/八卦/, "八卦旋轉刃"],
  [/浪|濤|水/, "驚濤巨浪"], [/無影/, "幻影無影拳"], [/虎鶴|爪/, "虎鶴利爪"], [/衝拳|連環|長拳/, "日字連環衝拳"],
  [/幽冥|旋風|焰/, "幽冥紫焰踢"], [/掃|龍捲/, "地趟龍捲風"], [/譚腿|腿/, "十二路譚弧"], [/梨花|針/, "暴雨梨花針"],
  [/花雨|飛花|花/, "漫天飛花"], [/祖靈|萬魂/, "祖靈萬魂刺"], [/蛇|鏢/, "百步青蛇鏢"], [/杖|棍|瘋魔/, "瘋魔砸地震"]
];
const VFX_WEAPON_DEFAULT = { "劍": "狂風迅影", "刀": "迅影拔刀芒", "棍": "瘋魔砸地震", "暗器": "百步青蛇鏢", "拳": "剛猛拳罡波" };

function pickVfxByName(name, wType) {
  const n = name || "";
  for (const [re, key] of VFX_NAME_RULES) if (re.test(n)) return key;
  return VFX_WEAPON_DEFAULT[wType] || "剛猛拳罡波";
}

// 各光影「命中瞬間」相對於特效開始的毫秒數（戰鬥結算傷害時機與之同步）
const VFX_HIT_TIME = {
  "無動畫": 60, "一之居合斬": 250, "金龍衝霄": 384, "萬佛金光": 270, "太極陰陽陣": 420, "一陽指純陽柱": 80,
  "三仙品字劍": 165, "狂風迅影": 210, "金刀地裂": 250, "八卦旋轉刃": 230, "詠春十字斬": 160, "驚濤巨浪": 340,
  "幻影無影拳": 130, "虎鶴利爪": 110, "日字連環衝拳": 105, "幽冥紫焰踢": 180, "地趟龍捲風": 260, "十二路譚弧": 70,
  "暴雨梨花針": 300, "漫天飛花": 470, "青翠極光箭": 245, "祖靈萬魂刺": 250, "百步青蛇鏢": 275, "迅影拔刀芒": 110,
  "瘋魔砸地震": 190, "剛猛拳罡波": 225
};

function resolveSkillVfx(skillName, wType, skillObj) {
  const chain = skillObj && skillObj.vfxChain;
  const isIai = (skillName || "").includes("一之太刀");
  return {
    pre: chain ? (chain.pre || "無動畫") : "無動畫",
    mid: chain ? (chain.mid || "剛猛拳罡波") : pickVfxByName(skillName, wType),
    post: chain ? (chain.post || "無動畫") : "無動畫",
    postTarget: chain ? (chain.postTarget || "target") : "target",
    isIai,
    midDelay: isIai ? 300 : 140
  };
}

// 敵方絕招：120ms 蓄勢後播放鏡像光影
function getEnemySkillStrikeDelay(skillName) {
  return 120 + (VFX_HIT_TIME[pickVfxByName(skillName, "拳")] ?? 200);
}

// 招式從出手到命中（扣血飄字）的毫秒數
function getSkillStrikeDelay(skillName, wType, skillObj) {
  const v = resolveSkillVfx(skillName, wType, skillObj);
  return v.midDelay + (VFX_HIT_TIME[v.mid] ?? 200);
}

/**
 * 核心呼叫入口：根據名稱與位置執行特效
 * @param {'attacker'|'target'|'center'} targetPos 出現位置
 */
function playVfxEffect(effectName, customContainer = null, targetPos = 'target', opt = {}) {
  const container = customContainer || document.getElementById('arena-vfx-container');
  if (!container) return;
  const runner = VFX_PRESET_MAP[effectName] || VFX_PRESET_MAP["剛猛拳罡波"];
  runner(container, targetPos, opt);
}

// ==================== 5. 角色動作 ====================
function playRigAnimation(rig, cls, durationMs) {
  if (!rig) return;
  rig.classList.remove(cls);
  void rig.offsetWidth;
  // CSS 以 !important 宣告動畫，時長需以 important 行內樣式覆寫
  if (durationMs) rig.style.setProperty('animation-duration', durationMs + 'ms', 'important');
  else rig.style.removeProperty('animation-duration');
  rig.classList.add(cls);
  const done = (e) => {
    if (e && e.target !== rig) return;
    rig.classList.remove(cls);
    rig.style.removeProperty('animation-duration');
    rig.removeEventListener('animationend', done);
  };
  rig.addEventListener('animationend', done);
}

// 受擊後仰閃白（遊戲與編輯器共用）
function playHitReaction(rig) {
  if (!rig) return;
  playRigAnimation(rig, rig.classList.contains('rig-enemy') ? 'anim-hit-recoil-enemy' : 'anim-hit-recoil-player');
}

/**
 * 依技能配置播放完整戰鬥特效（玩家出招）
 */
function playUniqueSkillAnimation(skillName, pRig, arm, curWType, skillObj = null) {
  const vfxContainer = document.getElementById('arena-vfx-container');
  if (!vfxContainer) return;

  // 普通攻擊
  if (skillName === "基礎劍刺") {
    playBasicStrikeVfx(vfxContainer, curWType);
    return;
  }

  const { pre, mid, post, postTarget, isIai, midDelay } = resolveSkillVfx(skillName, curWType, skillObj);
  const strike = midDelay + (VFX_HIT_TIME[mid] ?? 200);

  // 角色動作：一之太刀=蓄勢居合、遠程氣勁/暗器=原地運功、其餘=衝刺出招（衝刺最遠點對準命中瞬間）
  if (isIai) playRigAnimation(pRig, 'anim-skill-iai', Math.round(strike / 0.55));
  else if (curWType === "暗器" || VFX_RANGED.has(mid)) playRigAnimation(pRig, 'anim-skill-cast', Math.max(500, strike + 260));
  else playRigAnimation(pRig, 'anim-skill-lunge', Math.max(480, Math.min(1100, Math.round(strike / 0.4))));
  if (arm && !isIai) playRigAnimation(arm, 'anim-thrust-arm');

  if (pre !== "無動畫") playVfxEffect(pre, vfxContainer, 'attacker');
  setTimeout(() => { if (mid !== "無動畫") playVfxEffect(mid, vfxContainer, 'target'); }, midDelay);
  setTimeout(() => { if (post !== "無動畫") playVfxEffect(post, vfxContainer, postTarget); }, midDelay + 250);
}

/**
 * 清除玩家骨骼動作 Class
 */
function clearPlayerAnimations(pRig, arm) {
  if (pRig) {
    pRig.classList.remove('anim-thrust-body', 'anim-heavy-hit-player', 'anim-jump-dodge-player', 'anim-skill-lunge', 'anim-skill-cast', 'anim-skill-iai', 'anim-hit-recoil-player');
    pRig.style.removeProperty('animation-duration');
  }
  if (arm) arm.classList.remove('anim-thrust-arm');
}

/**
 * 飄字生成
 */
function spawnFloatingDmg(text, left, top, cssClass) {
  const arena = document.getElementById('arena-box');
  if (!arena) return;
  const p = document.createElement('div');
  p.className = `dmg-num ${cssClass}`;
  p.innerText = text;
  p.style.left = left + 'px';
  p.style.top = top + 'px';
  arena.appendChild(p);
  setTimeout(() => p.remove(), 750);
}

/**
 * 螢幕震顫
 */
// 只震動戰鬥場地，下方指令面板與文字保持不動
function triggerScreenShake() {
  if (window.GAME_SETTINGS && window.GAME_SETTINGS.shake === false) return;
  const app = document.getElementById('arena-box') || document.getElementById('phone-app');
  if (!app) return;
  app.classList.remove('shake');
  void app.offsetWidth;
  app.classList.add('shake');
}

/**
 * 頓幀：Canvas 特效時間凍結 + 角色 CSS 動作暫停
 */
function triggerHitStop(duration = 65, targetEl = null) {
  VFX_ENGINE.hitstopUntil = Math.max(VFX_ENGINE.hitstopUntil, performance.now() + duration);
  const arena = targetEl || document.getElementById('arena-box');
  if (!arena) return;
  arena.classList.add('hitstop-active');
  clearTimeout(arena.__hitstopTimer);
  arena.__hitstopTimer = setTimeout(() => arena.classList.remove('hitstop-active'), duration);
}

/**
 * 打擊火花（相容舊介面）
 */
function spawnImpactSparks(x, y, color = '#f39c12', count = 7, targetContainer = null) {
  const container = targetContainer || document.getElementById('arena-vfx-container');
  if (!container) return;
  const fx = makeVfx(container);
  fx.add(0, 300, (ctx, t) => VD.ring(ctx, x, y, 34 * vEaseOut(t), 3 * (1 - t), color, 1 - t));
  fx.burst(0, x, y, { n: count, color: [color, '#ffffff'] });
}

/**
 * 護體罡氣：六角真氣罩
 */
function spawnQiShieldVfx(isPlayer) {
  const container = document.getElementById('arena-vfx-container');
  if (!container) return;
  const fx = makeVfx(container);
  const P = isPlayer ? fx.A : fx.T;
  const col = isPlayer ? '#5dade2' : '#f1c40f';
  fx.add(0, 520, (ctx, t) => {
    const a = vFade(t, 0.2, 0.45);
    const s = 0.8 + vEaseOut(t / 0.4) * 0.25;
    const rx = 44 * s, ry = 60 * s;
    const g = ctx.createRadialGradient(P.x, P.y, rx * 0.3, P.x, P.y, rx * 1.1);
    g.addColorStop(0, vfxRgba(col, 0));
    g.addColorStop(0.8, vfxRgba(col, a * 0.25));
    g.addColorStop(1, vfxRgba(col, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(P.x, P.y, rx * 1.1, ry * 1.1, 0, 0, VFX_TAU); ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.ellipse(P.x, P.y, rx, ry, 0, 0, VFX_TAU); ctx.clip();
    ctx.strokeStyle = vfxRgba(col, a * 0.45);
    ctx.lineWidth = 1;
    const hs = 11;
    for (let row = -7; row <= 7; row++) {
      for (let c = -5; c <= 5; c++) {
        const hx = P.x + c * hs * 1.5, hy = P.y + row * hs * 0.87 + (c % 2 ? hs * 0.43 : 0);
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) { const an = i / 6 * VFX_TAU; i ? ctx.lineTo(hx + Math.cos(an) * hs * 0.5, hy + Math.sin(an) * hs * 0.5) : ctx.moveTo(hx + hs * 0.5, hy); }
        ctx.stroke();
      }
    }
    ctx.restore();
    VD.ring(ctx, P.x, P.y, rx, 2.2, col, a, ry / rx);
    const sweep = (t * 2) % 1;
    VD.glow(ctx, P.x + Math.cos(sweep * VFX_TAU) * rx, P.y + Math.sin(sweep * VFX_TAU) * ry, 12, '#ffffff', a);
  });
}

/**
 * 敵方絕招光影：依招式名稱配對，左右鏡像打向玩家
 */
function playEnemySkillVfx(skillName) {
  const container = document.getElementById('arena-vfx-container');
  if (!container) return;
  const key = pickVfxByName(skillName, "拳");
  const fx = makeVfx(container, { mirror: true });
  fx.add(0, 240, (ctx, t) => VD.glow(ctx, fx.A.x, fx.A.y, 30 * vEaseOut(t * 2), '#ff5e5e', 1 - t));
  setTimeout(() => playVfxEffect(key, container, 'target', { mirror: true }), 120);
}

/**
 * 依兵刃類別繪製火柴人手中兵器（遊戲戰鬥與 editor.html 預覽共用）
 */
function renderStickWeapon(wType, container, leftArm) {
  if (!container) return;
  const setLeftArm = (x2, y2) => {
    if (!leftArm) return;
    leftArm.setAttribute('x1', '50');
    leftArm.setAttribute('y1', '38');
    leftArm.setAttribute('x2', x2);
    leftArm.setAttribute('y2', y2);
  };

  if (wType === "暗器") {
    setLeftArm('45', '65');
    container.innerHTML = `
      <g class="tossing-coin">
        <circle cx="75" cy="44" r="5" fill="#f1c40f" stroke="#e67e22" stroke-width="1.5"/>
        <path d="M73,42 L77,46 M77,42 L73,46" stroke="#b8860b" stroke-width="1"/>
      </g>
    `;
    return;
  }

  setLeftArm('28', '56');
  if (wType === "劍") {
    container.innerHTML = `<line x1="84" y1="40" x2="114" y2="18" stroke="#f1c40f" stroke-width="4.5"/><line x1="81" y1="43" x2="87" y2="37" stroke="#ffffff" stroke-width="6"/>`;
  } else if (wType === "刀") {
    container.innerHTML = `<path d="M84,40 Q105,25 118,10" stroke="#f39c12" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  } else if (wType === "棍") {
    container.innerHTML = `<line x1="58" y1="62" x2="124" y2="8" stroke="#b87333" stroke-width="5" stroke-linecap="round"/>`;
  } else {
    container.innerHTML = `<circle cx="86" cy="40" r="5" fill="#f1c40f" stroke="#ffffff" stroke-width="1.5"/>`;
  }
}

// 掛載至全域 window 物件
window.VFX_PRESET_MAP = VFX_PRESET_MAP;
window.playVfxEffect = playVfxEffect;
window.playUniqueSkillAnimation = playUniqueSkillAnimation;
window.playHitReaction = playHitReaction;
window.getSkillStrikeDelay = getSkillStrikeDelay;
window.getEnemySkillStrikeDelay = getEnemySkillStrikeDelay;
window.clearPlayerAnimations = clearPlayerAnimations;
window.spawnFloatingDmg = spawnFloatingDmg;
window.triggerScreenShake = triggerScreenShake;
window.spawnQiShieldVfx = spawnQiShieldVfx;
window.playEnemySkillVfx = playEnemySkillVfx;
window.triggerHitStop = triggerHitStop;
window.spawnImpactSparks = spawnImpactSparks;
window.renderStickWeapon = renderStickWeapon;
