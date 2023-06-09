import { getOneOpportunities } from "../../Controller/api/opportunityServices";

export const OPPORTUNITY_DETAIL_SUCCESS = "OPPORTUNITY_DETAIL_SUCCESS";

export function opportunityDetailAction(id) {
  return (dispatch) => {
    return getOneOpportunities(id).then((response) => {
      dispatch({
        type: OPPORTUNITY_DETAIL_SUCCESS,
        payload: response.data,
      });
    });
  };
}
