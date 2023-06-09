import { PROPOSAL_DETAIL_SUCCESS } from "../actions/proposalAction";

export const proposalReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case PROPOSAL_DETAIL_SUCCESS: {
            return { ...payload };
        }
        default: {
            return state;
        }
    }
};
