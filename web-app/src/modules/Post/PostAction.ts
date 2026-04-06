import { Dispatch } from 'redux';
import {
  POST_LOADING,
  POST_FORM_SUBMIT,
  POST_ADD,
  POST_DELETE,
  POST_PAGNIATION_UPDATE,
  POST_GET_PAGINATED_LIST,
  POST_GET,
  POST_LAYOUT_STYLE,
  POST_UPDATE,
  POST_FORM_HTTP_REQUEST,
  POST_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./PostTypes";
import { findIndex } from "lodash";
import { useHttp } from "@/hooks";
import { GLOBAL_TOAST } from "@/store/types";
const PostLoading = (status = true) => {
  const payLoad = status
    ? { loading: true, error: false, success: null }
    : { loading: false };
  const action: any = {
    type: POST_LOADING,
    payLoad,
  };
  return action;
};

const PostSubmit = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: POST_FORM_SUBMIT,
    payLoad,
  };
  return action;
};

const PostHttpRequest = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: POST_FORM_HTTP_REQUEST,
    payLoad,
  };
  return action;
};
export function addPostAction(url: string, formData: object, resetForm: () => void, isSaveAndExit: boolean, showSideBar: (status: boolean) => void) {
  return (dispatch: Dispatch<any>, getState: any) => {
    const { PostReducer } = getState();
    const { total_records } = PostReducer;

    dispatch(PostSubmit());
    const db = new useHttp();
    db.post(url, formData)
      .then((res: any) => {
        const data = res.data;

        if (res.status === 201) {

          resetForm();
          const action: any = {
            type: POST_ADD,
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

          if (isSaveAndExit) {
            showSideBar(false)
          }
        }
      })
      .finally(() => {
        dispatch(PostLoading(false));
        dispatch(PostSubmit(false));

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

export function updatePostAction(
  url: string,
  modelId: number,
  formData: object,
  resetForm: () => void,
  isSaveAndExit: boolean,
  showSideBar: (status: boolean) => void
) {
  return (dispatch: Dispatch<any>, getState: any) => {
    const { PostReducer } = getState();
    const { list } = PostReducer;
    const listIndex = findIndex(list, function (listItem: any) {
      return listItem.post_id === modelId;
    });
    dispatch(PostSubmit());
    const db = new useHttp();
    db.put(`${url}${modelId}`, formData)
      .then((res: any) => {
        const   record = res.data;

        if (res.status === 200) {
          resetForm();
          const action: any = {
            type: POST_UPDATE,
            payLoad: { record, listIndex },
          };
          const updateAction: any = {
            type: POST_GET,
            payLoad: {
              post: record,
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

          if (isSaveAndExit) {
            showSideBar(false)
          }

        }
      })
      .finally(() => {

        dispatch(PostLoading(false));
        dispatch(PostSubmit(false));
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

export function clearPostDataAction() {
  return (dispatch: Dispatch<any>, getState: any) => {
    const action: any = {
      type: POST_GET,
      payLoad: {
        post: null,
      },
    };
    dispatch(action);
  };
}

export function deletePostAction(url: string, data: any) {
  return (dispatch: Dispatch<any>, getState: any) => {
    const { PostReducer } = getState();
    const { total_records } = PostReducer;

    dispatch(PostLoading());
    const db = new useHttp();
    db.delete(`${url}${data.post_id}`)
      .then((res: any) => {
        if (res.status === 200) {
          const action: any = {
            type: POST_DELETE,
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

        dispatch(PostLoading(false));
        dispatch(PostSubmit(false));
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

export function getPaginatedPostListAction(URL: string, status: string) {
  return (dispatch: Dispatch<any>, getState: any) => {
    const { PostReducer } = getState();
    const { page, per_page, filter, sort } = PostReducer;
    if (PostReducer.loading === true) return false;
    dispatch(PostLoading());
    const db = new useHttp();

    db.get(
      URL + `?page=${page}&per_page=${per_page}&filter=${filter}&sort=${sort}&status=${status}`
    )
      .then((result: any) => {
        const { list, pagination } = result.data;
        if (list?.length > 0) {

          const { currentPage, per_page, totalPages, totalRecords } = pagination;
          const action: any = {
            type: POST_GET_PAGINATED_LIST,
            payLoad: {
              list: list,
              count: list.length,
              total_records: totalRecords,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: POST_GET_PAGINATED_LIST,
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
        dispatch(PostLoading(false));
      });
  };
}

export function getPaginatedPostListCalendarAction(URL: string, filters:any) {
  return (dispatch: Dispatch<any>, getState: any) => {
    const { PostReducer } = getState();
    const { page, per_page, filter, sort } = PostReducer;
    if (PostReducer.loading === true) return false;
    dispatch(PostLoading());
    const db = new useHttp();

    db.get(
      URL + `?page=${page}&per_page=${per_page}&filter=${filter}&sort=${sort}&filters=${JSON.stringify(filters)}`
    )
      .then((result: any) => {
        const { list, pagination } = result.data;
        if (list?.length > 0) {

          const {totalRecords } = pagination;
          const action: any = {
            type: POST_GET_PAGINATED_LIST,
            payLoad: {
              calendarList: list,
              count: list.length,
              total_records: totalRecords,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: POST_GET_PAGINATED_LIST,
            calendarList: {
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
        dispatch(PostLoading(false));
      });
  };
}

export function getSelectedPostByIdAction(URL: string, modelId: number) {
  return (dispatch: Dispatch<any>, getState: any) => {
    const { PostReducer } = getState();

    if (PostReducer.loading === true) return false;
    dispatch(PostLoading());
    const db = new useHttp();

    db.get(URL + modelId)
      .then((result: any) => {
        if (result) {
          const action: any = {
            type: POST_GET,
            payLoad: {
              post: result?.data,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: POST_GET,
            payLoad: {
              post: "",
            },
          };
          dispatch(action);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(PostLoading(false));
      });
  };
}

export const updatePostPaginationAction = (paginationData: any) => (
  dispatch: Dispatch<any>
) => {
  const { page, per_page } = paginationData;
  dispatch({
    type: POST_PAGNIATION_UPDATE,
    payLoad: { page: page, per_page: per_page },
  });
};

export const updatePostPaginationFilterAction = (paginationData: any) => (
  dispatch: Dispatch<any>
) => {
  const { filter, page, per_page, sort } = paginationData;
  dispatch({
    type: POST_PAGNIATION_UPDATE,
    payLoad: { filter: filter, page: page, per_page: per_page, sort: sort },
  });
};

export function changeLayoutAction(layoutStyle: any) {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: POST_LAYOUT_STYLE,
      payLoad: { layoutStyle },
    });
  };
}

export const updatePostIsInitialTableDataLoadedAction = (status: boolean) => (
  dispatch: Dispatch<any>
) => {

  dispatch({
    type: POST_IS_INITIAL_TABLE_DATA_LOADED_UPDATE,
    payLoad: { isInitialTableDataLoaded: status },
  });

};
