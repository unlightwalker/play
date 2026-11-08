/**
 * ========================================================
 * 你的江湖 - 歷練通天塔首領資料庫 (data_tower.js)
 * 本檔為純資料檔，可由《萬象天機後台》editor.html 直接讀寫。
 *
 * TOWER_BOSSES：每 5 層一位首領（未列出的首領層由 tower.js 依公式自動生成）
 *   chest  : 首領寶箱品階機率 godRate(神品%) / supremeRate(絕品%) /
 *            upperRate(其餘機率中為上品的%) / bookRate(開出秘笈而非裝備的%)
 *   drops  : 額外指定掉落 [{ kind: "item"|"book", ref: 物品id|武學id, rate: 掉落率%, count }]
 * ========================================================
 */

const TOWER_BOSSES = [
  {
    "floor": 5,
    "name": "第 5 層首領・試煉惡僧",
    "realm": "初窺門徑",
    "desc": "鎮守通天塔第 5 層之無上高手，實力深不可測。",
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
    "exp": 175,
    "gold": 80,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "太祖長拳",
      "baseMult": 1.4,
      "rarity": "凡品"
    },
    "internalName": "自然吐納訣",
    "chest": {
      "godRate": 0,
      "supremeRate": 0,
      "upperRate": 32.5,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 10,
    "name": "第 10 層首領・試煉惡僧",
    "realm": "初窺門徑",
    "desc": "鎮守通天塔第 10 層之無上高手，實力深不可測。",
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
    "exp": 250,
    "gold": 120,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "太祖長拳",
      "baseMult": 1.4,
      "rarity": "凡品"
    },
    "internalName": "自然吐納訣",
    "chest": {
      "godRate": 0,
      "supremeRate": 0,
      "upperRate": 40.0,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 15,
    "name": "第 15 層首領・試煉惡僧",
    "realm": "初窺門徑",
    "desc": "鎮守通天塔第 15 層之無上高手，實力深不可測。",
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
    "exp": 325,
    "gold": 160,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "太祖長拳",
      "baseMult": 1.4,
      "rarity": "凡品"
    },
    "internalName": "自然吐納訣",
    "chest": {
      "godRate": 0,
      "supremeRate": 0,
      "upperRate": 47.5,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 20,
    "name": "第 20 層首領・奪命劍煞",
    "realm": "融會貫通",
    "desc": "鎮守通天塔第 20 層之無上高手，實力深不可測。",
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
    "exp": 400,
    "gold": 200,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "狂風快劍",
      "baseMult": 1.7,
      "rarity": "良品"
    },
    "internalName": "金剛鐵布衫",
    "chest": {
      "godRate": 0,
      "supremeRate": 0,
      "upperRate": 55.0,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 25,
    "name": "第 25 層首領・奪命劍煞",
    "realm": "融會貫通",
    "desc": "鎮守通天塔第 25 層之無上高手，實力深不可測。",
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
    "exp": 475,
    "gold": 240,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "狂風快劍",
      "baseMult": 1.7,
      "rarity": "良品"
    },
    "internalName": "金剛鐵布衫",
    "chest": {
      "godRate": 0,
      "supremeRate": 0,
      "upperRate": 62.5,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 30,
    "name": "第 30 層首領・奪命劍煞",
    "realm": "融會貫通",
    "desc": "鎮守通天塔第 30 層之無上高手，實力深不可測。",
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
    "exp": 550,
    "gold": 280,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "狂風快劍",
      "baseMult": 1.7,
      "rarity": "良品"
    },
    "internalName": "金剛鐵布衫",
    "chest": {
      "godRate": 0,
      "supremeRate": 0,
      "upperRate": 70.0,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 35,
    "name": "第 35 層首領・奪命劍煞",
    "realm": "融會貫通",
    "desc": "鎮守通天塔第 35 層之無上高手，實力深不可測。",
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
    "exp": 625,
    "gold": 320,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "狂風快劍",
      "baseMult": 1.7,
      "rarity": "良品"
    },
    "internalName": "金剛鐵布衫",
    "chest": {
      "godRate": 0,
      "supremeRate": 0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 40,
    "name": "第 40 層首領・赤血魔皇",
    "realm": "登峰造極",
    "desc": "鎮守通天塔第 40 層之無上高手，實力深不可測。",
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
    "exp": 700,
    "gold": 360,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "秘劍・一之太刀",
      "baseMult": 2.2,
      "rarity": "神品"
    },
    "internalName": "萬毒枯榮心經",
    "chest": {
      "godRate": 8.0,
      "supremeRate": 80.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 45,
    "name": "第 45 層首領・赤血魔皇",
    "realm": "登峰造極",
    "desc": "鎮守通天塔第 45 層之無上高手，實力深不可測。",
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
    "exp": 775,
    "gold": 400,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "秘劍・一之太刀",
      "baseMult": 2.2,
      "rarity": "神品"
    },
    "internalName": "萬毒枯榮心經",
    "chest": {
      "godRate": 9.0,
      "supremeRate": 90.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 50,
    "name": "第 50 層首領・赤血魔皇",
    "realm": "登峰造極",
    "desc": "鎮守通天塔第 50 層之無上高手，實力深不可測。",
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
    "exp": 850,
    "gold": 440,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "秘劍・一之太刀",
      "baseMult": 2.2,
      "rarity": "神品"
    },
    "internalName": "萬毒枯榮心經",
    "chest": {
      "godRate": 10.0,
      "supremeRate": 90.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 55,
    "name": "第 55 層首領・混沌天尊",
    "realm": "返璞歸真",
    "desc": "鎮守通天塔第 55 層之無上高手，實力深不可測。",
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
    "exp": 925,
    "gold": 480,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "降龍十八掌・亢龍有悔",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "純陽太極功",
    "chest": {
      "godRate": 11.0,
      "supremeRate": 89.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 60,
    "name": "第 60 層首領・混沌天尊",
    "realm": "返璞歸真",
    "desc": "鎮守通天塔第 60 層之無上高手，實力深不可測。",
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
    "exp": 1000,
    "gold": 520,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "降龍十八掌・亢龍有悔",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "純陽太極功",
    "chest": {
      "godRate": 12.0,
      "supremeRate": 88.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 65,
    "name": "第 65 層首領・混沌天尊",
    "realm": "返璞歸真",
    "desc": "鎮守通天塔第 65 層之無上高手，實力深不可測。",
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
    "exp": 1075,
    "gold": 560,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "降龍十八掌・亢龍有悔",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "純陽太極功",
    "chest": {
      "godRate": 13.0,
      "supremeRate": 87.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 70,
    "name": "第 70 層首領・混沌天尊",
    "realm": "返璞歸真",
    "desc": "鎮守通天塔第 70 層之無上高手，實力深不可測。",
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
    "exp": 1150,
    "gold": 600,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "降龍十八掌・亢龍有悔",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "純陽太極功",
    "chest": {
      "godRate": 14.0,
      "supremeRate": 86.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 75,
    "name": "第 75 層首領・混沌天尊",
    "realm": "返璞歸真",
    "desc": "鎮守通天塔第 75 層之無上高手，實力深不可測。",
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
    "exp": 1225,
    "gold": 640,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "降龍十八掌・亢龍有悔",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "純陽太極功",
    "chest": {
      "godRate": 15.0,
      "supremeRate": 85.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 80,
    "name": "第 80 層首領・混沌天尊",
    "realm": "返璞歸真",
    "desc": "鎮守通天塔第 80 層之無上高手，實力深不可測。",
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
    "exp": 1300,
    "gold": 680,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "降龍十八掌・亢龍有悔",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "純陽太極功",
    "chest": {
      "godRate": 16.0,
      "supremeRate": 84.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 85,
    "name": "第 85 層首領・混沌天尊",
    "realm": "返璞歸真",
    "desc": "鎮守通天塔第 85 層之無上高手，實力深不可測。",
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
    "exp": 1375,
    "gold": 720,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "降龍十八掌・亢龍有悔",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "純陽太極功",
    "chest": {
      "godRate": 17.0,
      "supremeRate": 83.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 90,
    "name": "第 90 層首領・混沌天尊",
    "realm": "返璞歸真",
    "desc": "鎮守通天塔第 90 層之無上高手，實力深不可測。",
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
    "exp": 1450,
    "gold": 760,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "降龍十八掌・亢龍有悔",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "純陽太極功",
    "chest": {
      "godRate": 18.0,
      "supremeRate": 82.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 95,
    "name": "第 95 層首領・混沌天尊",
    "realm": "返璞歸真",
    "desc": "鎮守通天塔第 95 層之無上高手，實力深不可測。",
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
    "exp": 1525,
    "gold": 800,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "降龍十八掌・亢龍有悔",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "純陽太極功",
    "chest": {
      "godRate": 19.0,
      "supremeRate": 81.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  },
  {
    "floor": 100,
    "name": "第 100 層首領・混沌天尊",
    "realm": "返璞歸真",
    "desc": "鎮守通天塔第 100 層之無上高手，實力深不可測。",
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
    "exp": 1600,
    "gold": 840,
    "learn": 0,
    "combat": 15,
    "skill": {
      "name": "降龍十八掌・亢龍有悔",
      "baseMult": 2.8,
      "rarity": "神品"
    },
    "internalName": "純陽太極功",
    "chest": {
      "godRate": 20.0,
      "supremeRate": 80.0,
      "upperRate": 75,
      "bookRate": 50
    },
    "drops": []
  }
];

window.TOWER_BOSSES = TOWER_BOSSES;
