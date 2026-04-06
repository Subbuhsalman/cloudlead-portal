import { GLOBAL_TOAST, LOGGED_IN, LOGGING, LOGIN_INVALID, LOG_OUT } from '@/store/types/actionTypes';
import { default as EndPoints } from '@/store/Endpoints/loginEndpoints.json';
import { batch } from 'react-redux';
import moment from 'moment';
import { useHttp } from '@/hooks/useHttp';
import { deleteLocalData, getCookieData, saveCookieData } from '@/utils';

export const addUser = (userInfo: any) => (dispatch: any, getState: any) => {
    const refreshToken: string = getCookieData({ localKey: 'refreshToken' });
    // const decode: any = jwtDecode<JwtpayLoad>(refreshToken);
    const Login = new useHttp();
    const { login } = getState();

    Login.get(`/admin-user/me`)
        .then((res: any) => {
            const { status, data } = res;
            if (status)
                dispatch({
                    type: LOGGED_IN,
                    payLoad: {
                        error: false,
                        success: true,
                        isLoggedIn: true,
                        refreshToken,
                        userDetail: data?.userDetail,

                    }
                });
        })
        .catch((e: any) => {})
        .finally(() => {
            //  dispatch(getPlatformGeneralSettings(EndPoints.getAllPlatformSettings));
        });
};
const LoginLoading = (start = true) => {
    const payLoad = start ? { loading: true, error: false, success: null } : { loading: false };
    const action: any = {
        type: LOGGING,
        payLoad
    };
    return action;
};
export const lockDownTemp = (islock: boolean, duration: number, tryAgainIn: any) => (dispatch: any) => {
    if (!islock) {
        localStorage.removeItem('tempLock');
    }
    const payLoad = islock
        ? {
              isTempLockCountDown: true,
              tempLockCountDuration: duration,
              tryAgainIn: tryAgainIn
          }
        : { isTempLockCountDown: false, tempLockCountDuration: 0, tryAgainIn: 0 };
    const action: any = {
        type: LOGGING,
        payLoad
    };
    dispatch(action);
};

export const lockTempDuration = (islock: boolean, duration: number, tryAgainIn: any) => {
    if (!islock) {
        localStorage.removeItem('tempLock');
    }
    const payLoad = islock
        ? {
              isTempLockCountDown: true,
              tempLockCountDuration: duration,
              tryAgainIn: tryAgainIn
          }
        : { isTempLockCountDown: false, tempLockCountDuration: 0, tryAgainIn: 0 };
    const action: any = {
        type: LOGGING,
        payLoad
    };
    return action;
};

export const addUserInfoIntoFirebase = (userInfo: any) => (dispatch: any) => {
    const FirebaseData = new useHttp();
    // dispatch(LoginLoading());
    FirebaseData.post(EndPoints.webpushtoken, userInfo)
        .then((res: any) => {})
        .catch((e: any) => {})
        .finally(() => {});
};
export const authenticateUser = (userInfo: any, router:any) => (dispatch: any) => {
    const Login = new useHttp(false);
    dispatch(LoginLoading());
    Login.post('/admin-user/sigin', {...userInfo,is_admin: true})
        .then((res: any) => {
            const data = res.data;
            if(data?.success === true){
                if ('accessToken' in data) {
                    saveCookieData({ localKey: 'accessToken', value: data?.accessToken });
                    saveCookieData({ localKey: 'refreshToken', value: data?.accessToken });
    
                    router.push("/dashboard")
    
                    dispatch({
                        type: LOGGED_IN,
                        payLoad: {
                            error: false,
                            success: true,
                            isLoggedIn: true,
                            ...data
                        }
                    });
                }
            }
            if(data?.success === false){
                dispatch({
                    type: GLOBAL_TOAST,
                    payLoad: {
                      showToast: true,
                      toastMessage: data?.message || "Something went wrong",
                      toastDetail: null,
                      toastType: "error",
                    },
                  });
            }
          
        })
        .catch((e: any) => {
            dispatch({
                type: LOGIN_INVALID,
                payLoad: { error: e.response?.data?.message, success: false }
            });
            dispatch({
                type: GLOBAL_TOAST,
                payLoad: {
                  showToast: true,
                  toastMessage: e.response?.data?.message || "Something went wrong",
                  toastDetail: null,
                  toastType: "error",
                },
              });
          
        })
        .finally(() => {
            batch(() => {
                dispatch(LoginLoading(false));
            });
        });
};

