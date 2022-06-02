import api from "./api";

// redux action & action creators

export const ACTION_TYPES = {
    // temporary, will change to ideal ones later
    FETCH_GRAPH: "FETCH_GRAPH",
    FETCH_REC: "FETCH_REC",
    SET_SELECTED_ITEM: "SET_SELECTED_ITEM",
}

export const fetchGraph = () => dispatch => {
    api.items.fetchGraph()
        .then(response => {
            dispatch({
                type: ACTION_TYPES.FETCH_GRAPH,
                payload: response.data,
            })
        })
        .catch(err => console.log(err)) 
}

export const fetchRec = () => dispatch => {
    api.items.fetchRec()
        .then(response => {
            dispatch({
                type: ACTION_TYPES.FETCH_REC,
                payload: response.data,
            })
        })
        .catch(err => console.log(err))
}

export const setSelectedItem = (updatedList) => {
    //console.log("action setselecteditem, itemname: " + itemName);
    return {
        type: "SET_SELECTED_ITEM",
        payload: updatedList,
    };
};