import { combineReducers } from 'redux';
import userReducer from './userReducer';

import {
  GlobalReducer,
  Login,
  GeneralConfigurationReducer,
  PostReducer
} from "@/store/reducers/reducers";


export const createReducer = combineReducers({
  userReducer: userReducer,
  GlobalReducer,
  login: Login,
  GeneralConfigurationReducer,
  PostReducer
})

