// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  server: 'https://be-playlist-manager-youtube.herokuapp.com/',
  YOUTUBE_URL: 'https://www.googleapis.com/youtube/v3/',
  YOUTUBE_API_TOKEN: 'AIzaSyBLptPwNpXHVUcPn7WFmeBrSHY_bUyil0E',
  ADMIN_ROLE: "eb011b5c-7142-4937-925c-9e36e21254ab",
  ADVERTISER_ROLE: "ac111b5c-7142-4937-925c-9e36e21254ab",
  USER_ROLE: "71295194-4a31-4e30-b843-ca152a1bae83"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
