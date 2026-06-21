const GOOGLE_API_KEY = 'AIzaSyB2IyH68acpouxGzSXHt-HjymBhTiH5WGk';
const GOOGLE_CALENDAR_ID = '4ba0e8a1b31f1a821edc4aec49773111113ca7a0ab1080b4923500db0e382534@group.calendar.google.com';

const i18n = {
  zh: {
    install: '加入主畫面',
    refresh: '重新整理',
    todayLabel: '今天',
    timezoneLabel: '偵測時區',
    noticeLabel: '提醒模式',
    noticeMode: '正式版會依照 Google Calendar 的提醒設定，在事件前自動發送推播通知。',
    loadingEvents: '正在同步 Google Calendar 事件…',
    loadError: 'Google Calendar 事件讀取失敗，請確認日曆公開權限與 API Key。',
    noEvents: '這個月份目前沒有公開事件。',
    calendarKicker: 'Calendar',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    monthFormat: (date) => `${date.getFullYear()}年 ${date.getMonth() + 1}月`,
    installHint: '目前先保留加入主畫面按鈕。下一階段會啟用 PWA 安裝與推播通知。',
    refreshDone: '已重新同步 Google Calendar 事件',
    allDay: '整天',
    followEson: 'follow ESON',
    uncategorized: '未分類',
    tags: {
      live: '直播', birthday: '紀念日', anniversary: '紀念日', fan: '粉絲活動', notice: '公告', schedule: '行程', release: '發行', travel: '行程'
    }
  },
  ko: {
    install: '홈 화면에 추가',
    refresh: '새로고침',
    todayLabel: '오늘',
    timezoneLabel: '감지된 시간대',
    noticeLabel: '알림 모드',
    noticeMode: '정식 버전에서는 Google Calendar 알림 설정에 맞춰 푸시 알림을 보냅니다.',
    loadingEvents: 'Google Calendar 일정을 동기화하는 중…',
    loadError: 'Google Calendar 일정을 불러오지 못했습니다. 공개 설정과 API Key를 확인해 주세요.',
    noEvents: '이 달에는 공개 일정이 없습니다.',
    calendarKicker: 'Calendar',
    weekdays: ['일', '월', '화', '수', '목', '금', '토'],
    monthFormat: (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
    installHint: '현재는 홈 화면 추가 버튼만 남겨두었습니다. 다음 단계에서 PWA 설치와 푸시 알림을 연결합니다.',
    refreshDone: 'Google Calendar 일정을 다시 동기화했어요',
    allDay: '종일',
    followEson: 'follow ESON',
    uncategorized: '미분류',
    tags: {
      live: '라이브', birthday: '기념일', anniversary: '기념일', fan: '팬 이벤트', notice: '공지', schedule: '스케줄', release: '발매', travel: '스케줄'
    }
  },
  en: {
    install: 'Add to Home Screen',
    refresh: 'Refresh',
    todayLabel: 'Today',
    timezoneLabel: 'Detected timezone',
    noticeLabel: 'Notification mode',
    noticeMode: 'Push notifications will follow each Google Calendar reminder setting.',
    loadingEvents: 'Syncing Google Calendar events…',
    loadError: 'Failed to load Google Calendar events. Please check calendar sharing and API key settings.',
    noEvents: 'No public events for this month yet.',
    calendarKicker: 'Calendar',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthFormat: (date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    installHint: 'The Add to Home Screen button is reserved for now. PWA installation and push notifications will be enabled next.',
    refreshDone: 'Google Calendar events synced',
    allDay: 'All day',
    followEson: 'follow ESON',
    uncategorized: 'Uncategorized',
    tags: {
      live: 'Live', birthday: 'Anniversary', anniversary: 'Anniversary', fan: 'Fan event', notice: 'Notice', schedule: 'Schedule', release: 'Release', travel: 'Schedule'
    }
  },
  ja: {
    install: 'ホーム画面に追加',
    refresh: '更新',
    todayLabel: '今日',
    timezoneLabel: '検出されたタイムゾーン',
    noticeLabel: '通知モード',
    noticeMode: 'Google Calendar のリマインダー設定に合わせてプッシュ通知を送信します。',
    loadingEvents: 'Google Calendar の予定を同期中…',
    loadError: 'Google Calendar の予定を読み込めませんでした。公開設定と API Key を確認してください。',
    noEvents: 'この月には公開予定がありません。',
    calendarKicker: 'Calendar',
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    monthFormat: (date) => `${date.getFullYear()}年 ${date.getMonth() + 1}月`,
    installHint: '現在はホーム画面追加ボタンのみ残しています。次の段階で PWA インストールとプッシュ通知を有効にします。',
    refreshDone: 'Google Calendar の予定を再同期しました',
    allDay: '終日',
    followEson: 'follow ESON',
    uncategorized: '未分類',
    tags: {
      live: 'ライブ', birthday: '記念日', anniversary: '記念日', fan: 'ファンイベント', notice: 'お知らせ', schedule: 'スケジュール', release: 'リリース', travel: 'スケジュール'
    }
  }
};

let currentLang = 'zh';
let viewDate = new Date();
const today = new Date();
let calendarEvents = [];
let googleColors = null;
let isLoading = false;
let loadError = '';
let lastLoadedRange = '';

const calendarGrid = document.getElementById('calendarGrid');
const weekdayGrid = document.getElementById('weekdayGrid');
const monthTitle = document.getElementById('monthTitle');
const todayText = document.getElementById('todayText');
const timezoneText = document.getElementById('timezoneText');
const modal = document.getElementById('eventModal');

const fallbackColors = {
  blue: { background: 'rgba(43,114,255,.12)', border: 'rgba(43,114,255,.74)' },
  orange: { background: 'rgba(255,155,69,.14)', border: 'rgba(255,155,69,.78)' },
  pink: { background: 'rgba(255,122,182,.13)', border: 'rgba(255,122,182,.78)' },
  mint: { background: 'rgba(119,216,189,.15)', border: 'rgba(119,216,189,.78)' },
  gray: { background: 'rgba(104,112,130,.10)', border: 'rgba(104,112,130,.52)' }
};

const categoryFallbackColor = {
  live: fallbackColors.blue,
  birthday: fallbackColors.pink,
  anniversary: fallbackColors.pink,
  fan: { background: 'rgba(150,126,255,.13)', border: 'rgba(150,126,255,.70)' },
  notice: fallbackColors.orange,
  schedule: fallbackColors.mint,
  travel: fallbackColors.mint,
  release: fallbackColors.blue
};

function pad(num) { return String(num).padStart(2, '0'); }
function dateKey(date) { return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`; }
function sameDay(a, b) { return dateKey(a) === dateKey(b); }
function getLocale() { return currentLang === 'zh' ? 'zh-TW' : currentLang === 'ko' ? 'ko-KR' : currentLang === 'ja' ? 'ja-JP' : 'en-US'; }
function getUserTimeZone() { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; }
function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}
function stripHtml(value = '') {
  const normalized = String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li)>/gi, '\n')
    .replace(/<(p|div|li)[^>]*>/gi, '');
  const div = document.createElement('div');
  div.innerHTML = normalized;
  return (div.textContent || div.innerText || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\r\n?/g, '\n');
}

function renderDescriptionHtml(description = '') {
  const plain = String(description).trim();
  if (!plain) return '—';

  const escaped = escapeHtml(plain);
  const linked = escaped.replace(/((?:https?:\/\/|www\.)[^\s<]+)/g, (match) => {
    const trailingMatch = match.match(/[.,!?，。；;：:)）】]+$/);
    const trailing = trailingMatch ? trailingMatch[0] : '';
    const urlText = trailing ? match.slice(0, -trailing.length) : match;
    const href = urlText.startsWith('www.') ? `https://${urlText}` : urlText;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${urlText}</a>${trailing}`;
  });

  return linked.replace(/\n/g, '<br>');
}
function startOfCalendarGrid(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());
  start.setHours(0, 0, 0, 0);
  return start;
}
function endOfCalendarGrid(date) {
  const start = startOfCalendarGrid(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 42);
  return end;
}

