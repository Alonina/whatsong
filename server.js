const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let clients = [];
let scores = { group1: 0, group2: 0 };
let nextGroup = 'group1';
let currentTrack = '';

function sendAll(data) {
    clients.forEach(res => res.write(`data: ${JSON.stringify(data)}\n\n`));
}

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    if (req.method === 'GET' && parsed.pathname === '/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        const group = nextGroup;
        nextGroup = nextGroup === 'group1' ? 'group2' : 'group1';
        res.write(`data: ${JSON.stringify({ type: 'assign', group })}\n\n`);
        clients.push(res);
        req.on('close', () => { clients = clients.filter(c => c !== res); });
    } else if (req.method === 'POST' && parsed.pathname === '/name') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { group, name } = JSON.parse(body);
            // Could store name per group
            res.writeHead(200); res.end('ok');
        });
    } else if (req.method === 'POST' && parsed.pathname === '/reveal') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const { track } = JSON.parse(body);
            currentTrack = track;
            sendAll({ type: 'reveal', track });
            res.writeHead(200); res.end('ok');
        });
    } else if (req.method === 'POST' && parsed.pathname === '/score') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const { group } = JSON.parse(body);
            scores[group]++;
            sendAll({ type: 'scores', ...scores });
            res.writeHead(200); res.end('ok');
        });
    } else {
        let filePath = path.join(__dirname, 'public', parsed.pathname === '/' ? 'index.html' : parsed.pathname);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404); res.end('Not found');
            } else {
                const ext = path.extname(filePath);
                const type = ext === '.js' ? 'text/javascript' : ext === '.css' ? 'text/css' : 'text/html';
                res.writeHead(200, { 'Content-Type': type });
                res.end(data);
            }
        });
    }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
