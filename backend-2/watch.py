# watch.py
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from generate_openapi import save_openapi_schema

WATCH_DIRS = ["routes", "models", "services", "utils", "server.py"]

class ChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if any(str(event.src_path).endswith(ext) for ext in [".py"]):
            print(f"🔁 Detected change in {event.src_path}")
            save_openapi_schema()

if __name__ == "__main__":
    observer = Observer()
    for path in WATCH_DIRS:
        observer.schedule(ChangeHandler(), path=path if path != "server.py" else ".", recursive=True)
    observer.start()

    print("👀 Watching for file changes... Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
