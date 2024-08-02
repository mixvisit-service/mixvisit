/**
 * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js Taken from here
 */
export function areCookiesEnabled(): boolean {
  try {
    // Create cookie
    document.cookie = 'cookietest=1; SameSite=Strict;';
    const result = document.cookie.indexOf('cookietest=') !== -1;

    // Delete cookie
    document.cookie = 'cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT';

    return result;
  } catch (err) {
    return false;
  }
}
