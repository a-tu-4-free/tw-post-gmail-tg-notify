/*************************************************
 * 中華郵政 Gmail → Telegram 通知系統
 * Google Apps Script
 *
 * Script Properties = 唯一設定來源
 *************************************************/


const CONFIG = {

  TIMEZONE: 'Asia/Taipei',

  POST_DOMAINS: [
    '@mail.post.gov.tw',
    '@post.gov.tw'
  ],

  MAX_THREADS: 50,

  TELEGRAM_RETRIES: 3,

  TELEGRAM_RETRY_WAIT: 30,

  TRIGGER_EVERY_MINUTES: 1
};


const KEYS = {

  TG_BOT_TOKEN: 'TG_BOT_TOKEN',

  TG_CHAT_ID: 'TG_CHAT_ID',

  INITIAL_HISTORY_HOURS: 'INITIAL_HISTORY_HOURS',

  NOTIFICATION_START: 'NOTIFICATION_START',

  NOTIFICATION_END: 'NOTIFICATION_END',

  NOTIFICATION_ENABLED: 'NOTIFICATION_ENABLED',

  INCLUDE_GMAIL_LINK: 'INCLUDE_GMAIL_LINK',

  GMAIL_INITIALIZED: 'GMAIL_INITIALIZED',

  LAST_CHECK: 'LAST_CHECK',

  LAST_NOTIFY: 'LAST_NOTIFY'
};


/* =================================================
 * 前台頁面
 * ================================================= */

function doGet() {

  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('中華郵政 Gmail → Telegram 通知')
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );
}


/* =================================================
 * 初始化系統設定
 * ================================================= */

function setup() {

  const props =
    PropertiesService.getScriptProperties();

  /*
   * 只有不存在時才建立預設值。
   * 不會覆蓋使用者原本設定。
   */

  setDefaultProperty_(
    props,
    KEYS.INITIAL_HISTORY_HOURS,
    '0'
  );

  setDefaultProperty_(
    props,
    KEYS.NOTIFICATION_START,
    '00:00'
  );

  setDefaultProperty_(
    props,
    KEYS.NOTIFICATION_END,
    '23:59'
  );

  setDefaultProperty_(
    props,
    KEYS.NOTIFICATION_ENABLED,
    'true'
  );

  setDefaultProperty_(
    props,
    KEYS.INCLUDE_GMAIL_LINK,
    'true'
  );

  setDefaultProperty_(
    props,
    KEYS.GMAIL_INITIALIZED,
    'false'
  );

  createMinuteTrigger();

  return getStatus();
}


/* =================================================
 * 前台取得設定
 * ================================================= */

function getSettings() {

  const props =
    PropertiesService.getScriptProperties();

  const token =
    props.getProperty(KEYS.TG_BOT_TOKEN) || '';

  const chatId =
    props.getProperty(KEYS.TG_CHAT_ID) || '';

  return {

    hasToken: !!token,

    tokenMasked:
      token
        ? maskToken_(token)
        : '',

    hasChatId: !!chatId,

    chatIdMasked:
      chatId
        ? maskChatId_(chatId)
        : '',

    initialHistoryHours:
      props.getProperty(
        KEYS.INITIAL_HISTORY_HOURS
      ) || '0',

    notificationStart:
      props.getProperty(
        KEYS.NOTIFICATION_START
      ) || '00:00',

    notificationEnd:
      props.getProperty(
        KEYS.NOTIFICATION_END
      ) || '23:59',

    enabled:
      props.getProperty(
        KEYS.NOTIFICATION_ENABLED
      ) !== 'false',

    includeGmailLink:
      props.getProperty(
        KEYS.INCLUDE_GMAIL_LINK
      ) !== 'false'
  };
}


/* =================================================
 * 前台儲存設定
 * ================================================= */

