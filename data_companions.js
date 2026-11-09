/**
 * ========================================================
 * 你的江湖 - 俠客（同伴）資料 (data_companions.js)
 * 由 companions.js 執行；可在 editor.html「🤝 俠客」分頁製作與編輯
 * 玩家只能透過奇遇的「招募俠客」結果獲得俠客
 *
 * GLOBAL_COMPANIONS：俠客清單（每位一筆）
 *   id, name, title, role, realm, desc, hint(江湖名冊提示), hidden(不在名冊顯示)
 *   figure  : 火柴人外觀 { body, skin, accent, hair, weapon, accessory, pose }
 *   potential : 潛力（凡品~神品，名稱與成長係數見 COMPANION_CONFIG.potential），影響升級時的成長
 *   stats6  : 1 級六維 { arm, speed, bone, inner, int, luck }（未填依定位預設）；每升一級依潛力成長係數成長
 *   atk     : 基礎攻擊（實際攻擊 = 基礎攻擊 + 兵刃攻擊 + 臂力 × 0.65）；vfx：出手光影
 *   等級    : 從 1 級開始；隨行俠客獲得少俠所得修為的 50%（level.expShare）、俠客經驗丹（物品 companionExp）、修練
 *   gear    : 預設裝備 { weapon: 物品id, armor: 物品id }（兵刃加攻擊 / 身法、決定可用招式；護甲用於「護主」減傷）
 *   skills  : 預設武學（武學名稱陣列）；activeSkill：預設外功招式。招募後只能以秘笈或奇遇學習新武學
 *            俠客有外功 / 心法 / 輕功三個武學欄，只有佩戴中的武學提供素質加成
 *   修練    : 每小時經驗 = 通天塔 training.floor 層背景歷練每小時修為 × 練功室加成 training.roomMult（房屋系統未實裝，目前 ×1）
 *   talkEncounter : 交談觸發奇遇 { on, id, chance }
 *   combo   : 結義後的合擊技 { name, mult, vfx }（每場戰鬥一次）
 *   healPct : 醫者類每次出手改為回復少俠 % 氣血（0 = 攻擊）
 *   errand  : 派遣專長 "gather" | "mine" | "chop" | "tower" | ""
 *   craftSkill : 出戰時協助製作的技能（forge / alchemy…），成功率 + COMPANION_CONFIG.craftBonus
 *   favorites  : 喜歡的禮物（物品 id），好感倍增
 *   swornBonus : 結義後少俠永久獲得的屬性 { stat, value }
 *   lines   : 台詞 { greet, talk, gift, giftFav, assist, win, lose, errandBack, sworn }
 *
 * COMPANION_CONFIG：人數上限、好感門檻、好感來源、助陣與派遣規則
 * ========================================================
 */

const GLOBAL_COMPANIONS = [
  {
    "name": "蘇青霓",
    "potential": "上品",
    "gear": {
      "weapon": "",
      "armor": "item_cloth_armor"
    },
    "skills": [
      "吐納坐忘訣",
      "草上飛"
    ],
    "activeSkill": "",
    "title": "杏林妙手",
    "role": "healer",
    "realm": "略有小成",
    "desc": "身着素白罗衫，背負藥箱，雖是江湖中人卻無半分煞氣。一手「回春妙手」能起死回生，江湖人稱「素手仙姬」。",
    "hint": "聞說此人常在藥王谷或江南集市一帶懸壺濟世，若能贈以稀世藥材或可打動芳心。",
    "figure": {
      "body": "#c2c2c2",
      "skin": "#ffffff",
      "hair": "long",
      "hairColor": "#4b4444",
      "accent": "#16a085",
      "weapon": "sickle",
      "accessory": "gourd",
      "pose": "stand"
    },
    "atk": 22,
    "speed": 50,
    "vfx": "",
    "healPct": 8,
    "errand": "gather",
    "craftSkill": "alchemy",
    "favorites": [
      "herb_snowlotus",
      "herb_lingzhi"
    ],
    "swornBonus": {
      "stat": "inner",
      "value": 5
    },
    "combo": {
      "name": "妙手回春",
      "mult": 2,
      "vfx": "萬佛金光"
    },
    "lines": {
      "greet": [
        "醫者仁心，閣下身上似有暗傷，可需青霓替你把脈？"
      ],
      "talk": [
        "醫者父母心。",
        "少喝些酒，對經脈不好。",
        "望聞問切，一樣都不能少。",
        "這世上最難醫的，是人心。",
        "你最近睡得好嗎？"
      ],
      "gift": [
        "無功不受祿，這禮物太貴重了，青霓不能平白收下。"
      ],
      "giftFav": [
        "呀！此物正是我尋覓多時的靈藥，多謝少俠厚意！"
      ],
      "assist": [
        "別動，我替你止血！",
        "撐住！"
      ],
      "win": [
        "勝負乃常事，不過點到為止，少俠快讓我瞧瞧傷勢。"
      ],
      "lose": [
        "快退下，我來處理傷口。"
      ],
      "errandBack": [
        "採藥之行頗有收穫，山林間的靈氣果然滋養萬物。"
      ],
      "sworn": [
        "自今日起，你我生死相交，願同心協力，行俠仗義於江湖之中！"
      ]
    },
    "id": "comp_mw9feqsk10",
    "startAffinity": 10,
    "stats6": {},
    "hidden": true
  }
];

