const axios = require("axios");

module.exports = async (req, res) => {
    const { ip } = req.query;
    if (!ip) return res.status(400).json({ error: "Parameter 'ip' diperlukan" });

    try {
        // Ambil data dari sumber API tanpa API key
        const [
            ipApiRes, ipWhoisRes, ipInfoRes
        ] = await Promise.all([
            axios.get(`http://ip-api.com/json/${ip}?fields=66842623`), // Tanpa API key
            axios.get(`https://ipwhois.app/json/${ip}`), // Tanpa API key
            axios.get(`https://ipinfo.io/${ip}/json`), // Tanpa API key
        ]);

        // Gabungkan data yang didapat
        const result = {
            ip: ip,
            location: {
                country: ipApiRes.data.country,
                country_code: ipApiRes.data.countryCode,
                continent: ipWhoisRes.data.continent,
                region: ipApiRes.data.regionName,
                city: ipApiRes.data.city,
                postal: ipInfoRes.data.postal,
                timezone: ipApiRes.data.timezone,
                latitude: ipApiRes.data.lat,
                longitude: ipApiRes.data.lon,
                flag: ipWhoisRes.data.country_flag,
                languages: Array.isArray(ipWhoisRes.data.languages) ? ipWhoisRes.data.languages.join(", ") : "N/A",
                continent_code: ipWhoisRes.data.continent_code ?? "N/A",
                country_population: ipWhoisRes.data.country_population ?? "Unknown",
                phone_code: ipApiRes.data.phone ?? "Unknown", // kode telepon negara
                state: ipWhoisRes.data.state ?? "Unknown",
                region_code: ipWhoisRes.data.region_code ?? "Unknown"
            },
            network: {
                isp: ipApiRes.data.isp,
                asn: ipWhoisRes.data.asn,
                as: ipApiRes.data.as,
                network: ipWhoisRes.data.network,
                organization: ipWhoisRes.data.org,
                domain: ipInfoRes.data.hostname ?? "N/A",
                ip_range: ipWhoisRes.data.ipAddressRange,
                subnet_mask: ipWhoisRes.data.subnetMask ?? "N/A",
                carrier: ipWhoisRes.data.carrier ?? "Unknown",
                connection_type: ipWhoisRes.data.connection_type ?? "Unknown",
                connection_speed: ipWhoisRes.data.connection_speed ?? "Unknown"
            },
            security: {
                hosting: ipApiRes.data.hosting ?? false,
                proxy: ipWhoisRes.data.threat?.is_proxy ?? false,
                vpn: ipWhoisRes.data.threat?.is_vpn ?? false,
                tor: ipWhoisRes.data.threat?.is_tor ?? false,
                bot: ipWhoisRes.data.security?.is_bot ?? false,
                fake_ip: ipApiRes.data.fake_ip ?? false,
                risk_score: ipWhoisRes.data.security?.threat_level ?? "Low",
                is_blacklisted: ipWhoisRes.data.blacklisted ?? false,
                port_scan_detected: ipWhoisRes.data.port_scan ?? false,
                ddos_risk: ipWhoisRes.data.security?.ddos_risk ?? false
            },
            metadata: {
                mobile: ipWhoisRes.data.device?.mobile ?? false,
                company: ipWhoisRes.data.company?.name ?? "Unknown",
                brand: ipWhoisRes.data.device?.brand ?? "Unknown",
                device: ipWhoisRes.data.device?.model ?? "Unknown",
                os: ipWhoisRes.data.device?.os ?? "Unknown",
                browser: ipWhoisRes.data.device?.browser ?? "Unknown",
                device_type: ipWhoisRes.data.device?.type ?? "Unknown",
                user_agent: ipWhoisRes.data.device?.user_agent ?? "Unknown"
            }
        };

        res.json(result);
    } catch (error) {
        res.json({ error: error.message });
    }
};
