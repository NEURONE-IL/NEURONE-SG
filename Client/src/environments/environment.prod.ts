export const environment = {
  production: true,
  root: window["env"]["rootUrl"] || 'http://143.198.136.174:3002',
  apiUrl: window["env"]["rootUrl"] + '/api' || 'http://143.198.136.174:3002/api',
  coreUrl: window["env"]["coreRoot"] + '/v1' || 'http://143.198.136.174:3000/v1',
  coreRoot: window["env"]["coreRoot"] || 'http://143.198.136.174:3000',
  gmTimeout: 2000,
  coreUploadTimeout: 120000,
  coreFetchTimeout: 10000,
  avatarsPath: '/assets/images/avatars/'
};
