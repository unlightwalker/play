/**
 * ========================================================
 * 你的江湖 - 戰鬥特效與動畫獨立模組 (combat_vfx.js) 
 * 【現代手遊高質感動態旗艦版 - 編輯器同步與自選定位升級】
 * 
 * 核心升級：
 * 1. 導出 VFX_PRESET_MAP，供 editor.html 與戰鬥引擎同步共用特效庫
 * 2. 支援前搖(攻擊方)、命中(受擊方)、收招殘影(自選位置：攻擊方/受擊方/場中央)
 * 3. 完整封裝 HitStop 微秒頓幀、螢幕震顫、光爆火花與衝擊波環
 * ========================================================
 */

// --- 現代手遊級微秒頓幀 (HitStop) 與光爆產生器 ---
function triggerHitStop(duration = 65, targetEl = null) {
  const arena = targetEl || document.getElementById('arena-box') || document.getElementById('vfx-stage');
  if (!arena) return;
  arena.classList.add('hitstop-active');
  setTimeout(() => {
    arena.classList.remove('hitstop-active');
  }, duration);
}

// 生成現代手遊打擊光爆粒子與圓形衝擊波環
function spawnImpactSparks(x, y, color = '#f39c12', count = 7, targetContainer = null) {
  const container = targetContainer || document.getElementById('arena-vfx-container') || document.getElementById('vfx-anim-layer');
  if (!container) return;

  // 1. 衝擊波光環
  const ring = document.createElement('div');
  ring.className = 'vfx-shockwave-ring';
  ring.style.left = (x - 25) + 'px';
  ring.style.top = (y - 25) + 'px';
  ring.style.borderColor = color;
  container.appendChild(ring);
  setTimeout(() => ring.remove(), 350);

  // 2. 飛濺火花粒子
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'vfx-spark-particle';
    const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.4 - 0.2);
    const dist = 30 + Math.random() * 35;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    spark.style.backgroundColor = color;
    spark.style.boxShadow = `0 0 6px ${color}`;
    spark.style.setProperty('--tx', `${tx}px`);
    spark.style.setProperty('--ty', `${ty}px`);
    container.appendChild(spark);
    setTimeout(() => spark.remove(), 360);
  }
}

/**
 * ========================================================
 * 通用獨立特效渲染清單 (供 editor.html 與戰鬥引擎統一調用)
 * targetPos: 'attacker' (攻擊方), 'target' (受擊方), 'center' (全場居中)
 * ========================================================
 */
