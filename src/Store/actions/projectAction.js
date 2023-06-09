import { getProjectById } from "../../Controller/api/projectServices";

export const PROJECT_DETAIL_SUCCESS = "PROJECT_DETAIL_SUCCESS";

export function ProjectDetailAction(id) {
    return (dispatch) => {
        return getProjectById(id).then((response) => {
            dispatch({
                type: PROJECT_DETAIL_SUCCESS,
                payload: response.data,
            });
        });
    };
}