function saveSettings(settings) {

  if (!settings) {
    throw new Error('沒有收到設定資料');
  }

  const props =
    PropertiesService.getScriptProperties();


  /*
   * Bot Token
   *
   * 空白 = 保留原本 Token
   * 有輸入 = 更新 Token
   */

  const newToken =
    String(
      settings.token || ''
    ).trim();

  if (newToken) {

    validateTelegramToken_(newToken);

    props.setProperty(
      KEYS.TG_BOT_TOKEN,
      newToken
    );
  }


  /*
   * Chat ID
   */

  const newChatId =
    String(
      settings.chatId || ''
    ).trim();

  if (newChatId) {

    props.setProperty(
      KEYS.TG_CHAT_ID,
      newChatId
    );
  }


  /*
   * 歷史郵件
   */

  const historyHours =
    parseInt(
      settings.initialHistoryHours,
      10
    );

  if (
    isNaN(historyHours) ||
    historyHours < 0
  ) {

    throw new Error(
      '歷史郵件時間必須是 0 或以上的數字'
    );
  }

  props.setProperty(
    KEYS.INITIAL_HISTORY_HOURS,
    String(historyHours)
  );


  /*
   * 通知時間
   */

  validateTime_(
    settings.notificationStart
  );

  validateTime_(
    settings.notificationEnd
  );

  props.setProperty(
    KEYS.NOTIFICATION_START,
    settings.notificationStart
  );

  props.setProperty(
    KEYS.NOTIFICATION_END,
    settings.notificationEnd
  );


  /*
   * 啟用狀態
   */

  props.setProperty(
    KEYS.NOTIFICATION_ENABLED,
    settings.enabled === true
      ? 'true'
      : 'false'
  );


  /*
   * Gmail 連結
   */

  props.setProperty(
    KEYS.INCLUDE_GMAIL_LINK,
    settings.includeGmailLink === true
      ? 'true'
      : 'false'
  );


  createMinuteTrigger();

  return getStatus();
}


/* =================================================
 * 前台取得系統狀態
 * ================================================= */

function getStatus() {

  const props =
    PropertiesService.getScriptProperties();

  const initialized =
    props.getProperty(
      KEYS.GMAIL_INITIALIZED
    ) === 'true';

  const enabled =
    props.getProperty(
      KEYS.NOTIFICATION_ENABLED
    ) !== 'false';

  const lastCheck =
    props.getProperty(
      KEYS.LAST_CHECK
    ) || '';

  const lastNotify =
    props.getProperty(
      KEYS.LAST_NOTIFY
    ) || '';

  const token =
    props.getProperty(
      KEYS.TG_BOT_TOKEN
    ) || '';

  const chatId =
    props.getProperty(
      KEYS.TG_CHAT_ID
    ) || '';

  return {

    gmailInitialized: initialized,

    enabled: enabled,

    hasToken: !!token,

    hasChatId: !!chatId,

    tokenMasked:
      token
        ? maskToken_(token)
        : '',

    chatIdMasked:
      chatId
        ? maskChatId_(chatId)
        : '',

    lastCheck:
      lastCheck
        ? formatIsoDate_(lastCheck)
        : '尚未檢查',

    lastNotify:
      lastNotify
        ? formatIsoDate_(lastNotify)
        : '尚未通知',

    notificationStart:
      props.getProperty(
        KEYS.NOTIFICATION_START
      ) || '00:00',

    notificationEnd:
      props.getProperty(
        KEYS.NOTIFICATION_END
      ) || '23:59'
  };
}


/* =================================================
 * 前台測試 Telegram
 * ================================================= */

function testTelegramFromWeb() {

  const success =
    sendTelegramMessage_(
      '✅ 中華郵政通知系統測試成功\n\n' +
      '測試時間：' +
      formatDate_(new Date())
    );

  if (!success) {

    throw new Error(
      'Telegram 測試失敗，請確認 Bot Token 與 Chat ID'
    );
  }

  return getStatus();
}


/* =================================================
 * 前台初始化 Gmail
 * ================================================= */

function initializeGmailFromWeb() {

  initializeGmail_();

  return getStatus();
}


/* =================================================
 * 前台重新初始化
 * ================================================= */

function resetGmailInitialization() {

  const props =
    PropertiesService.getScriptProperties();

  props.setProperty(
    KEYS.GMAIL_INITIALIZED,
    'false'
  );

  props.deleteProperty(
    KEYS.LAST_CHECK
  );

  return getStatus();
}


/* =================================================
 * 主程式
 * ================================================= */

