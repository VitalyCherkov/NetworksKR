import { fromAppEvents, getEventIndex, getEventName, toAppEvents } from './events';

const WS_URL = `ws://127.0.0.1:8000/ws`;

class Transport {
  listeners = {};
  connection = null;

  connect = (url = WS_URL) => {
    this.disconnect().connection = new WebSocket(url);

    this.connection.onclose = () => {
      console.log('connection close');
    };

    this.connection.onmessage = (message) => {
      console.log('connection message: ', message.data);

      try {
        const { type, payload = null } = JSON.parse(message.data);
        const eventName = getEventName(toAppEvents, type);
        console.log('got event name: ', eventName, toAppEvents, type);
        if (eventName === null) {
          return;
        }

        console.log('>>> parsed message: ', type, eventName, payload, '>>> listeners', this.listeners[eventName]);
        debugger;
        this.emit(eventName, payload);
      } catch (e) {
        console.log('connection can not parse message');
      }
    };

    this.connection.onerror = () => {
      console.log('connection error');
    };

    return this;
  };

  disconnect = () => {
    if (this.connection && typeof this.connection.close === 'function') {
      this.connection.close();
    }

    return this;
  };

  on = (eventName, listener) => {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    if (!this.listeners[eventName].includes(listener)) {
      this.listeners[eventName].push(listener);
    }

    return this;
  };

  off = (eventName, listener) => {
    if (!this.listeners[eventName]) {
      return this;
    }

    const index = this.listeners[eventName].indexOf(listener);
    if (index < 0) {
      return this;
    }

    this.listeners[eventName].splice(index, 1);
    return this;
  };

  emit = (eventName, data) =>
    (this.listeners[eventName] || []).forEach(l => l(data));

  send = (eventName, payload) => {
    this.emit(eventName, payload);

    const eventIndex = getEventIndex(fromAppEvents, eventName);
    console.log('send: ', eventName, eventIndex, fromAppEvents, payload);
    if (eventIndex === null) {
      return this;
    }

    if (this.connection && typeof this.connection.send === 'function') {
      try {
        this.connection.send(JSON.stringify({
          type: eventIndex,
          payload,
        }));
      } catch (e) {
        console.log('can not send to connection, ', eventName, payload, e);
      }
    }
  };
}

export default new Transport();
