import {AdminUserInitalState} from "./AdminUserInitalState";
import {
  ADMIN_USER_LOADING,
  ADMIN_USER_FORM_SUBMIT,
  ADMIN_USER_FORM_HTTP_REQUEST,
  ADMIN_USER_ADD,
  ADMIN_USER_GET_PAGINATED_LIST,
  ADMIN_USER_DELETE,
  ADMIN_USER_PAGNIATION_UPDATE,
  ADMIN_USER_SUCCESS_TOAST,
  ADMIN_USER_GET,
  ADMIN_USER_LAYOUT_STYLE,
  ADMIN_USER_UPDATE,
  ADMIN_USER_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./AdminUserTypes";

const AdminUserReducer = (state: any = AdminUserInitalState.AdminUser, action: any): any => {
  switch (action.type) {
    case ADMIN_USER_SUCCESS_TOAST:
      return { ...state, ...action.payLoad };

    case ADMIN_USER_FORM_SUBMIT:
      return { ...state, ...action.payLoad };

    case ADMIN_USER_FORM_HTTP_REQUEST:
      return { ...state, ...action.payLoad };

    case ADMIN_USER_LOADING:
      return { ...state, ...action.payLoad };

  case ADMIN_USER_IS_INITIAL_TABLE_DATA_LOADED_UPDATE:
        return { ...state, ...action.payLoad };
      
    case ADMIN_USER_ADD:
      {
        const tableList = state?.list;

        if (state.per_page === parseInt(tableList?.length)) {
          const startIndex = tableList?.length - 1; // Calculate the starting index
          tableList?.splice(startIndex, 1); // Get a new array with the removed elements
        }
  
        return {
          ...state,
          list: [...[action.payLoad], ...tableList],
          total_records: action.total_records,
        };
      }
    

    case ADMIN_USER_GET_PAGINATED_LIST:
      return { ...state, ...action.payLoad };

    case ADMIN_USER_PAGNIATION_UPDATE:
      return { ...state, ...action.payLoad };

    case ADMIN_USER_LAYOUT_STYLE:
      return { ...state, ...action.payLoad };

    case ADMIN_USER_UPDATE:
      {
        { const { record, listIndex } = action.payLoad;
        const itemData: any = state.list[listIndex];
        state.list[listIndex] = { ...itemData, ...record };
        return state; }
      }
      

    case ADMIN_USER_GET:
      return { ...state, ...action.payLoad };

    case ADMIN_USER_DELETE:
      {
        const Data = state.list.filter(
          (listItem: any) =>
            listItem.admin_user_id !== action.payLoad.admin_user_id
        );
        return { ...state, list: [...Data], total_records: action.total_records };
      }
     
  }

  return state;
};

export { AdminUserReducer };
