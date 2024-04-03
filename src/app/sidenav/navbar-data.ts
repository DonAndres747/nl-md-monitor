export const navbarData = [
  {
    id: 'home',
    selected: false,
    icon: 'home',
    iconType: true,
    tabs: [],
  },
  {
    id: 'wms',
    selected: false,
    icon: 'W',
    iconType: false,
    tabs: [
      { label: 'WMS', route: 'wms' },
      { label: 'Config', route: 'wmsConf' },
    ],
  },
  {
    id: 'tep',
    selected: false,
    icon: 'T',
    iconType: false,
    tabs: [
      { label: 'Tep', route: 'tep' },
      { label: 'Config', route: 'tepConf' },
    ],
  },
  {
    id: 'sap',
    selected: false,
    icon: 'S',
    iconType: false,
    tabs: [
      { label: 'Sap', route: 'sap' },
      { label: 'Config', route: 'sapConf' },
    ],
  },
];
