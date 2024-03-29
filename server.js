const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// app.use(express.json({limit: '20mb'}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const log = console.log;
const PORT = process.env.PORT || 8080;

const sender_gmail = "sender_gmail@gmail.com";
const receiver_gmail = "receiver_gmail@gmail.com";

const transporter = nodemailer.createTransport({
  		service: 'gmail',
		auth: {
			user: sender_gmail,
			pass: 'sender_pass'
		}
	});

function sendBuffer(res, subject, text, fileBuffer, fileName) {
	
	mailOptions = {
		from: sender_gmail,
		to: receiver_gmail,
		subject: subject,
		text: text,
		attachments: [{
			filename: fileName,
          		content: new Buffer(fileBuffer, 'base64')
		}]
	};

	transporter.sendMail(mailOptions, function(error, info)
	{
		if (error) {
			console.log('Email error: ' + error);
			return res.json({error : "400"});
 		 } else {
			console.log('Email sent: ' + info.response);
 			return res.json({success : "200"});
 		 }
	});
}

function sendInfo(res, subject, text) {
	
	mailOptions = {
		from: sender_gmail,
		to: receiver_gmail,
		subject: subject,
		text: text
	};
	
	transporter.sendMail(mailOptions, function(error, info)
	{
		if (error) {
			console.log('Email error: ' + error);
			return res.json({error : "400"});
 		 } else {
			console.log('Email sent: ' + info.response);
 			return res.json({success : "200"});
 		 }
	});
}

function sendCustomEmail(res, receiver, subject, text) {

	mailOptions = {
		from: sender_gmail,
		to: receiver,
		subject: subject,
		text: text
	};
	
	transporter.sendMail(mailOptions, function(error, info)
	{
		if (error) {
			console.log('Email error: ' + error);
			return res.json({error : "400"});
 		 } else {
			console.log('Email sent: ' + info.response);
 			return res.json({success : "200"});
 		 }
	});
}

app.post('/buffer', (req, res) => {
	console.log('Image received: ' + req.body.fileName);
	sendBuffer(res, req.body.subject, req.body.text, req.body.fileBuffer, req.body.fileName);
});

app.post('/info', (req, res) => {
	sendInfo(res, req.body.subject, req.body.text);
});

app.post('/custom', (req, res) => {
	sendCustomEmail(res, req.body.receiver, req.body.subject, req.body.text);
});

app.listen(PORT, () => log('Server is starting on PORT,', 8080));
