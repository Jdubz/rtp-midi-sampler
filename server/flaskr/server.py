#!/usr/bin/env python

from flask import Flask, request
from flask_cors import CORS
import threading
import logging

from midi.rtp_server import start_server
from midi import parse
from files.manager import upload, get_files
from audio import Audio
from storage import Storage

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

globalvolume = 10 ** (-12.0/20)  # -12dB default global volume

storage = Storage()
audio = Audio(globalvolume, storage.config)
audio.start()

midi_server = threading.Thread(target=start_server, args=(storage.config["HOST"], storage.config["RTP_PORT"], parse), daemon=True)
midi_server.start()

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/audiodevice', methods=['GET'])
def audiodevices():
    return Audio.get_devices()

@app.route('/file', methods=['GET', 'POST'])
def file():
    if request.method == 'POST':
        return upload(request, storage.config["SAMPLES_FOLDER"])
    if request.method == 'GET':
        return get_files(storage.config["SAMPLES_FOLDER"])

@app.route('/config', methods=['GET'])
def config():
    if request.method == 'GET':
        return storage.config
    # if request.method == 'Post':
    #     storage.config

# if __name__ == "__main__":
#     app.run(host=storage.config["HOST"], port=storage.config["REST_PORT"], debug=storage.config["DEBUG"])