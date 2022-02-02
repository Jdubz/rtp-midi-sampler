import sounddevice as sd
from flask import jsonify
import numpy
import samplerbox_audio
import logging

logger = logging.getLogger(__name__)

class Audio():
    def __init__(self, global_volume, config):
        self.config = config
        self.global_volume = global_volume
        self.playingsounds = []
        self.FADEOUTLENGTH = 30000
        FADEOUT = numpy.linspace(1., 0., self.FADEOUTLENGTH) # by default, float64
        FADEOUT = numpy.power(FADEOUT, 6)
        self.FADEOUT = numpy.append(FADEOUT, numpy.zeros(self.FADEOUTLENGTH, numpy.float32)).astype(numpy.float32)
        self.SPEED = numpy.power(2, numpy.arange(0.0, 84.0)/12).astype(numpy.float32)

    def get_devices():
        return jsonify(sd.query_devices())

    def start(self):          

        try:
            stream = sd.OutputStream(device=self.config['AUDIO_DEVICE_ID'], blocksize=512, samplerate=44100, channels=2,  dtype='int16', callback=get_callback(self.playingsounds, self.FADEOUT, self.FADEOUTLENGTH, self.SPEED, self.global_volume))
            stream.start()
            logger.info('Opened audio device #%i' % self.config['AUDIO_DEVICE_ID'])
        except Exception as e:
            logger.warn(e)
            exit(1)

def get_callback(playingsounds, FADEOUT, FADEOUTLENGTH, SPEED, global_volume):

    def cb(outdata, frame_count, time_info, status):
        MAX_POLYPHONY = 80
        rmlist = []
        if (len(playingsounds)):
            print(playingsounds)
            
        playingsounds = playingsounds[-MAX_POLYPHONY:]
        b = samplerbox_audio.mixaudiobuffers(playingsounds, rmlist, frame_count, FADEOUT, FADEOUTLENGTH, SPEED)
        for e in rmlist:
            try:
                playingsounds.remove(e)
            except:
                pass
        b *= global_volume
        outdata[:] = b.reshape(outdata.shape)
    
    return cb
