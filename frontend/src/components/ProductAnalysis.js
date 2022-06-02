import React, {useState, useEffect} from "react";
import { 
    Button,
    Grid,
    LinearProgress,
    Table,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    Paper, 
    TableContainer
} from '@material-ui/core';
import axios from "axios";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import {Colors} from "./data";

const ProductAnalysis = () => {
    const [startDate, setStartDate] = useState(new Date("2019-01-01T00:00:00"));
    const [endDate, setEndDate] = useState(new Date("2019-01-02T00:00:00"));
    const [data, setData] = useState([]);
    const [minDate, setMinDate] = useState(new Date("2019-01-01T00:00:00"));
    const [maxDate, setMaxDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let unmounted = false;

        const fetchMinDate = async() => {
            const result = await axios.get(
                `http://localhost:5000/getMinDate`,
            );
            if(!unmounted) {
                console.log(`min date: ${result.data}`);
                setMinDate(new Date(result.data));
                setStartDate(new Date(result.data));
            }
        };
        fetchMinDate();

        const fetchMaxDate = async() => {
            const result = await axios.get(
              `http://localhost:5000/getMaxDate`,
            );
            if(!unmounted) {
                console.log(`max date: ${result.data}`);  
                console.log(new Date(result.data));                              
                setMaxDate(new Date(result.data));
            }
          };
        fetchMaxDate();

        return () => {unmounted = true}; // return function so when component unmount this will run.
    }, []);

    const handleStartDateChange = (date) => {
        if(date.getTime() >= minDate.getTime() && date.getTime() < endDate.getTime()) {
            setStartDate(date);
        }
    };  
    
    const handleEndDateChange = (date) => {
        if(date.getTime() <= maxDate.getTime() && date.getTime() > startDate.getTime()) {
            setEndDate(date);
        }
    }; 

    useEffect(() => {
        let unmounted = false;

        if(loading) {
            console.log(`startDate: ${startDate}`);
            console.log(`endDate: ${endDate}`);
            const startDateUTC = `${startDate.getUTCFullYear()}-${startDate.getUTCMonth()+1}-${startDate.getUTCDate()} 00:00:00`;
            const endDateUTC = `${endDate.getUTCFullYear()}-${endDate.getUTCMonth()+1}-${endDate.getUTCDate()} 00:00:00`;  
            
            const fetchData = async() => {
                const result = await axios.get(
                  `http://localhost:5000/FDMProducts`, {
                    params: {start_ts: startDateUTC, end_ts: endDateUTC}
                  } 
                );
                if(!unmounted) {
                    setLoading(false);
                    setData(result.data);
                }
              };
            fetchData();
        }
        return () => {unmounted = true};
    }, [loading]);

    return (
        <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <Grid container justify="space-evenly">
                    <KeyboardDatePicker 
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="startDate"
                        label="Start Date"
                        minDate={minDate}
                        maxDate={maxDate}
                        value={startDate}
                        onChange={handleStartDateChange}
                        KeyboardButtonProps={{
                            "aria-label": "change date"
                        }}
                        disabled={loading}
                    />
                    <KeyboardDatePicker 
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="endDate"
                        label="End Date"
                        minDate={minDate}
                        maxDate={maxDate}
                        value={endDate}
                        onChange={handleEndDateChange}
                        KeyboardButtonProps={{
                            "aria-label": "change date"
                        }}
                        disabled={loading}
                    />
                    <Button 
                        color="primary"
                        onClick={() => setLoading(true)}
                        disabled={loading}>
                        Submit
                    </Button>
                </Grid>
            </MuiPickersUtilsProvider>
            {loading && <LinearProgress />}
            <Grid container justify="center" >
                <TableContainer style={{maxWidth: "75vw"}} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow >
                            <TableCell>Antecedents</TableCell>
                            <TableCell>Consequents</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(!loading && data.length === 0) ? 
                            <TableRow>
                                <TableCell style={{color: Colors.orange}}>Please submit time info first.</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            :
                            data.map((d, index) => {
                                const consequent = d.slice(1,).join(",");
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{d[0]}</TableCell>
                                        <TableCell>{consequent}</TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
                </TableContainer>
            </Grid> 
        </div>   
    )
}



export default ProductAnalysis;