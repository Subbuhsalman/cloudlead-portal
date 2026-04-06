// postsReducer.js
const initialState = {
    loading: false,
    error: '',
    user: null,
    isLoggedIn: false
  };
  
  function userReducer(state = initialState, action:any) {
    // switch (action.type) {
    //   case 'posts/fetchRequest':
    //     return {
    //       ...state,
    //       loading: true,
    //     };
    //   case 'posts/fetchSuccess':
    //     return {
    //       ...state,
    //       loading: false,
    //       posts: action.payLoad,
    //     };
    //   case 'posts/fetchFailure':
    //     return {
    //       ...state,
    //       loading: false,
    //       error: action.payLoad,
    //     };
    //   default:
    //     return state;
    // }
    return state;
  }
  
  export default userReducer;
  