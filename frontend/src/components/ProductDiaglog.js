import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    List,
    ListItem,
    ListItemText,
    DialogTitle,
    DialogActions,
    Dialog,
    Typography,
    FormControl,
    InputLabel,
    Select,
    Input,
    Divider,
    LinearProgress
} from "@material-ui/core";
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { Colors } from "./data";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 200,
        backgroundColor: Colors.white,
    },
    paper: {
        width: '80%',
        maxHeight: 500,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    buttonProgress: {
        color: green[500],
    },
}));

const ProductSelectionDialogRaw = (props) => {
    const classes = useStyles();
    const { onClose, value: valueProp, open, ...other } = props;
    const [product, setProduct] = useState(valueProp);
    const [aisle, setAisle] = useState("");
    const [productList, setProductList] = useState([])

    useEffect(() => {
        if (!open) {
        setProduct(valueProp);
        }
    }, [valueProp, open]);

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(product);
    };

    const handleChange = (event) => {
        if (event.target.name === "aisle"){
            setAisle(event.target.value);
        }else if (event.target.name === "product"){
            setProduct(event.target.value);
        }
    };

    // if either aisle or dep value is changed
    // if both aisle and dep value is not empty
    // then get product list from the backend (pass in aisle and dep as params)
    useEffect(() => {
        if (aisle !== ""){
            const fetchProductList = async() => {
                const result = await axios.get(
                  `http://localhost:5000/getProductList`, {
                    params: {aisle_id: aisle}
                  } 
                );
                setProductList(result.data.data)
              };
            fetchProductList();
        }
    }, [aisle])

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="dialog"
            open={open}
            {...other}
            disabled={true}
        >
        <DialogTitle>Select an Aisle!</DialogTitle>
        <Divider />
        <form className={classes.container} >
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="aisle-selection">Aisle:</InputLabel>
                <Select 
                    native
                    name="aisle"
                    value={aisle}
                    onChange={handleChange}
                    input={<Input id="aisle-selection" />}
                >
                    <option key="0" aria-label="None" value=""/>
                    {props.aisles.map((a) => (
                        <option key={`${a.id.toString()}`} value={a.id.toString()} >{a.name}</option>
                    ))}
                </Select>
            </FormControl>
        </form>
        <Divider />
        {aisle === "" ? (<></>) : 
        (
            <>
            <DialogTitle>Select an Product to Display</DialogTitle>
            <Divider />
            <form className={classes.container} >
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="product-selection">Product:</InputLabel>
                    <Select 
                        native
                        name="product"
                        value={product}
                        onChange={handleChange}
                        input={<Input id="product-selection" />}
                    >
                        <option key="0" aria-label="None" value=""/>
                        {productList.map((a) => (
                            <option key={`${a.id.toString()}`} value={a.id.toString()} >{a.name}</option>
                        ))}
                    </Select>
                </FormControl>
            </form>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="primary">
                    Ok
                </Button>
            </DialogActions>
            </>
        )} 
        </Dialog>
    );
}

ProductSelectionDialogRaw.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
};

const ProductSelectionDialog = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('select a product');

    const handleClickListItem = () => {
        setOpen(true);
    };

    const handleClose = (newValue) => {
        setOpen(false);  

        if (newValue && newValue !== "select product" && newValue !== value) {
            const fetchProductList = async() => {
                const result = await axios.get(
                    `http://localhost:5000/getProductName`, {
                        params: {id: newValue}
                    } 
                );
                setValue(result.data.data[0].name);
                props.handleItemUpdate(props.index, newValue);
            };
            fetchProductList();
        }
    };

    return (
        <div className={classes.root}>
            <List component="div" role="list">
                <ListItem
                    button
                    divider
                    aria-haspopup="true"
                    onClick={handleClickListItem}
                    role="listitem"
                    disabled={props.loading}
                >
                <ListItemText disableTypography primary={<Typography style={{ color: props.lineColor, overflow: "hidden"}}>{props.loading ? `retrieving graph data` : `${value}`}</Typography>}/>
                </ListItem>
                <ProductSelectionDialogRaw
                    classes={{
                        paper: classes.paper,
                    }}
                    id="product-menu"
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    value={value}
                    aisles={props.aisles}
                />
            </List>
            {/* <CircularProgress size={24} className={classes.buttonProgress} /> */}
            {props.loading && <LinearProgress />}
        </div>
    );
}

export default ProductSelectionDialog;