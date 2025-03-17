const fs = require('fs');
const cors = require('cors');
const https = require('https')
const crypto = require('crypto');
const express = require('express');

const PORT = 1337;
const app = express();
const CERT_PATH = 'E:\\Express\\Express_SSL_Demo\\cert\\server.crt';
const KEY_PATH = 'E:\\Express\\Express_SSL_Demo\\cert\\server.key';

const options = {
    key: fs.readFileSync(KEY_PATH),
    cert: fs.readFileSync(CERT_PATH),
}

app.use(cors());

function getCertificateHash(certPath) {
    const cert = fs.readFileSync(certPath, 'utf8');
    const hash = crypto.createHash('sha256').update(cert).digest('hex');
    return hash;
}

app.get('/cert', (req, res) => {
    try {
        const cert = fs.readFileSync(CERT_PATH, 'utf8');
        res.setHeader('Content-Type', 'application/x-pem-file');
        res.send(cert);
    } catch (err) {
        console.error('Error reading the certificate:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/cert-hash', (req, res) => {
    try {
        const certHash = getCertificateHash(CERT_PATH);
        res.json({ hash: certHash });
    } catch (err) {
        console.error('Error generating the certificate hash:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/test', (req, res) => {
    //res.send('Hello, this is the SSL certificate server! and I am DK');
    res.send("<html><head><title>Hello World</title></head><body><h1>Hello, World! DK</h1></body></html>");
});

const sslServer = https.createServer(options, app);
sslServer.listen(PORT, () => { console.log("HTTPS server up and running on port: " + PORT) })