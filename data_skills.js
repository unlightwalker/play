/**
 * ========================================================
 * 你的江湖 - 全域武學資料庫 (data_skills.js) [嚴格 80% 內力平衡 & 六維重構版]
 * 規範：
 * 外功耗藍基準：凡品10 / 良品25 / 上品50 / 絕品100 / 神品150
 * 內功每回回調：凡品8  / 良品20 / 上品40 / 絕品80  / 神品120 (嚴格 80%)
 * ========================================================
 */

// 兵刃普攻招式資料庫（全兵刃防呆相容）
const WEAPON_ATTACK_VARIANTS = {
  "拳": [
    { act: "直衝", name: "黑虎掏心", desc: "沉肩墜肘，一記沉猛衝拳直轟中門！" },
    { act: "穿掌", name: "白蛇吐信", desc: "掌風凌厲，直切敵方喉頭要害！" },
    { act: "下劈", name: "開山劈石", desc: "兩掌運足外勁，凌空自上而下猛砸！" },
    { act: "勾拳", name: "雙龍出海", desc: "雙拳破風呼嘯，左右交夾而至！" }
  ],
  "劍": [
    { act: "疾刺", name: "白虹貫日", desc: "長劍一振嗡嗡作響，化為一線白虹疾射！" },
    { act: "橫削", name: "清風拂柳", desc: "劍刃平抹，如微風過葉輕靈無痕！" },
    { act: "挑腕", name: "天外飛仙", desc: "手腕靈動翻飛，劍尖由下而上反撩敵肘！" },
    { act: "轉刺", name: "蒼松迎客", desc: "身法轉折，反手自肋下刺出致命一劍！" }
  ],
  "刀": [
    { act: "力劈", name: "力劈華山", desc: "雙手握刀怒斬而下，帶起剛猛刺耳呼嘯！" },
    { act: "橫掃", name: "橫掃千軍", desc: "厚背重刀攔腰怒斬，勢不可當！" },
    { act: "翻撩", name: "夜叉探海", desc: "刀身倒轉，寒芒自下盤疾撩而起！" },
    { act: "回旋", name: "狂風卷雲", desc: "踏步轉身，順勢甩出一記圓月刀光！" }
  ],
  "棍": [
    { act: "重砸", name: "泰山壓頂", desc: "熟銅長棍攜萬鈞之勢，凌空砸碎青石！" },
    { act: "直搗", name: "靈蛇出洞", desc: "長棍如槍疾搗胸口，迅疾如雷！" },
    { act: "橫掄", name: "橫掃乾坤", desc: "雙臂借力橫掄一圈，迫得強敵連連後退！" },
    { act: "挑打", name: "撥雲見日", desc: "棍梢向上斜挑，直取對手握兵之腕！" }
  ],
  "暗器": [
    { act: "甩手", name: "滿天星斗", desc: "腕力暗吐，銀星呼嘯破空直取敵方雙目！" },
    { act: "彈指", name: "流星追月", desc: "屈指輕彈，破空銳嘯直穿氣門！" },
    { act: "回旋", name: "回風舞柳", desc: "暗器劃出刁鑽弧線，自視覺死角回旋射至！" },
    { act: "連發", name: "七星連珠", desc: "雙手連環飛甩，數枚破甲寒芒接踵而至！" }
  ]
};
window.WEAPON_ATTACK_VARIANTS = WEAPON_ATTACK_VARIANTS;

const RARITY_SPEED_FACTOR = {
  "凡品": 1.25,
  "良品": 1.10,
  "上品": 0.95,
  "絕品": 0.80,
  "神品": 0.65
};

const RARITY_BASE_EXP = {
  "凡品": 75,
  "良品": 360,
  "上品": 1950,
  "絕品": 7800,
  "神品": 26000
};

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

function getUpgradeExpCost(rarity, tier) {
  const base = RARITY_BASE_EXP[rarity] || 75;
  return Math.floor(base * (1 + (tier - 1) * 0.45));
}

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

