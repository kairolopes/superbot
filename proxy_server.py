import http.server
import socketserver
import urllib.request
import urllib.error
import sys

PORT = 8081
TARGET_URL = "https://superbot-1.onrender.com"

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey')
        self.end_headers()

    def proxy_request(self, method):
        url = TARGET_URL + self.path
        print(f"Proxying {method} {self.path} to {url}")
        
        headers = {key: val for key, val in self.headers.items() if key.lower() != 'host'}
        
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else None

        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        
        try:
            with urllib.request.urlopen(req) as response:
                self.send_response(response.status)
                for key, value in response.headers.items():
                    if key.lower() not in ['transfer-encoding', 'content-encoding', 'content-length', 'access-control-allow-origin']:
                         self.send_header(key, value)
                
                # Force CORS
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(response.read())
                
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(e.read())
        except Exception as e:
            self.send_response(500)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            print(f"Error: {e}")
            self.wfile.write(str(e).encode())

    def do_GET(self):
        self.proxy_request('GET')

    def do_POST(self):
        self.proxy_request('POST')

    def do_DELETE(self):
        self.proxy_request('DELETE')
        
    def do_PUT(self):
        self.proxy_request('PUT')

print(f"Starting proxy on port {PORT} pointing to {TARGET_URL}")
print("Usage: Configure your frontend to use http://localhost:8081 as Base URL")
with socketserver.TCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
    httpd.serve_forever()
