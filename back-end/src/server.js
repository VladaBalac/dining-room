"use strict";

var express = require("express"),
	app = express(),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    controller = require("./controller.js");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cors());

app.use(express.static(__dirname + '/public'));

app.route("/api/restaurants")
    .get(controller.queryRestaurants);
app.route("/api/restaurants/:id/menus")
    .get(controller.queryRestaurantMenus);

app.route("/api/locations")
    .get(controller.queryLocations);

app.listen(3000, function() {
    console.log("Server started");
});