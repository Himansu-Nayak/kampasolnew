import os
import sys
import webbrowser
import threading
import time
import uvicorn

def open_browser():
    time.sleep(1.2)
    webbrowser.open("http://localhost:8000")

if __name__ == "__main__":
    # Ensure current directory is on python path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)
    
    print("=" * 60)
    print("  SALES NAYAK ENTERPRISE SUITE v2.0")
    print("  CRM • ERP • HRM • AMC • ACCOUNTS • PRODUCTION")
    print("=" * 60)
    print("  -> Starting High-Performance Asynchronous API Server...")
    print("  -> SQLite WAL Mode enabled (zero locks, zero timeouts)")
    print("  -> Web Interface URL: http://localhost:8000")
    print("  -> OpenAPI / Swagger: http://localhost:8000/docs")
    print("=" * 60)

    # Launch browser in a background thread
    threading.Thread(target=open_browser, daemon=True).start()

    # Start FastAPI server
    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
