import os
import json
import asyncio
from fastapi import FastAPI, HTTPException, Query

app = FastAPI(title="Maigret Social Presence Scanner Service")

@app.get("/scan")
async def scan_username(username: str = Query(..., description="Username to scan across platforms")):
    # Clean username to prevent shell injection
    clean_username = "".join(c for c in username if c.isalnum() or c in "-_.")
    if not clean_username:
        raise HTTPException(status_code=400, detail="Invalid username")

    output_file = f"/tmp/maigret_{clean_username}.json"
    
    # Check and remove old output file if it exists
    if os.path.exists(output_file):
        try:
            os.remove(output_file)
        except Exception:
            pass

    # Run Maigret CLI command asynchronously
    # Specifying standard sites to keep it fast
    cmd = [
        "maigret",
        clean_username,
        "--site", "Facebook",
        "--site", "Instagram",
        "--site", "Twitter",
        "--site", "TikTok",
        "--site", "LinkedIn",
        "--site", "YouTube",
        "--json", "simple",
        "--output", output_file
    ]

    try:
        # Run subprocess
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await proc.communicate()
        
        # Wait, if maigret found nothing or failed, it might exit with non-zero code.
        # But we still want to check if the file exists and parse it.
        if not os.path.exists(output_file):
            print(f"Maigret command output file not found. stderr: {stderr.decode()}")
            return {"username": clean_username, "platforms": {}}

        with open(output_file, "r") as f:
            data = json.load(f)

        # Parse Maigret JSON structure:
        # {
        #   "username": "...",
        #   "sites": {
        #     "Facebook": { "status": "claimed", "url": "...", ... },
        #     ...
        #   }
        # }
        sites = data.get("sites", {})
        platforms = {}
        for site_name, site_data in sites.items():
            status = site_data.get("status")
            url = site_data.get("url")
            exists = status == "claimed"
            platforms[site_name.lower()] = {
                "exists": exists,
                "url": url if exists else None
            }

        # Cleanup file
        try:
            os.remove(output_file)
        except Exception:
            pass

        return {
            "username": clean_username,
            "platforms": platforms
        }

    except Exception as e:
        print(f"Exception during Maigret scan: {e}")
        return {
            "username": clean_username,
            "platforms": {},
            "error": str(e)
        }

@app.get("/health")
def health():
    return {"status": "ok", "service": "maigret-service"}
