#!/usr/bin/env python

from flask import Flask, request
from flask_cors import CORS

from rtpserver import RTPServer
from files import upload, get_files
from audio import get_devices

RTP_HOST = '0.0.0.0'
RTP_PORT = 5051

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/audiodevice', methods=['GET'])
def audiodevices():
    return get_devices()

@app.route('/files', methods=['GET', 'POST'])
def file():
    if request.method == 'POST':
        return upload(request)
    if request.method == 'GET':
        return get_files()

RTPServer(RTP_HOST, RTP_PORT)
