import { Dispatch } from 'redux';
import {
  GALLERY_LOADING,
  GALLERY_FORM_SUBMIT,
  GALLERY_ADD,
  GALLERY_DELETE,
  GALLERY_PAGNIATION_UPDATE,
  GALLERY_GET_PAGINATED_LIST,
  GALLERY_GET,
  GALLERY_LAYOUT_STYLE,
  GALLERY_UPDATE,
  GALLERY_FORM_HTTP_REQUEST,
  GALLERY_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./GalleryTypes";
import { findIndex } from "lodash";
import { useHttp } from "@/hooks";
import { GLOBAL_TOAST } from "@/store/types";
const GalleryLoading = (status = true) => {
  const payLoad = status
    ? { loading: true, error: false, success: null }
    : { loading: false };
  const action: any = {
    type: GALLERY_LOADING,
    payLoad,
  };
  return action;
};

const GallerySubmit = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: GALLERY_FORM_SUBMIT,
    payLoad,
  };
  return action;
};

const GalleryHttpRequest = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: GALLERY_FORM_HTTP_REQUEST,
    payLoad,
  };
  return action;
};
export function addGalleryAction(url: string, formData: object, resetForm: () => void, isSaveAndExit: boolean, showSideBar: (status: boolean) => void) {
  return (dispatch: Dispatch<any>, getState: any) => {
    const { GalleryReducer } = getState();
    const { total_records } = GalleryReducer;

    dispatch(GallerySubmit());
    const db = new useHttp();
    db.post(url, formData)
      .then((res: any) => {
        const data = res.data;

        if (res.status === 201) {

          resetForm();
          const action: any = {
            type: GALLERY_ADD,
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
        dispatch(GalleryLoading(false));
        dispatch(GallerySubmit(false));

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

export function updateGalleryAction(
  url: string,
  modelId: number,
  formData: object,
  resetForm: () => void,
  isSaveAndExit: boolean,
  showSideBar: (status: boolean) => void
) {
  return (dispatch: Dispatch<any>, getState: any) => {
    const { GalleryReducer } = getState();
    const { list } = GalleryReducer;
    const listIndex = findIndex(list, function (listItem: any) {
      return listItem.gallery_id === modelId;
    });
    dispatch(GallerySubmit());
    const db = new useHttp();
    db.put(`${url}${modelId}`, formData)
      .then((res: any) => {
        const   record = res.data;

        if (res.status === 200) {
          resetForm();
          const action: any = {
            type: GALLERY_UPDATE,
            payLoad: { record, listIndex },
          };
          const updateAction: any = {
            type: GALLERY_GET,
            payLoad: {
              gallery: record,
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

        dispatch(GalleryLoading(false));
        dispatch(GallerySubmit(false));
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

export function clearGalleryDataAction() {
  return (dispatch: Dispatch<any>, getState: any) => {
    const action: any = {
      type: GALLERY_GET,
      payLoad: {
        gallery: null,
      },
    };
    dispatch(action);
  };
}

export function deleteGalleryAction(url: string, data: any) {
  return (dispatch: Dispatch<any>, getState: any) => {
    const { GalleryReducer } = getState();
    const { total_records } = GalleryReducer;

    dispatch(GalleryLoading());
    const db = new useHttp();
    db.delete(`${url}${data.gallery_id}`)
      .then((res: any) => {
        if (res.status === 200) {
          const action: any = {
            type: GALLERY_DELETE,
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

        dispatch(GalleryLoading(false));
        dispatch(GallerySubmit(false));
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

export function getPaginatedGalleryListAction(URL: string) {
  return (dispatch: Dispatch<any>, getState: any) => {
    const { GalleryReducer } = getState();
    const { page, per_page, filter, sort } = GalleryReducer;
    if (GalleryReducer.loading === true) return false;
    dispatch(GalleryLoading());
    const db = new useHttp();

    db.get(
      URL + `?page=${page}&per_page=${per_page}&filter=${filter}&sort=${sort}`
    )
      .then((result: any) => {
        const { list, pagination } = result.data;
        if (list?.length > 0) {

          const { currentPage, per_page, totalPages, totalRecords } = pagination;
          const action: any = {
            type: GALLERY_GET_PAGINATED_LIST,
            payLoad: {
              list: list,
              count: list.length,
              total_records: totalRecords,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: GALLERY_GET_PAGINATED_LIST,
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
        dispatch(GalleryLoading(false));
      });
  };
}

export function getSelectedGalleryByIdAction(URL: string, modelId: number) {
  return (dispatch: Dispatch<any>, getState: any) => {
    const { GalleryReducer } = getState();

    if (GalleryReducer.loading === true) return false;
    dispatch(GalleryLoading());
    const db = new useHttp();

    db.get(URL + modelId)
      .then((result: any) => {
        if (result) {
          const action: any = {
            type: GALLERY_GET,
            payLoad: {
              gallery: result?.data,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: GALLERY_GET,
            payLoad: {
              gallery: "",
            },
          };
          dispatch(action);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(GalleryLoading(false));
      });
  };
}

export const updateGalleryPaginationAction = (paginationData: any) => (
  dispatch: Dispatch<any>
) => {
  const { page, per_page } = paginationData;
  dispatch({
    type: GALLERY_PAGNIATION_UPDATE,
    payLoad: { page: page, per_page: per_page },
  });
};

export const updateGalleryPaginationFilterAction = (paginationData: any) => (
  dispatch: Dispatch<any>
) => {
  const { filter, page, per_page, sort } = paginationData;
  dispatch({
    type: GALLERY_PAGNIATION_UPDATE,
    payLoad: { filter: filter, page: page, per_page: per_page, sort: sort },
  });
};

export function changeLayoutAction(layoutStyle: any) {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: GALLERY_LAYOUT_STYLE,
      payLoad: { layoutStyle },
    });
  };
}

export const updateGalleryIsInitialTableDataLoadedAction = (status: boolean) => (
  dispatch: Dispatch<any>
) => {

  dispatch({
    type: GALLERY_IS_INITIAL_TABLE_DATA_LOADED_UPDATE,
    payLoad: { isInitialTableDataLoaded: status },
  });

};
