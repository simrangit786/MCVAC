import { getProposalById } from "../../Controller/api/proposalServices";

export const PROPOSAL_DETAIL_SUCCESS = "PROPOSAL_DETAIL_SUCCESS";

export function ProposalDetailAction(id) {
    return (dispatch) => {
        return getProposalById(id).then((response) => {
            dispatch({
                type: PROPOSAL_DETAIL_SUCCESS,
                payload: response.data,
            });
        });
    };
}