function extractCategory(description = '') {
  const plain = stripHtml(description);
  const match = plain.match(/^\s*CATEGORY\s*:\s*([a-zA-Z0-9_-]+)\s*$/im);
  return match ? match[1].toLowerCase() : '';
}

function cleanDescription(description = '') {
  const plain = stripHtml(description)
    .replace(/^\s*CATEGORY\s*:\s*[a-zA-Z0-9_-]+\s*$/gim, '')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return plain;
}

function normalizeGoogleEvent(item) {
  const isAllDay = Boolean(item.start?.date);
  const startRaw = item.start?.dateTime || item.start?.date;
  const endRaw = item.end?.dateTime || item.end?.date;
  const startDate = isAllDay ? new Date(`${startRaw}T00:00:00`) : new Date(startRaw);
  const endDate = endRaw ? (isAllDay ? new Date(`${endRaw}T00:00:00`) : new Date(endRaw)) : null;
  const category = extractCategory(item.description || '');
  const cleanDesc = cleanDescription(item.description || '');

  return {
    id: item.id,
    title: item.summary || i18n[currentLang].uncategorized,
    description: cleanDesc,
    category,
    colorId: item.colorId || '',
    start: startDate,
    end: endDate,
    isAllDay,
    htmlLink: item.htmlLink || '',
    reminders: item.reminders || {}
  };
}