function checkPostMailAndTelegramNotify() {

  const lock =
    LockService.getScriptLock();

  if (!lock.tryLock(5000)) {
    return;
  }

  try {

    const props =
      PropertiesService.getScriptProperties();

    const enabled =
      props.getProperty(
        KEYS.NOTIFICATION_ENABLED
      ) !== 'false';

    if (!enabled) {
      return;
    }


    /*
     * Gmail 尚未初始化
     */

    const initialized =
      props.getProperty(
        KEYS.GMAIL_INITIALIZED
      ) === 'true';

    if (!initialized) {

      initializeGmail_();

      return;
    }


    /*
     * 通知時間外
     */

    if (!isWithinNotificationTime_()) {
      return;
    }


    /*
     * 實際開始檢查 Gmail
     */

    const now =
      new Date();

    props.setProperty(
      KEYS.LAST_CHECK,
      now.toISOString()
    );


    const threads =
      GmailApp.search(
        'is:unread newer_than:30d',
        0,
        CONFIG.MAX_THREADS
      );


    for (
      let i = 0;
      i < threads.length;
      i++
    ) {

      const messages =
        threads[i].getMessages();


      for (
        let j = 0;
        j < messages.length;
        j++
      ) {

        const message =
          messages[j];


        if (!message.isUnread()) {
          continue;
        }


        if (!isPostOfficeSender_(message)) {
          continue;
        }


        processMessage_(message);
      }
    }

  } catch (error) {

    console.error(
      'Gmail 檢查錯誤：' +
      error.message
    );

  } finally {

    lock.releaseLock();
  }
}


/* =================================================
 * Gmail 初始化
 * ================================================= */

function initializeGmail_() {

  const props =
    PropertiesService.getScriptProperties();


  /*
   * 確認 Gmail 權限
   */

  GmailApp.getInboxThreads(0, 1);


  const historyHours =
    parseInt(
      props.getProperty(
        KEYS.INITIAL_HISTORY_HOURS
      ) || '0',
      10
    );


  const threads =
    GmailApp.search(
      'is:unread newer_than:30d',
      0,
      CONFIG.MAX_THREADS
    );


  const historyLimit =
    Date.now() -
    (
      historyHours *
      60 *
      60 *
      1000
    );


  for (
    let i = 0;
    i < threads.length;
    i++
  ) {

    const messages =
      threads[i].getMessages();


    for (
      let j = 0;
      j < messages.length;
      j++
    ) {

      const message =
        messages[j];


      if (!message.isUnread()) {
        continue;
      }


      if (!isPostOfficeSender_(message)) {
        continue;
      }


      /*
       * 如果設定歷史通知時間
       */

      if (
        historyHours > 0 &&
        message.getDate().getTime() >= historyLimit
      ) {

        processMessage_(message);

      } else {

        /*
         * 舊信件不通知
         */

        markIgnored_(
          message.getId()
        );
      }
    }
  }


  props.setProperty(
    KEYS.GMAIL_INITIALIZED,
    'true'
  );


  props.setProperty(
    KEYS.LAST_CHECK,
    new Date().toISOString()
  );


  return true;
}


/* =================================================
 * 處理郵件
 * ================================================= */

function processMessage_(message) {

  const messageId =
    message.getId();


  if (isMarked_(messageId)) {
    return;
  }


  const text =
    buildTelegramMessage_(message);


  const success =
    sendTelegramMessage_(text);


  /*
   * Telegram 成功才標記
   */

  if (success) {

    markNotified_(
      messageId
    );

    message.markRead();


    PropertiesService
      .getScriptProperties()
      .setProperty(
        KEYS.LAST_NOTIFY,
        new Date().toISOString()
      );
  }
}


/* =================================================
 * Telegram 訊息
 * ================================================= */

function buildTelegramMessage_(message) {

  const subject =
    message.getSubject() ||
    '(無主旨)';

  const sender =
    message.getFrom() ||
    '(未知寄件者)';

  const date =
    formatDate_(
      message.getDate()
    );


  let text =
    '📬 中華郵政新郵件通知\n\n' +

    '📌 信件主旨\n' +
    subject +

    '\n\n' +

    '👤 寄件者\n' +
    sender +

    '\n\n' +

    '🕒 收到時間\n' +
    date;


  const props =
    PropertiesService
      .getScriptProperties();


  const includeLink =
    props.getProperty(
      KEYS.INCLUDE_GMAIL_LINK
    ) !== 'false';


  if (includeLink) {

    const threadId =
      message
        .getThread()
        .getId();


    const gmailUrl =
      'https://mail.google.com/mail/u/0/#all/' +
      threadId;


    text +=
      '\n\n📧 開啟 Gmail：\n' +
      gmailUrl;
  }


  return text;
}


