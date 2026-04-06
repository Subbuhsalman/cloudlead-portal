import { createStore, applyMiddleware, compose  } from 'redux'
import {createReducer} from './reducers';
import {thunk} from 'redux-thunk'

declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
export const makeStore = () => {
    if(process.env.NODE_ENV === "development"){
        const composeEnhancers =  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        const store: any = createStore(createReducer, composeEnhancers(applyMiddleware(thunk)));
        return store
    }
    else{
        const store: any = createStore(createReducer, applyMiddleware(thunk));
        return store
    }
   
}

export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']