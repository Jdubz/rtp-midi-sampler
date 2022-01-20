import sounddevice as sd

def get_devices():
    return sd.query_devices()
