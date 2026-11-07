/**
 * ========================================================
 * 你的江湖 - 戰鬥特效與動畫獨立模組 (combat_vfx.js) [完整 26 門武學特效版]
 * 專門負責：
 * 1. 26 門武學專屬視覺特效（全屏居合、降龍金龍、萬佛朝宗、太極陰陽陣等）
 * 2. 傷害飄字、震屏、護體罡氣與敵方技能光效
 * 3. 火柴人動作狀態清理
 * ========================================================
 */

function playUniqueSkillAnimation(skillName, pRig, arm, curWType) {
  const vfxContainer = document.getElementById('arena-vfx-container');
  if (vfxContainer) vfxContainer.innerHTML = '';

  // 1. 【秘劍・一之太刀】全屏黑幕居合
  if (skillName.includes("一之太刀")) {
    if (pRig) pRig.classList.add('anim-ittoryu-sheathe-body');
    if (arm) arm.classList.add('anim-ittoryu-sheathe-arm');
    if (vfxContainer) {
      const topCurtain = document.createElement('div');
      topCurtain.className = 'vfx-ittoryu-curtain-top';
      const bottomCurtain = document.createElement('div');
      bottomCurtain.className = 'vfx-ittoryu-curtain-bottom';
      const horizonSlash = document.createElement('div');
      horizonSlash.className = 'vfx-ittoryu-horizon-slash';
      const horizonFlash = document.createElement('div');
      horizonFlash.className = 'vfx-ittoryu-horizon-flash';

      vfxContainer.appendChild(topCurtain);
      vfxContainer.appendChild(bottomCurtain);
      vfxContainer.appendChild(horizonSlash);
      vfxContainer.appendChild(horizonFlash);

      setTimeout(() => triggerScreenShake(), 160);
      setTimeout(() => {
        const glint = document.createElement('div');
        glint.className = 'vfx-ittoryu-glint';
        vfxContainer.appendChild(glint);
        setTimeout(() => glint.remove(), 320);
      }, 480);
      setTimeout(() => {
        const burst = document.createElement('div');
        burst.className = 'vfx-ittoryu-burst';
        vfxContainer.appendChild(burst);
        triggerScreenShake();
        setTimeout(() => burst.remove(), 400);
      }, 550);

      setTimeout(() => {
        topCurtain.remove();
        bottomCurtain.remove();
        horizonSlash.remove();
        horizonFlash.remove();
      }, 950);
    }
    return;
  }

  // 2. 【降龍十八掌・亢龍有悔】金龍衝天
  if (skillName.includes("降龍") || skillName.includes("亢龍")) {
    if (pRig) pRig.classList.add('anim-dragon-body');
    if (arm) arm.classList.add('anim-thrust-arm');
    if (vfxContainer) {
      const dragon = document.createElement('div');
      dragon.className = 'vfx-dragon-fly';
      dragon.innerHTML = `
        <svg viewBox="0 0 200 80" width="100%" height="100%">
          <path d="M10,40 Q60,10 110,40 T190,40" stroke="#f1c40f" stroke-width="12" fill="none" stroke-linecap="round" filter="drop-shadow(0 0 10px #e67e22)"/>
          <path d="M10,40 Q60,10 110,40 T190,40" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
          <circle cx="185" cy="40" r="16" fill="#f39c12"/>
          <circle cx="190" cy="36" r="3" fill="#ffffff"/>
        </svg>
      `;
      vfxContainer.appendChild(dragon);
      setTimeout(() => triggerScreenShake(), 220);
      setTimeout(() => dragon.remove(), 480);
    }
    return;
  }

  // 3. 【大力金剛掌】萬佛朝宗
  if (skillName.includes("金剛掌")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      const palm = document.createElement('div');
      palm.className = 'vfx-buddha-palm';
      palm.innerHTML = `
        <svg viewBox="0 0 100 120" width="100%" height="100%">
          <path d="M20,100 Q15,40 30,30 Q40,10 50,30 Q60,10 70,30 Q85,40 80,100 Z" fill="rgba(241,196,15,0.75)" stroke="#ffeaa7" stroke-width="3" filter="drop-shadow(0 0 15px #f39c12)"/>
          <text x="50" y="75" font-size="28" font-family="serif" fill="#ffffff" text-anchor="middle" font-weight="bold">卍</text>
        </svg>
      `;
      vfxContainer.appendChild(palm);
      setTimeout(() => triggerScreenShake(), 200);
      setTimeout(() => palm.remove(), 450);
    }
    return;
  }

  // 4. 【武當太極長拳】陰陽太極陣
  if (skillName.includes("太極")) {
    if (pRig) pRig.classList.add('anim-taiji-stance');
    if (vfxContainer) {
      const taiji = document.createElement('div');
      taiji.className = 'vfx-taiji-diagram';
      taiji.innerHTML = `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="46" fill="#000" stroke="#5dade2" stroke-width="3"/>
          <path d="M50,4 A46,46 0 0,1 50,96 A23,23 0 0,1 50,50 A23,23 0 0,0 50,4 Z" fill="#fff"/>
          <circle cx="50" cy="27" r="7" fill="#000"/>
          <circle cx="50" cy="73" r="7" fill="#fff"/>
        </svg>
      `;
      vfxContainer.appendChild(taiji);
      setTimeout(() => taiji.remove(), 450);
    }
    return;
  }

  // 5. 【先天功一陽指意】九天金光貫頂
  if (skillName.includes("一陽指")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      const beam = document.createElement('div');
      beam.className = 'vfx-yiyang-beam';
      vfxContainer.appendChild(beam);
      setTimeout(() => triggerScreenShake(), 180);
      setTimeout(() => beam.remove(), 420);
    }
    return;
  }

  // 6. 【奪命連環三仙劍】三道品字劍芒
  if (skillName.includes("三仙劍")) {
    if (pRig) pRig.classList.add('anim-sanxian-dash');
    if (arm) arm.classList.add('anim-thrust-arm');
    if (vfxContainer) {
      const s1 = document.createElement('div'); s1.className = 'vfx-sanxian-line line-1';
      const s2 = document.createElement('div'); s2.className = 'vfx-sanxian-line line-2';
      const s3 = document.createElement('div'); s3.className = 'vfx-sanxian-line line-3';
      vfxContainer.appendChild(s1);
      setTimeout(() => vfxContainer.appendChild(s2), 70);
      setTimeout(() => vfxContainer.appendChild(s3), 140);
      setTimeout(() => { s1.remove(); s2.remove(); s3.remove(); }, 480);
    }
    return;
  }

  // 7. 【狂風快劍】連環風刃
  if (skillName.includes("狂風快劍")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const wind = document.createElement('div');
          wind.className = `vfx-wind-slash wind-delay-${i}`;
          wind.style.top = (60 + i * 22) + 'px';
          vfxContainer.appendChild(wind);
          setTimeout(() => wind.remove(), 260);
        }, i * 60);
      }
    }
    return;
  }

  // 8. 【金刀八式・斬乾坤】金芒地裂
  if (skillName.includes("金刀八式") || skillName.includes("斬乾坤")) {
    if (pRig) pRig.classList.add('anim-jindao-jump');
    if (vfxContainer) {
      const crack = document.createElement('div');
      crack.className = 'vfx-ground-crack';
      vfxContainer.appendChild(crack);
      setTimeout(() => triggerScreenShake(), 180);
      setTimeout(() => crack.remove(), 420);
    }
    return;
  }

  // 9. 【八卦六合刀】八卦旋轉圓輪刀氣
  if (skillName.includes("八卦六合刀")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      const baguaBlade = document.createElement('div');
      baguaBlade.className = 'vfx-bagua-blade';
      vfxContainer.appendChild(baguaBlade);
      setTimeout(() => baguaBlade.remove(), 380);
    }
    return;
  }

  // 10. 【八斬刀法・奪魂】詠春雙短刀十字斬
  if (skillName.includes("八斬刀")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      const cross = document.createElement('div');
      cross.className = 'vfx-cross-slash';
      vfxContainer.appendChild(cross);
      setTimeout(() => cross.remove(), 320);
    }
    return;
  }

  // 11. 【劈波斬浪大斷刀】驚濤拍岸巨浪斬
  if (skillName.includes("劈波斬浪") || skillName.includes("大斷刀")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      const wave = document.createElement('div');
      wave.className = 'vfx-ocean-wave';
      vfxContainer.appendChild(wave);
      setTimeout(() => triggerScreenShake(), 160);
      setTimeout(() => wave.remove(), 400);
    }
    return;
  }

  // 12. 【佛山無影拳】幻影三重無影拳陣
  if (skillName.includes("無影拳")) {
    if (pRig) pRig.classList.add('anim-shadowless-body');
    if (vfxContainer) {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          const fist = document.createElement('div');
          fist.className = 'vfx-shadowless-fist';
          fist.style.top = (50 + Math.random() * 50) + 'px';
          fist.style.left = (120 + Math.random() * 100) + 'px';
          vfxContainer.appendChild(fist);
          setTimeout(() => fist.remove(), 220);
        }, i * 50);
      }
    }
    return;
  }

  // 13. 【虎鶴雙形掌】虎爪撕裂 + 鶴喙穿喉
  if (skillName.includes("虎鶴雙形")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      const claw = document.createElement('div');
      claw.className = 'vfx-tiger-claw';
      vfxContainer.appendChild(claw);
      setTimeout(() => {
        const crane = document.createElement('div');
        crane.className = 'vfx-crane-beak';
        vfxContainer.appendChild(crane);
        setTimeout(() => crane.remove(), 240);
      }, 120);
      setTimeout(() => claw.remove(), 360);
    }
    return;
  }

  // 14. 【日字連環衝拳】金芒連環密集直衝拳
  if (skillName.includes("日字連環")) {
    if (pRig) pRig.classList.add('anim-thug-flick');
    if (vfxContainer) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const punch = document.createElement('div');
          punch.className = 'vfx-riyue-punch';
          punch.style.top = (75 + (i % 2) * 16) + 'px';
          vfxContainer.appendChild(punch);
          setTimeout(() => punch.remove(), 200);
        }, i * 70);
      }
    }
    return;
  }

  // 15. 【北派幽冥旋風腿】幽冥紫焰飛踢
  if (skillName.includes("幽冥旋風腿")) {
    if (pRig) pRig.classList.add('anim-youming-kick');
    if (vfxContainer) {
      const flame = document.createElement('div');
      flame.className = 'vfx-youming-flame';
      vfxContainer.appendChild(flame);
      setTimeout(() => triggerScreenShake(), 180);
      setTimeout(() => flame.remove(), 400);
    }
    return;
  }

  // 16. 【鐵掃帚狂風腿】地趟龍捲狂風
  if (skillName.includes("鐵掃帚")) {
    if (pRig) pRig.classList.add('anim-sweep-body');
    if (vfxContainer) {
      const tornado = document.createElement('div');
      tornado.className = 'vfx-sweep-tornado';
      vfxContainer.appendChild(tornado);
      setTimeout(() => tornado.remove(), 380);
    }
    return;
  }

  // 17. 【十二路譚腿】雙道弧光踢擊
  if (skillName.includes("譚腿")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      const kick = document.createElement('div');
      kick.className = 'vfx-tan-kick';
      vfxContainer.appendChild(kick);
      setTimeout(() => kick.remove(), 300);
    }
    return;
  }

  // 18. 【暴雨梨花針】銀針狂濤
  if (skillName.includes("暴雨梨花")) {
    if (pRig) pRig.classList.add('anim-thug-flick');
    if (vfxContainer) {
      const storm = document.createElement('div');
      storm.className = 'vfx-storm-rain';
      vfxContainer.appendChild(storm);
      setTimeout(() => storm.remove(), 400);
    }
    return;
  }

  // 19. 【漫天花雨手法】花瓣飛雨暗器
  if (skillName.includes("漫天花雨")) {
    if (pRig) pRig.classList.add('anim-thug-flick');
    if (vfxContainer) {
      const petals = document.createElement('div');
      petals.className = 'vfx-flower-rain';
      vfxContainer.appendChild(petals);
      setTimeout(() => petals.remove(), 380);
    }
    return;
  }

  // 20. 【彈指神通】青翠極光氣箭
  if (skillName.includes("彈指")) {
    if (pRig) pRig.classList.add('anim-tanzhi-body');
    if (vfxContainer) {
      const laser = document.createElement('div');
      laser.className = 'vfx-tanzhi-laser';
      vfxContainer.appendChild(laser);
      setTimeout(() => laser.remove(), 260);
    }
    return;
  }

  // 21. 【祖靈之怒・萬魂獵殺】漫天幽綠骨刺隕星
  if (skillName.includes("祖靈之怒") || skillName.includes("萬魂")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      const fury = document.createElement('div');
      fury.className = 'vfx-ancestor-fury';
      vfxContainer.appendChild(fury);
      setTimeout(() => triggerScreenShake(), 200);
      setTimeout(() => fury.remove(), 450);
    }
    return;
  }

  // 22. 【百步獵魂吹箭術】青蛇毒箭射殺
  if (skillName.includes("吹箭")) {
    if (pRig) pRig.classList.add('anim-thug-flick');
    if (vfxContainer) {
      const dart = document.createElement('div');
      dart.className = 'vfx-poison-dart';
      vfxContainer.appendChild(dart);
      setTimeout(() => dart.remove(), 280);
    }
    return;
  }

  // 23. 【居合疾影拔刀斬】居合迅影弧光
  if (skillName.includes("拔刀")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      const iai = document.createElement('div');
      iai.className = 'vfx-quick-iai';
      vfxContainer.appendChild(iai);
      setTimeout(() => iai.remove(), 280);
    }
    return;
  }

  // 24. 【瘋魔杖法】狂暴重棍砸地
  if (skillName.includes("瘋魔")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      const staff = document.createElement('div');
      staff.className = 'vfx-mad-staff';
      vfxContainer.appendChild(staff);
      setTimeout(() => triggerScreenShake(), 170);
      setTimeout(() => staff.remove(), 350);
    }
    return;
  }

  // 25. 【太祖長拳 / 基礎拳法】外家剛猛拳罡波
  if (skillName.includes("拳法") || skillName.includes("太祖長拳")) {
    if (pRig) pRig.classList.add('anim-thrust-body');
    if (vfxContainer) {
      const blast = document.createElement('div');
      blast.className = 'vfx-taizu-blast';
      vfxContainer.appendChild(blast);
      setTimeout(() => blast.remove(), 260);
    }
    return;
  }

  // 26. 【基礎劍法 / 基礎刀法 / 基礎棍法 / 基礎暗器 / 兜底突刺】
  if (pRig) pRig.classList.add('anim-thrust-body');
  if (arm) arm.classList.add('anim-thrust-arm');
  if (vfxContainer) {
    const stab = document.createElement('div');
    stab.className = 'vfx-basic-stab';
    vfxContainer.appendChild(stab);
    setTimeout(() => stab.remove(), 220);
  }
}

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

