import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  updateGlobalAlignment,
  toastUpdate
} from "@/store/actions";
import { Dispatch } from "redux";


const useGlobalHook = (props?: any) => {
  const globalLanguages = useSelector(
    (state: any) => state.GlobalReducer.languages,
    shallowEqual
  );

  const globalIsAlignmentRight = useSelector(
    (state: any) => state.GlobalReducer.isAlignmentRight,
    shallowEqual
  );
  const getRightHandLanguges = useSelector(
    (state: any) => state.GlobalReducer.rightHandLanguges,
    shallowEqual
  );
  const globalChunkFileSize = useSelector(
    (state: any) => state.GlobalReducer.chunkFileSize,
    shallowEqual
  );


  const toastId = useSelector(
    (state: any) => state.GlobalReducer.toastId,
    shallowEqual
  );

  const showToast = useSelector(
    (state: any) => state.GlobalReducer.showToast,
    shallowEqual
  );
  const toastMessage = useSelector(
    (state: any) => state.GlobalReducer.toastMessage,
    shallowEqual
  );
  
  const closable = useSelector(
    (state: any) => state.GlobalReducer.closable,
    shallowEqual
  );
  const toastDetail = useSelector(
    (state: any) => state.GlobalReducer.toastDetail,
    shallowEqual
  );
  const toastType = useSelector(
    (state: any) => state.GlobalReducer.toastType,
    shallowEqual
  );
  const toastLife = useSelector(
    (state: any) => state.GlobalReducer.toastLife,
    shallowEqual
  );
  const sticky = useSelector(
    (state: any) => state.GlobalReducer.sticky,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();

  const updateAppAlignmentGlobaly = React.useCallback(
    (data:any) => dispatch(updateGlobalAlignment(data)),
    [dispatch]
  );

  const updateGlobalToast = React.useCallback(
    (data: any) => dispatch(toastUpdate(data)),
    [dispatch]
  );

  return {
    globalIsAlignmentRight,
    toastId,
    showToast,
    toastMessage,
    // closable,
    toastDetail,
    toastType,
    toastLife,
    sticky,
    globalChunkFileSize,
    globalLanguages,
    updateAppAlignmentGlobaly,
    updateGlobalToast,
    getRightHandLanguges
  };
};
export { useGlobalHook };
