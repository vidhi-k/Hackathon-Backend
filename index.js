const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Customer = require("./models/Customer");
const Agent = require("./models/Agent");
const Shop = require("./models/Shop");

const PORT = process.env.PORT || 9000;
const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());


const connection_url = "mongodb+srv://" + process.env.MONGO_USER + ":" + process.env.PASSWORDMONGO + "@cluster0.xynqggk.mongodb.net/postmandb?retryWrites=true&w=majority";

mongoose.connect(connection_url, () => {
    console.log("connected to db")
});


//customer signup
app.post("/customer/signup", async(req, res) => {
    try {
        const {name,contact, password} = req.body;
        const user = await Customer.findOne({contact});
        if(user) throw new Error("user already exists");
        else {
            const result = await Customer.create({name,contact,password});
            res.status(201).json(result);
        }        
    } catch (e){
        let msg;
        if(e.code == 11000){
            msg = "User alrady exists";
        } else {
            msg = e.message;
        }
        console.log(e);
        res.status(400).json(msg);
    }
});


//customer login
app.post("/customer/login", async(req, res) => {
    try {
        const {contact, password} = req.body;
        const user = await Customer.findOne({contact});
        if(!user) throw new Error('invalid name or password')
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) throw new Error('invalid name or password')
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

//agent signup
app.post("/agent/signup", async(req, res) => {
    try {
        const {name,contact,password} = req.body;
        const user = await Agent.findOne({contact});
        if(user) throw new Error("user already exists");
        else {
            const result = await Agent.create({name,contact,password});
            res.status(201).json(result);
        }        
    } catch (e){
        let msg;
        if(e.code == 11000){
            msg = "User alrady exists";
        } else {
            msg = e.message;
        }
        console.log(e);
        res.status(400).json(msg);
    }
});

//agent login
app.post("/agent/login", async(req, res) => {
    try {
        const {contact, password} = req.body;
        const user = await Agent.findOne({contact});
        if(!user) throw new Error('invalid name or password')
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) throw new Error('invalid name or password')
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

//posting location of shop
app.post("/enter/location", async(req, res) => {
    try{
        const {name, contact, longitude, latitude, businessName, address,category, description, listOfItems} = req.body;
        const shop = await Shop.create({name,contact, longitude, latitude,businessName, address, category, description, listOfItems});
        res.status(201).json(shop);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

//getting locations of all shops
app.get("/get/shops", async(req, res) => {
    try {
        // console.log("here");
        const shops =  Shop.find({}, (err, docs) => {
            res.send(docs);
            // console.log(docs);
        });
    } catch (error) {
        console.log(error);
    }
});

//seller
app.get("/seller/shops", async(req, res) => {
    try {
        const shops =  Shop.find({}, (err, docs) => {
            res.send(docs);
            console.log(docs);
        });
    } catch (error) {
        console.log(error);
    }
});

//updating list of items
app.patch("/updateList", async(req, res) => {
    const nameA = req.body.name;
    const shopName = req.body.businessName;
    const newItem = req.body.newItem;

    // console.log(nameA + " " + shopName + " " + newItem);
    await Shop.updateOne({"name": nameA, "businessName": shopName}, {$push: {listOfItems: [newItem]}}, 
    function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }).clone().catch(function(err){ console.log(err)});
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});