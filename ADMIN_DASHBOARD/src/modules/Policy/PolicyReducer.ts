import { PolicyInitalState } from "./PolicyInitalState";
import {
  POLICY_LOADING,
  POLICY_FORM_SUBMIT,
  POLICY_FORM_HTTP_REQUEST,
  POLICY_ADD,
  POLICY_GET_PAGINATED_LIST,
  POLICY_DELETE,
  POLICY_PAGNIATION_UPDATE,
  POLICY_SUCCESS_TOAST,
  POLICY_GET,
  POLICY_LAYOUT_STYLE,
  POLICY_UPDATE,
  POLICY_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./PolicyTypes";

const PolicyReducer = (state: any = PolicyInitalState.Policy, action: any): any => {
  switch (action.type) {
    case POLICY_SUCCESS_TOAST:
      return { ...state, ...action.payLoad };

    case POLICY_FORM_SUBMIT:
      return { ...state, ...action.payLoad };

    case POLICY_FORM_HTTP_REQUEST:
      return { ...state, ...action.payLoad };

    case POLICY_LOADING:
      return { ...state, ...action.payLoad };

  case POLICY_IS_INITIAL_TABLE_DATA_LOADED_UPDATE:
        return { ...state, ...action.payLoad };
      
    case POLICY_ADD:
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
    

    case POLICY_GET_PAGINATED_LIST:
      return { ...state, ...action.payLoad };

    case POLICY_PAGNIATION_UPDATE:
      return { ...state, ...action.payLoad };

    case POLICY_LAYOUT_STYLE:
      return { ...state, ...action.payLoad };

    case POLICY_UPDATE:
      {
        { const { record, listIndex } = action.payLoad;
        const itemData: any = state.list[listIndex];
        state.list[listIndex] = { ...itemData, ...record };
        return state; }
      }
      

    case POLICY_GET:
      return { ...state, ...action.payLoad };

    case POLICY_DELETE:
      {
        const Data = state.list.filter(
          (listItem: any) =>
            listItem.policy_id !== action.payLoad.policy_id
        );
        return { ...state, list: [...Data], total_records: action.total_records };
      }
     
  }

  return state;
};

export { PolicyReducer };
