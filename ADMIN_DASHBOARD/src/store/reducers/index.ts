import { combineReducers } from 'redux';
import userReducer from './userReducer';

import {
  // @INJECT REDUCER IMPORT
    GlobalReducer,
    Login,
    GeneralConfigurationReducer,
    AdminUserReducer,
ProductReducer,
PolicyReducer,
ApplicationErrorReducer,
UserReducer,

  } from "@/store/reducers/reducers";


export const createReducer = combineReducers({
   // @INJECT REDUCER EXPORT
    userReducer: userReducer,
    GlobalReducer,
    login: Login,
    GeneralConfigurationReducer,
    AdminUserReducer,
ProductReducer,
PolicyReducer,
ApplicationErrorReducer,
UserReducer,


})

  
