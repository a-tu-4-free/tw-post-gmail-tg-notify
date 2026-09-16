# Google Apps Script 設定說明

本專案使用 Google Apps Script 作為 Gmail → Telegram 的主要執行環境。

---

# 一、建立 Google Apps Script

開啟：

```text
https://script.google.com/
```

登入 Google 帳號。

建立新的：

```text
New project
```

建議將專案命名為：

```text
Gmail Telegram Notifier
```

---

# 二、加入程式碼

將專案中的：

```text
Code.gs
```

內容放入 Apps Script。

如果有：

```text
Index.html
```

則在 Apps Script 中建立 HTML 檔案：

```text
+
→ HTML
→ Index
```

然後放入 `Index.html`。

---

# 三、appsscript.json

如果 GitHub 專案包含：

```text
appsscript.json
```

請確認 Apps Script Project Settings 中可以顯示：

```text
Show "appsscript.json" manifest file in editor
```

啟用後即可查看 manifest。

本專案使用 Google Apps Script V8 Runtime。

---

# 四、必要授權

第一次執行需要 Google 授權。

因為本專案需要使用：

```text
GmailApp
PropertiesService
ScriptApp
LockService
UrlFetchApp
```

第一次執行時 Google 可能會顯示授權畫面。

請依照畫面登入並授權。

---

# 五、Script Properties

本專案的重要設定儲存在：

```text
Project Settings
→ Script Properties
```

而不是直接寫在：

```text
Code.gs
```

---

# 六、主要 Script Properties

目前主要使用：

```text
TG_BOT_TOKEN
TG_CHAT_ID
INITIAL_HISTORY_HOURS
NOTIFICATION_START
NOTIFICATION_END
NOTIFICATION_ENABLED
INCLUDE_GMAIL_LINK
GMAIL_INITIALIZED
LAST_CHECK
LAST_NOTIFY
```

---

# 七、Telegram 設定

## TG_BOT_TOKEN

填入 Telegram BotFather 提供的 Token。

例如格式：

```text
123456789:AAxxxxxxxxxxxxxxxx
```

請使用自己的 Token。

---

## TG_CHAT_ID

填入 Telegram 群組 ID。

例如：

```text
-1001234567890
```

---

# 八、Gmail 初始化

第一次啟動時，系統會進行 Gmail 初始化。

主要目的：

> 避免系統第一次啟動時，將 Gmail 裡大量舊郵件全部通知到 Telegram。

例如 Gmail 已經存在：

```text
50 封
100 封
500 封
```

符合條件的舊郵件。

系統不應該因為第一次啟動而一次傳送大量 Telegram 通知。

---

# 九、INITIAL_HISTORY_HOURS

此設定控制初始化時的歷史範圍。

例如：

```text
0
```

代表初始化時不處理舊有歷史郵件。

這是一般第一次部署時較安全的設定。

---

# 十、通知時間

可以設定：

```text
NOTIFICATION_START
NOTIFICATION_END
```

例如：

```text
NOTIFICATION_START=08:00
NOTIFICATION_END=23:00
```

代表：

```text
08:00 ～ 23:00
```

允許發送通知。

本系統也支援跨午夜時間範圍。

例如：

```text
22:00 ～ 07:00
```

代表：

```text
22:00
↓
隔日
↓
07:00
```

---

# 十一、啟用 / 停用

使用：

```text
NOTIFICATION_ENABLED
```

設定。

啟用：

```text
true
```

停用：

```text
false
```

---

# 十二、Gmail 連結

使用：

```text
INCLUDE_GMAIL_LINK
```

控制 Telegram 通知是否包含 Gmail 郵件連結。

例如：

```text
true
```

會在通知中附加 Gmail 郵件連結。

---

# 十三、時間觸發器

本專案使用：

```text
Time-driven Trigger
```

定期執行 Gmail 檢查。

目前預設：

```text
每 1 分鐘
```

---

# 十四、手動建立 Trigger

如果需要手動建立：

Google Apps Script：

```text
Triggers
→ Add Trigger
```

選擇對應的 Gmail 檢查函式。

設定：

```text
Event source:
Time-driven

Type:
Minutes timer

Every minute
```

