import json
from flask import Flask, Response, request
from catbase import CatDB
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

key_data = CatDB("database/key.json", none={})


@app.route("/get/<key>", methods=["GET"])
def get_key_data(key: str):
    print(f"Outgoing traffic to {request.remote_addr}: {key_data[key]}")
    return Response(str(key_data[key]).replace("'", '"'))


@app.route("/set/<key>", methods=["POST"])
def set_key_data(key: str):
    print(f"Incoming traffic from {request.remote_addr}: {request.get_data()}")
    key_data[key] = json.loads(request.get_data().decode())
    return Response(None, 200)


app.run()
