/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Dispatch } from "redux";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  addUser,
  logoutUser,
  authenticateUser,
  addUserInfoIntoFirebase,
  checkAuthCode,
  resendAuthCode,
  lockDownTemp,
  updateUserSettings,
  registerUser
} from  "@/store/actions";

import moment from "moment";
import {  getCookieData, isLoggedIn  } from "@/utils";
import { useRouter } from "next/navigation";
import { COOKIE_DOMAIN, ENVIRONMENT_PROD } from "@/utils/constants";

const useLoginDetails = () => {
    const router = useRouter();

  const userDetail: any = useSelector((state: any) => {
    return state.login;
  }, shallowEqual);
  const twoFactorRedirect = useSelector(
    (state: any) => state.login.redirectTwoFactor,
    shallowEqual
  );

  const authLoading = useSelector(
    (state: any) => state.login.loading,
    shallowEqual
  );

  

  const twoFactorTempData = useSelector(
    (state: any) => state.login.twoFactorTempData,
    shallowEqual
  );

  const loginToast = useSelector(
    (state: any) => state.login.toast,
    shallowEqual
  );
  const loginToastMessage = useSelector(
    (state: any) => state.login.toastMessage,
    shallowEqual
  );
  const loginToastType = useSelector(
    (state: any) => state.login.toastType,
    shallowEqual
  );
  const isTempLockCountDown = useSelector(
    (state: any) => state.login.isTempLockCountDown,
    shallowEqual
  );
  const tempLockCountDuration = useSelector(
    (state: any) => state.login.tempLockCountDuration,
    shallowEqual
  );
  const tempLocktryAgainIn = useSelector(
    (state: any) => state.login.tryAgainIn,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();

  const addUserInfo = React.useCallback(
    (userInfo:  any) => dispatch(addUser(userInfo)),
    [dispatch]
  );
  const addFirebaseToken = React.useCallback(
    (data: any) => dispatch(addUserInfoIntoFirebase(data)),
    [dispatch]
  );

  const loginUser = React.useCallback((userInfo:any) => {
    dispatch(authenticateUser(userInfo ,router));
  }, [dispatch]);

  const removeUserInfo = React.useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const registerUserHook = React.useCallback((formData:any) => {
    dispatch(registerUser(formData));
  }, [dispatch]);
  

  const twoFactorVerification = React.useCallback(
    (formData: any) => dispatch(checkAuthCode(formData)),
    [dispatch]
  );
  const saveUserSettings = React.useCallback(
    (userData: any) => dispatch(updateUserSettings(userData)),
    [dispatch]
  );
  const VerificationAgainEmail = React.useCallback(
    (formData: any) => dispatch(resendAuthCode(formData)),
    [dispatch]
  );

  const setTempLockDown = React.useCallback(
    (islock: boolean, duration: number, tryAgainIn: any) =>
      dispatch(lockDownTemp(islock, duration, tryAgainIn)),
    [dispatch]
  );

  /**
   * Check if route is valid for logged in user
   */
  const checkValidLoginRoute = () => {
    // Store location information in variables to avoid multiple reads
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    // Check login status and add user info if necessary
    if (!userDetail?.isLoggedIn && isLoggedIn(userDetail)) {
      addUserInfo({ isLoggedIn: true });
    }

    // If user is not logged in and no refreshToken cookie exists
    if (userDetail?.isLoggedIn === false && !getCookieData({ localKey: "refreshToken" })) {
      // Define the public paths
      const publicPaths = ['/'];

      // If the current path is "/invitation-registration", preserve the query string
      if (currentPath === "/invitation-registration") {
        router.push(currentPath + currentSearch);
      } else {
        // Check if the path is public and navigate accordingly
        const isPublicPath = publicPaths.includes(currentPath);
        router.push(isPublicPath ? currentPath + currentSearch : "/");
      }
    } else {
      // If the user is logged in or has a refreshToken, navigate to the current path with query string
      router.push(currentPath + currentSearch);
    }
  };





  const sendToLogin = () => {
  //  navigate("/login");
  };
  React.useEffect(() => {
    if (window.location.pathname === "/" && userDetail.isLoggedIn) {
      if (parseInt(userDetail?.userDetail?.user_type) === 4) {
      //  navigate("/applicant/dashboard");
      }
      else {
      //  navigate("/dashboard");
      }
    }

    const tempLockDetail = JSON.parse(localStorage.getItem("tempLock") || "{}");
    if (tempLockDetail?.temporary_block) {
      const now = moment(); // create a moment with the current time
      const then = moment.unix(tempLockDetail?.expires_in); // create a moment with the other time timestamp in seconds
      if (then > now) {
        const delta = then.diff(now, "milliseconds"); // get the millisecond difference
        setTempLockDown(true, delta, tempLockDetail?.try_again_in);
      } else {
        localStorage.removeItem("tempLock");
        setTempLockDown(false, 0, 0);
      }
    }
  }, [userDetail]);
  return {
    authLoading,
    userDetail,
    twoFactorRedirect,
    twoFactorTempData,
    loginToast,
    loginToastMessage,
    loginToastType,
    isTempLockCountDown,
    tempLockCountDuration,
    tempLocktryAgainIn,
    registerUserHook,
    setTempLockDown,
    addFirebaseToken,
    addUserInfo,
    loginUser,
    removeUserInfo,
    checkValidLoginRoute,
    sendToLogin,
    twoFactorVerification,
    VerificationAgainEmail,
    saveUserSettings,

  };
};
export { useLoginDetails };
