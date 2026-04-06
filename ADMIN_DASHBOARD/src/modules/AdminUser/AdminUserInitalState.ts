export const AdminUserInitalState = {
  AdminUser: {
    loading: false,
    submitting: false,
    httpRequest: false,
    list: [],
    isInitialTableDataLoaded:false,
    adminUser: null,
    filter: "",
    sort: "admin_user.created_at|desc",
    total_records: 0,
    page: 1,
    per_page: 10,
    isCreated: false,
    inputError: null,
    layoutStyle:'table'
  },
};