function hexToRgba(hex, alpha = 0.14) {
  if (!hex || !hex.startsWith('#')) return null;
  const raw = hex.replace('#', '');
  if (raw.length !== 6) return null;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getEventColor(event) {
  if (event.colorId && googleColors?.event?.[event.colorId]) {
    const backgroundHex = googleColors.event[event.colorId].background;
    return {
      background: hexToRgba(backgroundHex, 0.18) || backgroundHex,
      border: backgroundHex
    };
  }
  return categoryFallbackColor[event.category] || fallbackColors.blue;
}

function eventStyle(event) {
  const color = getEventColor(event);
  return `background:${color.background};border-left-color:${color.border};`;
}

function eventOccursOnDate(event, key) {
  if (event.isAllDay) {
    const start = new Date(event.start);
    const end = event.end ? new Date(event.end) : new Date(start);
    if (event.end) end.setDate(end.getDate() - 1);
    const target = new Date(`${key}T00:00:00`);
    return target >= start && target <= end;
  }
  return dateKey(event.start) === key;
}

function formatEventTime(event) {
  if (event.isAllDay) return i18n[currentLang].allDay;
  const locale = getLocale();
  const options = { hour: '2-digit', minute: '2-digit', hour12: false };
  if (event.end && dateKey(event.start) === dateKey(event.end)) {
    return `${event.start.toLocaleTimeString(locale, options)}–${event.end.toLocaleTimeString(locale, options)}`;
  }
  return event.start.toLocaleTimeString(locale, options);
}

function applyLanguage() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh-Hant' : currentLang;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = i18n[currentLang][key] || node.textContent;
  });
  renderWeekdays();
  renderCalendar();
  renderMeta();
}

function renderMeta() {
  const locale = getLocale();
  todayText.textContent = today.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
  timezoneText.textContent = getUserTimeZone();
}

function renderWeekdays() {
  weekdayGrid.innerHTML = i18n[currentLang].weekdays
    .map(day => `<div class="weekday">${day}</div>`)
    .join('');
}

function renderCalendar() {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  monthTitle.textContent = i18n[currentLang].monthFormat(viewDate);

  const start = startOfCalendarGrid(viewDate);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(start);
    cellDate.setDate(start.getDate() + i);
    cells.push(cellDate);
  }

  calendarGrid.innerHTML = cells.map((cellDate) => {
    const key = dateKey(cellDate);
    const events = calendarEvents.filter(event => eventOccursOnDate(event, key));
    const isMuted = cellDate.getMonth() !== month;
    const isToday = sameDay(cellDate, today);
    const eventHtml = events.map(event => `
      <button class="event-pill" style="${eventStyle(event)}" data-event-id="${escapeHtml(event.id)}">
        ${escapeHtml(event.title)}
      </button>
    `).join('');

    return `
      <article class="day-cell ${isMuted ? 'muted' : ''} ${isToday ? 'today' : ''}" data-date="${key}">
        <div class="day-number">${cellDate.getDate()}</div>
        <div class="event-list">${eventHtml}</div>
      </article>
    `;
  }).join('');

  document.querySelectorAll('.event-pill').forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const eventData = calendarEvents.find(item => item.id === button.dataset.eventId);
      if (eventData) openEvent(eventData);
    });
  });

  renderCalendarStatus();
}

