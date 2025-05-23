from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to call backend

@app.route("/save-input", methods=["POST"])
def save_input():
    data = request.json.get("data", "")
    
    with open("input.txt", "w") as file:
        file.write(data)

    return "Data saved successfully!"

if __name__ == "__main__":
    app.run(debug=True)
