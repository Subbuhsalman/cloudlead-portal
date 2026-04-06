import { CONFIGURATION_UPDATE_OR_CREATE, GLOBAL_TOAST, LOGGED_IN, LOGGING, LOGIN_INVALID, LOG_OUT } from '@/store/types/actionTypes';

import { jwtDecode, JwtPayload } from 'jwt-decode';
import { default as EndPoints } from '@/store/Endpoints/loginEndpoints.json';
import { batch } from 'react-redux';
import moment from 'moment';
import { useHttp } from '@/hooks/useHttp';
import { deleteLocalData, getCookieData, saveCookieData } from '@/utils';
import { dashboardHome } from '@/utils/menuItem';

export const addUser = () => (dispatch: any, getState: any) => {
    const refreshToken: string = getCookieData({ localKey: 'refreshToken' });
    const Login = new useHttp();
    Login.get(`/auth/me`)
        .then((res: any) => {
            const { status, data } = res;
            if (status)
                dispatch({
                    type: LOGGED_IN,
                    payload: {
                        error: false,
                        success: true,
                        isLoggedIn: true,
                        refreshToken,
                        userDetail: data,

                    }
                });
        })
        .catch((e: any) => { })
        .finally(() => {
            //  dispatch(getPlatformGeneralSettings(EndPoints.getAllPlatformSettings));
        });
};
const LoginLoading = (start = true) => {
    const payload = start ? { loading: true, error: false, success: null } : { loading: false };
    const action: any = {
        type: LOGGING,
        payload
    };
    return action;
};
export const lockDownTemp = (islock: boolean, duration: number, tryAgainIn: any) => (dispatch: any) => {
    if (!islock) {
        localStorage.removeItem('tempLock');
    }
    const payload = islock
        ? {
            isTempLockCountDown: true,
            tempLockCountDuration: duration,
            tryAgainIn: tryAgainIn
        }
        : { isTempLockCountDown: false, tempLockCountDuration: 0, tryAgainIn: 0 };
    const action: any = {
        type: LOGGING,
        payload
    };
    dispatch(action);
};

export const lockTempDuration = (islock: boolean, duration: number, tryAgainIn: any) => {
    if (!islock) {
        localStorage.removeItem('tempLock');
    }
    const payload = islock
        ? {
            isTempLockCountDown: true,
            tempLockCountDuration: duration,
            tryAgainIn: tryAgainIn
        }
        : { isTempLockCountDown: false, tempLockCountDuration: 0, tryAgainIn: 0 };
    const action: any = {
        type: LOGGING,
        payload
    };
    return action;
};

export const addUserInfoIntoFirebase = (userInfo: any) => (dispatch: any) => {
    const FirebaseData = new useHttp();
    // dispatch(LoginLoading());
    FirebaseData.post(EndPoints.webpushtoken, userInfo)
        .then((res: any) => { })
        .catch((e: any) => { })
        .finally(() => { });
};
export const authenticateUser = (userInfo: any, router: any) => (dispatch: any) => {
    const Login = new useHttp(false);
    dispatch(LoginLoading());
    Login.post('/auth/authenticate/credential', { ...userInfo })
        .then((res: any) => {
            const data = res.data;
            if (data?.success === true) {
                console.log("first")
                if ('accessToken' in data) {
                    saveCookieData({ localKey: 'accessToken', value: data?.accessToken });
                    saveCookieData({ localKey: 'refreshToken', value: data?.refreshToken });

                    router.push(dashboardHome)

                    dispatch({
                        type: LOGGED_IN,
                        payload: {
                            error: false,
                            success: true,
                            isLoggedIn: true,
                            ...data
                        }
                    });
                }
            }
            if (data?.success === false) {
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
                payload: { error: e.response?.data?.message, success: false }
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

export const registerUser = (userInfo: any, onSuccess: any) => (dispatch: any) => {
    const Login = new useHttp(false);
    dispatch(LoginLoading());
    Login.post('/auth/register/account', userInfo)
        .then((res: any) => {
            const data = res.data;
            console.log("data.success", data.success)
            if (data.success === true) {
                onSuccess(data);
                // dispatch({
                //     type: LOGGED_IN,
                //     payload: {
                //         error: false,
                //         success: true,
                //         isLoggedIn: true,
                //         ...data
                //     }
                // });
            }
        })
        .catch((e: any) => {
            dispatch({
                type: LOGIN_INVALID,
                payload: { error: e.response?.data?.message, success: false }
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
                    payload: {
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
                payload: {
                    toast: false,
                    toastMessage: null,
                    toastType: 'success'
                }
            });
        });
};


export const sendResetLinkHookAction = (userInfo: any) => (dispatch: any, getState: any) => {
    const Login = new useHttp(false);
    //dispatch(LoginLoading());
    Login.post('/resent-verification-code', userInfo)
        .then((res: any) => {
            if (res.status) {
                dispatch({
                    type: LOGGED_IN,
                    payload: {
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
                payload: {
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
                            payload: {
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
                            payload: {
                                toast: true,
                                toastMessage: 'Authentication Code Expired',
                                toastType: 'error'
                            }
                        });
                    }
                } else {
                    dispatch({
                        type: LOGGED_IN,
                        payload: {
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
            // dispatch({ type: LOGIN_INVALID, payload: { error: e.message, success: false } })
        })
        .finally(() => {
            batch(() => {
                dispatch({
                    type: LOGGED_IN,
                    payload: {
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
    window.location.href = "/"
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
                    payload: {
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
                payload: {
                    toast: false,
                    toastMessage: null,
                    toastType: 'success'
                }
            });
        });
};
