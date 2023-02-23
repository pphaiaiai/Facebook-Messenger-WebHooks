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

// get leads
let postWebhook = async (req, res) => {
    const leadgen = req.body.entry[0].changes[0].value;
    // Extract lead data from the webhook event
    // Store lead data in your own system
    res.status(200).send('EVENT_RECEIVED');

    const ExtensionInstaller = require('../../../Facebook_Leads/installer.js');
    const newExtensionInstaller = new ExtensionInstaller()

    await newExtensionInstaller.initialization({
        PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN,
        page_id: '117040291307229'
    })

    const Extension = require('../../../Facebook_Leads/index.js');
    const newExtension = new Extension();

    await newExtension.initialization({
        PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN,
        page_id: '117040291307229'
    })
    await newExtension.execute({
        function_name: "getLeadsData",
        execute_data: leadgen
    });
};

// Facebook Messenger
// let postWebhook = (req, res) => {
//     // Parse the request body from the POST
//     let body = req.body;

//     if (body.entry[0].messaging[0].message != undefined) {
//         // console.log("body", body.entry[0].messaging[0].message);
//         if (body.object === "page") {

//             // Iterate over each entry - there may be multiple if batched
//             body.entry.forEach(function (entry) {
//                 let webhook_event = entry.messaging[0];

//                 /// Gets the body of the webhook event
//                 let sender_psid = webhook_event.sender.id;
//                 // console.log('Sender PSID: ' + sender_psid);                

//                 const ExtensionInstaller = require('../../../Facebook_Messenger/installer.js');
//                 const newExtensionInstaller = new ExtensionInstaller()

//                 newExtensionInstaller.initialization({
//                     PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN,
//                     page_id: '117040291307229'
//                 })

//                 // Check if the event is a message or postback and
//                 // pass the event to the appropriate handler function
//                 if (webhook_event.message) {
//                     // handleMessage(sender_psid, webhook_event.message);
//                     callExtensionGetMessage(webhook_event);
//                 } else if (webhook_event.postback) {
//                     handlePostback(sender_psid, webhook_event.postback);
//                 }


//             });
//             // Return a '200 OK' response to all events
//         }
//         res.status(200).send("EVENT_RECEIVED");
//     } else {
//         // Return a '404 Not Found' if event is not from a page subscription

//         res.sendStatus(404);
//     }
// };

async function callExtensionGetMessage(webhook_event) {
    const Extension = require('../../../Facebook_Messenger/index.js');
    const extension = new Extension();

    await extension.initialization({
        PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN,
        page_id: '117040291307229'
    })
    await extension.execute({
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
