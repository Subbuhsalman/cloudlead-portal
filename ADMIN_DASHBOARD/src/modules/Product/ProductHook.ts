import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  addProductAction,
  updateProductAction,
  getPaginatedProductListAction,
  updateProductPaginationAction,
  updateProductPaginationFilterAction,
  deleteProductAction,
  getSelectedProductByIdAction,
  changeLayoutAction,
  clearProductDataAction,
  updateProductIsInitialTableDataLoadedAction
} from "./ProductAction";
import { Dispatch } from "redux";
import { default as EndPoints } from "./ProductEndPoints.json";

const useProductHook = (props?: any) => {
  const getPaginatedProductListFromStore = useSelector(
    (state: any) => state.ProductReducer.list,
    shallowEqual
  );

  const getProductByIdFromStore = useSelector(
    (state: any) => state.ProductReducer.product,
    shallowEqual
  );

  const ProductList = useSelector(
    (state: any) => state.ProductReducer.menuList,
    shallowEqual
  );
  const ProductLoading = useSelector(
    (state: any) => state.ProductReducer.loading,
    shallowEqual
  );
  const ProductSubmit = useSelector(
    (state: any) => state.ProductReducer.submitting,
    shallowEqual
  );
  const ProductHTTPRequest = useSelector(
    (state: any) => state.ProductReducer.httpRequest,
    shallowEqual
  );
  const ProductFilter = useSelector(
    (state: any) => state.ProductReducer.filter,
    shallowEqual
  );
  const ProductSort = useSelector(
    (state: any) => state.ProductReducer.sort,
    shallowEqual
  );
  const ProductPage = useSelector(
    (state: any) => state.ProductReducer.page,
    shallowEqual
  );
  const ProductPerPage = useSelector(
    (state: any) => state.ProductReducer.per_page,
    shallowEqual
  );
  const ProductTotalRecords = useSelector(
    (state: any) => state.ProductReducer.total_records,
    shallowEqual
  );

  const ProductIsAdded = useSelector(
    (state: any) => state.ProductReducer?.success,
    shallowEqual
  );

  const ProductIsCreated = useSelector(
    (state: any) => state.ProductReducer.isCreated,
    shallowEqual
  );

  const ProductLayoutType = useSelector(
    (state: any) => state.ProductReducer.layoutStyle,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();

  const changeProductLayoutType = React.useCallback(
    (layoutStyle: any) => dispatch(changeLayoutAction(layoutStyle)),
    [dispatch]
  );

  const saveForm = React.useCallback(
    (formData: object, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(addProductAction(EndPoints.addProduct, formData, resetForm,isSaveExit,showSideBar)),
    [dispatch]
  );
  const updateForm = React.useCallback(
    (ProductId: any, data: any, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(
        updateProductAction(EndPoints.updateProduct, ProductId, data, resetForm, isSaveExit,showSideBar)
      ),
    [dispatch]
  );
  const getPaginatedProductList = React.useCallback(
    () =>
      dispatch(getPaginatedProductListAction(EndPoints.getPaginatedProductList)),
    [dispatch]
  );

  const getSelectedProductById = React.useCallback(
    (ProductId: any) =>
      dispatch(
        getSelectedProductByIdAction(EndPoints.getSelectedProductById, ProductId)
      ),
    [dispatch]
  );

  const deleteForm = React.useCallback(
    (rowItem: any) =>
      dispatch(deleteProductAction(EndPoints.deleteProduct, rowItem)),
    [dispatch]
  );

  const clearProductDataHook = React.useCallback(
    () => dispatch(clearProductDataAction()),
    [dispatch]
  );

  const updateProductPaginated = (sorting: any) =>
    dispatch(updateProductPaginationAction(sorting));

  const updateProductPaginationFilterSearch = (paginationData: any) =>
    dispatch(updateProductPaginationFilterAction(paginationData));

    const updateProductIsInitialTableDataLoaded = (status: boolean) =>
    dispatch(updateProductIsInitialTableDataLoadedAction(status));

  return {
    ProductList,
    getPaginatedProductListFromStore,
    ProductLoading,
    ProductSubmit,
    ProductHTTPRequest,
    ProductFilter,
    ProductSort,
    ProductPage,
    ProductPerPage,
    ProductTotalRecords,
    ProductIsAdded,
    ProductIsCreated,
    getPaginatedProductList,
    saveForm,
    updateForm,
    updateProductPaginated,
    updateProductPaginationFilterSearch,
    deleteForm,
    getProductByIdFromStore,
    getSelectedProductById,
    changeProductLayoutType,
    ProductLayoutType,
    clearProductDataHook,
    updateProductIsInitialTableDataLoaded,
  };
};
export { useProductHook };
