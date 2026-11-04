/**
 * ========================================================
 * 你的江湖 - 全域武學資料庫 (data_skills.js) [六維屬性加成版]
 * 外功(刀/劍/拳/棍/暗器)、心法(內功)、輕功(身法)均增加對應六維屬性
 * 悟性、福緣無普通功法加成
 * ========================================================
 */

// 1. 武學品階蓄力速度係數
const RARITY_SPEED_FACTOR = {
  "凡品": 1.25,
  "良品": 1.10,
  "上品": 0.95,
  "絕品": 0.80,
  "神品": 0.65
};

// 2. 參悟基礎修為消耗 (入門 75，神品 26000)
const RARITY_BASE_EXP = {
  "凡品": 75,
  "良品": 360,
  "上品": 1950,
  "絕品": 7800,
  "神品": 26000
};

// 3. 武學造詣評價演算法
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

// 4. 計算單次參悟所需修為 (受悟性加成)
function getUpgradeExpCost(rarity, tier) {
  const base = RARITY_BASE_EXP[rarity] || 75;
  return Math.floor(base * (1 + (tier - 1) * 0.45));
}

// 5. 武學兵刃要求推導器
function getSkillWeaponReq(skill) {
  if (!skill) return "任意";
  if (skill.weaponReq) return skill.weaponReq;
  const n = skill.name || "";
  if (n.includes("針") || n.includes("釘") || n.includes("鏢") || n.includes("暗器") || n.includes("石") || n.includes("花雨") || n.includes("彈指") || n.includes("箭")) return "暗器";
  if (n.includes("劍")) return "劍";
  if (n.includes("刀") || n.includes("斬")) return "刀";
  if (n.includes("棍") || n.includes("棒") || n.includes("杖")) return "棍";
  if (n.includes("拳") || n.includes("掌") || n.includes("指") || n.includes("腿") || n.includes("念頭")) return "拳";
  return "任意";
}

// 6. 檢驗武學與武器是否契合
function isSkillCompatibleWithWeapon(skill, weapon) {
  const req = getSkillWeaponReq(skill);
  if (req === "任意") return true;
  const wType = (typeof getWeaponType === "function") ? getWeaponType(weapon) : "拳";
  return req === wType;
}

