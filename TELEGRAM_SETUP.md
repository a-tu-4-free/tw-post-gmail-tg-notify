# Telegram Setup Guide

本文件說明如何使用 **Telegram Web** 建立 Bot、取得 Bot Token，以及取得 Telegram 群組 Chat ID。

---

## 1. 開啟 Telegram Web

使用瀏覽器開啟：

https://web.telegram.org/

登入自己的 Telegram 帳號。

---

## 2. 建立 Telegram Bot

在 Telegram 搜尋：

```text
@BotFather
```

開啟官方 BotFather。

輸入：

```text
/newbot
```

BotFather 會要求輸入兩個名稱。

### Bot Name

輸入 Bot 顯示名稱，例如：

```text
Gmail Notification Bot
```

### Username

輸入 Bot 使用者名稱。

Username 必須以：

```text
bot
```

結尾，例如：

```text
my_gmail_notify_bot
```

完成後 BotFather 會提供一組：

```text
Bot Token
```

格式類似：

```text
1234567890:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

這就是：

```text
TG_BOT_TOKEN
```

---

## 3. 保護 Bot Token

**Bot Token 等同於 Bot 的密碼。**

請不要：

* 上傳到 GitHub
* 寫進公開程式碼
* 貼到論壇
* 貼到 Discord 或 Telegram 公開群組
* 傳給其他人

本專案請將 Token 儲存在自己的 Google Apps Script：

```text
Script Properties
```

對應：

```text
TG_BOT_TOKEN
```

如果 Token 不小心公開，請立即回到 BotFather 重新產生 Token。

---

## 4. 建立 Telegram 群組

在 Telegram Web 建立一個新的群組。

例如：

```text
Gmail 通知
```

這個群組就是之後接收 Gmail 通知的地方。

---

## 5. 將 Bot 加入群組

將剛剛建立的 Bot 加入 Telegram 群組。

例如：

```text
Gmail Notification Bot
```

加入完成後，建議在群組中發送一則測試訊息，例如：

```text
test
```

這樣 Telegram Bot API 才能取得相關更新資訊。

---

## 6. 取得 Telegram Chat ID

Telegram 群組需要一組：

```text
Chat ID
```

本專案需要將它設定為：

```text
TG_CHAT_ID
```

### 使用 Bot API

在瀏覽器網址列輸入：

```text
https://api.telegram.org/bot<TOKEN>/getUpdates
```

將：

```text
<TOKEN>
```

替換成自己的 Bot Token。

例如：

```text
https://api.telegram.org/bot1234567890:AAxxxxxxxxxxxxxxxx/getUpdates
```

按 Enter。

---

## 7. 找到 Chat ID

如果 Bot 已經收到群組訊息，回應中會看到類似：

```json
{
  "ok": true,
  "result": [
    {
      "message": {
        "chat": {
          "id": -1001234567890,
          "title": "Gmail 通知",
          "type": "supergroup"
        }
      }
    }
  ]
}
```

找到：

```text
chat
→ id
```

例如：

```text
-1001234567890
```

這個數字就是 Telegram 群組的：

```text
TG_CHAT_ID
```

---

## 8. Chat ID 通常是負數

Telegram 群組的 Chat ID 通常會是負數。

例如：

```text
-1001234567890
```

請完整複製：

```text
-1001234567890
```

不要刪除前面的 `-`。

---

## 9. 設定到 Google Apps Script

回到 Google Apps Script：

```text
Project Settings
→ Script Properties
```

新增：

```text
TG_BOT_TOKEN
```

值：

```text
你的 Bot Token
```

再新增：

```text
TG_CHAT_ID
```

值：

```text
你的 Telegram 群組 Chat ID
```

例如：

```text
TG_CHAT_ID
-1001234567890
```

---

## 10. 測試 Telegram Bot

完成設定後，開啟本專案的 Google Apps Script Web App。

使用：

```text
Test Telegram
```

如果設定正確，Telegram 群組應該會收到測試訊息。

如果收到：

```text
Telegram test message
```

或類似測試通知，代表：

```text
Bot Token
+
Chat ID
+
Telegram Bot API
```

都已經正常運作。

---

## 11. 如果 getUpdates 沒有資料

如果：

```text
/getUpdates
```

沒有看到群組訊息，可以依序確認：

1. Bot 是否已加入群組
2. 是否在群組中發送過訊息
3. Bot Token 是否正確
4. 使用的是否為正確的 Bot
5. 重新整理 `getUpdates` 頁面

如果仍然沒有結果，可以重新在群組發送一則訊息後再查詢。

---

## 12. Bot 權限

一般情況下，Bot 只需要能夠在目標群組中正常接收必要訊息並發送通知。

如果 Telegram 群組權限限制導致 Bot 無法正常工作，請檢查群組成員及管理員權限設定。

---

## 13. Bot Token 外洩怎麼辦？

如果 Bot Token 不小心公開：

**不要繼續使用原 Token。**

立即使用：

```text
@BotFather
```

重新產生 Bot Token。

然後回到 Google Apps Script：

```text
Script Properties
→ TG_BOT_TOKEN
```

更新成新的 Token。

---

## 14. 完成

完成後，本專案的 Telegram 部分應該是：

```text
Telegram Web
     ↓
@BotFather
     ↓
建立 Bot
     ↓
取得 Bot Token
     ↓
建立 Telegram Group
     ↓
加入 Bot
     ↓
getUpdates
     ↓
取得 Chat ID
     ↓
Google Apps Script
     ↓
Script Properties
```

設定完成後即可開始接收 Gmail 通知。
