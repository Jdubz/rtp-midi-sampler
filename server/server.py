#!/usr/bin/env python

from flask import Flask
from rtpserver import RTPServer

RTP_HOST = '0.0.0.0'
RTP_PORT = 5051

app = Flask(__name__, static_folder='../build', static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/audiodevice', methods=['GET', 'POST'])
def audiodevices():
    print('audioooo')

RTPServer(RTP_HOST, RTP_PORT)
