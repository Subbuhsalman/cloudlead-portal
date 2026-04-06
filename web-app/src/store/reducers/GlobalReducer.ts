import initialState from "../initialState/initialState";
import { UPDATE_APP_ALIGNMENT, GLOBAL_TOAST } from "../types/actionTypes";
import { uid } from "uid";
// import { filter } from "lodash";
// import { isEmpty } from "lodash";
const GlobalReducer = (
  state: any = initialState.global,
  action: any
): any => {
  switch (action.type) {
    case UPDATE_APP_ALIGNMENT:
      return {...state,...action.payLoad}; 
    case GLOBAL_TOAST:
    return { ...state, ...action.payLoad, toastId: uid() }; 
  }
  return state;
};

export { GlobalReducer };