---

# 十五、Web App 部署

如果需要使用網頁設定介面：

Google Apps Script：

```text
Deploy
→ New deployment
```

選擇：

```text
Web app
```

依照需求設定：

```text
Execute as:
Me
```

以及適當的：

```text
Who has access
```

---

# 十六、取得 Web App URL

部署完成後會取得：

```text
Web app URL
```

格式通常類似：

```text
https://script.google.com/macros/s/XXXXXXXXXXXX/exec
```

之後可以直接使用瀏覽器開啟。

---

# 十七、重要：程式更新後要更新 Deployment

Google Apps Script Web App 使用版本部署。

因此：

```text
修改程式
↓
儲存
↓
建立新版本 / 更新部署
↓
Web App
```

如果修改了：

```text
Code.gs
Index.html
```

但是 Web App 顯示的內容沒有更新，優先檢查：

```text
Deploy
→ Manage deployments
→ 編輯目前 Web App
→ 選擇最新版本
→ Deploy
```

---

# 十八、Web App 與 Script Properties

Script Properties 是：

```text
Script
```

層級的設定。

Web App 本身不是另一套設定資料庫。

因此：

```text
Web App
      ↓
getSettings()
      ↓
Script Properties
```

以及：

```text
時間觸發器
      ↓
checkPostMailAndTelegramNotify()
      ↓
Script Properties
```

都使用同一份設定資料。

---

# 十九、安全注意事項

不要把以下資料寫入 GitHub：

```text
TG_BOT_TOKEN
TG_CHAT_ID
OAuth credentials
Google 帳號資訊
私人 API Key
```

GitHub 應該保存：

```text
Code.gs
Index.html
appsscript.json
README.md
SETUP.md
TELEGRAM_SETUP.md
```

而設定資料則保存於：

```text
Google Apps Script Script Properties
```

---

# 二十、測試順序

建議依序測試：

```text
1. Google Apps Script 授權
2. Script Properties
3. Telegram Bot API
4. Telegram 測試訊息
5. Gmail 初始化
6. Time Trigger
7. Web App
8. Gmail 實際郵件
```

---

# 二十一、確認系統正常

正常情況：

```text
Gmail 收到符合條件的郵件
        ↓
Trigger 執行
        ↓
Google Apps Script 搜尋 Gmail
        ↓
判斷寄件人
        ↓
建立 Telegram 訊息
        ↓
Telegram Bot API
        ↓
Telegram 群組收到通知
```

成功通知後：

```text
LAST_NOTIFY
```

會更新。

而 Gmail 實際檢查時：

```text
LAST_CHECK
```

會更新。

---

# 二十二、Telegram 失敗時

如果 Telegram API 發送失敗：

系統不應該把郵件當成已成功通知。

下一次執行時仍可以重新嘗試。

這可以避免：

```text
Telegram 暫時故障
```

造成：

```text
郵件已被標記完成
但 Telegram 實際沒有收到
```

的問題。

---

# 二十三、LockService

系統使用：

```text
LockService
```

避免兩個 Trigger 同時執行。

例如：

```text
10:00 Trigger
10:00:01 Trigger
```

如果前一次尚未結束，第二次不應該同時進入主要處理流程。

---

# 二十四、故障排查

### Telegram 沒收到

檢查：

```text
TG_BOT_TOKEN
TG_CHAT_ID
Bot 是否在群組
Bot API 是否正常
```

---

### Gmail 沒有通知

檢查：

```text
GMAIL_INITIALIZED
NOTIFICATION_ENABLED
通知時間
寄件人條件
Gmail 是否為未讀
Trigger 是否存在
```

---

### Web App 顯示舊內容

檢查：

```text
Deploy
→ Manage deployments
→ 最新版本
```

---

### Telegram Token 外洩

立即：

```text
BotFather
→ 重新產生 Token
```

再更新：

```text
TG_BOT_TOKEN
```

---

# 二十五、建議

正式使用前建議先建立：

```text
測試 Gmail
+
測試 Telegram 群組
```

確認整個流程正常後，再使用正式群組。

這樣可以避免測試訊息與正式通知混在一起。
