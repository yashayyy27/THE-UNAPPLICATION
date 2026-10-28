"""Serve the production export under the same prefix as GitHub Pages."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory(prefix="unapplication-pages-") as directory:
    (Path(directory) / "THE-UNAPPLICATION").symlink_to(Path("out").resolve(), target_is_directory=True)

    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=directory, **kwargs)

        def send_error(self, code, message=None, explain=None):
            if code == 404:
                body = Path("out/404.html").read_bytes()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                if self.command != "HEAD":
                    self.wfile.write(body)
            else:
                super().send_error(code, message, explain)

    ThreadingHTTPServer(("127.0.0.1", 4175), Handler).serve_forever()
