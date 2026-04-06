// import path from "path";

// export const DATA_DIR = path.join(__dirname, '../../data');

// export const HTML_DIR = path.join(DATA_DIR, 'html')
// export const CACHE_DIR = path.join(DATA_DIR, 'cache')
// export const CACHE_URLS_FILE = path.join(CACHE_DIR, '/cachedUrls.json')
// export const PROFILE_DIR = path.join(HTML_DIR, 'profile')
// export const LOGS_DIR = path.join(DATA_DIR, 'logs');
// export const DOWNLOAD_DIR = path.join(DATA_DIR, "download");

// export const IMGCODES_DIR = path.join(DATA_DIR, "imgcodes");


// export const SNAPSHOT_DIR = path.join(DATA_DIR, "snapshot");

// export const DEFAULT_USER_AGENT =
//   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

//   export const USER_AGENTS = [
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
//         'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
//         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
//         'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
//         'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
//         'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
//         'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'

//   ]
//   export const HOST_SITE_TO_SCRAPE = process.env.HOST_URL_TO_SCRAPE;


// export const PROXIES = JSON.parse(process.env.PROXY_LIST ? JSON.stringify(process.env?.PROXY_LIST) : '')
const FRONT_END_URL = process.env.FRONT_END_URL;

export const STRIPE_ONBOARDING_REFRESH_URL = FRONT_END_URL + '/onboarding/refresh';
export const STRIPE_ONBOARDING_COMPLETE_URL = FRONT_END_URL + '/onboarding/complete';

export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const APP_URL    = process.env.APP_URL || 'http://localhost:3600';
export const DEFAULT_CURRENCY='cad'

const   FACEBOOK_APP_ID=process.env.FACEBOOK_APP_ID
const   FACEBOOK_APP_SECRET=process.env.FACEBOOK_APP_SECRET
const   FACEBOOK_REDIRECT_URI=process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/auth/facebook/callback'

export const FACEBOOK_CONFIG = {
  appId: FACEBOOK_APP_ID,
  appSecret: FACEBOOK_APP_SECRET,
  redirectUri: FACEBOOK_REDIRECT_URI,
  apiVersion: 'v23.0'  // <-- Here

};
export { FRONT_END_URL }