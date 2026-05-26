const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const WEBSITE_DIR = path.join(__dirname, 'website');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;

    // Serve index.html for root
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Security: prevent path traversal
    const safePathname = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(WEBSITE_DIR, safePathname);

    // Ensure the path is within WEBSITE_DIR
    if (!filePath.startsWith(WEBSITE_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    // Try to read the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            return;
        }

        // Set appropriate content type
        let contentType = 'text/plain';
        if (filePath.endsWith('.html')) {
            contentType = 'text/html; charset=utf-8';
        } else if (filePath.endsWith('.css')) {
            contentType = 'text/css; charset=utf-8';
        } else if (filePath.endsWith('.js')) {
            contentType = 'application/javascript; charset=utf-8';
        } else if (filePath.endsWith('.json')) {
            contentType = 'application/json; charset=utf-8';
        }

        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Static website server listening on http://localhost:${PORT}`);
});
