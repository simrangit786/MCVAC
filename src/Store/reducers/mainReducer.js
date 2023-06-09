import { combineReducers } from "redux";
import { LOGOUT_SUCCESS } from "../actions/authAction";
import { userLoginReducer } from "./authReducer";
import { opportunityReducer } from "./opportunityReducer";
import { contactReducer } from "./contactReducer";
import {
  customerAccountReducer,
  globalSearchReducer,
} from "./customerAccountReducer";
import { ownerAccountReducer } from "./ownerAccountReducer";
import { sidebarReducer } from "./sidebarReducer";
import { breadcrumbReducer } from "./breadcrumbReducer";
import { userdataReducer } from "./userdataReducer";
import { proposalReducer } from './proposalReducer';
import { projectReducer } from './projectReducer';
import { vendorAccountReducer } from "./vendorAccountReducer";

const allReducers = combineReducers({
  user: userLoginReducer,
  opportunity: opportunityReducer,
  contact: contactReducer,
  customer: customerAccountReducer,
  owner: ownerAccountReducer,
  sidebar: sidebarReducer,
  breadcrumb: breadcrumbReducer,
  global_search: globalSearchReducer,
  userdata: userdataReducer,
  proposal_data: proposalReducer,
  project_data: projectReducer,
  vendor: vendorAccountReducer
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) {
    state = undefined;
  }
  return allReducers(state, action);
};
export default rootReducer;
