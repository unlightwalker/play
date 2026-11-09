/**
 * ========================================================
 * 你的江湖 - 歷練通天塔首領資料庫 (data_tower.js)
 * 本檔為純資料檔，可由《萬象天機後台》editor.html 直接讀寫。
 *
 * TOWER_BOSSES：每 5 層一位首領（未列出的首領層由 tower.js 依公式自動生成）
 *   chest  : 首領寶箱 { entries: [...] }，擊敗首領時依各項機率（rate %，總和 100）開出其中一項：
 *            { kind: "pool", rarity: 品階 }       隨機一件該品階的裝備 / 靈藥（不含材料與 noChest 物品）
 *            { kind: "item", ref: 物品id, count }  指定物品
 *            { kind: "book", ref: 武學id }         指定武學秘笈
 *            { kind: "gold", min, max }            銀兩（min ~ max 隨機）
 *   drops  : 首領掉落 [{ kind: "item"|"book", ref: 物品id|武學id, rate: 掉落率%, count }]
 *            通天塔的武學秘笈只會從這裡掉落，需要掉落武學時請在此加入 kind: "book"
 * ========================================================
 */

const TOWER_BOSSES = [
  {
    "floor": 5,
    "name": "第 5 層首領・「黑風寨主」閻老七",
    "realm": "初窺門徑",
    "desc": "盤踞黑風嶺十餘年的山大王，一把鬼頭刀砍翻過無數官兵，被請進塔中守第一道關。",
    "maxHp": 317,
    "atk": 24,
    "def": 11,
    "speed": 37,
    "stats": {
      "arm": 16,
      "speed": 37,
      "bone": 16,
      "inner": 14,
      "int": 30,
      "luck": 25
    },
    "exp": 18,
    "gold": 8,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "黑風斷魂刀",
      "baseMult": 1.4,
      "rarity": "凡品"
    },
    "internalName": "粗淺吐納法",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 22.5
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 67.5
        },
        {
          "kind": "gold",
          "min": 40,
          "max": 100,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "小子，進了這塔還想活著出去？",
        "黑風寨的規矩：過路的，留下買路錢——還有命！"
      ],
      "hurt": [
        "喲呵，有點門道！",
        "他娘的，這一下夠勁！"
      ],
      "lowHp": [
        "不、不可能……老子縱橫黑風嶺十幾年！"
      ],
      "skill": [
        "黑風起——斷你魂！",
        "吃老子一記斷魂刀！"
      ],
      "win": [
        "呸，回家種田去吧！"
      ],
      "lose": [
        "你……你比官兵還狠……上面的人，可沒我這麼好說話……"
      ]
    },
    "sect": "",
    "grid": [
      2,
      4
    ],
    "exits": {
      "west": "鎮江府",
      "east": "東瀛"
    },
    "scenes": [
      {
        "id": "smithy_錢塘關",
        "name": "軍械所",
        "type": "smithy",
        "desc": "鍛打狼筅、長槍、鏜鈀等戚家軍制式長兵與精甲。",
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
          },
          {
            "item": "mat_iron",
            "price": 10
          },
          {
            "item": "mat_wood",
            "price": 8
          },
          {
            "item": "mat_hide",
            "price": 8
          },
          {
            "item": "mat_steel",
            "price": 48
          }
        ]
      },
      {
        "id": "pharmacy_錢塘關",
        "name": "屯田藥局",
        "type": "pharmacy",
        "desc": "備有金創要藥與行軍散，供官兵與過往俠士療傷健體。",
        "goods": [
          {
            "item": "item_small_powder",
            "price": 10
          },
          {
            "item": "item_big_pill",
            "price": 25
          },
          {
            "item": "item_meridian_pill",
            "price": 45
          },
          {
            "item": "item_exp_pill",
            "price": 35
          },
          {
            "item": "herb_licorice",
            "price": 5
          },
          {
            "item": "herb_ginseng",
            "price": 36
          },
          {
            "item": "herb_snakegall",
            "price": 30
          }
        ]
      },
      {
        "id": "kwoon_錢塘關",
        "name": "演武廳",
        "type": "kwoon",
        "desc": "戚家軍演練陣法、切磋武藝之所。"
      },
      {
        "id": "inn_錢塘關",
        "name": "安民客棧",
        "type": "inn",
        "desc": "供將士歇息調養、聽聞海防軍情之處。"
      },
      {
        "id": "fight_錢塘關",
        "name": "海防古道",
        "type": "field_combat",
        "desc": "通往東瀛海岸的荒涼古道，常有上岸滋事的倭寇與浪人。"
      }
    ],
    "npcs": [
      {
        "id": "錢塘關_npc1",
        "name": "戚家軍老兵",
        "desc": "身經百戰的老卒，身上滿是刀疤。",
        "scene": "",
        "dialogues": [
          "跟著大帥（戚繼光）南征北討，嶮惡陣仗見得多了。",
          "東瀛倭寇最擅長使刀偷襲，遇上了千萬別跟他單打獨鬥。",
          "咱們戚家軍講究的是嚴整軍紀與鴛鴦陣配合。",
          "聽說最近東岸那頭又不穩當，大帥正調兵遣將呢。",
          "老夫這條命早就交給朝廷與百姓了。",
          "少俠若要出海迎敵，得先掂量掂量自己的身手。"
        ],
        "attackable": false,
        "reactWin": [
          "好身手！有乃父之風！",
          "痛快！這才是我大明好男兒！",
          "陣仗打得漂亮，老夫佩服。",
          "這武藝，上陣殺敵絕對是一把好手。",
          "虎父無犬子，好樣的！"
        ],
        "reactLose": [
          "兵法有云知己知彼，勝敗乃常事。",
          "回去多練幾手再跟倭寇拼命。",
          "留得青山在，不怕沒柴燒。",
          "戰陣無情，少俠切莫逞強。",
          "好生休養，日後再雪恥。"
        ]
      },
      {
        "id": "錢塘關_npc2",
        "name": "屯田軍官",
        "desc": "負責錢塘關軍械與糧草調度的中級武官。",
        "scene": "",
        "dialogues": [
          "兵馬未動，糧草先行，這錢塘關的防務半點馬虎不得。",
          "大帥治軍極嚴，違令者斬，從不講情面。",
          "城內的軍械所剛打造了一批新狼筅，你要看看嗎？",
          "東南沿海的平定，全靠全軍將士用命。",
          "沒事別在軍營附近晃悠，當心被當成奸細抓起來。"
        ],
        "attackable": false,
        "reactWin": [
          "好身手！有乃父之風！",
          "痛快！這才是我大明好男兒！",
          "陣仗打得漂亮，老夫佩服。",
          "這武藝，上陣殺敵絕對是一把好手。",
          "虎父無犬子，好樣的！"
        ],
        "reactLose": [
          "兵法有云知己知彼，勝敗乃常事。",
          "回去多練幾手再跟倭寇拼命。",
          "留得青山在，不怕沒柴燒。",
          "戰陣無情，少俠切莫逞強。",
          "好生休養，日後再雪恥。"
        ]
      },
      {
        "id": "錢塘關_npc3",
        "name": "沿海漁民",
        "desc": "靠海吃海的尋常百姓，對倭寇恨之入骨。",
        "scene": "",
        "dialogues": [
          "多虧了戚大帥派兵駐守，我們才能安穩打漁。",
          "前些日子海面上漂來不少浮木，聽說是海寇的船碎了。",
          "少俠若去海防古道，可得小心那幫殺人不眨眼的倭賊。",
          "我家的船剛補好，等風浪小些就要出海。",
          "唉，倭亂一日不平，百姓一日難安啊。"
        ],
        "attackable": false,
        "reactWin": [
          "好身手！有乃父之風！",
          "痛快！這才是我大明好男兒！",
          "陣仗打得漂亮，老夫佩服。",
          "這武藝，上陣殺敵絕對是一把好手。",
          "虎父無犬子，好樣的！"
        ],
        "reactLose": [
          "兵法有云知己知彼，勝敗乃常事。",
          "回去多練幾手再跟倭寇拼命。",
          "留得青山在，不怕沒柴燒。",
          "戰陣無情，少俠切莫逞強。",
          "好生休養，日後再雪恥。"
        ]
      },
      {
        "id": "錢塘關_npc4",
        "name": "軍械匠師",
        "desc": "專為戚家軍打造狼筅與長刀的能工巧匠。",
        "scene": "smithy_錢塘關",
        "dialogues": [
          "戚大帥對兵器要求極高，長短搭配，方能克敵制勝。",
          "這柄長刀融入了百鍊精鋼，專破倭寇的武士刀。",
          "狼筅上滿是倒鉤鐵刺，最適合叢林與海灘混戰。",
          "鐵錘落下一千次，才能出得了這一口好刃。",
          "軍務緊急，莫要在此閒聊，耽誤了打造進度。"
        ],
        "attackable": false,
        "reactWin": [
          "好身手！有乃父之風！",
          "痛快！這才是我大明好男兒！",
          "陣仗打得漂亮，老夫佩服。",
          "這武藝，上陣殺敵絕對是一把好手。",
          "虎父無犬子，好樣的！"
        ],
        "reactLose": [
          "兵法有云知己知彼，勝敗乃常事。",
          "回去多練幾手再跟倭寇拼命。",
          "留得青山在，不怕沒柴燒。",
          "戰陣無情，少俠切莫逞強。",
          "好生休養，日後再雪恥。"
        ]
      },
      {
        "id": "錢塘關_npc5",
        "name": "軍醫",
        "desc": "隨軍行醫的大夫，精通金創跌打。",
        "scene": "pharmacy_錢塘關",
        "dialogues": [
          "將士們保家衛國，老夫這身醫術自然是用在刀刃上。",
          "行軍散與金創藥每隊皆需配備，臨陣負傷才可保命。",
          "刀劍無眼，少俠若要上陣，身上多備幾包創藥不吃虧。",
          "這味防風草是從山那頭採來的，最治風寒濕痺。",
          "傷筋動骨一百天，敷了老夫的藥，三日便能下床。"
        ],
        "attackable": false,
        "reactWin": [
          "好身手！有乃父之風！",
          "痛快！這才是我大明好男兒！",
          "陣仗打得漂亮，老夫佩服。",
          "這武藝，上陣殺敵絕對是一把好手。",
          "虎父無犬子，好樣的！"
        ],
        "reactLose": [
          "兵法有云知己知彼，勝敗乃常事。",
          "回去多練幾手再跟倭寇拼命。",
          "留得青山在，不怕沒柴燒。",
          "戰陣無情，少俠切莫逞強。",
          "好生休養，日後再雪恥。"
        ]
      },
      {
        "id": "錢塘關_npc6",
        "name": "戚繼光",
        "desc": "字元敬，號南塘，明代抗倭名將、傑出的軍事家，威震東南。",
        "scene": "kwoon_錢塘關",
        "dialogues": [
          "封侯非我意，但願海波平。這東南沿海一日不清，吾等一日不敢卸甲。",
          "聞道少俠心懷俠義，可願入我麾下，共抗外侮？",
          "敵軍雖兇，若用「鴛鴦陣」法，長短相救，敵雖千騎亦奈何不得。",
          "兵者詭道，然治軍以誠，方能令行禁止。",
          "閣下若能通過本帥的考驗，這部《紀效新書》便贈予你又何妨。"
        ],
        "attackable": true,
        "realm": "登峰造極",
        "maxHp": 2500,
        "atk": 180,
        "def": 120,
        "speed": 140,
        "stats": {
          "arm": 90,
          "speed": 85,
          "bone": 95,
          "inner": 88,
          "int": 92,
          "luck": 80
        },
        "exp": 800,
        "gold": 200,
        "learn": 150,
        "combat": 30,
        "skill": null,
        "internalName": "",
        "battleLines": {
          "start": [
            "讓本帥瞧瞧閣下的真本事！",
            "兵不厭詐，小心了！"
          ],
          "hurt": [
            "好一記妙招！",
            "痛快，不愧是江湖豪傑！"
          ],
          "lowHp": [
            "陣形雖變，軍魂不散！"
          ],
          "skill": [
            "此乃血戰心法——陣圖開合！"
          ],
          "win": [
            "陣法之道，博大精深，閣下還需苦練。"
          ],
          "lose": [
            "英雄出少年，大明有你，實乃之福！"
          ]
        },
        "drops": [
          {
            "kind": "item",
            "ref": "item_steel_sword",
            "rate": 100,
            "count": 1
          }
        ]
      },
      {
        "id": "錢塘關_foe1",
        "name": "東瀛浪人",
        "desc": "流竄沿海的東瀛武士，兇狠殘暴。",
        "scene": "fight_錢塘關",
        "dialogues": [
          "八格牙路！交出財寶！",
          "我的太刀已經很久沒飲血了。",
          "明國的軍隊？哼，不堪一擊！",
          "不想死的，統統跪下！",
          "哈哈哈哈，殺光你們！"
        ],
        "battleLines": {
          "start": [
            "死吧！明國人！",
            "居合斬，出鞘！"
          ],
          "hurt": [
            "八路……好痛！",
            "你竟然能擋住我的刀？"
          ],
          "lowHp": [
            "撤退！快撤！"
          ],
          "skill": [
            "一刀流・燕返！"
          ],
          "win": [
            "弱者，沒有活著的權利。"
          ],
          "lose": [
            "八格……我恨啊！"
          ]
        },
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 520,
        "atk": 42,
        "def": 20,
        "speed": 58,
        "stats": {
          "arm": 28,
          "speed": 58,
          "bone": 28,
          "inner": 20,
          "int": 22,
          "luck": 15
        },
        "exp": 95,
        "gold": 32,
        "learn": 0,
        "combat": 6,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_small_powder",
            "rate": 20,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "mat_steel",
            "rate": 10,
            "count": 1
          }
        ]
      },
      {
        "id": "錢塘關_foe2",
        "name": "倭寇頭目",
        "desc": "盤據海防古道的倭寇頭領，武藝陰狠毒辣。",
        "scene": "fight_錢塘關",
        "dialogues": [
          "八嘎！竟敢阻攔我們的大業！",
          "小的們，把這不知死活的中原人剁成肉泥！",
          "我的雙刀流，可是死在無數高手血泊中的！",
          "想要通關？從我的屍體上踏過去！",
          "殺一個夠本，殺兩個賺了！"
        ],
        "battleLines": {
          "start": [
            "今天就是你的忌日！",
            "受死吧！"
          ],
          "hurt": [
            "納尼？！好強的力道！",
            "可惡……別小看我！"
          ],
          "lowHp": [
            "八格牙路……我跟你拼了！"
          ],
          "skill": [
            "奧義・十字斬！"
          ],
          "win": [
            "不堪一擊的東亞病夫！"
          ],
          "lose": [
            "我不甘心……大帥饒命……"
          ]
        },
        "attackable": true,
        "realm": "駕輕就熟",
        "maxHp": 680,
        "atk": 52,
        "def": 26,
        "speed": 62,
        "stats": {
          "arm": 36,
          "speed": 62,
          "bone": 38,
          "inner": 26,
          "int": 24,
          "luck": 18
        },
        "exp": 120,
        "gold": 45,
        "learn": 0,
        "combat": 12,
        "skill": null,
        "internalName": "",
        "drops": [
          {
            "kind": "item",
            "ref": "item_cold_moon_saber",
            "rate": 15,
            "count": 1
          },
          {
            "kind": "item",
            "ref": "item_big_pill",
            "rate": 25,
            "count": 1
          }
        ]
      }
    ]
  },
  {
    "floor": 10,
    "name": "第 10 層首領・「鐵臂惡僧」悟嗔",
    "realm": "初窺門徑",
    "desc": "少林棄徒，因犯殺戒被逐出山門。一雙鐵臂練得刀槍不入，自稱「以殺止殺」。",
    "maxHp": 433,
    "atk": 31,
    "def": 15,
    "speed": 42,
    "stats": {
      "arm": 21,
      "speed": 42,
      "bone": 22,
      "inner": 18,
      "int": 30,
      "luck": 25
    },
    "exp": 25,
    "gold": 12,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "伏魔金剛掌",
      "baseMult": 1.4,
      "rarity": "凡品"
    },
    "internalName": "金剛鐵布衫",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 27
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 63
        },
        {
          "kind": "gold",
          "min": 80,
          "max": 200,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "阿彌陀佛，施主殺氣太重，貧僧替你超度。",
        "貧僧這雙手，專打不服之人。"
      ],
      "hurt": [
        "好硬的拳頭……正合貧僧心意！",
        "罪過罪過，貧僧要動真格了。"
      ],
      "lowHp": [
        "佛祖……弟子嗔念未消……還不能倒！"
      ],
      "skill": [
        "伏魔金剛掌——給我跪下！",
        "看貧僧金剛一掌！"
      ],
      "win": [
        "回頭是岸，施主請回。"
      ],
      "lose": [
        "善哉……原來執迷的人，是我。"
      ]
    }
  },
  {
    "floor": 15,
    "name": "第 15 層首領・「毒手藥王」祝無常",
    "realm": "初窺門徑",
    "desc": "曾是一方名醫，為求長生以活人試藥，被江湖人稱「毒手藥王」。袖中藏針，針針見骨。",
    "maxHp": 579,
    "atk": 38,
    "def": 19,
    "speed": 47,
    "stats": {
      "arm": 26,
      "speed": 47,
      "bone": 28,
      "inner": 22,
      "int": 30,
      "luck": 25
    },
    "exp": 32,
    "gold": 16,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "腐骨百毒針",
      "baseMult": 1.4,
      "rarity": "凡品"
    },
    "internalName": "萬毒枯榮心經",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 31.5
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 58.5
        },
        {
          "kind": "gold",
          "min": 120,
          "max": 300,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "來得正好，老夫新配的毒，還缺個試藥的人。",
        "別緊張，針上的毒……只會讓你痛上七天七夜。"
      ],
      "hurt": [
        "嘖，壞了老夫一身好衣裳。",
        "有趣，你的血……竟能抗毒？"
      ],
      "lowHp": [
        "解藥……老夫的解藥呢……"
      ],
      "skill": [
        "腐骨百毒針——中者三日骨化！",
        "看針！"
      ],
      "win": [
        "脈象虛浮，經脈已毒入膏肓。下一位。"
      ],
      "lose": [
        "老夫一生醫人無數……卻醫不好自己的貪心……"
      ]
    }
  },
  {
    "floor": 20,
    "name": "第 20 層首領・「血刀老怪」寧不歸",
    "realm": "融會貫通",
    "desc": "血刀門最後的傳人，刀刃常年以人血淬煉，揮刀時腥風撲面。據說他已三十年未曾下山。",
    "maxHp": 750,
    "atk": 46,
    "def": 23,
    "speed": 52,
    "stats": {
      "arm": 32,
      "speed": 52,
      "bone": 34,
      "inner": 27,
      "int": 30,
      "luck": 25
    },
    "exp": 40,
    "gold": 20,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "血刀劈山訣",
      "baseMult": 1.7,
      "rarity": "良品"
    },
    "internalName": "血河魔功",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 1.8
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 30.87
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 57.33
        },
        {
          "kind": "gold",
          "min": 160,
          "max": 400,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "嘿嘿嘿，又有新鮮的血來喂我的刀了。",
        "我的刀，已經餓了很久。"
      ],
      "hurt": [
        "好！好！你的血一定很香！",
        "傷我？我的刀會記住你。"
      ],
      "lowHp": [
        "血……我的血……也喂給刀吧！"
      ],
      "skill": [
        "血刀劈山——開！",
        "這一刀，連山都能劈開！"
      ],
      "win": [
        "刀飽了，你可以走了——爬著走。"
      ],
      "lose": [
        "三十年……原來外面……已經有你這樣的人……"
      ]
    }
  },
  {
    "floor": 25,
    "name": "第 25 層首領・「玉面狐」柳拂衣",
    "realm": "融會貫通",
    "desc": "看似溫婉的女子，實為江湖上惡名昭彰的採花賊之首。一襲白衣，花瓣過處，必有人死。",
    "maxHp": 941,
    "atk": 54,
    "def": 27,
    "speed": 57,
    "stats": {
      "arm": 37,
      "speed": 57,
      "bone": 40,
      "inner": 32,
      "int": 30,
      "luck": 25
    },
    "exp": 48,
    "gold": 24,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "漫天飛花劫",
      "baseMult": 1.7,
      "rarity": "良品"
    },
    "internalName": "天魅迷心訣",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 2.7
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 32.74
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 54.56
        },
        {
          "kind": "gold",
          "min": 200,
          "max": 500,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "好俊的少俠，奴家捨不得殺你呢……才怪。",
        "別看我的眼睛，否則你會忘了怎麼出招。"
      ],
      "hurt": [
        "你……竟捨得傷我？",
        "粗魯！"
      ],
      "lowHp": [
        "我的臉……你敢傷我的臉！"
      ],
      "skill": [
        "花開花落——飛花劫！",
        "瞧，多美的花雨……"
      ],
      "win": [
        "真可惜，又一朵花謝了。"
      ],
      "lose": [
        "原來……真有人看得穿我的迷心訣……"
      ]
    }
  },
  {
    "floor": 30,
    "name": "第 30 層首領・「斷腸劍客」葉孤鴻",
    "realm": "融會貫通",
    "desc": "曾是名門大弟子，因愛人被害而心死，從此出劍只求快、只求斷人肝腸。",
    "maxHp": 1151,
    "atk": 62,
    "def": 31,
    "speed": 62,
    "stats": {
      "arm": 43,
      "speed": 62,
      "bone": 46,
      "inner": 37,
      "int": 30,
      "luck": 25
    },
    "exp": 55,
    "gold": 28,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "斷腸快劍",
      "baseMult": 1.7,
      "rarity": "良品"
    },
    "internalName": "冷月心經",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 3.6
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 34.56
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 51.84
        },
        {
          "kind": "gold",
          "min": 240,
          "max": 600,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "拔劍吧。我不殺手無寸鐵之人。",
        "我的劍很快，快到你來不及後悔。"
      ],
      "hurt": [
        "……好劍法。可惜，不夠快。",
        "你的劍，有心。"
      ],
      "lowHp": [
        "她死的那天……也下著這樣的雨……"
      ],
      "skill": [
        "斷腸快劍——一劍斷腸！",
        "看清楚，這是最後一劍。"
      ],
      "win": [
        "回去吧。劍心不定，練多少年都是枉然。"
      ],
      "lose": [
        "終於……有人比我快了……我可以去找她了……"
      ]
    }
  },
  {
    "floor": 35,
    "name": "第 35 層首領・「赤練仙子」李寒煙",
    "realm": "融會貫通",
    "desc": "苗疆五毒教叛出的聖女，豢養赤練毒蛇，鏢上淬蛇毒，見血封喉。",
    "maxHp": 1376,
    "atk": 70,
    "def": 35,
    "speed": 67,
    "stats": {
      "arm": 49,
      "speed": 67,
      "bone": 52,
      "inner": 42,
      "int": 30,
      "luck": 25
    },
    "exp": 63,
    "gold": 32,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "赤練蛇影鏢",
      "baseMult": 1.7,
      "rarity": "良品"
    },
    "internalName": "五毒神功",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 4.5
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 36.34
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 49.16
        },
        {
          "kind": "gold",
          "min": 280,
          "max": 700,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "我的小蛇兒們，已經聞到你的味道了。",
        "跪下求我，或許能留你全屍。"
      ],
      "hurt": [
        "你敢傷我？我的蛇不會放過你！",
        "嘶——你激怒我了。"
      ],
      "lowHp": [
        "蛇兒們……替我咬死他！"
      ],
      "skill": [
        "赤練蛇影鏢——去吧！",
        "看看是你快，還是我的蛇快！"
      ],
      "win": [
        "蛇毒入心，你撐不過今晚。"
      ],
      "lose": [
        "五毒教……再也回不去了……"
      ]
    }
  },
  {
    "floor": 40,
    "name": "第 40 層首領・「千面鬼手」司空離",
    "realm": "登峰造極",
    "desc": "易容術天下無雙的神偷，沒人見過他的真面目。出拳時身影化作千百殘像，讓人防不勝防。",
    "maxHp": 1617,
    "atk": 78,
    "def": 39,
    "speed": 72,
    "stats": {
      "arm": 54,
      "speed": 72,
      "bone": 58,
      "inner": 46,
      "int": 30,
      "luck": 25
    },
    "exp": 70,
    "gold": 36,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "鬼影無影拳",
      "baseMult": 2.2,
      "rarity": "神品"
    },
    "internalName": "移形換影功",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 4.5
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 38.07
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 46.53
        },
        {
          "kind": "gold",
          "min": 320,
          "max": 800,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "猜猜看，哪一個才是真的我？",
        "你身上的東西……我全都要了。"
      ],
      "hurt": [
        "打中了？那只是個影子罷了。",
        "嘖，竟看穿了我的步法。"
      ],
      "lowHp": [
        "這張臉……這張臉也被你打破了……"
      ],
      "skill": [
        "鬼影無影拳——千手千影！",
        "看得見我的拳嗎？"
      ],
      "win": [
        "多謝少俠的錢袋。"
      ],
      "lose": [
        "真正的我……是什麼樣子……連我自己都忘了……"
      ]
    }
  },
  {
    "floor": 45,
    "name": "第 45 層首領・「狂刀」霍天狼",
    "realm": "登峰造極",
    "desc": "塞外狼族出身的刀客，一對八斬刀如狼牙撕咬，越戰越狂，傷越重刀越快。",
    "maxHp": 1872,
    "atk": 87,
    "def": 43,
    "speed": 77,
    "stats": {
      "arm": 60,
      "speed": 77,
      "bone": 64,
      "inner": 52,
      "int": 30,
      "luck": 25
    },
    "exp": 78,
    "gold": 40,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "狼牙八斬刀",
      "baseMult": 2.2,
      "rarity": "神品"
    },
    "internalName": "狂血戰意",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 5.58
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 38.67
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 44.49
        },
        {
          "kind": "gold",
          "min": 360,
          "max": 900,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "嗷——！草原的狼，從不退縮！",
        "讓我聞聞你的恐懼！"
      ],
      "hurt": [
        "痛！好痛快！再來！",
        "血的味道……讓我更興奮了！"
      ],
      "lowHp": [
        "狼……就算剩最後一口氣……也要咬斷你的喉嚨！"
      ],
      "skill": [
        "狼牙八斬——撕碎你！",
        "八刀！八刀都要見血！"
      ],
      "win": [
        "弱小的獵物，只配被吃掉。"
      ],
      "lose": [
        "好……你是頭狼……"
      ]
    }
  },
  {
    "floor": 50,
    "name": "第 50 層首領・「赤血魔皇」厲天行",
    "realm": "登峰造極",
    "desc": "魔教前任教主，以血魔大法吸人精血，所過之處血浪滔天。通天塔半山的鎮關魔頭。",
    "maxHp": 2139,
    "atk": 95,
    "def": 47,
    "speed": 82,
    "stats": {
      "arm": 66,
      "speed": 82,
      "bone": 70,
      "inner": 57,
      "int": 30,
      "luck": 25
    },
    "exp": 85,
    "gold": 44,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "赤血滔天浪",
      "baseMult": 2.2,
      "rarity": "神品"
    },
    "internalName": "血魔大法",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 6.75
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 39.23
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 42.49
        },
        {
          "kind": "gold",
          "min": 400,
          "max": 1000,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "哈哈哈！本座在此等了百年，你是第幾個？",
        "跪下，本座賜你一個痛快的死法。"
      ],
      "hurt": [
        "區區螻蟻，也敢傷本座！",
        "血……本座的血……你該死！"
      ],
      "lowHp": [
        "以血還血——本座不會倒下！"
      ],
      "skill": [
        "赤血滔天——給本座跪下！",
        "血浪翻天，萬物俱滅！"
      ],
      "win": [
        "弱者，就該被吞噬。"
      ],
      "lose": [
        "咳……想不到……本座竟敗於你手……魔教……完了……"
      ]
    }
  },
  {
    "floor": 55,
    "name": "第 55 層首領・「幽冥鬼王」冥九淵",
    "realm": "返璞歸真",
    "desc": "據說曾死過一次又從墳中爬出的怪人，周身纏繞紫色鬼火，腿法陰狠詭譎。",
    "maxHp": 2419,
    "atk": 104,
    "def": 51,
    "speed": 87,
    "stats": {
      "arm": 72,
      "speed": 87,
      "bone": 76,
      "inner": 62,
      "int": 30,
      "luck": 25
    },
    "exp": 93,
    "gold": 48,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "幽冥鬼焰腿",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "九幽陰風訣",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 7.92
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 39.74
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 40.54
        },
        {
          "kind": "gold",
          "min": 440,
          "max": 1100,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "活人……好久沒見到活人了……",
        "陪我……一起下九幽吧……"
      ],
      "hurt": [
        "痛？我早就忘了痛是什麼。",
        "嘻嘻……你的陽氣真旺……"
      ],
      "lowHp": [
        "又要死了嗎……沒關係……我會再爬回來的……"
      ],
      "skill": [
        "幽冥鬼焰——焚盡你的魂魄！",
        "鬼火纏身，永世不得超生！"
      ],
      "win": [
        "你的魂……歸我了。"
      ],
      "lose": [
        "終於……可以安息了……"
      ]
    }
  },
  {
    "floor": 60,
    "name": "第 60 層首領・「天魔劍」獨孤殤",
    "realm": "返璞歸真",
    "desc": "一人一劍挑戰天下名門，殺盡十三派掌門的劍魔。劍分三式，一式殺一人。",
    "maxHp": 2711,
    "atk": 112,
    "def": 55,
    "speed": 92,
    "stats": {
      "arm": 78,
      "speed": 92,
      "bone": 82,
      "inner": 67,
      "int": 30,
      "luck": 25
    },
    "exp": 100,
    "gold": 52,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "天魔三仙劍",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "天魔解體大法",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 9
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 40.21
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 38.63
        },
        {
          "kind": "gold",
          "min": 480,
          "max": 1200,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "我只出三劍。你能接住，就讓你過去。",
        "天下劍客，皆是我劍下亡魂。"
      ],
      "hurt": [
        "第一劍，你接住了。",
        "有意思……你值得我用全力。"
      ],
      "lowHp": [
        "天魔解體——我還有最後一劍！"
      ],
      "skill": [
        "天魔三仙——三劍奪命！",
        "看劍——一劍化三！"
      ],
      "win": [
        "三劍都接不住，回去吧。"
      ],
      "lose": [
        "三劍……全被你破了……好！好！"
      ]
    }
  },
  {
    "floor": 65,
    "name": "第 65 層首領・「北冥龍君」敖滄",
    "realm": "返璞歸真",
    "desc": "自稱北海龍王轉世的狂人，掌力如蛟龍出海，以北冥真氣吸人內力化為己用。",
    "maxHp": 3014,
    "atk": 121,
    "def": 60,
    "speed": 92,
    "stats": {
      "arm": 84,
      "speed": 92,
      "bone": 90,
      "inner": 72,
      "int": 30,
      "luck": 25
    },
    "exp": 108,
    "gold": 56,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "北冥降龍掌",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "北冥真氣",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 10.08
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 40.63
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 36.77
        },
        {
          "kind": "gold",
          "min": 520,
          "max": 1300,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "凡人，見了龍君，還不下跪？",
        "你的內力……本君收下了。"
      ],
      "hurt": [
        "區區凡人，竟能傷及龍鱗！",
        "你的掌力……竟能撼動本君！"
      ],
      "lowHp": [
        "龍……是不會死的……北冥之水，給我回來！"
      ],
      "skill": [
        "北冥降龍——蛟龍出海！",
        "龍吟九天，萬掌歸一！"
      ],
      "win": [
        "你的內力，本君笑納了。"
      ],
      "lose": [
        "龍……也有失水的一天……"
      ]
    }
  },
  {
    "floor": 70,
    "name": "第 70 層首領・「無影神指」燕無蹤",
    "realm": "返璞歸真",
    "desc": "輕功絕頂的刺客，來去無影，一指點出，穴道盡封、魂魄離體。江湖上無人見過他出手第二次。",
    "maxHp": 3328,
    "atk": 130,
    "def": 64,
    "speed": 92,
    "stats": {
      "arm": 91,
      "speed": 92,
      "bone": 96,
      "inner": 78,
      "int": 30,
      "luck": 25
    },
    "exp": 115,
    "gold": 60,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "無影奪魂指",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "凌虛御風功",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 11.25
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 41.02
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 34.94
        },
        {
          "kind": "gold",
          "min": 560,
          "max": 1400,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "見過我出手的人，都已經不在了。",
        "別眨眼——眨一下，你就死了。"
      ],
      "hurt": [
        "你……看得見我？",
        "不可能，你怎能跟上我的身法！"
      ],
      "lowHp": [
        "我……也會被人追上嗎……"
      ],
      "skill": [
        "無影奪魂指——點你死穴！",
        "這一指，奪你魂魄！"
      ],
      "win": [
        "你甚至沒看到我出手。"
      ],
      "lose": [
        "原來……被人看清的感覺……是這樣……"
      ]
    }
  },
  {
    "floor": 75,
    "name": "第 75 層首領・「血衣羅剎」紅蓮",
    "realm": "返璞歸真",
    "desc": "一身血衣的女魔頭，修練紅蓮業火，所殺之人皆被燒成灰燼，只留一朵焦黑的紅蓮。",
    "maxHp": 3652,
    "atk": 139,
    "def": 68,
    "speed": 92,
    "stats": {
      "arm": 97,
      "speed": 92,
      "bone": 102,
      "inner": 83,
      "int": 30,
      "luck": 25
    },
    "exp": 123,
    "gold": 64,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "羅剎焚心焰",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "紅蓮業火功",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 12.42
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 41.31
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 33.12
        },
        {
          "kind": "gold",
          "min": 600,
          "max": 1500,
          "rate": 50
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "業火焚身，你的罪孽，由我來燒乾淨。",
        "又一朵紅蓮，要開了。"
      ],
      "hurt": [
        "你的血……也是紅色的呢。",
        "痛……很好，業火燒得更旺了！"
      ],
      "lowHp": [
        "業火……反噬了嗎……不！再燒旺一點！"
      ],
      "skill": [
        "羅剎焚心——紅蓮業火！",
        "燒吧！把一切都燒成灰！"
      ],
      "win": [
        "灰燼裡，又多了一朵紅蓮。"
      ],
      "lose": [
        "火……終於熄了……好冷……"
      ]
    }
  },
  {
    "floor": 80,
    "name": "第 80 層首領・「太陰魔尼」寂滅師太",
    "realm": "返璞歸真",
    "desc": "峨眉叛尼，將太極陰陽之理逆練，以陰制陽、以柔吞剛，掌力所至，寒冰刺骨。",
    "maxHp": 3985,
    "atk": 148,
    "def": 72,
    "speed": 92,
    "stats": {
      "arm": 103,
      "speed": 92,
      "bone": 108,
      "inner": 88,
      "int": 30,
      "luck": 25
    },
    "exp": 130,
    "gold": 68,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "逆轉太極掌",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "太陰玄冰功",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 13.5
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 41.66
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 31.42
        },
        {
          "kind": "gold",
          "min": 640,
          "max": 1600,
          "rate": 50
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "陰陽顛倒，乾坤逆轉。施主，你的命數到了。",
        "貧尼修的是寂滅道，送你寂滅。"
      ],
      "hurt": [
        "陽氣過盛……正好讓貧尼吸收。",
        "嗯？你竟能破我陰柔之勁？"
      ],
      "lowHp": [
        "陰極……陽生……不……不該是這樣……"
      ],
      "skill": [
        "逆轉太極——陰陽倒懸！",
        "太陰之寒，凍你三魂七魄！"
      ],
      "win": [
        "寂滅，方是解脫。"
      ],
      "lose": [
        "原來……陰陽本不可逆……是貧尼……錯了……"
      ]
    }
  },
  {
    "floor": 85,
    "name": "第 85 層首領・「東瀛鬼丸」鬼丸斬月",
    "realm": "返璞歸真",
    "desc": "渡海而來的東瀛劍鬼，自稱一刀流叛徒。刀不出鞘則已，出鞘必斬斷目之所及的一切。",
    "maxHp": 4329,
    "atk": 157,
    "def": 76,
    "speed": 92,
    "stats": {
      "arm": 109,
      "speed": 92,
      "bone": 114,
      "inner": 94,
      "int": 30,
      "luck": 25
    },
    "exp": 138,
    "gold": 72,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "鬼丸居合斬",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "無念無想",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 14.58
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 41.91
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 29.73
        },
        {
          "kind": "gold",
          "min": 680,
          "max": 1700,
          "rate": 50
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "……拔刀之前，先告訴我你的名字。",
        "我的刀，只斬值得一斬之人。"
      ],
      "hurt": [
        "……不錯。",
        "你的刀意，很純粹。"
      ],
      "lowHp": [
        "無念……無想……"
      ],
      "skill": [
        "居合——鬼丸斬月！",
        "一閃。"
      ],
      "win": [
        "……不值一斬。"
      ],
      "lose": [
        "好刀……能敗在你手下，是我的榮幸……"
      ]
    }
  },
  {
    "floor": 90,
    "name": "第 90 層首領・「萬蠱天尊」烏骨",
    "realm": "返璞歸真",
    "desc": "苗疆深山裡的蠱神，以身飼萬蠱，體內蠱蟲化針射出，一針一蠱，穿心而過。",
    "maxHp": 4681,
    "atk": 166,
    "def": 81,
    "speed": 92,
    "stats": {
      "arm": 116,
      "speed": 92,
      "bone": 121,
      "inner": 99,
      "int": 30,
      "luck": 25
    },
    "exp": 145,
    "gold": 76,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "萬蠱穿心針",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "蠱神金身",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 15.75
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 42.12
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 28.08
        },
        {
          "kind": "gold",
          "min": 720,
          "max": 1800,
          "rate": 50
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "我的孩子們……餓了很久了……",
        "你的身體，很適合養蠱。"
      ],
      "hurt": [
        "傷了我，蠱就會從傷口爬出來哦。",
        "嘻嘻……你殺不死我體內的萬蠱。"
      ],
      "lowHp": [
        "孩子們……出來……吃了他……"
      ],
      "skill": [
        "萬蠱穿心——一針一蠱！",
        "去吧，鑽進他的心！"
      ],
      "win": [
        "從今天起，你就是我的蠱巢了。"
      ],
      "lose": [
        "蠱……都死了……我也……"
      ]
    }
  },
  {
    "floor": 95,
    "name": "第 95 層首領・「地藏魔佛」無相",
    "realm": "返璞歸真",
    "desc": "一念成佛、一念成魔的苦行僧，坐關百年悟出無相魔功，掌下眾生平等——皆是死。",
    "maxHp": 5043,
    "atk": 175,
    "def": 85,
    "speed": 92,
    "stats": {
      "arm": 122,
      "speed": 92,
      "bone": 127,
      "inner": 105,
      "int": 30,
      "luck": 25
    },
    "exp": 153,
    "gold": 80,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "大悲無相魔佛掌",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "無相般若功",
    "chest": {
      "entries": [
        {
          "kind": "pool",
          "rarity": "絕品",
          "rate": 16.92
        },
        {
          "kind": "pool",
          "rarity": "上品",
          "rate": 41.2
        },
        {
          "kind": "pool",
          "rarity": "良品",
          "rate": 27.47
        },
        {
          "kind": "gold",
          "min": 760,
          "max": 1900,
          "rate": 40
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "眾生皆苦，貧僧渡你。",
        "地獄不空，誓不成佛——那就讓我把地獄填滿。"
      ],
      "hurt": [
        "痛，亦是修行。",
        "你的掌中……有佛性。"
      ],
      "lowHp": [
        "佛也好……魔也好……都是虛妄……"
      ],
      "skill": [
        "大悲無相——魔佛一掌！",
        "萬法皆空，掌下無生！"
      ],
      "win": [
        "阿彌陀佛。又渡一人。"
      ],
      "lose": [
        "原來……放下屠刀……是這種感覺……"
      ]
    }
  },
  {
    "floor": 100,
    "name": "第 100 層首領・桃花島主",
    "realm": "返璞歸真",
    "desc": "桃花島主，落英繽紛中傲視天下的奇才。其人博古通今，琴棋書畫無一不精，武學更是自成一派，超凡入聖。",
    "maxHp": 5413,
    "atk": 184,
    "def": 89,
    "speed": 92,
    "stats": {
      "arm": 128,
      "speed": 92,
      "bone": 133,
      "inner": 110,
      "int": 30,
      "luck": 25
    },
    "exp": 160,
    "gold": 84,
    "learn": 0,
    "combat": 1,
    "skill": {
      "name": "彈指神通",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "碧海潮生功",
    "chest": {
      "entries": [
        {
          "rate": 100,
          "kind": "book",
          "ref": "kf_tanzhi"
        }
      ]
    },
    "drops": [],
    "battleLines": {
      "start": [
        "桃花影落飛神劍，碧海潮生按玉簫。閣下擅闖桃花島，莫非自恃武功高強？",
        "世人皆道我行事離經叛道，今日倒要看看閣下有何能耐！"
      ],
      "hurt": [
        "好小子，這一招倒有幾分氣象。",
        "哼，老夫倒是輕敵了。"
      ],
      "lowHp": [
        "碧海潮生，氣涌心頭……好個後生輩！"
      ],
      "skill": [
        "彈指間，灰飛煙滅！吃我一記彈指神通！",
        "落英繽紛，神劍出鞘——給我破！"
      ],
      "win": [
        "形如枯槁，心如止水。閣下還多練幾年再來吧。"
      ],
      "lose": [
        "哈哈哈哈！後生可畏，天下竟有如此劍法……老夫輸得心服口服。"
      ]
    }
  }
];

window.TOWER_BOSSES = TOWER_BOSSES;

/**
 * TOWER_REWARD_CONFIG：通天塔一般樓層的成長曲線（可在 editor.html「通天塔首領」分頁調整）
 *   怪物氣血 = mobHp.base + mobHp.mul × 樓層^mobHp.pow
 *   每隻修為 = exp.base + exp.mul × 樓層^exp.pow；銀兩同理（gold）
 *   學點：每隻有 learn.chanceBase + learn.chancePerFloor × 樓層 %（上限 chanceMax）機率獲得 1 + floor(樓層 / floorsPerExtra) 點
 *   bossRewardMult：首領若未在 TOWER_BOSSES 指定修為 / 銀兩，以「該層一般怪 × 倍數」計算
 *   background：離開通天塔時的背景歷練，每 intervalSec 秒結算一隻，收益為一般的 ratio 倍
 *   clickCooldownMs：手動狂擊的最短間隔（避免連點過快）
 */
const TOWER_REWARD_CONFIG = {
  "mobHp": {
    "base": 80,
    "mul": 14,
    "pow": 1.6
  },
  "exp": {
    "base": 8,
    "mul": 2.2,
    "pow": 0.85
  },
  "gold": {
    "base": 3,
    "mul": 0.9,
    "pow": 0.8
  },
  "learn": {
    "chanceBase": 20,
    "chancePerFloor": 0.4,
    "chanceMax": 60,
    "floorsPerExtra": 25
  },
  "bossRewardMult": 12,
  "background": {
    "intervalSec": 10,
    "ratio": 0.5
  },
  "clickCooldownMs": 120
};
window.TOWER_REWARD_CONFIG = TOWER_REWARD_CONFIG;
