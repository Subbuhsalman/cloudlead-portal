export const PostInitalState = {
  Post: {
    loading: false,
    submitting: false,
    httpRequest: false,
    list: [],
    calendarList: [],
    isInitialTableDataLoaded:false,
    post: null,
    filter: "",
    sort: "post.created_at|desc",
    total_records: 0,
    page: 1,
    per_page: 10,
    isCreated: false,
    inputError: null,
    layoutStyle:'table'
  },
};
