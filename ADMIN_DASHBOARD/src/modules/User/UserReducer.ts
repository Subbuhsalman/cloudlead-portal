import { UserInitialState } from "./UserInitalState";
import {
  USER_LOADING,
  USER_FORM_SUBMIT,
  USER_FORM_HTTP_REQUEST,
  USER_ADD,
  USER_GET_PAGINATED_LIST,
  USER_DELETE,
  USER_PAGNIATION_UPDATE,
  USER_SUCCESS_TOAST,
  USER_GET,
  USER_LAYOUT_STYLE,
  USER_UPDATE,
  USER_IS_INITIAL_TABLE_DATA_LOADED_UPDATE,
  USER_ADD_CREDITS,
} from "./UserTypes";

export const UserReducer = (state = UserInitialState, action: any): any => {
  switch (action.type) {
    case USER_SUCCESS_TOAST:
      return { ...state, ...action.payLoad };

    case USER_FORM_SUBMIT:
      return { ...state, ...action.payLoad };

    case USER_FORM_HTTP_REQUEST:
      return { ...state, ...action.payLoad };

    case USER_LOADING:
      return { ...state, ...action.payLoad };

    case USER_IS_INITIAL_TABLE_DATA_LOADED_UPDATE:
      return { ...state, ...action.payLoad };
      
    case USER_ADD:
      {
        const tableList = state?.list;

        if (state.per_page === parseInt(tableList?.length.toString())) {
          const startIndex = tableList?.length - 1;
          tableList?.splice(startIndex, 1);
        }

        return {
          ...state,
          list: [...[action.payLoad], ...tableList],
          total_records: action.total_records,
        };
      }

    case USER_GET_PAGINATED_LIST:
      return { ...state, ...action.payLoad };

    case USER_PAGNIATION_UPDATE:
      return { ...state, ...action.payLoad };

    case USER_LAYOUT_STYLE:
      return { ...state, ...action.payLoad };

    case USER_UPDATE:
      {
        const { record, listIndex } = action.payLoad;
        const updatedList = [...state.list] as any[];
        updatedList[listIndex] = record;
        return {
          ...state,
          list: updatedList,
        };
      }

    case USER_GET:
      return { ...state, ...action.payLoad };

    case USER_DELETE:
      return {
        ...state,
        list: state.list.filter((item: any) => item.user_id !== action.payLoad.user_id),
        total_records: action.total_records,
      };

    case USER_ADD_CREDITS:
      return { ...state, ...action.payLoad };

    default:
      return state;
  }
};