function renderCalendarStatus() {
  const oldStatus = document.querySelector('.calendar-status');
  if (oldStatus) oldStatus.remove();

  let message = '';
  let type = '';
  const monthEvents = calendarEvents.filter(event => event.start.getMonth() === viewDate.getMonth() && event.start.getFullYear() === viewDate.getFullYear());
  if (isLoading) {
    message = i18n[currentLang].loadingEvents;
    type = 'loading';
  } else if (loadError) {
    message = i18n[currentLang].loadError;
    type = 'error';
  } else if (monthEvents.length === 0) {
    message = i18n[currentLang].noEvents;
    type = 'empty';
  }

  if (!message) return;
  const status = document.createElement('p');
  status.className = `calendar-status ${type}`;
  status.textContent = message;
  calendarGrid.after(status);
}

function openEvent(eventData) {
  const locale = getLocale();
  document.getElementById('modalDate').textContent = eventData.start.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  document.getElementById('modalTitle').textContent = eventData.title;
  document.getElementById('modalTime').textContent = formatEventTime(eventData);
  document.getElementById('modalDesc').innerHTML = renderDescriptionHtml(eventData.description);
  const tagLabel = eventData.category ? (i18n[currentLang].tags[eventData.category] || eventData.category) : i18n[currentLang].uncategorized;
  document.getElementById('modalTags').innerHTML = `<span>${escapeHtml(tagLabel)}</span>`;
  modal.showModal();
}

async function loadGoogleColors() {
  if (googleColors) return googleColors;
  const url = new URL('https://www.googleapis.com/calendar/v3/colors');
  url.searchParams.set('key', GOOGLE_API_KEY);
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`Colors API error: ${response.status}`);
  googleColors = await response.json();
  return googleColors;
}

async function loadEvents(force = false) {
  const start = startOfCalendarGrid(viewDate);
  const end = endOfCalendarGrid(viewDate);
  const rangeKey = `${start.toISOString()}_${end.toISOString()}`;
  if (!force && rangeKey === lastLoadedRange && calendarEvents.length) return;

  isLoading = true;
  loadError = '';
  renderCalendar();

  try {
    await loadGoogleColors();
    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events`);
    url.searchParams.set('key', GOOGLE_API_KEY);
    url.searchParams.set('timeMin', start.toISOString());
    url.searchParams.set('timeMax', end.toISOString());
    url.searchParams.set('singleEvents', 'true');
    url.searchParams.set('orderBy', 'startTime');
    url.searchParams.set('timeZone', getUserTimeZone());
    url.searchParams.set('maxResults', '250');

    const response = await fetch(url.toString());
    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Events API error: ${response.status} ${details}`);
    }

    const data = await response.json();
    calendarEvents = (data.items || []).map(normalizeGoogleEvent);
    lastLoadedRange = rangeKey;
  } catch (error) {
    console.error(error);
    calendarEvents = [];
    loadError = error.message;
  } finally {
    isLoading = false;
    renderCalendar();
  }
}

document.getElementById('prevMonth').addEventListener('click', async () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
  await loadEvents();
});

document.getElementById('nextMonth').addEventListener('click', async () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
  await loadEvents();
});

document.getElementById('closeModal').addEventListener('click', () => modal.close());

document.querySelectorAll('.lang-btn').forEach(button => {
  button.addEventListener('click', () => {
    currentLang = button.dataset.lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn === button));
    applyLanguage();
  });
});

document.getElementById('refreshBtn').addEventListener('click', async () => {
  await loadEvents(true);
  if (!loadError) alert(i18n[currentLang].refreshDone);
});

document.getElementById('installBtn').addEventListener('click', () => {
  alert(i18n[currentLang].installHint);
});

applyLanguage();
loadEvents(true);
