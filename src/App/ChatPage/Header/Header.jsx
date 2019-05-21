import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Col, Layout, Row, Tooltip, Typography } from 'antd';
import { UserType } from 'config/types';
import { headerStyles, meStyles, rowStyles } from './styles';

const { Text } = Typography;

export default class Header extends React.Component {
  static propTypes = {
    onExit: PropTypes.func.isRequired,
    me: PropTypes.string.isRequired,
    currentUser: UserType,
  };

  static defaultProps = {
    currentUser: null,
  };

  render() {
    const { me, currentUser, onExit } = this.props;
    return (
      <Layout.Header {...headerStyles}>
        <Row {...rowStyles}>
          <Col span={16}>
            <Text strong>
              { currentUser ? currentUser.nickname : 'Групповой чат' }
            </Text>
          </Col>
          <Col span={6}>
            <Text {...meStyles}>{ me }</Text>
          </Col>
          <Col span={2}>
            <Tooltip placement="leftBottom" title="Разорвать логическое соединение">
              <Button
                shape="circle"
                icon="logout"
                size="small"
                onClick={onExit}
              />
            </Tooltip>
          </Col>
        </Row>
      </Layout.Header>
    );
  }
}
