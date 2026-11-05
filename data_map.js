/**
 * ========================================================
 * 你的江湖 - 全域地圖與宗門資料庫 (data_map.js)
 * 包含：各名城現實經緯坐標、野外棧道小徑、相鄰路網、全門派大殿場景配置
 * ========================================================
 */

const SECT_RANKS = ["外門弟子", "內門弟子", "真傳弟子", "長老", "出師大成"];

function makeTown(name, sect, desc, paths, coords, enemyTitle, enemyRealm, enemyHp, enemyAtk, enemyDef, enemySpd, expReward, goldReward) {
  return {
    name, sect, desc, paths, coords,
    scenes: [
      { id: "smithy_" + name, name: "城東百煉坊", type: "smithy", desc: "鍛打各色刀劍棍棒、暗器與金絲軟甲。" },
      { id: "kwoon_" + name, name: "演武大武館", type: "kwoon", desc: "請教外家名宿傳授江湖各派武學。" },
      { id: "inn_" + name, name: "悅來客棧", type: "inn", desc: "酒客喧囂，歇息可瞬間調勻氣血，亦可聽書典當。" },
      { id: "fight_" + name, name: "荒郊演武擂", type: "field_combat", desc: "江湖宵小與名宿常在此切磋過招。" }
    ],
    fieldEnemies: [
      { name: enemyTitle + "悍徒", realm: enemyRealm, maxHp: enemyHp, atk: enemyAtk, def: enemyDef, speed: enemySpd, exp: expReward, gold: goldReward, combat: 5 },
      { name: enemyTitle + "頭領", realm: enemyRealm, maxHp: Math.floor(enemyHp * 1.3), atk: Math.floor(enemyAtk * 1.2), def: Math.floor(enemyDef * 1.2), speed: enemySpd + 4, exp: expReward * 2, gold: goldReward * 2, combat: 10 }
    ],
    npcs: [
      { u: "茶攤掌櫃", critic: "少俠這一招氣韻悠長，頗有幾分名家風采！" },
      { u: "抱劍俠客", critic: "好快的身法，當真令人嘆為觀止！" }
    ]
  };
}

// 產生野外棧道/野徑普通據點
function makeWildLocation(name, desc, paths, coords) {
  return {
    name, 
    sect: "無 (野外據點)", 
    desc, 
    paths, 
    coords,
    scenes: [
      { id: "inn_" + name, name: "簡陋茶棚", type: "inn", desc: "過路歇腳之處，可品茗聽聞旅人傳聞、住店歇息。" },
      { id: "fight_" + name, name: "荒林空地", type: "field_combat", desc: "荒無人煙之處，常有綠林剪徑或猛獸出沒。" }
    ],
    fieldEnemies: [
      { name: "密林浪客", realm: "初窺門徑", maxHp: 260, atk: 22, def: 8, speed: 36, exp: 35, gold: 12, combat: 6 },
      { name: "截道匪首", realm: "略有小成", maxHp: 420, atk: 32, def: 14, speed: 45, exp: 65, gold: 24, combat: 12 }
    ],
    npcs: [
      { u: "採藥樵夫", critic: "此地幽深崎嶇，少俠身法靈動，佩服佩服！" }
    ]
  };
}

