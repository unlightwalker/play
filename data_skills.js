/**
 * ========================================================
 * 你的江湖 - 全域武學資料庫 (data_skills.js)
 * 包含：各派武學 (劍/刀/棍/暗器/拳腳/心法/輕功)
 * 支援：拳腳門派武學擴充、散財童子天賦判定
 * ========================================================
 */

// 1. 武學品階蓄力速度係數
const RARITY_SPEED_FACTOR = {
  "凡品": 1.25,
  "良品": 1.10,
  "上品": 0.95,
  "絕品": 0.80,
  "神品": 0.65
};

// 2. 參悟基礎修為消耗
const RARITY_BASE_EXP = {
  "凡品": 75,
  "良品": 360,
  "上品": 1950,
  "絕品": 7800,
  "神品": 26000
};

// 3. 武學造詣評價演算法
function getKungfuEval(tier, progress) {
  if (tier >= 10 && progress >= 100) return "大圓滿";
  if (tier === 1 && progress === 0) return "初學者";
  if (tier <= 2) return "略窺門徑";
  if (tier <= 4) return "駕輕就熟";
  if (tier <= 6) return "融會貫通";
  if (tier <= 8) return "出神入化";
  if (tier <= 9) return "登峰造極";
  return "返璞歸真";
}

// 4. 計算單次參悟所需修為
function getUpgradeExpCost(rarity, tier) {
  const base = RARITY_BASE_EXP[rarity] || 75;
  return Math.floor(base * (1 + (tier - 1) * 0.45));
}

// 5. 武學兵刃要求推導器
function getSkillWeaponReq(skill) {
  if (!skill) return "任意";
  if (skill.weaponReq) return skill.weaponReq;
  const n = skill.name || "";
  if (n.includes("針") || n.includes("釘") || n.includes("鏢") || n.includes("暗器") || n.includes("石") || n.includes("花雨") || n.includes("彈指") || n.includes("箭")) return "暗器";
  if (n.includes("劍")) return "劍";
  if (n.includes("刀") || n.includes("斬")) return "刀";
  if (n.includes("棍") || n.includes("棒") || n.includes("杖")) return "棍";
  if (n.includes("拳") || n.includes("掌") || n.includes("指") || n.includes("腿") || n.includes("念頭") || n.includes("套")) return "拳";
  return "任意";
}

// 6. 檢驗武學與武器契合度 (整合【散財童子】與【兵器大師】天賦)
function isSkillCompatibleWithWeapon(skill, weapon) {
  if (!skill) return false;
  const req = getSkillWeaponReq(skill);
  if (req === "任意") return true;

  const wType = (typeof getWeaponType === "function") ? getWeaponType(weapon) : "拳";

  // 天賦：兵器大師 (任何武學視為契合)
  if (typeof player !== 'undefined' && Array.isArray(player.talents)) {
    if (player.talents.some(t => t.id === "t_132" || t.name === "兵器大師")) {
      return true;
    }
  }

  // 天賦：散財童子 (裝備非暗器時仍可使用暗器外功，但需有至少 2 兩銀兩)
  if (req === "暗器" && typeof player !== 'undefined' && Array.isArray(player.talents)) {
    const hasSancai = player.talents.some(t => t.id === "t_sancai" || t.name.includes("散財童子"));
    if (hasSancai) {
      if ((player.gold || 0) >= 2) {
        return true; // 契合生效 (出招時扣除 2 兩)
      } else {
        return false; // 銀兩不足，天賦失效，判定不契合
      }
    }
  }

  return req === wType;
}

