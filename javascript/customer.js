//JS HERE

// Pull in required dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');

// Define the MySQL connection parameters


var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	// Your username
	user: 'root',

	// Your password
	password: 'password',
	database: 'Bamazonian'
});


// validateInput makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

function custPurch () {
    inquirer.prompt([
        {
        type: 'input',
        name: 'item_id',
        message: 'Please enter an item ID you would like to purchase.',
        validate: validateInput,
        filter: Number
        },

        {
            type: 'input',
            name: 'quantity',
            message: "Enter the amount of items you would like to purchase.",
            validate: validateInput,
            filter: Number
        }



    ]).then(function(input) {
        var item = input.item_id;
        var quantity = input.quantity;

        var query = "SELECT * FROM products WHERE ?";

        connection.query(query, {item_id : item}, function(err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log("Please enter a valid item and quauntity.");
                disInv();
            } else {
                var product = data[0];

                if (quantity <= product.stock_quantity) {
                    console.log("Request received. Item ordered")

                    var updateQuery = 'UPDATE products SET stock_quantity = ' + (product.stock_quantity - quantity) + ' WHERE item_id = ' + item;

                    connection.query(updateQuery, function(err, data) {
						if (err) throw err;

						console.log('Your oder has been placed! Your total is $' + product.price * quantity);
						console.log('Thank you for shopping with us!');
						console.log("\n---------------------------------------------------------------------\n");

						// End the database connection
						connection.end();
                    })
                    
				} else {
                    
                    console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");
                  
                    disInv();
                }
            }
        })
      })
    }

    function disInv() {
        // console.log('___ENTER displayInventory___');
    
        // Construct the db query string
        query = 'SELECT * FROM products';
    
        // Make the db query
        connection.query(query, function(err, data) {
            if (err) throw err;
    
            console.log('Existing Inventory: ');
            console.log('...................\n');
    
            var str = '';
            for (var i = 0; i < data.length; i++) {
                str = '';
                str += 'Item ID: ' + data[i].item_id + '  //  ';
                str += 'Product Name: ' + data[i].product_name + '  //  ';
                str += 'Department: ' + data[i].department_name + '  //  ';
                str += 'Price: $' + data[i].price + '\n';
    
                console.log(str);
            }
    
              console.log("---------------------------------------------------\n");
    
              //Prompt the user for item/quantity they would like to purchase
              custPurch();
        })
    }
    
    // runBamazon will execute the main application logic
    function init() {
        // console.log('___ENTER runBamazon___');
    
        // Display the available inventory
        disInv();
    }
    
    // Run the application logic
    init();