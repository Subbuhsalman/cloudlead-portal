import initialState from "../initialState/initialState";
import { CONFIGURATION_LOADING, CONFIGURATION_UPDATE_OR_CREATE, CONFIGURATION_GET_SUCCESS } from "../types/actionTypes";
// import { filter } from "lodash";
// import { isEmpty } from "lodash";
const GeneralConfigurationReducer = (
  state: any = initialState.Configation,
  action: any
): any => {
  switch (action.type) {
    case CONFIGURATION_LOADING:
      return {...state,...action.payLoad}; 
    case CONFIGURATION_UPDATE_OR_CREATE: 
     return {...state, ...action.payLoad}
    case CONFIGURATION_GET_SUCCESS:
      return {...state,...action.payLoad}; 
  }
  return state;
};

export { GeneralConfigurationReducer };