# Gmail → Telegram Notifier

使用 **Google Apps Script + Gmail + Telegram Bot API**，自動監控 Gmail，並將符合條件的郵件通知到 Telegram 群組。

## Features

* 📧 Gmail 自動監控
* 🤖 Telegram Bot 通知
* ⏱️ 每分鐘自動檢查
* 🔐 Token 使用 Script Properties 儲存
* 🌐 Google Apps Script Web App 設定介面
* 🔄 Telegram 發送失敗自動重試
* 🔒 LockService 避免重複執行

## How It Works

```text
Gmail
  ↓
Google Apps Script
  ↓
Filter
  ↓
Telegram Bot API
  ↓
Telegram Group
```

## Quick Start

1. 建立 Telegram Bot 並取得 Bot Token
2. 建立 Telegram 群組並取得 Chat ID
3. 建立 Google Apps Script
4. 複製本專案的 `Code.gs`
5. 建立 `Index.html` 並複製程式碼
6. 設定 `appsscript.json`
7. 完成 Script Properties 設定
8. 部署 Web App
9. 建立時間觸發器
10. 測試 Telegram 通知

完整安裝方式：

**[SETUP.md](SETUP.md)**

Telegram Bot 與 Chat ID 設定：

**[TELEGRAM_SETUP.md](TELEGRAM_SETUP.md)**

## Security

請勿將以下資訊公開或提交到 GitHub：

* Telegram Bot Token
* API Key
* OAuth credentials
* 其他私人憑證

本專案使用 Google Apps Script 的 **Script Properties** 儲存敏感設定。

每個使用者都在自己的 Google Apps Script 帳號中執行本專案，作者不會取得使用者的 Gmail、Telegram Token 或 Chat ID。

## License

MIT License