function isSkillCompatibleWithWeapon(skill, weapon) {
  if (!skill) return false;
  const req = getSkillWeaponReq(skill);
  if (req === "任意") return true;

  const wType = (typeof getWeaponType === "function") ? getWeaponType(weapon) : "拳";

  if (typeof player !== 'undefined' && Array.isArray(player.talents)) {
    if (player.talents.some(t => t.id === "t_132" || t.name === "兵器大師")) return true;
  }

  if (req === "暗器" && typeof player !== 'undefined' && Array.isArray(player.talents)) {
    const hasSancai = player.talents.some(t => t.id === "t_sancai" || t.name.includes("散財童子"));
    if (hasSancai) return (player.gold || 0) >= 2;
  }

  return req === wType;
}

// ==================== 全域武學資料表 (全六維配置 + 內功 80% 專屬平衡) ====================
const GLOBAL_SKILLS = [
  // ---------- 1. 凡品入門 (外功耗藍 10 / 內功回調 8) ----------
  {
    id: "kf_taizu",
    name: "太祖長拳",
    type: "external",
    weaponReq: "拳",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseMult: 1.35,
    costMp: 10,
    reqStats: { arm: 15, bone: 15 },
    statBonus: { arm: 3, bone: 3 },
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
    baseMult: 1.38,
    costMp: 10,
    reqStats: { speed: 20 },
    statBonus: { speed: 3, arm: 2 },
    jinyongDesc: "長劍一抖，化為寒星疾刺，身隨劍走！"
  },
  {
    id: "kf_nan_riyue",
    name: "日字連環衝拳",
    type: "external",
    weaponReq: "拳",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseMult: 1.40,
    costMp: 10,
    reqRank: "外門弟子",
    costLearn: 40,
    reqStats: { speed: 20, arm: 15 },
    statBonus: { arm: 3, speed: 3 },
    jinyongDesc: "短橋窄馬，連環直衝拳如狂風暴雨傾瀉胸口！"
  },
  {
    id: "kf_bei_tan",
    name: "十二路譚腿",
    type: "external",
    weaponReq: "拳",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseMult: 1.42,
    costMp: 10,
    reqRank: "外門弟子",
    costLearn: 40,
    reqStats: { speed: 25, arm: 15 },
    statBonus: { speed: 4, arm: 2 },
    jinyongDesc: "手是兩扇門，全憑腿打人！招招直奔下盤！"
  },
  {
    id: "kf_japan_iai_init",
    name: "居合疾影拔刀斬",
    type: "external",
    weaponReq: "刀",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseMult: 1.42,
    costMp: 10,
    reqRank: "外門弟子",
    costLearn: 40,
    reqStats: { speed: 25, arm: 15 },
    statBonus: { speed: 3, arm: 3 },
    jinyongDesc: "拇指推鞘，電光火石間拔刀出鞘凌空橫斬！"
  },
  {
    id: "kf_zuling_dart_init",
    name: "百步獵魂吹箭術",
    type: "external",
    weaponReq: "暗器",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseMult: 1.40,
    costMp: 10,
    reqRank: "外門弟子",
    costLearn: 40,
    reqStats: { speed: 20 },
    statBonus: { speed: 3, luck: 3 },
    jinyongDesc: "以竹管疾吐毒刺，取敵要穴，疾速難防！"
  },
  {
    id: "kf_tuna",
    name: "吐納坐忘訣",
    type: "internal",
    weaponReq: "任意",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseHpBonus: 60,
    baseDefBonus: 5,
    turnMpRegen: 8, // 10 * 80% = 8
    specialEffect: {
      type: "meditate_boost",
      bonusMeditateMp: 15,
      desc: "平心順氣：每回合自動回復 8 點內力；戰鬥中施展【運氣】額外多回復 15 點內力。"
    },
    reqStats: { inner: 10 },
    statBonus: { inner: 4, bone: 2 },
    effectDesc: "調勻內息，每回合回調內力，並增幅氣血上限與護體罡氣。"
  },
  {
    id: "kf_caoshangfei",
    name: "草上飛",
    type: "qinggong",
    weaponReq: "任意",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseSpeedBonus: 14,
    reqStats: { speed: 25 },
    statBonus: { speed: 4, luck: 2 },
    effectDesc: "提氣躍步，步履如飛，顯著提升出手身法。"
  },

  // ---------- 2. 良品名家 (外功耗藍 25 / 內功回調 20) ----------
  {
    id: "kf_bagua_dao",
    name: "八卦六合刀",
    type: "external",
    weaponReq: "刀",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseMult: 1.75,
    costMp: 25,
    reqStats: { arm: 30, speed: 25 },
    statBonus: { arm: 8, bone: 4 },
    costLearn: 50,
    costGold: 20,
    jinyongDesc: "八卦步法游走，反手一刀『金蛇纏柳』直斬肋下！"
  },
  {
    id: "kf_huayu",
    name: "漫天花雨手法",
    type: "external",
    weaponReq: "暗器",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseMult: 1.80,
    costMp: 25,
    reqStats: { speed: 35 },
    statBonus: { speed: 8, arm: 4 },
    costLearn: 60,
    costGold: 25,
    jinyongDesc: "揮袖之間飛花化針，數枚暗器如漫天細雨飄落！"
  },
  {
    id: "kf_kuangfeng",
    name: "狂風快劍",
    type: "external",
    weaponReq: "劍",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseMult: 1.82,
    costMp: 25,
    reqRank: "外門弟子",
    costLearn: 90,
    reqStats: { speed: 45, arm: 20 },
    statBonus: { speed: 9, arm: 4 },
    jinyongDesc: "一劍快似一劍，猶如暴風驟雨，密不透風！"
  },
  {
    id: "kf_nan_huhe",
    name: "虎鶴雙形掌",
    type: "external",
    weaponReq: "拳",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseMult: 1.78,
    costMp: 25,
    reqRank: "內門弟子",
    costLearn: 90,
    reqStats: { arm: 35, bone: 30 },
    statBonus: { arm: 8, bone: 5 },
    jinyongDesc: "剛柔並濟，虎爪剛烈開碑，鶴手飄忽點穴！"
  },
  {
    id: "kf_bei_sweep",
    name: "鐵掃帚狂風腿",
    type: "external",
    weaponReq: "拳",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseMult: 1.76,
    costMp: 25,
    reqRank: "內門弟子",
    costLearn: 90,
    reqStats: { speed: 42, bone: 25 },
    statBonus: { speed: 8, bone: 5 },
    jinyongDesc: "身形旋轉貼地飛掃，宛如狂飆捲地！"
  },
  {
    id: "kf_tiebushan",
    name: "金剛鐵布衫",
    type: "internal",
    weaponReq: "任意",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseHpBonus: 110,
    baseDefBonus: 14,
    turnMpRegen: 20, // 25 * 80% = 20
    specialEffect: {
      type: "shield_body",
      shieldPct: 0.08,
      defBoostPct: 0.15,
      desc: "金剛硬功：每回合回調 20 點內力；入陣及每回合凝結自身最大氣血 8% 的【金剛護體盾】，常駐防禦 +15%。"
    },
    reqStats: { bone: 30 },
    statBonus: { bone: 8, inner: 5 },
    costLearn: 60,
    costGold: 25,
    effectDesc: "常駐硬氣功護體，氣血防禦雙向提升，凝氣成盾。"
  },
  {
    id: "kf_zhengqi_xinfa",
    name: "華山正氣心決",
    type: "internal",
    weaponReq: "任意",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseHpBonus: 105,
    baseDefBonus: 12,
    turnMpRegen: 20, // 25 * 80% = 20
    specialEffect: {
      type: "parry_mp",
      onParryMpGain: 10,
      desc: "正氣浩然：每回合回調 20 點內力；達成招架格擋時額外蓄積 10 點內力。"
    },
    reqStats: { inner: 28, bone: 25 },
    statBonus: { inner: 7, bone: 5 },
    costLearn: 60,
    effectDesc: "華山氣宗正道心訣，氣貫長虹，招架時凝氣化真。"
  },
  {
    id: "kf_feiyan",
    name: "飛簷走壁",
    type: "qinggong",
    weaponReq: "任意",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseSpeedBonus: 24,
    reqStats: { speed: 35 },
    statBonus: { speed: 9, luck: 3 },
    costLearn: 60,
    costGold: 25,
    effectDesc: "提身涉險，如靈燕穿柳，大幅提升出手身法。"
  },
  {
    id: "kf_yanfei",
    name: "新陰流・燕飛步",
    type: "qinggong",
    weaponReq: "任意",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseSpeedBonus: 25,
    reqStats: { speed: 45 },
    reqRank: "內門弟子",
    costLearn: 90,
    statBonus: { speed: 10, arm: 3 },
    desc: "身如低掠之靈燕，步法縮地無聲，瞬息逼近敵背。"
  },
  {
    id: "kf_qingteng",
    name: "青藤盤根步",
    type: "qinggong",
    weaponReq: "任意",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseSpeedBonus: 24,
    reqStats: { speed: 38 },
    reqRank: "內門弟子",
    costLearn: 90,
    statBonus: { speed: 8, bone: 4 },
    desc: "身如林中青藤攀附縱躍，高山履險如平地。"
  },

  // ---------- 3. 上品精深 (外功耗藍 50 / 內功回調 40) ----------
  {
    id: "kf_shaolin_palm",
    name: "大力金剛掌",
    type: "external",
    weaponReq: "拳",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseMult: 2.25,
    costMp: 50,
    reqStats: { arm: 45, bone: 40 },
    statBonus: { arm: 14, bone: 10 },
    costLearn: 180,
    jinyongDesc: "掌風剛烈雄勁，勢若降龍伏虎，一掌出風雷動！"
  },
  {
    id: "kf_taiji_fist",
    name: "武當太極長拳",
    type: "external",
    weaponReq: "拳",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseMult: 2.20,
    costMp: 50,
    reqStats: { inner: 40, bone: 35 },
    statBonus: { inner: 14, bone: 10 },
    costLearn: 180,
    jinyongDesc: "以柔克剛，借敵千斤之力反震其體！"
  },
  {
    id: "kf_fengmo",
    name: "瘋魔杖法",
    type: "external",
    weaponReq: "棍",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseMult: 2.30,
    costMp: 50,
    reqRank: "真傳弟子",
    costLearn: 180,
    reqStats: { arm: 45, bone: 35 },
    statBonus: { bone: 13, arm: 11 },
    jinyongDesc: "出招如瘋如魔，棍影如山，打得山崩石裂！"
  },
  {
    id: "kf_nan_tiexian",
    name: "鐵線金剛拳綱",
    type: "internal",
    weaponReq: "任意",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseHpBonus: 175,
    baseDefBonus: 22,
    turnMpRegen: 40, // 50 * 80% = 40
    specialEffect: {
      type: "armor_pierce_leech",
      armorPiercePct: 0.18,
      skillHealHp: 25,
      desc: "鐵線剛勁：每回合回調 40 點內力；外功攻擊無視敵方 18% 防禦，每次施展外功氣脈反哺回覆 25 點氣血。"
    },
    reqRank: "真傳弟子",
    costLearn: 180,
    reqStats: { inner: 40, arm: 35 },
    statBonus: { inner: 13, arm: 8, bone: 4 },
    effectDesc: "兩臂如鑄鐵金剛，極大增幅筋骨氣力，出招自帶破甲與反哺。"
  },
  {
    id: "kf_canyue_xinfa",
    name: "殘月斬鐵心經",
    type: "internal",
    weaponReq: "任意",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseHpBonus: 165,
    baseDefBonus: 18,
    turnMpRegen: 40, // 50 * 80% = 40
    specialEffect: {
      type: "speed_crit",
      atbBoostPct: 0.15,
      critRateAdd: 10,
      desc: "心凝如鏡：每回合回調 40 點內力；戰鬥蓄力速度提升 15%，常駐暴擊率額外 +10%。"
    },
    reqStats: { inner: 40, arm: 35 },
    reqRank: "真傳弟子",
    costLearn: 180,
    statBonus: { inner: 12, speed: 8, arm: 5 },
    desc: "蓄勢於氣海，大幅增益外攻殺伐與出招極速。"
  },
  {
    id: "kf_zuling_xinfa",
    name: "神木自然長生心法",
    type: "internal",
    weaponReq: "任意",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseHpBonus: 185,
    baseDefBonus: 20,
    turnMpRegen: 40, // 50 * 80% = 40
    specialEffect: {
      type: "nature_regen",
      turnHpRegenPct: 0.04,
      lowHpDouble: true,
      desc: "生生不息：每回合回調 40 點內力；每回合周天吐納自動回覆 4% 氣血（氣血低於 40% 時回血翻倍為 8%）。"
    },
    reqStats: { inner: 42, bone: 35 },
    reqRank: "真傳弟子",
    costLearn: 180,
    statBonus: { inner: 14, bone: 8, luck: 3 },
    desc: "感悟萬年神木呼吸吐納，生機勃發，持續自愈傷勢。"
  },
  {
    id: "kf_wandu_xinfa",
    name: "萬毒枯榮心經",
    type: "internal",
    weaponReq: "任意",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseHpBonus: 170,
    baseDefBonus: 18,
    turnMpRegen: 40, // 50 * 80% = 40
    specialEffect: {
      type: "poison_aura",
      poisonTurnDmg: 25,
      poisonTurnMpDmg: 8,
      desc: "萬毒枯榮：每回合回調 40 點內力；周身散發枯榮毒息，對手每回合自動損失 25 點氣血與 8 點內力。"
    },
    reqStats: { inner: 40, bone: 30 },
    reqRank: "真傳弟子",
    costLearn: 180,
    statBonus: { inner: 13, speed: 7, int: 5 },
    desc: "唐門至高心訣，以毒煉氣，枯榮轉換，蝕敵氣脈。"
  },
  {
    id: "kf_bei_step",
    name: "登萍度水身法",
    type: "qinggong",
    weaponReq: "任意",
    rarity: "上品",
    tier: 1,
    progress: 0,
    baseSpeedBonus: 36,
    reqRank: "真傳弟子",
    costLearn: 180,
    reqStats: { speed: 50 },
    statBonus: { speed: 17, luck: 6 },
    effectDesc: "足尖在水浪上踏雪奔行，身形縹緲神駿。"
  },

  // ---------- 4. 絕品絕學 (外功耗藍 100 / 內功回調 80) ----------
  {
    id: "kf_sanxian",
    name: "奪命連環三仙劍",
    type: "external",
    weaponReq: "劍",
    rarity: "絕品",
    tier: 1,
    progress: 0,
    baseMult: 2.85,
    costMp: 100,
    uniqueVfx: "sanxian",
    reqRank: "長老",
    costLearn: 320,
    reqStats: { speed: 65, arm: 40 },
    statBonus: { speed: 20, arm: 12, luck: 5 },
    jinyongDesc: "一劍化三仙，狠辣絕倫，瞬殺敵方週身三大要穴！"
  },
  {
    id: "kf_jindao_eight",
    name: "金刀八式・斬乾坤",
    type: "external",
    weaponReq: "刀",
    rarity: "絕品",
    tier: 1,
    progress: 0,
    baseMult: 2.80,
    costMp: 100,
    reqRank: "長老",
    costLearn: 320,
    reqStats: { arm: 60, speed: 45 },
    statBonus: { arm: 22, bone: 10, speed: 4 },
    jinyongDesc: "黃金厚刃怒斬而下，力劈華嶽，地動山搖！"
  },
  {
    id: "kf_nan_shadowless",
    name: "佛山無影拳",
    type: "external",
    weaponReq: "拳",
    rarity: "絕品",
    tier: 1,
    progress: 0,
    baseMult: 2.88,
    costMp: 100,
    uniqueVfx: "nan_fist",
    reqRank: "長老",
    costLearn: 340,
    reqStats: { arm: 60, speed: 55 },
    statBonus: { arm: 19, speed: 14, bone: 5 },
    jinyongDesc: "聲東擊西，影過留痕，一息百拳震裂山石！"
  },
  {
    id: "kf_bei_whirlwind",
    name: "北派幽冥旋風腿",
    type: "external",
    weaponReq: "拳",
    rarity: "絕品",
    tier: 1,
    progress: 0,
    baseMult: 2.82,
    costMp: 100,
    uniqueVfx: "bei_kick",
    reqRank: "長老",
    costLearn: 330,
    reqStats: { speed: 65, arm: 45 },
    statBonus: { speed: 20, arm: 12, bone: 5 },
    jinyongDesc: "縱身凌空七連環踢，腿影遮天蔽日，幽冥煞氣逼人！"
  },
  {
    id: "kf_wingchun_blade",
    name: "八斬刀法・奪魂",
    type: "external",
    weaponReq: "刀",
    rarity: "絕品",
    tier: 1,
    progress: 0,
    baseMult: 2.90,
    costMp: 100,
    uniqueVfx: "bazhan",
    reqRank: "長老",
    costLearn: 340,
    reqStats: { speed: 65, arm: 40 },
    statBonus: { speed: 18, arm: 14, luck: 5 },
    jinyongDesc: "貼身連環八斬，刀光如雪，奪命連擊，防不勝防！"
  },
  {
    id: "kf_nansha_blade",
    name: "劈波斬浪大斷刀",
    type: "external",
    weaponReq: "刀",
    rarity: "絕品",
    tier: 1,
    progress: 0,
    baseMult: 2.85,
    costMp: 100,
    uniqueVfx: "nansha",
    reqRank: "長老",
    costLearn: 320,
    reqStats: { arm: 65, speed: 45 },
    statBonus: { arm: 20, bone: 12, speed: 5 },
    jinyongDesc: "橫江怒刀猛劈，大江兩分，威猛霸道無倫！"
  },
  {
    id: "kf_chunyuan_taiji",
    name: "純陽太極功",
    type: "internal",
    weaponReq: "任意",
    rarity: "絕品",
    tier: 1,
    progress: 0,
    baseHpBonus: 280,
    baseDefBonus: 34,
    turnMpRegen: 80, // 100 * 80% = 80
    specialEffect: {
      type: "absorb_parry",
      parryRateAdd: 25,
      damageToMpPct: 0.30,
      desc: "純陽化勁：每回合回調 80 點內力；常駐招架格擋率 +25%，受創時將所受傷害的 30% 化為自身內力回充。"
    },
    reqStats: { inner: 60, bone: 50 },
    statBonus: { inner: 20, bone: 12, int: 6 },
    effectDesc: "武當至高道家心法，以柔克剛，卸敵萬鈞之力為己用。"
  },

  // ---------- 5. 神品鎮派 (外功耗藍 150 / 內功回調 120) ----------
  {
    id: "kf_dragon_palm",
    name: "降龍十八掌・亢龍有悔",
    type: "external",
    weaponReq: "拳",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.45,
    costMp: 150,
    uniqueVfx: "dragon",
    reqRank: "長老",
    costLearn: 380,
    reqStats: { arm: 65, bone: 60, inner: 50 },
    statBonus: { arm: 28, bone: 18, inner: 10 },
    jinyongDesc: "金龍神罡破空而出，聲震百里，排山倒海傾瀉敵體！"
  },
  {
    id: "kf_ittoryu_ultimate",
    name: "秘劍・一之太刀",
    type: "external",
    weaponReq: "刀",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.55,
    costMp: 150,
    uniqueVfx: "ittoryu",
    reqRank: "長老",
    costLearn: 380,
    reqStats: { arm: 65, speed: 70 },
    statBonus: { arm: 30, speed: 20, luck: 8 },
    jinyongDesc: "心技體合一之居合奧義，雷光一閃之間敵軀兩斷！"
  },
  {
    id: "kf_storm_needles",
    name: "暴雨梨花針",
    type: "external",
    weaponReq: "暗器",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.40,
    costMp: 150,
    uniqueVfx: "storm",
    reqRank: "長老",
    costLearn: 380,
    reqStats: { speed: 65, arm: 35 },
    statBonus: { speed: 32, arm: 14, luck: 8 },
    jinyongDesc: "二十七枚淬毒銀針齊發，漫天花雨，神鬼難逃！"
  },
  {
    id: "kf_tanzhi",
    name: "彈指神通",
    type: "external",
    weaponReq: "暗器",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.45,
    costMp: 150,
    uniqueVfx: "tanzhi",
    reqStats: { speed: 50, inner: 40 },
    statBonus: { speed: 28, inner: 16, arm: 10 },
    jinyongDesc: "指尖微曲隨即一彈，一道森森氣勁如離弦之箭激射而出！"
  },
  {
    id: "kf_yiyang",
    name: "先天功一陽指意",
    type: "external",
    weaponReq: "拳",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.35,
    costMp: 150,
    uniqueVfx: "yiyang",
    reqRank: "長老",
    costLearn: 360,
    reqStats: { inner: 60, bone: 50 },
    statBonus: { inner: 26, arm: 16, bone: 12 },
    jinyongDesc: "純陽神指破體而出，九天純陽金光貫頂！"
  },
  {
    id: "kf_ancestor_ultimate",
    name: "祖靈之怒・萬魂獵殺",
    type: "external",
    weaponReq: "暗器",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.45,
    costMp: 150,
    uniqueVfx: "ancestor",
    reqRank: "長老",
    costLearn: 390,
    reqStats: { speed: 75, arm: 40 },
    statBonus: { speed: 32, inner: 14, arm: 10 },
    jinyongDesc: "祭祀祖靈之漫天骨刺與毒雨，覆蓋整個戰場，神鬼辟易！"
  },
  {
    id: "kf_jiuyang_shengong",
    name: "九陽真經神功",
    type: "internal",
    weaponReq: "任意",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseHpBonus: 450,
    baseDefBonus: 50,
    turnMpRegen: 120, // 150 * 80% = 120
    specialEffect: {
      type: "divine_jiuyang",
      shieldPct: 0.12,
      turnHpRegenPct: 0.05,
      freeMpChance: 0.25,
      desc: "生生不息：每回合回調 120 點內力；凝結最大氣血 12% 的【九陽純陽盾】、自動回覆 5% 氣血，且施展武學時有 25% 機率完全不消耗內力！"
    },
    reqStats: { inner: 70, bone: 60 },
    statBonus: { inner: 28, bone: 18, arm: 10 },
    effectDesc: "至剛至陽無上神功，內力自生速度登峰造極，百病不生，諸毒莫侵。"
  }
];

window.GLOBAL_SKILLS = GLOBAL_SKILLS;
window.RARITY_SPEED_FACTOR = RARITY_SPEED_FACTOR;
window.RARITY_BASE_EXP = RARITY_BASE_EXP;
window.getKungfuEval = getKungfuEval;
window.getUpgradeExpCost = getUpgradeExpCost;
window.getSkillWeaponReq = getSkillWeaponReq;
window.isSkillCompatibleWithWeapon = isSkillCompatibleWithWeapon;