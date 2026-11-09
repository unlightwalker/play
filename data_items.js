/**
 * ========================================================
 * 你的江湖 - 全域物品與裝備資料庫 (data_items.js) [更新版]
 * 包含：各門派兵刃 (含八斬刀/分水刺/太刀/吹箭)、防具、靈藥與攻速係數
 * ========================================================
 */

// 武器類別攻速係數 (暗器/拳 > 劍 > 刀 > 棍)
const WEAPON_SPEED_FACTOR = {
  "暗器": 1.40,
  "拳": 1.35,
  "劍": 1.15,
  "刀": 0.95,
  "棍": 0.82
};

// 武器類型自動推導器
function getWeaponType(weapon) {
  if (!weapon) return "拳";
  if (weapon.weaponType) return weapon.weaponType;
  const n = weapon.name || "";
  if (n.includes("針") || n.includes("釘") || n.includes("鏢") || n.includes("石") || n.includes("暗器") || n.includes("箭") || n.includes("幣") || n.includes("元") || n.includes("筒") || n.includes("匣")) return "暗器";
  if (n.includes("劍")) return "劍";
  if (n.includes("刀") || n.includes("斬") || n.includes("刺")) return "刀";
  if (n.includes("棍") || n.includes("棒") || n.includes("杖")) return "棍";
  if (n.includes("拳") || n.includes("掌") || n.includes("指") || n.includes("手") || n.includes("套") || n.includes("爪")) return "拳";
  return "拳";
}

