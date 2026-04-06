import {
  PRODUCT_LOADING,
  PRODUCT_FORM_SUBMIT,
  PRODUCT_ADD,
  PRODUCT_DELETE,
  PRODUCT_PAGNIATION_UPDATE,
  PRODUCT_GET_PAGINATED_LIST,
  PRODUCT_GET,
  PRODUCT_LAYOUT_STYLE,
  PRODUCT_UPDATE,
  PRODUCT_FORM_HTTP_REQUEST,
  PRODUCT_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./ProductTypes";
import { findIndex } from "lodash";
import { useHttp } from "@/hooks";
import { GLOBAL_TOAST } from "@/store/types/actionTypes";
const ProductLoading = (status = true) => {
  const payLoad = status
    ? { loading: true, error: false, success: null }
    : { loading: false };
  const action: any = {
    type: PRODUCT_LOADING,
    payLoad,
  };
  return action;
};

const ProductSubmit = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: PRODUCT_FORM_SUBMIT,
    payLoad,
  };
  return action;
};

const ProductHttpRequest = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: PRODUCT_FORM_HTTP_REQUEST,
    payLoad,
  };
  return action;
};
export function addProductAction(url: string, formData: object, resetForm: () => void,isSaveAndExit:boolean, showSideBar: (status:boolean) => void) {
  return async (dispatch: DispatchType, getState: any) => {
    const { ProductReducer } = getState();
    const { total_records } = ProductReducer;

    dispatch(ProductSubmit());
    const db = new useHttp();

    try {
      dispatch(ProductLoading());
      const res = await db.post(url, formData) as any
      const { data } = res;
    

        resetForm();
        const action: any = {
          type: PRODUCT_ADD,
          payLoad: data,
          total_records: total_records + 1,
        };
      
          dispatch(action);

          dispatch({
            type: GLOBAL_TOAST,
            payLoad: {
              showToast: true,
              toastMessage: res.data.message,
              toastDetail: null,
              toastType: "success",
            },
          });
      
        if(isSaveAndExit){
          showSideBar(false)
        }
      
    } catch (error:any) { 
      if(error.status === 400){
        dispatch({
          type: GLOBAL_TOAST,
          payLoad: {
            showToast: true,
            toastMessage: "Server side middleware validation error",
            toastDetail: null,
            toastType: "error",
          },
        });
  
      }
    }
    finally {
      dispatch(ProductLoading(false));
      dispatch(ProductSubmit(false));
    }
   
  };
}

export function updateProductAction(
  url: string,
  modelId: number,
  formData: object,
  resetForm: () => void,
  isSaveAndExit:boolean, 
  showSideBar: (status:boolean) => void
) {
  return async (dispatch: DispatchType, getState: any) => {
    const { ProductReducer } = getState();
    const { list } = ProductReducer;
    const listIndex = findIndex(list, function (listItem: any) {
      return listItem.product_id === modelId;
    });
    dispatch(ProductSubmit());
    const db = new useHttp();

    try {
      const res = await db.put(`${url}${modelId}`, formData) as any
      if (res.status === 200) {
        const record  = res.data;
        resetForm();
        const action: any = {
          type: PRODUCT_UPDATE,
          payLoad: { record, listIndex },
        };
        const updateAction: any = {
          type: PRODUCT_GET,
          payLoad: {
            product: record,
          },
        };
      
          dispatch(action);
          dispatch(updateAction);
          /**
           * For Global toast show
           */
          dispatch({
            type: GLOBAL_TOAST,
            payLoad: {
              showToast: true,
              toastMessage: res.data.message || "Updated",
              toastDetail: null,
              toastType: "success",
            },
          });
        
        if(isSaveAndExit){
          showSideBar(false)
        }

      }
    } catch (error) {

      console.log(error)
      
    }
    finally{
      dispatch(ProductLoading(false));
      dispatch(ProductSubmit(false));
    }
  
  };
}