const VFX_PRESET_MAP = {
  "無動畫": (container, targetPos) => {},

  "一之居合斬": (container, targetPos) => {
    const horizonSlash = document.createElement('div');
    horizonSlash.className = 'vfx-ittoryu-horizon-slash';
    const horizonFlash = document.createElement('div');
    horizonFlash.className = 'vfx-ittoryu-horizon-flash';
    container.appendChild(horizonSlash);
    container.appendChild(horizonFlash);

    setTimeout(() => {
      triggerScreenShake();
      triggerHitStop(80);
      spawnImpactSparks(targetPos === 'attacker' ? 100 : 200, 80, '#ff4757', 12, container);
    }, 160);

    setTimeout(() => {
      horizonSlash.remove();
      horizonFlash.remove();
    }, 550);
  },

  "金龍衝霄": (container, targetPos) => {
    const dragon = document.createElement('div');
    dragon.className = 'vfx-dragon-fly';
    dragon.style.left = targetPos === 'attacker' ? '40px' : (targetPos === 'target' ? '160px' : '90px');
    dragon.innerHTML = `
      <svg viewBox="0 0 240 90" width="100%" height="100%">
        <defs>
          <filter id="dragonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f39c12"/>
            <stop offset="60%" stop-color="#f1c40f"/>
            <stop offset="100%" stop-color="#ffffff"/>
          </linearGradient>
        </defs>
        <path d="M10,45 Q65,10 120,45 T220,45" stroke="url(#dragonGrad)" stroke-width="16" fill="none" stroke-linecap="round" filter="url(#dragonGlow)"/>
        <path d="M10,45 Q65,10 120,45 T220,45" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="215" cy="45" r="18" fill="#f1c40f" filter="url(#dragonGlow)"/>
        <circle cx="220" cy="41" r="4" fill="#ffffff"/>
        <path d="M222,35 L235,28 M222,55 L235,62" stroke="#e67e22" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `;
    container.appendChild(dragon);
    setTimeout(() => {
      triggerScreenShake();
      triggerHitStop(70);
      spawnImpactSparks(targetPos === 'attacker' ? 100 : 210, 80, '#f1c40f', 10, container);
    }, 180);
    setTimeout(() => dragon.remove(), 500);
  },

  "萬佛金光": (container, targetPos) => {
    const palm = document.createElement('div');
    palm.className = 'vfx-buddha-palm';
    palm.style.left = targetPos === 'attacker' ? '40px' : (targetPos === 'target' ? '180px' : '110px');
    palm.innerHTML = `
      <svg viewBox="0 0 100 120" width="100%" height="100%">
        <defs>
          <radialGradient id="palmGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="50%" stop-color="#f1c40f"/>
            <stop offset="100%" stop-color="rgba(243,156,18,0.7)"/>
          </radialGradient>
        </defs>
        <path d="M20,105 Q12,40 28,26 Q40,8 50,26 Q60,8 72,26 Q88,40 80,105 Z" fill="url(#palmGlow)" stroke="#ffeaa7" stroke-width="3" filter="drop-shadow(0 0 18px #f39c12)"/>
        <text x="50" y="75" font-size="28" font-family="'Ma Shan Zheng', 'STKaiti', serif" fill="#ffffff" text-anchor="middle" font-weight="900" filter="drop-shadow(0 0 4px #d35400)">卍</text>
      </svg>
    `;
    container.appendChild(palm);
    setTimeout(() => {
      triggerScreenShake();
      triggerHitStop(60);
      spawnImpactSparks(targetPos === 'attacker' ? 90 : 210, 80, '#f39c12', 9, container);
    }, 180);
    setTimeout(() => palm.remove(), 480);
  },

  "太極陰陽陣": (container, targetPos) => {
    const taiji = document.createElement('div');
    taiji.className = 'vfx-taiji-diagram';
    taiji.style.left = targetPos === 'attacker' ? '60px' : (targetPos === 'target' ? '180px' : '120px');
    taiji.innerHTML = `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="46" fill="#000" stroke="#5dade2" stroke-width="3" filter="drop-shadow(0 0 12px #3498db)"/>
        <path d="M50,4 A46,46 0 0,1 50,96 A23,23 0 0,1 50,50 A23,23 0 0,0 50,4 Z" fill="#fff"/>
        <circle cx="50" cy="27" r="7" fill="#000"/>
        <circle cx="50" cy="73" r="7" fill="#fff"/>
      </svg>
    `;
    container.appendChild(taiji);
    setTimeout(() => spawnImpactSparks(targetPos === 'attacker' ? 90 : 200, 80, '#5dade2', 6, container), 180);
    setTimeout(() => taiji.remove(), 500);
  },

  "一陽指純陽柱": (container, targetPos) => {
    const beam = document.createElement('div');
    beam.className = 'vfx-yiyang-beam';
    beam.style.left = targetPos === 'attacker' ? '70px' : (targetPos === 'target' ? '200px' : '135px');
    container.appendChild(beam);
    setTimeout(() => {
      triggerScreenShake();
      triggerHitStop(50);
      spawnImpactSparks(targetPos === 'attacker' ? 70 : 200, 80, '#f1c40f', 8, container);
    }, 160);
    setTimeout(() => beam.remove(), 440);
  },

  "三仙品字劍": (container, targetPos) => {
    const baseLeft = targetPos === 'attacker' ? 60 : (targetPos === 'target' ? 180 : 120);
    const s1 = document.createElement('div'); s1.className = 'vfx-sanxian-line line-1'; s1.style.left = baseLeft + 'px';
    const s2 = document.createElement('div'); s2.className = 'vfx-sanxian-line line-2'; s2.style.left = (baseLeft + 10) + 'px';
    const s3 = document.createElement('div'); s3.className = 'vfx-sanxian-line line-3'; s3.style.left = (baseLeft - 5) + 'px';
    container.appendChild(s1);
    setTimeout(() => { container.appendChild(s2); spawnImpactSparks(baseLeft, 70, '#5dade2', 4, container); }, 70);
    setTimeout(() => { container.appendChild(s3); triggerHitStop(60); spawnImpactSparks(baseLeft + 20, 85, '#ecf0f1', 8, container); }, 140);
    setTimeout(() => { s1.remove(); s2.remove(); s3.remove(); }, 500);
  },

  "狂風迅影": (container, targetPos) => {
    const baseLeft = targetPos === 'attacker' ? 60 : (targetPos === 'target' ? 170 : 110);
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const wind = document.createElement('div');
        wind.className = `vfx-wind-slash wind-delay-${i}`;
        wind.style.left = baseLeft + 'px';
        wind.style.top = (55 + i * 24) + 'px';
        container.appendChild(wind);
        spawnImpactSparks(baseLeft + 30, 65 + i * 20, '#00d2d3', 3, container);
        setTimeout(() => wind.remove(), 280);
      }, i * 65);
    }
  },

  "金刀地裂": (container, targetPos) => {
    const crack = document.createElement('div');
    crack.className = 'vfx-ground-crack';
    crack.style.left = targetPos === 'attacker' ? '40px' : (targetPos === 'target' ? '160px' : '100px');
    container.appendChild(crack);
    setTimeout(() => {
      triggerScreenShake();
      triggerHitStop(70);
      spawnImpactSparks(targetPos === 'attacker' ? 80 : 200, 110, '#f39c12', 10, container);
    }, 180);
    setTimeout(() => crack.remove(), 450);
  },

  "八卦旋轉刃": (container, targetPos) => {
    const blade = document.createElement('div');
    blade.className = 'vfx-bagua-blade';
    blade.style.left = targetPos === 'attacker' ? '50px' : (targetPos === 'target' ? '170px' : '110px');
    container.appendChild(blade);
    setTimeout(() => spawnImpactSparks(targetPos === 'attacker' ? 80 : 200, 80, '#f1c40f', 6, container), 150);
    setTimeout(() => blade.remove(), 400);
  },

  "詠春十字斬": (container, targetPos) => {
    const cross = document.createElement('div');
    cross.className = 'vfx-cross-slash';
    cross.style.left = targetPos === 'attacker' ? '60px' : (targetPos === 'target' ? '180px' : '120px');
    container.appendChild(cross);
    setTimeout(() => {
      triggerHitStop(50);
      spawnImpactSparks(targetPos === 'attacker' ? 80 : 205, 80, '#ff4757', 7, container);
    }, 120);
    setTimeout(() => cross.remove(), 340);
  },

  "驚濤巨浪": (container, targetPos) => {
    const wave = document.createElement('div');
    wave.className = 'vfx-ocean-wave';
    wave.style.left = targetPos === 'attacker' ? '50px' : (targetPos === 'target' ? '160px' : '110px');
    container.appendChild(wave);
    setTimeout(() => {
      triggerScreenShake();
      triggerHitStop(60);
      spawnImpactSparks(targetPos === 'attacker' ? 80 : 200, 85, '#2ed573', 8, container);
    }, 160);
    setTimeout(() => wave.remove(), 420);
  },

  "幻影無影拳": (container, targetPos) => {
    const baseLeft = targetPos === 'attacker' ? 50 : (targetPos === 'target' ? 170 : 110);
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        const fist = document.createElement('div');
        fist.className = 'vfx-shadowless-fist';
        fist.style.top = (45 + Math.random() * 50) + 'px';
        fist.style.left = (baseLeft + Math.random() * 40 - 20) + 'px';
        container.appendChild(fist);
        spawnImpactSparks(baseLeft + 15, 60 + i * 15, '#e67e22', 3, container);
        setTimeout(() => fist.remove(), 230);
      }, i * 50);
    }
  },

  "虎鶴利爪": (container, targetPos) => {
    const baseLeft = targetPos === 'attacker' ? 60 : (targetPos === 'target' ? 180 : 120);
    const claw = document.createElement('div');
    claw.className = 'vfx-tiger-claw';
    claw.style.left = baseLeft + 'px';
    container.appendChild(claw);
    setTimeout(() => spawnImpactSparks(baseLeft + 20, 75, '#e67e22', 5, container), 100);
    setTimeout(() => {
      const crane = document.createElement('div');
      crane.className = 'vfx-crane-beak';
      crane.style.left = (baseLeft + 15) + 'px';
      container.appendChild(crane);
      triggerHitStop(50);
      spawnImpactSparks(baseLeft + 25, 80, '#f1c40f', 6, container);
      setTimeout(() => crane.remove(), 250);
    }, 120);
    setTimeout(() => claw.remove(), 380);
  },

  "日字連環衝拳": (container, targetPos) => {
    const baseLeft = targetPos === 'attacker' ? 60 : (targetPos === 'target' ? 175 : 120);
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const punch = document.createElement('div');
        punch.className = 'vfx-riyue-punch';
        punch.style.left = baseLeft + 'px';
        punch.style.top = (70 + (i % 2) * 16) + 'px';
        container.appendChild(punch);
        spawnImpactSparks(baseLeft + 20, 75 + (i % 2) * 10, '#ff9f43', 4, container);
        setTimeout(() => punch.remove(), 210);
      }, i * 70);
    }
  },

  "幽冥紫焰踢": (container, targetPos) => {
    const flame = document.createElement('div');
    flame.className = 'vfx-youming-flame';
    flame.style.left = targetPos === 'attacker' ? '50px' : (targetPos === 'target' ? '175px' : '110px');
    container.appendChild(flame);
    setTimeout(() => {
      triggerScreenShake();
      triggerHitStop(60);
      spawnImpactSparks(targetPos === 'attacker' ? 80 : 205, 85, '#9b59b6', 8, container);
    }, 180);
    setTimeout(() => flame.remove(), 420);
  },

  "地趟龍捲風": (container, targetPos) => {
    const tornado = document.createElement('div');
    tornado.className = 'vfx-sweep-tornado';
    tornado.style.left = targetPos === 'attacker' ? '50px' : (targetPos === 'target' ? '175px' : '110px');
    container.appendChild(tornado);
    setTimeout(() => spawnImpactSparks(targetPos === 'attacker' ? 80 : 200, 105, '#bdc3c7', 6, container), 160);
    setTimeout(() => tornado.remove(), 400);
  },

  "十二路譚弧": (container, targetPos) => {
    const kick = document.createElement('div');
    kick.className = 'vfx-tan-kick';
    kick.style.left = targetPos === 'attacker' ? '55px' : (targetPos === 'target' ? '175px' : '115px');
    container.appendChild(kick);
    setTimeout(() => spawnImpactSparks(targetPos === 'attacker' ? 80 : 200, 85, '#f1c40f', 5, container), 140);
    setTimeout(() => kick.remove(), 320);
  },

  "暴雨梨花針": (container, targetPos) => {
    const storm = document.createElement('div');
    storm.className = 'vfx-storm-rain';
    storm.style.left = targetPos === 'attacker' ? '50px' : (targetPos === 'target' ? '160px' : '110px');
    container.appendChild(storm);
    setTimeout(() => spawnImpactSparks(targetPos === 'attacker' ? 90 : 205, 80, '#00d2d3', 9, container), 180);
    setTimeout(() => storm.remove(), 420);
  },

  "漫天飛花": (container, targetPos) => {
    const petals = document.createElement('div');
    petals.className = 'vfx-flower-rain';
    petals.style.left = targetPos === 'attacker' ? '50px' : (targetPos === 'target' ? '160px' : '110px');
    container.appendChild(petals);
    setTimeout(() => spawnImpactSparks(targetPos === 'attacker' ? 90 : 205, 75, '#ff6b81', 6, container), 160);
    setTimeout(() => petals.remove(), 400);
  },

  "青翠極光箭": (container, targetPos) => {
    const laser = document.createElement('div');
    laser.className = 'vfx-tanzhi-laser';
    laser.style.left = targetPos === 'attacker' ? '50px' : (targetPos === 'target' ? '170px' : '110px');
    container.appendChild(laser);
    setTimeout(() => {
      triggerHitStop(50);
      spawnImpactSparks(targetPos === 'attacker' ? 90 : 205, 80, '#2ed573', 7, container);
    }, 120);
    setTimeout(() => laser.remove(), 280);
  },

  "祖靈萬魂刺": (container, targetPos) => {
    const fury = document.createElement('div');
    fury.className = 'vfx-ancestor-fury';
    fury.style.left = targetPos === 'attacker' ? '45px' : (targetPos === 'target' ? '165px' : '105px');
    container.appendChild(fury);
    setTimeout(() => {
      triggerScreenShake();
      triggerHitStop(70);
      spawnImpactSparks(targetPos === 'attacker' ? 85 : 205, 85, '#2ecc71', 10, container);
    }, 200);
    setTimeout(() => fury.remove(), 480);
  },

  "百步青蛇鏢": (container, targetPos) => {
    const dart = document.createElement('div');
    dart.className = 'vfx-poison-dart';
    dart.style.left = targetPos === 'attacker' ? '50px' : (targetPos === 'target' ? '165px' : '110px');
    container.appendChild(dart);
    setTimeout(() => spawnImpactSparks(targetPos === 'attacker' ? 85 : 205, 80, '#10ac84', 6, container), 140);
    setTimeout(() => dart.remove(), 300);
  },

  "迅影拔刀芒": (container, targetPos) => {
    const iai = document.createElement('div');
    iai.className = 'vfx-quick-iai';
    iai.style.left = targetPos === 'attacker' ? '55px' : (targetPos === 'target' ? '175px' : '115px');
    container.appendChild(iai);
    setTimeout(() => {
      triggerHitStop(50);
      spawnImpactSparks(targetPos === 'attacker' ? 85 : 205, 80, '#ff4757', 7, container);
    }, 130);
    setTimeout(() => iai.remove(), 300);
  },

  "瘋魔砸地震": (container, targetPos) => {
    const staff = document.createElement('div');
    staff.className = 'vfx-mad-staff';
    staff.style.left = targetPos === 'attacker' ? '55px' : (targetPos === 'target' ? '175px' : '115px');
    container.appendChild(staff);
    setTimeout(() => {
      triggerScreenShake();
      triggerHitStop(60);
      spawnImpactSparks(targetPos === 'attacker' ? 85 : 205, 95, '#e67e22', 8, container);
    }, 170);
    setTimeout(() => staff.remove(), 380);
  },

  "剛猛拳罡波": (container, targetPos) => {
    const blast = document.createElement('div');
    blast.className = 'vfx-taizu-blast';
    blast.style.left = targetPos === 'attacker' ? '50px' : (targetPos === 'target' ? '170px' : '110px');
    container.appendChild(blast);
    setTimeout(() => spawnImpactSparks(targetPos === 'attacker' ? 80 : 200, 80, '#f39c12', 6, container), 130);
    setTimeout(() => blast.remove(), 280);
  }
};

