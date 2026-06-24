import os
import sys
import subprocess

def load_env_file(path):
    """Load env vars from a file without external dependencies."""
    if not os.path.exists(path):
        print(f"Warning: .env file not found at {path}")
        return
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, val = line.split("=", 1)
                # Strip spaces and optional quotes
                key = key.strip()
                val = val.strip().strip("'").strip('"')
                os.environ[key] = val

def main():
    print("==============================================")
    print("   Starting Local Backend (Hybrid Mode)")
    print("==============================================")
    
    # 1. Load root .env
    load_env_file(".env")
    
    # 2. Override configurations to point to localhost mapped ports
    # (Since databases run in Docker, but backend runs on host)
    os.environ["MYSQL_SERVER"] = "127.0.0.1"
    os.environ["MYSQL_PORT"] = "3306"
    os.environ["CHROMA_DB_HOST"] = "127.0.0.1"
    os.environ["CHROMA_DB_PORT"] = "8001"  # Chroma host-mapped port
    os.environ["MINIO_ENDPOINT"] = "127.0.0.1:9000"
    os.environ["ENVIRONMENT"] = "development"
    os.environ["PYTHONPATH"] = os.path.abspath("backend")
    
    # Set PYTHONPATH in sys.path
    sys.path.insert(0, os.path.abspath("backend"))
    
    # 3. Run alembic migrations
    print("\n[1/2] Running database migrations...")
    try:
        # Check if alembic is installed and run it
        subprocess.run([sys.executable, "-m", "alembic", "upgrade", "head"], cwd="backend", check=True)
        print("Database migrations applied successfully!")
    except Exception as e:
        print(f"Warning: Could not run migrations via 'alembic': {e}")
        print("Starting FastAPI app anyway...")
        
    # 4. Start FastAPI via Uvicorn
    print("\n[2/2] Launching FastAPI Backend server...")
    try:
        import uvicorn
        uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True, app_dir="backend")
    except ImportError:
        print("Error: 'uvicorn' is not installed in your Python environment.")
        print("Please install requirements first: pip install -r backend/requirements.txt")
        sys.exit(1)

if __name__ == "__main__":
    main()
