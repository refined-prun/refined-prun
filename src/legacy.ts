export const CurrencySymbols = {
  CIS: '₡',
  AIC: '₳',
  NCC: '₦',
  ICA: 'ǂ',
  ECD: '€',
};

export const ExchangeTickersReverse = {
  AI1: 'ANT',
  CI1: 'BEN',
  NC1: 'MOR',
  IC1: 'HRT',
  NC2: 'HUB',
  CI2: 'ARC',
};

export const Stations = {
  'Antares Station': 'ANT',
  'Benten Station': 'BEN',
  'Moria Station': 'MOR',
  'Hortus Station': 'HRT',
  'Hubur Station': 'HUB',
  'Arclight Station': 'ARC',
};

/**
 * List of CSS Hashes used as selectors to find interesting elements.
 * They change when the interface gets updated.
 * These are CSS selectors, and not XPath expressions.
 */
export const Selector = {
  BufferHeaderClass: 'TileFrame__cmd___ScBYW0n type__type-very-small___HaVMqrE',
  BufferHeader: "div[class~='TileFrame__cmd___ScBYW0n']",
  Inventory: "div[class~='InventoryView__grid___UyRQSX8']",
  ButtonSuccess: "button[class~='Button__success___bCiIVXw']",
  ActionFeedback: "span[class~='ActionFeedback__message___G2Sz4bw']",
  ActionFeedbackMain: "span[class~='ActionFeedback__message___G2Sz4bw'] > span",
  ActionSuccess: "div[class~='ActionFeedback__success___nVa5scG']",
  ActionDismiss: "span[class~='ActionFeedback__dismiss___x5Ln7y1']",
  ActionConfirmation: "span[class~='ActionConfirmationOverlay__text___qkKzVK0']",
  ActionConfirmationMessage: "span[class~='ActionConfirmationOverlay__message___OajoGeh']",
  StoreSelect: "select[class~='StoreSelect__container___tDwUv6W']",
  MaterialSelector: "input[class~='MaterialSelector__input___tyJaKPm']",
};

// A list of PrUN class names that can be applied to style elements
export const Style = {
  // Styles coloring buttons
  Button: ['Button__btn___UJGZ1b7'],
  ButtonPrimary: ['Button__primary____lObPiw'],
  ButtonDisabled: ['Button__disabled____x8i7XF'],
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

  // Action bar stuff
  ActionBarContainer: ['ActionBar__container___p760bSs'],
  ActionBarElement: ['ActionBar__element___WJlsFch'],

  // Styles coloring overlays
  OverlappingDiv: ['Overlay__overlay___NA9HV8y'],
  GreyStripes: ['Overlay__background___ieZpHiF', 'Overlay__overlay___NA9HV8y'],
  Spacer: ['Overlay__close___bxGoMIl'],
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

// The text colors used in PrUN
export const TextColors = {
  Failure: '#d9534f',
  Success: '#5cb85c',
  Standard: '#bbbbbb',
  Yellow: '#f7a600',
};
