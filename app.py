from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='dist', static_url_path='')


def _with_cache_headers(response, filename: str):
    if filename in ('index.html', 'sw.js', 'manifest.webmanifest'):
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    elif filename.startswith('assets/'):
        response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
    return response


@app.route('/')
def index():
    resp = send_from_directory(app.static_folder, 'index.html')
    return _with_cache_headers(resp, 'index.html')


@app.route('/health')
def health():
    return {"status": "ok"}, 200


@app.route('/<path:path>')
def serve_static_or_fallback(path):
    static_dir = os.path.abspath(app.static_folder)
    full_path = os.path.abspath(os.path.join(static_dir, path))

    try:
        is_inside = os.path.commonpath([full_path, static_dir]) == static_dir
    except ValueError:
        is_inside = False

    if not is_inside:
        return "Access Denied", 403

    if os.path.isfile(full_path):
        resp = send_from_directory(app.static_folder, path)
        return _with_cache_headers(resp, path.replace('\\', '/'))

    index_path = os.path.join(static_dir, 'index.html')
    if os.path.isfile(index_path):
        resp = send_from_directory(app.static_folder, 'index.html')
        return _with_cache_headers(resp, 'index.html')

    return "Not Found", 404


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8080'))
    app.run(host='0.0.0.0', port=port, debug=False)
