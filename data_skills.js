/**
 * ========================================================
 * 你的江湖 - 全域武學資料庫 (data_skills.js)
 * 由《萬象天機後台》自動生成於: 2026/11/8 上午2:06:19
 * ========================================================
 */
var WEAPON_ATTACK_VARIANTS = window.WEAPON_ATTACK_VARIANTS || {
  "拳": [{ act: "直衝", name: "黑虎掏心", desc: "沉肩墜肘直衝中門！" }],
  "劍": [{ act: "疾刺", name: "白虹貫日", desc: "長劍化為一線白虹疾射！" }],
  "刀": [{ act: "力劈", name: "力劈華山", desc: "雙手握刀怒斬而下！" }],
  "棍": [{ act: "重砸", name: "泰山壓頂", desc: "熟銅長棍攜萬鈞之勢砸下！" }],
  "暗器": [{ act: "甩手", name: "滿天星斗", desc: "銀星呼嘯破空直取雙目！" }]
};
window.WEAPON_ATTACK_VARIANTS = WEAPON_ATTACK_VARIANTS;

function getKungfuEval(tier, progress) {
  if (tier >= 10 && progress >= 100) return "大圓滿";
  if (tier <= 2) return "初學者";
  if (tier <= 4) return "駕輕就熟";
  if (tier <= 6) return "融會貫通";
  if (tier <= 8) return "出神入化";
  return "返璞歸真";
}

function getUpgradeExpCost(rarity, tier) {
  const base = { "凡品": 75, "良品": 360, "上品": 1950, "絕品": 7800, "神品": 26000 }[rarity] || 75;
  return Math.floor(base * (1 + (tier - 1) * 0.45));
}

function getSkillWeaponReq(skill) {
  return (skill && skill.weaponReq) ? skill.weaponReq : "任意";
}

function isSkillCompatibleWithWeapon(skill, weapon) {
  if (!skill) return false;
  const req = getSkillWeaponReq(skill);
  if (req === "任意") return true;
  const wType = (typeof getWeaponType === "function") ? getWeaponType(weapon) : "拳";
  return req === wType;
}

