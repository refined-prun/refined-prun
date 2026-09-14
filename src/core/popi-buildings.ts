export interface PopiBuilding {
  ticker: string;
  type: string;
  projectName: string;
}

export const popiBuildings: PopiBuilding[] = [
  { ticker: 'SST', type: 'SAFETY_STATION', projectName: 'planetaryProjectSafetySmall' },
  { ticker: 'SDP', type: 'SECURITY_DRONE_POST', projectName: 'planetaryProjectSafetyBig' },
  { ticker: 'EMC', type: 'EMERGENCY_CENTER', projectName: 'planetaryProjectSafetyHealth' },
  { ticker: 'INF', type: 'INFIRMARY', projectName: 'planetaryProjectHealthSmall' },
  { ticker: 'HOS', type: 'HOSPITAL', projectName: 'planetaryProjectHealthBig' },
  { ticker: 'WCE', type: 'WELLNESS_CENTER', projectName: 'planetaryProjectHealthComfort' },
  { ticker: 'PAR', type: 'WILDLIFE_PARK', projectName: 'planetaryProjectComfortSmall' },
  { ticker: '4DA', type: 'ARCADES', projectName: 'planetaryProjectComfortBig' },
  { ticker: 'ACA', type: 'ART_CAFE', projectName: 'planetaryProjectComfortCulture' },
  { ticker: 'ART', type: 'ART_GALLERY', projectName: 'planetaryProjectCultureSmall' },
  { ticker: 'VRT', type: 'THEATER', projectName: 'planetaryProjectCultureBig' },
  {
    ticker: 'PBH',
    type: 'PLANETARY_BROADCASTING_HUB',
    projectName: 'planetaryProjectCultureEducation',
  },
  { ticker: 'LIB', type: 'LIBRARY', projectName: 'planetaryProjectEducationSmall' },
  { ticker: 'UNI', type: 'UNIVERSITY', projectName: 'planetaryProjectEducationBig' },
];
