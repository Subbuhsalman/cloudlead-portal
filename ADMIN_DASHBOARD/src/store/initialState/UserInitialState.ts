export const UserInitialState = {
    User: {
      loading: false,
      submitting: false,
      httpRequest: false,
      list: [],
      isInitialTableDataLoaded:false,
      user: null,
      filter: "",
      sort: "users.created_at|desc",
      total_records: 0,
      page: 1,
      per_page: 10,
      sortField: null,
      sortOrder: null,
      isCreated: false,
      inputError: null,
      layoutStyle:'table'
    },
  };
  