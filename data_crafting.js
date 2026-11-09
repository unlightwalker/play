/**
 * ========================================================
 * 你的江湖 - 製作系統資料 (data_crafting.js)
 * CRAFT_SKILLS：製作技能（鍛造 / 製藥…可再新增），每項 1~10 級，expToNext[i] = 第 i+1 級升到 i+2 級所需熟練度
 * CRAFT_CONFIG：成功率公式與工具等級名稱（工具 1~5 級，遊戲中以品階 凡品~神品 顯示）
 *   成功率 = 配方基礎成功率 + (技能等級 - 需求等級) × skillBonus + (工具等級 - 需求工具) × toolBonus，限制在 minRate ~ maxRate
 *   失敗時：獲得 failExpRatio 比例的熟練度，每份材料有 failKeepRatio 機率保留
 *   工具每高出需求 1 級，成功時有 bonusOutputPerTool % 機率多產出 1 份
 * CRAFT_RECIPES：配方（skill 對應 CRAFT_SKILLS.key；output / materials 的 ref 為 data_items.js 物品 id）
 * 製作工具是地圖上的 NPC：service = "craft"、craftSkill = 技能 key、toolLevel = 1~5（見 data_map.js 各門派地塊）
 * 本檔可由 editor.html「⚒️ 製作」分頁編輯
 * ========================================================
 */

const CRAFT_SKILLS = [
  {
    "key": "forge",
    "name": "鍛造",
    "icon": "🔨",
    "desc": "鍛打兵刃與護甲。需在門派的鍛造工具（鐵砧／熔爐）前操作。",
    "titles": [
      "鐵匠學徒",
      "打鐵匠",
      "熟手匠人",
      "精工匠師",
      "鍛造好手",
      "名匠",
      "鑄劍師",
      "神匠",
      "鑄兵宗師",
      "天工鬼斧"
    ],
    "expToNext": [
      60,
      120,
      200,
      300,
      420,
      560,
      720,
      900,
      1100
    ]
  },
  {
    "key": "alchemy",
    "name": "製藥",
    "icon": "⚗️",
    "desc": "煉製丹藥與藥散。需在門派的煉藥工具（丹爐／藥鼎）前操作。",
    "titles": [
      "藥童",
      "抓藥夥計",
      "熟手藥師",
      "丹房藥師",
      "煉丹好手",
      "名醫",
      "丹師",
      "丹王",
      "藥王",
      "丹道宗師"
    ],
    "expToNext": [
      60,
      120,
      200,
      300,
      420,
      560,
      720,
      900,
      1100
    ]
  }
];

const CRAFT_CONFIG = {
  "maxSkillLevel": 10,
  "maxToolLevel": 5,
  "toolNames": [
    "凡品",
    "良品",
    "上品",
    "絕品",
    "神品"
  ],
  "skillBonus": 5,
  "toolBonus": 5,
  "minRate": 5,
  "maxRate": 100,
  "failExpRatio": 0.3,
  "failKeepRatio": 0.5,
  "bonusOutputPerTool": 10
};

