export const PolicyInitalState = {
  Policy: {
    loading: false,
    submitting: false,
    httpRequest: false,
    list: [],
    isInitialTableDataLoaded:false,
    policy: null,
    filter: "",
    sort: "policy.created_at|desc",
    total_records: 0,
    page: 1,
    per_page: 10,
    isCreated: false,
    inputError: null,
    layoutStyle:'table'
  },
};
