import * as React from 'react';
import CSS from 'react-css-modules';
import { message as showMessage } from 'antd';
import delay from 'utils/delay';
import transport from 'store/transport';
import { connectionStages } from 'config/stages';
import { fromAppNames, toAppNames } from 'store/events';
import { comPortTypes } from 'config/comSettings';
import ChatPage from './ChatPage/ChatPage';
import LoginPage from './LoginPage/LoginPage';
import SettingsPage from './SettingsPage/SettingsPage';
import styles from './App.modules.scss';

@CSS(styles)
export default class App extends React.Component {
  transportItem = transport;

  state = {
    stage: connectionStages.DISCONNECTED,
    messages: [],
    users: [],
    isSettingsOpen: false,
    isLoading: false,
    me: null,

    [comPortTypes.FIRST]: {
      config: null,
      isConnected: false,
    },
    [comPortTypes.SECOND]: {
      config: null,
      isConnected: false,
    },
  };

  componentDidMount() {
    this.transportItem
      .connect()
      .on(toAppNames.MESSAGE, this.handleReceiveMessage)
      .on(toAppNames.CONNECT, this.handleConnectSuccess)
      .on(toAppNames.CONNECT_RING, this.handleConnectRingSuccess)
      .on(toAppNames.ERROR, this.handleReceiveError)
      .on(toAppNames.DISCONNECT, this.handleReceiveDisconnected);
  }

  componentWillUnmount() {
    this.transportItem
      .disconnect()
      .off(toAppNames.MESSAGE, this.handleReceiveMessage)
      .off(toAppNames.CONNECT, this.handleConnectSuccess)
      .off(toAppNames.CONNECT_RING, this.handleConnectRingSuccess)
      .off(toAppNames.ERROR, this.handleReceiveError)
      .off(toAppNames.DISCONNECT, this.handleReceiveDisconnected);
  }

  handleLogin = async (user) => {
    this.setState({ isLoading: true });

    await delay(1000);

    this.transportItem.send(fromAppNames.OP_SEND, {
      addr: null,
      message: JSON.stringify({
        nick: user,
      }),
    });

    this.setState({
      isLoading: false,
      me: user,
      stage: connectionStages.LOGGED_IN,
    });
  };

  toggleSettings = () =>
    this.setState(({ isSettingsOpen }) => ({ isSettingsOpen: !isSettingsOpen }));

  handleLogout = () => {
    transport.send(fromAppNames.OP_KILL_RING, null);
    this.setState({
      stage: connectionStages.PHYSICAL_CONNECTED,
      me: null,
      isSettingsOpen: false,
    });
  };

  handleSendMessage = (key, value) => {
    const { me, messages } = this.state;
    const msg = {
      author: {
        nickname: me,
      },
      toCOM: key,
      text: value,
    };
    this.setState({
      messages: [...messages, msg],
    });

    transport.send(fromAppNames.OP_SEND, {
      addr: key,
      message: value,
    });
  };

  handleSettingsChanged = (comPortType, settings) => {
    this.setState({
      [comPortType]: {
        config: settings,
        isConnected: false,
      },
    });
    this.transportItem.send(fromAppNames.OP_CONNECT, settings);
  };

  handleConnectLogical = () =>
    this.transportItem.send(fromAppNames.OP_RING_CONNECT);

  handleDisconnectLogical = () => {
    this.transportItem.send(fromAppNames.OP_KILL_RING);
    this.setState({
      stage: connectionStages.PHYSICAL_CONNECTED,
    });
  };

  // Пришло сообщение
  handleReceiveMessage = ({ to = null, addr, message, ...rest }) => {
    console.log('!!! HANDLE MESSAGE', addr, message, to, 'rest:', rest, this.state);
    const { users, messages } = this.state;

    // Если это сообщение логина
    try {
      const { nick } = JSON.parse(message);
      if (nick) {
        console.log('!!! HANDLE MESSAGE LOGIN', nick);
        const nextUsers = [...users];
        const index = users.findIndex(u => u.port === addr);
        const newUser = {
          port: addr,
          nickname: nick,
        };

        if (index >= 0) {
          nextUsers.splice(index, 1, newUser);
        } else {
          nextUsers.push(newUser);
        }

        this.setState({
          users:  nextUsers,
        }, () => console.log('!!! HANDLE MESSAGE RESULT', this.state));
        return;
      }

      return;
    } catch (e) {}

    const user = users.find(u => u.port === addr);
    console.log('!!! HANDLE MESSAGE TO USER', user);
    const msg = {
      author: user,
      toCOM: to,
      text: message,
    };
    console.log('!!! HANDLE MESSAGE CREATED', message);

    this.setState({
      messages: [...messages, msg],
    }, () => console.log('!!! HANDLE MESSAGE RESULT', this.state));
  };

