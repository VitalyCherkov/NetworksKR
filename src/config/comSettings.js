const getNumberConstant = namePrefix => value => ({
  [`${namePrefix}_${value}`]: {
    id: value,
    name: `${value}`,
  }
});

const nameConstants = [
  '0', '1',
]
  .map(getNumberConstant('COM'))
  .reduce((acc, cur) => ({ ...acc, ...cur }), {});

const parityConstants = {
  ODD: {
    id: 'odd',
    name: 'Четный'
  },
  EVEN: {
    id: 'even',
    name: 'Нечетный',
  },
  MARK: {
    id: 'mark',
    name: 'Маркированный',
  },
  SPACE: {
    id: 'space',
    name: 'Пустой'
  },
  NONE: {
    id: 'none',
    name: 'Нет',
  }
};

const stopBitsConstants = {
  STOP_1: {
    id: 1,
    name: '1',
  },
  STOP_1_HALF: {
    id: 15,
    name: '15',
  },
  STOP_2: {
    id: 2,
    name: '2',
  },
};

const sizeConstants = [
  5,
  6,
  7,
  8,
]
  .map(getNumberConstant('SIZE'))
  .reduce((acc, cur) => ({ ...acc, ...cur }), {});

const baudRateConstants = [
  115200,
  57600,
  38400,
  19200,
  9600,
  4800,
  2400,
  1200,
  600,
  300,
  150,
  134,
  110,
  75,
  50,
]
  .map(getNumberConstant('RATE'))
  .reduce((acc, cur) => ({ ...acc, ...cur }), {});

export const settingsConstantNames = {
  NAME: 'name',
  BAUD_RATE: 'baudRate',
  SIZE: 'size',
  PARITY: 'parity',
  STOP_BITS: 'stopBits',
};

export const settingsConstantList = [
  settingsConstantNames.NAME,
  settingsConstantNames.BAUD_RATE,
  settingsConstantNames.SIZE,
  settingsConstantNames.PARITY,
  settingsConstantNames.STOP_BITS,
];

export const settingsConstants = {
  name: nameConstants,
  baudRate: baudRateConstants,
  size: sizeConstants,
  parity: parityConstants,
  stopBits: stopBitsConstants,
};

export const comPortTypes = {
  FIRST: 'port_first',
  SECOND: 'port_second',
};

export const getDefaultSettings = (propsToOverride = {}) => ({
  name: '0',
  baudRate: 115200,
  size: 8,
  parity: 'none',
  stopBits: 2,
  ...propsToOverride,
});
