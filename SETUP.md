# Gmail → Telegram 通知系統安裝流程

本文件提供從零開始的完整安裝順序。

---

# Step 1：建立 Telegram Bot

使用 Telegram Web：

```text
https://web.telegram.org/
```

搜尋：

```text
@BotFather
```

輸入：

```text
/newbot
```

依照指示建立 Bot。

取得：

```text
Bot Token
```

---

# Step 2：建立 Telegram 群組

在 Telegram Web 建立群組。

例如：

```text
Gmail通知
```

將剛剛建立的 Bot 加入群組。

---

# Step 3：取得 Chat ID

在群組中傳送測試訊息。

再使用：

```text
https://api.telegram.org/bot你的TOKEN/getUpdates
```

查看：

```text
message.chat.id
```

例如：

```text
-1001234567890
```

這就是 Chat ID。

---

# Step 4：建立 Google Apps Script

開啟：

```text
https://script.google.com/
```

建立新專案。

---

# Step 5：加入程式

加入：

```text
Code.gs
Index.html
appsscript.json
```

依 GitHub Repository 中目前版本為準。

---

# Step 6：授權

第一次執行 Apps Script 函式時，Google 會要求授權。

完成 Gmail / Script / 外部連線等必要授權。

---

# Step 7：設定 Script Properties

進入：

```text
Project Settings
→ Script Properties
```

設定：

```text
TG_BOT_TOKEN
TG_CHAT_ID
INITIAL_HISTORY_HOURS
NOTIFICATION_START
NOTIFICATION_END
NOTIFICATION_ENABLED
INCLUDE_GMAIL_LINK
```

建議第一次：

```text
INITIAL_HISTORY_HOURS=0
NOTIFICATION_ENABLED=true
```

例如：

```text
NOTIFICATION_START=08:00
NOTIFICATION_END=23:00
```

---

# Step 8：測試 Telegram

使用 Web App 中的：

```text
測試 Telegram
```

確認 Telegram 群組收到測試訊息。

如果沒有收到：

```text
檢查 Bot Token
檢查 Chat ID
檢查 Bot 是否加入群組
```

---

# Step 9：初始化 Gmail

第一次使用時執行：

```text
Gmail 初始化
```

初始化的主要目的是避免舊郵件大量觸發通知。

如果：

```text
INITIAL_HISTORY_HOURS=0
```

則第一次啟動主要是建立安全的初始狀態，而不是將歷史郵件全部發送。

---

# Step 10：建立時間觸發器

Google Apps Script：

```text
Triggers
→ Add Trigger
```

選擇 Gmail 檢查函式。

時間類型：

```text
Time-driven
```

間隔：

```text
Every minute
```

---

# Step 11：部署 Web App

選擇：

```text
Deploy
→ New deployment
```

類型：

```text
Web app
```

設定執行身分與存取權限。

部署後取得：

```text
Web App URL
```

---

# Step 12：測試完整流程

現在寄一封符合條件的測試郵件到 Gmail。

例如：

```text
中華郵政測試通知
```

等待 Trigger 執行。

完整流程應該是：

```text
Gmail
 ↓
Google Apps Script
 ↓
Gmail 搜尋
 ↓
判斷寄件人
 ↓
Telegram Bot API
 ↓
Telegram 群組
```

---

# Step 13：確認狀態

在 Web App 查看：

```text
Gmail 初始化
```

應顯示：

```text
已初始化
```

同時可以查看：

```text
最後檢查
最後通知
```

---

# Step 14：正式使用

確認測試成功後：

```text
Telegram Bot
+
Google Apps Script
+
Gmail
+
Time Trigger
```

即可持續自動運作。

---

# 常見問題

## Q：一定要開著瀏覽器嗎？

不需要。

Google Apps Script 的時間觸發器會在 Google 伺服器端執行。

---

## Q：一定要開著 Telegram Web 嗎？

不需要。

Telegram Web 只是在設定 Bot、群組與 Chat ID 時方便操作。

Bot API 本身由 Google Apps Script 直接呼叫。

---

## Q：一定要開著 Gmail 嗎？

不需要。

Google Apps Script 使用 GmailApp 存取 Gmail。

---

## Q：Bot Token 可以放 GitHub 嗎？

不可以。

Token 應放在：

```text
Script Properties
```

---

## Q：Chat ID 可以放 GitHub 嗎？

不建議。

即使 Chat ID 本身通常不像 Bot Token 那麼敏感，也應與實際使用者設定分離。

---

## Q：修改通知時間需要重新部署嗎？

如果只是修改 Script Properties：

```text
NOTIFICATION_START
NOTIFICATION_END
```

通常不需要重新部署程式。

---

## Q：修改 Code.gs 需要重新部署嗎？

如果 Web App 使用版本部署：

```text
需要更新 Deployment
```

尤其是修改：

```text
Index.html
```

後，如果網頁仍顯示舊版本，請檢查：

```text
Deploy
→ Manage deployments
→ 最新版本
```

---

# 最終架構

```text
                    GitHub
                       │
                程式碼 / 文件
                       │
                       ▼
              Google Apps Script
                       │
        ┌──────────────┼──────────────┐
        │              │              │
      Gmail      Script Properties   Trigger
        │              │              │
        │         ┌────┴────┐         │
        │         │         │         │
        │       TG Token  Chat ID     │
        │         │         │         │
        └─────────┴────┬────┴─────────┘
                       │
                       ▼
                Telegram Bot API
                       │
                       ▼
                 Telegram 群組
```

---

# 完成

完成以上設定後，系統即可在 Google Apps Script 雲端自動執行，不需要個人電腦持續開機。

GitHub 負責：

```text
程式碼
文件
版本管理
```

Google Apps Script 負責：

```text
Gmail
執行程式
Trigger
Web App
Script Properties
```

Telegram 負責：

```text
即時通知
```
