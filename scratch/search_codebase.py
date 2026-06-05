import os
import re

search_dir = r"C:\Users\Akinola Olujobi\.gemini\antigravity\scratch\lanceconnect"
pattern = re.compile(r"corporate_training", re.IGNORECASE)

for root, dirs, files in os.walk(search_dir):
    if "node_modules" in dirs:
        dirs.remove("node_modules")
    if ".git" in dirs:
        dirs.remove(".git")
    for file in files:
        if file.endswith((".ts", ".tsx", ".py", ".js", ".json", ".html")):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line_num, line in enumerate(f, 1):
                        if pattern.search(line):
                            print(f"{path}:{line_num}: {line.strip()}")
            except Exception:
                pass
