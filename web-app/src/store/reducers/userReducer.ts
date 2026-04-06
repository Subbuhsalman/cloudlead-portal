// postsReducer.js
const initialState = {
    loading: false,
    error: '',
    user: null,
    isLoggedIn: false
  };
  
  function userReducer(state = initialState, _action:any) {
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
    //       posts: action.payload,
    //     };
    //   case 'posts/fetchFailure':
    //     return {
    //       ...state,
    //       loading: false,
    //       error: action.payload,
    //     };
    //   default:
    //     return state;
    // }
    return state;
  }
  
  export default userReducer;
  