// ==================== 全域武學資料表 (含六維加成 statBonus) ====================
const GLOBAL_SKILLS = [
  // ---------- 基礎入門武學 ----------
  {
    id: "kf_taizu",
    name: "太祖長拳",
    type: "external",
    weaponReq: "拳",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseMult: 1.15,
    reqStats: { arm: 15, bone: 15 },
    statBonus: { arm: 2, bone: 2 }, // 拳掌加臂力與根骨
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
    baseMult: 1.35,
    reqStats: { speed: 20 },
    statBonus: { speed: 3, arm: 1 }, // 劍法加身法與臂力
    jinyongDesc: "長劍一抖，化為寒星疾刺，身隨劍走！"
  },
  {
    id: "kf_tuna",
    name: "吐納坐忘訣",
    type: "internal",
    weaponReq: "任意",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseHpBonus: 50,
    baseDefBonus: 4,
    reqStats: { inner: 10 },
    statBonus: { inner: 4, bone: 2 }, // 心法加內功與根骨
    effectDesc: "調勻內息，增幅氣血上限與護體罡氣。"
  },
  {
    id: "kf_caoshangfei",
    name: "草上飛",
    type: "qinggong",
    weaponReq: "任意",
    rarity: "凡品",
    tier: 1,
    progress: 0,
    baseSpeedBonus: 12,
    reqStats: { speed: 25 },
    statBonus: { speed: 5 }, // 輕功加身法
    effectDesc: "提氣躍步，步履如飛，顯著提升出手身法。"
  },

  // ---------- 江湖武館傳授 ----------
  {
    id: "kf_bagua_dao",
    name: "八卦六合刀",
    type: "external",
    weaponReq: "刀",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseMult: 1.60,
    reqStats: { arm: 30, speed: 25 },
    statBonus: { arm: 6 }, // 刀法純加臂力
    costLearn: 50,
    costGold: 20,
    jinyongDesc: "八卦步法游走，反手一刀『金蛇纏柳』直斬肋下！"
  },
  {
    id: "kf_tiebushan",
    name: "金剛鐵布衫",
    type: "internal",
    weaponReq: "任意",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseHpBonus: 90,
    baseDefBonus: 12,
    reqStats: { bone: 30 },
    statBonus: { bone: 6, inner: 4 },
    costLearn: 60,
    costGold: 25,
    effectDesc: "常駐硬氣功護體，氣血防禦雙向提升。"
  },
  {
    id: "kf_feiyan",
    name: "飛簷走壁",
    type: "qinggong",
    weaponReq: "任意",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseSpeedBonus: 20,
    reqStats: { speed: 35 },
    statBonus: { speed: 8 },
    costLearn: 60,
    costGold: 25,
    effectDesc: "提身涉險，如靈燕穿柳，大幅提升出手身法。"
  },
  {
    id: "kf_huayu",
    name: "漫天花雨手法",
    type: "external",
    weaponReq: "暗器",
    rarity: "良品",
    tier: 1,
    progress: 0,
    baseMult: 1.70,
    reqStats: { speed: 35 },
    statBonus: { speed: 7 }, // 暗器純加身法
    costLearn: 60,
    costGold: 25,
    jinyongDesc: "揮袖之間飛花化針，數枚暗器如漫天細雨飄落！"
  },

  // ---------- 神品絕學 (神級 100 倍消耗) ----------
  {
    id: "kf_tanzhi",
    name: "彈指神通",
    type: "external",
    weaponReq: "暗器",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.20,
    uniqueVfx: "tanzhi",
    reqStats: { speed: 50, inner: 40 },
    statBonus: { speed: 25, arm: 10 },
    jinyongDesc: "指尖微曲，隨即一彈，嗤的一聲急響，一道森森氣勁如離弦之箭激射而出，破空無形！"
  },
  {
    id: "kf_storm_needles",
    name: "暴雨梨花針",
    type: "external",
    weaponReq: "暗器",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.15,
    uniqueVfx: "storm",
    reqRank: "長老",
    costLearn: 380,
    reqStats: { speed: 65, arm: 35 },
    statBonus: { speed: 28 },
    jinyongDesc: "二十七枚淬毒銀針齊發，漫天花雨，神鬼難逃！"
  },
  {
    id: "kf_dragon_palm",
    name: "降龍十八掌・亢龍有悔",
    type: "external",
    weaponReq: "拳",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.10,
    uniqueVfx: "dragon",
    reqRank: "長老",
    costLearn: 380,
    reqStats: { arm: 65, bone: 60, inner: 50 },
    statBonus: { arm: 26, bone: 18 },
    jinyongDesc: "一聲龍吟驟起，金龍神罡破空而出，排山倒海傾瀉敵體！"
  },
  {
    id: "kf_yiyang",
    name: "先天功一陽指意",
    type: "external",
    weaponReq: "拳",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 2.85,
    uniqueVfx: "yiyang",
    reqRank: "長老",
    costLearn: 360,
    reqStats: { inner: 60, bone: 50 },
    statBonus: { inner: 20, arm: 15 },
    jinyongDesc: "純陽極致神指破體而出，九天純陽金光貫頂，霸道無比！"
  },
  {
    id: "kf_ittoryu_ultimate",
    name: "秘劍・一之太刀",
    type: "external",
    weaponReq: "刀",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.25,
    uniqueVfx: "ittoryu",
    reqRank: "長老",
    costLearn: 380,
    reqStats: { arm: 65, speed: 70 },
    statBonus: { arm: 28, speed: 12 },
    jinyongDesc: "心技體合一之居合奧義，雷光一閃之間敵軀兩斷！"
  },
  {
    id: "kf_ancestor_ultimate",
    name: "祖靈之怒・萬魂獵殺",
    type: "external",
    weaponReq: "暗器",
    rarity: "神品",
    tier: 1,
    progress: 0,
    baseMult: 3.20,
    uniqueVfx: "ancestor",
    reqRank: "長老",
    costLearn: 390,
    reqStats: { speed: 75, arm: 40 },
    statBonus: { speed: 30 },
    jinyongDesc: "祭祀祖靈之漫天骨刺與毒雨，覆蓋整個戰場，神鬼辟易！"
  },

  // ---------- 絕品 / 上品 / 良品 門派武學 ----------
  { id: "kf_sanxian", name: "奪命連環三仙劍", type: "external", weaponReq: "劍", rarity: "絕品", tier: 1, progress: 0, baseMult: 2.65, uniqueVfx: "sanxian", reqRank: "長老", costLearn: 320, reqStats: { speed: 65, arm: 40 }, statBonus: { speed: 16, arm: 8 }, jinyongDesc: "一劍化三仙，狠辣絕倫，白青劍氣瞬殺敵方要害！" },
  { id: "kf_jindao_eight", name: "金刀八式・斬乾坤", type: "external", weaponReq: "刀", rarity: "絕品", tier: 1, progress: 0, baseMult: 2.60, reqRank: "長老", costLearn: 320, reqStats: { arm: 60, speed: 45 }, statBonus: { arm: 20 }, jinyongDesc: "黃金厚刃高高躍起，凌空力劈山嶽，天地變色！" },
  { id: "kf_wingchun_blade", name: "八斬刀法・奪魂", type: "external", weaponReq: "刀", rarity: "絕品", tier: 1, progress: 0, baseMult: 2.75, uniqueVfx: "bazhan", reqRank: "長老", costLearn: 340, reqStats: { speed: 65, arm: 40 }, statBonus: { arm: 16, speed: 10 }, jinyongDesc: "雙手持雙短刀，貼身連環八斬，刀光如雪，刀刀奪命！" },
  { id: "kf_nansha_blade", name: "劈波斬浪大斷刀", type: "external", weaponReq: "刀", rarity: "絕品", tier: 1, progress: 0, baseMult: 2.65, uniqueVfx: "nansha", reqRank: "長老", costLearn: 320, reqStats: { arm: 65, speed: 45 }, statBonus: { arm: 18, bone: 6 }, jinyongDesc: "橫江怒刀猛劈斬下，大江兩分，威猛霸道無倫！" },

  { id: "kf_zixia", name: "紫霞神功初篇", type: "internal", weaponReq: "任意", rarity: "上品", tier: 1, progress: 0, baseHpBonus: 140, baseDefBonus: 16, reqRank: "真傳弟子", costLearn: 180, reqStats: { inner: 35, bone: 30 }, statBonus: { inner: 14, bone: 6 }, effectDesc: "華山鎮派之秘，初運之時面泛紫氣，卸除暗勁。" },
  { id: "kf_sanqing", name: "三清玄門氣", type: "internal", weaponReq: "任意", rarity: "上品", tier: 1, progress: 0, baseHpBonus: 160, baseDefBonus: 18, reqRank: "真傳弟子", costLearn: 180, reqStats: { inner: 40, bone: 35 }, statBonus: { inner: 16, bone: 7 }, effectDesc: "道法自然，內力生生不息，回氣速度大幅增強。" },
  { id: "kf_tang_inner", name: "萬毒枯榮心經", type: "internal", weaponReq: "任意", rarity: "上品", tier: 1, progress: 0, baseHpBonus: 150, baseDefBonus: 16, reqRank: "真傳弟子", costLearn: 180, reqStats: { inner: 40, bone: 30 }, statBonus: { inner: 15, bone: 6 }, effectDesc: "唐門避毒養氣至寶心訣，百毒莫侵。" },
  { id: "kf_fengmo", name: "瘋魔杖法", type: "external", weaponReq: "棍", rarity: "上品", tier: 1, progress: 0, baseMult: 2.15, reqRank: "真傳弟子", costLearn: 180, reqStats: { arm: 45, bone: 35 }, statBonus: { bone: 10, arm: 6 }, jinyongDesc: "出招癲狂如瘋如魔，棍影如山，令人防不勝防！" },
  { id: "kf_wingchun_inner", name: "寸勁沉丹訣", type: "internal", weaponReq: "任意", rarity: "上品", tier: 1, progress: 0, baseHpBonus: 145, baseDefBonus: 18, reqRank: "真傳弟子", costLearn: 180, reqStats: { inner: 40, arm: 35 }, statBonus: { inner: 14, arm: 8 }, effectDesc: "近身三寸聚爆雷霆內力，氣震五臟六腑。" },
  { id: "kf_nansha_inner", name: "逆鱗翻江氣", type: "internal", weaponReq: "任意", rarity: "上品", tier: 1, progress: 0, baseHpBonus: 165, baseDefBonus: 20, reqRank: "真傳弟子", costLearn: 180, reqStats: { bone: 40, inner: 35 }, statBonus: { inner: 15, bone: 8 }, effectDesc: "波濤般連綿不絕的護體波紋內勁，減免鈍擊傷害。" },
  { id: "kf_ittoryu_inner", name: "殘心明鏡流", type: "internal", weaponReq: "任意", rarity: "上品", tier: 1, progress: 0, baseHpBonus: 150, baseDefBonus: 16, reqRank: "真傳弟子", costLearn: 180, reqStats: { inner: 40, speed: 35 }, statBonus: { inner: 15, speed: 6 }, effectDesc: "東瀛靜氣凝神之術，會心暴擊倍率大幅提昇。" },
  { id: "kf_ancestor_inner", name: "百步蛇毒心經", type: "internal", weaponReq: "任意", rarity: "上品", tier: 1, progress: 0, baseHpBonus: 160, baseDefBonus: 18, reqRank: "真傳弟子", costLearn: 180, reqStats: { inner: 42, bone: 35 }, statBonus: { inner: 16, bone: 8 }, effectDesc: "百步蛇圖騰之秘傳養生功，體藏奇毒反噬對手。" },
  { id: "kf_jinsi_inner", name: "金剛聚頂勁", type: "internal", weaponReq: "任意", rarity: "上品", tier: 1, progress: 0, baseHpBonus: 150, baseDefBonus: 20, reqRank: "真傳弟子", costLearn: 180, reqStats: { bone: 45, arm: 35 }, statBonus: { bone: 14, arm: 8 }, effectDesc: "橫練外家金鐘罩，硬抗刀砍斧剁。" },

  { id: "kf_kuangfeng", name: "狂風快劍", type: "external", weaponReq: "劍", rarity: "良品", tier: 1, progress: 0, baseMult: 1.75, reqRank: "內門弟子", costLearn: 90, reqStats: { speed: 45, arm: 20 }, statBonus: { speed: 8, arm: 3 }, jinyongDesc: "一劍快似一劍，劍刃狂掠連綿不絕，猶如暴風驟雨！" },
  { id: "kf_tiangang", name: "天罡七星步", type: "qinggong", weaponReq: "任意", rarity: "良品", tier: 1, progress: 0, baseSpeedBonus: 25, reqRank: "內門弟子", costLearn: 90, reqStats: { speed: 40, inner: 25 }, statBonus: { speed: 10 }, effectDesc: "依北斗七星方位踏步挪移，飄逸靈動。" },
  { id: "kf_tang_step", name: "天羅穿針步", type: "qinggong", weaponReq: "任意", rarity: "良品", tier: 1, progress: 0, baseSpeedBonus: 26, reqRank: "內門弟子", costLearn: 90, reqStats: { speed: 45 }, statBonus: { speed: 11 }, effectDesc: "形若穿針引線，進退如風中殘影。" },
  { id: "kf_xiaoyaoyou", name: "逍遙遊步法", type: "qinggong", weaponReq: "任意", rarity: "良品", tier: 1, progress: 0, baseSpeedBonus: 24, reqRank: "內門弟子", costLearn: 90, reqStats: { speed: 45 }, statBonus: { speed: 10 }, effectDesc: "翩若驚鴻，婉若游龍，體態飄逸輕靈。" },
  { id: "kf_jinsi_step", name: "金絲八卦纏身步", type: "qinggong", weaponReq: "任意", rarity: "良品", tier: 1, progress: 0, baseSpeedBonus: 22, reqRank: "內門弟子", costLearn: 90, reqStats: { speed: 38, bone: 20 }, statBonus: { speed: 9 }, effectDesc: "貼身纏鬥專用刀客步法，貼身游走如鬼魅。" },
  { id: "kf_wingchun_step", name: "八卦穿掌游身步", type: "qinggong", weaponReq: "任意", rarity: "良品", tier: 1, progress: 0, baseSpeedBonus: 26, reqRank: "內門弟子", costLearn: 90, reqStats: { speed: 45 }, statBonus: { speed: 11 }, effectDesc: "趟泥步圓走如盤，避實擊虛，飄忽莫測。" },
  { id: "kf_nansha_step", name: "踏浪飛渡步", type: "qinggong", weaponReq: "任意", rarity: "良品", tier: 1, progress: 0, baseSpeedBonus: 25, reqRank: "內門弟子", costLearn: 90, reqStats: { speed: 42 }, statBonus: { speed: 10 }, effectDesc: "水波蘆葦上如蜻蜓點水疾行，身輕如燕。" },
  { id: "kf_ittoryu_step", name: "拔刀疾風瞬影", type: "qinggong", weaponReq: "任意", rarity: "良品", tier: 1, progress: 0, baseSpeedBonus: 28, reqRank: "內門弟子", costLearn: 90, reqStats: { speed: 48 }, statBonus: { speed: 12 }, effectDesc: "出刀前之無聲踏步逼近術，殘影若現。" },
  { id: "kf_ancestor_step", name: "密林踏藤步", type: "qinggong", weaponReq: "任意", rarity: "良品", tier: 1, progress: 0, baseSpeedBonus: 27, reqRank: "內門弟子", costLearn: 90, reqStats: { speed: 46 }, statBonus: { speed: 11 }, effectDesc: "借古藤巨木借力飛躍，山猿莫及。" },

  { id: "kf_huashan_basic", name: "華山正氣劍", type: "external", weaponReq: "劍", rarity: "凡品", tier: 1, progress: 0, baseMult: 1.35, reqRank: "外門弟子", costLearn: 40, reqStats: { speed: 25, arm: 15 }, statBonus: { speed: 3, arm: 1 }, jinyongDesc: "堂皇正大之華山基石劍路，招招沈著威嚴！" },
  { id: "kf_quanzhen_basic", name: "全真基礎劍法", type: "external", weaponReq: "劍", rarity: "凡品", tier: 1, progress: 0, baseMult: 1.35, reqRank: "外門弟子", costLearn: 40, reqStats: { speed: 20, inner: 15 }, statBonus: { speed: 3, inner: 1 }, jinyongDesc: "全真道門入門純陽劍招，以靜制動，厚積薄發。" },
  { id: "kf_fuhu", name: "太祖伏虎棍", type: "external", weaponReq: "棍", rarity: "凡品", tier: 1, progress: 0, baseMult: 1.35, reqRank: "外門弟子", costLearn: 40, reqStats: { arm: 20, bone: 20 }, statBonus: { bone: 3, arm: 1 }, jinyongDesc: "叫花子走南闖北之防身長棍術，橫掃千軍！" },
  { id: "kf_jindao_basic", name: "金刀五虎斷門刀", type: "external", weaponReq: "刀", rarity: "凡品", tier: 1, progress: 0, baseMult: 1.35, reqRank: "外門弟子", costLearn: 40, reqStats: { arm: 25 }, statBonus: { arm: 4 }, jinyongDesc: "洛陽王家剛猛刀招起手式，大開大合！" },
  { id: "kf_tang_nail", name: "唐門透骨釘", type: "external", weaponReq: "暗器", rarity: "凡品", tier: 1, progress: 0, baseMult: 1.35, reqRank: "外門弟子", costLearn: 40, reqStats: { speed: 25 }, statBonus: { speed: 4 }, jinyongDesc: "唐門獨門暗器手法，發勁極微，破風無聲，直透重甲！" },
  { id: "kf_wingchun_basic", name: "詠春小念頭", type: "external", weaponReq: "拳", rarity: "凡品", tier: 1, progress: 0, baseMult: 1.35, reqRank: "外門弟子", costLearn: 40, reqStats: { speed: 20 }, statBonus: { speed: 3, arm: 2 }, jinyongDesc: "詠春基石，守中用中，朝形連環日字衝拳疾出如驟雨！" },
  { id: "kf_nansha_basic", name: "南沙分水刺", type: "external", weaponReq: "刀", rarity: "凡品", tier: 1, progress: 0, baseMult: 1.35, reqRank: "外門弟子", costLearn: 40, reqStats: { speed: 22, arm: 18 }, statBonus: { arm: 3, speed: 2 }, jinyongDesc: "水寨短刀破浪搶攻，快狠凌厲，招招直奔軟肋！" },
  { id: "kf_ittoryu_basic", name: "一刀流袈裟斬", type: "external", weaponReq: "刀", rarity: "凡品", tier: 1, progress: 0, baseMult: 1.40, reqRank: "外門弟子", costLearn: 40, reqStats: { arm: 20, speed: 20 }, statBonus: { arm: 3, speed: 2 }, jinyongDesc: "自左肩至右腹之極速居合斜劈，刀芒淒冷！" },
  { id: "kf_ancestor_basic", name: "山靈吹箭術", type: "external", weaponReq: "暗器", rarity: "凡品", tier: 1, progress: 0, baseMult: 1.38, reqRank: "外門弟子", costLearn: 40, reqStats: { speed: 25 }, statBonus: { speed: 4 }, jinyongDesc: "細長竹管射出淬毒細針，射程百步，無影無聲！" }
];

window.GLOBAL_SKILLS = GLOBAL_SKILLS;
window.RARITY_SPEED_FACTOR = RARITY_SPEED_FACTOR;
window.RARITY_BASE_EXP = RARITY_BASE_EXP;
window.getKungfuEval = getKungfuEval;
window.getUpgradeExpCost = getUpgradeExpCost;
window.getSkillWeaponReq = getSkillWeaponReq;
window.isSkillCompatibleWithWeapon = isSkillCompatibleWithWeapon;