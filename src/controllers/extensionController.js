require('dotenv').config();

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;

    // Parse the query params
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        res.status(200).
            send(challenge)

        console.log('WEBHOOK_VERIFIED');
    }
    else {
        // Responds with '403 Forbidden' if verify tokens do not match
        console.log('WEBHOOK_FAILED');
        res.sendStatus(403);
    }
};

//  curl -i -X POST -H 'Content-Type: application/json' -d '{"object":"page","entry":[{"id":43674671559,"time":1460620433256,"messaging":[{"sender":{"id":123456789},"recipient":{"id":987654321},"timestamp":1460620433123,"message":{"mid":"mid.1460620432888:f8e3412003d2d1cd93","seq":12604,"text":"Testing Chat Bot .."}}]}]}' https://2413-49-228-107-40.ap.ngrok.io/webhook
let postWebhook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === "page") {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            /// Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log("test" ,webhook_event, "test2");


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            // console.log('Sender PSID: ' + sender_psid);
        });

        // Return a '200 OK' response to all events
        res.status(200).send("EVENT_RECEIVED");
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

// Handles messages events
function handleMessage(sender_psid, received_message) { }

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) { }

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) { }

module.exports = {
    getWebhook: getWebhook,
    postWebhook: postWebhook,
};
