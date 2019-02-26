var express = require('express');
const app = express();
var http = require('http').Server(app);
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

app.use(bodyParser.json());

const publicVapidKey = 'BK-NJ64sZa38Ov4WoCb7oAQo1TrB26qGQMzdvMGVpGRXVxa1yjAAKafXLUzRZ9Zo129sTLI_dfoIoS_R1c6lnDQ';
const privateVapidKey = 'nwnKdiY148v3p_frwn8DBMh7LjHePQ6C9XbfHcd2jKA';

webpush.setVapidDetails('mainto:test@test.com', publicVapidKey, privateVapidKey);

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
	console.log('erer');
});

io.on('connection', function(socket){
	console.log('socket => ', socket.id);
	const id = socket.id;
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('subscribe', function(req, res, msg) {
	console.log('req => ', req);
	console.log('res => ', res);
	console.log('msg => ', id);
	// Get pushSubscription object
//        const subscription = req.body;




	const subscription = { endpoint:
   'https://fcm.googleapis.com/fcm/send/eHx0rqbYnU4:APA91bG_Qchl6CQMvzBDkMPA_aHtBPMc9XaQg6KUFfqv1ChxsvXdpcgAGO_JgYpfzf-56sAwR1dfKFy6v8-kAZPRdFT9qQoSXETLt7xePFOUhllfmYiptUtf-YFYKQMH4RIzJXkHjoHX',
  expirationTime: null,
  keys:
   { p256dh:
      'BB93WVLhRS4gG_elIKSz1jia7WflZPzM0lX2ggebfD6Ggph9XQ0UnTOuN8AwXfKKECfj734x5vjy7the82SKo_s',
     auth: 'yGMMrOxMDTOGJAI1chpeIw' } }
 
        // Send 201 - resource created
	io.emit('chat message', req);
        // res.status(201).json({});

        // Create payload
        const payload = JSON.stringify({ title: req, id: id});

        // Pass object into sendNotification
        webpush.sendNotification(subscription, payload).catch(err => console.error(err));

//	        method: 'POST',
//                body: JSON.stringify(subscription),
//                body: JSON.stringify('test'),
//                headers: {
//                        'content-type': 'application/json',
//                }
  });
});

app.post('/subscribe', (req, res) => {
	// Get pushSubscription object
	const subscription = req.body;

	// Send 201 - resource created
	res.status(201).json({});

	// Create payload
	const payload = JSON.stringify({ title: 'test', data: req.body });

	// Pass object into sendNotification
	webpush.sendNotification(subscription, payload).catch(err => console.error(err));
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