const COMPANION_CONFIG = {
  "maxParty": 1,
  "maxErrand": 2,
  "maxSworn": 3,
  "unlock": {
    "errand": 30,
    "sworn": 100
  },
  "affinity": {
    "talk": 1,
    "talkPerDay": 1,
    "giftPerDay": 3,
    "gift": {
      "凡品": 2,
      "良品": 4,
      "上品": 8,
      "絕品": 15,
      "神品": 25
    },
    "favoriteMult": 3,
    "battleWin": 1,
    "battleWinPerDay": 5,
    "errandDone": 2
  },
  "assist": {
    "damageRatio": 0.4,
    "speedRatio": 1,
    "inTowerBoss": true,
    "healPct": 8,
    "comboAtHpPct": 50,
    "guardChance": 25
  },
  "craftBonus": 5,
  "errand": {
    "hours": [
      1,
      4,
      8
    ],
    "affinityBonusPer100": 50,
    "towerRatio": 0.3,
    "yields": {
      "gather": [
        {
          "ref": "herb_licorice",
          "perHour": 3
        },
        {
          "ref": "herb_ginseng",
          "perHour": 1
        },
        {
          "ref": "herb_snakegall",
          "perHour": 1
        },
        {
          "ref": "herb_lingzhi",
          "perHour": 0.15
        },
        {
          "ref": "herb_zhuguo",
          "perHour": 0.08
        }
      ],
      "mine": [
        {
          "ref": "mat_iron",
          "perHour": 3
        },
        {
          "ref": "mat_steel",
          "perHour": 0.8
        },
        {
          "ref": "mat_cold_iron",
          "perHour": 0.15
        },
        {
          "ref": "mat_dark_iron",
          "perHour": 0.04
        }
      ],
      "chop": [
        {
          "ref": "mat_wood",
          "perHour": 4
        },
        {
          "ref": "mat_hide",
          "perHour": 1.5
        },
        {
          "ref": "mat_silk",
          "perHour": 0.08
        }
      ],
      "tower": []
    }
  },
  "potential": [
    {
      "rarity": "凡品",
      "name": "凡骨",
      "growth": 1
    },
    {
      "rarity": "良品",
      "name": "良材",
      "growth": 1.25
    },
    {
      "rarity": "上品",
      "name": "俊傑",
      "growth": 1.5
    },
    {
      "rarity": "絕品",
      "name": "奇才",
      "growth": 1.8
    },
    {
      "rarity": "神品",
      "name": "天縱",
      "growth": 2.2
    }
  ],
  "level": {
    "max": 60,
    "expBase": 40,
    "expPow": 1.5,
    "statPerLv": 0.04,
    "expShare": 0.5,
    "expShareTarget": "party"
  },
  "training": {
    "floor": 50,
    "roomMult": 1,
    "hours": [
      1,
      4,
      8
    ]
  }
};

window.GLOBAL_COMPANIONS = GLOBAL_COMPANIONS;
window.COMPANION_CONFIG = COMPANION_CONFIG;
