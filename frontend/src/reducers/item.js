import { ACTION_TYPES } from "../actions/item";
import { testingData } from "./testingGraphData";

const initialState = {
    selectedItems: ["","","",""],
    itemList: [
        "select item","milk", "eggs", "popcorn"
    ],
    graphData: testingData,
    recommendations: [],
    warningMsg: [],
}

// state: info to store inside of redux
const itemReducer = (state = initialState, action) => {
    //console.log("arrived item reducer");
    //console.log("action.type: " + action.type);
    switch (action.type) {
        case ACTION_TYPES.FETCH_GRAPH:
            console.log("action fetch graph");
            return {
                ...state,
                graphData: [action.payload]
            }
        case ACTION_TYPES.FETCH_REC:
            //console.log("action fetch rec");
            return {
                ...state,
                graphData: [action.payload]
            }  
        case ACTION_TYPES.SET_SELECTED_ITEM:
            console.log("set selected item");
            let size = 1;
            for(let i = 0; i < 4; i++){
                if(action.payload[i].localeCompare("") === 0){
                    size = i
                    break;
                }
            }
            return {
                ...state,
                selectedItems: action.payload,
                recommendations: generateNewRec(action.payload),
                graphData: testingData.slice(0,size),
                //TODO: GET NEW SET OF GRAPH AND REC DATA
            }
        default:
            //console.log("default action");
            return state
    }
}

const generateNewRec = (itemList) => {
    let newRec = [];
    for(let i = 0; i < 4; i++){
        if(itemList[i].localeCompare("") === 0){
            break;
        }
        let d = {"name": itemList[i], "weeklyN": 2, "biweeklyN": 2};
        newRec.push(d)
    }

    return newRec;
}

export default itemReducer;
