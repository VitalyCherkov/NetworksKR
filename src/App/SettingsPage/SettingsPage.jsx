import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Modal } from 'antd';
import { UserType } from 'config/types';

export default class SettingsPage extends React.Component {
  static propTypes = {
    me: UserType,

    open: PropTypes.bool.isRequired,

    onClose: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
  };

  static defaultProps = {
    me: null,
  };

  render() {
    const { open, onLogout, onClose } = this.props;
    return (
      <Modal
        title="Настройки"
        visible={open}
        onCancel={onClose}
        cancelText="Закрыть настройки"
        okText="Выйти из аккаунта"
        onOk={onLogout}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    );
  }
}
