import rootReducer from "./reducers/mainReducer";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user"],
};

const pReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(
  pReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export const pStore = persistStore(store);
