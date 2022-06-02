// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  root: 'http://localhost:3002',
  apiUrl: 'http://localhost:3002/api',
  coreUrl: 'https://trivia2.neurone.info:3001/v1',
  coreRoot: 'https://trivia2.neurone.info:3001',
  gmTimeout: 2000,
  coreUploadTimeout: 120000,
  coreFetchTimeout: 10000,
  avatarsPath: '/assets/images/avatars/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
