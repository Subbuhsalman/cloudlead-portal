import { GalleryInitalState } from "./GalleryInitalState";
import {
  GALLERY_LOADING,
  GALLERY_FORM_SUBMIT,
  GALLERY_FORM_HTTP_REQUEST,
  GALLERY_ADD,
  GALLERY_GET_PAGINATED_LIST,
  GALLERY_DELETE,
  GALLERY_PAGNIATION_UPDATE,
  GALLERY_SUCCESS_TOAST,
  GALLERY_GET,
  GALLERY_LAYOUT_STYLE,
  GALLERY_UPDATE,
  GALLERY_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./GalleryTypes";

const GalleryReducer = (state: any = GalleryInitalState.Gallery, action: any): any => {
  switch (action.type) {
    case GALLERY_SUCCESS_TOAST:
      return { ...state, ...action.payLoad };

    case GALLERY_FORM_SUBMIT:
      return { ...state, ...action.payLoad };

    case GALLERY_FORM_HTTP_REQUEST:
      return { ...state, ...action.payLoad };

    case GALLERY_LOADING:
      return { ...state, ...action.payLoad };

  case GALLERY_IS_INITIAL_TABLE_DATA_LOADED_UPDATE:
        return { ...state, ...action.payLoad };
      
    case GALLERY_ADD:
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
    

    case GALLERY_GET_PAGINATED_LIST:
      return { ...state, ...action.payLoad };

    case GALLERY_PAGNIATION_UPDATE:
      return { ...state, ...action.payLoad };

    case GALLERY_LAYOUT_STYLE:
      return { ...state, ...action.payLoad };

    case GALLERY_UPDATE:
      {
        { const { record, listIndex } = action.payLoad;
        const itemData: any = state.list[listIndex];
        state.list[listIndex] = { ...itemData, ...record };
        return state; }
      }
      

    case GALLERY_GET:
      return { ...state, ...action.payLoad };

    case GALLERY_DELETE:
      {
        const Data = state.list.filter(
          (listItem: any) =>
            listItem.gallery_id !== action.payLoad.gallery_id
        );
        return { ...state, list: [...Data], total_records: action.total_records };
      }
     
  }

  return state;
};

export { GalleryReducer };