// ==================== 全域武學資料表 ====================
const GLOBAL_SKILLS = [
  // 基礎入門武學
  {
    id: "kf_taizu",
    name: "太祖長拳",
    type: "external",
    weaponReq: "拳",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseMult: 1.15,
    reqStats: { arm: 15, bone: 15 },
    statBonus: { arm: 2, bone: 2 },
    jinyongDesc: "少俠沉肩墜肘，一式『雙龍出海』，拳法平正剛肅！"
  },
  {
    id: "kf_wood_sword",
    name: "粗淺木劍刺",
    type: "external",
    weaponReq: "劍",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseMult: 1.35,
    reqStats: { speed: 20 },
    statBonus: { speed: 3, arm: 1 },
    jinyongDesc: "長劍一抖，化為寒星疾刺，身隨劍走！"
  },
  {
    id: "kf_tuna",
    name: "吐納坐忘訣",
    type: "internal",
    weaponReq: "任意",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseHpBonus: 50,
    baseDefBonus: 4,
    reqStats: { inner: 10 },
    statBonus: { inner: 4, bone: 2 },
    effectDesc: "調勻內息，增幅氣血上限與護體罡氣。"
  },
  {
    id: "kf_caoshangfei",
    name: "草上飛",
    type: "qinggong",
    weaponReq: "任意",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseSpeedBonus: 12,
    reqStats: { speed: 25 },
    statBonus: { speed: 5 },
    effectDesc: "提氣躍步，步履如飛，顯著提升出手身法。"
  },

  // 江湖武館傳授
  {
    id: "kf_bagua_dao",
    name: "八卦六合刀",
    type: "external",
    weaponReq: "刀",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseMult: 1.60,
    reqStats: { arm: 30, speed: 25 },
    statBonus: { arm: 6 },
    costLearn: 50,
    costGold: 20,
    jinyongDesc: "八卦步法游走，反手一刀『金蛇纏柳』直斬肋下！"
  },
  {
    id: "kf_tiebushan",
    name: "金剛鐵布衫",
    type: "internal",
    weaponReq: "任意",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseHpBonus: 90,
    baseDefBonus: 12,
    reqStats: { bone: 30 },
    statBonus: { bone: 6, inner: 4 },
    costLearn: 60,
    costGold: 25,
    effectDesc: "常駐硬氣功護體，氣血防禦雙向提升。"
  },
  {
    id: "kf_feiyan",
    name: "飛簷走壁",
    type: "qinggong",
    weaponReq: "任意",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseSpeedBonus: 20,
    reqStats: { speed: 35 },
    statBonus: { speed: 8 },
    costLearn: 60,
    costGold: 25,
    effectDesc: "提身涉險，如靈燕穿柳，大幅提升出手身法。"
  },
  {
    id: "kf_huayu",
    name: "漫天花雨手法",
    type: "external",
    weaponReq: "暗器",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseMult: 1.70,
    reqStats: { speed: 35 },
    statBonus: { speed: 7 },
    costLearn: 60,
    costGold: 25,
    jinyongDesc: "揮袖之間飛花化針，數枚暗器如漫天細雨飄落！"
  },

  // 【南拳門】專屬武學 (武器：拳)
  {
    id: "kf_nan_riyue",
    name: "日字連環衝拳",
    type: "external",
    weaponReq: "拳",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseMult: 1.35,
    reqRank: "外門弟子",
    costLearn: 40,
    reqStats: { speed: 20, arm: 15 },
    statBonus: { arm: 3, speed: 2 },
    jinyongDesc: "短橋窄馬，中線連環日字衝拳如狂風暴雨般傾瀉對手胸口！"
  },
  {
    id: "kf_nan_huhe",
    name: "虎鶴雙形掌",
    type: "external",
    weaponReq: "拳",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseMult: 1.75,
    reqRank: "內門弟子",
    costLearn: 90,
    reqStats: { arm: 35, bone: 30 },
    statBonus: { arm: 8, bone: 4 },
    jinyongDesc: "剛柔並濟，虎爪剛烈開碑裂石，鶴手飄忽專打人身軟穴！"
  },
  {
    id: "kf_nan_tiexian",
    name: "鐵線金剛拳綱",
    type: "internal",
    weaponReq: "任意",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseHpBonus: 155,
    baseDefBonus: 18,
    reqRank: "真傳弟子",
    costLearn: 180,
    reqStats: { inner: 40, arm: 35 },
    statBonus: { inner: 15, arm: 8 },
    effectDesc: "開合吞吐，氣蓄丹田，兩臂如鑄鐵金剛，極大增幅筋骨。"
  },
  {
    id: "kf_nan_shadowless",
    name: "佛山無影拳",
    type: "external",
    weaponReq: "拳",
    rarity: "絕品",
    tier: 1,
    progress: 0,
    baseMult: 2.70,
    uniqueVfx: "nan_fist",
    reqRank: "長老",
    costLearn: 340,
    reqStats: { arm: 60, speed: 55 },
    statBonus: { arm: 18, speed: 12 },
    jinyongDesc: "出拳聲東擊西，影過留痕，一息百拳，拳風激盪震裂山石！"
  },

  // 【北腿宗】專屬武學 (武器：拳)
  {
    id: "kf_bei_tan",
    name: "十二路譚腿",
    type: "external",
    weaponReq: "拳",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseMult: 1.38,
    reqRank: "外門弟子",
    costLearn: 40,
    reqStats: { speed: 25, arm: 15 },
    statBonus: { speed: 4, arm: 2 },
    jinyongDesc: "手是兩扇門，全憑腿打人！譚腿起處連環踢擊，招招直奔下盤！"
  },
  {
    id: "kf_bei_sweep",
    name: "鐵掃帚狂風腿",
    type: "external",
    weaponReq: "拳",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseMult: 1.70,
    reqRank: "內門弟子",
    costLearn: 90,
    reqStats: { speed: 42, bone: 25 },
    statBonus: { speed: 8, bone: 4 },
    jinyongDesc: "身形旋轉貼地飛掃，宛如狂飆捲地，腿勁呼嘯帶風！"
  },
  {
    id: "kf_bei_step",
    name: "登萍度水身法",
    type: "qinggong",
    weaponReq: "任意",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseSpeedBonus: 32,
    reqRank: "真傳弟子",
    costLearn: 180,
    reqStats: { speed: 50 },
    statBonus: { speed: 16 },
    effectDesc: "提氣凌空，雙足如在浪尖踏雪奔行，身形縹緲神駿。"
  },
  {
    id: "kf_bei_whirlwind",
    name: "北派幽冥旋風腿",
    type: "external",
    weaponReq: "拳",
    rarity: "絕品",
    tier: 1,
    progress: 0,
    baseMult: 2.65,
    uniqueVfx: "bei_kick",
    reqRank: "長老",
    costLearn: 330,
    reqStats: { speed: 65, arm: 45 },
    statBonus: { speed: 18, arm: 10 },
    jinyongDesc: "縱身凌空七連環踢，腿影遮天蔽日，霸道絕倫無可抵擋！"
  },

  // 門派拳腳補充 (少林金剛掌、武當太極拳)
  {
    id: "kf_shaolin_palm",
    name: "大力金剛掌",
    type: "external",
    weaponReq: "拳",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseMult: 2.10,
    reqStats: { arm: 45, bone: 40 },
    statBonus: { arm: 12, bone: 6 },
    costLearn: 180,
    jinyongDesc: "掌風剛烈雄勁，勢若降龍伏虎，一掌擊出風雷激盪！"
  },
  {
    id: "kf_taiji_fist",
    name: "武當太極長拳",
    type: "external",
    weaponReq: "拳",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseMult: 2.05,
    reqStats: { inner: 40, bone: 35 },
    statBonus: { inner: 12, bone: 8 },
    costLearn: 180,
    jinyongDesc: "圓轉如意，以柔克剛，借敵千斤之力反震其體！"
  },

  // 神品絕學
  {
    id: "kf_tanzhi",
    name: "彈指神通",
    type: "external",
    weaponReq: "暗器",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.20,
    uniqueVfx: "tanzhi",
    reqStats: { speed: 50, inner: 40 },
    statBonus: { speed: 25, arm: 10 },
    jinyongDesc: "指尖微曲隨即一彈，嗤的一聲急響，一道森森氣勁如離弦之箭激射而出！"
  },
  {
    id: "kf_dragon_palm",
    name: "降龍十八掌・亢龍有悔",
    type: "external",
    weaponReq: "拳",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.10,
    uniqueVfx: "dragon",
    reqRank: "長老",
    costLearn: 380,
    reqStats: { arm: 65, bone: 60, inner: 50 },
    statBonus: { arm: 26, bone: 18 },
    jinyongDesc: "一聲龍吟驟起，金龍神罡破空而出，排山倒海傾瀉敵體！"
  },
  {
    id: "kf_storm_needles",
    name: "暴雨梨花針",
    type: "external",
    weaponReq: "暗器",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.15,
    uniqueVfx: "storm",
    reqRank: "長老",
    costLearn: 380,
    reqStats: { speed: 65, arm: 35 },
    statBonus: { speed: 28 },
    jinyongDesc: "二十七枚淬毒銀針齊發，漫天花雨，神鬼難逃！"
  },
  {
    id: "kf_yiyang",
    name: "先天功一陽指意",
    type: "external",
    weaponReq: "拳",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 2.85,
    uniqueVfx: "yiyang",
    reqRank: "長老",
    costLearn: 360,
    reqStats: { inner: 60, bone: 50 },
    statBonus: { inner: 20, arm: 15 },
    jinyongDesc: "純陽極致神指破體而出，九天純陽金光貫頂，霸道無比！"
  },
  {
    id: "kf_ittoryu_ultimate",
    name: "秘劍・一之太刀",
    type: "external",
    weaponReq: "刀",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.25,
    uniqueVfx: "ittoryu",
    reqRank: "長老",
    costLearn: 380,
    reqStats: { arm: 65, speed: 70 },
    statBonus: { arm: 28, speed: 12 },
    jinyongDesc: "心技體合一之居合奧義，雷光一閃之間敵軀兩斷！"
  },
  {
    id: "kf_ancestor_ultimate",
    name: "祖靈之怒・萬魂獵殺",
    type: "external",
    weaponReq: "暗器",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.20,
    uniqueVfx: "ancestor",
    reqRank: "長老",
    costLearn: 390,
    reqStats: { speed: 75, arm: 40 },
    statBonus: { speed: 30 },
    jinyongDesc: "祭祀祖靈之漫天骨刺與毒雨，覆蓋整個戰場，神鬼辟易！"
  },

  // 絕品 / 上品門派武學
  { id: "kf_sanxian", name: "奪命連環三仙劍", type: "external", weaponReq: "劍", rarity: "絕品", tier: 1, progress: 0, baseMult: 2.65, uniqueVfx: "sanxian", reqRank: "長老", costLearn: 320, reqStats: { speed: 65, arm: 40 }, statBonus: { speed: 16, arm: 8 }, jinyongDesc: "一劍化三仙，狠辣絕倫，白青劍氣瞬殺敵方要害！" },
  { id: "kf_jindao_eight", name: "金刀八式・斬乾坤", type: "external", weaponReq: "刀", rarity: "絕品", tier: 1, progress: 0, baseMult: 2.60, reqRank: "長老", costLearn: 320, reqStats: { arm: 60, speed: 45 }, statBonus: { arm: 20 }, jinyongDesc: "黃金厚刃高高躍起，凌空力劈山嶽，天地變色！" },
  { id: "kf_wingchun_blade", name: "八斬刀法・奪魂", type: "external", weaponReq: "刀", rarity: "絕品", tier: 1, progress: 0, baseMult: 2.75, uniqueVfx: "bazhan", reqRank: "長老", costLearn: 340, reqStats: { speed: 65, arm: 40 }, statBonus: { arm: 16, speed: 10 }, jinyongDesc: "雙手持雙短刀，貼身連環八斬，刀光如雪，刀刀奪命！" },
  { id: "kf_nansha_blade", name: "劈波斬浪大斷刀", type: "external", weaponReq: "刀", rarity: "絕品", tier: 1, progress: 0, baseMult: 2.65, uniqueVfx: "nansha", reqRank: "長老", costLearn: 320, reqStats: { arm: 65, speed: 45 }, statBonus: { arm: 18, bone: 6 }, jinyongDesc: "橫江怒刀猛劈斬下，大江兩分，威猛霸道無倫！" },
  { id: "kf_fengmo", name: "瘋魔杖法", type: "external", weaponReq: "棍", rarity: "上品", tier: 1, progress: 0, baseMult: 2.15, reqRank: "真傳弟子", costLearn: 180, reqStats: { arm: 45, bone: 35 }, statBonus: { bone: 10, arm: 6 }, jinyongDesc: "出招癲狂如瘋如魔，棍影如山，令人防不勝防！" },
  { id: "kf_kuangfeng", name: "狂風快劍", type: "external", weaponReq: "劍", rarity: "良品", tier: 1, progress: 0, baseMult: 1.75, reqRank: "內門弟子", costLearn: 90, reqStats: { speed: 45, arm: 20 }, statBonus: { speed: 8, arm: 3 }, jinyongDesc: "一劍快似一劍，劍刃狂掠連綿不絕，猶如暴風驟雨！" }
];

window.GLOBAL_SKILLS = GLOBAL_SKILLS;
window.RARITY_SPEED_FACTOR = RARITY_SPEED_FACTOR;
window.RARITY_BASE_EXP = RARITY_BASE_EXP;
window.getKungfuEval = getKungfuEval;
window.getUpgradeExpCost = getUpgradeExpCost;
window.getSkillWeaponReq = getSkillWeaponReq;
window.isSkillCompatibleWithWeapon = isSkillCompatibleWithWeapon;