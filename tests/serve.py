# Servidor estático com fallback de SPA (qualquer rota → index.html)
import http.server, os, sys
ROOT = sys.argv[1]
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
    def send_head(s):
        path = s.translate_path(s.path.split('?')[0].split('#')[0])
        if not os.path.exists(path) or os.path.isdir(path) and not os.path.exists(os.path.join(path,'index.html')):
            s.path = '/index.html'
        return super().send_head()
http.server.ThreadingHTTPServer(('127.0.0.1', 4300), H).serve_forever()
