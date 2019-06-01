"use strict";

var model = require("./model.js");

module.exports.queryRestaurants = queryRestaurants;
module.exports.queryRestaurantMenus = queryRestaurantMenus;
module.exports.queryLocations = queryLocations;

function queryRestaurants(req, res) {
    model.load("restaurants", function(entities) {
        if(req.query.filter){
            try {
                req.query.filter = JSON.parse(req.query.filter);
            } catch(err) {
                console.log("Parsing error of filter object. Make sure it is correctly formatted.");
            }
        } else {
            req.query.filter = {};
        }

        for(var key in req.query.filter) {            
            entities = entities.filter(function(obj) {
                if(obj[key] !== undefined) {
                    return obj[key].toString().toLowerCase().indexOf(req.query.filter[key].toLowerCase()) > -1;
                }
                return true;
            });
        }
		console.log(req.query.filter);
		if(req.query.filter) {
			var ratingFrom = parseInt(req.query.filter.ratingFrom, 10);
			if(ratingFrom !== undefined  && !isNaN(ratingFrom)) {
				entities = entities.filter(function(obj) {
					return parseInt(obj.rating, 10) >= ratingFrom;
				});
			}
			var ratingTo = parseInt(req.query.filter.ratingTo, 10);
			if(ratingTo !== undefined && !isNaN(ratingTo)) {
				entities = entities.filter(function(obj) {
					return parseInt(obj.rating, 10) <= ratingTo;
				});
			}
		}

        var count = entities.length;
        entities = pagination(entities, req.query.page, req.query.pageSize);

        res.status(200).json({count: count, results: entities});
    });
}

function pagination(array, pageNumber, pageSize) {
    pageNumber = pageNumber || 1
    pageSize = pageSize || 50;

    var endIndex = pageSize * pageNumber,
        startIndex = endIndex - pageSize;
    if(endIndex > array.length) {
        return array.slice(startIndex);
    }
    return array.slice(startIndex, endIndex);
}

function queryRestaurantMenus(req, res) {
    model.load("menus", function(entities) {
		entities = entities.filter(function(obj) {
                if(obj['restaurants'] !== undefined) {
                    return obj['restaurants'] == parseInt(req.params.id);
                }
                return false;
            });
        res.status(200).json(entities[0]);
    });
}

function queryLocations(req, res) {
    model.load("locations", function(entities) {
        res.status(200).json(entities);
    });
}