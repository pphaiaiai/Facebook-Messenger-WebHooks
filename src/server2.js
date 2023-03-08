const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const leadgen = req.body.entry[0].changes[0].value;
    // Extract lead data from the webhook event
    // Store lead data in your own system
    console.log('leadgen', leadgen);
    res.status(200).send('EVENT_RECEIVED');
});

app.get('/webhook', (req, res) => {
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
});

app.listen(7000, () => {
    console.log('Webhook server listening on port 7000');
});