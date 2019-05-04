//JS HERE

// Pull in required dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');

// Define the MySQL connection parameters

function connect() {
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	// Your username
	user: 'root',

	// Your password
	password: 'password',
	database: 'Bamazonian'
});
}

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
        var quantity = input.quantity_id;

        var query = "SELECT * FROM products WHERE ?";

        connection.query(query, {item_id : item}, function(err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log("Please enter a valid item and quauntity.");

                disInv();
            }
        })



    })
}