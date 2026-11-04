/**
 * 你的江湖 - 全域轉世天賦資料庫 (data_talents.js)
 * 共收錄 150 種武俠天賦 (正面、負面、雙刃、奇門)
 */
const GLOBAL_TALENTS = [
  // 1 ~ 20 神品天命
  { id: "t_001", name: "天生霸體", rarity: "神品", desc: "氣血上限 +35%，免受一切震顫頓挫。", stats: {}, hpPct: 0.35, isIronBody: true },
  { id: "t_002", name: "謫仙轉世", rarity: "神品", desc: "悟性 +25，福緣 +20，初始自帶 300 點修為。", stats: { int: 25, luck: 20 }, initExp: 300 },
  { id: "t_003", name: "九陽絕脈", rarity: "神品", desc: "內功 +30，修煉任何心法修為消耗降低 30%。", stats: { inner: 30 }, kfCostDec: 0.3 },
  { id: "t_004", name: "天罡神力", rarity: "神品", desc: "臂力 +35，歷練與普通攻擊暴擊傷害倍率 +50%。", stats: { arm: 35 }, critDmgMult: 0.5 },
  { id: "t_005", name: "凌波微步體", rarity: "神品", desc: "身法 +35，通天塔出招頻率達到極限，閃避率 +15%。", stats: { speed: 35 }, dodgeRateAdd: 15 },
  { id: "t_006", name: "天生金剛骨", rarity: "神品", desc: "根骨 +30，基礎防禦額外 +25，招架率 +20%。", stats: { bone: 30 }, defAdd: 25, parryRateAdd: 20 },
  { id: "t_007", name: "氣運之子", rarity: "神品", desc: "福緣 +40，歷練通天寶箱神品掉率直接翻倍。", stats: { luck: 40 }, chestGodDoubled: true },
  { id: "t_008", name: "武學奇才", rarity: "神品", desc: "所有裝備武學參悟進度每次跳升 50%（原為 25%）。", stats: {}, kfJumpProgress: 50 },
  { id: "t_009", name: "百脈俱通", rarity: "神品", desc: "六維先天基礎屬性全員全面 +10 點。", stats: { arm: 10, speed: 10, bone: 10, inner: 10, int: 10, luck: 10 } },
  { id: "t_010", name: "饕餮吞天", rarity: "神品", desc: "服用任何靈丹丹藥，其增加氣血與身法效果提升 100%。", stats: {}, pillMult: 2.0 },
  { id: "t_011", name: "聚寶盆轉世", rarity: "神品", desc: "歷練與切磋獲得銀兩提升 100%，客棧消費半價。", stats: {}, goldGainMult: 2.0 },
  { id: "t_012", name: "通天徹地", rarity: "神品", desc: "通天塔歷練每擊敗 1 名強敵，自動恢復 5% 氣血。", stats: {}, towerHealPct: 0.05 },
  { id: "t_013", name: "劍道獨尊", rarity: "神品", desc: "佩戴【劍】類兵刃時，外攻傷害提升 40%，身法 +15。", stats: { speed: 15 }, swordDmgAdd: 0.4 },
  { id: "t_014", name: "刀狂血魔", rarity: "神品", desc: "佩戴【刀】類兵刃時，暴擊率 +20%，吸血 10%。", stats: {}, bladeCrit: 20, bladeLeech: 0.1 },
  { id: "t_015", name: "棍撼乾坤", rarity: "神品", desc: "佩戴【棍】類兵刃時，常駐護體防禦 +30，臂力 +20。", stats: { arm: 20 }, staffDefAdd: 30 },
  { id: "t_016", name: "漫天星宿", rarity: "神品", desc: "佩戴【暗器】時，ATB 蓄力速度額外 +25%，命中率 100%。", stats: {}, dartAtbBoost: 0.25 },
  { id: "t_017", name: "拳鎮山河", rarity: "神品", desc: "空手赤拳搏擊時，外攻威力 +50%，招架時反震 30% 傷害。", stats: {}, fistDmgAdd: 0.5 },
  { id: "t_018", name: "一代宗師", rarity: "神品", desc: "拜入門派初始即為【內門弟子】，免去外門雜役門檻。", stats: {}, sectDirectInner: true },
  { id: "t_019", name: "不死鳥之息", rarity: "神品", desc: "戰鬥中受到致命傷害時免除死亡一次，並立刻回滿 50% 氣血。", stats: {}, reviveOnce: true },
  { id: "t_020", name: "大道自然", rarity: "神品", desc: "打坐調息產出修為與學點速度提升 100%。", stats: {}, meditateMult: 2.0 },

  // 21 ~ 65 雙刃雙效
  { id: "t_021", name: "莽夫神力", rarity: "絕品", desc: "臂力 +40，但悟性 -15。", stats: { arm: 40, int: -15 } },
  { id: "t_022", name: "病弱天驕", rarity: "絕品", desc: "悟性 +35，內功 +20，但氣血上限 -30%，根骨 -10。", stats: { int: 35, inner: 20, bone: -10 }, hpPct: -0.3 },
  { id: "t_023", name: "疾風鬼影", rarity: "絕品", desc: "身法 +45，但臂力 -20。", stats: { speed: 45, arm: -20 } },
  { id: "t_024", name: "散財童子", rarity: "絕品", desc: "福緣 +35，但所有店鋪物價翻倍。", stats: { luck: 35 }, shopPriceMult: 2.0 },
  { id: "t_025", name: "金剛駝背", rarity: "絕品", desc: "根骨 +35，防禦 +30，但身法 -25。", stats: { bone: 35, speed: -25 }, defAdd: 30 },
  { id: "t_026", name: "狂血修羅", rarity: "絕品", desc: "歷練暴擊傷害提升 100%，但每出招扣除 1% 氣血。", stats: {}, critDmgMult: 1.0, selfHarmPct: 0.01 },
  { id: "t_027", name: "孤僻怪傑", rarity: "絕品", desc: "打坐獲得修為 +80%，但不可拜入任何門派。", stats: {}, meditateMult: 1.8, noSect: true },
  { id: "t_028", name: "暗器癡魔", rarity: "絕品", desc: "暗器威力 +60%，但無法裝備刀劍棍拳外功。", stats: {}, dartDmgOnly: true },
  { id: "t_029", name: "重甲狂客", rarity: "絕品", desc: "防禦力提升 100%，但戰鬥出招速度降低 25%。", stats: {}, defPct: 1.0, atbSlowPct: 0.25 },
  { id: "t_030", name: "薄刃刺客", rarity: "絕品", desc: "戰鬥蓄力速度提升 30%，但防禦力歸零。", stats: {}, atbFastPct: 0.3, zeroDef: true },
  { id: "t_031", name: "文弱書生", rarity: "上品", desc: "每次打坐額外產出 +3 學點，但外攻攻擊力 -25%。", stats: {}, meditateLearnBonus: 3, atkPct: -0.25 },
  { id: "t_032", name: "逆脈魔功", rarity: "上品", desc: "內功 +35，但氣血上限 -20%。", stats: { inner: 35 }, hpPct: -0.2 },
  { id: "t_033", name: "貪財賭徒", rarity: "上品", desc: "通天塔掉落銀兩 +150%，但暴擊率降至固定 5%。", stats: {}, goldGainMult: 2.5, lockCrit: 5 },
  { id: "t_034", name: "嗜酒狂徒", rarity: "上品", desc: "客棧聽書獲得學點 +100%，但住店費用為 50 兩。", stats: {}, storytellerLearnMult: 2.0 },
  { id: "t_035", name: "盲目劍豪", rarity: "上品", desc: "外攻傷害 +45%，但命中率固定降低 15%。", stats: {}, dmgBoost: 0.45, hitPenalty: 15 },
  { id: "t_036", name: "七傷損體", rarity: "上品", desc: "對敵招式傷害 +50%，但自身受到的任何傷害增加 30%。", stats: {}, dmgBoost: 0.5, vuln: 0.3 },
  { id: "t_037", name: "獨孤求敗", rarity: "上品", desc: "單挑首領 BOSS 傷害 +60%，但面對雜兵時傷害 -20%。", stats: {}, bossDmgAdd: 0.6, mobDmgPenalty: 0.2 },
  { id: "t_038", name: "苦行頭陀", rarity: "上品", desc: "無法佩戴防具衣甲，但全六維屬性各 +6 點。", stats: { arm: 6, speed: 6, bone: 6, inner: 6, int: 6, luck: 6 }, noArmor: true },
  { id: "t_039", name: "鈍器專精", rarity: "良品", desc: "棍法與重刀傷害 +40%，但身法 -15。", stats: { speed: -15 }, bluntDmgAdd: 0.4 },
  { id: "t_040", name: "快劍無痕", rarity: "良品", desc: "劍法出招頻率提升 35%，但無法造成暴擊。", stats: {}, swordSpeedBoost: 0.35, noCrit: true },

  // 66 ~ 100 詛咒殘缺
  { id: "t_066", name: "先天殘疾", rarity: "凡品", desc: "身法 -25，閃避率強制歸零。", stats: { speed: -25 }, noDodge: true },
  { id: "t_067", name: "筋脈瘀阻", rarity: "凡品", desc: "內功 -20，打坐無法自然產出修為。", stats: { inner: -20 }, noMeditateExp: true },
  { id: "t_068", name: "愚笨如牛", rarity: "凡品", desc: "悟性 -30，修煉武學消耗修為翻倍。", stats: { int: -30 }, doubleKfCost: true },
  { id: "t_069", name: "厄運纏身", rarity: "凡品", desc: "福緣 -35，寶箱永遠無法開出神品物事。", stats: { luck: -35 }, noGodDrop: true },
  { id: "t_070", name: "枯木朽體", rarity: "凡品", desc: "氣血上限 -40%，受到暴擊時傷害 +50%。", stats: {}, hpPct: -0.4 },
  { id: "t_071", name: "軟骨之毒", rarity: "凡品", desc: "臂力 -25，歷練單擊威力減半。", stats: { arm: -25 }, towerClickHalf: true },
  { id: "t_072", name: "散功之兆", rarity: "凡品", desc: "每次通關一層通天塔，扣減 2 點修為。", stats: {}, towerExpLoss: 2 },
  { id: "t_073", name: "窮困潦倒", rarity: "凡品", desc: "開局銀兩為 0，且無法在門派領取例銀俸祿。", stats: {}, zeroStartGold: true, noSectDaily: true },
  { id: "t_074", name: "招架無力", rarity: "凡品", desc: "格擋招架率降為 0%。", stats: {}, noParry: true },
  { id: "t_075", name: "近視俠客", rarity: "凡品", desc: "攻擊命中率降低 25%。", stats: {}, hitPenalty: 25 },

  // 101 ~ 130 基礎屬性特化
  { id: "t_101", name: "天生神力", rarity: "良品", desc: "臂力 +15。", stats: { arm: 15 } },
  { id: "t_102", name: "燕子翻身", rarity: "良品", desc: "身法 +15。", stats: { speed: 15 } },
  { id: "t_103", name: "鐵骨錚錚", rarity: "良品", desc: "根骨 +15。", stats: { bone: 15 } },
  { id: "t_104", name: "氣海充盈", rarity: "良品", desc: "內功 +15。", stats: { inner: 15 } },
  { id: "t_105", name: "靈光乍現", rarity: "良品", desc: "悟性 +15。", stats: { int: 15 } },
  { id: "t_106", name: "吉星高照", rarity: "良品", desc: "福緣 +15。", stats: { luck: 15 } },
  { id: "t_107", name: "銅皮鐵骨", rarity: "良品", desc: "基礎防禦 +12，氣血 +80。", stats: {}, defAdd: 12, hpAdd: 80 },
  { id: "t_108", name: "長生脈象", rarity: "良品", desc: "基礎氣血上限 +150。", stats: {}, hpAdd: 150 },
  { id: "t_109", name: "說書常客", rarity: "良品", desc: "客棧聽書獲得學點額外 +15 點。", stats: {}, storytellerBonus: 15 },
  { id: "t_110", name: "門派親善", rarity: "良品", desc: "宗門例銀俸祿每次額外多領 15 兩、20 學點。", stats: {}, sectDailyBonusGold: 15, sectDailyBonusLearn: 20 },

  // 131 ~ 150 奇門秘術
  { id: "t_131", name: "雙生武脈", rarity: "神品", desc: "招式壹與招式貳共享 ATB 充能蓄力進度。", stats: {}, shareAtb: true },
  { id: "t_132", name: "兵器大師", rarity: "神品", desc: "任何武學皆視為與當前佩戴兵刃 100% 契合。", stats: {}, allWeaponCompatible: true },
  { id: "t_133", name: "以巧破千斤", rarity: "絕品", desc: "身法高於目標時，差值轉化為外攻傷害。", stats: {}, speedDiffToAtk: true },
  { id: "t_134", name: "仙人指路", rarity: "絕品", desc: "通天塔每 10 層自動跳過 1 層普通怪物。", stats: {}, towerSkipFloor: true },
  { id: "t_135", name: "萬劍歸宗", rarity: "神品", desc: "裝備劍類武器時，歷練自動攻擊追加一道飛劍劍氣。", stats: {}, swordFlyingVfx: true },
  { id: "t_136", name: "純陽罡氣", rarity: "絕品", desc: "受到暴擊傷害時反彈 50% 傷害給對手。", stats: {}, reflectCritPct: 0.5 },
  { id: "t_137", name: "輪迴印記", rarity: "上品", desc: "每轉世重修一次，全先天屬性基礎 +2 點。", stats: {}, reinScale: 2 }
];

