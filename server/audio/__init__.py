import sounddevice as sd
from flask import jsonify

def get_devices():
    return jsonify(sd.query_devices())
