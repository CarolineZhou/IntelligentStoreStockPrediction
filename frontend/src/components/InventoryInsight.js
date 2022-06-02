import React, { useState, useEffect, useReducer } from 'react';
import {
    Container,
    Box, 
    IconButton,
    Tooltip
} from "@material-ui/core";
import AddBoxIcon from '@material-ui/icons/AddBox';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Graph from "./Graph";
import { Colors } from "./data";
import ProductSelectionDialog from "./ProductDiaglog";
import axios from "axios";

const inventoryInsightStyle = {
    backgroundColor: Colors.grey,
    width:"70%",
    height: "70%",
}

const InventoryInsight = () => {
    const lineColors = [Colors.line1,Colors.line2,Colors.line3,Colors.line4];
    const [dropdownNum, setDropdownNum] = useState(1);
    const [selectedItems, setSelectedItems] = useState([0,0,0,0])
    const [displayedItems, setDisplayedItems] = useState([0]);
    const [aisles, setAisles] = useState([]);
    const [graphData, setGraphData]  = useState([]);
    const [displayGraphData, setDisplayGraphData] = useState([]);
    // const [loading, setLoading] = useState([false, false, false, false]);
    const [loading, dispatch] = useReducer((loading, { type, index, value }) => {
        switch (type) {
          case "update":
              let newArray = [...loading];
              newArray[index] = value;
              return newArray;
          default:
            return loading;
        }
      }, [false, false, false, false]);
    // get aisle list when this component is initially created
    useEffect(() => {
        // get aisle list 
        /* data format: {
            1: "snack",
            2: "can food",
            ...
        }*/
        const fetchAisles = async() => {
            const result = await axios.get(
                `http://localhost:5000/getAllAisles`,
            );
            setAisles(result.data.data);
        };
        fetchAisles();  
        setDisplayGraphData(graphData.slice(0, dropdownNum));
    }, [])

    useEffect(() => {
        // console.log("displayedItem list")
        // console.log(displayedItems.slice(0,dropdownNum));
        setDisplayedItems(selectedItems.slice(0,dropdownNum));
        setDisplayGraphData(graphData.slice(0, dropdownNum));
    }, [dropdownNum,selectedItems[0],selectedItems[1],selectedItems[2],selectedItems[3]])

    const handleAddItem = () => {
        setDropdownNum(dropdownNum+1);
    }

    const handleDeleteItem = () => {
        if(selectedItems[dropdownNum] !== 0) {
            let newList = selectedItems;
            newList[dropdownNum-1] = 0;
            setSelectedItems(newList);
            setGraphData(graphData.slice(0, -1));
        }
        setDropdownNum(dropdownNum-1);
    }

    const handleItemUpdate = (itemIndex, itemID) => {
        const newSelectedItems = selectedItems;
        newSelectedItems[itemIndex] = parseInt(itemID);
        const newDispItems = newSelectedItems.slice(0,dropdownNum);
        // console.log("display items");
        // console.log(newDispItems);
        setSelectedItems(newSelectedItems);
        setDisplayedItems(newDispItems);
        // console.log(selectedItems);

        dispatch({type: "update", index: itemIndex, value: true});
        // console.log(`loading: ${loading}`);

        // get and update graph data within this class accordingly
        const fetchPrediction = async() => {
            const result = await axios.get(
                `http://localhost:5000/getPrediction`,{
                    params: {id: itemID}
                }
            );
            // iterate through the data    
            const newLineData = {"id": itemID.toString()};
            const newCoordinates = [];
            for (let[key, value] of Object.entries(result.data)) {
                const date = new Date(parseInt(JSON.stringify(key).slice(1,-1), 10));
                const coordinate = {"x": `${date.getMonth()+1}/${date.getDate()}`, "y": Math.ceil(value)};
                newCoordinates.push(coordinate);
            }
            newLineData.data = newCoordinates;
            const newGraphData = graphData;
            newGraphData[itemIndex] = newLineData;
            setGraphData(newGraphData);
            const newDispGraphData = newGraphData.slice(0, dropdownNum);
            setDisplayGraphData(newDispGraphData);
            // console.log("graph data");
            // console.log(graphData);
            // console.log("displayed graph data");
            // console.log(newDispGraphData);
            
            dispatch({type: "update", index: itemIndex, value: false});
            // console.log(`loading: ${loading}`);

        };
        fetchPrediction();  
    }



    return (
        <Container style={inventoryInsightStyle}>
            <Box  display="flex" 
              flexDirection="row" 
              flexWrap="nowrap"
              justifyContent="left"
              alignItems="center">
                {displayedItems.map((item, index) => (
                    // <ItemDropDownMenu key={index} id={index} lineColor={lineColors[index]} itemList={itemList}/>
                    <ProductSelectionDialog 
                        key={index} 
                        index={index} 
                        lineColor={lineColors[index]} 
                        aisles={aisles} 
                        handleItemUpdate={handleItemUpdate}
                        loading={loading[index]}/>
                ))}
                {
                    dropdownNum > 1 ? (
                        <Tooltip title="Delete Item" placement="top" >
                            <IconButton aria-label="add an dropdown menu" onClick={handleDeleteItem}
                                style={{padding: 10}}>
                                <HighlightOffIcon style={{paddingBottom: 3}}/>
                            </IconButton>
                        </Tooltip>
                    ) : ""
                }
                {
                    dropdownNum === 4 ? "" : (
                        <Tooltip title="Add Item" placement="top" >
                            <IconButton aria-label="add an dropdown menu" onClick={handleAddItem}
                                style={{padding: 10}}>
                                <AddBoxIcon style={{paddingBottom: 3}}/>
                            </IconButton>
                        </Tooltip>
                    )
                }    
            </Box>
            <Graph graphData={displayGraphData} />
        </Container>
    )
}

export default InventoryInsight;