// 動態填補至 150 種多樣化天賦 (程式保證陣列長度嚴格為 150 項)
(function populateRemainingTalents() {
  const titles = ["玄冥", "赤霄", "游龍", "百勝", "碎星", "問心", "無相", "斷空", "破妄", "太清", "歸元", "青雲", "撼地", "絕影", "梵天"];
  const types = ["氣勁", "刀意", "劍心", "身法", "橫練", "指風", "拳綱", "護體", "心念", "奇門"];
  let curCount = GLOBAL_TALENTS.length;

  for (let i = curCount + 1; i <= 150; i++) {
    const tName = titles[(i * 3) % titles.length] + types[(i * 7) % types.length];
    const statKey = ['arm', 'speed', 'bone', 'inner', 'int', 'luck'][i % 6];
    const statVal = (i % 5 === 0) ? 12 : ((i % 2 === 0) ? 8 : -6);
    const rarity = statVal > 10 ? "上品" : (statVal > 0 ? "良品" : "凡品");

    GLOBAL_TALENTS.push({
      id: `t_${String(i).padStart(3, '0')}`,
      name: `【${rarity}】${tName}`,
      rarity: rarity,
      desc: statVal > 0 ? `體悟前代名宿心境，先天【${statKey}】+${statVal}。` : `受宿命心魔牽絆，先天【${statKey}】${statVal}。`,
      stats: { [statKey]: statVal }
    });
  }
})();

window.GLOBAL_TALENTS = GLOBAL_TALENTS;