import {
  APPLICATION_ERROR_LOADING,
  APPLICATION_ERROR_FORM_SUBMIT,
  APPLICATION_ERROR_ADD,
  APPLICATION_ERROR_DELETE,
  APPLICATION_ERROR_PAGNIATION_UPDATE,
  APPLICATION_ERROR_GET_PAGINATED_LIST,
  APPLICATION_ERROR_GET,
  APPLICATION_ERROR_LAYOUT_STYLE,
  APPLICATION_ERROR_UPDATE,
  APPLICATION_ERROR_FORM_HTTP_REQUEST,
  APPLICATION_ERROR_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./ApplicationErrorTypes";
import { findIndex } from "lodash";
import { useHttp } from "@/hooks";
import { GLOBAL_TOAST } from "@/store/types/actionTypes";
const ApplicationErrorLoading = (status = true) => {
  const payLoad = status
    ? { loading: true, error: false, success: null }
    : { loading: false };
  const action: any = {
    type: APPLICATION_ERROR_LOADING,
    payLoad,
  };
  return action;
};

const ApplicationErrorSubmit = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: APPLICATION_ERROR_FORM_SUBMIT,
    payLoad,
  };
  return action;
};

const ApplicationErrorHttpRequest = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: APPLICATION_ERROR_FORM_HTTP_REQUEST,
    payLoad,
  };
  return action;
};
export function addApplicationErrorAction(url: string, formData: object, resetForm: () => void,isSaveAndExit:boolean, showSideBar: (status:boolean) => void) {
  return async (dispatch: DispatchType, getState: any) => {
    const { ApplicationErrorReducer } = getState();
    const { total_records } = ApplicationErrorReducer;

    dispatch(ApplicationErrorSubmit());
    const db = new useHttp();

    try {
      dispatch(ApplicationErrorLoading());
      const res = await db.post(url, formData) as any
      const { data } = res;
    

        resetForm();
        const action: any = {
          type: APPLICATION_ERROR_ADD,
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
      dispatch(ApplicationErrorLoading(false));
      dispatch(ApplicationErrorSubmit(false));
    }
   
  };
}

export function updateApplicationErrorAction(
  url: string,
  modelId: number,
  formData: object,
  resetForm: () => void,
  isSaveAndExit:boolean, 
  showSideBar: (status:boolean) => void
) {
  return async (dispatch: DispatchType, getState: any) => {
    const { ApplicationErrorReducer } = getState();
    const { list } = ApplicationErrorReducer;
    const listIndex = findIndex(list, function (listItem: any) {
      return listItem.application_error_id === modelId;
    });
    dispatch(ApplicationErrorSubmit());
    const db = new useHttp();

    try {
      const res = await db.put(`${url}${modelId}`, formData) as any
      if (res.status === 200) {
        const record  = res.data;
        resetForm();
        const action: any = {
          type: APPLICATION_ERROR_UPDATE,
          payLoad: { record, listIndex },
        };
        const updateAction: any = {
          type: APPLICATION_ERROR_GET,
          payLoad: {
            applicationError: record,
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
      dispatch(ApplicationErrorLoading(false));
      dispatch(ApplicationErrorSubmit(false));
    }
  
  };
}

export function clearApplicationErrorDataAction() {
  return (dispatch: DispatchType, getState: any) => {
    const action: any = {
      type: APPLICATION_ERROR_GET,
      payLoad: {
        applicationError: null,
      },
    };
    dispatch(action);
  };
}

export function deleteApplicationErrorAction(url: string, data: any) {
  return (dispatch: DispatchType, getState: any) => {
    const { ApplicationErrorReducer } = getState();
    const { total_records } = ApplicationErrorReducer;

    dispatch(ApplicationErrorLoading());
    const db = new useHttp();
    try {
      const res = db.delete(`${url}${data.application_error_id}`) as any
      if (res.status === 200) {
        const action: any = {
          type: APPLICATION_ERROR_DELETE,
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
      dispatch(ApplicationErrorLoading(false));
          dispatch(ApplicationErrorSubmit(false));
    }
    
  };
}

export function getPaginatedApplicationErrorListAction(URL: string) {
  return async (dispatch: DispatchType, getState: any) => {
    const { ApplicationErrorReducer } = getState();
    const { page, per_page, filter, sort } = ApplicationErrorReducer;
    if (ApplicationErrorReducer.loading === true) return false;
    dispatch(ApplicationErrorLoading());
    const db = new useHttp();

    try {
      const res = await db.get(
        URL + `?page=${page}&per_page=${per_page}&filter=${filter}&sort=${sort}`
      ) as any
      const { list, pagination } = res.data;
      if (list?.length > 0) {
        const action: any = {
          type: APPLICATION_ERROR_GET_PAGINATED_LIST,
          payLoad: {
            list: list,
            count: list.length,
            total_records: pagination.totalRecords,
          },
        };
        dispatch(action);
      } else {
        const action: any = {
          type: APPLICATION_ERROR_GET_PAGINATED_LIST,
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
      dispatch(ApplicationErrorLoading(false));
    }
    
  };
}

export function getSelectedApplicationErrorByIdAction(URL: string, modelId: number) {
  return (dispatch: DispatchType, getState: any) => {
    const { ApplicationErrorReducer } = getState();

    if (ApplicationErrorReducer.loading === true) return false;
    dispatch(ApplicationErrorLoading());
    const db = new useHttp();

    db.get(URL + modelId)
      .then((result: any) => {
        if (result) {
          const action: any = {
            type: APPLICATION_ERROR_GET,
            payLoad: {
              applicationError: result?.data,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: APPLICATION_ERROR_GET,
            payLoad: {
              applicationError: "",
            },
          };
          dispatch(action);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(ApplicationErrorLoading(false));
      });
  };
}

export const updateApplicationErrorPaginationAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { page, per_page } = paginationData;
    dispatch({
      type: APPLICATION_ERROR_PAGNIATION_UPDATE,
      payLoad: { page: page, per_page: per_page },
    });
};

export const updateApplicationErrorPaginationFilterAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { filter, page, per_page, sort } = paginationData;
    dispatch({
      type: APPLICATION_ERROR_PAGNIATION_UPDATE,
      payLoad: { filter: filter, page: page, per_page: per_page, sort: sort },
    });
};

export function changeLayoutAction(layoutStyle: any) {
  return (dispatch: DispatchType) => {
    dispatch({
      type: APPLICATION_ERROR_LAYOUT_STYLE,
      payLoad: { layoutStyle },
    });
  };
}

export const updateApplicationErrorIsInitialTableDataLoadedAction = (status: boolean) => (
  dispatch: DispatchType
) => {
  
    dispatch({
      type: APPLICATION_ERROR_IS_INITIAL_TABLE_DATA_LOADED_UPDATE,
      payLoad: { isInitialTableDataLoaded: status },
    });

};
