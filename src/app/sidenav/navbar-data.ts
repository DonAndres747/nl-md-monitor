export const navbarData = [
  {
    id: 'Home',
    selected: false,
    icon: 'home',
    iconType: true,
    tabs: [],
  },
  {
    id: 'WMS',
    selected: false,
    icon: 'W ',
    iconType: false,
    tabs: [
      { label: 'WMS Historic', route: 'wms' },
      { label: 'Config', route: 'wmsConf' },
    ],
  },
  {
    id: 'TEP',
    selected: false,
    icon: 'T',
    iconType: false,
    tabs: [
      { label: 'TEP Historic', route: 'tep' },
      { label: 'Config', route: 'tepConf' },
    ],
  },
  {
    id: 'SAP',
    selected: false,
    icon: 'S',
    iconType: false,
    tabs: [
      { label: 'SAP Historic', route: 'sap' },
      { label: 'Config', route: 'sapConf' },
    ],
  },
];
