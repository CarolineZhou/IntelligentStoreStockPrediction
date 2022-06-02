import React from "react";
import { useSelector }  from "react-redux";
import {Box,
        List,
        ListItem,
        ListItemText } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Colors } from "../components/data";

const useStyles = makeStyles((theme) => ({
    msg: {
        padding: 0,
        margin: 0,
        height: 20,
        float: "center",
        color: Colors.classicBlue,
    },
}));

const RecMsg = () => {
    const classes = useStyles();
    const rec = useSelector(state => state.itemReducer.recommendations);

    const generateList = (name, weeklyN, biweeklyN, includeDivider) => {
        return (
            <List className={classes.msg} key={name}>
                <ListItem className={classes.msg}
                 divider={true} style={{paddingRight: 10, paddingLeft: 10, borderLeft: includeDivider ? "1px solid darkgrey": ""}}>
                    <ListItemText primary={name} style={{textAlign: "center"}}/>
                </ListItem>
                <ListItem className={classes.msg}
                divider={true} style={{paddingRight: 10, paddingLeft: 10, borderLeft: includeDivider ? "1px solid darkgrey": ""}}>
                    <ListItemText primary={weeklyN} style={{textAlign: "center"}}/>
                </ListItem>
                <ListItem className={classes.msg}
                style={{paddingRight: 10, paddingLeft: 10, borderLeft: includeDivider ? "1px solid darkgrey": ""}}>
                    <ListItemText primary={biweeklyN} style={{textAlign: "center"}}/>
                </ListItem>
            </List>
        )
    }

    return (
        <div style={{float: "left"}}>
            <p className={classes.msg} style={{color: "darkgrey", textAlign: "center"}}>RECOMMENDATIONS</p>
            <Box  display="flex" 
              flexDirection="row" 
              flexWrap="nowrap"
              justifyContent="center"
              alignItems="center">
                {generateList("   ","WEEKLY  ", "BI-WEEKLY  ", false)}
                {
                    rec.map((i) => {
                        return (generateList(i.name, i.weeklyN, i.biweeklyN, true))
                    })
                }
            </Box>
        </div>
    )
}


export default RecMsg;