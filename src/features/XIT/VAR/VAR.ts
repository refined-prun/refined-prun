import VAR from '@src/features/XIT/VAR/VAR.vue';

xit.add({
  command: ['VAR', 'VARIABLE'],
  name: parameters => {
    if (parameters.length === 0) {
      return 'VARIABLES';
    }
    const parameter = parameters[0].toUpperCase();
    switch (parameter) {
      case 'CX':
        return 'SELECT COMMODITY EXCHANGE';
      case 'MAT':
        return 'SELECT MATERIAL';
      case 'BS':
        return 'SELECT BASE';
      default:
        return 'UNKNOWN TYPE';
    }
  },
  description: 'Select a given variable and update tiles on the current screen.',
  optionalParameters: 'CX | MAT | BS',
  contextItems: parameters =>
    parameters.length === 0
      ? [{ cmd: 'XIT VAR CX' }, { cmd: 'XIT VAR MAT' }, { cmd: 'XIT VAR BS' }]
      : [],
  component: () => VAR,
});
