import {
  ADMIN_USER_LOADING,
  ADMIN_USER_FORM_SUBMIT,
  ADMIN_USER_ADD,
  ADMIN_USER_DELETE,
  ADMIN_USER_PAGNIATION_UPDATE,
  ADMIN_USER_GET_PAGINATED_LIST,
  ADMIN_USER_GET,
  ADMIN_USER_LAYOUT_STYLE,
  ADMIN_USER_UPDATE,
  ADMIN_USER_FORM_HTTP_REQUEST,
  ADMIN_USER_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./AdminUserTypes";

import { findIndex } from "lodash";
import { useHttp } from "@/hooks";
import { GLOBAL_TOAST } from "@/store/types";

const AdminUserLoading = (status = true) => {
  const payLoad = status
    ? { loading: true, error: false, success: null }
    : { loading: false };
  const action: any = {
    type: ADMIN_USER_LOADING,
    payLoad,
  };
  return action;
};

const AdminUserSubmit = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: ADMIN_USER_FORM_SUBMIT,
    payLoad,
  };
  return action;
};

const AdminUserHttpRequest = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: ADMIN_USER_FORM_HTTP_REQUEST,
    payLoad,
  };
  return action;
};
export function addAdminUserAction(url: string, formData: object, resetForm: () => void,isSaveAndExit:boolean, showSideBar: (status:boolean) => void) {
  return (dispatch: DispatchType, getState: any) => {
    const { AdminUserReducer } = getState();
    const { total_records } = AdminUserReducer;

    dispatch(AdminUserSubmit());
    const db = new useHttp();
    db.post(url, formData)
      .then((res: any) => {
        const { record } = res.data;

        if (res.status === 200) {

          resetForm();
          const action: any = {
            type: ADMIN_USER_ADD,
            payLoad: record,
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
          } else {
            // Close sidebar after successful creation/update
            setTimeout(() => {
              showSideBar(false);
            }, 1000);
          }
        }
      })
      .finally(() => {
        dispatch(AdminUserLoading(false));
        dispatch(AdminUserSubmit(false));
   
          dispatch({
            type: GLOBAL_TOAST,
            payLoad: {
              showToast: false,
              toastMessage: null,
              toastDetail: null,
              toastType: "success",
            },
          });
       
      });
  };
}

export function updateAdminUserAction(
  url: string,
  modelId: number,
  formData: object,
  resetForm: () => void,
  isSaveAndExit:boolean, 
  showSideBar: (status:boolean) => void
) {
  return (dispatch: DispatchType, getState: any) => {
    const { AdminUserReducer } = getState();
    const { list } = AdminUserReducer;
    const listIndex = findIndex(list, function (listItem: any) {
      return listItem.admin_user_id === modelId;
    });
    dispatch(AdminUserSubmit());
    const db = new useHttp();
    db.put(`${url}${modelId}`, formData)
      .then((res: any) => {
        const { record } = res.data;

        if (res.status === 200) {
          resetForm();
          const action: any = {
            type: ADMIN_USER_UPDATE,
            payLoad: { record, listIndex },
          };
          const updateAction: any = {
            type: ADMIN_USER_GET,
            payLoad: {
              adminUser: record,
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
                toastMessage: res.data.message,
                toastDetail: null,
                toastType: "success",
              },
            });
          
          if(isSaveAndExit){
            showSideBar(false)
          } else {
            // Close sidebar after successful update
            setTimeout(() => {
              showSideBar(false);
            }, 1000);
          }

        }
      })
      .finally(() => {
      
          dispatch(AdminUserLoading(false));
          dispatch(AdminUserSubmit(false));
          /**
           * For Global toast hide
           */
          dispatch({
            type: GLOBAL_TOAST,
            payLoad: {
              showToast: false,
              toastMessage: null,
              toastDetail: null,
              toastType: "success",
            },
          });
    
      });
  };
}

export function clearAdminUserDataAction() {
  return (dispatch: DispatchType, getState: any) => {
    const action: any = {
      type: ADMIN_USER_GET,
      payLoad: {
        adminUser: null,
      },
    };
    dispatch(action);
  };
}

export function deleteAdminUserAction(url: string, data: any) {
  return (dispatch: DispatchType, getState: any) => {
    const { AdminUserReducer } = getState();
    const { total_records } = AdminUserReducer;

    dispatch(AdminUserLoading());
    const db = new useHttp();
    db.delete(`${url}${data.admin_user_id}`)
      .then((res: any) => {
        if (res.status === 200) {
          const action: any = {
            type: ADMIN_USER_DELETE,
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
      })
      .finally(() => {
       
          dispatch(AdminUserLoading(false));
          dispatch(AdminUserSubmit(false));
          dispatch({
            type: GLOBAL_TOAST,
            payLoad: {
              showToast: false,
              toastMessage: null,
              toastDetail: null,
              toastType: "success",
            },
          });
       
      });
  };
}

export function getPaginatedAdminUserListAction(URL: string) {
  return (dispatch: DispatchType, getState: any) => {
    const { AdminUserReducer } = getState();
    const { page, per_page, filter, sort } = AdminUserReducer;
    if (AdminUserReducer.loading === true) return false;
    dispatch(AdminUserLoading());
    const db = new useHttp();

    db.get(
      URL + `?page=${page}&per_page=${per_page}&filter=${filter}&sort=${sort}`
    )
      .then((result: any) => {
        const { list , pagination} = result.data;
        if (list?.length > 0) {

          const { currentPage, per_page,totalPages,totalRecords } = pagination;
          const action: any = {
            type: ADMIN_USER_GET_PAGINATED_LIST,
            payLoad: {
              list: list,
              count: list.length,
              total_records: totalRecords,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: ADMIN_USER_GET_PAGINATED_LIST,
            payLoad: {
              list: [],
              count: 0,
              total_records: 0,
            },
          };
          dispatch(action);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(AdminUserLoading(false));
      });
  };
}

export function getSelectedAdminUserByIdAction(URL: string, modelId: number) {
  return (dispatch: DispatchType, getState: any) => {
    const { AdminUserReducer } = getState();

    if (AdminUserReducer.loading === true) return false;
    dispatch(AdminUserLoading());
    const db = new useHttp();

    db.get(URL + modelId)
      .then((result: any) => {
        if (result) {
          const action: any = {
            type: ADMIN_USER_GET,
            payLoad: {
              adminUser: result?.data?.data,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: ADMIN_USER_GET,
            payLoad: {
              adminUser: "",
            },
          };
          dispatch(action);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(AdminUserLoading(false));
      });
  };
}

export const updateAdminUserPaginationAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { page, per_page } = paginationData;
    dispatch({
      type: ADMIN_USER_PAGNIATION_UPDATE,
      payLoad: { page: page, per_page: per_page },
    });
};

export const updateAdminUserPaginationFilterAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { filter, page, per_page, sort } = paginationData;
    dispatch({
      type: ADMIN_USER_PAGNIATION_UPDATE,
      payLoad: { filter: filter, page: page, per_page: per_page, sort: sort },
    });
};

export function changeLayoutAction(layoutStyle: any) {
  return (dispatch: DispatchType) => {
    dispatch({
      type: ADMIN_USER_LAYOUT_STYLE,
      payLoad: { layoutStyle },
    });
  };
}

export const updateAdminUserIsInitialTableDataLoadedAction = (status: boolean) => (
  dispatch: DispatchType
) => {
  
    dispatch({
      type: ADMIN_USER_IS_INITIAL_TABLE_DATA_LOADED_UPDATE,
      payLoad: { isInitialTableDataLoaded: status },
    });
};
