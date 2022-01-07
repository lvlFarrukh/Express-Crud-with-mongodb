import express from "express";
import morgan from "morgan";
import cors from "cors"
import mongoose from "mongoose"

mongoose.connect('mongodb+srv://farrukha303:4515750@cluster0.wcc2p.mongodb.net/expressCrud?retryWrites=true&w=majority')
const USER = mongoose.model('users', {
    name: String,
    email: String,
    address: String,
})

const port = process.env.PORT || 3001;
const app = express();

const user = [];

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput =
      "Sorry, I had trouble doing what you asked. Please try again.";
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speechText = "Welcome to Zamzam restaurant, I am your virtual assistance. you can ask for the menu";
    const reprompt = "I am your virtual assistant. you can ask for the menu"

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(reprompt)

    //   .withSimpleCard(
    //     "Welcome to your SDK weather skill. Ask me the weather!",
    //     speechText
    //   )
      .getResponse();
  },
};

const ShowMenuIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "ShowMenuIntent"
    );
  },
  handle(handlerInput) {
    const speechText = 'In the menu, we have Beef kabab, Mutton kabab, Chicken Reshmi kabab, Gola kabab and Seekh kabab. which one would you like to order?';
    const reprompt = 'we have Beef kabab, Mutton kabab, Chicken Reshmi kabab, Gola kabab and Seekh kabab.';
    const cardText = '1. Beef kabab \n2. Mutton kabab \n3. Chicken Reshmi kabab \n4. Gola kabab \n5. Seekh kabab.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(reprompt)
      .withSimpleCard("Zamzam Restaurant Menu",cardText)
      .getResponse();
  },
};

const skillBuilder = SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler, ShowMenuIntentHandler)
  .addErrorHandlers(ErrorHandler);
const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, false, false);

app.use(express.json());
app.use(morgan('short'));

app.use(cors({
    origin: '*'
}));

app.post('/api/v1/webhook-alexa', adapter.getRequestHandlers());

app.get('/', (req, res) => {
    res.send("Server is working")
})

// get all user
app.get('/users', (req, res) => {
    USER.find({}, (err, users) => {
        if (!err) {
            res.send(users)
        } else {
            res.status(500).send("error happened")
        }
    })
})

// add user
app.post('/user', (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.address) {
        res.status(400).send('invalid data');
    }
    else {
         // user.push({
        //     name: req.body.name,
        //     email: req.body.email,
        //     address: req.body.address
        // })
        const newUser = new USER({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address
        });

        newUser.save().then(() => {
            console.log('user created success')
            res.json({response: 'User Created'});
        });
       
    }
})

// update user
app.put('/user/:id', (req, res) => {
    
    let updateObj = {}

    if (req.body.name) {
        updateObj.name = req.body.name;
    }
    if (req.body.email) {
        updateObj.email = req.body.email;
    }
    if (req.body.address) {
        updateObj.address = req.body.address;
    }

    USER.findByIdAndUpdate(req.params.id, updateObj, { new: true },
        (err, data) => {
            if (!err) {
                res.send(data)
            } else {
                res.status(500).send("error happened")
            }
    })

})

// delete user
app.delete('/user/:id', (req, res) => {
    USER.findByIdAndRemove(req.params.id, (err, data) => {
        if (!err) {
            res.send({response: "user deleted"})
        } else {
            res.status(500).send("error happened")
        }
    })
})

app.listen(port);
