const iota = (...keys) => keys.reduce((acc, key, index) => ({
  ...acc,
  [key]: index,
}), {});

export const getEventName = (events, index) =>
  Object.keys(events)
    .find(n => events[n] === index) || null;

export const getEventIndex = (where, name) => {
  const index = where[name];
  if (!index && index !== 0) {
    return null;
  }
  return index;
};

export const toAppNames = {
  NO_ACC: 'NO_ACC', // не дошло сообщение
  DISCONNECT: 'DISCONNECT', // физический
  DISRUPTION: 'DISRUPTION', // разрыв кольца
  CONNECT: 'CONNECT', // установлено физическое соединение
  CONNECT_REQUEST: 'CONNECT_REQUEST', // ?
  DISCONNECT_REQUEST: 'DISCONNECT_REQUEST', // ?
  ACK: 'ACK', // сообщение успешно доставлено
  ERROR: 'ERROR', // другая ошибка
  CONNECT_RING: 'CONNECT_RING', // установлено логическое соединение
  MESSAGE: 'MESSAGE', // сообщение от серверв
};

export const toAppEvents = iota(
  toAppNames.NO_ACC,
  toAppNames.DISCONNECT,
  toAppNames.DISRUPTION,
  toAppNames.CONNECT,
  toAppNames.CONNECT_REQUEST,
  toAppNames.DISCONNECT_REQUEST,
  toAppNames.ACK,
  toAppNames.ERROR,
  toAppNames.CONNECT_RING,
  toAppNames.MESSAGE,
);

export const fromAppNames = {
  OP_CONNECT: 'OP_CONNECT', // физич.
  OP_DISCONNECT: 'OP_DISCONNECT', // физич.
  OP_RING_CONNECT: 'OP_RING_CONNECT', // логич.
  OP_KILL_RING: 'OP_KILL_RING', // логич.
  OP_SEND: 'OP_SEND', // настройки
};

export const fromAppEvents = iota(
  fromAppNames.OP_CONNECT,
  fromAppNames.OP_DISCONNECT,
  fromAppNames.OP_RING_CONNECT,
  fromAppNames.OP_KILL_RING,
  fromAppNames.OP_SEND,
);

console.log('AAAAA', toAppEvents, getEventName(toAppEvents, 3));
