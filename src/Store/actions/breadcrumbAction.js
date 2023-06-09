export const BREADCRUMB_DATA = "BREADCRUMB_DATA";

export function setBreadcrumb(data) {
  return (dispatch) => {
    dispatch({
      type: BREADCRUMB_DATA,
      payload: data,
    });
  };
}