/* =================================================
 * Telegram 發送
 * ================================================= */

function sendTelegramMessage_(text) {

  const props =
    PropertiesService.getScriptProperties();


  const token =
    props.getProperty(
      KEYS.TG_BOT_TOKEN
    );


  const chatId =
    props.getProperty(
      KEYS.TG_CHAT_ID
    );


  if (!token || !chatId) {

    console.error(
      'Telegram 尚未設定'
    );

    return false;
  }


  const url =
    'https://api.telegram.org/bot' +
    token +
    '/sendMessage';


  const payload = {

    chat_id: chatId,

    text: text
  };


  const options = {

    method: 'post',

    contentType:
      'application/json',

    payload:
      JSON.stringify(payload),

    muteHttpExceptions: true
  };


  for (
    let attempt = 1;
    attempt <= CONFIG.TELEGRAM_RETRIES;
    attempt++
  ) {

    try {

      const response =
        UrlFetchApp.fetch(
          url,
          options
        );


      const code =
        response.getResponseCode();


      const body =
        response.getContentText();


      if (
        code >= 200 &&
        code < 300
      ) {

        return true;
      }


      if (code === 429) {

        const retryAfter =
          extractRetryAfter_(body);


        Utilities.sleep(
          retryAfter * 1000
        );


        continue;
      }


      console.error(
        'Telegram 發送失敗 HTTP ' +
        code
      );

    } catch (error) {

      console.error(
        'Telegram 發送錯誤：' +
        error.message
      );
    }


    if (
      attempt <
      CONFIG.TELEGRAM_RETRIES
    ) {

      Utilities.sleep(
        CONFIG.TELEGRAM_RETRY_WAIT *
        1000
      );
    }
  }


  return false;
}


/* =================================================
 * 啟用
 * ================================================= */

function enableNotifications() {

  PropertiesService
    .getScriptProperties()
    .setProperty(
      KEYS.NOTIFICATION_ENABLED,
      'true'
    );

  return getStatus();
}


/* =================================================
 * 停用
 * ================================================= */

function disableNotifications() {

  PropertiesService
    .getScriptProperties()
    .setProperty(
      KEYS.NOTIFICATION_ENABLED,
      'false'
    );

  return getStatus();
}


/* =================================================
 * Trigger
 * ================================================= */

function createMinuteTrigger() {

  deleteMinuteTrigger();


  ScriptApp
    .newTrigger(
      'checkPostMailAndTelegramNotify'
    )
    .timeBased()
    .everyMinutes(
      CONFIG.TRIGGER_EVERY_MINUTES
    )
    .create();
}


/* =================================================
 * 刪除 Trigger
 * ================================================= */

function deleteMinuteTrigger() {

  const triggers =
    ScriptApp.getProjectTriggers();


  for (
    let i = 0;
    i < triggers.length;
    i++
  ) {

    if (
      triggers[i].getHandlerFunction() ===
      'checkPostMailAndTelegramNotify'
    ) {

      ScriptApp.deleteTrigger(
        triggers[i]
      );
    }
  }
}


/* =================================================
 * Gmail 寄件者判斷
 * ================================================= */

function isPostOfficeSender_(message) {

  const from =
    String(
      message.getFrom() || ''
    ).toLowerCase();


  for (
    let i = 0;
    i < CONFIG.POST_DOMAINS.length;
    i++
  ) {

    if (
      from.indexOf(
        CONFIG.POST_DOMAINS[i]
      ) !== -1
    ) {

      return true;
    }
  }


  return false;
}


/* =================================================
 * 通知時間
 * ================================================= */

function isWithinNotificationTime_() {

  const props =
    PropertiesService.getScriptProperties();


  const start =
    props.getProperty(
      KEYS.NOTIFICATION_START
    ) || '00:00';


  const end =
    props.getProperty(
      KEYS.NOTIFICATION_END
    ) || '23:59';


  const now =
    new Date();


  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes();


  const startMinutes =
    parseTimeToMinutes_(start);


  const endMinutes =
    parseTimeToMinutes_(end);


  /*
   * 一般時間
   */

  if (
    startMinutes <= endMinutes
  ) {

    return (
      currentMinutes >= startMinutes &&
      currentMinutes <= endMinutes
    );
  }


  /*
   * 跨午夜
   */

  return (
    currentMinutes >= startMinutes ||
    currentMinutes <= endMinutes
  );
}


