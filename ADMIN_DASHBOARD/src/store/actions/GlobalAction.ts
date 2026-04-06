import {
  UPDATE_APP_ALIGNMENT,
  GLOBAL_TOAST
} from "../types/actionTypes";


export function updateGlobalAlignment(data: any) {
  return (dispatch: any) => {
    dispatch({
      type: UPDATE_APP_ALIGNMENT,
      payLoad: {
        isAlignmentRight: data
      },
    });
  };
}


export function toastUpdate(toastData: any) {
  return (dispatch: any) => {
    dispatch({
      type: GLOBAL_TOAST,
      payLoad: {...toastData},
    });

    // setTimeout(() => {
    //   dispatch({
    //     type: GLOBAL_TOAST,
    //     payLoad: {
    //       showToast: false
    //     },
    //   });
    // }, 2000);

  };
}
