import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  addGalleryAction,
  updateGalleryAction,
  getPaginatedGalleryListAction,
  updateGalleryPaginationAction,
  updateGalleryPaginationFilterAction,
  deleteGalleryAction,
  getSelectedGalleryByIdAction,
  changeLayoutAction,
  clearGalleryDataAction,
  updateGalleryIsInitialTableDataLoadedAction
} from "./GalleryAction";
import { Dispatch } from "redux";
import { default as EndPoints } from "./GalleryEndPoints.json";

const useGalleryHook = (props?: any) => {
  const getPaginatedGalleryListFromStore = useSelector(
    (state: any) => state.GalleryReducer.list,
    shallowEqual
  );

  const getGalleryByIdFromStore = useSelector(
    (state: any) => state.GalleryReducer.gallery,
    shallowEqual
  );

  const GalleryList = useSelector(
    (state: any) => state.GalleryReducer.menuList,
    shallowEqual
  );
  const GalleryLoading = useSelector(
    (state: any) => state.GalleryReducer.loading,
    shallowEqual
  );
  const GallerySubmit = useSelector(
    (state: any) => state.GalleryReducer.submitting,
    shallowEqual
  );
  const GalleryHTTPRequest = useSelector(
    (state: any) => state.GalleryReducer.httpRequest,
    shallowEqual
  );
  const GalleryFilter = useSelector(
    (state: any) => state.GalleryReducer.filter,
    shallowEqual
  );
  const GallerySort = useSelector(
    (state: any) => state.GalleryReducer.sort,
    shallowEqual
  );
  const GalleryPage = useSelector(
    (state: any) => state.GalleryReducer.page,
    shallowEqual
  );
  const GalleryPerPage = useSelector(
    (state: any) => state.GalleryReducer.per_page,
    shallowEqual
  );
  const GalleryTotalRecords = useSelector(
    (state: any) => state.GalleryReducer.total_records,
    shallowEqual
  );

  const GalleryIsAdded = useSelector(
    (state: any) => state.GalleryReducer?.success,
    shallowEqual
  );

  const GalleryIsCreated = useSelector(
    (state: any) => state.GalleryReducer.isCreated,
    shallowEqual
  );

  const GalleryLayoutType = useSelector(
    (state: any) => state.GalleryReducer.layoutStyle,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();

  const changeGalleryLayoutType = React.useCallback(
    (layoutStyle: any) => dispatch(changeLayoutAction(layoutStyle)),
    [dispatch]
  );

  const saveForm = React.useCallback(
    (formData: object, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(addGalleryAction(EndPoints.addGallery, formData, resetForm,isSaveExit,showSideBar)),
    [dispatch]
  );
  const updateForm = React.useCallback(
    (GalleryId: any, data: any, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(
        updateGalleryAction(EndPoints.updateGallery, GalleryId, data, resetForm, isSaveExit,showSideBar)
      ),
    [dispatch]
  );
  const getPaginatedGalleryList = React.useCallback(
    () =>
      dispatch(getPaginatedGalleryListAction(EndPoints.getPaginatedGalleryList)),
    [dispatch]
  );

  const getSelectedGalleryById = React.useCallback(
    (GalleryId: any) =>
      dispatch(
        getSelectedGalleryByIdAction(EndPoints.getSelectedGalleryById, GalleryId)
      ),
    [dispatch]
  );

  const deleteForm = React.useCallback(
    (rowItem: any) =>
      dispatch(deleteGalleryAction(EndPoints.deleteGallery, rowItem)),
    [dispatch]
  );

  const clearGalleryDataHook = React.useCallback(
    () => dispatch(clearGalleryDataAction()),
    [dispatch]
  );

  const updateGalleryPaginated = (sorting: any) =>
    dispatch(updateGalleryPaginationAction(sorting));

  const updateGalleryPaginationFilterSearch = (paginationData: any) =>
    dispatch(updateGalleryPaginationFilterAction(paginationData));

    const updateGalleryIsInitialTableDataLoaded = (status: boolean) =>
    dispatch(updateGalleryIsInitialTableDataLoadedAction(status));

  return {
    GalleryList,
    getPaginatedGalleryListFromStore,
    GalleryLoading,
    GallerySubmit,
    GalleryHTTPRequest,
    GalleryFilter,
    GallerySort,
    GalleryPage,
    GalleryPerPage,
    GalleryTotalRecords,
    GalleryIsAdded,
    GalleryIsCreated,
    getPaginatedGalleryList,
    saveForm,
    updateForm,
    updateGalleryPaginated,
    updateGalleryPaginationFilterSearch,
    deleteForm,
    getGalleryByIdFromStore,
    getSelectedGalleryById,
    changeGalleryLayoutType,
    GalleryLayoutType,
    clearGalleryDataHook,
    updateGalleryIsInitialTableDataLoaded,
  };
};
export { useGalleryHook };
