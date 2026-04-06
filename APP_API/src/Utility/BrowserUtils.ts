export const checkIfElementExists = async (selector: string, browser: any) => {
  const check = await browser.page.$(selector);
  return check === null ? false : true;
};

export const LAUNCH_OPTIONS = (options: any, proxyURL: any | null) => {
  const defaultOptions = {
    headless: process.env.ENABLE_HEADLESS === "YES" ? true : false,
    devtools:
      process.env.ENABLE_DEV_TOOLS === "YES" &&
      process.env.ENABLE_HEADLESS === "NO"
        ? true
        : false,
    ignoreHTTPSErrors: true,

    args: [
      process.env.ENABLE_PROXY === "YES" && proxyURL !== null
        ? `--proxy-server=http://${proxyURL.url}:${proxyURL.port}`
        : ``,
      "--autoplay-policy=user-gesture-required",
      // '--start-maximized',
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-speech-api",
      "--disable-print-preview",
      "--no-pings",
      "--no-zygote",
      "--no-pings",
      "--mute-audio",
      // '--enable-features=NetworkService',
      "--disable-web-security",
      "--incognito",
      "--disable-print-preview",
      "--disable-setuid-sandbox",
      "--disable-site-isolation-trials",
      "--disable-speech-api",
      "--disable-print-preview",
      "--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process",
      "--allow-running-insecure-content",
    ],
  };
  return { ...defaultOptions, ...options };
};

export async function takeScreenShot(browser: any, selector, filePath) {
  const content = await browser.page.$(selector);

  await content.screenshot({
    padding: [0, 0, 0, 0],

    fullpage: true,
    path: filePath,
  });
}
export async function takeScreenShotOfDomElement(browser: any, options: any) {
  return await browser.page.screenshotDOMElement(options);
}

export async function makeXHRRequest(
  url: string,
  options: any,
  userAgent: string,
  cookies: any
) {
  if (options.headers == null) {
    options.headers = {};
  }
  options.headers["host"] = "datawarehouse.dbd.go.th";
  options.headers["accept-encoding"] = "gzip, deflate, br";
  options.headers["accept-language"] = "zh-CN,zh;q=0.9";
  options.headers["cache-control"] = "no-cache";
  options.headers["pragma"] = "no-cache";
  options.headers["upgrade-insecure-requests"] = "1";
  options.headers["user-agent"] = userAgent;
  options.headers["cookie"] = cookies;
  const response = await fetch(url, options);
  if (response.status === 403) {
    console.log("responseText", await response.text());
    throw "The request is forbidden";
  }
  if (response.status === 400) {
    console.log("Bad Request");
    throw "Bad Request";
  }

  const result = {
    status: response.status,
    statusCode: response.statusText,
    type: response.type,
    text: await response.text(),
  };
  return result;
}