export function clearProductDataAction() {
  return (dispatch: DispatchType, getState: any) => {
    const action: any = {
      type: PRODUCT_GET,
      payLoad: {
        product: null,
      },
    };
    dispatch(action);
  };
}

export function deleteProductAction(url: string, data: any) {
  return (dispatch: DispatchType, getState: any) => {
    const { ProductReducer } = getState();
    const { total_records } = ProductReducer;

    dispatch(ProductLoading());
    const db = new useHttp();
    try {
      const res = db.delete(`${url}${data.product_id}`) as any
      if (res.status === 200) {
        const action: any = {
          type: PRODUCT_DELETE,
          payLoad: data,
          total_records: total_records - 1,
        };
  
          dispatch({
            type: GLOBAL_TOAST,
            payLoad: {
              showToast: true,
              toastMessage: "Deleted",
              toastDetail: null,
              toastType: "success",
            },
          });
          dispatch(action);
        
      }
    } catch (error) {
      console.log(error)  
      
    }
    finally{
      dispatch(ProductLoading(false));
          dispatch(ProductSubmit(false));
    }
    
  };
}

export function getPaginatedProductListAction(URL: string) {
  return async (dispatch: DispatchType, getState: any) => {
    const { ProductReducer } = getState();
    const { page, per_page, filter, sort } = ProductReducer;
    if (ProductReducer.loading === true) return false;
    dispatch(ProductLoading());
    const db = new useHttp();

    try {
      const res = await db.get(
        URL + `?page=${page}&per_page=${per_page}&filter=${filter}&sort=${sort}`
      ) as any
      const { list, pagination } = res.data;
      if (list?.length > 0) {
        const action: any = {
          type: PRODUCT_GET_PAGINATED_LIST,
          payLoad: {
            list: list,
            count: list.length,
            total_records: pagination.totalRecords,
          },
        };
        dispatch(action);
      } else {
        const action: any = {
          type: PRODUCT_GET_PAGINATED_LIST,
          payLoad: {
            list: [],
            count: 0,
            total_records: 0,
          },
        };
        dispatch(action);
      }
    } catch (error) {
      console.log(error)
      
    }
    finally{
      dispatch(ProductLoading(false));
    }
    
  };
}

export function getSelectedProductByIdAction(URL: string, modelId: number) {
  return (dispatch: DispatchType, getState: any) => {
    const { ProductReducer } = getState();

    if (ProductReducer.loading === true) return false;
    dispatch(ProductLoading());
    const db = new useHttp();

    db.get(URL + modelId)
      .then((result: any) => {
        if (result) {
          const action: any = {
            type: PRODUCT_GET,
            payLoad: {
              product: result?.data,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: PRODUCT_GET,
            payLoad: {
              product: "",
            },
          };
          dispatch(action);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(ProductLoading(false));
      });
  };
}

export const updateProductPaginationAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { page, per_page } = paginationData;
    dispatch({
      type: PRODUCT_PAGNIATION_UPDATE,
      payLoad: { page: page, per_page: per_page },
    });
};

export const updateProductPaginationFilterAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { filter, page, per_page, sort } = paginationData;
    dispatch({
      type: PRODUCT_PAGNIATION_UPDATE,
      payLoad: { filter: filter, page: page, per_page: per_page, sort: sort },
    });
};

export function changeLayoutAction(layoutStyle: any) {
  return (dispatch: DispatchType) => {
    dispatch({
      type: PRODUCT_LAYOUT_STYLE,
      payLoad: { layoutStyle },
    });
  };
}

export const updateProductIsInitialTableDataLoadedAction = (status: boolean) => (
  dispatch: DispatchType
) => {
  
    dispatch({
      type: PRODUCT_IS_INITIAL_TABLE_DATA_LOADED_UPDATE,
      payLoad: { isInitialTableDataLoaded: status },
    });

};
