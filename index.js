var express        = require('express');
var bodyParser     = require('body-parser');
var EventEmitter   = require("events").EventEmitter;
var session = require('express-session');


app = express();
app.set('port', (process.env.PORT || 5000));
var http = require('http');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(session({ secret: 'SECRET' }));


app.use('/js',express.static(__dirname+'/public/js'));

var engines = require('consolidate');

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/',function(req,res){
	res.sendFile(__dirname+'/public/views/index.html');
});

app.post('/registerUser',function(req,res){
	console.log(req.body)
});

var server = http.createServer(app).listen(app.get('port'),function(){
	console.log('I am running'+app.get('port'));
});

var globaldata=[];

var io = require('socket.io')(server);

io.on('connection', function(socket){
  //console.log('a user connected '+socket.id);
  socket.on('disconnect', function(){


		for(var i = 0; i < globaldata.length; i++) {
		    if(globaldata[i].id == socket.id) {
		        globaldata.splice(i, 1);
		        break;
		    }
		}
		io.sockets.emit('locations',{data:globaldata})
    //console.log('user disconnected');
  });

  socket.on('browserLocation',function(data){
    //console.log(data)
		var flag = true;
		for(var i = 0; i < globaldata.length; i++) {
	    if(globaldata[i].id == socket.id) {
	        flag = false;
	        break;
	    }
		}

		if(flag){
			globaldata.push({'location':data.data,'id':socket.id});
		}

    io.sockets.emit('locations',{data:globaldata})
  });
});

//var data = [{"abc":[]},{"xyz":[]}]
