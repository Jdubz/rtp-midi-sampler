#!/usr/bin/env python

from flask import Flask

from rtpserver import RTPServer

midiServer = RTPServer()
midiServer.start()

app = Flask(__name__, static_folder='../build', static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/audiodevice', methods=['GET', 'POST'])
def audiodevices():
    print('audioooo')
