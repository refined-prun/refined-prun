// A list of PrUN class names that can be applied to style elements
import system from '@src/system';

export const Style = {
  // Styles coloring buttons
  Button: ['Button__btn___UJGZ1b7'],
  ButtonPrimary: ['Button__primary____lObPiw'],
  ButtonSuccess: ['Button__success___bCiIVXw'],
  ButtonEnabled: ['Button__primary____lObPiw'],
  ButtonDanger: ['Button__danger___S2rSOES'],
  ButtonNeutral: ['Button__neutral___OAFOaNs'],
  SmallButton: [
    'Button__darkInline___z_YKa91',
    'Button__dark___vdJbcc8',
    'Button__btn___UJGZ1b7',
    'Button__inline___Ffw9bbn',
  ],

  // Context bar styles
  ContextBar: ['ContextControls__container___dzDODeW'],
  ContextButton: ['ContextControls__item____QDkFMH', 'fonts__font-regular___Sxp1xjo', 'type__type-small___pMQhMQO'],
  ContextCommand: ['ContextControls__cmd___BXQDTL_'],
  ContextLabel: ['ContextControls__label___xomE3De'],

  // Misc styles
  SidebarSectionHead: ['Sidebar__sectionHead____NHLKDT', 'fonts__font-regular___Sxp1xjo'],
  SidebarSectionContent: ['Sidebar__sectionContent___wgGYFop', 'fonts__font-regular___Sxp1xjo'],
  SidebarLine: ['Sidebar__contract___J0gmlzN', 'Sidebar__sidebar-line___bE2rbRb'],
  FontsRegular: ['fonts__font-regular___Sxp1xjo'],
  SidebarText: ['Frame__toggleLabel___BTFce8H', 'fonts__font-regular___Sxp1xjo', 'type__type-regular___k8nHUfI'],
  SidebarSliver: ['Frame__toggleIndicatorSecondary___frX4CGi', 'Frame__toggleIndicator___ZKQQgAL'],
  SidebarButton: ['Frame__toggle___V3iHpB7'],
  DraftName: [
    'Draft__name___gADQF2n',
    'Draft__heading___GbdKCJx',
    'fonts__font-headers___eDKxf8h',
    'type__type-very-large____Hxqf3q',
  ],

  // More misc styles
  RadioButton: ['RadioItem__container___CSczqmG'],
  SettingsButton: ['RadioItem__container___CSczqmG', 'RadioItem__containerHorizontal____trlXDo'],
  RadioButtonUnToggled: ['RadioItem__indicator___QzQtjhA'],
  SettingsBarUntoggled: ['RadioItem__indicator___QzQtjhA', 'RadioItem__indicatorHorizontal___SwtwTIh'],
  RadioButtonToggled: [
    'RadioItem__indicator___QzQtjhA',
    'RadioItem__active___CDscOQV',
    'effects__shadowPrimary___EbXJQor',
  ],
  SettingsBarToggled: [
    'RadioItem__indicator___QzQtjhA',
    'RadioItem__indicatorHorizontal___SwtwTIh',
    'RadioItem__active___CDscOQV',
    'effects__shadowPrimary___EbXJQor',
  ],
  RadioButtonValue: ['RadioItem__value___Yd1Gt1T', 'fonts__font-regular___Sxp1xjo', 'type__type-small___pMQhMQO'],
  SettingsText: [
    'RadioItem__value___Yd1Gt1T',
    'fonts__font-regular___Sxp1xjo',
    'type__type-small___pMQhMQO',
    'RadioItem__valueHorizontal___D5AXJ9P',
  ],
  ScreenUnderlineUntoggled: ['HeadItem__indicatorPrimary___rx46qOB', 'HeadItem__indicator___A_wijoE'],
  ScreenUnderlineToggled: [
    'HeadItem__indicatorPrimary___rx46qOB',
    'HeadItem__indicator___A_wijoE',
    'HeadItem__indicatorPrimaryActive___m718hwk',
    'effects__shadowPrimary___EbXJQor',
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
  FormRow: ['FormComponent__containerActive___HZv9jHd', 'forms__active___wn9KQTZ', 'forms__form-component___yTgP_Qa'],
  HeaderRow: [
    'FormComponent__containerPassive___FrBdyGU',
    'forms__passive___biRUiE5',
    'forms__form-component___yTgP_Qa',
  ],
  FormLabel: ['FormComponent__label___aQB15eB', 'fonts__font-regular___Sxp1xjo', 'type__type-regular___k8nHUfI'],
  FormInput: ['FormComponent__input___ZnI8mYi', 'forms__input___A92_N4J'],
  FormSaveRow: ['FormComponent__containerCommand___B4XLERf', 'forms__cmd___IMzt7Ug', 'forms__form-component___yTgP_Qa'],
  FormSaveLabel: ['FormComponent__label___aQB15eB', 'fonts__font-regular___Sxp1xjo', 'type__type-regular___k8nHUfI'],
  FormSaveInput: ['FormComponent__input___ZnI8mYi', 'forms__input___A92_N4J'],
  FormInputDiv: ['DynamicInput__dynamic___Cd4Gkbz', 'forms__dynamic___FHDMFtf'],
  FormError: ['FormComponent__containerError___pN__L1Q', 'forms__error___nWVhbAS'],
  FormPassiveLabel: ['StaticInput__static___Vpn1u0n', 'forms__static___a4biDi4'],

  // Styles coloring confirmation overlays
  ActionOverlay: ['ActionConfirmationOverlay__container___A05Ts1g', 'ActionFeedback__overlay___NNDPRrV'],
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
  ActionMessage: ['ActionFeedback__message___G2Sz4bw', 'fonts__font-regular___Sxp1xjo', 'type__type-larger___VdpJIb1'],
  ActionDismiss: ['ActionFeedback__dismiss___x5Ln7y1', 'type__type-small___pMQhMQO'],

  // Styles coloring material icons
  MatText: ['ColoredIcon__label___OU1I4oP'],
  MatTextWrapper: ['ColoredIcon__labelContainer___YVfgzOk'],
  MaterialElement: ['ColoredIcon__container___djaR4r2'],
  MaterialWrapper: ['MaterialIcon__container___q8gKIx8'],
  MaterialNumberWrapper: ['MaterialIcon__indicatorContainer___Cqtax_Y'],
  MaterialNumber: [
    'MaterialIcon__indicator___SHwlndJ',
    'MaterialIcon__type-very-small___UMzQ3ir',
    'MaterialIcon__neutral___SYsHXAa',
  ],
  MaterialWrapperWrapper: ['GridItemView__image___yMoKOZV'],
  MaterialOuter: ['GridItemView__container___xP2uJz8'],
  MaterialNameText: ['GridItemView__name___h3yX9Lm', 'fonts__font-regular___Sxp1xjo', 'type__type-regular___k8nHUfI'],

  // CXOB Styles
  CXOBAmount: ['ComExOrderBookPanel__amount___EoNHTID'],
  CXOBOffer: ['ComExOrderBookPanel__offerPrice___kisxczh', 'ComExOrderBookPanel__amount___EoNHTID'],
  CXOBSpread: ['ComExOrderBookPanel__spread___GIYNNWd'],
  CXOBEmpty: ['ComExOrderBookPanel__empty___yl28RaU'],
  CXOBRequest: ['ComExOrderBookPanel__requestPrice___ZTEgYCz', 'ComExOrderBookPanel__amount___EoNHTID'],
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

/*export const DefaultColors = [
	"#591e00",
	"#7b3d00",
	"#b46d00",
	"#f7a600",
	"#ffcf40",
	"#fbe4af"
]*/
export const DefaultColors = ['#004564', '#005b76', '#007079', '#00846c', '#009552', '#67a22e', '#ada900', '#f7a600'];

// The default category colors used in PrUN
export const CategoryColors = {
  'electronic devices': ['linear-gradient(135deg, rgb(86, 20, 147), rgb(111, 45, 172))', 'rgb(213, 147, 255)'],
  'construction prefabs': ['linear-gradient(135deg, rgb(15, 30, 98), rgb(40, 55, 123))', 'rgb(142, 157, 225)'],
  'electronic systems': ['linear-gradient(135deg, rgb(51, 26, 76), rgb(76, 51, 101))', 'rgb(178, 153, 203)'],
  'medical equipment': ['linear-gradient(135deg, rgb(85, 170, 85), rgb(110, 195, 110))', 'rgb(212, 255, 212)'],
  'construction parts': ['linear-gradient(135deg, rgb(41, 77, 107), rgb(66, 102, 132))', 'rgb(168, 204, 234)'],
  'ship engines': ['linear-gradient(135deg, rgb(153, 41, 0), rgb(178, 66, 25))', 'rgb(255, 168, 127)'],
  'ship parts': ['linear-gradient(135deg, rgb(153, 99, 0), rgb(178, 124, 25))', 'rgb(255, 226, 127)'],
  metals: ['linear-gradient(135deg, rgb(54, 54, 54), rgb(79, 79, 79))', 'rgb(181, 181, 181)'],
  'consumables (luxury)': ['linear-gradient(135deg, rgb(136, 24, 39), rgb(161, 49, 64))', 'rgb(255, 151, 166)'],
  'agricultural products': ['linear-gradient(135deg, rgb(92, 18, 18), rgb(117, 43, 43))', 'rgb(219, 145, 145)'],
  ores: ['linear-gradient(135deg, rgb(82, 87, 97), rgb(107, 112, 122))', 'rgb(209, 214, 224)'],
  gases: ['linear-gradient(135deg, rgb(0, 105, 107), rgb(25, 130, 132))', 'rgb(127, 232, 234)'],
  'ship shields': ['linear-gradient(135deg, rgb(224, 131, 0), rgb(249, 156, 25))', 'rgb(230 230,127)'],
  alloys: ['linear-gradient(135deg, rgb(123, 76, 30), rgb(148, 101, 55))', 'rgb(250, 203, 157)'],
  chemicals: ['linear-gradient(135deg, rgb(183, 46, 91), rgb(208, 71, 116))', 'rgb(255, 173, 218)'],
  'software components': ['linear-gradient(135deg, rgb(136, 121, 47), rgb(161, 146, 72))', 'rgb(255, 248, 174)'],
  'electronic pieces': ['linear-gradient(135deg, rgb(119, 82, 189), rgb(144, 107, 214))', 'rgb(246, 209, 255)'],
  elements: ['linear-gradient(135deg, rgb(61, 46, 32), rgb(86, 71, 57))', 'rgb(188, 173, 159)'],
  minerals: ['linear-gradient(135deg, rgb(153, 113, 73), rgb(178, 138, 98))', 'rgb(255, 240, 200)'],
  'unit prefabs': ['linear-gradient(135deg, rgb(29, 27, 28), rgb(54, 52, 53))', 'rgb(156, 154, 155)'],
  liquids: ['linear-gradient(135deg, rgb(114, 164, 202), rgb(139, 189, 227))', 'rgb(241, 255, 255)'],
  'energy systems': ['linear-gradient(135deg, rgb(21, 62, 39), rgb(46, 87, 64))', 'rgb(148, 189, 166)'],
  drones: ['linear-gradient(135deg, rgb(140, 52, 18), rgb(165, 77, 43))', 'rgb(255, 179, 145)'],
  'electronic parts': ['linear-gradient(135deg, rgb(91, 46, 183), rgb(116, 71, 208))', 'rgb(218, 173, 255)'],
  textiles: ['linear-gradient(135deg, rgb(82, 90, 33), rgb(107, 115, 58))', 'rgb(209, 217, 160)'],
  'construction materials': ['linear-gradient(135deg, rgb(24, 91, 211), rgb(49, 116, 236))', 'rgb(151, 218, 255)'],
  'software tools': ['linear-gradient(135deg, rgb(129, 98, 19), rgb(154, 123, 44))', 'rgb(255, 255, 146)'],
  plastics: ['linear-gradient(135deg, rgb(121, 31, 60), rgb(146, 56, 85))', 'rgb(248, 158, 187)'],
  'consumables (basic)': ['linear-gradient(135deg, rgb(149, 46, 46), rgb(174, 71, 71))', 'rgb(255, 173, 173)'],
  fuels: ['linear-gradient(135deg, rgb(30, 123, 30), rgb(55, 148, 55))', 'rgb(157, 250, 157)'],
  'software systems': ['linear-gradient(135deg, rgb(60, 53, 5), rgb(85, 78, 30))', 'rgb(187, 180, 132)'],
  'ship kits': ['linear-gradient(135deg, rgb(154, 84, 0), rgb(178, 109, 25))', 'rgb(255, 211, 127)'],
  utility: ['linear-gradient(135deg, rgb(161, 148, 136), rgb(186, 173, 161))', 'rgb(255, 255, 255)'],
  shipment: ['linear-gradient(135deg, #030303, #181818)', '#7f7f7f'],
};

export enum RPrunStylesheet {
  refinedPrun = 'refined-prun',
  advanced = 'pmmg-advanced',
  enhancedColors = 'pmmg-enhanced-colors',
  icons = 'pmmg-icons',
  oldColors = 'pmmg-old-colors',
}

export function appendStyle(stylesheet: RPrunStylesheet) {
  if (document.getElementById(stylesheet) !== null) {
    return;
  }
  const link = document.createElement('link');
  link.href = system.runtime.getURL(`${stylesheet}.css`);
  link.id = stylesheet;
  link.rel = 'stylesheet';
  document.documentElement.appendChild(link);
}
