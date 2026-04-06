import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  addApplicationErrorAction,
  updateApplicationErrorAction,
  getPaginatedApplicationErrorListAction,
  updateApplicationErrorPaginationAction,
  updateApplicationErrorPaginationFilterAction,
  deleteApplicationErrorAction,
  getSelectedApplicationErrorByIdAction,
  changeLayoutAction,
  clearApplicationErrorDataAction,
  updateApplicationErrorIsInitialTableDataLoadedAction
} from "./ApplicationErrorAction";
import { Dispatch } from "redux";
import { default as EndPoints } from "./ApplicationErrorEndPoints.json";

const useApplicationErrorHook = (props?: any) => {
  const getPaginatedApplicationErrorListFromStore = useSelector(
    (state: any) => state.ApplicationErrorReducer.list,
    shallowEqual
  );

  const getApplicationErrorByIdFromStore = useSelector(
    (state: any) => state.ApplicationErrorReducer.applicationError,
    shallowEqual
  );

  const ApplicationErrorList = useSelector(
    (state: any) => state.ApplicationErrorReducer.menuList,
    shallowEqual
  );
  const ApplicationErrorLoading = useSelector(
    (state: any) => state.ApplicationErrorReducer.loading,
    shallowEqual
  );
  const ApplicationErrorSubmit = useSelector(
    (state: any) => state.ApplicationErrorReducer.submitting,
    shallowEqual
  );
  const ApplicationErrorHTTPRequest = useSelector(
    (state: any) => state.ApplicationErrorReducer.httpRequest,
    shallowEqual
  );
  const ApplicationErrorFilter = useSelector(
    (state: any) => state.ApplicationErrorReducer.filter,
    shallowEqual
  );
  const ApplicationErrorSort = useSelector(
    (state: any) => state.ApplicationErrorReducer.sort,
    shallowEqual
  );
  const ApplicationErrorPage = useSelector(
    (state: any) => state.ApplicationErrorReducer.page,
    shallowEqual
  );
  const ApplicationErrorPerPage = useSelector(
    (state: any) => state.ApplicationErrorReducer.per_page,
    shallowEqual
  );
  const ApplicationErrorTotalRecords = useSelector(
    (state: any) => state.ApplicationErrorReducer.total_records,
    shallowEqual
  );

  const ApplicationErrorIsAdded = useSelector(
    (state: any) => state.ApplicationErrorReducer?.success,
    shallowEqual
  );

  const ApplicationErrorIsCreated = useSelector(
    (state: any) => state.ApplicationErrorReducer.isCreated,
    shallowEqual
  );

  const ApplicationErrorLayoutType = useSelector(
    (state: any) => state.ApplicationErrorReducer.layoutStyle,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();

  const changeApplicationErrorLayoutType = React.useCallback(
    (layoutStyle: any) => dispatch(changeLayoutAction(layoutStyle)),
    [dispatch]
  );

  const saveForm = React.useCallback(
    (formData: object, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(addApplicationErrorAction(EndPoints.addApplicationError, formData, resetForm,isSaveExit,showSideBar)),
    [dispatch]
  );
  const updateForm = React.useCallback(
    (ApplicationErrorId: any, data: any, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(
        updateApplicationErrorAction(EndPoints.updateApplicationError, ApplicationErrorId, data, resetForm, isSaveExit,showSideBar)
      ),
    [dispatch]
  );
  const getPaginatedApplicationErrorList = React.useCallback(
    () =>
      dispatch(getPaginatedApplicationErrorListAction(EndPoints.getPaginatedApplicationErrorList)),
    [dispatch]
  );

  const getSelectedApplicationErrorById = React.useCallback(
    (ApplicationErrorId: any) =>
      dispatch(
        getSelectedApplicationErrorByIdAction(EndPoints.getSelectedApplicationErrorById, ApplicationErrorId)
      ),
    [dispatch]
  );

  const deleteForm = React.useCallback(
    (rowItem: any) =>
      dispatch(deleteApplicationErrorAction(EndPoints.deleteApplicationError, rowItem)),
    [dispatch]
  );

  const clearApplicationErrorDataHook = React.useCallback(
    () => dispatch(clearApplicationErrorDataAction()),
    [dispatch]
  );

  const updateApplicationErrorPaginated = (sorting: any) =>
    dispatch(updateApplicationErrorPaginationAction(sorting));

  const updateApplicationErrorPaginationFilterSearch = (paginationData: any) =>
    dispatch(updateApplicationErrorPaginationFilterAction(paginationData));

    const updateApplicationErrorIsInitialTableDataLoaded = (status: boolean) =>
    dispatch(updateApplicationErrorIsInitialTableDataLoadedAction(status));

  return {
    ApplicationErrorList,
    getPaginatedApplicationErrorListFromStore,
    ApplicationErrorLoading,
    ApplicationErrorSubmit,
    ApplicationErrorHTTPRequest,
    ApplicationErrorFilter,
    ApplicationErrorSort,
    ApplicationErrorPage,
    ApplicationErrorPerPage,
    ApplicationErrorTotalRecords,
    ApplicationErrorIsAdded,
    ApplicationErrorIsCreated,
    getPaginatedApplicationErrorList,
    saveForm,
    updateForm,
    updateApplicationErrorPaginated,
    updateApplicationErrorPaginationFilterSearch,
    deleteForm,
    getApplicationErrorByIdFromStore,
    getSelectedApplicationErrorById,
    changeApplicationErrorLayoutType,
    ApplicationErrorLayoutType,
    clearApplicationErrorDataHook,
    updateApplicationErrorIsInitialTableDataLoaded,
  };
};
export { useApplicationErrorHook };
