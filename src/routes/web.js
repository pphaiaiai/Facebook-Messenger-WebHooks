import express from 'express';
import extensionController from '../controllers/extensionController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/webhook", extensionController.getWebhook);

    router.post("/webhook", extensionController.postWebhook);

    return app.use("/", router);
};

module.exports = initWebRoutes;