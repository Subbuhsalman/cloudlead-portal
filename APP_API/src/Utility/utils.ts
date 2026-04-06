



export async function sleep(tm) {
    return new Promise(resolve => setTimeout(resolve, tm));
  }
  export function isJsonString(str:string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  
  export function formatErr(err) {
    if (err == null) return 'null';
    if (typeof err == 'string') return err;
    if (err.message != undefined && err.stack != undefined) {
      return err.message + '\n' + err.stack;
    }
  
    try {
      return JSON.stringify(err);
    }
    catch (err) {
    }
  
    return err;
  }
  
  export function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
  
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;
  
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
  
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
  
    return uuid.join('');
  }
  

  export function generateFourDigitCode(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
export const generateFiveDigitCode = (): number =>
  Math.floor(10000 + Math.random() * 90000);
  export function randomStr(len, arr) {
    
    let ans = '';
    for (let i = len; i > 0; i--) {
        ans +=
            arr[(Math.floor(Math.random() * arr.length))];
    }
    return ans
}

export function randomNumber(min:number,max:number)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



export const oauthSessionStore = new Map<string, {
  codeVerifier: string;
  state: string;
  userId?: string;
  timestamp: number;
}>();




