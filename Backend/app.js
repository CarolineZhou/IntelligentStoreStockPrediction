const express = require("express");
const {spawn} = require("child_process");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // to use data in the .env file

const DB = require("./database");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/getAllAisles", (request, response) => {
    console.log("####################################");
    const db = DB.getDBInstance();
    const result = db.getAllAisles();
    
    result
        .then(data => response.json({
            data: data
        }))
        .catch(err => console.log(err));
});

app.get("/FDMCustomers", (req, res) => {
    console.log("####################################");
    console.log("received FDMCustomers get request");
    console.log(`start_ts: ${req.query.start_ts}`);
    console.log(`end_ts: ${req.query.end_ts}`);
    let dataToSend;
    const python = spawn("python", ["./python/FDMCustomer.py", req.query.start_ts, req.query.end_ts]);
    python.stdout.on("data", (data) => {
        console.log("data from python script: ");
        dataToSend = data.toString();
    });

    // make sure that child process is closed
    python.on("close", (code) => {
        console.log(`child process close all stdio with code ${code}`);
        res.send(dataToSend);
        console.log(dataToSend)
    });
});

app.get("/FDMProducts", (req, res) => {
    console.log("####################################");
    console.log("received FDMProducts get request");
    console.log(`start_ts: ${req.query.start_ts}`);
    console.log(`end_ts: ${req.query.end_ts}`);
    let dataToSend;
    const python = spawn("python", ["./python/FDMProducts.py", req.query.start_ts, req.query.end_ts]);
    python.stdout.on("data", (data) => {
        console.log("data from python script: ");
        dataToSend = data.toString();
    });

    // make sure that child process is closed
    python.on("close", (code) => {
        console.log(`child process close all stdio with code ${code}`);
        res.send(dataToSend);
        console.log(dataToSend)
    });
});

app.get("/getMinDate", (request, response) => {
    console.log("####################################");
    console.log("received getMinDate get request");
    let dataToSend;
    const python = spawn("python", ["./python/getMinDate.py",]);
    python.stdout.on("data", (data) => {
        console.log("data from python script: ");
        dataToSend = data.toString();
    });

    // make sure that child process is closed
    python.on("close", (code) => {
        console.log(`child process close all stdio with code ${code}`);
        response.send(dataToSend);
        console.log(dataToSend)
    });
});

app.get("/getMaxDate", (request, response) => {
    console.log("####################################");
    console.log("received getMaxDate get request");
    let dataToSend;
    const python = spawn("python", ["./python/getMaxDate.py",]);
    python.stdout.on("data", (data) => {
        console.log("data from python script: ");
        dataToSend = data.toString();
    });

    // make sure that child process is closed
    python.on("close", (code) => {
        console.log(`child process close all stdio with code ${code}`);
        response.send(dataToSend);
        console.log(dataToSend)
    });
});

app.get("/getPrediction", (req, res) => {
    console.log("####################################");
    console.log(req.query.id);
    let dataToSend;
    const python = spawn("python", ["./python/TimeSeriesAnalysis.py", req.query.id]);
    python.stdout.on("data", (data) => {
        console.log("data from python script: ");
        console.log(data.toString());
        dataToSend = data.toString();
    });

    python.stderr.on('data', function(data) {
        console.error(data.toString());
    });

    // make sure that child process is closed
    python.on("close", (code) => {
        console.log(`child process close all stdio with code ${code}`);
        res.send(dataToSend);
    });
});

app.get("/getAllDepartments", (request, response) => {
    console.log("####################################");
    const db = DB.getDBInstance();
    const result = db.getAllDepartments();
    
    result
        .then(data => response.json({
            data: data
        }))
        .catch(err => console.log(err));
});

app.get("/getAllAisles", (request, response) => {
    console.log("####################################");
    const db = DB.getDBInstance();
    const result = db.getAllAisles();
    
    result
        .then(data => response.json({
            data: data
        }))
        .catch(err => console.log(err));
});

app.get("/getProductList", (request, response) => {
    console.log("####################################");
    const db = DB.getDBInstance();
    const result = db.getProductList(request.query.aisle_id);
    
    result
        .then(data => response.json({
            data: data
        }))
        .catch(err => console.log(err));
});

app.get("/getProductName", (request, response) => {
    console.log("####################################");
    const db = DB.getDBInstance();
    const result = db.getProductName(request.query.id);
    
    result
        .then(data => response.json({
            data: data
        }))
        .catch(err => console.log(err));
});

app.post("/DataPre_Process", (req, res) => {
    let dataToSend;
    const python = spawn("python", ["./python/Data_PreProcess.py"]);

    python.stdout.on("data", (data) => {
        console.log("data from python script: ");
        console.log(data.toString());
        dataToSend = data.toString();
    });

    // make sure that child process is closed
    python.on("close", (code) => {
        console.log(`child process close all stdio with code ${code}`);
        res.send(dataToSend);
    });
});

// app.get("/getWarnings", (req, res) => {
//     let dataToSend;
//     const python = spawn("python", ["./python/getWarnings.py"]);

//     python.stdout.on("data", (data) => {
//         console.log("getWarnings get request");
//         console.log("data from python script: ");
//         console.log(data.toString());
//         dataToSend = data.toString();
//     });

//     // make sure that child process is closed
//     python.on("close", (code) => {
//         console.log(`child process close all stdio with code ${code}`);
//         res.send(dataToSend);
//     });
// });

app.get("/getWarnings", (request, response) => {
    console.log("getWarnings");
    const db = DB.getDBInstance();
    const result = db.getWarnings();
    result
        .then(data => response.json({
            data: data
        }))
        .catch(err => console.log(err));
});

// app.post("/removeWarn", (request, response) => {
//     console.log("getWarnings");
//     const db = DB.getDBInstance();
//     const result = db.removeWarn(request.body.params.id);
// });

app.post("/removeWarn", (req, res) => {
    let dataToSend;
    console.log("In removal get call")
    console.log(req.body.params.id)
    const python = spawn("python", ["./python/removeWarn.py", req.body.params.id]);

    python.stdout.on("data", (data) => {
        console.log("data from python script: ");
        console.log(data.toString());
        dataToSend = data.toString();
    });

    // make sure that child process is closed
    python.on("close", (code) => {
        console.log(`child process close all stdio with code ${code}`);
        res.send(dataToSend);
    });
});


app.listen(process.env.PORT, () => console.log('app is running'));
