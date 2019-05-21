import * as PropTypes from 'prop-types';

export const UserType = PropTypes.shape({
  port: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nickname: PropTypes.string.isRequired,
});

export const MessageType = PropTypes.shape({
  author: UserType.isRequired,
  text: PropTypes.string.isRequired,
  toCOM: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
});