function spawnFloatingDmg(text, left, top, cssClass) {
  const arena = document.getElementById('arena-box');
  if (!arena) return;
  const p = document.createElement('div');
  p.className = `dmg-num ${cssClass}`;
  p.innerText = text;
  p.style.left = left + 'px';
  p.style.top = top + 'px';
  arena.appendChild(p);
  setTimeout(() => p.remove(), 650);
}

function triggerScreenShake() {
  const app = document.getElementById('phone-app');
  if (!app) return;
  app.classList.remove('shake');
  void app.offsetWidth;
  app.classList.add('shake');
}

function spawnQiShieldVfx(isPlayer) {
  const vfxContainer = document.getElementById('arena-vfx-container');
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
    background: radial-gradient(circle, ${isPlayer ? 'rgba(93,173,226,0.3)' : 'rgba(241,196,15,0.3)'} 0%, transparent 80%);
    box-shadow: 0 0 20px ${isPlayer ? '#5dade2' : '#f1c40f'};
    pointer-events: none;
    z-index: 14;
    animation: qiShieldPulse 0.4s ease-out forwards;
  `;
  vfxContainer.appendChild(shield);
  setTimeout(() => shield.remove(), 400);
}

function playEnemySkillVfx(skillName) {
  const vfxContainer = document.getElementById('arena-vfx-container');
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

// 掛載全域供 combat.js 調用
window.playUniqueSkillAnimation = playUniqueSkillAnimation;
window.clearPlayerAnimations = clearPlayerAnimations;
window.spawnFloatingDmg = spawnFloatingDmg;
window.triggerScreenShake = triggerScreenShake;
window.spawnQiShieldVfx = spawnQiShieldVfx;
window.playEnemySkillVfx = playEnemySkillVfx;