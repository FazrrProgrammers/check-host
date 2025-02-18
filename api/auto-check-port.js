const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
    const { ip } = req.query;

    if (!ip) {
        return res.status(400).json({ error: "Parameter 'ip' diperlukan" });
    }

    try {
        // Ambil data dari website Shodan
        const url = `https://www.shodan.io/host/${ip}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let openPorts = [];

        // Scraping daftar port terbuka
        $(".service").each((index, element) => {
            const port = $(element).text().trim();
            if (!isNaN(port)) {
                openPorts.push(parseInt(port));
            }
        });

        if (openPorts.length === 0) {
            return res.json({ ip, status: "No open ports found", open_ports: [] });
        }

        res.json({ ip, status: "Success", open_ports: openPorts });

    } catch (error) {
        res.json({ error: "Gagal mendapatkan data port terbuka", details: error.message });
    }
};
