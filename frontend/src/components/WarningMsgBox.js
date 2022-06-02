import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    List,
    ListSubheader,
    ListItem,
    ListItemText,
    Tooltip,
    Button
} from "@material-ui/core";
import { Colors } from "./data";
import axios from "axios";

const WarningMsgBox = () => {
    const [realData, setrealData] = useState([]);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const classes = useStyles();

    useEffect(() => {        
        getWarningList();
        setIsActive(true);
    }, [])

    useEffect(() => {
        // console.log(realData)
        setrealData(realData.slice(0, -1))
    }, [])

    useEffect(() => {
        let interval = null;
        if (isActive && seconds < 10) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else {
            interval = setInterval(() => {
                setSeconds(0);
                getWarningList();
            }, 1000);;
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const getWarningList = async () => {
        const result = await axios.get(
            `http://localhost:5000/getWarnings `
        );
        var testingData = []
        var gotData = result.data.data
        // console.log(gotData)
        if(gotData.length > 0) {
            setrealData(gotData)
        }
        // if(gotData.length > 0) {
        //     setrealData(realData.splice(0,realData.length));
        //     gotData = gotData.replace("[(", "");
        //     gotData = gotData.replace(")]", "");
        //     testingData = gotData.split("), (");
        //     let newRealData = [...realData];
        //     for (var i = 0; i < testingData.length; i++) {
        //         var val = testingData[i].split(",")
        //         // console.log(val[0].replaceAll("'", ""))
        //         // console.log(val[1].replaceAll("'", ""))
        //         newRealData.push({
        //             id: val[0].replaceAll("'", ""),
        //             value: val[1].replaceAll("'", ""),
        //             quantity: val[2].replaceAll("'", "")
        //         })
        //     }
        //     setrealData(newRealData)
        // }
    }

    const removeWarn = async (itemID) => {
        const result = await axios.post(
            `http://localhost:5000/removeWarn `, {
            params: { id: itemID }
        }
        );
        getWarningList();
    }
    
    return (
        <div style={{ width:"25%"}}>
            <List className={classes.root} >
                <ListSubheader className={classes.msg}>Warning Messages</ListSubheader>
                {realData.map((item, index) => (
                    <ListItem key={`item-${index}`} >
                        <Tooltip disableFocusListener disableTouchListener title="Number of items to purchase for the next order" placement="bottom-end" arrow>
                        <ListItemText primary={`${item.name}`} secondary={`Optimal Quantity: ${item.quantity}`} />
                        </Tooltip>
                        <Button
                            color="primary"
                            onClick = {(e) => removeWarn(item.id, e)}>
                        X
                        </Button>

                    </ListItem>
                ))}
                </List>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "70%",
        maxWidth: 500,
        backgroundColor: Colors.classicBlue,
        color: Colors.white,
        position: "relative",
        overflow: "auto",
        padding: 0,
    },
    msg: {
        color: Colors.orange,
        fontSize: 20,
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
}));



export default WarningMsgBox;