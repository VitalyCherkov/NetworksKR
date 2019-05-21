import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Alert, Button, Input } from 'antd';
import CSS from 'react-css-modules';
import { connectionStages } from 'config/stages';
import styles from './LoginPage.modules.scss';

@CSS(styles)
export default class LoginPage extends React.Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    stage: PropTypes.string.isRequired,

    onConnectLogical: PropTypes.func.isRequired,
    onDisconnectLogical: PropTypes.func.isRequired,
    onSettingsOpen: PropTypes.func.isRequired,
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
    const {
      stage,
      onConnectLogical,
      onSettingsOpen,
      onDisconnectLogical,
    } = this.props;
    const { isError } = this.state;

    return (
      <div styleName="login-page">
        <h1>Добро пожаловать</h1>
        <div styleName="login-page__content">
          { stage === connectionStages.LOGICAL_CONNECTED && (
            <React.Fragment>
              <Input.Search
                placeholder="Придумайте никнейм"
                enterButton="Войти"
                onSearch={this.handleEnter}
                styleName="login-page__item"
              />
              { isError && (
                <div styleName="login-page__error">
                  <Alert type="error" message="Некорректный никнейм" />
                </div>
              )}
            </React.Fragment>
          )}

          { stage === connectionStages.PHYSICAL_CONNECTED && (
            <React.Fragment>
              <div styleName="login-page__item">
                <Button onClick={onConnectLogical}>
                  Установить логическое соединение
                </Button>
              </div>
              <div styleName="login-page__item">
                <Button onClick={onSettingsOpen}>
                  Открыть настройки
                </Button>
              </div>
            </React.Fragment>
          )}

          { stage === connectionStages.LOGICAL_CONNECTED && (
            <Button
              onClick={onDisconnectLogical}
              styleName="login-page__item"
            >
              Разорвать логическое соединение
            </Button>
          )}
        </div>
      </div>
    );
  }
}
