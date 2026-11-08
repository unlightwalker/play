/**
 * ========================================================
 * 你的江湖 - 全域地圖、城鎮人物與宗門資料庫 (data_map.js)
 * 本檔為純資料檔，可由《萬象天機後台》editor.html 直接讀寫。
 *
 * WORLD_MAP[城鎮名]
 *   grid    : 九宮格地圖座標 [x, y]
 *   exits   : 相鄰城鎮 { north, south, west, east }
 *   scenes  : 場景 (smithy/pharmacy 可設 goods 販售清單、sect 需 sectName)
 *   npcs    : 城鎮人物
 *     scene       : 所在場景 id ("" = 街頭)
 *     dialogues   : 隨機台詞
 *     attackable  : 可否攻擊；為 true 時讀取 realm/maxHp/atk/def/speed/stats/
 *                   exp/gold/learn/combat/skill/internalName 及 drops
 *     drops       : [{ kind: "item"|"book", ref: 物品id|武學id, rate: 掉落率%, count }]
 * ========================================================
 */

const SECT_RANKS = [
  "外門弟子",
  "內門弟子",
  "真傳弟子",
  "長老",
  "出師大成"
];

const WORLD_MAP = {
  "牛家村": {
    "name": "牛家村",
    "sect": "無 (江湖散人)",
    "desc": "江南水鄉，依山傍水，忠良義士隱居之所。",
    "grid": [
      0,
      0
    ],
    "exits": {
      "north": "嘉興",
      "south": "臨安府"
    },
    "scenes": [
      {
        "id": "smithy_牛家村",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_牛家村",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_牛家村",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_牛家村",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "牛家村_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "牛家村_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "牛家村_foe1",
        "name": "村郊山匪悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_牛家村",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "凡夫俗子",
        "maxHp": 180,
        "atk": 16,
        "def": 6,
        "speed": 32,
        "stats": {
          "arm": 11,
          "speed": 32,
          "bone": 9,
          "inner": 8,
          "int": 20,
          "luck": 15
        },
        "exp": 25,
        "gold": 8,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "牛家村_foe2",
        "name": "村郊山匪頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_牛家村",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "凡夫俗子",
        "maxHp": 234,
        "atk": 19,
        "def": 7,
        "speed": 36,
        "stats": {
          "arm": 13,
          "speed": 36,
          "bone": 11,
          "inner": 10,
          "int": 20,
          "luck": 15
        },
        "exp": 50,
        "gold": 16,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "嘉興": {
    "name": "嘉興",
    "sect": "南湖陸家莊",
    "desc": "煙雨樓楊柳堆煙，江南人文匯聚之地。",
    "grid": [
      0,
      1
    ],
    "exits": {
      "north": "蘇州府",
      "south": "牛家村"
    },
    "scenes": [
      {
        "id": "smithy_嘉興",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_嘉興",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_嘉興",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_嘉興",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "嘉興_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "嘉興_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "嘉興_foe1",
        "name": "南湖水寇悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_嘉興",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "初窺門徑",
        "maxHp": 250,
        "atk": 20,
        "def": 8,
        "speed": 36,
        "stats": {
          "arm": 14,
          "speed": 36,
          "bone": 12,
          "inner": 10,
          "int": 20,
          "luck": 15
        },
        "exp": 35,
        "gold": 12,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "嘉興_foe2",
        "name": "南湖水寇頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_嘉興",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "初窺門徑",
        "maxHp": 325,
        "atk": 24,
        "def": 9,
        "speed": 40,
        "stats": {
          "arm": 17,
          "speed": 40,
          "bone": 14,
          "inner": 12,
          "int": 20,
          "luck": 15
        },
        "exp": 70,
        "gold": 24,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "蘇州府": {
    "name": "蘇州府",
    "sect": "姑蘇名城",
    "desc": "寒山古剎，園林幽雅，富庶甲天下。",
    "grid": [
      0,
      2
    ],
    "exits": {
      "north": "無錫城",
      "west": "太湖",
      "south": "嘉興"
    },
    "scenes": [
      {
        "id": "smithy_蘇州府",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_蘇州府",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_蘇州府",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_蘇州府",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "蘇州府_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "蘇州府_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "蘇州府_foe1",
        "name": "姑蘇潑皮悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_蘇州府",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "初窺門徑",
        "maxHp": 290,
        "atk": 22,
        "def": 10,
        "speed": 38,
        "stats": {
          "arm": 15,
          "speed": 38,
          "bone": 15,
          "inner": 11,
          "int": 20,
          "luck": 15
        },
        "exp": 42,
        "gold": 15,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "蘇州府_foe2",
        "name": "姑蘇潑皮頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_蘇州府",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "初窺門徑",
        "maxHp": 377,
        "atk": 26,
        "def": 12,
        "speed": 42,
        "stats": {
          "arm": 18,
          "speed": 42,
          "bone": 18,
          "inner": 13,
          "int": 20,
          "luck": 15
        },
        "exp": 84,
        "gold": 30,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "太湖": {
    "name": "太湖",
    "sect": "歸雲莊水寨",
    "desc": "碧波萬頃，歸雲莊隱於蘆葦蕩深處。",
    "grid": [
      -1,
      2
    ],
    "exits": {
      "north": "宜興鎮",
      "east": "蘇州府"
    },
    "scenes": [
      {
        "id": "smithy_太湖",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_太湖",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_太湖",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_太湖",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "太湖_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "太湖_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "太湖_foe1",
        "name": "太湖水賊悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_太湖",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 460,
        "atk": 34,
        "def": 16,
        "speed": 48,
        "stats": {
          "arm": 24,
          "speed": 48,
          "bone": 24,
          "inner": 17,
          "int": 20,
          "luck": 15
        },
        "exp": 70,
        "gold": 24,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "太湖_foe2",
        "name": "太湖水賊頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_太湖",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 598,
        "atk": 40,
        "def": 19,
        "speed": 52,
        "stats": {
          "arm": 28,
          "speed": 52,
          "bone": 29,
          "inner": 20,
          "int": 20,
          "luck": 15
        },
        "exp": 140,
        "gold": 48,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "無錫城": {
    "name": "無錫城",
    "sect": "松鶴樓",
    "desc": "松鶴樓酒香飄十里，杏子林中大義長存。",
    "grid": [
      0,
      3
    ],
    "exits": {
      "north": "揚州城",
      "west": "宜興鎮",
      "south": "蘇州府"
    },
    "scenes": [
      {
        "id": "smithy_無錫城",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_無錫城",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_無錫城",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_無錫城",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "無錫城_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "無錫城_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "無錫城_foe1",
        "name": "松鶴樓惡客悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_無錫城",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 390,
        "atk": 29,
        "def": 13,
        "speed": 45,
        "stats": {
          "arm": 20,
          "speed": 45,
          "bone": 20,
          "inner": 15,
          "int": 20,
          "luck": 15
        },
        "exp": 58,
        "gold": 20,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "無錫城_foe2",
        "name": "松鶴樓惡客頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_無錫城",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 507,
        "atk": 34,
        "def": 15,
        "speed": 49,
        "stats": {
          "arm": 24,
          "speed": 49,
          "bone": 23,
          "inner": 17,
          "int": 20,
          "luck": 15
        },
        "exp": 116,
        "gold": 40,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "宜興鎮": {
    "name": "宜興鎮",
    "sect": "紫砂古鎮",
    "desc": "紫砂名茶，竹海連綿。",
    "grid": [
      -1,
      3
    ],
    "exits": {
      "east": "無錫城",
      "south": "太湖"
    },
    "scenes": [
      {
        "id": "smithy_宜興鎮",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_宜興鎮",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_宜興鎮",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_宜興鎮",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "宜興鎮_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "宜興鎮_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "宜興鎮_foe1",
        "name": "竹海野人悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_宜興鎮",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 410,
        "atk": 30,
        "def": 14,
        "speed": 46,
        "stats": {
          "arm": 21,
          "speed": 46,
          "bone": 21,
          "inner": 15,
          "int": 20,
          "luck": 15
        },
        "exp": 62,
        "gold": 22,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "宜興鎮_foe2",
        "name": "竹海野人頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_宜興鎮",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 533,
        "atk": 36,
        "def": 16,
        "speed": 50,
        "stats": {
          "arm": 25,
          "speed": 50,
          "bone": 24,
          "inner": 18,
          "int": 20,
          "luck": 15
        },
        "exp": 124,
        "gold": 44,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "揚州城": {
    "name": "揚州城",
    "sect": "二十四橋",
    "desc": "淮左名都，商賈雲集。",
    "grid": [
      0,
      4
    ],
    "exits": {
      "west": "金陵城",
      "east": "鎮江府",
      "south": "無錫城"
    },
    "scenes": [
      {
        "id": "smithy_揚州城",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_揚州城",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_揚州城",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_揚州城",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "揚州城_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "揚州城_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "揚州城_foe1",
        "name": "鹽幫私梟悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_揚州城",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 430,
        "atk": 32,
        "def": 15,
        "speed": 47,
        "stats": {
          "arm": 22,
          "speed": 47,
          "bone": 23,
          "inner": 16,
          "int": 20,
          "luck": 15
        },
        "exp": 68,
        "gold": 25,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "揚州城_foe2",
        "name": "鹽幫私梟頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_揚州城",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 559,
        "atk": 38,
        "def": 18,
        "speed": 51,
        "stats": {
          "arm": 27,
          "speed": 51,
          "bone": 27,
          "inner": 19,
          "int": 20,
          "luck": 15
        },
        "exp": 136,
        "gold": 50,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "金陵城": {
    "name": "金陵城",
    "sect": "六朝古都",
    "desc": "虎踞龍盤，秦淮風月與金陵名宿聚集。",
    "grid": [
      -1,
      4
    ],
    "exits": {
      "north": "登封鎮",
      "west": "襄陽城",
      "east": "揚州城"
    },
    "scenes": [
      {
        "id": "smithy_金陵城",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_金陵城",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_金陵城",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_金陵城",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "金陵城_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "金陵城_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "金陵城_foe1",
        "name": "秦淮惡少悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_金陵城",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "融會貫通",
        "maxHp": 620,
        "atk": 45,
        "def": 24,
        "speed": 56,
        "stats": {
          "arm": 31,
          "speed": 56,
          "bone": 36,
          "inner": 23,
          "int": 20,
          "luck": 15
        },
        "exp": 110,
        "gold": 40,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "金陵城_foe2",
        "name": "秦淮惡少頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_金陵城",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "融會貫通",
        "maxHp": 806,
        "atk": 54,
        "def": 28,
        "speed": 60,
        "stats": {
          "arm": 38,
          "speed": 60,
          "bone": 42,
          "inner": 27,
          "int": 20,
          "luck": 15
        },
        "exp": 220,
        "gold": 80,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "鎮江府": {
    "name": "鎮江府",
    "sect": "金山古剎",
    "desc": "扼長江咽喉，渡江要衝。",
    "grid": [
      1,
      4
    ],
    "exits": {
      "west": "揚州城"
    },
    "scenes": [
      {
        "id": "smithy_鎮江府",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_鎮江府",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_鎮江府",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_鎮江府",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "鎮江府_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "鎮江府_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "鎮江府_foe1",
        "name": "截江狂徒悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_鎮江府",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 490,
        "atk": 37,
        "def": 18,
        "speed": 51,
        "stats": {
          "arm": 26,
          "speed": 51,
          "bone": 27,
          "inner": 19,
          "int": 20,
          "luck": 15
        },
        "exp": 80,
        "gold": 28,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "鎮江府_foe2",
        "name": "截江狂徒頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_鎮江府",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 637,
        "atk": 44,
        "def": 21,
        "speed": 55,
        "stats": {
          "arm": 31,
          "speed": 55,
          "bone": 32,
          "inner": 22,
          "int": 20,
          "luck": 15
        },
        "exp": 160,
        "gold": 56,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "臨安府": {
    "name": "臨安府",
    "sect": "丐幫江南分舵",
    "desc": "西湖美景，八方通商，酒肆林立。",
    "grid": [
      0,
      -1
    ],
    "exits": {
      "north": "牛家村",
      "south": "福州府"
    },
    "scenes": [
      {
        "id": "smithy_臨安府",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_臨安府",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_臨安府",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_臨安府",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "臨安府_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "臨安府_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "臨安府_foe1",
        "name": "西湖浪人悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_臨安府",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 380,
        "atk": 28,
        "def": 12,
        "speed": 44,
        "stats": {
          "arm": 20,
          "speed": 44,
          "bone": 18,
          "inner": 14,
          "int": 20,
          "luck": 15
        },
        "exp": 55,
        "gold": 18,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "臨安府_foe2",
        "name": "西湖浪人頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_臨安府",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 494,
        "atk": 33,
        "def": 14,
        "speed": 48,
        "stats": {
          "arm": 23,
          "speed": 48,
          "bone": 21,
          "inner": 17,
          "int": 20,
          "luck": 15
        },
        "exp": 110,
        "gold": 36,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "福州府": {
    "name": "福州府",
    "sect": "福威鏢局",
    "desc": "三山兩塔，辟邪劍法源起之所。",
    "grid": [
      0,
      -3
    ],
    "exits": {
      "north": "臨安府",
      "south": "泉州府"
    },
    "scenes": [
      {
        "id": "smithy_福州府",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_福州府",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_福州府",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_福州府",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "福州府_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "福州府_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "福州府_foe1",
        "name": "黑道剪徑賊悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_福州府",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "初窺門徑",
        "maxHp": 330,
        "atk": 25,
        "def": 11,
        "speed": 41,
        "stats": {
          "arm": 18,
          "speed": 41,
          "bone": 17,
          "inner": 13,
          "int": 20,
          "luck": 15
        },
        "exp": 48,
        "gold": 16,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "福州府_foe2",
        "name": "黑道剪徑賊頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_福州府",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "初窺門徑",
        "maxHp": 429,
        "atk": 30,
        "def": 13,
        "speed": 45,
        "stats": {
          "arm": 21,
          "speed": 45,
          "bone": 20,
          "inner": 15,
          "int": 20,
          "luck": 15
        },
        "exp": 96,
        "gold": 32,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "泉州府": {
    "name": "泉州府",
    "sect": "刺桐港",
    "desc": "海絲起點，千帆競發。",
    "grid": [
      0,
      -4
    ],
    "exits": {
      "north": "福州府",
      "east": "澎湖灣",
      "south": "潮州府"
    },
    "scenes": [
      {
        "id": "smithy_泉州府",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_泉州府",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_泉州府",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_泉州府",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "泉州府_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "泉州府_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "泉州府_foe1",
        "name": "南洋劫商浪人悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_泉州府",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 420,
        "atk": 31,
        "def": 14,
        "speed": 46,
        "stats": {
          "arm": 22,
          "speed": 46,
          "bone": 21,
          "inner": 16,
          "int": 20,
          "luck": 15
        },
        "exp": 64,
        "gold": 22,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "泉州府_foe2",
        "name": "南洋劫商浪人頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_泉州府",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 546,
        "atk": 37,
        "def": 16,
        "speed": 50,
        "stats": {
          "arm": 26,
          "speed": 50,
          "bone": 24,
          "inner": 19,
          "int": 20,
          "luck": 15
        },
        "exp": 128,
        "gold": 44,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "澎湖灣": {
    "name": "澎湖灣",
    "sect": "跨海要塞",
    "desc": "黑水溝前哨，天后宮庇佑討海俠客。",
    "grid": [
      1,
      -4
    ],
    "exits": {
      "west": "泉州府",
      "east": "福爾摩沙"
    },
    "scenes": [
      {
        "id": "smithy_澎湖灣",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_澎湖灣",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_澎湖灣",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_澎湖灣",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "澎湖灣_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "澎湖灣_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "澎湖灣_foe1",
        "name": "黑水溝劫浪客悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_澎湖灣",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 530,
        "atk": 40,
        "def": 20,
        "speed": 52,
        "stats": {
          "arm": 28,
          "speed": 52,
          "bone": 30,
          "inner": 20,
          "int": 20,
          "luck": 15
        },
        "exp": 90,
        "gold": 34,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "澎湖灣_foe2",
        "name": "黑水溝劫浪客頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_澎湖灣",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 689,
        "atk": 48,
        "def": 24,
        "speed": 56,
        "stats": {
          "arm": 34,
          "speed": 56,
          "bone": 36,
          "inner": 24,
          "int": 20,
          "luck": 15
        },
        "exp": 180,
        "gold": 68,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "福爾摩沙": {
    "name": "福爾摩沙",
    "sect": "祖靈神殿",
    "desc": "高山翠綠，玉山古松祭壇，出產奇門吹箭毒刺。",
    "grid": [
      2,
      -4
    ],
    "exits": {
      "north": "東瀛",
      "west": "澎湖灣"
    },
    "scenes": [
      {
        "id": "sect_zuling",
        "name": "玉山祖靈神壇大殿",
        "type": "sect",
        "desc": "群山環抱之萬年巨木古壇，百步毒蛇環繞，供奉天地自然祖靈，奇門暗器與自然心法無雙。",
        "sectName": "祖靈神殿"
      },
      {
        "id": "smithy_福爾摩沙",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_福爾摩沙",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_福爾摩沙",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_福爾摩沙",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "福爾摩沙_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "福爾摩沙_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "福爾摩沙_foe1",
        "name": "高山毒箭獵首悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_福爾摩沙",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 880,
        "atk": 66,
        "def": 35,
        "speed": 72,
        "stats": {
          "arm": 46,
          "speed": 72,
          "bone": 53,
          "inner": 33,
          "int": 20,
          "luck": 15
        },
        "exp": 190,
        "gold": 75,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "福爾摩沙_foe2",
        "name": "高山毒箭獵首頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_福爾摩沙",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 1144,
        "atk": 79,
        "def": 42,
        "speed": 76,
        "stats": {
          "arm": 55,
          "speed": 76,
          "bone": 63,
          "inner": 40,
          "int": 20,
          "luck": 15
        },
        "exp": 380,
        "gold": 150,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "東瀛": {
    "name": "東瀛",
    "sect": "一刀流",
    "desc": "海外扶桑列島，櫻花飛舞，拔刀術與居合奧義之源。",
    "grid": [
      2,
      -3
    ],
    "exits": {
      "south": "福爾摩沙"
    },
    "scenes": [
      {
        "id": "sect_ittoryu",
        "name": "一刀流本願道場",
        "type": "sect",
        "desc": "木造和風道場，櫻花飄落，居合刀鳴清脆，海外拔刀斬正宗傳承。",
        "sectName": "一刀流"
      },
      {
        "id": "smithy_東瀛",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_東瀛",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_東瀛",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_東瀛",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "東瀛_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "東瀛_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "東瀛_foe1",
        "name": "幕府影武者悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_東瀛",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 890,
        "atk": 68,
        "def": 33,
        "speed": 75,
        "stats": {
          "arm": 48,
          "speed": 75,
          "bone": 50,
          "inner": 34,
          "int": 20,
          "luck": 15
        },
        "exp": 200,
        "gold": 80,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "東瀛_foe2",
        "name": "幕府影武者頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_東瀛",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 1157,
        "atk": 81,
        "def": 39,
        "speed": 79,
        "stats": {
          "arm": 57,
          "speed": 79,
          "bone": 59,
          "inner": 41,
          "int": 20,
          "luck": 15
        },
        "exp": 400,
        "gold": 160,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "潮州府": {
    "name": "潮州府",
    "sect": "潮汕工夫茶",
    "desc": "韓江水長，民風剛毅。",
    "grid": [
      0,
      -5
    ],
    "exits": {
      "north": "泉州府",
      "west": "廣州府"
    },
    "scenes": [
      {
        "id": "smithy_潮州府",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_潮州府",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_潮州府",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_潮州府",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "潮州府_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "潮州府_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "潮州府_foe1",
        "name": "沿海海寇悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_潮州府",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 430,
        "atk": 32,
        "def": 15,
        "speed": 47,
        "stats": {
          "arm": 22,
          "speed": 47,
          "bone": 23,
          "inner": 16,
          "int": 20,
          "luck": 15
        },
        "exp": 66,
        "gold": 24,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "潮州府_foe2",
        "name": "沿海海寇頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_潮州府",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "略有小成",
        "maxHp": 559,
        "atk": 38,
        "def": 18,
        "speed": 51,
        "stats": {
          "arm": 27,
          "speed": 51,
          "bone": 27,
          "inner": 19,
          "int": 20,
          "luck": 15
        },
        "exp": 132,
        "gold": 48,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "廣州府": {
    "name": "廣州府",
    "sect": "五羊名城",
    "desc": "通商總匯，海舶如雲，武風極盛。",
    "grid": [
      -1,
      -5
    ],
    "exits": {
      "west": "佛山鎮",
      "east": "潮州府",
      "south": "香港"
    },
    "scenes": [
      {
        "id": "smithy_廣州府",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_廣州府",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_廣州府",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_廣州府",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "廣州府_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "廣州府_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "廣州府_foe1",
        "name": "南海大盜悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_廣州府",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 510,
        "atk": 38,
        "def": 19,
        "speed": 52,
        "stats": {
          "arm": 27,
          "speed": 52,
          "bone": 29,
          "inner": 19,
          "int": 20,
          "luck": 15
        },
        "exp": 85,
        "gold": 30,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "廣州府_foe2",
        "name": "南海大盜頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_廣州府",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 663,
        "atk": 45,
        "def": 22,
        "speed": 56,
        "stats": {
          "arm": 31,
          "speed": 56,
          "bone": 33,
          "inner": 23,
          "int": 20,
          "luck": 15
        },
        "exp": 170,
        "gold": 60,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "佛山鎮": {
    "name": "佛山鎮",
    "sect": "南拳門總壇",
    "desc": "南派武術發源地，詠春衝拳、虎鶴雙形威震嶺南。",
    "grid": [
      -2,
      -5
    ],
    "exits": {
      "east": "廣州府",
      "south": "澳門"
    },
    "scenes": [
      {
        "id": "sect_nanquan",
        "name": "南拳門演武大廳",
        "type": "sect",
        "desc": "南派拳法正宗，木人樁連排，詠春衝拳與虎鶴雙形名震嶺南。",
        "sectName": "南拳門"
      },
      {
        "id": "smithy_佛山鎮",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_佛山鎮",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_佛山鎮",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_佛山鎮",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "佛山鎮_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "佛山鎮_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "佛山鎮_foe1",
        "name": "南派擂台霸王悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_佛山鎮",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 520,
        "atk": 39,
        "def": 20,
        "speed": 53,
        "stats": {
          "arm": 27,
          "speed": 53,
          "bone": 30,
          "inner": 20,
          "int": 20,
          "luck": 15
        },
        "exp": 88,
        "gold": 32,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "佛山鎮_foe2",
        "name": "南派擂台霸王頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_佛山鎮",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 676,
        "atk": 46,
        "def": 24,
        "speed": 57,
        "stats": {
          "arm": 32,
          "speed": 57,
          "bone": 36,
          "inner": 23,
          "int": 20,
          "luck": 15
        },
        "exp": 176,
        "gold": 64,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "香港": {
    "name": "香港",
    "sect": "詠春八卦門",
    "desc": "香江之畔，街頭武館連排，拳法巧勁絕倫。",
    "grid": [
      -1,
      -6
    ],
    "exits": {
      "north": "廣州府",
      "west": "澳門"
    },
    "scenes": [
      {
        "id": "smithy_香港",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_香港",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_香港",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_香港",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "香港_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "香港_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "香港_foe1",
        "name": "九龍城寨凶徒悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_香港",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 850,
        "atk": 64,
        "def": 34,
        "speed": 68,
        "stats": {
          "arm": 45,
          "speed": 68,
          "bone": 51,
          "inner": 32,
          "int": 20,
          "luck": 15
        },
        "exp": 180,
        "gold": 70,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "香港_foe2",
        "name": "九龍城寨凶徒頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_香港",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 1105,
        "atk": 76,
        "def": 40,
        "speed": 72,
        "stats": {
          "arm": 53,
          "speed": 72,
          "bone": 60,
          "inner": 38,
          "int": 20,
          "luck": 15
        },
        "exp": 360,
        "gold": 140,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "澳門": {
    "name": "澳門",
    "sect": "南沙幫",
    "desc": "濠江水埠，南沙幫短刃分水，威震水寨。",
    "grid": [
      -2,
      -6
    ],
    "exits": {
      "north": "佛山鎮",
      "east": "香港"
    },
    "scenes": [
      {
        "id": "smithy_澳門",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_澳門",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_澳門",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_澳門",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "澳門_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "澳門_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "澳門_foe1",
        "name": "沙街雙刀客悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_澳門",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 840,
        "atk": 63,
        "def": 33,
        "speed": 67,
        "stats": {
          "arm": 44,
          "speed": 67,
          "bone": 50,
          "inner": 32,
          "int": 20,
          "luck": 15
        },
        "exp": 175,
        "gold": 68,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "澳門_foe2",
        "name": "沙街雙刀客頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_澳門",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 1092,
        "atk": 75,
        "def": 39,
        "speed": 71,
        "stats": {
          "arm": 53,
          "speed": 71,
          "bone": 59,
          "inner": 38,
          "int": 20,
          "luck": 15
        },
        "exp": 350,
        "gold": 136,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "襄陽城": {
    "name": "襄陽城",
    "sect": "郭靖大俠坐鎮",
    "desc": "鐵壁銅牆，萬眾一心守禦中原之門戶。",
    "grid": [
      -2,
      4
    ],
    "exits": {
      "west": "武當山",
      "east": "金陵城",
      "south": "重慶府"
    },
    "scenes": [
      {
        "id": "smithy_襄陽城",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_襄陽城",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_襄陽城",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_襄陽城",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "襄陽城_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "襄陽城_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "襄陽城_foe1",
        "name": "塞北凶卒悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_襄陽城",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "融會貫通",
        "maxHp": 650,
        "atk": 48,
        "def": 25,
        "speed": 58,
        "stats": {
          "arm": 34,
          "speed": 58,
          "bone": 38,
          "inner": 24,
          "int": 20,
          "luck": 15
        },
        "exp": 120,
        "gold": 42,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "襄陽城_foe2",
        "name": "塞北凶卒頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_襄陽城",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "融會貫通",
        "maxHp": 845,
        "atk": 57,
        "def": 30,
        "speed": 62,
        "stats": {
          "arm": 40,
          "speed": 62,
          "bone": 45,
          "inner": 29,
          "int": 20,
          "luck": 15
        },
        "exp": 240,
        "gold": 84,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "武當山": {
    "name": "武當山",
    "sect": "道教武當派",
    "desc": "紫霄宮巍峨，太極神功與太極拳名揚四海。",
    "grid": [
      -3,
      4
    ],
    "exits": {
      "west": "漢中府",
      "east": "襄陽城"
    },
    "scenes": [
      {
        "id": "sect_wudang",
        "name": "武當紫霄大殿",
        "type": "sect",
        "desc": "張三丰祖師道場，太極拳劍道法自然。",
        "sectName": "武當派"
      },
      {
        "id": "smithy_武當山",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_武當山",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_武當山",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_武當山",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "武當山_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "武當山_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "武當山_foe1",
        "name": "武當逆徒悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_武當山",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 780,
        "atk": 58,
        "def": 32,
        "speed": 64,
        "stats": {
          "arm": 41,
          "speed": 64,
          "bone": 48,
          "inner": 29,
          "int": 20,
          "luck": 15
        },
        "exp": 150,
        "gold": 55,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "武當山_foe2",
        "name": "武當逆徒頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_武當山",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 1014,
        "atk": 69,
        "def": 38,
        "speed": 68,
        "stats": {
          "arm": 48,
          "speed": 68,
          "bone": 57,
          "inner": 35,
          "int": 20,
          "luck": 15
        },
        "exp": 300,
        "gold": 110,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "重慶府": {
    "name": "重慶府",
    "sect": "蜀中唐門總舵",
    "desc": "巴山夜雨，唐門千機暗器與劇毒名震天下。",
    "grid": [
      -3,
      3
    ],
    "exits": {
      "north": "襄陽城"
    },
    "scenes": [
      {
        "id": "sect_tangmen",
        "name": "唐家堡千機殿",
        "type": "sect",
        "desc": "蜀中唐門總舵，千機盒暗器與劇毒機關森嚴。",
        "sectName": "唐門"
      },
      {
        "id": "smithy_重慶府",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_重慶府",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_重慶府",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_重慶府",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "重慶府_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "重慶府_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "重慶府_foe1",
        "name": "唐門叛客悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_重慶府",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 840,
        "atk": 66,
        "def": 33,
        "speed": 70,
        "stats": {
          "arm": 46,
          "speed": 70,
          "bone": 50,
          "inner": 33,
          "int": 20,
          "luck": 15
        },
        "exp": 180,
        "gold": 70,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "重慶府_foe2",
        "name": "唐門叛客頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_重慶府",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 1092,
        "atk": 79,
        "def": 39,
        "speed": 74,
        "stats": {
          "arm": 55,
          "speed": 74,
          "bone": 59,
          "inner": 40,
          "int": 20,
          "luck": 15
        },
        "exp": 360,
        "gold": 140,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "漢中府": {
    "name": "漢中府",
    "sect": "秦蜀咽喉",
    "desc": "棧道連雲，北接長安南入巴蜀。",
    "grid": [
      -4,
      4
    ],
    "exits": {
      "north": "長安古都",
      "east": "武當山"
    },
    "scenes": [
      {
        "id": "smithy_漢中府",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_漢中府",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_漢中府",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_漢中府",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "漢中府_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "漢中府_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "漢中府_foe1",
        "name": "棧道悍匪悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_漢中府",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "融會貫通",
        "maxHp": 670,
        "atk": 49,
        "def": 26,
        "speed": 58,
        "stats": {
          "arm": 34,
          "speed": 58,
          "bone": 39,
          "inner": 25,
          "int": 20,
          "luck": 15
        },
        "exp": 125,
        "gold": 45,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "漢中府_foe2",
        "name": "棧道悍匪頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_漢中府",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "融會貫通",
        "maxHp": 871,
        "atk": 58,
        "def": 31,
        "speed": 62,
        "stats": {
          "arm": 41,
          "speed": 62,
          "bone": 47,
          "inner": 29,
          "int": 20,
          "luck": 15
        },
        "exp": 250,
        "gold": 90,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "登封鎮": {
    "name": "登封鎮",
    "sect": "少林寺山腳",
    "desc": "嵩山五峰環抱，天下第一古剎少林坐鎮於此。",
    "grid": [
      -1,
      5
    ],
    "exits": {
      "north": "少室山",
      "west": "洛陽城",
      "east": "開封府",
      "south": "金陵城"
    },
    "scenes": [
      {
        "id": "sect_shaolin_entry",
        "name": "少林寺山門迎客堂",
        "type": "sect",
        "desc": "少林接引香客與俗家弟子習武之所。",
        "sectName": "少林寺"
      },
      {
        "id": "smithy_登封鎮",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_登封鎮",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_登封鎮",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_登封鎮",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "登封鎮_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "登封鎮_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "登封鎮_foe1",
        "name": "少室野僧悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_登封鎮",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 510,
        "atk": 38,
        "def": 19,
        "speed": 52,
        "stats": {
          "arm": 27,
          "speed": 52,
          "bone": 29,
          "inner": 19,
          "int": 20,
          "luck": 15
        },
        "exp": 85,
        "gold": 30,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "登封鎮_foe2",
        "name": "少室野僧頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_登封鎮",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 663,
        "atk": 45,
        "def": 22,
        "speed": 56,
        "stats": {
          "arm": 31,
          "speed": 56,
          "bone": 33,
          "inner": 23,
          "int": 20,
          "luck": 15
        },
        "exp": 170,
        "gold": 60,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "少室山": {
    "name": "少室山",
    "sect": "禪宗少林派",
    "desc": "天下武功出少林，大力金剛掌威震八荒。",
    "grid": [
      -1,
      6
    ],
    "exits": {
      "south": "登封鎮"
    },
    "scenes": [
      {
        "id": "sect_shaolin",
        "name": "少林寺大雄寶殿",
        "type": "sect",
        "desc": "禪宗祖庭，少林七十二絕技與大力金剛掌威名赫赫。",
        "sectName": "少林寺"
      },
      {
        "id": "smithy_少室山",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_少室山",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_少室山",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_少室山",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "少室山_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "少室山_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "少室山_foe1",
        "name": "少林破戒僧悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_少室山",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "登峰造極",
        "maxHp": 980,
        "atk": 72,
        "def": 40,
        "speed": 68,
        "stats": {
          "arm": 50,
          "speed": 68,
          "bone": 60,
          "inner": 36,
          "int": 20,
          "luck": 15
        },
        "exp": 220,
        "gold": 80,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "少室山_foe2",
        "name": "少林破戒僧頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_少室山",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "登峰造極",
        "maxHp": 1274,
        "atk": 86,
        "def": 48,
        "speed": 72,
        "stats": {
          "arm": 60,
          "speed": 72,
          "bone": 72,
          "inner": 43,
          "int": 20,
          "luck": 15
        },
        "exp": 440,
        "gold": 160,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "開封府": {
    "name": "開封府",
    "sect": "大梁名城",
    "desc": "鐵塔凌空，繁華熱鬧之古都。",
    "grid": [
      0,
      5
    ],
    "exits": {
      "west": "登封鎮"
    },
    "scenes": [
      {
        "id": "smithy_開封府",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_開封府",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_開封府",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_開封府",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "開封府_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "開封府_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "開封府_foe1",
        "name": "大梁惡霸悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_開封府",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 530,
        "atk": 39,
        "def": 20,
        "speed": 52,
        "stats": {
          "arm": 27,
          "speed": 52,
          "bone": 30,
          "inner": 20,
          "int": 20,
          "luck": 15
        },
        "exp": 90,
        "gold": 32,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "開封府_foe2",
        "name": "大梁惡霸頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_開封府",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 689,
        "atk": 46,
        "def": 24,
        "speed": 56,
        "stats": {
          "arm": 32,
          "speed": 56,
          "bone": 36,
          "inner": 23,
          "int": 20,
          "luck": 15
        },
        "exp": 180,
        "gold": 64,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "洛陽城": {
    "name": "洛陽城",
    "sect": "金刀王府",
    "desc": "中原腹地，金刀無敵王元霸府邸所在。",
    "grid": [
      -2,
      5
    ],
    "exits": {
      "west": "華山險道",
      "east": "登封鎮"
    },
    "scenes": [
      {
        "id": "sect_jindao",
        "name": "洛陽金刀王府",
        "type": "sect",
        "desc": "金刀無敵王元霸府邸，刀勢剛猛大開大合。",
        "sectName": "金刀門"
      },
      {
        "id": "smithy_洛陽城",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_洛陽城",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_洛陽城",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_洛陽城",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "洛陽城_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "洛陽城_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "洛陽城_foe1",
        "name": "綠林巨盜悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_洛陽城",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 850,
        "atk": 64,
        "def": 35,
        "speed": 66,
        "stats": {
          "arm": 45,
          "speed": 66,
          "bone": 53,
          "inner": 32,
          "int": 20,
          "luck": 15
        },
        "exp": 175,
        "gold": 65,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "洛陽城_foe2",
        "name": "綠林巨盜頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_洛陽城",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 1105,
        "atk": 76,
        "def": 42,
        "speed": 70,
        "stats": {
          "arm": 53,
          "speed": 70,
          "bone": 63,
          "inner": 38,
          "int": 20,
          "luck": 15
        },
        "exp": 350,
        "gold": 130,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "華山險道": {
    "name": "華山險道",
    "sect": "五嶽華山派",
    "desc": "奇險天下第一山，岳不群掌門坐鎮。",
    "grid": [
      -3,
      5
    ],
    "exits": {
      "west": "長安古都",
      "east": "洛陽城"
    },
    "scenes": [
      {
        "id": "sect_huashan",
        "name": "華山派正氣堂",
        "type": "sect",
        "desc": "奇險華山，君子劍岳不群傳授正氣劍法。",
        "sectName": "華山派"
      },
      {
        "id": "smithy_華山險道",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_華山險道",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_華山險道",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_華山險道",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "華山險道_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "華山險道_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "華山險道_foe1",
        "name": "華山狂徒悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_華山險道",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 880,
        "atk": 66,
        "def": 36,
        "speed": 68,
        "stats": {
          "arm": 46,
          "speed": 68,
          "bone": 54,
          "inner": 33,
          "int": 20,
          "luck": 15
        },
        "exp": 185,
        "gold": 70,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "華山險道_foe2",
        "name": "華山狂徒頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_華山險道",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "出神入化",
        "maxHp": 1144,
        "atk": 79,
        "def": 43,
        "speed": 72,
        "stats": {
          "arm": 55,
          "speed": 72,
          "bone": 65,
          "inner": 40,
          "int": 20,
          "luck": 15
        },
        "exp": 370,
        "gold": 140,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "長安古都": {
    "name": "長安古都",
    "sect": "十三朝古都",
    "desc": "絲路起點，繁華鼎盛。",
    "grid": [
      -4,
      5
    ],
    "exits": {
      "north": "真定府",
      "east": "華山險道",
      "south": "漢中府"
    },
    "scenes": [
      {
        "id": "smithy_長安古都",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_長安古都",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_長安古都",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_長安古都",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "長安古都_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "長安古都_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "長安古都_foe1",
        "name": "六扇門通緝犯悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_長安古都",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "登峰造極",
        "maxHp": 990,
        "atk": 74,
        "def": 40,
        "speed": 70,
        "stats": {
          "arm": 52,
          "speed": 70,
          "bone": 60,
          "inner": 37,
          "int": 20,
          "luck": 15
        },
        "exp": 225,
        "gold": 82,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "長安古都_foe2",
        "name": "六扇門通緝犯頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_長安古都",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "登峰造極",
        "maxHp": 1287,
        "atk": 88,
        "def": 48,
        "speed": 74,
        "stats": {
          "arm": 62,
          "speed": 74,
          "bone": 72,
          "inner": 44,
          "int": 20,
          "luck": 15
        },
        "exp": 450,
        "gold": 164,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "真定府": {
    "name": "真定府",
    "sect": "北腿宗總堂",
    "desc": "常山古邑，北派十二路譚腿發源地，腿法如疾風驟雨。",
    "grid": [
      -4,
      6
    ],
    "exits": {
      "north": "北京城",
      "south": "長安古都"
    },
    "scenes": [
      {
        "id": "sect_beitui",
        "name": "北腿宗演武堂",
        "type": "sect",
        "desc": "北派腿法祖庭，十二路譚腿與旋風腿凌厲剛猛。",
        "sectName": "北腿宗"
      },
      {
        "id": "smithy_真定府",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_真定府",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_真定府",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_真定府",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "真定府_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "真定府_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "真定府_foe1",
        "name": "常山腿術好手悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_真定府",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "融會貫通",
        "maxHp": 630,
        "atk": 46,
        "def": 24,
        "speed": 56,
        "stats": {
          "arm": 32,
          "speed": 56,
          "bone": 36,
          "inner": 23,
          "int": 20,
          "luck": 15
        },
        "exp": 112,
        "gold": 40,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "真定府_foe2",
        "name": "常山腿術好手頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_真定府",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "融會貫通",
        "maxHp": 819,
        "atk": 55,
        "def": 28,
        "speed": 60,
        "stats": {
          "arm": 39,
          "speed": 60,
          "bone": 42,
          "inner": 28,
          "int": 20,
          "luck": 15
        },
        "exp": 224,
        "gold": 80,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  },
  "北京城": {
    "name": "北京城",
    "sect": "天子之都",
    "desc": "紫禁城宮闕萬重，大內高手聚集。",
    "grid": [
      -4,
      7
    ],
    "exits": {
      "south": "真定府"
    },
    "scenes": [
      {
        "id": "smithy_北京城",
        "name": "城東百煉坊",
        "type": "smithy",
        "desc": "鍛打各色刀劍棍棒、暗器與金絲軟甲。",
        "goods": [
          {
            "item": "item_steel_sword",
            "price": 60
          },
          {
            "item": "item_cold_moon_saber",
            "price": 65
          },
          {
            "item": "item_copper_staff",
            "price": 65
          },
          {
            "item": "item_iron_gauntlet",
            "price": 55
          },
          {
            "item": "item_armor_chain",
            "price": 85
          }
        ]
      },
      {
        "id": "kwoon_北京城",
        "name": "演武大武館",
        "type": "kwoon",
        "desc": "請教外家名宿傳授江湖各派武學。"
      },
      {
        "id": "inn_北京城",
        "name": "悅來客棧",
        "type": "inn",
        "desc": "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。"
      },
      {
        "id": "fight_北京城",
        "name": "荒郊演武擂",
        "type": "field_combat",
        "desc": "江湖宵小與名宿常在此切磋過招。"
      }
    ],
    "npcs": [
      {
        "id": "北京城_npc1",
        "name": "茶攤掌櫃",
        "desc": "",
        "scene": "",
        "dialogues": [
          "少俠這一招氣韻悠長，頗有幾分名家風采！"
        ],
        "attackable": false
      },
      {
        "id": "北京城_npc2",
        "name": "抱劍俠客",
        "desc": "",
        "scene": "",
        "dialogues": [
          "好快的身法，當真令人嘆為觀止！"
        ],
        "attackable": false
      },
      {
        "id": "北京城_foe1",
        "name": "大內侍衛統領悍徒",
        "desc": "在荒郊滋事的江湖宵小。",
        "scene": "fight_北京城",
        "dialogues": [
          "哪來的毛頭小子，識相的就滾！"
        ],
        "attackable": true,
        "realm": "登峰造極",
        "maxHp": 980,
        "atk": 73,
        "def": 40,
        "speed": 69,
        "stats": {
          "arm": 51,
          "speed": 69,
          "bone": 60,
          "inner": 37,
          "int": 20,
          "luck": 15
        },
        "exp": 220,
        "gold": 80,
        "learn": 0,
        "combat": 5,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 15,
            "count": 1
          }
        ]
      },
      {
        "id": "北京城_foe2",
        "name": "大內侍衛統領頭領",
        "desc": "盤踞荒郊、手底頗硬的頭目。",
        "scene": "fight_北京城",
        "dialogues": [
          "想從這裡過去？先問過我手中兵刃！"
        ],
        "attackable": true,
        "realm": "登峰造極",
        "maxHp": 1274,
        "atk": 87,
        "def": 48,
        "speed": 73,
        "stats": {
          "arm": 61,
          "speed": 73,
          "bone": 72,
          "inner": 44,
          "int": 20,
          "luck": 15
        },
        "exp": 440,
        "gold": 160,
        "learn": 0,
        "combat": 10,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 25,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_exp_pill",
            "rate": 8,
            "count": 1
          }
        ]
      }
    ]
  }
};

const SECT_DATABASE = {
  "一刀流": {
    "elderName": "傳功師範 柳生嚴包",
    "leaderName": "居合劍聖 伊東一刀齋",
    "leaderStats": {
      "name": "伊東一刀齋",
      "realm": "登峰造極",
      "stats": {
        "arm": 70,
        "speed": 88,
        "bone": 60,
        "inner": 65,
        "int": 50,
        "luck": 40
      },
      "maxHp": 1750,
      "atk": 98,
      "def": 44,
      "speed": 88,
      "exp": 550,
      "gold": 350,
      "combat": 100
    },
    "skills": [
      {
        "name": "居合疾影拔刀斬",
        "type": "external",
        "weaponReq": "刀",
        "rarity": "凡品",
        "reqStats": {
          "speed": 25,
          "arm": 15
        },
        "reqRank": "外門弟子",
        "costLearn": 40,
        "baseMult": 1.38,
        "desc": "拇指推鞘，電光火石間拔刀出鞘凌空橫斬！"
      },
      {
        "name": "新陰流・燕飛步",
        "type": "qinggong",
        "weaponReq": "任意",
        "rarity": "良品",
        "reqStats": {
          "speed": 45
        },
        "reqRank": "內門弟子",
        "costLearn": 90,
        "baseSpeed": 25,
        "desc": "身如低掠之靈燕，步法縮地無聲，瞬息逼近敵背。"
      },
      {
        "name": "殘月斬鐵心經",
        "type": "internal",
        "weaponReq": "任意",
        "rarity": "上品",
        "reqStats": {
          "inner": 40,
          "arm": 35
        },
        "reqRank": "真傳弟子",
        "costLearn": 180,
        "baseHp": 150,
        "baseDef": 16,
        "desc": "心凝如鏡，蓄勢於氣海，大幅增益外攻殺伐與出招極速。"
      },
      {
        "name": "秘劍・一之太刀",
        "type": "external",
        "weaponReq": "刀",
        "rarity": "神品",
        "reqStats": {
          "arm": 65,
          "speed": 70
        },
        "reqRank": "長老",
        "costLearn": 380,
        "baseMult": 3.25,
        "uniqueVfx": "ittoryu",
        "desc": "心技體合一之居合奧義，雷光一閃之間敵軀兩斷！"
      }
    ]
  },
  "祖靈神殿": {
    "elderName": "傳功大巫祝 鐵木長老",
    "leaderName": "靈尊大祭司 達納法",
    "leaderStats": {
      "name": "達納法大祭司",
      "realm": "登峰造極",
      "stats": {
        "arm": 55,
        "speed": 85,
        "bone": 65,
        "inner": 70,
        "int": 50,
        "luck": 45
      },
      "maxHp": 1720,
      "atk": 93,
      "def": 46,
      "speed": 85,
      "exp": 520,
      "gold": 320,
      "combat": 100
    },
    "skills": [
      {
        "name": "百步獵魂吹箭術",
        "type": "external",
        "weaponReq": "暗器",
        "rarity": "凡品",
        "reqStats": {
          "speed": 20
        },
        "reqRank": "外門弟子",
        "costLearn": 40,
        "baseMult": 1.36,
        "desc": "以竹管疾吐毒刺，取敵要穴，疾速難防！"
      },
      {
        "name": "青藤盤根步",
        "type": "qinggong",
        "weaponReq": "任意",
        "rarity": "良品",
        "reqStats": {
          "speed": 38
        },
        "reqRank": "內門弟子",
        "costLearn": 90,
        "baseSpeed": 24,
        "desc": "身如林中青藤攀附縱躍，高山履險如平地。"
      },
      {
        "name": "神木自然長生心法",
        "type": "internal",
        "weaponReq": "任意",
        "rarity": "上品",
        "reqStats": {
          "inner": 42,
          "bone": 35
        },
        "reqRank": "真傳弟子",
        "costLearn": 180,
        "baseHp": 165,
        "baseDef": 18,
        "desc": "感悟萬年神木呼吸吐納，生機勃發，大幅增益氣血上限與韌性。"
      },
      {
        "name": "祖靈之怒・萬魂獵殺",
        "type": "external",
        "weaponReq": "暗器",
        "rarity": "神品",
        "reqStats": {
          "speed": 75,
          "arm": 40
        },
        "reqRank": "長老",
        "costLearn": 390,
        "baseMult": 3.2,
        "uniqueVfx": "ancestor",
        "desc": "祭祀祖靈之漫天骨刺與毒雨，覆蓋整個戰場，神鬼辟易！"
      }
    ]
  },
  "南拳門": {
    "elderName": "傳功教頭 梁贊師傅",
    "leaderName": "掌門 黃飛鴻傳人",
    "leaderStats": {
      "name": "南拳宗師",
      "realm": "登峰造極",
      "stats": {
        "arm": 65,
        "speed": 75,
        "bone": 70,
        "inner": 60,
        "int": 45,
        "luck": 35
      },
      "maxHp": 1680,
      "atk": 92,
      "def": 50,
      "speed": 75,
      "exp": 500,
      "gold": 300,
      "combat": 100
    },
    "skills": [
      {
        "name": "日字連環衝拳",
        "type": "external",
        "weaponReq": "拳",
        "rarity": "凡品",
        "reqStats": {
          "speed": 20
        },
        "reqRank": "外門弟子",
        "costLearn": 40,
        "baseMult": 1.35,
        "desc": "詠春連環直衝拳，拳出如狂風暴雨！"
      },
      {
        "name": "虎鶴雙形掌",
        "type": "external",
        "weaponReq": "拳",
        "rarity": "良品",
        "reqStats": {
          "arm": 35
        },
        "reqRank": "內門弟子",
        "costLearn": 90,
        "baseMult": 1.75,
        "desc": "剛柔並濟，虎抓開碑，鶴手專取軟穴。"
      },
      {
        "name": "鐵線金剛拳綱",
        "type": "internal",
        "weaponReq": "任意",
        "rarity": "上品",
        "reqStats": {
          "inner": 40
        },
        "reqRank": "真傳弟子",
        "costLearn": 180,
        "baseHp": 155,
        "baseDef": 18,
        "desc": "極大增強雙臂筋骨與護體罡氣。"
      },
      {
        "name": "佛山無影拳",
        "type": "external",
        "weaponReq": "拳",
        "rarity": "絕品",
        "reqStats": {
          "arm": 60,
          "speed": 55
        },
        "reqRank": "長老",
        "costLearn": 340,
        "baseMult": 2.7,
        "desc": "出拳聲東擊西，一息百拳，拳風裂石！"
      }
    ]
  },
  "北腿宗": {
    "elderName": "傳功長老 譚腿老怪",
    "leaderName": "宗主 燕青神腿",
    "leaderStats": {
      "name": "北腿宗主",
      "realm": "登峰造極",
      "stats": {
        "arm": 60,
        "speed": 85,
        "bone": 65,
        "inner": 60,
        "int": 50,
        "luck": 40
      },
      "maxHp": 1650,
      "atk": 90,
      "def": 48,
      "speed": 85,
      "exp": 500,
      "gold": 300,
      "combat": 100
    },
    "skills": [
      {
        "name": "十二路譚腿",
        "type": "external",
        "weaponReq": "拳",
        "rarity": "凡品",
        "reqStats": {
          "speed": 25
        },
        "reqRank": "外門弟子",
        "costLearn": 40,
        "baseMult": 1.38,
        "desc": "腿法起處神鬼莫測，專打下盤！"
      },
      {
        "name": "鐵掃帚狂風腿",
        "type": "external",
        "weaponReq": "拳",
        "rarity": "良品",
        "reqStats": {
          "speed": 42
        },
        "reqRank": "內門弟子",
        "costLearn": 90,
        "baseMult": 1.7,
        "desc": "身旋貼地狂掃，宛如狂飆捲地！"
      },
      {
        "name": "登萍度水身法",
        "type": "qinggong",
        "weaponReq": "任意",
        "rarity": "上品",
        "reqStats": {
          "speed": 50
        },
        "reqRank": "真傳弟子",
        "costLearn": 180,
        "baseSpeed": 32,
        "desc": "足尖在水浪上踏雪奔行，身形神駿。"
      },
      {
        "name": "北派幽冥旋風腿",
        "type": "external",
        "weaponReq": "拳",
        "rarity": "絕品",
        "reqStats": {
          "speed": 65,
          "arm": 45
        },
        "reqRank": "長老",
        "costLearn": 330,
        "baseMult": 2.65,
        "desc": "凌空七連踢，腿影遮天蔽日！"
      }
    ]
  },
  "唐門": {
    "elderName": "傳功長老 唐大先生",
    "leaderName": "門主 唐老太君",
    "leaderStats": {
      "name": "唐老太君",
      "realm": "登峰造極",
      "stats": {
        "arm": 50,
        "speed": 82,
        "bone": 60,
        "inner": 65,
        "int": 50,
        "luck": 40
      },
      "maxHp": 1700,
      "atk": 92,
      "def": 42,
      "speed": 82,
      "exp": 500,
      "gold": 300,
      "combat": 100
    },
    "skills": [
      {
        "name": "漫天花雨手法",
        "type": "external",
        "weaponReq": "暗器",
        "rarity": "良品",
        "reqStats": {
          "speed": 35
        },
        "reqRank": "外門弟子",
        "costLearn": 60,
        "baseMult": 1.7,
        "desc": "揮袖化針，漫天細雨！"
      },
      {
        "name": "萬毒枯榮心經",
        "type": "internal",
        "weaponReq": "任意",
        "rarity": "上品",
        "reqStats": {
          "inner": 40,
          "bone": 30
        },
        "reqRank": "真傳弟子",
        "costLearn": 180,
        "baseHp": 150,
        "baseDef": 16,
        "desc": "唐門避毒養氣至寶心訣。"
      },
      {
        "name": "暴雨梨花針",
        "type": "external",
        "weaponReq": "暗器",
        "rarity": "神品",
        "reqStats": {
          "speed": 65,
          "arm": 35
        },
        "reqRank": "長老",
        "costLearn": 380,
        "baseMult": 3.15,
        "desc": "二十七枚淬毒銀針齊發，神鬼難逃！"
      }
    ]
  },
  "華山派": {
    "elderName": "傳功長老 封不平",
    "leaderName": "掌門 岳不群",
    "leaderStats": {
      "name": "岳不群",
      "realm": "登峰造極",
      "stats": {
        "arm": 65,
        "speed": 75,
        "bone": 55,
        "inner": 60,
        "int": 50,
        "luck": 30
      },
      "maxHp": 1600,
      "atk": 90,
      "def": 45,
      "speed": 75,
      "exp": 500,
      "gold": 200,
      "combat": 100
    },
    "skills": [
      {
        "name": "狂風快劍",
        "type": "external",
        "weaponReq": "劍",
        "rarity": "良品",
        "reqStats": {
          "speed": 45,
          "arm": 20
        },
        "reqRank": "外門弟子",
        "costLearn": 90,
        "baseMult": 1.75,
        "desc": "一劍快似一劍如暴風驟雨。"
      },
      {
        "name": "奪命連環三仙劍",
        "type": "external",
        "weaponReq": "劍",
        "rarity": "絕品",
        "reqStats": {
          "speed": 65,
          "arm": 40
        },
        "reqRank": "長老",
        "costLearn": 320,
        "baseMult": 2.65,
        "desc": "一劍化三仙，狠辣絕倫！"
      }
    ]
  },
  "金刀門": {
    "elderName": "傳功教頭 王伯奮",
    "leaderName": "門主 王元霸",
    "leaderStats": {
      "name": "王元霸",
      "realm": "登峰造極",
      "stats": {
        "arm": 85,
        "speed": 65,
        "bone": 65,
        "inner": 50,
        "int": 30,
        "luck": 35
      },
      "maxHp": 1650,
      "atk": 92,
      "def": 48,
      "speed": 66,
      "exp": 500,
      "gold": 300,
      "combat": 100
    },
    "skills": [
      {
        "name": "八卦六合刀",
        "type": "external",
        "weaponReq": "刀",
        "rarity": "良品",
        "reqStats": {
          "arm": 30
        },
        "reqRank": "外門弟子",
        "costLearn": 50,
        "baseMult": 1.6,
        "desc": "剛猛八卦刀路。"
      },
      {
        "name": "金刀八式・斬乾坤",
        "type": "external",
        "weaponReq": "刀",
        "rarity": "絕品",
        "reqStats": {
          "arm": 60,
          "speed": 45
        },
        "reqRank": "長老",
        "costLearn": 320,
        "baseMult": 2.6,
        "desc": "黃金厚刃怒斬而下，山崩地裂！"
      }
    ]
  },
  "少林寺": {
    "elderName": "達摩院首座 玄苦大師",
    "leaderName": "方丈 玄慈大師",
    "leaderStats": {
      "name": "玄慈方丈",
      "realm": "登峰造極",
      "stats": {
        "arm": 75,
        "speed": 65,
        "bone": 80,
        "inner": 75,
        "int": 50,
        "luck": 40
      },
      "maxHp": 1850,
      "atk": 95,
      "def": 55,
      "speed": 68,
      "exp": 500,
      "gold": 300,
      "combat": 100
    },
    "skills": [
      {
        "name": "太祖長拳",
        "type": "external",
        "weaponReq": "拳",
        "rarity": "凡品",
        "reqStats": {
          "arm": 15
        },
        "reqRank": "外門弟子",
        "costLearn": 40,
        "baseMult": 1.15,
        "desc": "少林基礎拳法。"
      },
      {
        "name": "大力金剛掌",
        "type": "external",
        "weaponReq": "拳",
        "rarity": "上品",
        "reqStats": {
          "arm": 45,
          "bone": 40
        },
        "reqRank": "真傳弟子",
        "costLearn": 180,
        "baseMult": 2.1,
        "desc": "至剛至陽，掌力催山倒海！"
      }
    ]
  },
  "武當派": {
    "elderName": "傳功大弟子 宋遠橋",
    "leaderName": "宗師 張三丰",
    "leaderStats": {
      "name": "張三丰",
      "realm": "返璞歸真",
      "stats": {
        "arm": 70,
        "speed": 80,
        "bone": 85,
        "inner": 90,
        "int": 60,
        "luck": 45
      },
      "maxHp": 2100,
      "atk": 105,
      "def": 60,
      "speed": 80,
      "exp": 600,
      "gold": 350,
      "combat": 120
    },
    "skills": [
      {
        "name": "武當太極長拳",
        "type": "external",
        "weaponReq": "拳",
        "rarity": "上品",
        "reqStats": {
          "inner": 40,
          "bone": 35
        },
        "reqRank": "真傳弟子",
        "costLearn": 180,
        "baseMult": 2.05,
        "desc": "借力打力，以柔克剛。"
      }
    ]
  }
};

window.SECT_RANKS = SECT_RANKS;
window.WORLD_MAP = WORLD_MAP;
window.SECT_DATABASE = SECT_DATABASE;
