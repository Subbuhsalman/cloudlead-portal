import initialState from "@/store/initialState/initialState";
import {LOGGED_IN, LOGGED_IN_USER,LOGGING,LOGIN_INVALID,LOG_OUT} from "../types/actionTypes";
const Login = (
  state: any = initialState.login,
  action: any
): any => {
  switch (action.type) {
    case LOGGED_IN_USER:
      const newUser: any = {
        ...action.userInfo,
      };
      return {
        ...state,
        ...newUser
      };
    case LOGGED_IN:
    case LOGGING:
    case LOGIN_INVALID:
      return {
        ...state,
        ...action.payload
      };
    case LOG_OUT:
      return {
        ...initialState.login
      };
  }
  return state;
};

export  {Login};
