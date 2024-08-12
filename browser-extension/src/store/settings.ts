import { reactive } from 'vue';

export const settings = reactive({
  burn: {
    red: 3,
    yellow: 7,
    resupply: 16,
    buffers: {
      '01.MAINBURNALL': {
        red: true,
        yellow: true,
        green: true,
        inf: false,
        minimized: {
          Hephaestus: true,
          Nike: true,
          Harmonia: true,
          Elon: true,
          Promitor: true,
          Overall: true,
        },
      },
    },
  },
});
