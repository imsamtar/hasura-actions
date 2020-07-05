const bodyParser = require("body-parser");
const { invalidRequest } = require("./response.json");

function response(res, data, status = 200) {
    if (res.json) {
        return res.status(status).json(data);
    } else if (res.end) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(data));
    }
}

async function handleAction(config, body, headers) {
    const { name } = body.action;
    if (typeof config === "undefined") return invalidRequest;
    if (typeof config === "function") return await config(body, headers);
    if (typeof config === "object" && config[name]) {
        return await handleAction(config[name], body, headers);
    }
    return { code: 404, message: "action not found" };
}

function handler(config) {
    return function (req, res, next) {
        return bodyParser.json()(req, res, async function () {
            if (req.method !== "POST") return next(req, res, next);
            if (!req.body.action || !req.body.input) return response(res, invalidRequest, 400);
            let result = await handleAction(config, req.body, req.headers);
            return response(res, result, result.code === 404 ? 404 : 200);
        });
    };
}

module.exports = handler;
