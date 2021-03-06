import * as React from 'react';
import { Alert, Icon, Input, Layout, Menu } from 'antd';
import * as PropTypes from 'prop-types';
import CSS from 'react-css-modules';
import { MessageType, UserType } from 'config/types';
import Header from './Header/Header';
import {
  contentStyles,
  mainLayoutStyles,
  menuSiderStyles,
  menuStyles,
  inputContainerStyles,
  inputStyles,
  messagesStyles,
  messageStyles,
} from './styles';
import styles from './ChatPage.modules.scss';

const GROUP_CHAT_KEY = 'group_chat_key';

@CSS(styles)
export default class ChatPage extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(MessageType).isRequired,
    users: PropTypes.arrayOf(UserType).isRequired,
    me: PropTypes.string.isRequired,

    onExit: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isAdmin: false,
  };

  state = {
    currentUser: null,
    draftMessages: {},
  };

  handleSelectDialog = ({ key }) => {
    if (key === GROUP_CHAT_KEY) {
      this.setState({
        currentUser: null,
      });
    } else {
      const { users } = this.props;
      this.setState({
        currentUser: users.find(({ port }) => `${port}` === key) || null,
      });
    }
  };

  get currentKey() {
    const { currentUser } = this.state;
    return !currentUser ? GROUP_CHAT_KEY : `${currentUser.port}`;
  }

  get currentDraft() {
    return this.state.draftMessages[this.currentKey] || '';
  }

  get messages() {
    const key = this.currentKey;
    const { messages } = this.props;
    console.log(messages, key);
    console.log('>>> FILTER MESSAGES', messages, key, this.props, this.state);
    return messages.filter(({ author, toCOM }) =>
      key === GROUP_CHAT_KEY ? !toCOM : toCOM && (`${author.port}` === key || `${toCOM}` === key)
    );
  }

  handleSend = () => {
    const key = this.currentKey;
    const currentValue = this.currentDraft;
    this.props.onSendMessage(key === GROUP_CHAT_KEY ? null : key, currentValue);
    this.setState(({ draftMessages }) => ({
      draftMessages: {
        ...draftMessages,
        [key]: '',
      }
    }));
  };

  handleChange = e => {
    const { draftMessages } = this.state;
    this.setState({
      draftMessages: {
        ...draftMessages,
        [this.currentKey]: e.target.value,
      }
    });
  };

  render() {
    const { users, onExit, me } = this.props;
    const { currentUser } = this.state;

    return (
      <Layout>
        <Layout.Sider {...menuSiderStyles}>
          <Menu
            {...menuStyles}
            openKeys={['ls']}
            onSelect={this.handleSelectDialog}
          >
            <Menu.Item key={GROUP_CHAT_KEY}>
              <Icon type="team" />Групповой чат
            </Menu.Item>
            <Menu.SubMenu key="ls" title={<span><Icon type="mail" />Личные сообщения</span>}>
              { users.map(({ port, nickname }) => (
                <Menu.Item key={port}>{nickname}</Menu.Item>
              )) }
            </Menu.SubMenu>
          </Menu>
        </Layout.Sider>
        <Layout {...mainLayoutStyles}>
          <Layout.Content  {...contentStyles}>
            <Header
              currentUser={currentUser}
              onExit={onExit}
              me={me}
            />
            <div {...messagesStyles}>
              { this.messages.map(({ author: { nickname }, text }, i) => (
                <Alert
                  message={nickname}
                  description={text}
                  type={me === nickname ? 'success' : 'info'}
                  key={i}
                  {...messageStyles}
                />
              ))}
            </div>
            <div {...inputContainerStyles}>
              <Input.Search
                {...inputStyles}
                value={this.currentDraft}
                onChange={this.handleChange}
                onSearch={this.handleSend}
                enterButton="Отправить"
              />
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}
