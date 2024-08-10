import json
from threading import Thread
from time import sleep
from flask import Flask, Response, request
from catbase import CatDB
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

VERSION = "SA-1.0.0"

key_data = CatDB("database/key.json", none={})


@app.route("/get/<key>", methods=["GET"])
def get_key_data(key: str):
    print(f"Outgoing traffic to {request.remote_addr}: {key_data[key]}")
    return Response(json.dumps(key_data[key]))


@app.route("/set/<key>", methods=["POST"])
def set_key_data(key: str):
    print(f"Incoming traffic from {request.remote_addr}: {request.get_data()}")
    key_data[key] = json.loads(request.get_data().decode())
    return Response(None, 200)


def save_task():
    while True:
        sleep(5)
        key_data.commit()


thread = Thread(None, save_task)
thread.daemon = True
thread.start()

print(f"CGRM Data Handling Server {VERSION}")
app.run()