// ==================== 全域道具與裝備資料表 ====================
const GLOBAL_ITEMS = [
  // ==================== 【劍類兵刃】 ====================
  {
    id: "item_wood_sword",
    name: "粗製木劍",
    type: "weapon",
    weaponType: "劍",
    rarity: "凡品",
    atk: 6,
    speed: 0,
    def: 0,
    hp: 0,
    cost: 10,
    desc: "初入江湖時由老木削製之練習木劍。(外攻+6)"
  },
  {
    id: "item_steel_sword",
    name: "百煉青鋼劍",
    type: "weapon",
    weaponType: "劍",
    rarity: "良品",
    atk: 18,
    speed: 6,
    def: 0,
    hp: 0,
    cost: 60,
    desc: "經千錘百煉鍛成之青鋼寶劍，劍鋒銳利。(外攻+18，身法+6)"
  },
  {
    id: "item_gold_snake_sword",
    name: "金蛇寶劍",
    type: "weapon",
    weaponType: "劍",
    rarity: "上品",
    atk: 36,
    speed: 10,
    def: 0,
    hp: 0,
    cost: 150,
    desc: "金蛇郎君遺留之異種神兵，劍尖如蛇信分叉。(外攻+36，身法+10)"
  },
  {
    id: "item_heavy_iron_sword",
    name: "玄鐵重劍",
    type: "weapon",
    weaponType: "劍",
    rarity: "絕品",
    atk: 70,
    speed: -4,
    def: 10,
    hp: 0,
    cost: 260,
    desc: "重劍無鋒，大巧不工，純以玄鐵打造之神雕遺兵。(外攻+70，身法-4，防禦+10)"
  },
  {
    id: "item_yitian_sword",
    name: "倚天劍",
    type: "weapon",
    weaponType: "劍",
    rarity: "神品",
    atk: 105,
    speed: 15,
    def: 0,
    hp: 0,
    cost: 600,
    desc: "武林至尊之神兵，削鐵如泥，劍氣縱橫寒徹九天。(外攻+105，身法+15)"
  },

  // ==================== 【刀類兵刃】 ====================
  {
    id: "item_iron_saber",
    name: "粗鐵單刀",
    type: "weapon",
    weaponType: "刀",
    rarity: "凡品",
    atk: 8,
    speed: 0,
    def: 0,
    hp: 0,
    cost: 12,
    desc: "鐵匠打製之實用單刀，分量沉重。(外攻+8)"
  },
  {
    id: "item_cold_moon_saber",
    name: "冷月厚背刀",
    type: "weapon",
    weaponType: "刀",
    rarity: "良品",
    atk: 22,
    speed: 2,
    def: 0,
    hp: 0,
    cost: 65,
    desc: "沉重精鋼厚背刀，劈砍之勢剛猛無倫。(外攻+22，身法+2)"
  },
  {
    id: "item_wingchun_blade",
    name: "詠春八斬雙短刀",
    type: "weapon",
    weaponType: "刀",
    rarity: "良品",
    atk: 25,
    speed: 8,
    def: 2,
    hp: 0,
    cost: 80,
    desc: "【香港名兵】詠春派獨門雙短刀，短小精悍，貼身格殺無雙。(外攻+25，身法+8)"
  },
  {
    id: "item_nansha_blade",
    name: "南沙分水蛾眉刺",
    type: "weapon",
    weaponType: "刀",
    rarity: "良品",
    atk: 24,
    speed: 9,
    def: 0,
    hp: 0,
    cost: 75,
    desc: "【澳門名兵】南沙幫水上分水短刃，水中破浪無滯，出水見血。(外攻+24，身法+9)"
  },
  {
    id: "item_japan_katana",
    name: "備前長船太刀",
    type: "weapon",
    weaponType: "刀",
    rarity: "上品",
    atk: 42,
    speed: 8,
    def: 0,
    hp: 0,
    cost: 180,
    desc: "【東瀛名刃】備前刀工鍛造之精鋼太刀，刀弧如新月，吹毛斷髮。(外攻+42，身法+8)"
  },
  {
    id: "item_muramasa",
    name: "妖刀・村正",
    type: "weapon",
    weaponType: "刀",
    rarity: "絕品",
    atk: 75,
    speed: 12,
    def: 0,
    hp: 0,
    cost: 320,
    desc: "【東瀛絕品】散發陣陣血煞邪氣之名刃，飲血自狂，破甲透骨。(外攻+75，身法+12)"
  },
  {
    id: "item_duanmen_saber",
    name: "斷門斬馬刀",
    type: "weapon",
    weaponType: "刀",
    rarity: "上品",
    atk: 40,
    speed: 4,
    def: 4,
    hp: 0,
    cost: 160,
    desc: "五虎斷門刀宗師所持重刃，刃口森寒。(外攻+40，身法+4，防禦+4)"
  },
  {
    id: "item_dragon_saber",
    name: "屠龍刀",
    type: "weapon",
    weaponType: "刀",
    rarity: "神品",
    atk: 115,
    speed: 6,
    def: 12,
    hp: 50,
    cost: 650,
    desc: "寶刀屠龍，號令天下，莫敢不從！(外攻+115，防禦+12，氣血+50)"
  },

  // ==================== 【棍棒兵刃】 ====================
  {
    id: "item_wood_staff",
    name: "白蠟長棍",
    type: "weapon",
    weaponType: "棍",
    rarity: "凡品",
    atk: 7,
    speed: 0,
    def: 3,
    hp: 0,
    cost: 10,
    desc: "白蠟木桿浸油製成，彈韌兼備。(外攻+7，防禦+3)"
  },
  {
    id: "item_copper_staff",
    name: "齊眉熟銅棍",
    type: "weapon",
    weaponType: "棍",
    rarity: "良品",
    atk: 20,
    speed: 0,
    def: 8,
    hp: 0,
    cost: 65,
    desc: "黃銅精煉鑄成之長棍，橫掃千軍勢大力沉。(外攻+20，防禦+8)"
  },
  {
    id: "item_fumo_staff",
    name: "鑌鐵伏魔杖",
    type: "weapon",
    weaponType: "棍",
    rarity: "上品",
    atk: 38,
    speed: 0,
    def: 16,
    hp: 60,
    cost: 170,
    desc: "佛門高僧降妖除魔之沉重法杖。(外攻+38，防禦+16，氣血+60)"
  },
  {
    id: "item_dog_stick",
    name: "打狗棒",
    type: "weapon",
    weaponType: "棍",
    rarity: "絕品",
    atk: 65,
    speed: 12,
    def: 12,
    hp: 0,
    cost: 300,
    desc: "丐幫幫主世代相傳之信物，通體碧綠，堅韌無匹。(外攻+65，身法+12，防禦+12)"
  },

  // ==================== 【暗器類兵刃】 ====================
  {
    id: "item_feihuang_stone",
    name: "飛蝗飛石袋",
    type: "weapon",
    weaponType: "暗器",
    rarity: "凡品",
    atk: 10,
    speed: 4,
    def: 0,
    hp: 0,
    cost: 15,
    desc: "江湖尋常打穴暗器，隨取隨擲，輕巧便攜。(外攻+10，身法+4)"
  },
  {
    id: "item_coin_50",
    name: "台幣50元",
    type: "weapon",
    weaponType: "暗器",
    rarity: "良品",
    atk: 20,
    speed: 8,
    def: 0,
    hp: 0,
    cost: 50,
    desc: "【活動限定】金光燦爛的五十元硬幣，邊緣經名匠開鋒，破空擲出如金色流星！(外攻+20，身法+8)"
  },
  {
    id: "item_ancestor_pipe",
    name: "祖靈百毒吹箭管",
    type: "weapon",
    weaponType: "暗器",
    rarity: "良品",
    atk: 23,
    speed: 11,
    def: 0,
    hp: 0,
    cost: 75,
    desc: "【福爾摩沙神兵】高山巨竹雕刻祖靈圖騰之吹管，細針塗抹百步蛇毒。(外攻+23，身法+11)"
  },
  {
    id: "item_nail_tang",
    name: "破甲透骨釘",
    type: "weapon",
    weaponType: "暗器",
    rarity: "良品",
    atk: 24,
    speed: 10,
    def: 0,
    hp: 0,
    cost: 75,
    desc: "蜀中唐門秘傳破甲暗器，穿透護體罡氣。(外攻+24，身法+10)"
  },
  {
    id: "item_storm_box",
    name: "暴雨梨花匣",
    type: "weapon",
    weaponType: "暗器",
    rarity: "神品",
    atk: 110,
    speed: 22,
    def: 0,
    hp: 0,
    cost: 580,
    desc: "唐門千機秘寶，銀匣開闔間飛針如驟雨傾盆！(外攻+110，身法+22)"
  },

  // ==================== 【拳掌指虎類】 ====================
  {
    id: "item_cloth_wrap",
    name: "麻布纏手套",
    type: "weapon",
    weaponType: "拳",
    rarity: "凡品",
    atk: 5,
    speed: 4,
    def: 2,
    hp: 0,
    cost: 8,
    desc: "拳師練習護手之粗布綁帶。(外攻+5，身法+4，防禦+2)"
  },
  {
    id: "item_iron_gauntlet",
    name: "鑌鐵指虎爪",
    type: "weapon",
    weaponType: "拳",
    rarity: "良品",
    atk: 18,
    speed: 6,
    def: 4,
    hp: 0,
    cost: 55,
    desc: "鐵鑄帶刺指節套，大幅強化近身拳勁。(外攻+18，身法+6，防禦+4)"
  },
  {
    id: "item_wucan_glove",
    name: "烏蠶絲掌套",
    type: "weapon",
    weaponType: "拳",
    rarity: "上品",
    atk: 38,
    speed: 10,
    def: 15,
    hp: 50,
    cost: 180,
    desc: "大雪山烏蠶絲織成，刀槍不入，掌力無滯。(外攻+38，身法+10，防禦+15，氣血+50)"
  },

  // ==================== 【防具衣甲】 ====================
  {
    id: "item_cloth_armor",
    name: "粗麻布衣",
    type: "armor",
    rarity: "凡品",
    atk: 0,
    speed: 0,
    def: 4,
    hp: 40,
    cost: 10,
    desc: "樸素市井布衫，略擋微寒。(防禦+4，氣血+40)"
  },
  {
    id: "item_armor_chain",
    name: "精鋼鎖子甲",
    type: "armor",
    rarity: "良品",
    atk: 0,
    speed: 0,
    def: 15,
    hp: 120,
    cost: 85,
    desc: "細密鋼環扣連而成之貼身護甲。(防禦+15，氣血+120)"
  },
  {
    id: "item_vine_armor",
    name: "高山藤織甲",
    type: "armor",
    rarity: "良品",
    atk: 0,
    speed: 4,
    def: 14,
    hp: 140,
    cost: 90,
    desc: "【福爾摩沙秘制】浸泡靈泉老藤編制而成，輕靈堅韌，抗箭矢刀砍。(防禦+14，氣血+140，身法+4)"
  },
  {
    id: "item_soft_hedgehog",
    name: "金絲軟猬甲",
    type: "armor",
    rarity: "絕品",
    atk: 0,
    speed: 4,
    def: 36,
    hp: 320,
    cost: 280,
    desc: "桃花島至寶，滿布細密尖刺，刀槍不入。(防禦+36，氣血+320，身法+4)"
  },
  {
    id: "item_golden_coat",
    name: "金絲寶甲",
    type: "armor",
    rarity: "神品",
    atk: 0,
    speed: 8,
    def: 55,
    hp: 550,
    cost: 620,
    desc: "天下第一防具神珍，水火不侵，萬毒莫犯。(防禦+55，氣血+550，身法+8)"
  },

  // ==================== 【靈藥丹丸】 ====================
  {
    id: "item_small_powder",
    name: "小金創散",
    type: "pill",
    rarity: "凡品",
    buffMinutes: 15,
    healHp: 120,
    cost: 10,
    desc: "服下後 15 分鐘內，氣血上限 +120（並補足相應氣血）。"
  },
  {
    id: "item_big_pill",
    name: "少林大還丹",
    type: "pill",
    rarity: "良品",
    buffMinutes: 15,
    healHp: 300,
    cost: 25,
    desc: "服下後 15 分鐘內，氣血上限 +300（並補足相應氣血）。"
  },
  {
    id: "item_meridian_pill",
    name: "通脈易筋丸",
    type: "pill",
    rarity: "良品",
    useLimit: 10,
    hpAdd: 60,
    speedAdd: 5,
    cost: 45,
    desc: "服下後經脈舒展，永久氣血上限 +60、身法 +5。"
  },
  {
    id: "item_exp_pill",
    name: "益氣淬靈丹",
    type: "pill",
    rarity: "良品",
    useLimit: 10,
    expAdd: 80,
    cost: 35,
    desc: "吸納天地清氣而成之靈丹，服用立刻獲得 80 點修為。"
  },
  {
    id: "item_snow_ginseng",
    name: "千年雪參丸",
    type: "pill",
    rarity: "絕品",
    useLimit: 3,
    hpAdd: 250,
    speedAdd: 15,
    expAdd: 250,
    cost: 200,
    desc: "天山萬年雪峰靈參提煉，永久氣血+250，身法+15，修為+250！"
  },

  // ==================== 【製作材料・新丹藥】 ====================
  {"id": "mat_iron", "name": "精鐵", "type": "material", "rarity": "凡品", "cost": 8, "desc": "尋常鐵礦冶煉而成的鐵錠，鍛造的基本材料。"},
  {"id": "mat_wood", "name": "鐵木", "type": "material", "rarity": "凡品", "cost": 6, "desc": "質地堅硬的木料，可製棍棒與兵刃握柄。"},
  {"id": "mat_hide", "name": "獸皮", "type": "material", "rarity": "凡品", "cost": 6, "desc": "鞣製過的獸皮，可縫製護具與手套。"},
  {"id": "mat_steel", "name": "百煉鋼", "type": "material", "rarity": "良品", "cost": 40, "desc": "精鐵經百次鍛打而成，韌而不脆。"},
  {"id": "mat_cold_iron", "name": "寒鐵", "type": "material", "rarity": "上品", "cost": 120, "desc": "出自極寒之地的礦石，觸手冰涼，鍛成兵刃鋒利異常。", "encounter": {"chance": 2, "on": "travel", "towns": [], "text": "山澗石縫中瞥見一塊泛著寒氣的礦石"}},
  {"id": "mat_silk", "name": "天蠶絲", "type": "material", "rarity": "上品", "cost": 150, "desc": "天蠶所吐之絲，刀劍難斷，可織寶甲。", "encounter": {"chance": 1, "on": "travel", "towns": [], "text": "林間桑樹上結著幾個晶瑩的蠶繭"}},
  {"id": "mat_dark_iron", "name": "玄鐵", "type": "material", "rarity": "絕品", "cost": 300, "desc": "沉重無比的黑色奇鐵，傳說中玄鐵重劍便是以此鑄成。", "encounter": {"chance": 0.8, "on": "travel", "towns": [], "text": "深谷中踢到一塊沉重異常的黑石"}},
  {"id": "mat_meteor", "name": "天外隕鐵", "type": "material", "rarity": "神品", "cost": 800, "desc": "自天外墜落的隕星之鐵，可鑄神兵。", "encounter": {"chance": 0.2, "on": "travel", "towns": [], "text": "夜空劃過一道流星，墜落處竟留下一塊灼熱的隕鐵"}},
  {"id": "herb_licorice", "name": "甘草", "type": "material", "rarity": "凡品", "cost": 4, "desc": "調和百藥的常見藥材。"},
  {"id": "herb_snakegall", "name": "蛇膽", "type": "material", "rarity": "良品", "cost": 25, "desc": "清熱明目，入藥可助身法輕靈。"},
  {"id": "herb_ginseng", "name": "老山參", "type": "material", "rarity": "良品", "cost": 30, "desc": "深山採得的老參，大補元氣。"},
  {"id": "herb_lingzhi", "name": "赤靈芝", "type": "material", "rarity": "上品", "cost": 110, "desc": "色如赤霞的靈芝，延年益壽。", "encounter": {"chance": 2, "on": "both", "towns": [], "text": "古樹根部長著一株赤霞般的靈芝"}},
  {"id": "herb_zhuguo", "name": "朱果", "type": "material", "rarity": "上品", "cost": 130, "desc": "百年一熟的朱紅靈果，蘊含純陽之氣。", "encounter": {"chance": 1, "on": "travel", "towns": [], "text": "懸崖邊一株小樹上掛著朱紅的果子"}},
  {"id": "herb_snowlotus", "name": "天山雪蓮", "type": "material", "rarity": "絕品", "cost": 280, "desc": "生於天山絕頂的雪蓮，百年一開。", "encounter": {"chance": 0.8, "on": "meditate", "towns": [], "text": "靜坐中寒風送來一縷異香，睜眼竟見一朵雪蓮"}},
  {"id": "herb_heshouwu", "name": "千年何首烏", "type": "material", "rarity": "神品", "cost": 700, "desc": "已具人形的千年何首烏，服之可脫胎換骨。", "encounter": {"chance": 0.2, "on": "meditate", "towns": [], "text": "打坐處的泥土微微隆起，竟是一株人形何首烏"}},
  {"id": "item_snake_pill", "name": "蛇膽明目丸", "type": "pill", "rarity": "良品", "useLimit": 10, "speedAdd": 8, "cost": 60, "desc": "以蛇膽煉成，服下耳聰目明，永久身法 +8。"},
  {"id": "item_peiyuan_pill", "name": "培元固本丹", "type": "pill", "rarity": "上品", "useLimit": 5, "hpAdd": 80, "expAdd": 200, "cost": 150, "desc": "以赤靈芝為君藥，永久氣血上限 +80，修為 +200。"},
  {"id": "item_jiuzhuan_pill", "name": "九轉還魂丹", "type": "pill", "rarity": "神品", "useLimit": 1, "hpAdd": 400, "speedAdd": 20, "expAdd": 600, "cost": 1200, "desc": "九轉而成的無上靈丹，永久氣血 +400、身法 +20、修為 +600。"},
  // ==================== 【俠客經驗丹】 ====================
  {"id": "item_cexp_1", "name": "強身散", "type": "pill", "rarity": "凡品", "companionExp": 500, "cost": 40, "noChest": true, "desc": "俠客服用的入門藥散，強健筋骨，俠客經驗 +500。"},
  {"id": "item_cexp_2", "name": "壯骨丹", "type": "pill", "rarity": "良品", "companionExp": 2000, "cost": 150, "noChest": true, "desc": "以虎骨入藥煉成，俠客經驗 +2000。"},
  {"id": "item_cexp_3", "name": "洗髓丹", "type": "pill", "rarity": "上品", "companionExp": 8000, "cost": 600, "noChest": true, "desc": "洗筋伐髓的靈丹，俠客經驗 +8000。"},
  {"id": "item_cexp_4", "name": "龍虎金丹", "type": "pill", "rarity": "絕品", "companionExp": 30000, "cost": 2400, "noChest": true, "desc": "龍虎交匯、金丹大成，俠客經驗 +30000。"},
  {"id": "item_cexp_5", "name": "太乙還童丹", "type": "pill", "rarity": "神品", "companionExp": 100000, "cost": 9000, "noChest": true, "desc": "傳說中返老還童的仙丹，俠客經驗 +100000。"}
];

// 掛載至 window 全域
window.GLOBAL_ITEMS = GLOBAL_ITEMS;
window.WEAPON_SPEED_FACTOR = WEAPON_SPEED_FACTOR;
window.getWeaponType = getWeaponType;