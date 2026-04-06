export const ProductInitalState = {
  Product: {
    loading: false,
    submitting: false,
    httpRequest: false,
    list: [],
    isInitialTableDataLoaded:false,
    product: null,
    filter: "",
    sort: "product.created_at|desc",
    total_records: 0,
    page: 1,
    per_page: 10,
    isCreated: false,
    inputError: null,
    layoutStyle:'table'
  },
};
