export const ApplicationErrorInitalState = {
  ApplicationError: {
    loading: false,
    submitting: false,
    httpRequest: false,
    list: [],
    isInitialTableDataLoaded:false,
    applicationError: null,
    filter: "",
    sort: "application_error.created_at|desc",
    total_records: 0,
    page: 1,
    per_page: 10,
    isCreated: false,
    inputError: null,
    layoutStyle:'table'
  },
};
