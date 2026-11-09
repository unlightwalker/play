/**
 * ========================================================
 * 你的江湖 - 遊戲設定資料 (data_settings.js)
 * 可在 editor.html「⚙️ 設定」分頁編輯
 * GAME_CONFIG.music：音樂播放清單
 *   bgm  : 純音樂（放在 bgm/ 資料夾）  song : 有人聲的歌曲（放在 song/ 資料夾）
 *   每首 { file: "bgm/檔名.mp3", title: "顯示名稱" }；清單為空時改播內建的古琴旋律
 *   defaultMode：玩家第一次進入時的音樂模式 "bgm" 純音樂 / "song" 音樂 / "none" 無音樂
 * GAME_CONFIG.announcements：設定頁「公告」顯示的內容 [{ date, title, body, pinned }]
 * ========================================================
 */

const GAME_CONFIG = {
  "music": {
    "defaultMode": "bgm",
    "shuffle": true,
    "bgm": [
      {
        "file": "bgm/江湖－純音樂.mp3",
        "title": "江湖－純音樂"
      }
    ],
    "song": [
      {
        "file": "song/江湖.mp3",
        "title": "江湖"
      }
    ]
  },
  "announcements": []
};

window.GAME_CONFIG = GAME_CONFIG;
