import React from 'react';
import { store } from "../actions/store";
import { Provider } from "react-redux";
import {Container,
        Box} from "@material-ui/core";
import WarningMsgBox from "./WarningMsgBox";
import InventoryInsight from "./InventoryInsight";

function Home() {
  return (
    <Provider store={store}>
      <Container maxWidth="lg" style={containerStyle}>
        <Box  display="flex" 
              flexDirection="row" 
              flexWrap="nowrap"
              justifyContent="center"
              alignItems="top"
              style={containerStyle}>
          <WarningMsgBox />
          <InventoryInsight />
        </Box>
      </Container>
    </Provider>
  );
}

const containerStyle = {
  //backgroundColor: "blue",
  height: "100vh",
}


export default Home;