/**
 * 核心呼叫入口：根據名稱與位置執行特效
 * @param {string} effectName 特效名
 * @param {HTMLElement} customContainer 容器（可為 arena-vfx-container 或 editor 的 vfx-anim-layer）
 * @param {'attacker'|'target'|'center'} targetPos 出現位置
 */
function playVfxEffect(effectName, customContainer = null, targetPos = 'target') {
  const container = customContainer || document.getElementById('arena-vfx-container') || document.getElementById('vfx-anim-layer');
  if (!container) return;
  const runner = VFX_PRESET_MAP[effectName];
  if (typeof runner === 'function') {
    runner(container, targetPos);
  } else {
    // 預設兜底：剛猛拳罡波
    VFX_PRESET_MAP["剛猛拳罡波"](container, targetPos);
  }
}

/**
 * 依據技能名稱或配置播放完整戰鬥特效
 */
function playUniqueSkillAnimation(skillName, pRig, arm, curWType, skillObj = null) {
  const vfxContainer = document.getElementById('arena-vfx-container');
  if (vfxContainer) vfxContainer.innerHTML = '';

  // 若技能物件擁有三段配置 (vfxChain)，優先執行三段連鎖
  if (skillObj && skillObj.vfxChain) {
    const pre = skillObj.vfxChain.pre || "無動畫";
    const mid = skillObj.vfxChain.mid || "剛猛拳罡波";
    const post = skillObj.vfxChain.post || "無動畫";
    const postTarget = skillObj.vfxChain.postTarget || "target"; // 自選位置：attacker, target, center

    // 前搖：出現在攻擊方
    if (pre !== "無動畫") playVfxEffect(pre, vfxContainer, 'attacker');

    // 命中：出現在被攻擊方
    setTimeout(() => {
      if (mid !== "無動畫") playVfxEffect(mid, vfxContainer, 'target');
    }, 200);

    // 收招殘影：出現在指定位置
    setTimeout(() => {
      if (post !== "無動畫") playVfxEffect(post, vfxContainer, postTarget);
    }, 450);

    return;
  }

  // 舊版 26 門武學名稱自動匹配邏輯
  for (let key in VFX_PRESET_MAP) {
    if (key !== "無動畫" && skillName.includes(key.substring(0, 2))) {
      playVfxEffect(key, vfxContainer, 'target');
      return;
    }
  }

  // 預設突刺
  playVfxEffect("剛猛拳罡波", vfxContainer, 'target');
}

