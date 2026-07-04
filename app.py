from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='dist', static_url_path='')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/health')
def health():
    return {"status": "ok"}, 200

@app.route('/<path:path>')
def serve_static_or_fallback(path):
    # Enforce safe path resolution within the static folder
    full_path = os.path.abspath(os.path.join(app.static_folder, path))
    static_dir = os.path.abspath(app.static_folder)
    
    # Check if the resolved path starts with the static directory path (prevents directory traversal)
    if not full_path.startswith(static_dir):
        return "Access Denied", 403
        
    if os.path.exists(full_path) and os.path.isfile(full_path):
        return send_from_directory(app.static_folder, path)
    
    # Fallback to index.html for SPA client-side routing
    index_path = os.path.join(app.static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, 'index.html')
    
    return "Not Found", 404

if __name__ == '__main__':
    # Listen on port 8080 by default (matching Docker configuration)
    # Allows external access (e.g., test from mobile Safari)
    app.run(host='0.0.0.0', port=8080, debug=False)
