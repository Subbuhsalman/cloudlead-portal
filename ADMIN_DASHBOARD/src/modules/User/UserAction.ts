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

import { findIndex } from "lodash";
import { useHttp } from "@/hooks";
import { GLOBAL_TOAST } from "@/store/types";

const UserLoading = (status = true) => {
  const payLoad = status
    ? { loading: true, error: false, success: null }
    : { loading: false };
  const action: any = {
    type: USER_LOADING,
    payLoad,
  };
  return action;
};

const UserSubmit = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: USER_FORM_SUBMIT,
    payLoad,
  };
  return action;
};

const UserHttpRequest = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: USER_FORM_HTTP_REQUEST,
    payLoad,
  };
  return action;
};

export function getPaginatedUserListAction(URL: string) {
  return (dispatch: DispatchType, getState: any) => {
    const { UserReducer } = getState();
    const { page, per_page, filter, sort } = UserReducer;
    if (UserReducer.loading === true) return false;
    dispatch(UserLoading());
    const db = new useHttp();

    // Build query parameters properly
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('per_page', per_page.toString());
    if (filter && typeof filter === 'string') {
      queryParams.append('filter', filter);
    }
    if (sort) {
      queryParams.append('sort', sort);
    }
    
    db.get(URL + `?${queryParams.toString()}`)
      .then((result: any) => {
        const { list, pagination } = result.data;
        if (list?.length > 0) {
          const { currentPage, per_page, totalPages, totalRecords } = pagination;
          const action: any = {
            type: USER_GET_PAGINATED_LIST,
            payLoad: {
              list: list,
              count: list.length,
              total_records: totalRecords,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: USER_GET_PAGINATED_LIST,
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
        dispatch(UserLoading(false));
      });
  };
}

export function getSelectedUserByIdAction(URL: string, modelId: number) {
  return (dispatch: DispatchType, getState: any) => {
    const { UserReducer } = getState();

    if (UserReducer.loading === true) return false;
    dispatch(UserLoading());
    const db = new useHttp();

    db.get(URL + modelId)
      .then((result: any) => {
        if (result) {
          const action: any = {
            type: USER_GET,
            payLoad: {
              user: result?.data?.data,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: USER_GET,
            payLoad: {
              user: "",
            },
          };
          dispatch(action);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(UserLoading(false));
      });
  };
}

export function addCreditsToUserAction(url: string, userId: number, credits: number) {
  return (dispatch: DispatchType, getState: any) => {
    dispatch(UserSubmit());
    const db = new useHttp();
    const formData = { credits };
    
    db.post(url + userId, formData)
      .then((res: any) => {
        if (res.status === 200) {
          dispatch({
            type: GLOBAL_TOAST,
            payLoad: {
              showToast: true,
              toastMessage: res.data.message || "Credits added successfully",
              toastDetail: null,
              toastType: "success",
            },
          });
        }
      })
      .catch((err: any) => {
        dispatch({
          type: GLOBAL_TOAST,
          payLoad: {
            showToast: true,
            toastMessage: "Failed to add credits",
            toastDetail: null,
            toastType: "error",
          },
        });
      })
      .finally(() => {
        dispatch(UserLoading(false));
        dispatch(UserSubmit(false));
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

export const updateUserPaginationAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { page, per_page } = paginationData;
  dispatch({
    type: USER_PAGNIATION_UPDATE,
    payLoad: { page: page, per_page: per_page },
  });
};

export const updateUserPaginationFilterAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { filter, page, per_page, sort } = paginationData;
  dispatch({
    type: USER_PAGNIATION_UPDATE,
    payLoad: { filter: filter, page: page, per_page: per_page, sort: sort },
  });
};

export function changeLayoutAction(layoutStyle: any) {
  return (dispatch: DispatchType) => {
    dispatch({
      type: USER_LAYOUT_STYLE,
      payLoad: { layoutStyle },
    });
  };
}

export const updateUserIsInitialTableDataLoadedAction = (status: boolean) => (
  dispatch: DispatchType
) => {
  dispatch({
    type: USER_IS_INITIAL_TABLE_DATA_LOADED_UPDATE,
    payLoad: { isInitialTableDataLoaded: status },
  });
};
