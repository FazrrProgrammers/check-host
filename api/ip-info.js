const axios = require("axios");

module.exports = async (req, res) => {
    const { ip } = req.query;
    if (!ip) return res.status(400).json({ error: "Parameter 'ip' diperlukan" });

    try {
        // Ambil data dari berbagai sumber
        const [
            ipApiRes, ipWhoisRes, ipInfoRes, ipDataRes, ipGeoRes,
            ipStackRes, dbIpRes, geoipifyRes, ipRegistryRes, ipApiComRes,
            ipAddressComRes, ipApiFullRes
        ] = await Promise.all([
            axios.get(`http://ip-api.com/json/${ip}?fields=66842623`),
            axios.get(`https://ipwhois.app/json/${ip}`),
            axios.get(`https://ipinfo.io/${ip}/json`),
            axios.get(`https://api.ipdata.co/${ip}?api-key=free`),
            axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=free&ip=${ip}`),
            axios.get(`http://api.ipstack.com/${ip}?access_key=free`),
            axios.get(`https://api.db-ip.com/v2/free/${ip}`),
            axios.get(`https://geoipify.whoisxmlapi.com/api/v1?apiKey=free&ipAddress=${ip}`),
            axios.get(`https://api.ipregistry.co/${ip}?key=tryout`),
            axios.get(`https://api.ipapi.com/${ip}?access_key=free`),
            axios.get(`https://api.ipaddress.com/${ip}?key=free`),
            axios.get(`https://ip-api.com/json/${ip}`)
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
                phone_code: ipApiFullRes.data.phone ?? "Unknown", // kode telepon negara
                state: ipGeoRes.data.state ?? "Unknown",
                region_code: ipRegistryRes.data.location.region_code ?? "Unknown"
            },
            network: {
                isp: ipApiRes.data.isp,
                asn: ipDataRes.data.asn,
                as: ipApiRes.data.as,
                network: ipWhoisRes.data.network,
                organization: ipWhoisRes.data.org,
                domain: ipInfoRes.data.hostname ?? "N/A",
                ip_range: dbIpRes.data.ipAddressRange,
                subnet_mask: dbIpRes.data.subnetMask ?? "N/A",
                carrier: ipGeoRes.data.carrier ?? "Unknown",
                connection_type: ipRegistryRes.data.connection.type ?? "Unknown",
                connection_speed: ipRegistryRes.data.connection.speed ?? "Unknown",
                ipaddress_com_data: ipAddressComRes.data.data ?? "N/A",
                proxy_info: ipApiComRes.data.proxy ?? "N/A",
                type: ipStackRes.data.type ?? "N/A",
                isp_speed: ipApiComRes.data.speed ?? "N/A"
            },
            security: {
                hosting: ipApiRes.data.hosting ?? false,
                proxy: ipDataRes.data.threat?.is_proxy ?? false,
                vpn: ipDataRes.data.threat?.is_vpn ?? false,
                tor: ipDataRes.data.threat?.is_tor ?? false,
                bot: ipStackRes.data.security?.is_bot ?? false,
                fake_ip: ipRegistryRes.data.security?.is_bogon ?? false,
                risk_score: ipStackRes.data.security?.threat_level ?? "Low",
                country_risk: ipGeoRes.data.security?.risk ?? "Low",
                is_blacklisted: ipApiRes.data.blacklisted ?? false,  // IP apakah diblacklist
                port_scan_detected: ipApiRes.data.port_scan ?? false, // Deteksi port scan
                ddos_risk: ipStackRes.data.security?.ddos_risk ?? false  // Risiko DDoS
            },
            metadata: {
                mobile: ipDataRes.data.mobile ?? false,
                company: ipStackRes.data.company?.name ?? "Unknown",
                brand: ipGeoRes.data.device?.brand ?? "Unknown",
                device: ipGeoRes.data.device?.model ?? "Unknown",
                os: ipGeoRes.data.device?.os ?? "Unknown",
                browser: geoipifyRes.data.user_agent?.software?.name ?? "Unknown",
                device_type: geoipifyRes.data.device?.type ?? "Unknown",
                user_agent: geoipifyRes.data.user_agent?.software?.full ?? "Unknown",
                is_brokered: ipRegistryRes.data.location.is_brokered ?? false // IP brokered atau tidak
            },
            additional_info: {
                region_code: ipRegistryRes.data.location.region_code ?? "Unknown",
                city_code: ipRegistryRes.data.location.city_code ?? "Unknown",
                metro_code: ipRegistryRes.data.location.metro_code ?? "Unknown",
                longitude: ipRegistryRes.data.location.longitude ?? "Unknown",
                latitude: ipRegistryRes.data.location.latitude ?? "Unknown",
                connection_quality: ipStackRes.data.security?.connection_quality ?? "Unknown"
            },
            threat_info: {
                suspected_bot_activity: ipRegistryRes.data.security?.bot ?? false,
                dark_web_association: ipDataRes.data.threat?.is_darkweb ?? false,
                risk_category: ipStackRes.data.security?.threat_level ?? "Low"
            }
        };

        res.json(result);
    } catch (error) {
        res.json({ error: error.message });
    }
};
