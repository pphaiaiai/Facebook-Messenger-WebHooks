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

    if (body.entry[0].messaging[0].message != undefined) {
        // console.log("body", body.entry[0].messaging[0].message);
        if (body.object === "page") {

            // Iterate over each entry - there may be multiple if batched
            body.entry.forEach(function (entry) {
                let webhook_event = entry.messaging[0];

                /// Gets the body of the webhook event
                let sender_psid = webhook_event.sender.id;
                // console.log('Sender PSID: ' + sender_psid);                
                
                const ExtensionInstaller = require('../../../FacebookMessenger/index.js');
                const newExtensionInstaller = new ExtensionInstaller()

                newExtensionInstaller.initialization({
                    access_token: 'EAAHFfNt92vYBAGxRzMsleZCmSp60DvvHepXt302KuiHZAFCcUZCnc6kcDDpZAXAeZB7pmNZCmy5ZCWNE35TgZBOmTkI9XsgHisZBjOnLoGAFCsScgSxGk0s0IkE10pF0JDzemAMqSsRls8kH1c8SOrMmou2hKiwLPiyfFeUOEnpANzFzKA8SrN9pcbohduZBLAizkZD',
                    pageId: '109025378769446'
                })

                // Check if the event is a message or postback and
                // pass the event to the appropriate handler function
                if (webhook_event.message) {
                    // handleMessage(sender_psid, webhook_event.message);
                    callExtensionGetMessage(webhook_event);
                } else if (webhook_event.postback) {
                    handlePostback(sender_psid, webhook_event.postback);
                }


            });
            // Return a '200 OK' response to all events
        }
        res.status(200).send("EVENT_RECEIVED");
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

function callExtensionGetMessage(webhook_event) {
    const Extension = require('../../../FacebookMessenger/index.js');
    const newExtension = new Extension();

    newExtension.initialization({
        access_token: 'EAAHFfNt92vYBAGxRzMsleZCmSp60DvvHepXt302KuiHZAFCcUZCnc6kcDDpZAXAeZB7pmNZCmy5ZCWNE35TgZBOmTkI9XsgHisZBjOnLoGAFCsScgSxGk0s0IkE10pF0JDzemAMqSsRls8kH1c8SOrMmou2hKiwLPiyfFeUOEnpANzFzKA8SrN9pcbohduZBLAizkZD',
        pageId: '109025378769446'
    })

    newExtension.execute({
        function_name: "getMessages",
        execute_data: webhook_event
    });
}

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Check if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) { }

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) { }

module.exports = {
    getWebhook: getWebhook,
    postWebhook: postWebhook,
};