const CRAFT_RECIPES = [
  {
    "id": "rc_refine_steel",
    "name": "百煉成鋼",
    "skill": "forge",
    "output": {
      "ref": "mat_steel",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_iron",
        "count": 3
      }
    ],
    "gold": 5,
    "reqLevel": 2,
    "reqTool": 1,
    "rate": 85,
    "exp": 15,
    "desc": "將精鐵反覆鍛打，煉成百煉鋼。"
  },
  {
    "id": "rc_wood_sword",
    "name": "粗製木劍",
    "skill": "forge",
    "output": {
      "ref": "item_wood_sword",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_wood",
        "count": 2
      }
    ],
    "gold": 2,
    "reqLevel": 1,
    "reqTool": 1,
    "rate": 95,
    "exp": 8,
    "desc": ""
  },
  {
    "id": "rc_iron_saber",
    "name": "粗鐵單刀",
    "skill": "forge",
    "output": {
      "ref": "item_iron_saber",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_iron",
        "count": 3
      }
    ],
    "gold": 5,
    "reqLevel": 1,
    "reqTool": 1,
    "rate": 90,
    "exp": 10,
    "desc": ""
  },
  {
    "id": "rc_wood_staff",
    "name": "白蠟長棍",
    "skill": "forge",
    "output": {
      "ref": "item_wood_staff",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_wood",
        "count": 3
      }
    ],
    "gold": 3,
    "reqLevel": 1,
    "reqTool": 1,
    "rate": 95,
    "exp": 8,
    "desc": ""
  },
  {
    "id": "rc_cloth_wrap",
    "name": "麻布纏手套",
    "skill": "forge",
    "output": {
      "ref": "item_cloth_wrap",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_hide",
        "count": 2
      }
    ],
    "gold": 3,
    "reqLevel": 1,
    "reqTool": 1,
    "rate": 95,
    "exp": 8,
    "desc": ""
  },
  {
    "id": "rc_cloth_armor",
    "name": "粗麻布衣",
    "skill": "forge",
    "output": {
      "ref": "item_cloth_armor",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_hide",
        "count": 3
      }
    ],
    "gold": 3,
    "reqLevel": 1,
    "reqTool": 1,
    "rate": 95,
    "exp": 8,
    "desc": ""
  },
  {
    "id": "rc_steel_sword",
    "name": "百煉青鋼劍",
    "skill": "forge",
    "output": {
      "ref": "item_steel_sword",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_steel",
        "count": 3
      },
      {
        "ref": "mat_iron",
        "count": 2
      }
    ],
    "gold": 25,
    "reqLevel": 3,
    "reqTool": 2,
    "rate": 75,
    "exp": 40,
    "desc": ""
  },
  {
    "id": "rc_cold_moon",
    "name": "冷月厚背刀",
    "skill": "forge",
    "output": {
      "ref": "item_cold_moon_saber",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_steel",
        "count": 3
      },
      {
        "ref": "mat_wood",
        "count": 1
      }
    ],
    "gold": 25,
    "reqLevel": 3,
    "reqTool": 2,
    "rate": 75,
    "exp": 40,
    "desc": ""
  },
  {
    "id": "rc_copper_staff",
    "name": "齊眉熟銅棍",
    "skill": "forge",
    "output": {
      "ref": "item_copper_staff",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_iron",
        "count": 4
      },
      {
        "ref": "mat_wood",
        "count": 2
      }
    ],
    "gold": 20,
    "reqLevel": 3,
    "reqTool": 2,
    "rate": 75,
    "exp": 36,
    "desc": ""
  },
  {
    "id": "rc_gauntlet",
    "name": "鑌鐵指虎爪",
    "skill": "forge",
    "output": {
      "ref": "item_iron_gauntlet",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_steel",
        "count": 2
      },
      {
        "ref": "mat_hide",
        "count": 2
      }
    ],
    "gold": 20,
    "reqLevel": 3,
    "reqTool": 2,
    "rate": 75,
    "exp": 36,
    "desc": ""
  },
  {
    "id": "rc_chain_armor",
    "name": "精鋼鎖子甲",
    "skill": "forge",
    "output": {
      "ref": "item_armor_chain",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_steel",
        "count": 4
      },
      {
        "ref": "mat_hide",
        "count": 2
      }
    ],
    "gold": 35,
    "reqLevel": 4,
    "reqTool": 2,
    "rate": 70,
    "exp": 55,
    "desc": ""
  },
  {
    "id": "rc_nail_tang",
    "name": "破甲透骨釘",
    "skill": "forge",
    "output": {
      "ref": "item_nail_tang",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_steel",
        "count": 2
      },
      {
        "ref": "mat_cold_iron",
        "count": 1
      }
    ],
    "gold": 40,
    "reqLevel": 4,
    "reqTool": 3,
    "rate": 65,
    "exp": 70,
    "desc": ""
  },
  {
    "id": "rc_gold_snake",
    "name": "金蛇寶劍",
    "skill": "forge",
    "output": {
      "ref": "item_gold_snake_sword",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_cold_iron",
        "count": 3
      },
      {
        "ref": "mat_steel",
        "count": 2
      }
    ],
    "gold": 80,
    "reqLevel": 6,
    "reqTool": 3,
    "rate": 60,
    "exp": 130,
    "desc": ""
  },
  {
    "id": "rc_fumo_staff",
    "name": "鑌鐵伏魔杖",
    "skill": "forge",
    "output": {
      "ref": "item_fumo_staff",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_cold_iron",
        "count": 3
      },
      {
        "ref": "mat_wood",
        "count": 2
      }
    ],
    "gold": 80,
    "reqLevel": 6,
    "reqTool": 3,
    "rate": 60,
    "exp": 130,
    "desc": ""
  },
  {
    "id": "rc_duanmen",
    "name": "斷門斬馬刀",
    "skill": "forge",
    "output": {
      "ref": "item_duanmen_saber",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_cold_iron",
        "count": 4
      }
    ],
    "gold": 90,
    "reqLevel": 6,
    "reqTool": 3,
    "rate": 60,
    "exp": 140,
    "desc": ""
  },
  {
    "id": "rc_wucan",
    "name": "烏蠶絲掌套",
    "skill": "forge",
    "output": {
      "ref": "item_wucan_glove",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_silk",
        "count": 2
      },
      {
        "ref": "mat_cold_iron",
        "count": 1
      }
    ],
    "gold": 90,
    "reqLevel": 6,
    "reqTool": 3,
    "rate": 60,
    "exp": 140,
    "desc": ""
  },
  {
    "id": "rc_heavy_sword",
    "name": "玄鐵重劍",
    "skill": "forge",
    "output": {
      "ref": "item_heavy_iron_sword",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_dark_iron",
        "count": 4
      },
      {
        "ref": "mat_cold_iron",
        "count": 2
      }
    ],
    "gold": 200,
    "reqLevel": 8,
    "reqTool": 4,
    "rate": 45,
    "exp": 320,
    "desc": ""
  },
  {
    "id": "rc_hedgehog",
    "name": "金絲軟猬甲",
    "skill": "forge",
    "output": {
      "ref": "item_soft_hedgehog",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_silk",
        "count": 4
      },
      {
        "ref": "mat_dark_iron",
        "count": 2
      }
    ],
    "gold": 200,
    "reqLevel": 8,
    "reqTool": 4,
    "rate": 45,
    "exp": 320,
    "desc": ""
  },
  {
    "id": "rc_yitian",
    "name": "倚天劍",
    "skill": "forge",
    "output": {
      "ref": "item_yitian_sword",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_meteor",
        "count": 2
      },
      {
        "ref": "mat_dark_iron",
        "count": 3
      }
    ],
    "gold": 600,
    "reqLevel": 10,
    "reqTool": 5,
    "rate": 2.5,
    "exp": 900,
    "desc": "武林至尊，寶刀屠龍。號令天下，莫敢不從！以天外隕鐵與玄鐵重精交融鍛打，方能鑄成這柄絕世神劍，鋒銳無匹。"
  },
  {
    "id": "rc_dragon",
    "name": "屠龍刀",
    "skill": "forge",
    "output": {
      "ref": "item_dragon_saber",
      "count": 1
    },
    "materials": [
      {
        "ref": "mat_meteor",
        "count": 2
      },
      {
        "ref": "mat_dark_iron",
        "count": 4
      }
    ],
    "gold": 600,
    "reqLevel": 10,
    "reqTool": 5,
    "rate": 2.5,
    "exp": 900,
    "desc": "武林至尊，寶刀屠龍。號令天下，莫敢不從！集天地之精華、玄鐵之重魄鍛造而成的絕世神刀，霸氣縱橫，威壓武林。"
  },
  {
    "id": "rc_small_powder",
    "name": "小金創散",
    "skill": "alchemy",
    "output": {
      "ref": "item_small_powder",
      "count": 2
    },
    "materials": [
      {
        "ref": "herb_licorice",
        "count": 2
      }
    ],
    "gold": 2,
    "reqLevel": 1,
    "reqTool": 1,
    "rate": 95,
    "exp": 8,
    "desc": ""
  },
  {
    "id": "rc_big_pill",
    "name": "少林大還丹",
    "skill": "alchemy",
    "output": {
      "ref": "item_big_pill",
      "count": 1
    },
    "materials": [
      {
        "ref": "herb_ginseng",
        "count": 1
      },
      {
        "ref": "herb_licorice",
        "count": 2
      }
    ],
    "gold": 5,
    "reqLevel": 2,
    "reqTool": 1,
    "rate": 85,
    "exp": 15,
    "desc": ""
  },
  {
    "id": "rc_exp_pill",
    "name": "益氣淬靈丹",
    "skill": "alchemy",
    "output": {
      "ref": "item_exp_pill",
      "count": 1
    },
    "materials": [
      {
        "ref": "herb_ginseng",
        "count": 2
      }
    ],
    "gold": 10,
    "reqLevel": 3,
    "reqTool": 2,
    "rate": 75,
    "exp": 30,
    "desc": ""
  },
  {
    "id": "rc_snake_pill",
    "name": "蛇膽明目丸",
    "skill": "alchemy",
    "output": {
      "ref": "item_snake_pill",
      "count": 1
    },
    "materials": [
      {
        "ref": "herb_snakegall",
        "count": 3
      }
    ],
    "gold": 15,
    "reqLevel": 3,
    "reqTool": 2,
    "rate": 70,
    "exp": 35,
    "desc": ""
  },
  {
    "id": "rc_meridian",
    "name": "通脈易筋丸",
    "skill": "alchemy",
    "output": {
      "ref": "item_meridian_pill",
      "count": 1
    },
    "materials": [
      {
        "ref": "herb_snakegall",
        "count": 2
      },
      {
        "ref": "herb_ginseng",
        "count": 1
      }
    ],
    "gold": 15,
    "reqLevel": 4,
    "reqTool": 2,
    "rate": 70,
    "exp": 45,
    "desc": ""
  },
  {
    "id": "rc_peiyuan",
    "name": "培元固本丹",
    "skill": "alchemy",
    "output": {
      "ref": "item_peiyuan_pill",
      "count": 1
    },
    "materials": [
      {
        "ref": "herb_lingzhi",
        "count": 2
      },
      {
        "ref": "herb_ginseng",
        "count": 2
      }
    ],
    "gold": 60,
    "reqLevel": 6,
    "reqTool": 3,
    "rate": 55,
    "exp": 130,
    "desc": ""
  },
  {
    "id": "rc_snow_ginseng",
    "name": "千年雪參丸",
    "skill": "alchemy",
    "output": {
      "ref": "item_snow_ginseng",
      "count": 1
    },
    "materials": [
      {
        "ref": "herb_snowlotus",
        "count": 1
      },
      {
        "ref": "herb_lingzhi",
        "count": 2
      }
    ],
    "gold": 150,
    "reqLevel": 8,
    "reqTool": 4,
    "rate": 40,
    "exp": 300,
    "desc": ""
  },
  {
    "id": "rc_jiuzhuan",
    "name": "九轉還魂丹",
    "skill": "alchemy",
    "output": {
      "ref": "item_jiuzhuan_pill",
      "count": 1
    },
    "materials": [
      {
        "ref": "herb_heshouwu",
        "count": 1
      },
      {
        "ref": "herb_snowlotus",
        "count": 2
      },
      {
        "ref": "herb_zhuguo",
        "count": 2
      }
    ],
    "gold": 500,
    "reqLevel": 10,
    "reqTool": 5,
    "rate": 20,
    "exp": 900,
    "desc": ""
  }
];