const WORLD_MAP = {
  // 江南與東南
  "牛家村": makeTown("牛家村", "無 (江湖散人)", "江南水鄉，依山傍水，忠良義士隱居之所。", ["嘉興", "臨安府", "終南山道"], [120.2, 30.3], "村郊山匪", "凡夫俗子", 180, 16, 6, 32, 25, 8),
  "嘉興": makeTown("嘉興", "南湖陸家莊", "煙雨樓楊柳堆煙，江南人文匯聚之地。", ["牛家村", "臨安府", "太湖"], [120.7, 30.7], "南湖水寇", "初窺門徑", 250, 20, 8, 36, 35, 12),
  "臨安府": makeTown("臨安府", "丐幫江南分舵", "西湖美景，八方通商，酒肆林立。", ["牛家村", "嘉興", "蘇州府", "鎮江府", "福州府"], [120.1, 30.2], "西湖浪人", "略有小成", 380, 28, 12, 44, 55, 18),
  "太湖": makeTown("太湖", "歸雲莊水寨", "碧波萬頃，歸雲莊隱於蘆葦蕩深處。", ["嘉興", "桃花島", "蘇州府"], [120.0, 31.2], "太湖水賊", "駕輕就熟", 460, 34, 16, 48, 70, 24),
  "桃花島": makeTown("桃花島", "東海桃花島派", "東海海外仙島，滿島桃花，奇門陣勢莫測。", ["太湖", "舟山群島"], [122.3, 29.8], "海外啞僕", "出神入化", 750, 56, 30, 62, 140, 50),
  "蘇州府": makeTown("蘇州府", "姑蘇名城", "寒山古剎，園林幽雅，富庶甲天下。", ["臨安府", "太湖", "無錫城"], [120.6, 31.3], "姑蘇潑皮", "初窺門徑", 290, 22, 10, 38, 42, 15),
  "無錫城": makeTown("無錫城", "松鶴樓", "松鶴樓酒香飄十里，杏子林中大義長存。", ["蘇州府", "揚州城", "宜興鎮"], [120.3, 31.5], "松鶴樓惡客", "略有小成", 390, 29, 13, 45, 58, 20),
  "宜興鎮": makeTown("宜興鎮", "紫砂古鎮", "紫砂名茶，竹海連綿。", ["無錫城", "鎮江府"], [119.8, 31.3], "竹海野人", "略有小成", 410, 30, 14, 46, 62, 22),
  "鎮江府": makeTown("鎮江府", "金山古剎", "扼長江咽喉，渡江要衝。", ["宜興鎮", "臨安府", "金陵城"], [119.4, 32.2], "截江狂徒", "駕輕就熟", 490, 37, 18, 51, 80, 28),
  "揚州城": makeTown("揚州城", "二十四橋", "淮左名都，商賈雲集。", ["無錫城", "金陵城", "襄陽城"], [119.4, 32.4], "鹽幫私梟", "略有小成", 430, 32, 15, 47, 68, 25),
  "金陵城": makeTown("金陵城", "六朝古都", "虎踞龍盤，秦淮風月與金陵名宿聚集。", ["鎮江府", "揚州城", "登封鎮", "襄陽城"], [118.8, 32.0], "秦淮惡少", "融會貫通", 620, 45, 24, 56, 110, 40),

  // 嶺南、港澳與福爾摩沙
  "福州府": makeTown("福州府", "福威鏢局", "三山兩塔，辟邪劍法源起之所。", ["臨安府", "泉州府"], [119.3, 26.0], "黑道剪徑賊", "初窺門徑", 330, 25, 11, 41, 48, 16),
  "泉州府": makeTown("泉州府", "刺桐港", "海絲起點，千帆競發。", ["福州府", "潮州府", "澎湖灣"], [118.6, 24.9], "南洋劫商浪人", "略有小成", 420, 31, 14, 46, 64, 22),
  "潮州府": makeTown("潮州府", "潮汕工夫茶", "韓江水長，民風剛毅。", ["泉州府", "廣州府"], [116.6, 23.6], "沿海海寇", "略有小成", 430, 32, 15, 47, 66, 24),
  "廣州府": makeTown("廣州府", "五羊名城", "通商總匯，海舶如雲，武風極盛。", ["潮州府", "佛山鎮", "香港", "澳門"], [113.2, 23.1], "南海大盜", "駕輕就熟", 510, 38, 19, 52, 85, 30),
  "佛山鎮": makeTown("佛山鎮", "南拳門總壇", "南派武術發源地，詠春日字拳、虎鶴雙形掌聲威震八方。", ["廣州府", "澳門"], [113.1, 23.0], "南派擂台霸王", "駕輕就熟", 520, 39, 20, 53, 88, 32),
  "香港": makeTown("香港", "詠春八卦門", "香江之畔，街頭武館連排，拳法巧勁絕倫。", ["廣州府", "澳門"], [114.1, 22.3], "九龍城寨凶徒", "出神入化", 850, 64, 34, 68, 180, 70),
  "澳門": makeTown("澳門", "南沙幫", "濠江水埠，南沙幫短刃分水，威震水寨。", ["廣州府", "佛山鎮", "香港"], [113.5, 22.2], "沙街雙刀客", "出神入化", 840, 63, 33, 67, 175, 68),
  "澎湖灣": makeTown("澎湖灣", "跨海要塞", "黑水溝前哨，天后宮庇佑討海俠客。", ["泉州府", "福爾摩沙"], [119.5, 23.5], "黑水溝劫浪客", "駕輕就熟", 530, 40, 20, 52, 90, 34),
  "福爾摩沙": makeTown("福爾摩沙", "祖靈神社", "高山翠綠，玉山古松祭壇，出產奇門吹箭毒刺。", ["澎湖灣"], [121.0, 23.5], "高山毒箭獵首", "出神入化", 880, 66, 35, 72, 190, 75),

  // 中原、兩湖與五嶽
  "襄陽城": makeTown("襄陽城", "郭靖大俠坐鎮", "鐵壁銅牆，萬眾一心守禦中原之門戶。", ["揚州城", "金陵城", "武當山", "重慶府"], [112.1, 32.0], "塞北凶卒", "融會貫通", 650, 48, 25, 58, 120, 42),
  "武當山": makeTown("武當山", "道教武當派", "紫霄宮巍峨，太極神功與太極拳名揚四海。", ["襄陽城", "漢中府"], [111.0, 32.4], "武當逆徒", "出神入化", 780, 58, 32, 64, 150, 55),
  "登封鎮": makeTown("登封鎮", "少林寺山腳", "嵩山五峰環抱，天下第一古剎少林坐鎮於此。", ["金陵城", "洛陽城", "開封府"], [113.0, 34.4], "少室野僧", "駕輕就熟", 510, 38, 19, 52, 85, 30),
  "少室山": makeTown("少室山", "禪宗少林派", "天下武功出少林，大力金剛掌威震八荒。", ["登封鎮"], [112.9, 34.5], "少林破戒僧", "登峰造極", 980, 72, 40, 68, 220, 80),
  "嵩山派": makeTown("嵩山派", "嵩山十三太保", "峻極峰險，左冷禪劍氣凌厲。", ["登封鎮"], [113.0, 34.5], "嵩山大太保", "出神入化", 820, 62, 34, 66, 165, 60),
  "開封府": makeTown("開封府", "大梁名城", "鐵塔凌空，繁華熱鬧之古都。", ["登封鎮", "洛陽城"], [114.3, 34.8], "大梁惡霸", "駕輕就熟", 530, 39, 20, 52, 90, 32),
  "洛陽城": makeTown("洛陽城", "金刀王府", "中原腹地，金刀無敵王元霸府邸所在。", ["登封鎮", "華山險道", "開封府"], [112.4, 34.6], "綠林巨盜", "出神入化", 850, 64, 35, 66, 175, 65),
  "華山險道": makeTown("華山險道", "五嶽華山派", "奇險天下第一山，岳不群掌門坐鎮。", ["洛陽城", "長安古都"], [110.0, 34.5], "華山狂徒", "出神入化", 880, 66, 36, 68, 185, 70),
  "終南山道": makeTown("終南山道", "全真教重陽宮", "全真祖庭，道門玄宗，劍氣純陽。", ["牛家村", "長安古都"], [109.0, 34.0], "終南逆道", "出神入化", 840, 63, 34, 65, 170, 62),
  "長安古都": makeTown("長安古都", "十三朝古都", "絲路起點，繁華鼎盛。", ["華山險道", "終南山道", "真定府"], [108.9, 34.3], "六扇門通緝犯", "登峰造極", 990, 74, 40, 70, 225, 82),
  "真定府": makeTown("真定府", "北腿宗總堂", "常山古邑，北派十二路譚腿發源地，腿法如疾風驟雨。", ["長安古都", "北京城"], [114.5, 38.1], "常山腿術好手", "融會貫通", 630, 46, 24, 56, 112, 40),
  "北京城": makeTown("北京城", "天子之都", "紫禁城宮闕萬重，大內高手聚集。", ["真定府"], [116.4, 39.9], "大內侍衛統領", "登峰造極", 980, 73, 40, 69, 220, 80),
  "重慶府": makeTown("重慶府", "蜀中唐門總舵", "巴山夜雨，唐門千機暗器與劇毒名震天下。", ["襄陽城", "漢中府"], [106.5, 29.5], "唐門叛客", "出神入化", 840, 66, 33, 70, 180, 70),
  "漢中府": makeTown("漢中府", "秦蜀咽喉", "棧道連雲，北接長安南入巴蜀。", ["重慶府", "武當山"], [107.0, 33.0], "棧道悍匪", "融會貫通", 670, 49, 26, 58, 125, 45),

  // 普通野外棧道與小徑據點（十字無路時連接）
  "秦嶺棧道": makeWildLocation("秦嶺棧道", "懸崖峭壁間以巨木搭建之古棧道，地勢險峻。", ["終南山道", "漢中府"], [108.5, 33.6]),
  "荒山小徑": makeWildLocation("荒山小徑", "亂石嶙峋的荒山羊腸小道，人跡罕至。", ["牛家村", "嘉興"], [120.4, 30.5]),
  "密林野道": makeWildLocation("密林野道", "古木參天，幽暗深邃，常有野獸與採藥人出沒。", ["臨安府", "福州府"], [119.7, 28.0]),
  "古渡津口": makeWildLocation("古渡津口", "蘆葦叢生的荒僻古渡口，偶有孤舟擺渡客渡江。", ["揚州城", "鎮江府"], [119.4, 32.3])
};

