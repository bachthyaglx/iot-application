import subprocess
import os

env = os.environ.copy()
env["PYTHONPATH"] = os.getcwd()  # backend-2 is root

processes = [
    ["uvicorn", "server:app", "--reload"],
    ["uvicorn", "realtime_server:socket_app", "--reload", "--port", "4000"],
    ["python", "data_simulator/publisher.py"]
]

for cmd in processes:
    subprocess.Popen(cmd, env=env)

input("✅ All processes started. Press Enter to exit...\n")
