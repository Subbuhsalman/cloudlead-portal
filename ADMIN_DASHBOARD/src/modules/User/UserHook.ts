import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  getPaginatedUserListAction,
  getSelectedUserByIdAction,
  addCreditsToUserAction,
  updateUserPaginationAction,
  updateUserPaginationFilterAction,
  changeLayoutAction,
  updateUserIsInitialTableDataLoadedAction,
} from "./UserAction";
import { Dispatch } from "redux";
import { default as EndPoints } from "./UserEndPoints.json";

const useUserHook = (props?: any) => {
  const getPaginatedUserListFromStore = useSelector(
    (state: any) => state.UserReducer.list,
    shallowEqual
  );

  const getUserByIdFromStore = useSelector(
    (state: any) => state.UserReducer.user,
    shallowEqual
  );

  const UserList = useSelector(
    (state: any) => state.UserReducer.menuList,
    shallowEqual
  );
  const UserLoading = useSelector(
    (state: any) => state.UserReducer.loading,
    shallowEqual
  );
  const UserSubmit = useSelector(
    (state: any) => state.UserReducer.submitting,
    shallowEqual
  );
  const UserHTTPRequest = useSelector(
    (state: any) => state.UserReducer.httpRequest,
    shallowEqual
  );
  const UserFilter = useSelector(
    (state: any) => state.UserReducer.filter,
    shallowEqual
  );
  const UserSort = useSelector(
    (state: any) => state.UserReducer.sort,
    shallowEqual
  );
  const UserPage = useSelector(
    (state: any) => state.UserReducer.page,
    shallowEqual
  );
  const UserPerPage = useSelector(
    (state: any) => state.UserReducer.per_page,
    shallowEqual
  );
  const UserTotalRecords = useSelector(
    (state: any) => state.UserReducer.total_records,
    shallowEqual
  );

  const UserIsAdded = useSelector(
    (state: any) => state.UserReducer?.success,
    shallowEqual
  );

  const UserIsCreated = useSelector(
    (state: any) => state.UserReducer.isCreated,
    shallowEqual
  );

  const UserLayoutType = useSelector(
    (state: any) => state.UserReducer.layoutStyle,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();

  const changeUserLayoutType = React.useCallback(
    (layoutStyle: any) => dispatch(changeLayoutAction(layoutStyle)),
    [dispatch]
  );

  const getPaginatedUserList = React.useCallback(
    () =>
      dispatch(getPaginatedUserListAction(EndPoints.getPaginatedUserList)),
    [dispatch]
  );

  const getSelectedUserById = React.useCallback(
    (UserId: any) =>
      dispatch(
        getSelectedUserByIdAction(EndPoints.getSelectedUserById, UserId)
      ),
    [dispatch]
  );

  const addCreditsToUser = React.useCallback(
    (userId: any, credits: number) =>
      dispatch(addCreditsToUserAction(EndPoints.addCreditsToUser, userId, credits)),
    [dispatch]
  );

  const updateUserPaginated = (sorting: any) =>
    dispatch(updateUserPaginationAction(sorting));

  const updateUserPaginationFilterSearch = (paginationData: any) =>
    dispatch(updateUserPaginationFilterAction(paginationData));

  const updateUserIsInitialTableDataLoaded = (status: boolean) =>
    dispatch(updateUserIsInitialTableDataLoadedAction(status));

  return {
    UserList,
    getPaginatedUserListFromStore,
    UserLoading,
    UserSubmit,
    UserHTTPRequest,
    UserFilter,
    UserSort,
    UserPage,
    UserPerPage,
    UserTotalRecords,
    UserIsAdded,
    UserIsCreated,
    getPaginatedUserList,
    updateUserPaginated,
    updateUserPaginationFilterSearch,
    getUserByIdFromStore,
    getSelectedUserById,
    changeUserLayoutType,
    UserLayoutType,
    updateUserIsInitialTableDataLoaded,
    addCreditsToUser,
  };
};
export { useUserHook };
