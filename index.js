var express 	= require('express');
var sensorLib 	= require('node-dht-sensor');
var dateFormat 	= require('dateformat');
var bodyParser 	= require('body-parser');
var BMP085 		= require('./bmp085');
var exec 		= require('child_process').exec;
var exitHandler = require('./exitHandler.js');
    
barometer = new BMP085({'mode':2});

/* 
	Mysql-config 
*/
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'pi_weather',
  timezone: 'mez'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting to DB: ' + err.stack);
    return;
  }

  console.log('connected to Mysql-DB as id ' + connection.threadId);
  //DELETE FROM data_log WHERE time < (NOW() - INTERVAL 5 HOUR)
});

exitHandler.db_connection = connection;

/*
	initiate express
*/
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
	global variables
*/
var temp = 0;
var humidity = 0.00;
var pressure = 0.00;
var time = 0;
var logTimer = 10;

/*
	set routes for web-interface
*/

app.get('/api/live/sensor', function(req, res)
{
	res.type('application/json');
	res.status(200);
	res.json(
	{
		"temperature": temp,
		"pressure": pressure,
		"humidity": humidity,
		"time": time
	});
});

app.get('/api/live/sensor/temperature', function(req, res)
{
	res.type('application/json');
	res.status(200);
	res.json({"temperature": temp, "time": time});
});

app.get('/api/live/sensor/humidity', function(req, res)
{
	res.type('application/json');
	res.status(200);
	res.json({"humidity": humidity, "time": time});
});

app.get('/api/live/pressure', function(req, res)
{
	res.type('application/json');
	res.status(200);
	res.json({"pressure": pressure, "time": time});
});

app.get('/api/history/sensor', function(req, res)
{
	connection.query('SELECT * FROM `data_log`', function (err, results, fields) {
		if (err) throw err;
		res.type('application/json');
		res.status(200);
		res.json(results);
	});
});

app.get('/api/history/sensor/temperature', function(req, res)
{
	connection.query('SELECT UNIX_TIMESTAMP(time) AS time, temperature FROM `data_log`', function (err, results, fields) {
		if (err) throw err;
		res.type('application/json');
		res.status(200);
		res.json({data: results});
	});
});

app.get('/api/history/sensor/humidity', function(req, res)
{
	connection.query('SELECT UNIX_TIMESTAMP(time) AS time, humidity FROM `data_log`', function (err, results, fields) {
		if (err) throw err;
		res.type('application/json');
		res.status(200);
		res.json({data: results});
	});
});

app.get('/api/history/sensor/pressure', function(req, res)
{
	connection.query('SELECT UNIX_TIMESTAMP(time) AS time, pressure FROM `data_log`', function (err, results, fields) {
		if (err) throw err;
		res.type('application/json');
		res.status(200);
		res.json({data: results});
	});
});

app.get('/api/history/delete', function(req, res)
{
    connection.query('DELETE FROM `data_log` WHERE 1', function (err, results, fields) {
        if (err) throw err;
		logTimer = 10;		
		sensor.read();
	    read_pressure();		
        res.type('application/json');
        res.status(200);
        res.json(results);
    });
});


app.get('/api/control/shutdown', function(req, res)
{		
	res.type('application/json');
	res.status(200);
	res.json('{"status" : "ok"}');
	require('child_process').exec('shutdown -h now', console.log);
	process.exit();
});

app.get('/api/control/reboot', function(req, res)
{		
	res.type('application/json');
	res.status(200);
	res.json('{"status" : "ok"}');
	require('child_process').exec('reboot', console.log);
    process.exit();
});


//Error-Handling
app.use(function(req,res){
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
	res.type('text/plain');
	res.status(500);
	res.send('500 - Internal error: ' + err);
});


/*
	
	Sensors
	
*/
//DHT_22 Sensor
var sensor = {
    initialize: function () {
        return sensorLib.initialize(22, 17);
    },
    read: function () {
        var readout = sensorLib.read();
        
        //console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
        //    'humidity: ' + readout.humidity.toFixed(2) + '%');
        temp = readout.temperature.toFixed(1);
        humidity = readout.humidity.toFixed(0);

    }
};

// save sensor-data to Database
var log_Data = {
	save: function()
	{
		var date= new Date();
	        time = dateFormat(date, 'dd.mm.yyyy HH:MM:ss');
		
		console.log("Logtimer: " + logTimer);
		if (logTimer<10)
		{
			logTimer += 1;
			return;
		}
		else
		{
		   	logTimer=0;
		}
		/*
			
			create internal timestamp
			
		*/
        /*
	        
	        save data to db
	        
	    */
		var sql = "INSERT INTO `pi_weather`.`data_log` (`time`, `temperature`, `humidity`, `pressure`) VALUES (CURRENT_TIMESTAMP, '" + temp + "', '" + humidity + "', '" + pressure + "');";
		connection.query(sql, function(err) {
		if (err) throw err;
			console.log("Insert new Data");
		});
		
		
		/*
			check for old data to remove
			
		*/
		var sql = "DELETE FROM `pi_weather`.`data_log` WHERE time < (NOW() - INTERVAL 30 DAY)";
		
		connection.query(sql, function(err) {
		if (err) throw err;
			console.log("Delete old data");
		});
	}
}

//BMP180/085
function read_pressure()
{
	barometer.read(function (data) {
	    console.log("Temperature:", data.temperature);
	    console.log("Pressure:", data.pressure);
	    //temp = data.temperature.toFixed(1);
	    pressure = data.pressure.toFixed(2);
	    log_Data.save(); 
	});
	
}

if (sensor.initialize()) {
    sensor.read();
	read_pressure();
    console.log("sensor initiated");
} else {
    console.warn('Failed to initialize sensor');
}
/*
setTimeout(function () {
    	sensor.read();
	read_pressure();
	var date= new Date();
        time = dateFormat(date, 'dd.mm.yyyy HH:MM:ss');
    }, 6000);
*/

setInterval(function(){
	sensor.read();
	read_pressure();
}, 60000);

app.listen(3000);
console.log("Server running at http://127.0.0.1:3000/");


/*
	Exit Handler to close DB-Connection
*/
/*
function exitHandler(options, err) {
	if(connection_closed == false)
	{
		connection.end();
		connection_closed = true;
	    console.log('close DB');
	}
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
*/
