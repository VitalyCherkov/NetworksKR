import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Alert, Button, Input } from 'antd';
import CSS from 'react-css-modules';
import styles from './LoginPage.modules.scss';

@CSS(styles)
export default class LoginPage extends React.Component {

  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    onLogin: PropTypes.func.isRequired,
  };

  state = {
    isError: '',
  };

  handleEnter = nickname => {
    if (nickname.trim().length === 0) {
      this.setState({ isError: true });
    } else {
      this.setState(
        { isError: false },
        () => this.props.onLogin(nickname)
      );
    }
  };

  render() {
    const { isAdmin } = this.props;
    const { isError } = this.state;

    return (
      <div styleName="login-page">
        <h1>Добро пожаловать</h1>
        { isAdmin && (
          <div  styleName="login-page__alert">
            <Alert message="Это компьютер администратора"/>
          </div>
        )}
        <div styleName="login-page__content">
          <Input.Search
            placeholder="Придумайте никнейм"
            enterButton="Войти"
            onSearch={this.handleEnter}
          />
          { isError && (
            <div styleName="login-page__error">
              <Alert type="error" message="Некорректный никнейм" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
