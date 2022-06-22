const express = require('express');
const bodyParser = require("body-parser");
const fs = require("fs");

let myStates = require("./myStates.json");

const app = express();
const PORT = 3000;


//use as a get request
app.get('/get', (req, res) => {
    res.status(200);
    res.send("This is the root URL of Server");
});

//The express.json() middleware is used to parses the incoming request object as a JSON object. 
//The app.use() is the syntax to use any middleware. After then we have created a route on path ‘/’ for post request. 
app.use(express.json());
app.post('/', (req, res) => {
    const { name } = req.body;

    res.send(`Welcome ${name}`);
})

app.get('/hello', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.status(200).send("<h1>This get method is has set the contents of this page into HTML!</h1>");
});


//save function
const save = () => {
    fs.writeFile(
        "./myStates.json",
        JSON.stringify(myStates, null, 2),
        (error) => {
            if (error) {
                throw error;
            }
        }
    );
};

//READ(R) in CRUD
app.get("/about", (req, res) => {
    res.json(myStates);
});
app.get("/about/:name", (req, res) => {
    const findState = myStates.find((state) => state.name === req.params.name);
    res.json(findState);
});

//CREATE(C) in CRUD
app.post("/about", bodyParser.json(), (req, res) => {
    myStates.push(req.body);
    save();
    res.json({
        status: "success",
        stateInfo: req.body,
    });
});

//UPDATE(U) in CRUD
app.put("/about/:name", bodyParser.json(), (req, res) => {
    myStates = myStates.map((state) => {
        if (state.name === req.params.name) {
            return req.body;
        } else {
            return state;
        }
    });
    save();
    res.json({
        status: "success",
        stateInfo: req.body,
    });
});

//DELETE(D) in CRUD
app.delete("/about/:name", (req, res) => {
    myStates = myStates.filter((state) => state.name !== req.params.name);
    save();
    res.json({
        status: "success",
        removed: req.params.name,
        newLength: myStates.length,
    });
});

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is now Running, and App is listening to port " + PORT)
    else
        console.log("Error !!!, server can't start due to:", error);
}

);