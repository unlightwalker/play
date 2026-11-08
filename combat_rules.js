/**
 * ========================================================
 * 你的江湖 - IF 特異規則定義 (combat_rules.js)
 * 遊戲 (combat.js) 與編輯器 (editor.html) 共用同一份清單，
 * 編輯器能選的選項 = 戰鬥引擎實際支援的效果。
 *
 * 規則格式：{ trigger, chance, target, action, val, turns, once }
 *   chance : 觸發機率 %（預設 100）
 *   target : "自身" | "敵方單體"
 *   val    : 數值，可填固定值 (25) 或百分比 (15%)
 *   turns  : 持續回合（僅狀態類效果；留空用預設）
 *   once   : true = 每場戰鬥限觸發一次
 * ========================================================
 */

const IF_RULE_TRIGGERS = [
  { key: "戰鬥開始時", desc: "雙方交鋒的第一刻" },
  { key: "每回合開始時", desc: "輪到自己行動時" },
  { key: "進行普通攻擊時", desc: "出普攻的瞬間（命中前）" },
  { key: "施展外功時", desc: "施展外功招式的瞬間（命中前）" },
  { key: "命中敵人時", desc: "普攻或招式造成傷害後" },
  { key: "攻擊落空時", desc: "攻擊未命中或被閃避" },
  { key: "達成暴擊時", desc: "招式打出暴擊" },
  { key: "受到攻擊時", desc: "被對手擊中" },
  { key: "成功招架時", desc: "格擋住對手攻擊" },
  { key: "閃避攻擊時", desc: "閃開對手攻擊" },
  { key: "擺出防禦架勢時", desc: "真氣防禦 / 輕靈閃避 / 武功格擋" },
  { key: "運氣調息時", desc: "戰鬥中運氣回內力" },
  { key: "氣血高於80%時", desc: "每回合開始時判定" },
  { key: "氣血低於50%時", desc: "每回合開始時判定" },
  { key: "氣血低於30%時", desc: "每回合開始時判定" },
  { key: "內力低於30%時", desc: "每回合開始時判定" },
  { key: "擊敗敵人時", desc: "戰鬥勝利的瞬間（僅玩家）" }
];

const IF_RULE_TARGETS = [["自身", "自身"], ["敵方單體", "敵方"]];

/**
 * cat   : 即時 / 增益 / 減益
 * unit  : 數值說明（編輯器提示）
 * turns : 狀態類預設持續回合
 * short : 戰鬥中狀態標籤
 */
const IF_RULE_ACTIONS = [
  // ---- 即時效果 ----
  { key: "回復氣血", cat: "即時", unit: "固定值，或 % 最大氣血" },
  { key: "扣除氣血", cat: "即時", unit: "固定值，或 % 最大氣血" },
  { key: "回復內力", cat: "即時", unit: "固定值，或 % 最大內力" },
  { key: "扣除內力", cat: "即時", unit: "固定值，或 % 最大內力" },
  { key: "吸收傷害化為罡氣盾", cat: "即時", unit: "護盾量：固定值，或 % 最大氣血" },
  { key: "反震傷害", cat: "即時", unit: "固定值，或 % 本次所受傷害" },
  { key: "吸血", cat: "即時", unit: "% 本次造成的傷害（或固定值）" },
  { key: "追加傷害", cat: "即時", unit: "固定值，或 % 自身外攻" },
  { key: "斬殺", cat: "即時", unit: "目標氣血低於此 % 時直接擊倒（首領 / 掌門門檻減半）" },
  { key: "行動條加速", cat: "即時", unit: "% 行動條（立即增加）" },
  { key: "行動條延遲", cat: "即時", unit: "% 行動條（立即減少）" },
  { key: "驅散負面狀態", cat: "即時", unit: "（不需數值）移除目標所有減益" },
  { key: "化解增益狀態", cat: "即時", unit: "（不需數值）移除目標所有增益" },

  // ---- 增益（持續回合）----
  { key: "提升攻擊", cat: "增益", unit: "外攻 +%", turns: 3, short: "攻↑" },
  { key: "提升防禦", cat: "增益", unit: "防禦 +%", turns: 3, short: "防↑" },
  { key: "暴擊率提升", cat: "增益", unit: "暴擊率 + 百分點", turns: 3, short: "暴↑" },
  { key: "命中率提升", cat: "增益", unit: "命中率 + 百分點", turns: 3, short: "準↑" },
  { key: "閃避率提升", cat: "增益", unit: "閃避率 + 百分點", turns: 3, short: "閃↑" },
  { key: "招架率提升", cat: "增益", unit: "招架率 + 百分點", turns: 3, short: "架↑" },
  { key: "傷害提升", cat: "增益", unit: "造成傷害 +%", turns: 3, short: "勁↑" },
  { key: "減傷", cat: "增益", unit: "受到傷害 -%（最高 80%）", turns: 3, short: "減傷" },
  { key: "身法提升", cat: "增益", unit: "行動條蓄力速度 +%", turns: 3, short: "迅" },
  { key: "每回合回血", cat: "增益", unit: "每回合回復：固定值，或 % 最大氣血", turns: 3, short: "回春" },
  { key: "每回合回內", cat: "增益", unit: "每回合回復：固定值，或 % 最大內力", turns: 3, short: "回氣" },
  { key: "金剛不壞", cat: "增益", unit: "（不需數值）期間免疫一切傷害", turns: 1, short: "不壞" },

  // ---- 減益（持續回合）----
  { key: "降低攻擊", cat: "減益", unit: "外攻 -%", turns: 3, short: "攻↓" },
  { key: "降低防禦", cat: "減益", unit: "防禦 -%（破甲）", turns: 3, short: "破甲" },
  { key: "降低命中", cat: "減益", unit: "命中率 - 百分點", turns: 3, short: "目眩" },
  { key: "身法遲緩", cat: "減益", unit: "行動條蓄力速度 -%", turns: 3, short: "遲緩" },
  { key: "易傷", cat: "減益", unit: "受到傷害 +%", turns: 3, short: "易傷" },
  { key: "中毒", cat: "減益", unit: "每回合扣血：固定值，或 % 最大氣血", turns: 3, short: "毒" },
  { key: "流血", cat: "減益", unit: "每回合扣血：固定值，或 % 最大氣血", turns: 3, short: "血" },
  { key: "內傷", cat: "減益", unit: "每回合扣內力：固定值，或 % 最大內力", turns: 3, short: "內傷" },
  { key: "點穴定身", cat: "減益", unit: "（不需數值）跳過行動", turns: 1, short: "定" },
  { key: "封穴禁招", cat: "減益", unit: "（不需數值）無法施展外功招式", turns: 2, short: "封" }
];

function getIfRuleAction(key) {
  return IF_RULE_ACTIONS.find(a => a.key === key) || null;
}

window.IF_RULE_TRIGGERS = IF_RULE_TRIGGERS;
window.IF_RULE_TARGETS = IF_RULE_TARGETS;
window.IF_RULE_ACTIONS = IF_RULE_ACTIONS;
window.getIfRuleAction = getIfRuleAction;
