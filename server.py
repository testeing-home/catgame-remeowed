from flask import Flask, Response, request
from catbase import CatDB
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

key_data = CatDB("database/key.json", none={})


@app.route("/get/<key>", methods=["GET"])
def get_key_data(key: str):
    return Response(key_data[key])


@app.route("/set/<key>", methods=["POST"])
def set_key_data(key: str):
    key_data[key] = request.get_json()
    return Response(None, 200)


app.run()
