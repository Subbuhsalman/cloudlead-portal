import axios from 'axios';
import { includes } from "lodash";
import { deleteLocalData, getCookieData, saveCookieData } from "@/utils";
import {jwtDecode} from "jwt-decode"
// import { excludeEndPoints } from '../Routes/excludeEndPoints';
// import store from "src/store/index"
// import { GLOBAL_TOAST } from '../store/actionTypes';
import { BASE_URL } from "@/utils/constants"
class useHttp {
    private token: any;
    private accessToken: any;
    private refreshToken: any;
    private withCredentials: any;
    public api;

    constructor(withCredentials = true) {
        this.withCredentials = withCredentials;
        console.log("withCredentials", withCredentials);

        this.getAccessToken();
        this.api = this.createInstance(withCredentials);
        this.checkStatus();
        return this;

    }

    checkStatus() {
   
       
      
        // Add a request interceptor
        const Authorization = this.token;
        const refreshToken = this.refreshToken;

        if(this.withCredentials)
        {
            this.api.interceptors.request.use(function (config: any) {
                config.headers.Authorization = Authorization;
                config.headers['refresh-token'] = refreshToken;
    
                // Do something before request is sent
                return config;
            }, function (error) {
                // Do something with request error
    
                return Promise.reject(error);
            });
        }
        else
        {
            this.api.interceptors.request.use(function (config: any) {
             
    
                // Do something before request is sent
                return config;
            }, function (error) {
                // Do something with request error
    
                return Promise.reject(error);
            });
        }
       


        // Add a response interceptor
        this.api.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data

          
            return response;
        }, async (error: any) => {
            console.log('error',error);
            try {
                
                if (error.response?.data?.refreshToken === "NOT_VALID") {
                    this.goToLoginPage();
                }
                // accessToken if token valid or not
                else if (error.response?.data?.accessToken === "NOT_VALID") {
                    const url: string = BASE_URL + "/refresh-token";
                    await axios.post(url, {}, { headers: { 'refresh-token': getCookieData({ localKey: "refreshToken" }),'X-Tenant': getCookieData({ localKey: "tenant" })} })
                        .then((response) => {
                            if (response.data?.accessToken) {
                                saveCookieData({ localKey: 'accessToken', value: response.data.accessToken })
                                saveCookieData({ localKey: 'refreshToken', value: response.data.refreshToken })
                                error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                                this.getAccessToken();
                                this.setRefreshToken(response.data.refreshToken);
                            }
                        });
                    const oldRequest = error.config;
                    oldRequest._retry = true;
                    
                    return axios(oldRequest);
                }
                else if(error.response?.status === 422)
                {
                //   store().dispatch({
                //       type: GLOBAL_TOAST,
                //       payLoad: {
                //         showToast: true,
                //         toastMessage: "Error",
                //         toastDetail: "Validation error",
                //         toastType: "error",
                //       },
                //     });
                    
                   // alert('validation error');
                }
                else if(error.response.status === 401)
                {
           
                //   store().dispatch({
                //     type: GLOBAL_TOAST,
                //     payLoad: {
                //       showToast: true,
                //       toastMessage: "Error",
                //       toastDetail: "Oops!!, It seems that you are trying to a route for which you are not authorized",
                //       toastType: "error",
                //       sticky: true
                //     },
                //   });
                  // alert('Oops!!, Something went wrong. Its not you its us, please try again and if the error persists, please create contcat support');
                }
                else if(error?.response?.status === 500)
                {
           
                //   store().dispatch({
                //     type: GLOBAL_TOAST,
                //     payLoad: {
                //       showToast: true,
                //       toastMessage: "Error",
                //       toastDetail: "Oops!!, Something went wrong. Its not you its us, please try again and if the issue persists, kindly reach out to our support team.",
                //       toastType: "error",
                //       sticky: true
                //     },
                //   });
                  // alert('Oops!!, Something went wrong. Its not you its us, please try again and if the error persists, please create contcat support');
                }
    
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                // Do something with response error
                return Promise.reject(error);
            } catch (error) {
                // no code
            }
           
         
          
        });

    }

    setRefreshToken(token: string) {
        this.refreshToken = token;
    }

    getAccessToken() {
        this.accessToken =  this.withCredentials ? getCookieData({ localKey: "accessToken" }) : null;
        this.refreshToken =  this.withCredentials ? this.getRefreshToken() : null;
        this.token = this.withCredentials ? `Bearer ${this.accessToken}` : null
    }

    getRefreshToken() {
        return getCookieData({ localKey: "refreshToken" });
    }

    private createInstance(isToken: boolean) {

       
        return axios.create({
            baseURL: BASE_URL,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
               
            },
            withCredentials: false,
        });
    }

    protected goToLoginPage = () => {
        deleteLocalData({ localKey: "accessToken" });
        deleteLocalData({ localKey: "refreshToken" });
        const currentPath = window.location.pathname;
        if (!(currentPath.includes('/invitation-registration'))) {
            window.location.href = "/logout";
        }

    }

/**
 * 
 * TODO add http method patch
 *  
 */

    public isAccessTokenValid(endpoint: string = '') {

        const isExcludedEndPoint: boolean = includes([ ], endpoint);
        if (isExcludedEndPoint || this.withCredentials === false) return true;
        const accessToken = getCookieData({ localKey: "accessToken" })
        if (accessToken) {
            const decodedToken: any = jwtDecode(accessToken);

            // if (decodedToken == null) {

            // }

            const currentDate = new Date().getTime();
            const expiredTime = decodedToken?.exp;

            return !(currentDate / 1000 > expiredTime - 5);
        } else return false;
    }

    public get(endpoint: string) {
        return new Promise<void>((resolve, reject) => {
            const res: any = this.api.get(endpoint);
            resolve(res);

        });
    }

    public post(endpoint: string, postData: object) {
        return new Promise<void>((resolve, reject) => {

            const res: any = this.api.post(endpoint, postData)
            resolve(res);
        })
    }

    public put(endpoint: string, postData: object) {
        return new Promise<void>((resolve, reject) => {

            const res: any = this.api.put(endpoint, postData);
            resolve(res)
        });
    }

    public delete(endpoint: string) {
        return new Promise<void>((resolve, reject) => {

            const res: any = this.api.delete(endpoint);
            resolve(res);
        });
    }

    public getV2(endpoint: string,config: object) {
        return new Promise<void>((resolve, reject) => {
            const res: any = this.api.get(endpoint,!config ? {} : config);
            resolve(res);

        });
    }

    public postV2(endpoint: string, postData: object,config: object) {
        return new Promise<void>((resolve, reject) => {

            const res: any = this.api.post(endpoint, postData,!config ? {} : config)
            resolve(res);
        })
    }

    public putV2(endpoint: string, postData: object,config: object) {
        return new Promise<void>((resolve, reject) => {

            const res: any = this.api.put(endpoint, postData,!config ? {} : config);
            resolve(res)
        });
    }

    public deleteV3(endpoint: string,config: object) {
        return new Promise<void>((resolve, reject) => {

            const res: any = this.api.delete(endpoint,!config ? {} : config);
            resolve(res);
        });
    }



}

export { useHttp }