/**
 * GATHER_SKILLS：採集類生活技能（1~10 級），與製作技能共用等級與熟練度
 * GATHER_CONFIG：
 *   levelsPerGrade：每 N 級技能對應一個品階（2 → 1~2 級凡品、3~4 級良品…9~10 級神品）
 *   cap / respawnMin：各品階資源點的資源上限、採完後的刷新時間（分鐘）
 *   採集秒數 = baseSeconds[品階] × max(minTimeRatio, 1 − (等級 − 1) × speedPerLevel) × (1 + 品階差 × gapTimePenalty)
 *   失敗率 = failByGap[採集物品階 − 技能品階]（技能品階較高或相同為 failByGap[0]），品階差超過 maxGap 無法採集
 *   exp：各品階成功採集的熟練度；失敗獲得 failExpRatio 比例
 * 採集物是地圖上的人物：service = "gather"、gatherSkill = 技能 key、rarity = 品階、item / count = 產出、bonus = 額外掉落
 */
const GATHER_SKILLS = [
  {
    "key": "gather",
    "name": "採集",
    "verb": "採集",
    "icon": "🌿",
    "desc": "採摘草藥、靈果等植物類資源。",
    "titles": [
      "拾草童",
      "採藥人",
      "識藥人",
      "山野藥客",
      "採藥好手",
      "尋芝人",
      "靈草獵人",
      "藥王門客",
      "百草仙",
      "草木通神"
    ],
    "expToNext": [
      50,
      100,
      170,
      260,
      370,
      500,
      650,
      820,
      1000
    ]
  },
  {
    "key": "mine",
    "name": "挖礦",
    "verb": "挖礦",
    "icon": "⛏️",
    "desc": "開採礦脈中的鐵礦與奇石。",
    "titles": [
      "挖礦學徒",
      "礦工",
      "老礦工",
      "礦脈行家",
      "尋礦好手",
      "探脈師",
      "礦脈名家",
      "斷山手",
      "開山宗師",
      "裂地神鎬"
    ],
    "expToNext": [
      50,
      100,
      170,
      260,
      370,
      500,
      650,
      820,
      1000
    ]
  },
  {
    "key": "chop",
    "name": "砍伐",
    "verb": "砍伐",
    "icon": "🪓",
    "desc": "砍伐林木，取得木料。",
    "titles": [
      "樵夫學徒",
      "樵夫",
      "老樵夫",
      "林中行家",
      "伐木好手",
      "辨木師",
      "林海名家",
      "斷木手",
      "伐林宗師",
      "開天神斧"
    ],
    "expToNext": [
      50,
      100,
      170,
      260,
      370,
      500,
      650,
      820,
      1000
    ]
  }
];

const GATHER_CONFIG = {
  "levelsPerGrade": 2,
  "cap": {
    "凡品": 20,
    "良品": 10,
    "上品": 4,
    "絕品": 2,
    "神品": 1
  },
  "respawnMin": {
    "凡品": 10,
    "良品": 15,
    "上品": 30,
    "絕品": 60,
    "神品": 120
  },
  "baseSeconds": {
    "凡品": 5,
    "良品": 8,
    "上品": 12,
    "絕品": 18,
    "神品": 25
  },
  "speedPerLevel": 0.06,
  "minTimeRatio": 0.4,
  "gapTimePenalty": 0.5,
  "failByGap": [
    0,
    35,
    65
  ],
  "maxGap": 2,
  "exp": {
    "凡品": 6,
    "良品": 14,
    "上品": 30,
    "絕品": 60,
    "神品": 120
  },
  "failExpRatio": 0.3
};

window.CRAFT_SKILLS = CRAFT_SKILLS;
window.GATHER_SKILLS = GATHER_SKILLS;
window.GATHER_CONFIG = GATHER_CONFIG;
window.CRAFT_CONFIG = CRAFT_CONFIG;
window.CRAFT_RECIPES = CRAFT_RECIPES;
