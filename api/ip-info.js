const axios = require("axios");

module.exports = async (req, res) => {
    const { ip } = req.query;
    if (!ip) return res.status(400).json({ error: "Parameter 'ip' diperlukan" });

    try {
        // Ambil data dari sumber API tanpa batasan
        const [
            ipApiRes, ipWhoisRes, ipInfoRes, ipGeoRes,
            geoipifyRes, dbIpRes
        ] = await Promise.all([
            axios.get(`http://ip-api.com/json/${ip}?fields=66842623`), // Tidak ada limitasi
            axios.get(`https://ipwhois.app/json/${ip}`), // Tanpa batasan
            axios.get(`https://ipinfo.io/${ip}/json`), // Tanpa limitasi
            axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=free&ip=${ip}`), // Tanpa batasan
            axios.get(`https://geoipify.whoisxmlapi.com/api/v1?apiKey=free&ipAddress=${ip}`), // Tanpa limitasi
            axios.get(`https://api.db-ip.com/v2/free/${ip}`) // API tanpa batasan
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
                languages: geoipifyRes.data.location.languages.map(lang => lang.code).join(", "),
                continent_code: ipWhoisRes.data.continent_code ?? "N/A",
                country_population: ipGeoRes.data.country_population ?? "Unknown",
                phone_code: ipApiRes.data.phone ?? "Unknown", // kode telepon negara
                state: ipGeoRes.data.state ?? "Unknown",
                region_code: ipGeoRes.data.region_code ?? "Unknown"
            },
            network: {
                isp: ipApiRes.data.isp,
                asn: ipGeoRes.data.asn,
                as: ipApiRes.data.as,
                network: ipWhoisRes.data.network,
                organization: ipWhoisRes.data.org,
                domain: ipInfoRes.data.hostname ?? "N/A",
                ip_range: dbIpRes.data.ipAddressRange,
                subnet_mask: dbIpRes.data.subnetMask ?? "N/A",
                carrier: ipGeoRes.data.carrier ?? "Unknown",
                connection_type: ipGeoRes.data.connection.type ?? "Unknown",
                connection_speed: ipGeoRes.data.connection.speed ?? "Unknown"
            },
            security: {
                hosting: ipApiRes.data.hosting ?? false,
                proxy: ipGeoRes.data.threat?.is_proxy ?? false,
                vpn: ipGeoRes.data.threat?.is_vpn ?? false,
                tor: ipGeoRes.data.threat?.is_tor ?? false,
                bot: ipGeoRes.data.security?.is_bot ?? false,
                fake_ip: ipApiRes.data.fake_ip ?? false,
                risk_score: ipGeoRes.data.security?.threat_level ?? "Low",
                is_blacklisted: ipGeoRes.data.blacklisted ?? false,
                port_scan_detected: ipGeoRes.data.port_scan ?? false,
                ddos_risk: ipGeoRes.data.security?.ddos_risk ?? false
            },
            metadata: {
                mobile: ipGeoRes.data.device?.mobile ?? false,
                company: ipGeoRes.data.company?.name ?? "Unknown",
                brand: ipGeoRes.data.device?.brand ?? "Unknown",
                device: ipGeoRes.data.device?.model ?? "Unknown",
                os: ipGeoRes.data.device?.os ?? "Unknown",
                browser: geoipifyRes.data.user_agent?.software?.name ?? "Unknown",
                device_type: geoipifyRes.data.device?.type ?? "Unknown",
                user_agent: geoipifyRes.data.user_agent?.software?.full ?? "Unknown"
            }
        };

        res.json(result);
    } catch (error) {
        res.json({ error: error.message });
    }
};
