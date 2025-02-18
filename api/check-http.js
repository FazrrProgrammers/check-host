const express = require("express");
const axios = require("axios");

const app = express();

app.get("/api/check-http", async (req, res) => {
    const { host } = req.query;
    if (!host) return res.status(400).json({ error: "Parameter 'host' diperlukan" });

    try {
        const response = await axios.get(host, { timeout: 5000 });
        res.json({
            host: host,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    } catch (error) {
        res.json({
            host: host,
            error: error.message,
        });
    }
});

module.exports = app;
