import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Col, Layout, Row, Tag, Typography } from 'antd';
import { UserType } from 'config/types';
import { headerStyles, meStyles, rowStyles } from './styles';

const { Text } = Typography;

export default class Header extends React.Component {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    onSettingsClick: PropTypes.func.isRequired,
    me: UserType.isRequired,
    currentUser: UserType,
  };

  static defaultProps = {
    currentUser: null,
  };

  render() {
    const { isAdmin, me, currentUser, onSettingsClick } = this.props;
    return (
      <Layout.Header {...headerStyles}>
        <Row {...rowStyles}>
          <Col span={16}>
            <Text strong>
              { currentUser ? currentUser.nickname : 'Групповой чат' }
            </Text>
          </Col>
          <Col span={6}>
            <Text {...meStyles}>{ me.nickname }</Text>
            { isAdmin && (
              <Tag color="magenta">Админ</Tag>
            )}
          </Col>
          <Col span={2}>
            <Button
              shape="circle"
              icon="setting"
              size="small"
              onClick={onSettingsClick}
            />
          </Col>
        </Row>
      </Layout.Header>
    );
  }
}