const GLOBAL_SKILLS = [
  {
    "id": "kf_1794073071807",
    "name": "草原刀法",
    "type": "external",
    "weaponReq": "刀",
    "rarity": "凡品",
    "source": "【牛家村】鄉野演武大武館",
    "statBonus": {
      "arm": 3,
      "speed": 0,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "tier10Bonus": {
      "arm": 6,
      "speed": 0,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫"
    },
    "ifRules": [],
    "specialDesc": "",
    "reqStats": {},
    "costLearn": 400
  },
  {
    "id": "kf_taizu",
    "starter": true,
    "name": "太祖長拳",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "凡品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.35,
    "costMp": 10,
    "reqStats": {
      "arm": 15,
      "bone": 15
    },
    "statBonus": {
      "arm": 3,
      "bone": 3
    },
    "jinyongDesc": "少俠沉肩墜肘，一式『雙龍出海』，拳法平正剛肅！",
    "tier10Bonus": {
      "arm": 3,
      "bone": 3
    },
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫"
    },
    "source": "【牛家村】鄉野演武大武館",
    "ifRules": [],
    "costLearn": 400
  },
  {
    "id": "kf_wood_sword",
    "starter": true,
    "name": "基本劍法",
    "type": "external",
    "weaponReq": "劍",
    "rarity": "凡品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.38,
    "costMp": 10,
    "reqStats": {
      "speed": 20
    },
    "statBonus": {
      "speed": 3,
      "arm": 2
    },
    "jinyongDesc": "長劍一抖，化為寒星疾刺，身隨劍走！",
    "tier10Bonus": {
      "speed": 3,
      "arm": 2
    },
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫"
    },
    "source": "【牛家村】鄉野演武大武館",
    "ifRules": [],
    "costLearn": 400
  },
  {
    "id": "kf_mw8pw2fl8",
    "name": "鐵尺十三式",
    "type": "external",
    "weaponReq": "劍",
    "rarity": "凡品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.38,
    "costMp": 10,
    "reqStats": {
      "speed": 20
    },
    "statBonus": {
      "speed": 3,
      "arm": 2
    },
    "jinyongDesc": "長劍一抖，化為寒星疾刺，身隨劍走！",
    "tier10Bonus": {
      "speed": 3,
      "arm": 2
    },
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫"
    },
    "source": "【鑄劍山莊・劍意留痕壁】鑄劍山莊傳功大殿",
    "ifRules": [],
    "costLearn": 400,
    "effectDesc": "鑄劍山莊入門基礎劍法，劍招如鐵尺量地般嚴整不苟，十三式連環遞進，招式簡練而實用。"
  },
  {
    "id": "kf_nan_riyue",
    "name": "日字連環衝拳",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "凡品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.4,
    "costMp": 10,
    "reqRank": "外門弟子",
    "costLearn": 400,
    "reqStats": {
      "speed": 20,
      "arm": 15
    },
    "statBonus": {
      "arm": 3,
      "speed": 3
    },
    "jinyongDesc": "短橋窄馬，連環直衝拳如狂風暴雨傾瀉胸口！",
    "tier10Bonus": {
      "arm": 3,
      "speed": 3
    },
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫"
    },
    "source": "【牛家村】鄉野演武大武館",
    "ifRules": []
  },
  {
    "id": "kf_mw8pt0vy63",
    "name": "八荒撼鐵拳",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "凡品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.4,
    "costMp": 10,
    "reqRank": "外門弟子",
    "costLearn": 400,
    "reqStats": {
      "speed": 20,
      "arm": 15
    },
    "statBonus": {
      "arm": 3,
      "speed": 3
    },
    "jinyongDesc": "短橋窄馬，連環直衝拳如狂風暴雨傾瀉胸口！",
    "tier10Bonus": {
      "arm": 3,
      "speed": 3
    },
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫"
    },
    "source": "【鑄劍山莊・劍意留痕壁】鑄劍山莊傳功大殿",
    "ifRules": [],
    "effectDesc": "鑄劍山莊入門外功拳法，模仿鐵匠揮錘鍛打之理，拳風剛猛沉重，專破外家護體。"
  },
  {
    "id": "kf_bei_tan",
    "name": "十二路譚腿",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "凡品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.42,
    "costMp": 10,
    "reqRank": "外門弟子",
    "costLearn": 400,
    "reqStats": {
      "speed": 25,
      "arm": 15
    },
    "statBonus": {
      "speed": 4,
      "arm": 2
    },
    "jinyongDesc": "手是兩扇門，全憑腿打人！招招直奔下盤！",
    "tier10Bonus": {
      "speed": 4,
      "arm": 2
    },
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫"
    },
    "source": "【牛家村】鄉野演武大武館",
    "ifRules": []
  },
  {
    "id": "kf_japan_iai_init",
    "name": "居合疾影拔刀斬",
    "type": "external",
    "weaponReq": "刀",
    "rarity": "凡品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.42,
    "costMp": 10,
    "reqRank": "外門弟子",
    "costLearn": 400,
    "reqStats": {
      "speed": 25,
      "arm": 15
    },
    "statBonus": {
      "speed": 3,
      "arm": 3
    },
    "jinyongDesc": "拇指推鞘，電光火石間拔刀出鞘凌空橫斬！",
    "tier10Bonus": {
      "arm": 9,
      "speed": 9,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": [],
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫",
      "postTarget": "target"
    }
  },
  {
    "id": "kf_zuling_dart_init",
    "name": "百步獵魂吹箭術",
    "type": "external",
    "weaponReq": "暗器",
    "rarity": "凡品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.4,
    "costMp": 10,
    "reqRank": "外門弟子",
    "costLearn": 400,
    "reqStats": {
      "speed": 20
    },
    "statBonus": {
      "speed": 3,
      "luck": 3
    },
    "jinyongDesc": "以竹管疾吐毒刺，取敵要穴，疾速難防！",
    "tier10Bonus": {
      "arm": 0,
      "speed": 9,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 9
    },
    "ifRules": [],
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫",
      "postTarget": "target"
    }
  },
  {
    "id": "kf_tuna",
    "starter": true,
    "name": "吐納坐忘訣",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "凡品",
    "tier": 1,
    "progress": 0,
    "baseHpBonus": 60,
    "baseDefBonus": 5,
    "turnMpRegen": 8,
    "specialEffect": {
      "type": "meditate_boost",
      "bonusMeditateMp": 15,
      "desc": "平心順氣：每回合自動回復 8 點內力；戰鬥中施展【運氣】額外多回復 15 點內力。"
    },
    "reqStats": {
      "inner": 10
    },
    "statBonus": {
      "inner": 4,
      "bone": 2
    },
    "effectDesc": "調勻內息，每回合回調內力，並增幅氣血上限與護體罡氣。",
    "tier10Bonus": {
      "arm": 0,
      "speed": 0,
      "bone": 6,
      "inner": 12,
      "int": 0,
      "luck": 0
    },
    "ifRules": [],
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫",
      "postTarget": "target"
    },
    "costLearn": 400
  },
  {
    "id": "kf_mw8opyd464",
    "name": "洪爐大冶訣",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "凡品",
    "tier": 2,
    "progress": 0,
    "baseHpBonus": 120,
    "baseDefBonus": 12,
    "turnMpRegen": 15,
    "specialEffect": {
      "type": "meditate_boost",
      "bonusMeditateMp": 30,
      "desc": "洪爐生火：氣血如爐火般生生不息，每回合自動回復 15 點內力；運功調息時額外多回復 30 點內力，並附帶微幅護體罡氣。"
    },
    "reqStats": {
      "inner": 20
    },
    "statBonus": {
      "inner": 2,
      "bone": 2,
      "arm": 2
    },
    "effectDesc": "鑄劍山莊鎮派基礎內功心法，相傳乃祖師觀爐中烈火熔金化鐵之象所創。運功時內息如百鍊鋼般剛柔並濟，調勻氣血，大幅增幅氣血上限、防禦力與內力回復。",
    "tier10Bonus": {
      "arm": 4,
      "speed": 2,
      "bone": 6,
      "inner": 12,
      "int": 5,
      "luck": 0
    },
    "ifRules": [],
    "source": "【鑄劍山莊・劍意留痕壁】鑄劍山莊傳功大殿",
    "costLearn": 400
  },
  {
    "id": "kf_caoshangfei",
    "starter": true,
    "name": "草上飛",
    "type": "qinggong",
    "weaponReq": "任意",
    "rarity": "凡品",
    "tier": 1,
    "progress": 0,
    "baseSpeedBonus": 14,
    "reqStats": {
      "speed": 25
    },
    "statBonus": {
      "speed": 4,
      "luck": 2
    },
    "effectDesc": "提氣躍步，步履如飛，顯著提升出手身法。",
    "tier10Bonus": {
      "arm": 0,
      "speed": 12,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 6
    },
    "ifRules": [],
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫",
      "postTarget": "target"
    },
    "costLearn": 400
  },
  {
    "id": "kf_bagua_dao",
    "name": "八卦六合刀",
    "type": "external",
    "weaponReq": "刀",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.75,
    "costMp": 25,
    "reqStats": {
      "arm": 30,
      "speed": 25
    },
    "statBonus": {
      "arm": 8,
      "bone": 4
    },
    "costLearn": 500,
    "costGold": 20,
    "jinyongDesc": "八卦步法游走，反手一刀『金蛇纏柳』直斬肋下！",
    "tier10Bonus": {
      "arm": 24,
      "speed": 0,
      "bone": 12,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_huayu",
    "name": "漫天花雨手法",
    "type": "external",
    "weaponReq": "暗器",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.8,
    "costMp": 25,
    "reqStats": {
      "speed": 35
    },
    "statBonus": {
      "speed": 8,
      "arm": 4
    },
    "costLearn": 800,
    "costGold": 25,
    "jinyongDesc": "揮袖之間飛花化針，數枚暗器如漫天細雨飄落！",
    "tier10Bonus": {
      "arm": 12,
      "speed": 24,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_kuangfeng",
    "name": "狂風快劍",
    "type": "external",
    "weaponReq": "劍",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.82,
    "costMp": 25,
    "reqRank": "外門弟子",
    "costLearn": 900,
    "reqStats": {
      "speed": 45,
      "arm": 20
    },
    "statBonus": {
      "speed": 9,
      "arm": 4
    },
    "jinyongDesc": "一劍快似一劍，猶如暴風驟雨，密不透風！",
    "tier10Bonus": {
      "arm": 12,
      "speed": 27,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_mw8pww8i93",
    "name": "流光開鋒劍",
    "type": "external",
    "weaponReq": "劍",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.82,
    "costMp": 25,
    "reqRank": "外門弟子",
    "costLearn": 900,
    "reqStats": {
      "speed": 45,
      "arm": 20
    },
    "statBonus": {
      "speed": 9,
      "arm": 4
    },
    "jinyongDesc": "一劍快似一劍，猶如暴風驟雨，密不透風！",
    "tier10Bonus": {
      "arm": 12,
      "speed": 27,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": [],
    "effectDesc": "鑄劍山莊精妙劍法，模擬新劍出爐時淬火開鋒的極致流光，出劍如電、迅捷無倫，劍光流轉間猶如暴風驟雨令敵防不勝防。",
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫"
    },
    "source": "【鑄劍山莊・劍意留痕壁】鑄劍山莊傳功大殿"
  },
  {
    "id": "kf_nan_huhe",
    "name": "虎鶴雙形掌",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.78,
    "costMp": 25,
    "reqRank": "內門弟子",
    "costLearn": 900,
    "reqStats": {
      "arm": 35,
      "bone": 30
    },
    "statBonus": {
      "arm": 8,
      "bone": 5
    },
    "jinyongDesc": "剛柔並濟，虎爪剛烈開碑，鶴手飄忽點穴！",
    "tier10Bonus": {
      "arm": 24,
      "speed": 0,
      "bone": 15,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_mw8puk669",
    "name": "頑鐵藏鋒掌",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.78,
    "costMp": 25,
    "reqRank": "內門弟子",
    "costLearn": 900,
    "reqStats": {
      "arm": 35,
      "bone": 30
    },
    "statBonus": {
      "arm": 8,
      "bone": 5
    },
    "jinyongDesc": "剛柔並濟，虎爪剛烈開碑，鶴手飄忽點穴！",
    "tier10Bonus": {
      "arm": 24,
      "speed": 0,
      "bone": 15,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": [],
    "effectDesc": "鑄劍山莊內門精妙掌法，掌意如未出鞘之神劍，外表看似厚重頑鐵，實則掌力內斂、鋒芒暗藏，爆發時如雷霆萬鈞。",
    "vfxChain": {
      "pre": "無動畫",
      "mid": "無動畫",
      "post": "無動畫"
    },
    "source": "【鑄劍山莊・劍意留痕壁】鑄劍山莊傳功大殿"
  },
  {
    "id": "kf_bei_sweep",
    "name": "鐵掃帚狂風腿",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.76,
    "costMp": 25,
    "reqRank": "內門弟子",
    "costLearn": 900,
    "reqStats": {
      "speed": 42,
      "bone": 25
    },
    "statBonus": {
      "speed": 8,
      "bone": 5
    },
    "jinyongDesc": "身形旋轉貼地飛掃，宛如狂飆捲地！",
    "tier10Bonus": {
      "arm": 0,
      "speed": 24,
      "bone": 15,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_tiebushan",
    "name": "金剛鐵布衫",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseHpBonus": 110,
    "baseDefBonus": 14,
    "turnMpRegen": 20,
    "specialEffect": {
      "type": "shield_body",
      "shieldPct": 0.08,
      "defBoostPct": 0.15,
      "desc": "金剛硬功：每回合回調 20 點內力；入陣及每回合凝結自身最大氣血 8% 的【金剛護體盾】，常駐防禦 +15%。"
    },
    "reqStats": {
      "bone": 30
    },
    "statBonus": {
      "bone": 8,
      "inner": 5
    },
    "costLearn": 600,
    "costGold": 25,
    "effectDesc": "常駐硬氣功護體，氣血防禦雙向提升，凝氣成盾。",
    "tier10Bonus": {
      "arm": 0,
      "speed": 0,
      "bone": 24,
      "inner": 15,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_zhengqi_xinfa",
    "name": "華山正氣心決",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseHpBonus": 105,
    "baseDefBonus": 12,
    "turnMpRegen": 20,
    "specialEffect": {
      "type": "parry_mp",
      "onParryMpGain": 10,
      "desc": "正氣浩然：每回合回調 20 點內力；達成招架格擋時額外蓄積 10 點內力。"
    },
    "reqStats": {
      "inner": 28,
      "bone": 25
    },
    "statBonus": {
      "inner": 7,
      "bone": 5
    },
    "costLearn": 600,
    "effectDesc": "華山氣宗正道心訣，氣貫長虹，招架時凝氣化真。",
    "tier10Bonus": {
      "arm": 0,
      "speed": 0,
      "bone": 15,
      "inner": 21,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_mw8ortvu18",
    "name": "百煉成鋼心經",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "良品",
    "tier": 2,
    "progress": 0,
    "baseHpBonus": 220,
    "baseDefBonus": 25,
    "turnMpRegen": 25,
    "specialEffect": {
      "type": "parry_mp",
      "onParryMpGain": 15,
      "desc": "百鍊不屈：真氣如精鋼般百折不撓，每回合自動回復 25 點內力；成功達成招架格擋時，化解敵勁並額外蓄積 15 點內力。"
    },
    "reqStats": {
      "inner": 35,
      "bone": 30
    },
    "statBonus": {
      "inner": 10,
      "bone": 8,
      "arm": 2
    },
    "effectDesc": "鑄劍山莊上乘內功心法，將人體經脈比作鐵胚，歷經千錘百鍊方能成鋼。運功時內息浩蕩如大江東去，護體罡氣極為厚重，招架敵方招式時更能化敵勁為自身內力。",
    "tier10Bonus": {
      "arm": 5,
      "speed": 3,
      "bone": 15,
      "inner": 25,
      "int": 6,
      "luck": 0
    },
    "ifRules": [],
    "source": "【鑄劍山莊・劍意留痕壁】鑄劍山莊傳功大殿",
    "costLearn": 600
  },
  {
    "id": "kf_feiyan",
    "name": "飛簷走壁",
    "type": "qinggong",
    "weaponReq": "任意",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseSpeedBonus": 24,
    "reqStats": {
      "speed": 35
    },
    "statBonus": {
      "speed": 9,
      "luck": 3
    },
    "costLearn": 600,
    "costGold": 25,
    "effectDesc": "提身涉險，如靈燕穿柳，大幅提升出手身法。",
    "tier10Bonus": {
      "arm": 0,
      "speed": 27,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 9
    },
    "ifRules": []
  },
  {
    "id": "kf_yanfei",
    "name": "新陰流・燕飛步",
    "type": "qinggong",
    "weaponReq": "任意",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseSpeedBonus": 25,
    "reqStats": {
      "speed": 45
    },
    "reqRank": "內門弟子",
    "costLearn": 900,
    "statBonus": {
      "speed": 10,
      "arm": 3
    },
    "desc": "身如低掠之靈燕，步法縮地無聲，瞬息逼近敵背。",
    "tier10Bonus": {
      "arm": 9,
      "speed": 30,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_qingteng",
    "name": "青藤盤根步",
    "type": "qinggong",
    "weaponReq": "任意",
    "rarity": "良品",
    "tier": 1,
    "progress": 0,
    "baseSpeedBonus": 24,
    "reqStats": {
      "speed": 38
    },
    "reqRank": "內門弟子",
    "costLearn": 900,
    "statBonus": {
      "speed": 8,
      "bone": 4
    },
    "desc": "身如林中青藤攀附縱躍，高山履險如平地。",
    "tier10Bonus": {
      "arm": 0,
      "speed": 24,
      "bone": 12,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_shaolin_palm",
    "name": "大力金剛掌",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "上品",
    "tier": 1,
    "progress": 0,
    "baseMult": 2.25,
    "costMp": 50,
    "reqStats": {
      "arm": 45,
      "bone": 40
    },
    "statBonus": {
      "arm": 14,
      "bone": 10
    },
    "costLearn": 1800,
    "jinyongDesc": "掌風剛烈雄勁，勢若降龍伏虎，一掌出風雷動！",
    "tier10Bonus": {
      "arm": 42,
      "speed": 0,
      "bone": 30,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_taiji_fist",
    "name": "武當太極長拳",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "上品",
    "tier": 1,
    "progress": 0,
    "baseMult": 2.2,
    "costMp": 50,
    "reqStats": {
      "inner": 40,
      "bone": 35
    },
    "statBonus": {
      "inner": 14,
      "bone": 10
    },
    "costLearn": 1800,
    "jinyongDesc": "以柔克剛，借敵千斤之力反震其體！",
    "tier10Bonus": {
      "arm": 0,
      "speed": 0,
      "bone": 30,
      "inner": 42,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_mw8pxm4u74",
    "name": "烈焰驚濤劍",
    "type": "external",
    "weaponReq": "劍",
    "rarity": "上品",
    "tier": 1,
    "progress": 0,
    "baseMult": 1.82,
    "costMp": 25,
    "reqStats": {
      "speed": 45,
      "arm": 20
    },
    "statBonus": {
      "speed": 9,
      "arm": 4
    },
    "costLearn": 1800,
    "jinyongDesc": "鑄劍山莊鎮派絕學之一。劍招初出如平地驚雷，隨之而來的劍氣更如怒濤翻滾、烈火焚天。此劍法將至剛至陽的內勁融入奔騰劍勢之中，招式大開大闔，既有海濤之洶湧，又帶烈火之狂熾，令對手如身陷熔岩怒海，窒息難擋。",
    "tier10Bonus": {
      "arm": 12,
      "speed": 27,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": [],
    "reqRank": "外門弟子",
    "effectDesc": "施展時附帶「烈焰焚心」與「驚濤駭浪」雙重威壓，命中後有幾率令敵方灼燒，並削減其身法移動速度。",
    "vfxChain": {
      "pre": "劍身赤紅，真氣激盪如火苗吞吐",
      "mid": "化作一團赤色狂濤，劍影交錯如怒海狂濤撲面",
      "post": "收劍入鞘，地面留下一道焦黑的劍痕與裊裊餘煙"
    },
    "source": "【鑄劍山莊・劍意留痕壁】鑄劍山莊傳功大殿"
  },
  {
    "id": "kf_fengmo",
    "name": "瘋魔杖法",
    "type": "external",
    "weaponReq": "棍",
    "rarity": "上品",
    "tier": 1,
    "progress": 0,
    "baseMult": 2.3,
    "costMp": 50,
    "reqRank": "真傳弟子",
    "costLearn": 1800,
    "reqStats": {
      "arm": 45,
      "bone": 35
    },
    "statBonus": {
      "bone": 13,
      "arm": 11
    },
    "jinyongDesc": "出招如瘋如魔，棍影如山，打得山崩石裂！",
    "tier10Bonus": {
      "arm": 33,
      "speed": 0,
      "bone": 39,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_nan_tiexian",
    "name": "鐵線金剛拳綱",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "上品",
    "tier": 1,
    "progress": 0,
    "baseHpBonus": 175,
    "baseDefBonus": 22,
    "turnMpRegen": 40,
    "specialEffect": {
      "type": "armor_pierce_leech",
      "armorPiercePct": 0.18,
      "skillHealHp": 25,
      "desc": "鐵線剛勁：每回合回調 40 點內力；外功攻擊無視敵方 18% 防禦，每次施展外功氣脈反哺回覆 25 點氣血。"
    },
    "reqRank": "真傳弟子",
    "costLearn": 1800,
    "reqStats": {
      "inner": 40,
      "arm": 35
    },
    "statBonus": {
      "inner": 13,
      "arm": 8,
      "bone": 4
    },
    "effectDesc": "兩臂如鑄鐵金剛，極大增幅筋骨氣力，出招自帶破甲與反哺。",
    "tier10Bonus": {
      "arm": 24,
      "speed": 0,
      "bone": 12,
      "inner": 39,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_canyue_xinfa",
    "name": "殘月斬鐵心經",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "上品",
    "tier": 1,
    "progress": 0,
    "baseHpBonus": 165,
    "baseDefBonus": 18,
    "turnMpRegen": 40,
    "specialEffect": {
      "type": "speed_crit",
      "atbBoostPct": 0.15,
      "critRateAdd": 10,
      "desc": "心凝如鏡：每回合回調 40 點內力；戰鬥蓄力速度提升 15%，常駐暴擊率額外 +10%。"
    },
    "reqStats": {
      "inner": 40,
      "arm": 35
    },
    "reqRank": "真傳弟子",
    "costLearn": 1800,
    "statBonus": {
      "inner": 12,
      "speed": 8,
      "arm": 5
    },
    "desc": "蓄勢於氣海，大幅增益外攻殺伐與出招極速。",
    "tier10Bonus": {
      "arm": 15,
      "speed": 24,
      "bone": 0,
      "inner": 36,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_zuling_xinfa",
    "name": "神木自然長生心法",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "上品",
    "tier": 1,
    "progress": 0,
    "baseHpBonus": 185,
    "baseDefBonus": 20,
    "turnMpRegen": 40,
    "specialEffect": {
      "type": "nature_regen",
      "turnHpRegenPct": 0.04,
      "lowHpDouble": true,
      "desc": "生生不息：每回合回調 40 點內力；每回合周天吐納自動回覆 4% 氣血（氣血低於 40% 時回血翻倍為 8%）。"
    },
    "reqStats": {
      "inner": 42,
      "bone": 35
    },
    "reqRank": "真傳弟子",
    "costLearn": 1800,
    "statBonus": {
      "inner": 14,
      "bone": 8,
      "luck": 3
    },
    "desc": "感悟萬年神木呼吸吐納，生機勃發，持續自愈傷勢。",
    "ifRules": [
      {
        "trigger": "每回合開始時",
        "target": "自身",
        "action": "回復氣血",
        "val": "4%"
      }
    ],
    "specialDesc": "生生不息：每回合回調 40 點內力；每回合周天吐納自動回覆 4% 氣血（氣血低於 40% 時回血翻倍為 8%）。",
    "tier10Bonus": {
      "arm": 0,
      "speed": 0,
      "bone": 24,
      "inner": 42,
      "int": 0,
      "luck": 9
    }
  },
  {
    "id": "kf_mw8osvey11",
    "name": "純陽熔金功",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "上品",
    "tier": 3,
    "progress": 0,
    "baseHpBonus": 380,
    "baseDefBonus": 38,
    "turnMpRegen": 65,
    "specialEffect": {
      "type": "nature_regen",
      "turnHpRegenPct": 0.05,
      "lowHpDouble": true,
      "desc": "純陽不滅：純陽真氣如烈日熔金，每回合自動回調 65 點內力；每回合周天吐納自動回復 5% 氣血（當氣血低於 40% 時，至陽真氣護主，回血效果翻倍為 10%）。"
    },
    "reqStats": {
      "inner": 55,
      "bone": 48
    },
    "reqRank": "真傳弟子",
    "costLearn": 1800,
    "statBonus": {
      "inner": 12,
      "bone": 8,
      "arm": 8,
      "luck": 0
    },
    "desc": "鑄劍山莊高深鎮派內功，匯聚地肺純陽之火與精鋼之氣於一身。運功時真氣如沸騰鐵水般奔湧流轉，不但防禦力驚人，更能藉由純陽罡氣生生不息地滋養全身經脈、自動癒合重傷。",
    "ifRules": [
      {
        "trigger": "每回合開始時",
        "target": "自身",
        "action": "回復氣血",
        "val": "5%"
      }
    ],
    "specialDesc": "純陽不滅：純陽真氣如烈日熔金，每回合自動回調 65 點內力；每回合周天吐納自動回復 5% 氣血（當氣血低於 40% 時，至陽真氣護主，回血效果翻倍為 10%）。",
    "tier10Bonus": {
      "arm": 25,
      "speed": 6,
      "bone": 32,
      "inner": 25,
      "int": 0,
      "luck": 0
    },
    "effectDesc": "純陽真氣奔騰不息，護體罡氣如烈日熔金，大幅增幅氣血、防禦與內力恢復，瀕死時更具強大自癒奇效。",
    "source": "【鑄劍山莊・劍意留痕壁】鑄劍山莊傳功大殿"
  },
  {
    "id": "kf_wandu_xinfa",
    "name": "萬毒枯榮心經",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "上品",
    "tier": 1,
    "progress": 0,
    "baseHpBonus": 170,
    "baseDefBonus": 18,
    "turnMpRegen": 40,
    "specialEffect": {
      "type": "poison_aura",
      "poisonTurnDmg": 25,
      "poisonTurnMpDmg": 8,
      "desc": "萬毒枯榮：每回合回調 40 點內力；周身散發枯榮毒息，對手每回合自動損失 25 點氣血與 8 點內力。"
    },
    "reqStats": {
      "inner": 40,
      "bone": 30
    },
    "reqRank": "真傳弟子",
    "costLearn": 1800,
    "statBonus": {
      "inner": 13,
      "speed": 7,
      "int": 5
    },
    "desc": "唐門至高心訣，以毒煉氣，枯榮轉換，蝕敵氣脈。",
    "tier10Bonus": {
      "arm": 0,
      "speed": 21,
      "bone": 0,
      "inner": 39,
      "int": 15,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_bei_step",
    "name": "登萍度水身法",
    "type": "qinggong",
    "weaponReq": "任意",
    "rarity": "上品",
    "tier": 1,
    "progress": 0,
    "baseSpeedBonus": 36,
    "reqRank": "真傳弟子",
    "costLearn": 1800,
    "reqStats": {
      "speed": 50
    },
    "statBonus": {
      "speed": 17,
      "luck": 6
    },
    "effectDesc": "足尖在水浪上踏雪奔行，身形縹緲神駿。",
    "tier10Bonus": {
      "arm": 0,
      "speed": 51,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 18
    },
    "ifRules": []
  },
  {
    "id": "kf_sanxian",
    "name": "奪命連環三仙劍",
    "type": "external",
    "weaponReq": "劍",
    "rarity": "絕品",
    "tier": 1,
    "progress": 0,
    "baseMult": 2.85,
    "costMp": 100,
    "uniqueVfx": "sanxian",
    "reqRank": "長老",
    "costLearn": 3200,
    "reqStats": {
      "speed": 65,
      "arm": 40
    },
    "statBonus": {
      "speed": 20,
      "arm": 12,
      "luck": 5
    },
    "jinyongDesc": "一劍化三仙，狠辣絕倫，瞬殺敵方週身三大要穴！",
    "tier10Bonus": {
      "arm": 36,
      "speed": 60,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 15
    },
    "ifRules": []
  },
  {
    "id": "kf_mw8pynx870",
    "name": "止水淬鋒劍",
    "type": "external",
    "weaponReq": "劍",
    "rarity": "絕品",
    "tier": 1,
    "progress": 0,
    "baseMult": 2.85,
    "costMp": 100,
    "uniqueVfx": "sanxian",
    "reqRank": "長老",
    "costLearn": 3200,
    "reqStats": {
      "speed": 65,
      "arm": 40
    },
    "statBonus": {
      "speed": 20,
      "arm": 12,
      "luck": 5
    },
    "jinyongDesc": "一劍化三仙，狠辣絕倫，瞬殺敵方週身三大要穴！",
    "tier10Bonus": {
      "arm": 36,
      "speed": 60,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 15
    },
    "ifRules": [],
    "effectDesc": "鑄劍山莊鎮派絕學劍法，心如止水而劍鋒淬火。出劍時古井無波，瞬息間化為漫天流光，劍氣狠辣絕倫，可於無形中封鎖敵方周身要穴。",
    "vfxChain": {
      "pre": "十二路譚弧",
      "mid": "無動畫",
      "post": "詠春十字斬"
    },
    "source": "【鑄劍山莊・劍意留痕壁】鑄劍山莊傳功大殿"
  },
  {
    "id": "kf_jindao_eight",
    "name": "金刀八式・斬乾坤",
    "type": "external",
    "weaponReq": "刀",
    "rarity": "絕品",
    "tier": 1,
    "progress": 0,
    "baseMult": 2.8,
    "costMp": 100,
    "reqRank": "長老",
    "costLearn": 3200,
    "reqStats": {
      "arm": 60,
      "speed": 45
    },
    "statBonus": {
      "arm": 22,
      "bone": 10,
      "speed": 4
    },
    "jinyongDesc": "黃金厚刃怒斬而下，力劈華嶽，地動山搖！",
    "tier10Bonus": {
      "arm": 66,
      "speed": 12,
      "bone": 30,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_nan_shadowless",
    "name": "佛山無影拳",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "絕品",
    "tier": 1,
    "progress": 0,
    "baseMult": 2.88,
    "costMp": 100,
    "uniqueVfx": "nan_fist",
    "reqRank": "長老",
    "costLearn": 3400,
    "reqStats": {
      "arm": 60,
      "speed": 55
    },
    "statBonus": {
      "arm": 19,
      "speed": 14,
      "bone": 5
    },
    "jinyongDesc": "聲東擊西，影過留痕，一息百拳震裂山石！",
    "tier10Bonus": {
      "arm": 57,
      "speed": 42,
      "bone": 15,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_bei_whirlwind",
    "name": "北派幽冥旋風腿",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "絕品",
    "tier": 1,
    "progress": 0,
    "baseMult": 2.82,
    "costMp": 100,
    "uniqueVfx": "bei_kick",
    "reqRank": "長老",
    "costLearn": 3300,
    "reqStats": {
      "speed": 65,
      "arm": 45
    },
    "statBonus": {
      "speed": 20,
      "arm": 12,
      "bone": 5
    },
    "jinyongDesc": "縱身凌空七連環踢，腿影遮天蔽日，幽冥煞氣逼人！",
    "tier10Bonus": {
      "arm": 36,
      "speed": 60,
      "bone": 15,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_wingchun_blade",
    "name": "八斬刀法・奪魂",
    "type": "external",
    "weaponReq": "刀",
    "rarity": "絕品",
    "tier": 1,
    "progress": 0,
    "baseMult": 2.9,
    "costMp": 100,
    "uniqueVfx": "bazhan",
    "reqRank": "長老",
    "costLearn": 3400,
    "reqStats": {
      "speed": 65,
      "arm": 40
    },
    "statBonus": {
      "speed": 18,
      "arm": 14,
      "luck": 5
    },
    "jinyongDesc": "貼身連環八斬，刀光如雪，奪命連擊，防不勝防！",
    "tier10Bonus": {
      "arm": 42,
      "speed": 54,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 15
    },
    "ifRules": []
  },
  {
    "id": "kf_nansha_blade",
    "name": "劈波斬浪大斷刀",
    "type": "external",
    "weaponReq": "刀",
    "rarity": "絕品",
    "tier": 1,
    "progress": 0,
    "baseMult": 2.85,
    "costMp": 100,
    "uniqueVfx": "nansha",
    "reqRank": "長老",
    "costLearn": 3200,
    "reqStats": {
      "arm": 65,
      "speed": 45
    },
    "statBonus": {
      "arm": 20,
      "bone": 12,
      "speed": 5
    },
    "jinyongDesc": "橫江怒刀猛劈，大江兩分，威猛霸道無倫！",
    "tier10Bonus": {
      "arm": 60,
      "speed": 15,
      "bone": 36,
      "inner": 0,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_chunyuan_taiji",
    "name": "純陽太極功",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "絕品",
    "tier": 1,
    "progress": 0,
    "baseHpBonus": 280,
    "baseDefBonus": 34,
    "turnMpRegen": 80,
    "specialEffect": {
      "type": "absorb_parry",
      "parryRateAdd": 25,
      "damageToMpPct": 0.3,
      "desc": "純陽化勁：每回合回調 80 點內力；常駐招架格擋率 +25%，受創時將所受傷害的 30% 化為自身內力回充。"
    },
    "reqStats": {
      "inner": 60,
      "bone": 50
    },
    "statBonus": {
      "inner": 20,
      "bone": 12,
      "int": 6
    },
    "effectDesc": "武當至高道家心法，以柔克剛，卸敵萬鈞之力為己用。",
    "tier10Bonus": {
      "arm": 0,
      "speed": 0,
      "bone": 36,
      "inner": 60,
      "int": 18,
      "luck": 0
    },
    "ifRules": [],
    "costLearn": 3600
  },
  {
    "id": "kf_mw8ov8tt10",
    "name": "寒潭淬刃功",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "絕品",
    "tier": 4,
    "progress": 0,
    "baseHpBonus": 580,
    "baseDefBonus": 65,
    "turnMpRegen": 120,
    "specialEffect": {
      "type": "absorb_parry",
      "parryRateAdd": 35,
      "damageToMpPct": 0.4,
      "desc": "寒潭化刃：如深淵寒潭般冰寒刺骨、無堅不摧，每回合自動回調 120 點內力；常駐招架格擋率提升 +35%，受創時更可將所受傷害的 40% 轉化為自身內力回充，卸盡敵勁。"
    },
    "reqStats": {
      "inner": 75,
      "bone": 65
    },
    "statBonus": {
      "inner": 32,
      "bone": 20,
      "int": 5,
      "arm": 6
    },
    "effectDesc": "鑄劍山莊鎮派絕學內功，相傳為歷代宗師於極寒劍池底觀悟冰潭淬劍之理所創。運功時內息冰冷徹骨卻暗藏百鍊鋼勁，招架時能如寒潭化去烈火般，將敵方攻勢化為自身內力，防禦力登峰造極。",
    "tier10Bonus": {
      "arm": 15,
      "speed": 0,
      "bone": 55,
      "inner": 80,
      "int": 15,
      "luck": 0
    },
    "ifRules": [],
    "reqRank": "長老",
    "costLearn": 3600,
    "source": "【鑄劍山莊・劍意留痕壁】鑄劍山莊傳功大殿"
  },
  {
    "id": "kf_dragon_palm",
    "name": "降龍十八掌・亢龍有悔",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "神品",
    "tier": 1,
    "progress": 0,
    "baseMult": 3.45,
    "costMp": 150,
    "uniqueVfx": "dragon",
    "reqRank": "長老",
    "costLearn": 5000,
    "reqStats": {
      "arm": 65,
      "bone": 60,
      "inner": 50
    },
    "statBonus": {
      "arm": 28,
      "bone": 18,
      "inner": 10
    },
    "jinyongDesc": "金龍神罡破空而出，聲震百里，排山倒海傾瀉敵體！",
    "tier10Bonus": {
      "arm": 84,
      "speed": 0,
      "bone": 54,
      "inner": 30,
      "int": 0,
      "luck": 0
    },
    "ifRules": []
  },
  {
    "id": "kf_ittoryu_ultimate",
    "name": "秘劍・一之太刀",
    "type": "external",
    "weaponReq": "刀",
    "rarity": "神品",
    "tier": 1,
    "progress": 0,
    "baseMult": 3.55,
    "costMp": 150,
    "uniqueVfx": "ittoryu",
    "reqRank": "長老",
    "costLearn": 5000,
    "reqStats": {
      "arm": 65,
      "speed": 70
    },
    "statBonus": {
      "arm": 30,
      "speed": 20,
      "luck": 8
    },
    "jinyongDesc": "心技體合一之居合奧義，雷光一閃之間敵軀兩斷！",
    "tier10Bonus": {
      "arm": 90,
      "speed": 60,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 24
    },
    "ifRules": []
  },
  {
    "id": "kf_storm_needles",
    "name": "暴雨梨花針",
    "type": "external",
    "weaponReq": "暗器",
    "rarity": "神品",
    "tier": 1,
    "progress": 0,
    "baseMult": 3.4,
    "costMp": 150,
    "uniqueVfx": "storm",
    "reqRank": "長老",
    "costLearn": 5000,
    "reqStats": {
      "speed": 65,
      "arm": 35
    },
    "statBonus": {
      "speed": 32,
      "arm": 14,
      "luck": 8
    },
    "jinyongDesc": "二十七枚淬毒銀針齊發，漫天花雨，神鬼難逃！",
    "tier10Bonus": {
      "arm": 42,
      "speed": 96,
      "bone": 0,
      "inner": 0,
      "int": 0,
      "luck": 24
    },
    "ifRules": [],
    "vfxChain": {
      "pre": "太極陰陽陣",
      "mid": "暴雨梨花針",
      "post": "漫天飛花",
      "postTarget": "target"
    }
  },
  {
    "id": "kf_tanzhi",
    "name": "彈指神通",
    "type": "external",
    "weaponReq": "暗器",
    "rarity": "神品",
    "tier": 1,
    "progress": 0,
    "baseMult": 3.45,
    "costMp": 150,
    "uniqueVfx": "tanzhi",
    "reqStats": {
      "speed": 50,
      "inner": 40
    },
    "statBonus": {
      "speed": 28,
      "inner": 16,
      "arm": 10
    },
    "jinyongDesc": "指尖微曲隨即一彈，一道森森氣勁如離弦之箭激射而出！",
    "tier10Bonus": {
      "arm": 30,
      "speed": 84,
      "bone": 0,
      "inner": 48,
      "int": 0,
      "luck": 0
    },
    "ifRules": [],
    "costLearn": 6000
  },
  {
    "id": "kf_yiyang",
    "name": "先天功一陽指意",
    "type": "external",
    "weaponReq": "拳",
    "rarity": "神品",
    "tier": 1,
    "progress": 0,
    "baseMult": 3.35,
    "costMp": 150,
    "uniqueVfx": "yiyang",
    "reqRank": "長老",
    "costLearn": 5000,
    "reqStats": {
      "inner": 60,
      "bone": 50
    },
    "statBonus": {
      "inner": 26,
      "arm": 16,
      "bone": 12
    },
    "jinyongDesc": "純陽神指破體而出，九天純陽金光貫頂！",
    "tier10Bonus": {
      "arm": 48,
      "speed": 0,
      "bone": 36,
      "inner": 78,
      "int": 0,
      "luck": 0
    },
    "ifRules": [],
    "vfxChain": {
      "pre": "無動畫",
      "mid": "青翠極光箭",
      "post": "一陽指純陽柱",
      "postTarget": "target"
    }
  },
  {
    "id": "kf_mw8pzzz967",
    "name": "萬刃歸宗劍",
    "type": "external",
    "weaponReq": "劍",
    "rarity": "神品",
    "tier": 1,
    "progress": 0,
    "baseMult": 3.45,
    "costMp": 150,
    "uniqueVfx": "yiyang",
    "reqRank": "長老",
    "costLearn": 5000,
    "reqStats": {
      "inner": 60,
      "bone": 50
    },
    "statBonus": {
      "inner": 26,
      "arm": 16,
      "bone": 12
    },
    "jinyongDesc": "純陽神指破體而出，九天純陽金光貫頂！",
    "tier10Bonus": {
      "arm": 48,
      "speed": 0,
      "bone": 36,
      "inner": 78,
      "int": 0,
      "luck": 0
    },
    "ifRules": [],
    "vfxChain": {
      "pre": "無動畫",
      "mid": "詠春十字斬",
      "post": "祖靈萬魂刺",
      "postTarget": "target"
    },
    "effectDesc": "鑄劍山莊傳說中的終極劍道神技，萬劍朝宗，氣象萬千。運劍時引動天地金石之氣化為千百道實質劍芒，萬刃歸一，威力足以石破天驚、威震武林。",
    "source": "【鑄劍山莊・劍意留痕壁】鑄劍山莊傳功大殿"
  },
  {
    "id": "kf_ancestor_ultimate",
    "name": "祖靈之怒・萬魂獵殺",
    "type": "external",
    "weaponReq": "暗器",
    "rarity": "神品",
    "tier": 1,
    "progress": 0,
    "baseMult": 3.45,
    "costMp": 150,
    "uniqueVfx": "ancestor",
    "reqRank": "長老",
    "costLearn": 4900,
    "reqStats": {
      "speed": 75,
      "arm": 40
    },
    "statBonus": {
      "speed": 32,
      "inner": 14,
      "arm": 10
    },
    "jinyongDesc": "祭祀祖靈之漫天骨刺與毒雨，覆蓋整個戰場，神鬼辟易！",
    "tier10Bonus": {
      "arm": 30,
      "speed": 96,
      "bone": 0,
      "inner": 42,
      "int": 0,
      "luck": 0
    },
    "ifRules": [],
    "vfxChain": {
      "pre": "剛猛拳罡波",
      "mid": "青翠極光箭",
      "post": "祖靈萬魂刺",
      "postTarget": "target"
    },
    "source": "【祖靈神殿・大巫祝居所】祖靈神殿傳功大殿"
  },
  {
    "id": "kf_jiuyang_shengong",
    "name": "九陽真經神功",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "神品",
    "tier": 1,
    "progress": 0,
    "baseHpBonus": 450,
    "baseDefBonus": 50,
    "turnMpRegen": 120,
    "specialEffect": {
      "type": "divine_jiuyang",
      "shieldPct": 0.12,
      "turnHpRegenPct": 0.05,
      "freeMpChance": 0.25,
      "desc": "生生不息：每回合回調 120 點內力；凝結最大氣血 12% 的【九陽純陽盾】、自動回覆 5% 氣血，且施展武學時有 25% 機率完全不消耗內力！"
    },
    "reqStats": {
      "inner": 70,
      "bone": 60
    },
    "statBonus": {
      "inner": 28,
      "bone": 18,
      "arm": 10
    },
    "effectDesc": "至剛至陽無上神功，內力自生速度登峰造極，百病不生，諸毒莫侵。",
    "tier10Bonus": {
      "arm": 30,
      "speed": 0,
      "bone": 54,
      "inner": 84,
      "int": 0,
      "luck": 0
    },
    "ifRules": [],
    "costLearn": 7200
  },
  {
    "id": "kf_mw8pjk7516",
    "name": "乾坤造化神功",
    "type": "internal",
    "weaponReq": "任意",
    "rarity": "神品",
    "tier": 5,
    "progress": 0,
    "baseHpBonus": 850,
    "baseDefBonus": 90,
    "turnMpRegen": 200,
    "specialEffect": {
      "type": "divine_jiuyang",
      "shieldPct": 0.2,
      "turnHpRegenPct": 0.08,
      "freeMpChance": 0.4,
      "desc": "乾坤造化：融通天地之秘，每回合自動回調 200 點內力；開場凝結高達最大氣血 20% 的【造化金剛盾】、每回合自動回復 8% 氣血，且施展任何武學時皆有 40% 機率徹底返璞歸真、完全不消耗內力！"
    },
    "reqStats": {
      "inner": 90,
      "bone": 80
    },
    "statBonus": {
      "inner": 45,
      "bone": 15,
      "arm": 15,
      "int": 0,
      "luck": 0
    },
    "effectDesc": "鑄劍山莊鎮派無上神功，相傳為創派祖師參透天地乾坤、融合萬金熔於一爐的終極內功。運功時真氣如混沌初開般浩瀚無垠，至剛至陽、諸毒莫侵，攻防一體且內力自生生生不息。",
    "tier10Bonus": {
      "arm": 45,
      "speed": 0,
      "bone": 55,
      "inner": 150,
      "int": 0,
      "luck": 0
    },
    "ifRules": [
      {
        "trigger": "每回合開始時",
        "target": "自身",
        "action": "回復氣血",
        "val": "8%"
      }
    ],
    "costLearn": 7200,
    "reqRank": "傳人",
    "source": "【鑄劍山莊・葬兵谷】傳說中歷代祖師傳承之秘境"
  }
];
window.GLOBAL_SKILLS = GLOBAL_SKILLS;
window.getKungfuEval = getKungfuEval;
window.getUpgradeExpCost = getUpgradeExpCost;
window.getSkillWeaponReq = getSkillWeaponReq;
window.isSkillCompatibleWithWeapon = isSkillCompatibleWithWeapon;
