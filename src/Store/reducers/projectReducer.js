import { PROJECT_DETAIL_SUCCESS } from '../actions/projectAction';


export const projectReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case PROJECT_DETAIL_SUCCESS: {
            return { ...payload };
        }
        default: {
            return state;
        }
    }
};

