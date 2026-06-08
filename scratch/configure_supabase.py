import urllib.request
import json
import sys

def configure():
    print("==================================================")
    print("Supabase Auth OTP Length Configurator")
    print("==================================================")
    print("This script will set the email OTP length to 6 digits on your hosted Supabase project.")
    print("\nTo get your Supabase Personal Access Token:")
    print("1. Go to https://supabase.com/dashboard/account/tokens")
    print("2. Generate a new token and copy it.")
    print("==================================================")
    
    token = input("\nPaste your Supabase Personal Access Token: ").strip()
    if not token:
        print("Error: Token cannot be empty.")
        return

    project_ref = "rpaodsmwhmzyhopvkwjt"
    url = f"https://api.supabase.com/v1/projects/{project_ref}/config/auth"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "mailer_otp_length": 6
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers=headers,
        method="PATCH"
    )
    
    print(f"\nSending PATCH request to update auth configuration for project {project_ref}...")
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            print("\nSuccess! Supabase auth config updated successfully.")
            print("Response:")
            print(json.dumps(json.loads(res_body), indent=2))
    except urllib.error.HTTPError as e:
        print(f"\nHTTP Error {e.code}: {e.reason}")
        try:
            err_body = e.read().decode("utf-8")
            print("Error Details:")
            print(json.dumps(json.loads(err_body), indent=2))
        except Exception:
            pass
    except Exception as e:
        print(f"\nAn error occurred: {e}")

if __name__ == "__main__":
    configure()
