import { find, findIndex, isEmpty, mapKeys, some, trim, values } from "lodash";
import Cookies from 'universal-cookie';
import {jwtDecode} from 'jwt-decode';
import moment from "moment";
import {  ENVIRONMENT_PROD, COOKIE_DOMAIN } from "@/utils/constants"
import { useHttp } from "@/hooks/useHttp";

const cookies = new Cookies(null,{ path: '/' , domain: COOKIE_DOMAIN});

 // eslint-disable-next-line no-useless-escape
 export const emailRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 // eslint-disable-next-line no-useless-escape
 export const urlRegx =   /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

 export const copyToClipBoard = (text: string) => {
  // Copy the text inside the text field
  navigator.clipboard.writeText(text);

};
export function isJsonString(str:string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const convertToLatest30MinIntervals = (date:any) => {
  const selectedDate = new Date(date);
  const minutes = selectedDate.getMinutes();

  let roundedMinutes;
  if (minutes < 15) {
    roundedMinutes = 0;
  } else if (minutes < 45) {
    roundedMinutes = 30;
  } else {
    roundedMinutes = 0;
    selectedDate.setHours(selectedDate.getHours() + 1);
  }

  selectedDate.setMinutes(roundedMinutes);
  return selectedDate
}

export const checkApprovalProcessCompleted = async (
  approvalProcessId: number,
) => {
  const db = new useHttp();

  try {
    const response: any = await db.get(
      `/approval-process/${approvalProcessId}/is-completed`,
    );
    return response?.data?.status;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const checkIntegrationTypeExists = async (integrationType: string) => {
  const db = new useHttp();

  try {
    const response: any = await db.get(`/integration/check/${integrationType}`);
    if (response?.data?.length) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const updateTaskStatusToCompleted = (
  taskId: number,
) => {
  
  const db = new useHttp()

  return db.put(`/task/${taskId}`, {
    task_status: 4,
  })
  .then((response) => {})
  .catch((e) => {
    console.log(e);
    return false;
  });
};

export const checkApprovalProcessCurrentLevel = async (
  approvalProcessId: number,
) => {
  const db = new useHttp();

  try {
    const response: any = await db.get(
      `/approval-process/${approvalProcessId}/current-level`,
    );
    return response?.data?.currentLevel;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const checkApprovalProcessNoOfLevels = async (
  approvalProcessId: number,
) => {
  const db = new useHttp();

  try {
    const response: any = await db.get(`/approval-process/${approvalProcessId}/no-of-levels`);
    return response?.data?.levelsCount;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const checkAvailableApprovalProcesses = async (
  module: string,
  hrDepartmentJobRoleId:number = 0
) => {

  const db = new useHttp();

  try {
    const response: any = await db.get(`/approval-process/check/module/process/exists?module=${module}&hrDepartmentJobRoleId=${hrDepartmentJobRoleId}`);
    return response?.data?.result;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const subscribedProductPrefixes = (menus: any, accessDetails: any) => {
  if (accessDetails?.subscribedProductPrefixes.length) {
    return menus.filter((menu: any) => {
      const identifier = menu.module_identifier.split('.');
      return accessDetails?.subscribedProductPrefixes.includes(identifier[0]);
    });
  } else {
    return [];
  }
};






export function getTimeAgo (timestamp:string)  {
  const momentTimestamp = moment(timestamp);
  return momentTimestamp.fromNow();
}

export const uniqueNumber = ():number=>Math.round(Date.now() + Math.random());
type DataType = { localKey?:string,value?:string } | any;

export const saveCookieData = (data:DataType)=>{
  const {localKey,value}= data;
  const secure = ENVIRONMENT_PROD;
  const sameSite = ENVIRONMENT_PROD ? 'none' : 'lax';
  
  if(localKey === 'tenant')
  {
    cookies.set(localKey, value, { 
      path: '/', 
      secure:secure, 
      sameSite:sameSite,
      domain:COOKIE_DOMAIN
    });
    return
  }
  if(localKey === "refreshToken" || localKey === "accessToken" )
  {
    const {exp} = jwtDecode<any>(value);
    if(localKey === "accessToken")
    {
      cookies.set(localKey, value, { path: '/', secure:secure,sameSite:sameSite,domain:COOKIE_DOMAIN});
    }
      
    else
    {
      cookies.set(localKey, value, { path: '/', secure:secure, expires:new Date(exp*1000),sameSite:sameSite,domain:COOKIE_DOMAIN});
    }
      
  }else{
    cookies.set(localKey,value);
  }
}
export const getCookieData = (data:DataType)=>{
  const {localKey} = data;
  return cookies.get(localKey);
}
export const deleteLocalData = async (data:DataType)=>{

  try
  {
    const {localKey}= data;
    console.log('Local Key',localKey)
    console.log('localKey',cookies.get(localKey))
    cookies.remove(localKey,{path:'/'});
    cookies.update();
    localStorage.removeItem(localKey);
  }
  catch(e)
  {
      console.log('delete cookie error',e)
  }
  
  
}
/* export const setCookie = (value:string) => {
  let d = new Date();
  d.setTime(d.getTime() + (minutes*60*1000));

  Cookies.set(value, true, {path: "/", expires: d});
}; */
export const isLoggedIn = (userDetail:any)=>{
  return !isEmpty(getAccessToken(userDetail)) ? true : !!getCookieData({localKey:"refreshToken"})
}
export const getAccessToken = (userDetail:any)=>{
  return !isEmpty(userDetail.accessToken) ? userDetail.accessToken : getCookieData({localKey:"refreshToken"})
}
export const getLocalData = (data:DataType ) : string=>{
  const {localKey}= data;
  return localStorage.getItem(localKey) ?? '';
}
export const setLocalData = (data:DataType ):void =>{
  const {localKey,value}= data;
  localStorage.setItem(localKey,value);
}
export const getFormData = (e:any )=>{
  try{ 
  const formData:any = new FormData(e);
  const res:any = {};
    for (const pair of formData.entries()) {
      res[pair[0]]= pair[1];
    }
  return res;
  }
  catch(e){
    return [];
  }
}
export const generatePassword = ()=>{
    const length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
       let pwd = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        pwd += charset.charAt(Math.floor(Math.random() * n));
    }
    return pwd;
}
export const generateThumbnail = (video:any,videoTime:string)=>{ 
  const canvas:any =  document.createElement("canvas");
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, 350, 150);
  const dataURL = canvas.toDataURL();
  // let div = document.createElement('div');
  // div.setAttribute("class","col-3");
  // let img = document.createElement('img');
  // let span = document.createElement('span');
  // const data = document.createTextNode(`video seconds : ${videoTime}`);
  // span.appendChild(data);
  // span.setAttribute("style","color:#000")
  // img.setAttribute('src', dataURL);
  // div.appendChild(img);
  // div.appendChild(span);
  return {dataURL};
}
export const getComments = (projectInfo:any,indexDetails:any)=>{
  try {
    const isUndefined = some(values(indexDetails), (value)=>value === undefined);
    
    // console.info(indexDetails,isUndefined,projectInfo)
    const [,,,project_id,,project_product_version_sequence_id] =  window.location.pathname.split("/")
    if(projectInfo !== undefined && isUndefined){
    const filterData:any = (key:string,value:string|number,item:any)=>(item[key] === value)
    const res:any = find(projectInfo.project_products,filterData.bind(this,"project_id",project_id));
    // !TODO need to change from project_id
    const result:any = find(res.project_products_versions,filterData.bind(this,"project_id",project_id));
    const comments:any = find(result.project_product_version_sequences,filterData.bind(this,"project_product_version_sequence_id",project_product_version_sequence_id));
    return comments?.project_product_version_sequence_comments ?? [];
    }
    else{
      let {project_product_version_sequence_comments :  comments = []} =  projectInfo.project_products[indexDetails.productIndex].project_products_versions[indexDetails.versionIndex].project_product_version_sequences[indexDetails.sequenceIndex];
      comments = comments.map((items:any)=>({...items, time_code : JSON.parse(items.time_code) }));
      return !comments ? [] : comments;
    }
  } catch (error:any) {
    return []
  }
}
export const showToolTip = (data:any)=>{
  return trim(`<div class='cmt'>
								<span>Time : ${data?.time_code?.toTime}</span>
								<span>SMTPE Time : ${data?.time_code?.currentTime}</span>
								<br/>
								<img src='${data?.comment_image_data}'  alt='${data?.comment}' />
								<br/>
								<span>Comment : ${data?.comment}</span>
							</div>`.replace(/\s+/g, ' '));
}
export const isVersion = (data:any)=>{
  try {
    const {version,...res}=data;
    return version ? res : false;
  } catch (error) {
    return false;
  }
  
}
export const isOverview = (data:any)=>{
  try {
  const {overview,...res}=data;
  return overview ? res : false;
  } catch (error) {
    return false;
  }
}


export const changeKeys=(list:Array<any>,findKeys:Array<string>,replaceKeys:Array<string>)=>{
    const newThing:any = list.map( item => {
        return  mapKeys( item, ( value, key ) => {
                let newKey:any = key;
                const getIndex = findIndex(findKeys,(findKey)=>findKey === key);
                if(getIndex!== -1 && replaceKeys[getIndex] !== undefined){
                  newKey = replaceKeys[getIndex];
                }
                return newKey;
            })
    });
    return newThing;
}
