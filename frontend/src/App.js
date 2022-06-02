import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import styled from 'styled-components';
import {Colors} from "./components/data";

import Home from "./components/Home";
import CustomerAnalysis from "./components/CustomerAnalysis";
import ProductAnalysis from "./components/ProductAnalysis";

function App() {
  return(
    <Wrapper>
        <Router>
            <div>
                <div>
                    <ul className="nav-ul">
                        <li className="nav-li">
                            <Link to={`/`}>Home</Link>
                        </li>
                        <li className="nav-li">
                            <Link to={`/Cust`}>Customer Analysis</Link>
                        </li>
                        <li className="nav-li">
                            <Link to={`/Product`}>Product Analysis</Link>
                        </li>
                    </ul>
                </div>
                <div id='container'>
                    <Switch>
                        <Route path={`/Product`}>
                            <ProductAnalysis />
                        </Route>
                        <Route path={`/Cust`}>
                            <CustomerAnalysis />
                        </Route>
                        <Route path={`/`}>
                            <Home />
                        </Route>
                    </Switch>        
                </div>
            </div>
        </Router>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    .nav-ul {
        background-color: ${Colors.classicBlue};
        color: ${Colors.white};
        margin-top: 0;
        padding: 2vh 3vw 1vh 10px;
        position: sticky;
        overflow: hidden;
        list-style-type: none;
        height: 5vh;
        display: flex;
        justify-content: center;
    }

    .nav-li {
        float: left;
        text-decoration: none;
        text-align: center; 
        margin-right: 18px;

        a {
            text-decoration: none;
            color: white;
        }

        a:hover {
            color: ${Colors.orange};
        }
    }
    h3 {
        margin: 0;
    }
`;

export default App;