/* =================================================
 * 時間轉分鐘
 * ================================================= */

function parseTimeToMinutes_(time) {

  const parts =
    String(time).split(':');


  const hour =
    parseInt(parts[0], 10);


  const minute =
    parseInt(parts[1], 10);


  if (
    isNaN(hour) ||
    isNaN(minute)
  ) {

    return 0;
  }


  return (
    hour * 60 +
    minute
  );
}


/* =================================================
 * 已通知
 * ================================================= */

function markNotified_(messageId) {

  PropertiesService
    .getScriptProperties()
    .setProperty(
      'NOTIFIED_' + messageId,
      new Date().toISOString()
    );
}


/* =================================================
 * 忽略
 * ================================================= */

function markIgnored_(messageId) {

  PropertiesService
    .getScriptProperties()
    .setProperty(
      'IGNORED_' + messageId,
      new Date().toISOString()
    );
}


/* =================================================
 * 是否已處理
 * ================================================= */

function isMarked_(messageId) {

  const props =
    PropertiesService.getScriptProperties();


  return (
    props.getProperty(
      'NOTIFIED_' + messageId
    ) !== null ||

    props.getProperty(
      'IGNORED_' + messageId
    ) !== null
  );
}


/* =================================================
 * Telegram 429
 * ================================================= */

function extractRetryAfter_(body) {

  try {

    const data =
      JSON.parse(body);


    if (
      data &&
      data.parameters &&
      data.parameters.retry_after
    ) {

      return Math.max(
        1,
        parseInt(
          data.parameters.retry_after,
          10
        )
      );
    }

  } catch (error) {}

  return CONFIG.TELEGRAM_RETRY_WAIT;
}


/* =================================================
 * Token 驗證
 * ================================================= */

function validateTelegramToken_(token) {

  if (
    !/^\d+:[A-Za-z0-9_-]+$/.test(token)
  ) {

    throw new Error(
      'Telegram Bot Token 格式不正確'
    );
  }
}


/* =================================================
 * 時間驗證
 * ================================================= */

function validateTime_(time) {

  if (
    !/^\d{2}:\d{2}$/.test(
      String(time)
    )
  ) {

    throw new Error(
      '時間格式必須為 HH:MM'
    );
  }


  const parts =
    String(time).split(':');


  const hour =
    parseInt(parts[0], 10);


  const minute =
    parseInt(parts[1], 10);


  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {

    throw new Error(
      '通知時間格式不正確'
    );
  }
}


/* =================================================
 * Token 遮蔽
 * ================================================= */

function maskToken_(token) {

  const value =
    String(token);


  if (value.length <= 10) {
    return '••••••••';
  }


  return (
    value.substring(0, 6) +
    '••••••••••' +
    value.substring(
      value.length - 4
    )
  );
}


/* =================================================
 * Chat ID 遮蔽
 * ================================================= */

function maskChatId_(chatId) {

  const value =
    String(chatId);


  if (value.length <= 6) {
    return '••••••';
  }


  return (
    value.substring(0, 3) +
    '••••••' +
    value.substring(
      value.length - 3
    )
  );
}


/* =================================================
 * 預設值
 * ================================================= */

function setDefaultProperty_(
  props,
  key,
  value
) {

  if (
    props.getProperty(key) === null
  ) {

    props.setProperty(
      key,
      value
    );
  }
}


/* =================================================
 * 日期
 * ================================================= */

function formatDate_(date) {

  return Utilities.formatDate(
    date,
    CONFIG.TIMEZONE,
    'yyyy-MM-dd HH:mm:ss'
  );
}


function formatIsoDate_(iso) {

  try {

    return formatDate_(
      new Date(iso)
    );

  } catch (error) {

    return iso;
  }
}


/* =================================================
 * 清除通知紀錄
 * ================================================= */

function clearNotificationHistory() {

  const props =
    PropertiesService.getScriptProperties();


  const all =
    props.getProperties();


  let count = 0;


  Object.keys(all).forEach(
    function(key) {

      if (
        key.indexOf('NOTIFIED_') === 0 ||
        key.indexOf('IGNORED_') === 0
      ) {

        props.deleteProperty(key);

        count++;
      }
    }
  );


  return count;
}
