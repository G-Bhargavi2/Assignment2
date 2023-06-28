var express = require("express");

var router = express.Router();

var database = require('../database');
var id = "";

//Login page
router.get("/", function(request, response, next){

	response.render("login", {title:'Login'});

});


router.post("/data", function(request, response, next){

    id = request.body.id;
    var password = request.body.password;

    //Inserts login details into auth table in database
	var query = `
	INSERT INTO auth 
	(id, password) 
	VALUES ("${id}", "${password}")
	`;

	database.query(query, function(error,data){
        
		if(error)
		{
			throw error;
		}	
		else
		{
            var prefix = id.slice(0,3).toLowerCase();
            var isCustomer = prefix == 'cus';

            // If Signed In is a Customer rendering Customer view
            if (isCustomer){

                response.render('customer', {title :"Order Details"});
            }
            // If Signed In is an Admin rendering Admin view
            else{
                var query = `SELECT SUM(quantity) as quantitySum, SUM(weight) as weightSum, 
                SUM(boxCount) as boxCountSum 
                FROM 
                customer 
                GROUP BY id`;
                database.query(query, function(error, data){

                    if(error)
                    {
                        throw error;
                    }	
                    else
                    {
                        var sumOfQuantities = 0 ;
                        var sumOfWeights = 0;
                        var sumOfBoxCount = 0;
                        data.forEach(function (item){
                            sumOfQuantities += parseInt(item.quantitySum);
                            sumOfWeights += parseFloat(item.weightSum);
                            sumOfBoxCount += parseInt(item.boxCountSum);

                        });
                        response.render("admin" , { quantitiesData:data,
                        sumOfQuantities : sumOfQuantities,
                        sumOfWeights : sumOfWeights,
                        sumOfBoxCount : sumOfBoxCount
                     })
                    }
                });
            }
            
		}

    });

});

//Customer providing order details and stored in customer table along with Customer ID

router.post('/order_details', function(request,response,next){
    var orderDate = request.body.orderDate;
    var company = request.body.company;
    var owner = request.body.owner;
    var item = request.body.item;
    var quantity = request.body.quantity;
    var weight = request.body.weight;
    var reqForShipment = request.body.reqShipment;
    var trackingId = request.body.trackingId;
    var shipmentSize = request.body.shipmentSize;
    var boxCount = request.body.boxCount;
    var specification = request.body.specification;
    var checklistQuantity = request.body.checklistQuantity;
    var query = `
	INSERT INTO customer 
	(id, orderdate, company, owner, item, quantity, weight, shipmentreq, trackingid, shipmentsize,
        boxcount, specification, checklistquantity ) 
	VALUES ("${id}", "${orderDate}", "${company}", "${owner}"
    , "${item}", "${quantity}", "${weight}"
    , "${reqForShipment}", "${trackingId}", "${shipmentSize}"
    , "${boxCount}", "${specification}", "${checklistQuantity}" )
	`;

    database.query(query, function(error,data){

        if(error){
            throw error;
        }
        else{
            response.write("<h1>Successfully stored at database</h1>")
            
        }
    });


});

module.exports = router;