/**
 * 清除玩家骨骼動作 Class
 */
function clearPlayerAnimations(pRig, arm) {
  if (pRig) {
    pRig.classList.remove(
      'anim-thrust-body', 'anim-tanzhi-body', 'anim-thug-flick',
      'anim-heavy-hit-player', 'anim-jump-dodge-player',
      'anim-ittoryu-sheathe-body', 'anim-dragon-body', 'anim-taiji-stance',
      'anim-sanxian-dash', 'anim-jindao-jump', 'anim-shadowless-body',
      'anim-youming-kick', 'anim-sweep-body'
    );
  }
  if (arm) arm.classList.remove('anim-thrust-arm', 'anim-ittoryu-sheathe-arm');
}

/**
 * 飄字生成
 */
function spawnFloatingDmg(text, left, top, cssClass) {
  const arena = document.getElementById('arena-box') || document.getElementById('vfx-stage');
  if (!arena) return;
  const p = document.createElement('div');
  p.className = `dmg-num ${cssClass}`;
  p.innerText = text;
  p.style.left = left + 'px';
  p.style.top = top + 'px';
  arena.appendChild(p);
  setTimeout(() => p.remove(), 650);
}

/**
 * 螢幕動態震顫
 */
function triggerScreenShake() {
  const app = document.getElementById('phone-app') || document.getElementById('vfx-stage');
  if (!app) return;
  app.classList.remove('shake');
  void app.offsetWidth;
  app.classList.add('shake');
}

