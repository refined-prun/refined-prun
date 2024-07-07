export default function getBrowserVersion() {
  const userAgent = navigator.userAgent;
  let browserName: string;
  let fullVersion: string;

  // Detect browser name and version
  if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    fullVersion = userAgent.substring(userAgent.indexOf('Firefox') + 8);
  } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    browserName = 'Opera';
    fullVersion = userAgent.substring(userAgent.indexOf('Opera') + 6);
    if (userAgent.indexOf('OPR') > -1) {
      fullVersion = userAgent.substring(userAgent.indexOf('OPR') + 4);
    }
  } else if (userAgent.indexOf('Trident') > -1) {
    // For Internet Explorer
    browserName = 'Microsoft Internet Explorer';
    fullVersion = userAgent.substring(userAgent.indexOf('rv:') + 3);
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Microsoft Edge';
    fullVersion = userAgent.substring(userAgent.indexOf('Edge') + 5);
  } else if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
    fullVersion = userAgent.substring(userAgent.indexOf('Chrome') + 7);
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Safari';
    fullVersion = userAgent.substring(userAgent.indexOf('Safari') + 7);
    if (userAgent.indexOf('Version') > -1) {
      fullVersion = userAgent.substring(userAgent.indexOf('Version') + 8);
    }
  } else {
    browserName = 'Unknown';
    fullVersion = 'Unknown';
  }

  // Trim the version string
  if (fullVersion.indexOf(' ') > -1) {
    fullVersion = fullVersion.substring(0, fullVersion.indexOf(' '));
  }
  if (fullVersion.indexOf(';') > -1) {
    fullVersion = fullVersion.substring(0, fullVersion.indexOf(';'));
  }
  if (fullVersion.indexOf(')') > -1) {
    fullVersion = fullVersion.substring(0, fullVersion.indexOf(')'));
  }

  return `${browserName} ${fullVersion}`;
}