export const registerUser = (userInfo: any) => (dispatch: any) => {
    const Login = new useHttp(false);
    dispatch(LoginLoading());
    Login.post('/signup', userInfo)
        .then((res: any) => {
            const data = res.data;

            if ('accessToken' in data) {
                saveCookieData({ localKey: 'accessToken', value: data?.accessToken });
                saveCookieData({ localKey: 'refreshToken', value: data?.accessToken });
                dispatch({
                    type: LOGGED_IN,
                    payLoad: {
                        error: false,
                        success: true,
                        isLoggedIn: true,
                        ...data
                    }
                });
            }
        })
        .catch((e: any) => {
            dispatch({
                type: LOGIN_INVALID,
                payLoad: { error: e.response?.data?.message, success: false }
            });
            dispatch({
                type: GLOBAL_TOAST,
                payLoad: {
                  showToast: true,
                  toastMessage: e.response?.data?.message,
                  toastDetail: null,
                  toastType: "error",
                },
              });
        })
        .finally(() => {
            batch(() => {
                dispatch(LoginLoading(false));
            });
        });
};

export const resendAuthCode = (userInfo: any) => (dispatch: any, getState: any) => {
    const Login = new useHttp(false);
    //dispatch(LoginLoading());
    Login.post('/resent-verification-code', userInfo)
        .then((res: any) => {
            if (res.status) {
                dispatch({
                    type: LOGGED_IN,
                    payLoad: {
                        toast: true,
                        toastMessage: 'Sent',
                        toastType: 'success'
                    }
                });
            }
        })
        .finally(() => {
            dispatch({
                type: LOGGED_IN,
                payLoad: {
                    toast: false,
                    toastMessage: null,
                    toastType: 'success'
                }
            });
        });
};
export const checkAuthCode = (userInfo: any) => (dispatch: any, getState: any) => {
    const { login } = getState();
    const { twoFactorTempData } = login;
    const Login = new useHttp(false);
    //dispatch(LoginLoading());
    Login.post('/auth-verification', userInfo)
        .then((res: any) => {
            const { status, data } = res.data;
            if (status) {
                if (data) {
                    const expiredTime = data?.expiry;
                    const date1 = new Date();
                    const currenTime = date1.getTime();

                    const date = moment.utc(expiredTime).format('YYYY-MM-DD HH:mm:ss');
                    const stillUtc = moment.utc(date).toDate();
                    const local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');

                    const expired = new Date(local);
                    const expireTime = expired.getTime();
                    if (expireTime > currenTime) {
                        saveCookieData({
                            localKey: 'accessToken',
                            value: twoFactorTempData?.accessToken
                        });
                        dispatch({
                            type: LOGGED_IN,
                            payLoad: {
                                redirectTwoFactor: false,
                                error: false,
                                success: true,
                                isLoggedIn: true,
                                ...twoFactorTempData
                            }
                        });
                    } else {
                        dispatch({
                            type: LOGGED_IN,
                            payLoad: {
                                toast: true,
                                toastMessage: 'Authentication Code Expired',
                                toastType: 'error'
                            }
                        });
                    }
                } else {
                    dispatch({
                        type: LOGGED_IN,
                        payLoad: {
                            toast: true,
                            toastMessage: 'Incorrect Code',
                            toastType: 'error'
                        }
                    });
                }
            } else {
            }
        })
        .catch((e: any) => {
            // dispatch({ type: LOGIN_INVALID, payLoad: { error: e.message, success: false } })
        })
        .finally(() => {
            batch(() => {
                dispatch({
                    type: LOGGED_IN,
                    payLoad: {
                        toast: false,
                        toastMessage: null,
                        toastType: 'success'
                    }
                });
                dispatch(LoginLoading(false));
            });
        });
};

export const logoutUser = () => (dispatch: any) => {
    deleteLocalData({ localKey: 'accessToken' });
    deleteLocalData({ localKey: 'refreshToken' });
    dispatch({ type: LOG_OUT });
    window.location.href= "/"
};

export const updateUserSettings = (userInfo: any) => (dispatch: any, getState: any) => {
    const api = new useHttp(true);
    const { user_id, ...userData } = userInfo;
    //dispatch(LoginLoading());
    api.put('/user-info/update/themeoptions/' + user_id, { themeOptions: userData })
        .then((res: any) => {
            if (res.status) {
                dispatch({
                    type: LOGGED_IN,
                    payLoad: {
                        toast: true,
                        toastMessage: 'Sent',
                        toastType: 'success'
                    }
                });
            }
        })
        .finally(() => {
            dispatch({
                type: LOGGED_IN,
                payLoad: {
                    toast: false,
                    toastMessage: null,
                    toastType: 'success'
                }
            });
        });
};
