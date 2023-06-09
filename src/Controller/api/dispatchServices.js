import { getAPIUrl } from "../Global";
import { Get, Patch, Post, Remove } from "../headerIntercepter";


export function updateDispatchData(data,id) {
    const url =  getAPIUrl("dispatch.dispatchChief",{ id });
    return Patch(url,data)
  }
  export function getDispatchDataById(id) {
    const url = getAPIUrl("dispatch.dispatchChief",{ id });
    return Get(url);
  }

  export function getDispatchedCardData(params={}) {
    const url = getAPIUrl("dispatch.dispatched");
    return Get(url,params);
  }

  export function postDispatchData(data,id) {
    const url =  getAPIUrl("dispatch.dispatch_one",{ id });
    return Post(url, data)
  }

export function deleteDispatchData(id) {
  let url = getAPIUrl("dispatch.dispatch", { id });
  return Remove(url);
}
  
  export function getDispatchData(params={}) {
    const url = getAPIUrl("dispatch.dispatch");
    return Get(url,params);
  }

  export function getDispatchStatus(params={}) {
    const url = getAPIUrl("dispatch.dispatch_assign");
    return Get(url,params);
  }

  export function getDispatchNowStatus(params={}) {
    const url = getAPIUrl("dispatch.dispatch_now");
    return Get(url,params);
  }

  export function updateDispatchFleetGroupData(data,id) {
    const url =  getAPIUrl("dispatch.dispatch_update_fleet_group",{ id });
    return Post(url,data)
  }