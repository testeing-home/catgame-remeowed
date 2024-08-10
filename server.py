from flask import Flask, Response, request
from catbase import CatDB

app = Flask(__name__)

key_data = CatDB("database/key.json", none={})

@app.route("/get/<key>", methods=["GET"])
def get_key_data(key: str):
	return key_data[key]

@app.route("/set/<key>", methods=["POST"])
def set_key_data(key: str):
	key_data[key] = request.get_json().get("data")
	return Response(None, 200)
