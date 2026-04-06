import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  addPostAction,
  updatePostAction,
  getPaginatedPostListAction,
  updatePostPaginationAction,
  updatePostPaginationFilterAction,
  deletePostAction,
  getSelectedPostByIdAction,
  changeLayoutAction,
  clearPostDataAction,
  updatePostIsInitialTableDataLoadedAction,
  getPaginatedPostListCalendarAction
} from "./PostAction";
import { Dispatch } from "redux";
import { default as EndPoints } from "./PostEndPoints.json";

const usePostHook = (props?: any) => {
  const getPaginatedPostListFromStore = useSelector(
    (state: any) => state.PostReducer.list,
    shallowEqual
  );
    const calendarList = useSelector(
    (state: any) => state.PostReducer.calendarList,
    shallowEqual
  );

  const getPostByIdFromStore = useSelector(
    (state: any) => state.PostReducer.post,
    shallowEqual
  );

  const PostList = useSelector(
    (state: any) => state.PostReducer.menuList,
    shallowEqual
  );
  const PostLoading = useSelector(
    (state: any) => state.PostReducer.loading,
    shallowEqual
  );
  const PostSubmit = useSelector(
    (state: any) => state.PostReducer.submitting,
    shallowEqual
  );
  const PostHTTPRequest = useSelector(
    (state: any) => state.PostReducer.httpRequest,
    shallowEqual
  );
  const PostFilter = useSelector(
    (state: any) => state.PostReducer.filter,
    shallowEqual
  );
  const PostSort = useSelector(
    (state: any) => state.PostReducer.sort,
    shallowEqual
  );
  const PostPage = useSelector(
    (state: any) => state.PostReducer.page,
    shallowEqual
  );
  const PostPerPage = useSelector(
    (state: any) => state.PostReducer.per_page,
    shallowEqual
  );
  const PostTotalRecords = useSelector(
    (state: any) => state.PostReducer.total_records,
    shallowEqual
  );

  const PostIsAdded = useSelector(
    (state: any) => state.PostReducer?.success,
    shallowEqual
  );

  const PostIsCreated = useSelector(
    (state: any) => state.PostReducer.isCreated,
    shallowEqual
  );

  const PostLayoutType = useSelector(
    (state: any) => state.PostReducer.layoutStyle,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();

  const changePostLayoutType = React.useCallback(
    (layoutStyle: any) => dispatch(changeLayoutAction(layoutStyle)),
    [dispatch]
  );

  const saveForm = React.useCallback(
    (formData: object, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(addPostAction(EndPoints.addPost, formData, resetForm,isSaveExit,showSideBar)),
    [dispatch]
  );
  const updateForm = React.useCallback(
    (PostId: any, data: any, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(
        updatePostAction(EndPoints.updatePost, PostId, data, resetForm, isSaveExit,showSideBar)
      ),
    [dispatch]
  );
  const getPaginatedPostList = React.useCallback(
    (status: string) =>
      dispatch(getPaginatedPostListAction(EndPoints.getPaginatedPostList, status)),
    [dispatch]
  );

    const getPaginatedPostCalender = React.useCallback(
    (filters:any) =>
      dispatch(getPaginatedPostListCalendarAction(EndPoints.getPaginatedPostListCalendar, filters)),
    [dispatch]
  );

  const getSelectedPostById = React.useCallback(
    (PostId: any) =>
      dispatch(
        getSelectedPostByIdAction(EndPoints.getSelectedPostById, PostId)
      ),
    [dispatch]
  );

  const deleteForm = React.useCallback(
    (rowItem: any) =>
      dispatch(deletePostAction(EndPoints.deletePost, rowItem)),
    [dispatch]
  );

  const clearPostDataHook = React.useCallback(
    () => dispatch(clearPostDataAction()),
    [dispatch]
  );

  const updatePostPaginated = (sorting: any) =>
    dispatch(updatePostPaginationAction(sorting));

  const updatePostPaginationFilterSearch = (paginationData: any) =>
    dispatch(updatePostPaginationFilterAction(paginationData));

    const updatePostIsInitialTableDataLoaded = (status: boolean) =>
    dispatch(updatePostIsInitialTableDataLoadedAction(status));

  return {
    calendarList,
    getPaginatedPostCalender,
    PostList,
    getPaginatedPostListFromStore,
    PostLoading,
    PostSubmit,
    PostHTTPRequest,
    PostFilter,
    PostSort,
    PostPage,
    PostPerPage,
    PostTotalRecords,
    PostIsAdded,
    PostIsCreated,
    getPaginatedPostList,
    saveForm,
    updateForm,
    updatePostPaginated,
    updatePostPaginationFilterSearch,
    deleteForm,
    getPostByIdFromStore,
    getSelectedPostById,
    changePostLayoutType,
    PostLayoutType,
    clearPostDataHook,
    updatePostIsInitialTableDataLoaded,
  };
};
export { usePostHook };
