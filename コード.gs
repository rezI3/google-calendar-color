const scriptProperties = PropertiesService.getScriptProperties();

const onChangeShiftBoardSchedule = () => {

  // 自分のカレンダーを取得
  const CALENDAR_ID = getCalendarId();
  const myCalendar = CalendarApp.getCalendarById(CALENDAR_ID);

  // 前回からの差分のみを取得するためのオプション
  const optionalArgs = {
    'syncToken': getNextSyncToken(CALENDAR_ID)
  };

  // 前回から変更があったイベントの一覧を取得
  const events = Calendar.Events.list(CALENDAR_ID, optionalArgs);

  // 色の宣言
  const grape = CalendarApp.EventColor.MAUVE;

  // イベント一覧から、説明欄が "シフトボードから追加" のイベントの ID を取得する
  events.items.filter(event => event.getDescription() === "シフトボードから追加")
    .map(event => event.id)
    // ID を使ってイベントを取得し、ブドウ色に変更する
    .forEach(eventId => {
      myCalendar.getEventById(eventId).setColor(grape);
    });

  // 次回実行時に参照するnextSyncTokenを更新
  setNextSyncToken(events.nextSyncToken);
}

const getNextSyncToken = (calendarId) => {
  // ScriptPropetiesから取得
  const nextSyncTokenFromProperties = scriptProperties.getProperty('NEXT_SYNC_TOKEN');

  if (nextSyncTokenFromProperties) {
    console.log('getNextSyncToken(from property):%s', nextSyncTokenFromProperties);
    return nextSyncTokenFromProperties
  }

  // ScriptPropetiesにない場合は、カレンダーから取得
  const events = Calendar.Events.list(calendarId, {'timeMin': (new Date()).toISOString()});
  const nextSyncTokenFromCalEvents = events.nextSyncToken;
  console.log('getNextSyncToken(from calendar):%s', nextSyncTokenFromCalEvents );
  return nextSyncTokenFromCalEvents ;
}

const setNextSyncToken = (nextSyncToken) => {
  scriptProperties.setProperty('NEXT_SYNC_TOKEN', nextSyncToken);
  console.log('setNextSyncToken(to property):%s', nextSyncToken);
  return;
}

const getCalendarId = () => {
  const calendarId = scriptProperties.getProperty('CALENDAR_ID')
  return calendarId;
}

