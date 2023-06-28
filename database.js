
//connecting Database

const mysql = require('mysql2');

const connection = mysql.createConnection({
	host : 'localhost',
	database : 'form',
	user : 'root',
	password : 'Bhargi@2'
});


connection.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('MYSQL Database is connected Successfully');
	}
});

module.exports = connection;

