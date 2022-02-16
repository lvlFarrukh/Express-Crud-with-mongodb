import express from 'express';
import bodyParser from 'body-parser';
import twilio from 'twilio';


const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const projectId = 'Place your dialogflow projectId here';
// const phoneNumber = "Place your twilio phone number here";
// const accountSid = 'Place your accountSid here';
// const authToken = 'Place your authToken here';


app.get('/', (req, res) => {
    res.send("Server is running")
})


app.post("/twiliowebhook", (req, res) => {

    // console.log("req: ", JSON.stringify(req.body));

    console.log("message: ", req.body.Body);

   // TODO: ask dialogflow what to respond
   
   
    let twiml = new twilio.twiml.MessagingResponse()
    twiml.message('The Robots are coming! Head for the hills!');

    res.header('Content-Type', 'text/xml');
    res.send(twiml.toString());
})


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
