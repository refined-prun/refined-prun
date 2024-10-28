// A list of PrUN class names that can be applied to style elements
export const Style = {
  // Styles coloring buttons
  Button: ['Button__btn___UJGZ1b7'],
  ButtonPrimary: ['Button__primary____lObPiw'],
  ButtonDisabled: ['Button__disabled____x8i7XF'],
  ButtonEnabled: ['Button__primary____lObPiw'],
  ButtonDanger: ['Button__danger___S2rSOES'],
  ButtonNeutral: ['Button__neutral___OAFOaNs'],
  SmallButton: [
    'Button__darkInline___z_YKa91',
    'Button__dark___vdJbcc8',
    'Button__btn___UJGZ1b7',
    'Button__inline___Ffw9bbn',
  ],

  // Misc styles
  SidebarSectionHead: ['Sidebar__sectionHead____NHLKDT', 'fonts__font-regular___Sxp1xjo'],
  DraftName: [
    'Draft__name___gADQF2n',
    'Draft__heading___GbdKCJx',
    'fonts__font-headers___eDKxf8h',
    'type__type-very-large____Hxqf3q',
  ],

  // More misc styles
  RadioButton: ['RadioItem__container___CSczqmG'],
  RadioButtonUnToggled: ['RadioItem__indicator___QzQtjhA'],
  RadioButtonToggled: [
    'RadioItem__indicator___QzQtjhA',
    'RadioItem__active___CDscOQV',
    'effects__shadowPrimary___EbXJQor',
  ],
  RadioButtonValue: [
    'RadioItem__value___Yd1Gt1T',
    'fonts__font-regular___Sxp1xjo',
    'type__type-small___pMQhMQO',
  ],

  // Action bar stuff
  ActionBarContainer: ['ActionBar__container___p760bSs'],
  ActionBarElement: ['ActionBar__element___WJlsFch'],

  // Styles coloring overlays
  OverlappingDiv: ['Overlay__overlay___NA9HV8y'],
  GreyStripes: ['Overlay__background___ieZpHiF', 'Overlay__overlay___NA9HV8y'],
  Spacer: ['Overlay__close___bxGoMIl'],
  ProgressBar: ['ProgressBar__primary___O30jBqq', 'ProgressBar__progress___eb4KhuW'],
  ProgressBarColors: [
    'ProgressBar__primary___O30jBqq',
    'grey-progress-bar',
    'good-progress-bar',
    'warning-progress-bar',
    'danger-progress-bar',
  ],
  ProgressBarGood: ['good-progress-bar'],
  ProgressBarWarning: ['warning-progress-bar'],
  ProgressBarDanger: ['danger-progress-bar'],
  CenterInterface: ['Overlay__children___rgtVaxc'],

  // Styles coloring forms
  FormRow: [
    'FormComponent__containerActive___HZv9jHd',
    'forms__active___wn9KQTZ',
    'forms__form-component___yTgP_Qa',
  ],
  HeaderRow: [
    'FormComponent__containerPassive___FrBdyGU',
    'forms__passive___biRUiE5',
    'forms__form-component___yTgP_Qa',
  ],
  FormLabel: [
    'FormComponent__label___aQB15eB',
    'fonts__font-regular___Sxp1xjo',
    'type__type-regular___k8nHUfI',
  ],
  FormInput: ['FormComponent__input___ZnI8mYi', 'forms__input___A92_N4J'],
  FormSaveRow: [
    'FormComponent__containerCommand___B4XLERf',
    'forms__cmd___IMzt7Ug',
    'forms__form-component___yTgP_Qa',
  ],
  FormSaveLabel: [
    'FormComponent__label___aQB15eB',
    'fonts__font-regular___Sxp1xjo',
    'type__type-regular___k8nHUfI',
  ],
  FormSaveInput: ['FormComponent__input___ZnI8mYi', 'forms__input___A92_N4J'],
  FormInputDiv: ['DynamicInput__dynamic___Cd4Gkbz', 'forms__dynamic___FHDMFtf'],
  FormError: ['FormComponent__containerError___pN__L1Q', 'forms__error___nWVhbAS'],
  FormPassiveLabel: ['StaticInput__static___Vpn1u0n', 'forms__static___a4biDi4'],

  // Styles coloring confirmation overlays
  ActionOverlay: [
    'ActionConfirmationOverlay__container___A05Ts1g',
    'ActionFeedback__overlay___NNDPRrV',
  ],
  ActionCenterInterface: [
    'ActionConfirmationOverlay__message___OajoGeh',
    'ActionFeedback__message___G2Sz4bw',
    'fonts__font-regular___Sxp1xjo',
    'type__type-larger___VdpJIb1',
  ],
  ActionConfirm: [
    'ActionConfirmationOverlay__message___OajoGeh',
    'ActionFeedback__message___G2Sz4bw',
    'fonts__font-regular___Sxp1xjo',
    'type__type-larger___VdpJIb1',
  ],
  ActionConfirmMessage: [
    'ActionConfirmationOverlay__text___qkKzVK0',
    'ActionFeedback__text___YQjjibG',
    'fonts__font-regular___Sxp1xjo',
    'type__type-regular___k8nHUfI',
  ],
  ActionButtons: ['ActionConfirmationOverlay__buttons___sE7CNVe'],
  ActionSuccess: ['ActionFeedback__success___nVa5scG', 'ActionFeedback__overlay___NNDPRrV'],
  ActionMessage: [
    'ActionFeedback__message___G2Sz4bw',
    'fonts__font-regular___Sxp1xjo',
    'type__type-larger___VdpJIb1',
  ],
  ActionDismiss: ['ActionFeedback__dismiss___x5Ln7y1', 'type__type-small___pMQhMQO'],
};

// A function to apply multiple classes to an element in one go
export const WithStyles = (...style: string[][]): string[] => {
  return style.reduce((previousValue, currentValue) => previousValue.concat(currentValue));
};

// The text colors used in PrUN
export const TextColors = {
  Failure: '#d9534f',
  Success: '#5cb85c',
  Standard: '#bbbbbb',
  Yellow: '#f7a600',
};
