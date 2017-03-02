/*
	
	Exit Handler to close DB-Connection
	
*/

var exitHandler = {
	connection_closed 	: false,
	
	db_connection 		: null,
	
	handleProcessExit	: function(options, err) {
		if(exitHandler.connection_closed == false)
		{
			exitHandler.db_connection.end();
			exitHandler.connection_closed = true;
		    console.log('close DB');
		}
	    if (options.cleanup) console.log('clean');
	    if (err) console.log(err.stack);
	    if (options.exit) process.exit();
	}
}

//do something when app is closing
process.on('exit', exitHandler.handleProcessExit.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.handleProcessExit.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.handleProcessExit.bind(null, {exit:true}));

module.exports = exitHandler;