// 門派專屬大殿場景配置
function attachSectScene(townName, sectId, sceneName, sectName, desc) {
  if (WORLD_MAP[townName]) {
    WORLD_MAP[townName].scenes.unshift({
      id: sectId,
      name: sceneName,
      type: "sect",
      sectName: sectName,
      desc: desc
    });
  }
}

attachSectScene("佛山鎮", "sect_nanquan", "南拳門演武大廳", "南拳門", "南派拳法正宗，木人樁連排，詠春衝拳與虎鶴雙形名震嶺南。");
attachSectScene("真定府", "sect_beitui", "北腿宗演武演武堂", "北腿宗", "北派腿法祖庭，十二路譚腿與旋風腿凌厲剛猛。");
attachSectScene("重慶府", "sect_tangmen", "唐家堡千機殿", "唐門", "蜀中唐門總舵，千機盒暗器與劇毒機關森嚴。");
attachSectScene("華山險道", "sect_huashan", "華山派正氣堂", "華山派", "奇險華山，君子劍岳不群傳授正氣劍法。");
attachSectScene("終南山道", "sect_quanzhen", "全真重陽大殿", "全真教", "道門正宗，丹陽子馬鈺掌教，傳授玄門神功。");
attachSectScene("洛陽城", "sect_jindao", "洛陽金刀王府", "金刀門", "金刀無敵王元霸府邸，刀勢剛猛大開大合。");
attachSectScene("武當山", "sect_wudang", "武當紫霄大殿", "武當派", "張三丰祖師道場，太極拳劍道法自然。");
attachSectScene("少室山", "sect_shaolin", "少林寺大雄寶殿", "少林寺", "禪宗祖庭，少林七十二絕技與大力金剛掌威名赫赫。");
attachSectScene("登封鎮", "sect_shaolin_entry", "少林寺山門迎客堂", "少林寺", "少林接引香客與俗家弟子習武之所。");

