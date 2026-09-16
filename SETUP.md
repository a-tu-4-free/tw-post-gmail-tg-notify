# Setup Guide

本文件說明如何從零開始建立 Gmail → Telegram Notifier。

## 1. 建立 Google Apps Script

前往 Google Apps Script：

https://script.google.com/

建立一個新的 Apps Script 專案。

建議專案名稱：

```text
Gmail → Telegram Notifier
```

---

## 2. 建立 Code.gs

在 GitHub Repository 中開啟：

```text
Code.gs
```

將完整程式碼複製下來。

回到 Google Apps Script：

1. 開啟 `Code.gs`
2. 刪除原本內容
3. 貼上 GitHub 的 `Code.gs`
4. 儲存

---

## 3. 建立 Index.html

在 Google Apps Script 左側：

```text
+
→ HTML
```

建立：

```text
Index
```

然後將 GitHub Repository 中的：

```text
Index.html
```

完整複製到 Apps Script 的 `Index.html`。

完成後專案應該有：

```text
Code.gs
Index.html
```

---

## 4. 設定 appsscript.json

Google Apps Script 左側：

```text
Project Settings
```

開啟：

```text
Show "appsscript.json" manifest file in editor
```

回到編輯器後會看到：

```text
appsscript.json
```

將 GitHub Repository 中的 `appsscript.json` 完整複製進去。

目前使用的設定包含：

* Gmail 存取權限
* 外部連線權限
* Script Trigger 權限
* Asia/Taipei 時區
* V8 Runtime

---

## 5. 設定 Telegram

開始之前，請先準備：

* Telegram Bot Token
* Telegram Group Chat ID

取得方式請參考：

**[TELEGRAM_SETUP.md](TELEGRAM_SETUP.md)**

---

## 6. 設定 Script Properties

Google Apps Script：

```text
Project Settings
→ Script Properties
```

建立必要的設定。

主要設定如下：

| Property                | 說明                       |
| ----------------------- | ------------------------ |
| `TG_BOT_TOKEN`          | Telegram Bot Token       |
| `TG_CHAT_ID`            | Telegram 群組 Chat ID      |
| `INITIAL_HISTORY_HOURS` | Gmail 初次初始化時要忽略的歷史郵件時間   |
| `NOTIFICATION_START`    | 開始通知時間                   |
| `NOTIFICATION_END`      | 結束通知時間                   |
| `NOTIFICATION_ENABLED`  | 是否啟用通知                   |
| `INCLUDE_GMAIL_LINK`    | Telegram 是否包含 Gmail 郵件連結 |

### 安全注意事項

**不要把 Bot Token 寫進 `Code.gs`。**

Token 應該只放在自己的：

```text
Script Properties
```

不要將 Token：

* 上傳 GitHub
* 貼到公開論壇
* 傳給其他人
* 放進前端 HTML

---

## 7. 儲存並授權

第一次執行程式時，Google 可能要求授權。

依照畫面完成 Google 帳號授權。

本專案需要使用：

* Gmail
* Google Apps Script
* 外部 HTTP Request
* 時間觸發器

這些權限是 Gmail → Telegram 自動通知所需要的。

---

## 8. 部署 Web App

在 Google Apps Script：

```text
Deploy
→ New deployment
```

選擇：

```text
Web app
```

設定：

```text
Execute as:
Me

Who has access:
依自己的使用方式選擇
```

然後按：

```text
Deploy
```

Google 會產生一個 Web App URL。

開啟這個 URL，就可以看到本專案的設定介面。

---

## 9. 開啟 Web App 設定

進入 Web App 後，可以確認：

* Gmail 初始化狀態
* Telegram Token 是否已設定
* Telegram Chat ID 是否已設定
* 通知時間
* 通知開關
* Gmail 連結設定

也可以使用：

```text
Test Telegram
```

確認 Telegram Bot 是否能正常發送訊息。

---

## 10. 初始化 Gmail

第一次使用時，先執行：

```text
Initialize Gmail
```

系統會初始化 Gmail 的監控狀態。

如果：

```text
INITIAL_HISTORY_HOURS = 0
```

代表初始化時不處理舊的歷史郵件。

之後新收到的符合條件郵件才會進入通知流程。

---

## 11. 建立時間觸發器

Google Apps Script：

```text
Triggers
→ Add Trigger
```

設定：

```text
Choose which function to run:
checkPostMailAndTelegramNotify
```

Event source：

```text
Time-driven
```

選擇：

```text
Every minute
```

儲存。

之後 Google Apps Script 就會定期執行 Gmail 檢查。

---

## 12. 測試

完成設定後，可以寄一封符合條件的測試郵件到 Gmail。

系統流程：

```text
Gmail
  ↓
Google Apps Script
  ↓
檢查未讀郵件
  ↓
確認寄件者
  ↓
確認通知時間
  ↓
Telegram Bot API
  ↓
Telegram 群組
```

如果條件符合，Telegram 群組就會收到通知。

---

## 13. 如果沒有收到通知

依序檢查：

### Telegram Token

確認：

```text
TG_BOT_TOKEN
```

是否正確。

### Chat ID

確認：

```text
TG_CHAT_ID
```

是否為正確的 Telegram 群組 Chat ID。

### Bot 是否在群組

確認 Telegram Bot 已加入目標群組。

### 通知是否啟用

確認：

```text
NOTIFICATION_ENABLED
```

不是停用狀態。

### 通知時間

確認目前時間位於：

```text
NOTIFICATION_START
～
NOTIFICATION_END
```

範圍內。

### Gmail 是否初始化

確認 Web App 顯示 Gmail 已初始化。

### Trigger

確認 Google Apps Script：

```text
Triggers
```

裡面存在：

```text
checkPostMailAndTelegramNotify
```

並且設定為每分鐘執行。

---

## 14. 修改程式碼

如果 GitHub Repository 更新了程式碼：

1. 開啟 GitHub 最新版本
2. 複製更新後的 `Code.gs`
3. 貼到自己的 Google Apps Script
4. 儲存
5. 建立新的版本
6. 更新 Web App deployment

### 注意

Google Apps Script 的 Web App Deployment 可能仍然指向舊版本。

如果修改程式碼後 Web App 沒有變化，請確認：

```text
Deploy
→ Manage deployments
→ Edit
→ New version
→ Deploy
```

---

## 15. 完成

完成以上設定後：

```text
Gmail
   ↓
Google Apps Script
   ↓
Telegram Bot
   ↓
Telegram Group
```

即可自動運作。

使用者自己的 Gmail、Google Apps Script、Telegram Bot Token 和 Chat ID 都由使用者自行管理。

本專案不需要另外建立伺服器。
