import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  addAdminUserAction,
  updateAdminUserAction,
  getPaginatedAdminUserListAction,
  updateAdminUserPaginationAction,
  updateAdminUserPaginationFilterAction,
  deleteAdminUserAction,
  getSelectedAdminUserByIdAction,
  changeLayoutAction,
  clearAdminUserDataAction,
  updateAdminUserIsInitialTableDataLoadedAction
} from "./AdminUserAction";
import { Dispatch } from "redux";
import { default as EndPoints } from "./AdminUserEndPoints.json";

const useAdminUserHook = (props?: any) => {
  const getPaginatedAdminUserListFromStore = useSelector(
    (state: any) => state.AdminUserReducer.list,
    shallowEqual
  );

  const getAdminUserByIdFromStore = useSelector(
    (state: any) => state.AdminUserReducer.adminUser,
    shallowEqual
  );

  const AdminUserList = useSelector(
    (state: any) => state.AdminUserReducer.menuList,
    shallowEqual
  );
  const AdminUserLoading = useSelector(
    (state: any) => state.AdminUserReducer.loading,
    shallowEqual
  );
  const AdminUserSubmit = useSelector(
    (state: any) => state.AdminUserReducer.submitting,
    shallowEqual
  );
  const AdminUserHTTPRequest = useSelector(
    (state: any) => state.AdminUserReducer.httpRequest,
    shallowEqual
  );
  const AdminUserFilter = useSelector(
    (state: any) => state.AdminUserReducer.filter,
    shallowEqual
  );
  const AdminUserSort = useSelector(
    (state: any) => state.AdminUserReducer.sort,
    shallowEqual
  );
  const AdminUserPage = useSelector(
    (state: any) => state.AdminUserReducer.page,
    shallowEqual
  );
  const AdminUserPerPage = useSelector(
    (state: any) => state.AdminUserReducer.per_page,
    shallowEqual
  );
  const AdminUserTotalRecords = useSelector(
    (state: any) => state.AdminUserReducer.total_records,
    shallowEqual
  );

  const AdminUserIsAdded = useSelector(
    (state: any) => state.AdminUserReducer?.success,
    shallowEqual
  );

  const AdminUserIsCreated = useSelector(
    (state: any) => state.AdminUserReducer.isCreated,
    shallowEqual
  );

  const AdminUserLayoutType = useSelector(
    (state: any) => state.AdminUserReducer.layoutStyle,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();

  const changeAdminUserLayoutType = React.useCallback(
    (layoutStyle: any) => dispatch(changeLayoutAction(layoutStyle)),
    [dispatch]
  );

  const saveForm = React.useCallback(
    (formData: object, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(addAdminUserAction(EndPoints.addAdminUser, formData, resetForm,isSaveExit,showSideBar)),
    [dispatch]
  );
  const updateForm = React.useCallback(
    (AdminUserId: any, data: any, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(
        updateAdminUserAction(EndPoints.updateAdminUser, AdminUserId, data, resetForm, isSaveExit,showSideBar)
      ),
    [dispatch]
  );
  const getPaginatedAdminUserList = React.useCallback(
    () =>
      dispatch(getPaginatedAdminUserListAction(EndPoints.getPaginatedAdminUserList)),
    [dispatch]
  );

  const getSelectedAdminUserById = React.useCallback(
    (AdminUserId: any) =>
      dispatch(
        getSelectedAdminUserByIdAction(EndPoints.getSelectedAdminUserById, AdminUserId)
      ),
    [dispatch]
  );

  const deleteForm = React.useCallback(
    (rowItem: any) =>
      dispatch(deleteAdminUserAction(EndPoints.deleteAdminUser, rowItem)),
    [dispatch]
  );

  const clearAdminUserDataHook = React.useCallback(
    () => dispatch(clearAdminUserDataAction()),
    [dispatch]
  );

  const updateAdminUserPaginated = (sorting: any) =>
    dispatch(updateAdminUserPaginationAction(sorting));

  const updateAdminUserPaginationFilterSearch = (paginationData: any) =>
    dispatch(updateAdminUserPaginationFilterAction(paginationData));

    const updateAdminUserIsInitialTableDataLoaded = (status: boolean) =>
    dispatch(updateAdminUserIsInitialTableDataLoadedAction(status));

  return {
    AdminUserList,
    getPaginatedAdminUserListFromStore,
    AdminUserLoading,
    AdminUserSubmit,
    AdminUserHTTPRequest,
    AdminUserFilter,
    AdminUserSort,
    AdminUserPage,
    AdminUserPerPage,
    AdminUserTotalRecords,
    AdminUserIsAdded,
    AdminUserIsCreated,
    getPaginatedAdminUserList,
    saveForm,
    updateForm,
    updateAdminUserPaginated,
    updateAdminUserPaginationFilterSearch,
    deleteForm,
    getAdminUserByIdFromStore,
    getSelectedAdminUserById,
    changeAdminUserLayoutType,
    AdminUserLayoutType,
    clearAdminUserDataHook,
    updateAdminUserIsInitialTableDataLoaded,
  };
};
export { useAdminUserHook };
