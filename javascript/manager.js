// JS HERE


var inquirer = require('inquirer');
var mysql = require('mysql');


var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
    user: 'root',
    password: 'password',
	database: 'Bamazonian'
});


function promptMan() {
	
inquirer.prompt([
		{
			type: 'list',
			name: 'option',
			message: 'Please select an option:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			filter: function (val) {
				if (val === 'View Products for Sale') {
					return 'sale';
				} else if (val === 'View Low Inventory') {
					return 'lowInventory';
				} else if (val === 'Add to Inventory') {
					return 'addInventory';
				} else if (val === 'Add New Product') {
					return 'newProduct';
				} else {
					// This case should be unreachable
					console.log('ERROR: Unsupported operation!');
					exit(1);
				}
			}
		}
	]).then(function(input) {
		
		if (input.option ==='sale') {
			disInv();
		} else if (input.option === 'lowInventory') {
			disLowInv();
		} else if (input.option === 'addInventory') {
			addInv();
		} else if (input.option === 'newProduct') {
			newProd();
		} else {
		
			console.log('ERROR: Unsupported operation!');
			exit(1);
		}
	})
}


function disInv() {
	query = 'SELECT * FROM products';

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
			str += 'Price: $' + data[i].price + '  //  ';
			str += 'Quantity: ' + data[i].stock_quantity + '\n';

			console.log(str);
		}

	  	console.log("---------------------------------------------------------------------\n");

		
		connection.end();
	})
}


function disLowInv() {
	
	query = 'SELECT * FROM products WHERE stock_quantity < 100';


	connection.query(query, function(err, data) {
		if (err) throw err;

		console.log('Low Inventory Items (below 100): ');
		console.log('................................\n');

		var str = '';
		for (var i = 0; i < data.length; i++) {
			str = '';
			str += 'Item ID: ' + data[i].item_id + '  //  ';
			str += 'Product Name: ' + data[i].product_name + '  //  ';
			str += 'Department: ' + data[i].department_name + '  //  ';
			str += 'Price: $' + data[i].price + '  //  ';
			str += 'Quantity: ' + data[i].stock_quantity + '\n';

			console.log(str);
		}

	  	console.log("---------------------------------------------------------------------\n");

		
		connection.end();
	})
}

function validateInteger(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}


function validateNumeric(value) {
	
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Please enter a positive number for the unit price.'
	}
}


function addInv() {
	
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID',
			validate: validateInteger,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How much product would you like to add?',
			validate: validateInteger,
			filter: Number
		}
	]).then(function(input) {

		var item = input.item_id;
		var addQuantity = input.quantity;

		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				addInv();

			} else {
				var productData = data[0];

				console.log('Updating Inventory...');

				
				var update = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;
				
				connection.query(update, function(err, data) {
					if (err) throw err;

					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
					console.log("\n--------------------------------------------------------\n");

					// End the database connection
					connection.end();
				})
			}
		})
	})
}

function newProd() {
	
	inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Please enter the product.',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Which department is the product apart of?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the price?',
			validate: validateNumeric
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'How many items are currently in stock?',
			validate: validateInteger
		}
	]).then(function(input) {
		

		console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +  
									   '    department_name = ' + input.department_name + '\n' +  
									   '    price = ' + input.price + '\n' +  
									   '    stock_quantity = ' + input.stock_quantity);

		
		var query = 'INSERT INTO products SET ?';

		
		connection.query(query, input, function (error, results, fields) {
			if (error) throw error;

			console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
			console.log("\n---------------------------------------------------------------------\n");

			
			connection.end();
		});
	})
}


function run() {
	
	promptMan();
}

run();