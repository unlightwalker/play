/**
 * ========================================================
 * 你的江湖 - 奇遇事件資料 (data_encounters.js)
 * 由 encounters.js 執行；可在 editor.html「✨ 奇遇」分頁製作與編輯
 * trigger.type：enter 抵達地點 / talk 與人物交談 / scene 進入場景 / meditate 打坐 /
 *               battle_win 戰鬥勝利 / battle_lose 戰鬥落敗 / craft 製作成功 / rest 醫館療傷
 * steps：劇情段落；choices 為選項（可帶條件、屬性判定、結果），沒有選項時顯示結果後結束
 * ========================================================
 */

const GLOBAL_ENCOUNTERS = [
  {
    "id": "enc_cave",
    "name": "山洞奇緣",
    "enabled": true,
    "note": "範例：移動時機率觸發，含屬性判定的選項。",
    "trigger": {
      "type": "enter",
      "chance": 3,
      "locs": []
    },
    "once": true,
    "cooldown": 0,
    "conditions": [],
    "start": "s1",
    "steps": [
      {
        "id": "s1",
        "speaker": "",
        "text": "趕路途中天降大雨，你躲進山壁旁一個幽深的洞穴。火光映照下，洞壁上似乎刻著密密麻麻的小人圖形……",
        "results": [],
        "choices": [
          {
            "text": "湊近細看石壁",
            "check": {
              "stat": "int",
              "value": 28,
              "rate": 0
            },
            "next": "s2",
            "failNext": "s3",
            "results": [],
            "conditions": []
          },
          {
            "text": "往洞穴深處探索",
            "check": {
              "stat": "luck",
              "value": 20,
              "rate": 0
            },
            "next": "s4",
            "failNext": "s5",
            "results": [],
            "conditions": []
          },
          {
            "text": "等雨停了就離開",
            "next": "",
            "results": [
              {
                "type": "message",
                "text": "雨停之後，你繼續上路。"
              }
            ],
            "conditions": [],
            "check": {
              "stat": "",
              "value": 0,
              "rate": 0
            }
          }
        ]
      },
      {
        "id": "s2",
        "speaker": "",
        "text": "你心神沉浸於圖形之中，竟看出是一套拳法的運勁法門！",
        "results": [
          {
            "type": "book",
            "ref": "虎鶴雙形掌"
          },
          {
            "type": "learn",
            "value": 30
          }
        ],
        "choices": []
      },
      {
        "id": "s3",
        "speaker": "",
        "text": "圖形看得你頭昏腦脹，一無所獲。",
        "results": [
          {
            "type": "hp",
            "value": -20
          }
        ],
        "choices": []
      },
      {
        "id": "s4",
        "speaker": "",
        "text": "洞穴深處有一具枯骨，身旁放著一個布包。",
        "results": [
          {
            "type": "gold",
            "value": 120
          },
          {
            "type": "item",
            "ref": "mat_cold_iron",
            "count": 1
          }
        ],
        "choices": []
      },
      {
        "id": "s5",
        "speaker": "",
        "text": "黑暗中你一腳踩空，摔得鼻青臉腫。",
        "results": [
          {
            "type": "hp",
            "value": -60
          }
        ],
        "choices": []
      }
    ]
  },
  {
    "id": "enc_beggar",
    "name": "老乞丐討食",
    "enabled": true,
    "note": "範例：與牛家村的抱劍俠客交談時觸發，需支付銀兩，並設定旗標。",
    "trigger": {
      "type": "talk",
      "chance": 30,
      "npc": "牛家村_npc2",
      "locs": [
        "牛家村"
      ]
    },
    "once": true,
    "cooldown": 0,
    "conditions": [
      {
        "type": "gold_gte",
        "value": 10
      }
    ],
    "start": "s1",
    "steps": [
      {
        "id": "s1",
        "speaker": "老乞丐",
        "text": "一個衣衫襤褸的老乞丐拉住你的衣角：「少俠，賞口飯吃吧……」抱劍俠客在一旁冷眼旁觀。",
        "results": [],
        "choices": [
          {
            "text": "給他 10 兩銀子",
            "next": "s2",
            "results": [
              {
                "type": "gold",
                "value": -10
              }
            ]
          },
          {
            "text": "揮手趕走他",
            "next": "s3",
            "results": []
          }
        ]
      },
      {
        "id": "s2",
        "speaker": "老乞丐",
        "text": "「好娃兒，心地不壞。」老乞丐在你肩頭一拍，一股暖流竄入經脈。等你回神，他已不見蹤影。",
        "results": [
          {
            "type": "stat",
            "key": "luck",
            "value": 2
          },
          {
            "type": "flag",
            "key": "met_beggar"
          }
        ],
        "choices": []
      },
      {
        "id": "s3",
        "speaker": "抱劍俠客",
        "text": "抱劍俠客搖了搖頭：「狗眼看人低。」",
        "results": [],
        "choices": []
      }
    ]
  },
  {
    "id": "enc_meditate",
    "name": "靜坐頓悟",
    "enabled": true,
    "note": "範例：打坐時觸發，需悟性 30 以上，每 60 分鐘最多一次。",
    "trigger": {
      "type": "meditate",
      "chance": 1,
      "locs": []
    },
    "once": false,
    "cooldown": 60,
    "conditions": [
      {
        "type": "stat_gte",
        "key": "int",
        "value": 30
      }
    ],
    "start": "s1",
    "steps": [
      {
        "id": "s1",
        "speaker": "",
        "text": "內息運轉一周天後，你忽覺靈台一片清明，往日想不通的武學關竅豁然開朗。",
        "results": [
          {
            "type": "exp",
            "value": 15000
          },
          {
            "type": "learn",
            "value": 200
          }
        ],
        "choices": []
      }
    ]
  },
  {
    "id": "enc_bandit",
    "name": "攔路劫匪",
    "enabled": true,
    "note": "範例：移動時觸發戰鬥，勝負導向不同結局。",
    "trigger": {
      "type": "enter",
      "chance": 2,
      "locs": []
    },
    "once": false,
    "cooldown": 30,
    "conditions": [],
    "start": "s1",
    "steps": [
      {
        "id": "s1",
        "speaker": "劫匪頭子",
        "text": "「此山是我開，此樹是我栽！要想從此過，留下買路財！」幾名蒙面劫匪擋住了去路。",
        "results": [],
        "choices": [
          {
            "text": "拔刀迎戰",
            "next": "",
            "results": [
              {
                "type": "battle",
                "enemy": {
                  "name": "蒙面劫匪頭子",
                  "realm": "略有小成",
                  "maxHp": 420,
                  "atk": 38,
                  "def": 14,
                  "speed": 45,
                  "exp": 80,
                  "gold": 40
                },
                "winNext": "s2",
                "loseNext": "s3"
              }
            ]
          },
          {
            "text": "破財消災（30 兩）",
            "conditions": [
              {
                "type": "gold_gte",
                "value": 30
              }
            ],
            "next": "s4",
            "results": [
              {
                "type": "gold",
                "value": -30
              }
            ]
          }
        ]
      },
      {
        "id": "s2",
        "speaker": "",
        "text": "劫匪們抱頭鼠竄，慌亂中丟下了一個錢袋。",
        "results": [
          {
            "type": "gold",
            "value": 60
          },
          {
            "type": "item",
            "ref": "mat_steel",
            "count": 2
          }
        ],
        "choices": []
      },
      {
        "id": "s3",
        "speaker": "劫匪頭子",
        "text": "「哼，不自量力！」劫匪搜走了你身上的一些銀兩。",
        "results": [
          {
            "type": "gold",
            "value": -20
          }
        ],
        "choices": []
      },
      {
        "id": "s4",
        "speaker": "劫匪頭子",
        "text": "「算你識相！」劫匪們讓開了路。",
        "results": [],
        "choices": []
      }
    ]
  },
  {
    "id": "enc_smith",
    "name": "鑄劍師的考驗",
    "enabled": true,
    "note": "範例：鍛造成功後觸發。",
    "trigger": {
      "type": "craft",
      "chance": 15,
      "skill": "forge",
      "locs": []
    },
    "once": true,
    "cooldown": 0,
    "conditions": [],
    "start": "s1",
    "steps": [
      {
        "id": "s1",
        "speaker": "雲遊鑄劍師",
        "text": "一位白髮老者在旁看你鍛打許久，忽然開口：「火候還差三分。來，老夫教你一手。」",
        "results": [
          {
            "type": "craft_exp",
            "key": "forge",
            "value": 120
          },
          {
            "type": "item",
            "ref": "mat_cold_iron",
            "count": 2
          }
        ],
        "choices": []
      }
    ]
  }
];

window.GLOBAL_ENCOUNTERS = GLOBAL_ENCOUNTERS;
