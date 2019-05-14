import * as React from 'react';
import CSS from 'react-css-modules';
import delay from 'utils/delay';
import ChatPage from './ChatPage/ChatPage';
import LoginPage from './LoginPage/LoginPage';
import SettingsPage from './SettingsPage/SettingsPage';
import styles from './App.modules.scss';

@CSS(styles)
export default class App extends React.Component {
  state = {
    messages: [],
    users: [
      {
        port: 123,
        nickname: 'Петя',
      },
      {
        port: 456,
        nickname: 'Вася',
      },
    ],
    isSettingsOpen: false,
    isAdmin: true,
    isLoading: false,
    me: {
      port: 5000,
      nickname: 'Виталий',
    },
  };

  handleLogin = async (user) => {
    this.setState({ isLoading: true });

    await delay(1000);

    this.setState({
      isLoading: false,
      me: {
        port: 5000,
        nickname: user,
      }
    });
  };

  toggleSettings = () =>
    this.setState(({ isSettingsOpen }) => ({ isSettingsOpen: !isSettingsOpen }));

  handleLogout = () =>
    this.setState({ me: null, isSettingsOpen: false });

  handleSendMessage = (key, value) => {
    console.log('send: ', key, value);
    const { me, messages } = this.state;
    const msg = {
      author: me,
      toCOM: key,
      text: value,
    };
    this.setState({
      messages: [...messages, msg],
    });
  };

  render() {
    const { isSettingsOpen, isAdmin, isLoading, me, messages, users } = this.state;
    return (
      <div styleName="app">
        { isLoading && <div styleName="app__loader"/> }
        { me
          ? (
            <ChatPage
              isAdmin={isAdmin}
              messages={messages}
              users={users}
              me={me}
              onSettingsClick={this.toggleSettings}
              onSendMessage={this.handleSendMessage}
            />
          )
          : (
            <LoginPage
              isAdmin={isAdmin}
              onLogin={this.handleLogin}
            />
          )
        }
        <SettingsPage
          open={isSettingsOpen}
          me={me}
          isAdmin={isAdmin}
          onClose={this.toggleSettings}
          onLogout={this.handleLogout}
        />
      </div>
    );
  }
}
