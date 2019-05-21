import * as React from 'react';
import * as PropTypes from 'prop-types';
import CSS from 'react-css-modules';
import { Badge, Button, Dropdown, Menu, Modal, Tabs } from 'antd';
import {
  comPortTypes,
  getDefaultSettings,
  settingsConstantList,
  settingsConstants
} from 'config/comSettings';
import styles from './SettingsPage.modules.scss';

const TITLES = {
  name: 'COM Port',
  baudRate: 'Скорость передачи',
  size: 'Размер',
  parity: 'Четность',
  stopBits: 'Стоповые биты',
};


@CSS(styles)
export default class SettingsPage extends React.Component {
  static propTypes = {
    isFirstConnected: PropTypes.bool.isRequired,
    isSecondConnected: PropTypes.bool.isRequired,

    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,

    onLogout: PropTypes.func.isRequired,
    onSettingsChanged: PropTypes.func.isRequired,
    onDisconnect: PropTypes.func.isRequired,
  };

  state = {
    activeTab: comPortTypes.FIRST,
    [comPortTypes.FIRST]: getDefaultSettings(),
    [comPortTypes.SECOND]: getDefaultSettings({ name: '1' }),
  };

  handleSelectValue = (comPort, item) => ({ key }) => {
    const config = this.state[comPort];
    this.setState({
      [comPort]: {
        ...config,
        [item]: key,
      }
    })
  };

  getDropdownItem = comPort => key => {
    const value = this.state[comPort][key];
    const constants = Object.values(settingsConstants[key]);
    const item = constants.find(({ id }) => `${id}` === `${value}`);
    const label = item ? item.name : 'Ничего не выбрано';

    return (
      <div styleName="settings-item" key={key}>
        <p>{TITLES[key]}</p>
        <Dropdown overlay={
          <Menu onClick={this.handleSelectValue(comPort, key)}>
            { constants.map(({ id, name }) => (
              <Menu.Item key={id}>{name}</Menu.Item>
            )) }
          </Menu>
        }>
          <Button>{label}</Button>
        </Dropdown>
      </div>
    );
  };

  handleChangeTab = activeTab =>
    this.setState({ activeTab });

  isSaveActive = comPortType => {
    const config = this.state[comPortType];
    return settingsConstantList.findIndex(field => !config[field]) < 0;
  };

  handleSave = comPortType => () => {
    const config = this.state[comPortType];
    const request = {};
    settingsConstantList.forEach(name => {
      for (let item of Object.values(settingsConstants[name])) {
        if (`${item.id}` === `${config[name]}`) {
          request[name] = item.id;
          break;
        }
      }
    });

    this.props.onSettingsChanged(comPortType, request);
  };

  handleDisconnect = comPortType => () =>
    this.props.onDisconnect(comPortType);

  getForm = comPortType => settingsConstantList.map(this.getDropdownItem(comPortType));

  render() {
    const {
      open,
      onClose,
      onDisconnect,
      isFirstConnected,
      isSecondConnected,
    } = this.props;

    const { activeTab } = this.state;

    return (
      <Modal
        title="Настройки"
        visible={open}
        onCancel={onClose}
        cancelText="Отмена"
        okText="Сохранить настройки"
        onOk={this.handleSave}
      >
        <Tabs activeKey={activeTab} onTabClick={this.handleChangeTab}>
          <Tabs.TabPane
            tab={(
              <Badge
                dot={true}
                status={isFirstConnected ? 'success' : 'error'}
              >
                Первый COM
              </Badge>
            )}
            key={comPortTypes.FIRST}
          >
            {this.getForm(comPortTypes.FIRST)}
            <Button
              type="primary"
              onClick={this.handleSave(comPortTypes.FIRST)}
              disabled={!this.isSaveActive(comPortTypes.FIRST)}
            >
              Соединиться
            </Button>
            <Button
              onClick={this.handleDisconnect(comPortTypes.FIRST)}
              disabled={!isFirstConnected}
            >
              Разорвать соединение
            </Button>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={(
              <Badge
                dot={true}
                status={isSecondConnected ? 'success' : 'error'}
              >
                Второй COM
              </Badge>
            )}
            key={comPortTypes.SECOND}
          >
            {this.getForm(comPortTypes.SECOND)}
            <Button
              type="primary"
              onClick={this.handleSave(comPortTypes.SECOND)}
              disabled={!this.isSaveActive(comPortTypes.SECOND)}
            >
              Соединиться
            </Button>
            <Button
              onClick={this.handleDisconnect(comPortTypes.SECOND)}
              disabled={!isSecondConnected}
            >
              Разорвать соединение
            </Button>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}
