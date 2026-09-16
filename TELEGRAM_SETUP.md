# Telegram Bot 設定教學

本文件說明如何建立 Telegram Bot、取得 Bot Token、建立群組以及取得 Telegram Chat ID。

本專案使用：

> Telegram Bot API

作為 Gmail → Telegram 的通知管道。

---

# 一、建立 Telegram Bot

Telegram Bot 必須透過：

**BotFather**

建立。

即使使用 Telegram Web，也可以直接操作。

Telegram Web：

```text
https://web.telegram.org/
```

登入 Telegram Web 後，在搜尋欄搜尋：

```text
@BotFather
```

確認是官方 BotFather。

---

# 二、建立新的 Bot

在 BotFather 對話中輸入：

```text
/newbot
```

BotFather 會要求輸入：

## 1. Bot 顯示名稱

例如：

```text
Gmail Notify Bot
```

這個名稱可以自行設定。

---

## 2. Bot Username

例如：

```text
gmail_notify_example_bot
```

Bot Username 必須符合 Telegram 的命名規則，通常需要以：

```text
bot
```

結尾。

例如：

```text
gmail_notify_bot
```

建立成功後，BotFather 會提供一組：

```text
HTTP API Token
```

格式通常類似：

```text
123456789:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

# 三、Bot Token 是什麼？

Bot Token 是 Telegram Bot 呼叫 API 時使用的身分憑證。

本專案會使用：

```text
https://api.telegram.org/bot<TOKEN>/sendMessage
```

呼叫 Telegram API。

例如：

```text
https://api.telegram.org/bot123456789:xxxxxxxx/sendMessage
```

但是：

> 不要把真正的 Token 寫入 GitHub。

也不要：

* 貼到公開聊天室
* 放在 `Code.gs`
* 放在 `README.md`
* 放在 GitHub Issue
* 放在 GitHub Commit
* 放在公開網站 JavaScript
* 截圖公開 Token

本專案應將 Token 儲存在：

```text
Google Apps Script
→ Project Settings
→ Script Properties
→ TG_BOT_TOKEN
```

---

# 四、建立 Telegram 群組

使用 Telegram Web：

1. 開啟 Telegram
2. 建立新的群組
3. 加入自己
4. 將剛剛建立的 Bot 加入群組

例如建立：

```text
Gmail通知群組
```

---

# 五、將 Bot 加入群組

在 Telegram 群組中：

```text
群組資訊
→ 成員
→ 新增成員
```

搜尋剛剛建立的 Bot Username。

例如：

```text
@gmail_notify_bot
```

將 Bot 加入群組。

---

# 六、Chat ID

Telegram Bot API 發送訊息時，除了 Token 外，還需要：

```text
chat_id
```

這就是：

> 要把訊息送到哪裡。

例如：

```text
-1001234567890
```

Telegram 群組 Chat ID 通常是負數。

大型超級群組通常會看到：

```text
-100xxxxxxxxxx
```

---

# 七、取得 Chat ID

最簡單的方法之一，是先把 Bot 加入目標群組。

接著在群組中傳送一則訊息。

例如：

```text
測試
```

然後使用 Telegram Bot API：

```text
https://api.telegram.org/bot你的TOKEN/getUpdates
```

注意：

```text
你的TOKEN
```

必須替換成真正的 Bot Token。

例如：

```text
https://api.telegram.org/bot123456789:AAxxxxxxxx/getUpdates
```

---

# 八、使用 Telegram Web 操作

如果你主要使用：

```text
Telegram Web
```

完全沒有問題。

Telegram Web 本身就是 Telegram 官方 Web 介面。

Bot 建立、加入群組、傳送訊息等操作都可以透過 Telegram Web 完成。

但是取得 Bot API `getUpdates` 時，可以直接將 API URL 貼到瀏覽器網址列。

---

# 九、解析 getUpdates

成功後通常會看到 JSON。

例如：

```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456789,
      "message": {
        "chat": {
          "id": -1001234567890,
          "title": "Gmail通知群組",
          "type": "supergroup"
        }
      }
    }
  ]
}
```

注意：

```text
"chat": {
    "id": -1001234567890
}
```

這個：

```text
-1001234567890
```

就是 Chat ID。

---

# 十、如果 getUpdates 沒有資料

可能原因包括：

### 1. Bot 還沒有加入群組

確認 Bot 已經加入。

### 2. 群組中沒有新的訊息

在群組中傳送一則測試訊息。

例如：

```text
test
```

再重新開啟：

```text
getUpdates
```

### 3. Bot 隱私模式

某些群組情況下，Bot 的 Privacy Mode 可能影響它能接收到的訊息。

可以在：

```text
@BotFather
```

使用：

```text
/mybots
```

選擇自己的 Bot，再進入 Bot Settings / Group Privacy 相關設定。

如果需要讓 Bot 接收群組中的一般訊息，可以依實際需求調整。

---

# 十一、取得 Chat ID 後

將 Chat ID 填入 Google Apps Script：

```text
TG_CHAT_ID
```

例如：

```text
-1001234567890
```

不要把真正的 Chat ID 寫進 GitHub 文件。

---

# 十二、測試 Telegram Bot API

可以先測試：

```text
getMe
```

瀏覽器輸入：

```text
https://api.telegram.org/bot你的TOKEN/getMe
```

如果成功，應看到：

```json
{
  "ok": true,
  "result": {
    "id": 123456789,
    "is_bot": true,
    "first_name": "Gmail Notify Bot",
    "username": "gmail_notify_bot"
  }
}
```

這代表：

```text
Bot Token 正常
Telegram API 可以使用
```

---

# 十三、測試發送訊息

Telegram Bot API 的主要方法：

```text
sendMessage
```

API：

```text
https://api.telegram.org/bot<TOKEN>/sendMessage
```

需要：

```text
chat_id
text
```

本專案由 Google Apps Script 使用 `UrlFetchApp` 發送，不需要手動建立 API Server。

---

# 十四、Telegram API 與本專案的關係

完整流程：

```text
Gmail
 ↓
Google Apps Script
 ↓
UrlFetchApp
 ↓
Telegram Bot API
 ↓
Telegram Bot
 ↓
Telegram 群組
```

Google Apps Script 不直接連 Telegram App。

而是呼叫：

```text
Telegram Bot API
```

---

# 十五、安全注意事項

Telegram Bot Token 等同於 Bot 的重要身分憑證。

如果 Token 外洩，其他人可能可以利用該 Token 操作 Bot。

因此：

```text
不要上 GitHub
不要放前端 HTML
不要放公開 JavaScript
不要貼到公開論壇
不要放 README
```

本專案的 Web 設定頁也不會將完整 Bot Token 回傳給瀏覽器，而是只顯示遮蔽後的資訊。

---

# 十六、Token 外洩怎麼辦？

如果 Bot Token 不小心公開：

立即使用：

```text
@BotFather
```

重新產生 / 撤銷舊 Token。

之後將新的 Token 更新到：

```text
Google Apps Script
→ Script Properties
→ TG_BOT_TOKEN
```

不要只是把 GitHub 裡的文字刪除。

因為 Git 歷史可能仍然保留舊 Token。

---

# 十七、快速檢查表

完成 Telegram 設定後：

```text
□ 已建立 Bot
□ 已取得 Bot Token
□ Bot 已加入群組
□ 群組中有測試訊息
□ 已取得 Chat ID
□ TG_BOT_TOKEN 已設定
□ TG_CHAT_ID 已設定
□ getMe 測試成功
□ Google Apps Script Telegram 測試成功
```

完成後即可進行 Gmail 測試。
