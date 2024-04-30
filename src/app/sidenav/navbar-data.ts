export const navbarData = [
  {
    id: '',
    selected: false,
    icon: 'home',
    iconType: true,
    tabs: [],
    available: 'true',
  },
  {
    id: 'WMS',
    selected: false,
    icon: 'W ',
    iconType: false,
    tabs: [
      { label: 'WMS Historic', route: 'wms' },
      { label: 'Config', route: 'config/wms' },
    ],
    available: '',
  },
  {
    id: 'TEP',
    selected: false,
    icon: 'T',
    iconType: false,
    tabs: [
      { label: 'TEP Historic', route: 'tep' },
      { label: 'Config', route: 'config/tep' },
    ],
    available: '',
  },
  {
    id: 'SAP',
    selected: false,
    icon: 'S',
    iconType: false,
    tabs: [
      { label: 'SAP Historic', route: 'sap' },
      { label: 'Config', route: 'config/sap' },
    ],
    available: '',
  },
];
