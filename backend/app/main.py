import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.app.database import engine, Base
from backend.app.seed import seed_database
from backend.app.routers import (
    auth, dashboard, crm, erp, hrm, amc, complaint, accounts, production
)

# Initialize database schema and seed if not present
Base.metadata.create_all(bind=engine)
try:
    seed_database()
except Exception as e:
    pass

app = FastAPI(
    title="SalesNayak Enterprise Platform API",
    version="2.0.0",
    description="Full CRM, ERP, HRM, AMC, Accounts, and Production Platform with high performance and zero timeouts."
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(crm.router)
app.include_router(erp.router)
app.include_router(hrm.router)
app.include_router(amc.router)
app.include_router(complaint.router)
app.include_router(accounts.router)
app.include_router(production.router)

# Mount frontend static directory
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))

if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.on_event("startup")
def on_startup():
    seed_database()

@app.get("/")
def serve_index():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "SalesNayak Enterprise API is running", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "SalesNayak Enterprise API", "database": "SQLite WAL"}
