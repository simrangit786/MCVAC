export const SIDEBAR_KEY = "SIDEBAR_KEY";

export function setSidebarKey(key) {
  return (dispatch) => {
    dispatch({
      type: SIDEBAR_KEY,
      payload: key,
    });
  };
}
