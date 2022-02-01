#!/usr/bin/env python

from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import logging
import os
import asyncio

from midi.rtp_server import start_server
from midi import Midi
from audio import Audio
from storage import Storage
from files.load import Loader

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

globalVolume = 10 ** (-12.0/20)  # -12dB default global volume

storage = Storage()
audio = Audio(globalVolume, storage.config)

def start_audio():
    asyncio.run(audio.start())

audio_thread = threading.Thread(target=start_audio)
audio_thread.start()

fileLoader = Loader(storage.config)
fileLoader.LoadSamples()

midihandler = Midi(fileLoader.samples)

app = Flask(__name__, static_folder='../../build', static_url_path='/')
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/audiodevice', methods=['GET'])
def audiodevices():
    return Audio.get_devices()

@app.route('/file/<path>', methods=['GET', 'POST'])
@app.route('/file', methods=['GET', 'POST'])
def file(path=None):
    print(path)
    filePath = storage.config["SAMPLES_FOLDER"] + '/' + path if path else storage.config["SAMPLES_FOLDER"]
    if request.method == 'GET':
        return jsonify(os.listdir(filePath))

@app.route('/config', methods=['GET'])
def config():
    if request.method == 'GET':
        return storage.config
    # if request.method == 'Post':
    #     storage.config

def start_flask(host, port, debug):
    app.run(host=host, port=port, debug=debug, threaded=True)

if __name__ == "__main__":
    flask_server = threading.Thread(target=start_flask, args=(storage.config["HOST"], storage.config["REST_PORT"], storage.config["DEBUG"]), daemon=True)
    flask_server.start()

start_server(storage.config["HOST"], storage.config["RTP_PORT"], midihandler.rtpmidi_callback)
