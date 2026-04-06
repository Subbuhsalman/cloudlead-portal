import { PostInitalState } from "./PostInitalState";
import {
  POST_LOADING,
  POST_FORM_SUBMIT,
  POST_FORM_HTTP_REQUEST,
  POST_ADD,
  POST_GET_PAGINATED_LIST,
  POST_DELETE,
  POST_PAGNIATION_UPDATE,
  POST_SUCCESS_TOAST,
  POST_GET,
  POST_LAYOUT_STYLE,
  POST_UPDATE,
  POST_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./PostTypes";

const PostReducer = (state: any = PostInitalState.Post, action: any): any => {
  switch (action.type) {
    case POST_SUCCESS_TOAST:
      return { ...state, ...action.payLoad };

    case POST_FORM_SUBMIT:
      return { ...state, ...action.payLoad };

    case POST_FORM_HTTP_REQUEST:
      return { ...state, ...action.payLoad };

    case POST_LOADING:
      return { ...state, ...action.payLoad };

  case POST_IS_INITIAL_TABLE_DATA_LOADED_UPDATE:
        return { ...state, ...action.payLoad };
      
    case POST_ADD:
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
    

    case POST_GET_PAGINATED_LIST:
      return { ...state, ...action.payLoad };

    case POST_PAGNIATION_UPDATE:
      return { ...state, ...action.payLoad };

    case POST_LAYOUT_STYLE:
      return { ...state, ...action.payLoad };

    case POST_UPDATE:
      {
        { const { record, listIndex } = action.payLoad;
        const itemData: any = state.list[listIndex];
        state.list[listIndex] = { ...itemData, ...record };
        return state; }
      }
      

    case POST_GET:
      return { ...state, ...action.payLoad };

    case POST_DELETE:
      {
        const Data = state.list.filter(
          (listItem: any) =>
            listItem.post_id !== action.payLoad.post_id
        );
        return { ...state, list: [...Data], total_records: action.total_records };
      }
     
  }

  return state;
};

export { PostReducer };
