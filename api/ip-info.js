const axios = require("axios");

module.exports = async (req, res) => {
    const { ip } = req.query;
    if (!ip) return res.status(400).json({ error: "Parameter 'ip' diperlukan" });

    try {
        // Ambil data dari ip-api.com
        const ipApiRes = await axios.get(`http://ip-api.com/json/${ip}?fields=66842623`);
        
        // Ambil data dari ipwhois.app
        const ipWhoisRes = await axios.get(`https://ipwhois.app/json/${ip}`);

        // Gabungkan data
        const result = {
            ip: ip,
            country: ipApiRes.data.country,
            country_code: ipApiRes.data.countryCode,
            region: ipApiRes.data.regionName,
            city: ipApiRes.data.city,
            timezone: ipApiRes.data.timezone,
            lat: ipApiRes.data.lat,
            lon: ipApiRes.data.lon,
            isp: ipApiRes.data.isp,
            as: ipApiRes.data.as,
            reverse_dns: ipApiRes.data.reverse ?? "N/A",
            proxy: ipApiRes.data.proxy ?? false,
            vpn: ipApiRes.data.vpn ?? false,
            hosting: ipApiRes.data.hosting ?? false,
            organization: ipWhoisRes.data.org,
            network: ipWhoisRes.data.network,
            continent: ipWhoisRes.data.continent,
            currency: ipWhoisRes.data.currency,
            languages: ipWhoisRes.data.languages,
            flag: ipWhoisRes.data.country_flag
        };

        res.json(result);
    } catch (error) {
        res.json({ error: error.message });
    }
};
