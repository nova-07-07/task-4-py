from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_folder_structure(path):
    if not os.path.exists(path):
        return {"error": "Path does not exist"}
    
    def traverse(directory):
        items = []
        try:
            for entry in os.scandir(directory):
                item = {
                    "name": entry.name,
                    "isfolder": entry.is_dir(),
                    "path": entry.path
                }
                if entry.is_dir():
                    item["items"] = traverse(entry.path)
                items.append(item)
        except PermissionError:
            return []
        return items
    
    return {
        "name": os.path.basename(path),
        "isfolder": True,
        "path": path,
        "items": traverse(path)
    }

@app.route("/get-folder", methods=["GET", "POST"])
def get_folder():
    if request.method == "GET":
        path = request.args.get("path")  # Read from URL parameters
    else:
        data = request.json
        path = data.get("path")  # Read from request body (POST)

    return jsonify(get_folder_structure(path))

@app.route('/get-file-content', methods=['GET'])
def get_file_content():
    file_path = request.args.get('path')
    if not os.path.exists(file_path) or not file_path.endswith('.py'):
        return jsonify({"error": "Invalid file path"}), 400

    try:
        with open(file_path, 'r') as file:
            content = file.read()
        return jsonify({"name": os.path.basename(file_path), "content": content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/execute", methods=["POST"])
def execute_file():
    data = request.json
    file_path = data.get("file_path")
    if not os.path.exists(file_path) or not file_path.endswith(".py"):
        return jsonify({"error": "Invalid file path"})
    try:
        result = subprocess.run(["python", file_path], capture_output=True, text=True)
        return jsonify({"output": result.stdout, "error": result.stderr})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
