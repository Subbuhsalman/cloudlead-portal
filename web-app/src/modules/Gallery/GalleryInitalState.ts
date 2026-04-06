export const GalleryInitalState = {
  Gallery: {
    loading: false,
    submitting: false,
    httpRequest: false,
    list: [],
    isInitialTableDataLoaded:false,
    gallery: null,
    filter: "",
    sort: "gallery.created_at|desc",
    total_records: 0,
    page: 1,
    per_page: 10,
    isCreated: false,
    inputError: null,
    layoutStyle:'table'
  },
};
