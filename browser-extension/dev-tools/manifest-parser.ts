type Manifest = chrome.runtime.ManifestV3;

export function convertManifestToString(manifest: Manifest, env: 'chrome' | 'firefox') {
  if (env === 'firefox') {
    manifest = convertToFirefoxCompatibleManifest(manifest);
  }
  return JSON.stringify(manifest, null, 2);
}

function convertToFirefoxCompatibleManifest(manifest: Manifest) {
  const manifestCopy = {
    ...manifest,
  } as { [key: string]: unknown };

  manifestCopy.manifest_version = 2;
  manifestCopy.background = {
    scripts: [manifest.background?.service_worker],
    type: 'module',
  };
  manifestCopy.web_accessible_resources = manifest.web_accessible_resources![0].resources;
  const permissions = manifest.host_permissions!.concat(manifest.permissions!);
  delete manifestCopy.host_permissions;
  manifestCopy.permissions = permissions;
  manifestCopy.browser_action = manifest.action;
  delete manifestCopy.action;
  return manifestCopy as Manifest;
}