/**
 * 護體罡氣
 */
function spawnQiShieldVfx(isPlayer) {
  const vfxContainer = document.getElementById('arena-vfx-container') || document.getElementById('vfx-anim-layer');
  if (!vfxContainer) return;

  const shield = document.createElement('div');
  shield.style.cssText = `
    position: absolute;
    ${isPlayer ? 'left: 45px;' : 'right: 45px;'}
    top: 50px;
    width: 80px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid ${isPlayer ? '#5dade2' : '#f1c40f'};
    background: radial-gradient(circle, ${isPlayer ? 'rgba(93,173,226,0.35)' : 'rgba(241,196,15,0.35)'} 0%, transparent 80%);
    box-shadow: 0 0 24px ${isPlayer ? '#5dade2' : '#f1c40f'};
    pointer-events: none;
    z-index: 14;
    animation: qiShieldPulse 0.4s ease-out forwards;
  `;
  vfxContainer.appendChild(shield);
  setTimeout(() => shield.remove(), 400);
}

/**
 * 敵方絕招光弧
 */
function playEnemySkillVfx(skillName) {
  const vfxContainer = document.getElementById('arena-vfx-container') || document.getElementById('vfx-anim-layer');
  if (!vfxContainer) return;

  const slash = document.createElement('div');
  slash.style.cssText = `
    position: absolute;
    right: 90px;
    top: 70px;
    width: 140px;
    height: 60px;
    background: radial-gradient(ellipse at center, rgba(231,76,60,0.85) 0%, transparent 75%);
    border-radius: 50%;
    z-index: 11;
    pointer-events: none;
    animation: qiShieldPulse 0.35s ease-out forwards;
  `;
  vfxContainer.appendChild(slash);
  setTimeout(() => slash.remove(), 350);
}

// 掛載至全域 window 物件
window.VFX_PRESET_MAP = VFX_PRESET_MAP;
window.playVfxEffect = playVfxEffect;
window.playUniqueSkillAnimation = playUniqueSkillAnimation;
window.clearPlayerAnimations = clearPlayerAnimations;
window.spawnFloatingDmg = spawnFloatingDmg;
window.triggerScreenShake = triggerScreenShake;
window.spawnQiShieldVfx = spawnQiShieldVfx;
window.playEnemySkillVfx = playEnemySkillVfx;
window.triggerHitStop = triggerHitStop;
window.spawnImpactSparks = spawnImpactSparks;