// 門派資料庫
const SECT_DATABASE = {
  "南拳門": {
    elderName: "傳功教頭 梁贊師傅",
    leaderName: "掌門 黃飛鴻傳人",
    leaderStats: { name: "南拳宗師", realm: "登峰造極", stats: { arm: 65, speed: 75, bone: 70, inner: 60, int: 45, luck: 35 }, maxHp: 1680, atk: 92, def: 50, speed: 75, exp: 500, gold: 300, combat: 100 },
    skills: [
      { name: "日字連環衝拳", type: "external", weaponReq: "拳", rarity: "凡品", reqStats: { speed: 20 }, reqRank: "外門弟子", costLearn: 40, baseMult: 1.35, desc: "詠春連環直衝拳，拳出如狂風暴雨！" },
      { name: "虎鶴雙形掌", type: "external", weaponReq: "拳", rarity: "良品", reqStats: { arm: 35 }, reqRank: "內門弟子", costLearn: 90, baseMult: 1.75, desc: "剛柔並濟，虎抓開碑，鶴手專取軟穴。" },
      { name: "鐵線金剛拳綱", type: "internal", weaponReq: "任意", rarity: "上品", reqStats: { inner: 40 }, reqRank: "真傳弟子", costLearn: 180, baseHp: 155, baseDef: 18, desc: "極大增強雙臂筋骨與護體罡氣。" },
      { name: "佛山無影拳", type: "external", weaponReq: "拳", rarity: "絕品", reqStats: { arm: 60, speed: 55 }, reqRank: "長老", costLearn: 340, baseMult: 2.70, desc: "出拳聲東擊西，一息百拳，拳風裂石！" }
    ]
  },
  "北腿宗": {
    elderName: "傳功長老 譚腿老怪",
    leaderName: "宗主 燕青神腿",
    leaderStats: { name: "北腿宗主", realm: "登峰造極", stats: { arm: 60, speed: 85, bone: 65, inner: 60, int: 50, luck: 40 }, maxHp: 1650, atk: 90, def: 48, speed: 85, exp: 500, gold: 300, combat: 100 },
    skills: [
      { name: "十二路譚腿", type: "external", weaponReq: "拳", rarity: "凡品", reqStats: { speed: 25 }, reqRank: "外門弟子", costLearn: 40, baseMult: 1.38, desc: "腿法起處神鬼莫測，專打下盤！" },
      { name: "鐵掃帚狂風腿", type: "external", weaponReq: "拳", rarity: "良品", reqStats: { speed: 42 }, reqRank: "內門弟子", costLearn: 90, baseMult: 1.70, desc: "身旋貼地狂掃，宛如狂飆捲地！" },
      { name: "登萍度水身法", type: "qinggong", weaponReq: "任意", rarity: "上品", reqStats: { speed: 50 }, reqRank: "真傳弟子", costLearn: 180, baseSpeed: 32, desc: "足尖在水浪上踏雪奔行，身形神駿。" },
      { name: "北派幽冥旋風腿", type: "external", weaponReq: "拳", rarity: "絕品", reqStats: { speed: 65, arm: 45 }, reqRank: "長老", costLearn: 330, baseMult: 2.65, desc: "凌空七連踢，腿影遮天蔽日！" }
    ]
  },
  "唐門": {
    elderName: "傳功長老 唐大先生",
    leaderName: "門主 唐老太君",
    leaderStats: { name: "唐老太君", realm: "登峰造極", stats: { arm: 50, speed: 82, bone: 60, inner: 65, int: 50, luck: 40 }, maxHp: 1700, atk: 92, def: 42, speed: 82, exp: 500, gold: 300, combat: 100 },
    skills: [
      { name: "漫天花雨手法", type: "external", weaponReq: "暗器", rarity: "良品", reqStats: { speed: 35 }, reqRank: "外門弟子", costLearn: 60, baseMult: 1.70, desc: "揮袖化針，漫天細雨！" },
      { name: "萬毒枯榮心經", type: "internal", weaponReq: "任意", rarity: "上品", reqStats: { inner: 40, bone: 30 }, reqRank: "真傳弟子", costLearn: 180, baseHp: 150, baseDef: 16, desc: "唐門避毒養氣至寶心訣。" },
      { name: "暴雨梨花針", type: "external", weaponReq: "暗器", rarity: "神品", reqStats: { speed: 65, arm: 35 }, reqRank: "長老", costLearn: 380, baseMult: 3.15, desc: "二十七枚淬毒銀針齊發，神鬼難逃！" }
    ]
  },
  "華山派": {
    elderName: "傳功長老 封不平",
    leaderName: "掌門 岳不群",
    leaderStats: { name: "岳不群", realm: "登峰造極", stats: { arm: 65, speed: 75, bone: 55, inner: 60, int: 50, luck: 30 }, maxHp: 1600, atk: 90, def: 45, speed: 75, exp: 500, gold: 200, combat: 100 },
    skills: [
      { name: "狂風快劍", type: "external", weaponReq: "劍", rarity: "良品", reqStats: { speed: 45, arm: 20 }, reqRank: "外門弟子", costLearn: 90, baseMult: 1.75, desc: "一劍快似一劍如暴風驟雨。" },
      { name: "奪命連環三仙劍", type: "external", weaponReq: "劍", rarity: "絕品", reqStats: { speed: 65, arm: 40 }, reqRank: "長老", costLearn: 320, baseMult: 2.65, desc: "一劍化三仙，狠辣絕倫！" }
    ]
  },
  "全真教": {
    elderName: "傳功長老 郝大通",
    leaderName: "掌教 馬鈺",
    leaderStats: { name: "馬鈺", realm: "登峰造極", stats: { arm: 55, speed: 70, bone: 70, inner: 80, int: 55, luck: 35 }, maxHp: 1750, atk: 85, def: 55, speed: 70, exp: 500, gold: 200, combat: 100 },
    skills: [
      { name: "先天功一陽指意", type: "external", weaponReq: "拳", rarity: "神品", reqStats: { inner: 60, bone: 50 }, reqRank: "長老", costLearn: 360, baseMult: 2.85, desc: "純陽極致神指，破體而出！" }
    ]
  },
  "金刀門": {
    elderName: "傳功教頭 王伯奮",
    leaderName: "門主 王元霸",
    leaderStats: { name: "王元霸", realm: "登峰造極", stats: { arm: 85, speed: 65, bone: 65, inner: 50, int: 30, luck: 35 }, maxHp: 1650, atk: 92, def: 48, speed: 66, exp: 500, gold: 300, combat: 100 },
    skills: [
      { name: "八卦六合刀", type: "external", weaponReq: "刀", rarity: "良品", reqStats: { arm: 30 }, reqRank: "外門弟子", costLearn: 50, baseMult: 1.60, desc: "剛猛八卦刀路。" },
      { name: "金刀八式・斬乾坤", type: "external", weaponReq: "刀", rarity: "絕品", reqStats: { arm: 60, speed: 45 }, reqRank: "長老", costLearn: 320, baseMult: 2.60, desc: "黃金厚刃怒斬而下，山崩地裂！" }
    ]
  },
  "少林寺": {
    elderName: "達摩院首座 玄苦大師",
    leaderName: "方丈 玄慈大師",
    leaderStats: { name: "玄慈方丈", realm: "登峰造極", stats: { arm: 75, speed: 65, bone: 80, inner: 75, int: 50, luck: 40 }, maxHp: 1850, atk: 95, def: 55, speed: 68, exp: 500, gold: 300, combat: 100 },
    skills: [
      { name: "太祖長拳", type: "external", weaponReq: "拳", rarity: "凡品", reqStats: { arm: 15 }, reqRank: "外門弟子", costLearn: 40, baseMult: 1.15, desc: "少林基礎拳法。" },
      { name: "大力金剛掌", type: "external", weaponReq: "拳", rarity: "上品", reqStats: { arm: 45, bone: 40 }, reqRank: "真傳弟子", costLearn: 180, baseMult: 2.10, desc: "至剛至陽，掌力催山倒海！" }
    ]
  },
  "武當派": {
    elderName: "傳功大弟子 宋遠橋",
    leaderName: "宗師 張三丰",
    leaderStats: { name: "張三丰", realm: "返璞歸真", stats: { arm: 70, speed: 80, bone: 85, inner: 90, int: 60, luck: 45 }, maxHp: 2100, atk: 105, def: 60, speed: 80, exp: 600, gold: 350, combat: 120 },
    skills: [
      { name: "武當太極長拳", type: "external", weaponReq: "拳", rarity: "上品", reqStats: { inner: 40, bone: 35 }, reqRank: "真傳弟子", costLearn: 180, baseMult: 2.05, desc: "借力打力，以柔克剛。" }
    ]
  }
};

window.SECT_RANKS = SECT_RANKS;
window.WORLD_MAP = WORLD_MAP;
window.SECT_DATABASE = SECT_DATABASE;