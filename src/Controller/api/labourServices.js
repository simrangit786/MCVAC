import { Get, Patch, Post } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getEmployees(params = {}) {
  let url = getAPIUrl("labor.employee");
  return Get(url, params);
}

export function getEmployeeById(id) {
  let url = getAPIUrl("labor.employee", { id });
  return Get(url);
}
export function createEmployee(data) {
  let url = getAPIUrl("labor.employee");
  return Post(url, data);
}

export function updateEmployee(id, data) {
  let url = getAPIUrl("labor.employee", { id });
  return Patch(url, data);
}

export function getLaborEmployees(params = {}) {
  let url = getAPIUrl("labor.labor_employee");
  return Get(url,params)
}

export function getLaborGroup(params = {}) {
  let url = getAPIUrl("labor.labor_group");
  return Get(url, params);
}

export function getLaborGroupById(id) {
  let url = getAPIUrl("labor.labor_group", { id });
  return Get(url);
}

export function createLaborGroup(data) {
  let url = getAPIUrl("labor.labor_group");
  return Post(url, data);
}

export function updateLaborGroup(id, data) {
  let url = getAPIUrl("labor.labor_group", { id });
  return Patch(url, data);
}

export function getShift(params = {}) {
  let url = getAPIUrl("labor.shift");
  return Get(url, params);
}

export function getShiftById(id) {
  let url = getAPIUrl("labor.shift", { id });
  return Get(url);
}

export function createShift(data) {
  let url = getAPIUrl("labor.shift");
  return Post(url, data);
}

export function updateShift(id, data) {
  let url = getAPIUrl("labor.shift", { id });
  return Patch(url, data);
}

export function getEmployeeDoc(params = {}) {
  let url = getAPIUrl("labor.employee_doc");
  return Get(url, params);
}

export function getEmployeeDocById(id) {
  let url = getAPIUrl("labor.employee_doc", { id });
  return Get(url);
}

export function createEmployeeDoc(data) {
  let url = getAPIUrl("labor.employee_doc");
  return Post(url, data);
}

export function updateEmployeeDoc(id, data) {
  let url = getAPIUrl("labor.employee_doc", { id });
  return Patch(url, data);
}

export function getEmployeeType(params = {}) {
  let url = getAPIUrl("labor.employee_type");
  return Get(url, params);
}
export function getEmployeeLaborGroup(params = {}) {
  let url = getAPIUrl("labor.employee_labor_group");
  return Get(url, params);
}
export function postEmployeeLaborGroup(data) {
  let url = getAPIUrl("labor.employee_labor_group");
  return Post(url, data);
}

export function updateEmployeeLaborGroup(id, data) {
  let url = getAPIUrl("labor.employee_labor_group", { id });
  return Patch(url, data);
}

export function getInternalLocation(params = {}) {
  let url = getAPIUrl("labor.internal_location");
  return Get(url, params);
}

export function updateInternalLocation(id, params = {}) {
  let url = getAPIUrl("labor.internal_location", { id });
  return Patch(url, params);
}

export function createInternalLocation(params = {}) {
  let url = getAPIUrl("labor.internal_location");
  return Post(url, params);
}

export function globalSearch(params = {}) {
  let url = getAPIUrl("global_search.global_search");
  return Get(url, params);
}