  getComPortByAddress = addr => {
    const first = this.state[comPortTypes.FIRST];
    const second = this.state[comPortTypes.SECOND];

    if (first.config && first.config.name === addr) {
      return comPortTypes.FIRST;
    }
    if (second.config && second.config.name === addr) {
      return comPortTypes.SECOND;
    }
  };

  isPhysicalConnected = () => {
    const first = this.state[comPortTypes.FIRST];
    const second = this.state[comPortTypes.SECOND];
    return first.isConnected && second.isConnected;
  };

  // Установка физического соединения
  handleConnectSuccess = ({ addr, ...rest }) => {
    console.log('!!! HANDLE CONNECT', addr, 'rest:', rest, this.state);
    const comPortType = this.getComPortByAddress(addr);
    showMessage.success(
      `Установлено физическое соедниение для ${
        comPortType === comPortTypes.FIRST ? 'первого' : 'второго'
      } COM-порта`
    );

    console.log('!!! HANDLE CONNECT COM PORT TYPE', comPortType);

    this.setState({
      [comPortType]: {
        config: {
          ...this.state[comPortType].config,
        },
        isConnected: true,
      },
    }, () => {
      if (this.isPhysicalConnected()) {
        this.setState({
          stage: connectionStages.PHYSICAL_CONNECTED,
        });
      }
      console.log('!!! HANDLE CONNECT UPDATED', this.state);
    })
  };

  handleConnectRingSuccess = (data) => {
    console.log('!!! HANDLE CONNECT RING', 'rest:', data, this.state);
    showMessage.success('Установлено логическое соединение');
    this.setState({
      users: [],
      stage: connectionStages.LOGICAL_CONNECTED,
    })
  };

  // Обработка полученной ошибки
  handleReceiveError = ({ addr = null, message, ...rest }) => {
    console.log('!!! HANDLE ERROR', addr, message, 'rest:', rest, this.state);

    switch (message) {
      case 'ErrPhysConnect': // ошибка разрыва физического соединения
        showMessage.error('Ошибка физического соединения');
        this.setState({
          stage: connectionStages.DISCONNECTED,
          users: [],
          [comPortTypes.FIRST]: {
            isActive: false,
            config: null,
          },
          [comPortTypes.SECOND]: {
            isActive: false,
            config: null,
          },
          me: null,
          messages: [],
        });
        break;
      case 'ErrRingConnect': // ошибка разрыва логического соединения
        showMessage.error('Ошибка логического соединения');
        this.setState({
          stage: connectionStages.PHYSICAL_CONNECTED,
          users: [],
          me: null,
          messages: [],
        });
        break;
      default:
        showMessage.error('Произошла ошибка!');
    }
  };

  handleReceiveDisconnected = ({ addr, ...rest }) => {
    console.log('!!! HANDLE DISCONNECT', addr, 'rest:', rest, this.state);
    showMessage.success('Физическое соединение разорвано');

    const comPortType = this.getComPortByAddress(addr);
    const comPort = this.state[comPortType];
    this.setState({
      [comPortType]: {
        config: comPort.config,
        isConnected: false,
      },
      stage: connectionStages.DISCONNECTED,
    }, () => console.log('!!! HANDLE DISCONNECT AFTER', this.state));
  };

  emitDisconnect = (comPortType) => {
    showMessage.info('Разрываем физическое соединение...');
    const comPort = this.state[comPortType];
    if (!comPort || !comPort.config) {
      return;
    }

    this.transportItem.send(fromAppNames.OP_DISCONNECT, {
      addr: comPort.config.name,
    });
  };

  render() {
    const {
      isSettingsOpen,
      isLoading,
      me,
      messages,
      users,
      stage
    } = this.state;

    const first = this.state[comPortTypes.FIRST];
    const second = this.state[comPortTypes.SECOND];

    return (
      <div styleName="app">
        { isLoading && <div styleName="app__loader"/> }
        { stage === connectionStages.LOGGED_IN && (
          <ChatPage
            messages={messages}
            users={users}
            me={me}
            onExit={this.handleLogout}
            onSendMessage={this.handleSendMessage}
          />
        )}
        {(
          stage === connectionStages.LOGICAL_CONNECTED
          || stage === connectionStages.PHYSICAL_CONNECTED
        ) && (
          <LoginPage
            stage={stage}
            onLogin={this.handleLogin}
            onConnectLogical={this.handleConnectLogical}
            onDisconnectLogical={this.handleDisconnectLogical}
            onSettingsOpen={this.toggleSettings}
          />
          )
        }
        <SettingsPage
          isFirstConnected={first.isConnected}
          isSecondConnected={second.isConnected}

          open={stage === connectionStages.DISCONNECTED || isSettingsOpen}
          onClose={this.toggleSettings}

          onLogout={this.handleLogout}
          onSettingsChanged={this.handleSettingsChanged}
          onDisconnect={this.emitDisconnect}
        />
      </div>
    );
  }
}
