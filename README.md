# Gmail → Telegram 通知系統

一套使用 **Google Apps Script + Gmail + Telegram Bot API** 建立的自動通知系統。

系統會定期檢查 Gmail，符合指定條件的郵件會自動透過 Telegram Bot 發送到指定的 Telegram 群組。

本專案特別適合用於：

* Gmail 郵件即時通知
* 中華郵政郵件通知
* 系統通知
* 訂單通知
* 工作郵件提醒
* 特定寄件人通知
* 特定關鍵字郵件通知

目前版本主要用途為：

> **偵測 Gmail 中的中華郵政郵件，並透過 Telegram Bot 通知指定群組。**

---

## 一、系統架構

```text
Gmail
  │
  │ GmailApp
  ▼
Google Apps Script
  │
  ├── 搜尋 Gmail
  ├── 判斷寄件人
  ├── 判斷通知時間
  ├── 防止重複通知
  └── 建立 Telegram 訊息
          │
          │ HTTPS
          ▼
Telegram Bot API
          │
          ▼
Telegram 群組
```

系統不需要另外架設 VPS 或資料庫。

主要執行環境為 Google Apps Script。

---

## 二、主要功能

### Gmail

* 使用 Google Apps Script 直接存取 Gmail
* 不需要 Gmail Advanced Service
* 不需要自行建立 Gmail API Server
* 可以搜尋未讀郵件
* 可以依寄件人判斷是否符合通知條件
* 支援初始化機制
* 避免第一次執行時大量通知歷史郵件

### Telegram

* 使用 Telegram Bot API
* 將符合條件的 Gmail 郵件通知到 Telegram 群組
* 支援 Bot Token
* 支援 Chat ID
* Telegram 發送失敗時不會立即將郵件視為成功處理
* 支援 Telegram API 暫時性錯誤重試

### Web 設定介面

Google Apps Script Web App 提供設定頁面，可管理：

* Telegram Bot Token
* Telegram Chat ID
* 歷史郵件初始化設定
* 通知時間
* 是否啟用通知
* 是否附加 Gmail 郵件連結
* Gmail 初始化狀態
* 最後檢查時間
* 最後通知時間

---

## 三、安全設計

本專案將：

> **程式碼與設定資料分離。**

程式碼可以放在 GitHub。

但是以下資料不應該寫入程式碼：

* Telegram Bot Token
* Telegram Chat ID
* Gmail 個人帳號資訊
* 其他私人 API Key
* 個人帳號憑證
* OAuth 憑證

Telegram Bot Token 等敏感資料應存放在：

**Google Apps Script → Script Properties**

而不是 `Code.gs`。

---

## 四、Google Apps Script

本專案使用 Google Apps Script 作為主要執行環境。

Google Apps Script 提供：

* Gmail 存取
* Script Properties
* Time-driven Trigger
* Web App
* HTTP Request
* Telegram Bot API 通訊

主要使用的 Apps Script 服務包括：

```text
GmailApp
PropertiesService
ScriptApp
LockService
UrlFetchApp
HtmlService
```

---

## 五、執行方式

系統透過 Google Apps Script 的時間觸發器定期執行。

目前預設：

```text
每 1 分鐘執行一次
```

執行後：

1. 取得 Script Properties
2. 確認通知功能是否啟用
3. 確認 Gmail 是否已初始化
4. 確認目前是否在通知時間範圍
5. 搜尋 Gmail
6. 找出符合條件的郵件
7. 判斷是否為指定寄件人
8. 建立 Telegram 訊息
9. 呼叫 Telegram Bot API
10. Telegram 成功後才記錄通知狀態

---

## 六、目前通知邏輯

目前主要偵測：

```text
中華郵政相關寄件人
```

實際寄件人判斷條件由 `Code.gs` 中的設定控制。

未來可以擴充：

* 指定 Email
* 指定 Email 網域
* 主旨關鍵字
* 寄件人關鍵字
* 多個通知群組
* 不同郵件發送不同 Telegram 群組

---

## 七、Google Apps Script Web App

本專案另外提供 Web App 設定介面。

部署後可以使用瀏覽器開啟：

```text
https://script.google.com/macros/s/你的_DEPLOYMENT_ID/exec
```

透過網頁設定 Telegram 與 Gmail 通知。

---

## 八、專案設定資料

設定資料主要儲存在：

```text
Google Apps Script
→ Project Settings
→ Script Properties
```

例如：

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

其中：

### TG_BOT_TOKEN

Telegram Bot API Token。

### TG_CHAT_ID

Telegram 群組 Chat ID。

### INITIAL_HISTORY_HOURS

第一次初始化時要忽略的歷史郵件時間。

如果設定：

```text
0
```

代表不通知舊有歷史郵件。

### NOTIFICATION_START

通知開始時間。

例如：

```text
08:00
```

### NOTIFICATION_END

通知結束時間。

例如：

```text
23:00
```

### NOTIFICATION_ENABLED

是否啟用通知。

```text
true
false
```

### INCLUDE_GMAIL_LINK

Telegram 通知是否附加 Gmail 連結。

### GMAIL_INITIALIZED

Gmail 初始化狀態。

### LAST_CHECK

最後一次實際檢查 Gmail 的時間。

### LAST_NOTIFY

最後一次成功發送 Telegram 通知的時間。

---

## 九、第一次使用

第一次使用時，建議依照以下順序：

```text
1. 建立 Telegram Bot
2. 取得 Bot Token
3. 建立 Telegram 群組
4. 將 Bot 加入群組
5. 取得 Chat ID
6. 建立 Google Apps Script
7. 上傳程式
8. 設定 Script Properties
9. 執行初始化
10. 建立時間觸發器
11. 部署 Web App
12. 測試 Telegram
13. 寄一封測試 Gmail
```

詳細步驟請參考：

* `GOOGLE_APPS_SCRIPT.md`
* `TELEGRAM_SETUP.md`
* `SETUP.md`

---

## 十、GitHub 使用方式

GitHub 主要保存：

* 程式碼
* 文件
* 版本紀錄
* 設定說明
* 開發紀錄

GitHub 不應保存：

* Telegram Bot Token
* Gmail 帳號密碼
* OAuth Token
* 私人 API Key
* 其他敏感資訊

---

## 十一、目前技術

```text
Google Apps Script
GmailApp
Telegram Bot API
JavaScript
HTML
Google Apps Script Web App
Script Properties
Time-driven Trigger
Git / GitHub
```

---

## 十二、專案特色

本專案不需要：

* VPS
* MySQL
* Redis
* Gmail Advanced Service
* Gmail API Server
* Telegram 第三方服務

主要由 Google Apps Script 執行。

因此可以非常簡單地部署給個人使用。

---

## 十三、授權

本專案的程式碼與文件授權方式請依 GitHub Repository 中的 `LICENSE` 為準。
