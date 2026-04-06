import {
  POLICY_LOADING,
  POLICY_FORM_SUBMIT,
  POLICY_ADD,
  POLICY_DELETE,
  POLICY_PAGNIATION_UPDATE,
  POLICY_GET_PAGINATED_LIST,
  POLICY_GET,
  POLICY_LAYOUT_STYLE,
  POLICY_UPDATE,
  POLICY_FORM_HTTP_REQUEST,
  POLICY_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./PolicyTypes";
import { findIndex } from "lodash";
import { useHttp } from "@/hooks";
import { GLOBAL_TOAST } from "@/store/types/actionTypes";
const PolicyLoading = (status = true) => {
  const payLoad = status
    ? { loading: true, error: false, success: null }
    : { loading: false };
  const action: any = {
    type: POLICY_LOADING,
    payLoad,
  };
  return action;
};

const PolicySubmit = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: POLICY_FORM_SUBMIT,
    payLoad,
  };
  return action;
};

const PolicyHttpRequest = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: POLICY_FORM_HTTP_REQUEST,
    payLoad,
  };
  return action;
};
export function addPolicyAction(url: string, formData: object, resetForm: () => void,isSaveAndExit:boolean, showSideBar: (status:boolean) => void) {
  return async (dispatch: DispatchType, getState: any) => {
    const { PolicyReducer } = getState();
    const { total_records } = PolicyReducer;

    dispatch(PolicySubmit());
    const db = new useHttp();

    try {
      dispatch(PolicyLoading());
      const res = await db.post(url, formData) as any
      const { data } = res;
    

        resetForm();
        const action: any = {
          type: POLICY_ADD,
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
      dispatch(PolicyLoading(false));
      dispatch(PolicySubmit(false));
    }
   
  };
}

export function updatePolicyAction(
  url: string,
  modelId: number,
  formData: object,
  resetForm: () => void,
  isSaveAndExit:boolean, 
  showSideBar: (status:boolean) => void
) {
  return async (dispatch: DispatchType, getState: any) => {
    const { PolicyReducer } = getState();
    const { list } = PolicyReducer;
    const listIndex = findIndex(list, function (listItem: any) {
      return listItem.policy_id === modelId;
    });
    dispatch(PolicySubmit());
    const db = new useHttp();

    try {
      const res = await db.put(`${url}${modelId}`, formData) as any
      if (res.status === 200) {
        const record  = res.data;
        resetForm();
        const action: any = {
          type: POLICY_UPDATE,
          payLoad: { record, listIndex },
        };
        const updateAction: any = {
          type: POLICY_GET,
          payLoad: {
            policy: record,
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
      dispatch(PolicyLoading(false));
      dispatch(PolicySubmit(false));
    }
  
  };
}

export function clearPolicyDataAction() {
  return (dispatch: DispatchType, getState: any) => {
    const action: any = {
      type: POLICY_GET,
      payLoad: {
        policy: null,
      },
    };
    dispatch(action);
  };
}

export function deletePolicyAction(url: string, data: any) {
  return (dispatch: DispatchType, getState: any) => {
    const { PolicyReducer } = getState();
    const { total_records } = PolicyReducer;

    dispatch(PolicyLoading());
    const db = new useHttp();
    try {
      const res = db.delete(`${url}${data.policy_id}`) as any
      if (res.status === 200) {
        const action: any = {
          type: POLICY_DELETE,
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
      dispatch(PolicyLoading(false));
          dispatch(PolicySubmit(false));
    }
    
  };
}

export function getPaginatedPolicyListAction(URL: string) {
  return async (dispatch: DispatchType, getState: any) => {
    const { PolicyReducer } = getState();
    const { page, per_page, filter, sort } = PolicyReducer;
    if (PolicyReducer.loading === true) return false;
    dispatch(PolicyLoading());
    const db = new useHttp();

    try {
      const res = await db.get(
        URL + `?page=${page}&per_page=${per_page}&filter=${filter}&sort=${sort}`
      ) as any
      const { list, pagination } = res.data;
      if (list?.length > 0) {
        const action: any = {
          type: POLICY_GET_PAGINATED_LIST,
          payLoad: {
            list: list,
            count: list.length,
            total_records: pagination.totalRecords,
          },
        };
        dispatch(action);
      } else {
        const action: any = {
          type: POLICY_GET_PAGINATED_LIST,
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
      dispatch(PolicyLoading(false));
    }
    
  };
}

export function getSelectedPolicyByIdAction(URL: string, modelId: number) {
  return (dispatch: DispatchType, getState: any) => {
    const { PolicyReducer } = getState();

    if (PolicyReducer.loading === true) return false;
    dispatch(PolicyLoading());
    const db = new useHttp();

    db.get(URL + modelId)
      .then((result: any) => {
        if (result) {
          const action: any = {
            type: POLICY_GET,
            payLoad: {
              policy: result?.data,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: POLICY_GET,
            payLoad: {
              policy: "",
            },
          };
          dispatch(action);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(PolicyLoading(false));
      });
  };
}

export const updatePolicyPaginationAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { page, per_page } = paginationData;
    dispatch({
      type: POLICY_PAGNIATION_UPDATE,
      payLoad: { page: page, per_page: per_page },
    });
};

export const updatePolicyPaginationFilterAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { filter, page, per_page, sort } = paginationData;
    dispatch({
      type: POLICY_PAGNIATION_UPDATE,
      payLoad: { filter: filter, page: page, per_page: per_page, sort: sort },
    });
};

export function changeLayoutAction(layoutStyle: any) {
  return (dispatch: DispatchType) => {
    dispatch({
      type: POLICY_LAYOUT_STYLE,
      payLoad: { layoutStyle },
    });
  };
}

export const updatePolicyIsInitialTableDataLoadedAction = (status: boolean) => (
  dispatch: DispatchType
) => {
  
    dispatch({
      type: POLICY_IS_INITIAL_TABLE_DATA_LOADED_UPDATE,
      payLoad: { isInitialTableDataLoaded: status },
    });

};
