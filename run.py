"""
Convenience launcher for Bayora.
Run with: py run.py or npm start
"""
import shutil
import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

if __name__ == "__main__":
    node_exe = shutil.which("node")
    server_js = BASE_DIR / "backend" / "src" / "server.js"

    if node_exe and server_js.exists():
        print(f"[*] Starting unified Bayora Security Enclave on http://127.0.0.1:8000 ...")
        sys.exit(subprocess.call([node_exe, str(server_js)]))
    else:
        import uvicorn
        from app.config import settings
        print(f"[*] Starting {settings.APP_NAME} on http://{settings.HOST}:{settings.PORT}")
        uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
