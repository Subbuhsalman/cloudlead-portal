import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  addPolicyAction,
  updatePolicyAction,
  getPaginatedPolicyListAction,
  updatePolicyPaginationAction,
  updatePolicyPaginationFilterAction,
  deletePolicyAction,
  getSelectedPolicyByIdAction,
  changeLayoutAction,
  clearPolicyDataAction,
  updatePolicyIsInitialTableDataLoadedAction
} from "./PolicyAction";
import { Dispatch } from "redux";
import { default as EndPoints } from "./PolicyEndPoints.json";

const usePolicyHook = (props?: any) => {
  const getPaginatedPolicyListFromStore = useSelector(
    (state: any) => state.PolicyReducer.list,
    shallowEqual
  );

  const getPolicyByIdFromStore = useSelector(
    (state: any) => state.PolicyReducer.policy,
    shallowEqual
  );

  const PolicyList = useSelector(
    (state: any) => state.PolicyReducer.menuList,
    shallowEqual
  );
  const PolicyLoading = useSelector(
    (state: any) => state.PolicyReducer.loading,
    shallowEqual
  );
  const PolicySubmit = useSelector(
    (state: any) => state.PolicyReducer.submitting,
    shallowEqual
  );
  const PolicyHTTPRequest = useSelector(
    (state: any) => state.PolicyReducer.httpRequest,
    shallowEqual
  );
  const PolicyFilter = useSelector(
    (state: any) => state.PolicyReducer.filter,
    shallowEqual
  );
  const PolicySort = useSelector(
    (state: any) => state.PolicyReducer.sort,
    shallowEqual
  );
  const PolicyPage = useSelector(
    (state: any) => state.PolicyReducer.page,
    shallowEqual
  );
  const PolicyPerPage = useSelector(
    (state: any) => state.PolicyReducer.per_page,
    shallowEqual
  );
  const PolicyTotalRecords = useSelector(
    (state: any) => state.PolicyReducer.total_records,
    shallowEqual
  );

  const PolicyIsAdded = useSelector(
    (state: any) => state.PolicyReducer?.success,
    shallowEqual
  );

  const PolicyIsCreated = useSelector(
    (state: any) => state.PolicyReducer.isCreated,
    shallowEqual
  );

  const PolicyLayoutType = useSelector(
    (state: any) => state.PolicyReducer.layoutStyle,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();

  const changePolicyLayoutType = React.useCallback(
    (layoutStyle: any) => dispatch(changeLayoutAction(layoutStyle)),
    [dispatch]
  );

  const saveForm = React.useCallback(
    (formData: object, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(addPolicyAction(EndPoints.addPolicy, formData, resetForm,isSaveExit,showSideBar)),
    [dispatch]
  );
  const updateForm = React.useCallback(
    (PolicyId: any, data: any, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(
        updatePolicyAction(EndPoints.updatePolicy, PolicyId, data, resetForm, isSaveExit,showSideBar)
      ),
    [dispatch]
  );
  const getPaginatedPolicyList = React.useCallback(
    () =>
      dispatch(getPaginatedPolicyListAction(EndPoints.getPaginatedPolicyList)),
    [dispatch]
  );

  const getSelectedPolicyById = React.useCallback(
    (PolicyId: any) =>
      dispatch(
        getSelectedPolicyByIdAction(EndPoints.getSelectedPolicyById, PolicyId)
      ),
    [dispatch]
  );

  const deleteForm = React.useCallback(
    (rowItem: any) =>
      dispatch(deletePolicyAction(EndPoints.deletePolicy, rowItem)),
    [dispatch]
  );

  const clearPolicyDataHook = React.useCallback(
    () => dispatch(clearPolicyDataAction()),
    [dispatch]
  );

  const updatePolicyPaginated = (sorting: any) =>
    dispatch(updatePolicyPaginationAction(sorting));

  const updatePolicyPaginationFilterSearch = (paginationData: any) =>
    dispatch(updatePolicyPaginationFilterAction(paginationData));

    const updatePolicyIsInitialTableDataLoaded = (status: boolean) =>
    dispatch(updatePolicyIsInitialTableDataLoadedAction(status));

  return {
    PolicyList,
    getPaginatedPolicyListFromStore,
    PolicyLoading,
    PolicySubmit,
    PolicyHTTPRequest,
    PolicyFilter,
    PolicySort,
    PolicyPage,
    PolicyPerPage,
    PolicyTotalRecords,
    PolicyIsAdded,
    PolicyIsCreated,
    getPaginatedPolicyList,
    saveForm,
    updateForm,
    updatePolicyPaginated,
    updatePolicyPaginationFilterSearch,
    deleteForm,
    getPolicyByIdFromStore,
    getSelectedPolicyById,
    changePolicyLayoutType,
    PolicyLayoutType,
    clearPolicyDataHook,
    updatePolicyIsInitialTableDataLoaded,
  };
};
export { usePolicyHook };
