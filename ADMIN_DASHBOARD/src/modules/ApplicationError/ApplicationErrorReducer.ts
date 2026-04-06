import { ApplicationErrorInitalState } from "./ApplicationErrorInitalState";
import {
  APPLICATION_ERROR_LOADING,
  APPLICATION_ERROR_FORM_SUBMIT,
  APPLICATION_ERROR_FORM_HTTP_REQUEST,
  APPLICATION_ERROR_ADD,
  APPLICATION_ERROR_GET_PAGINATED_LIST,
  APPLICATION_ERROR_DELETE,
  APPLICATION_ERROR_PAGNIATION_UPDATE,
  APPLICATION_ERROR_SUCCESS_TOAST,
  APPLICATION_ERROR_GET,
  APPLICATION_ERROR_LAYOUT_STYLE,
  APPLICATION_ERROR_UPDATE,
  APPLICATION_ERROR_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./ApplicationErrorTypes";

const ApplicationErrorReducer = (state: any = ApplicationErrorInitalState.ApplicationError, action: any): any => {
  switch (action.type) {
    case APPLICATION_ERROR_SUCCESS_TOAST:
      return { ...state, ...action.payLoad };

    case APPLICATION_ERROR_FORM_SUBMIT:
      return { ...state, ...action.payLoad };

    case APPLICATION_ERROR_FORM_HTTP_REQUEST:
      return { ...state, ...action.payLoad };

    case APPLICATION_ERROR_LOADING:
      return { ...state, ...action.payLoad };

  case APPLICATION_ERROR_IS_INITIAL_TABLE_DATA_LOADED_UPDATE:
        return { ...state, ...action.payLoad };
      
    case APPLICATION_ERROR_ADD:
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
    

    case APPLICATION_ERROR_GET_PAGINATED_LIST:
      return { ...state, ...action.payLoad };

    case APPLICATION_ERROR_PAGNIATION_UPDATE:
      return { ...state, ...action.payLoad };

    case APPLICATION_ERROR_LAYOUT_STYLE:
      return { ...state, ...action.payLoad };

    case APPLICATION_ERROR_UPDATE:
      {
        { const { record, listIndex } = action.payLoad;
        const itemData: any = state.list[listIndex];
        state.list[listIndex] = { ...itemData, ...record };
        return state; }
      }
      

    case APPLICATION_ERROR_GET:
      return { ...state, ...action.payLoad };

    case APPLICATION_ERROR_DELETE:
      {
        const Data = state.list.filter(
          (listItem: any) =>
            listItem.application_error_id !== action.payLoad.application_error_id
        );
        return { ...state, list: [...Data], total_records: action.total_records };
      }
     
  }

  return state;
};

export { ApplicationErrorReducer };
