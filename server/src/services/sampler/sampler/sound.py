import numpy
import samplerbox_audio
from waveread import Waveread

class PlayingSound:
    def __init__(self, sound, note, playingsounds):
        self.sound = sound
        self.pos = 0
        self.fadeoutpos = 0
        self.isfadeout = False
        self.note = note
        self.playingsounds = playingsounds

    def fadeout(self, i):
        self.isfadeout = True

    def stop(self):
        try:
            self.playingsounds.remove(self)
        except:
            pass

class Sound:
    def __init__(self, filename, midinote, velocity):
        wf = Waveread(filename)
        self.fname = filename
        self.midinote = midinote
        self.velocity = velocity
        if wf.getloops():
            self.loop = wf.getloops()[0][0]
            self.nframes = wf.getloops()[0][1] + 2
        else:
            self.loop = -1
            self.nframes = wf.getnframes()

        self.data = self.frames2array(wf.readframes(self.nframes), wf.getsampwidth(), wf.getnchannels())

        wf.close()

    def play(self, note, playingsounds):
        snd = PlayingSound(self, note, playingsounds)
        playingsounds.append(snd)
        return snd

    def frames2array(self, data, sampwidth, numchan):
        if sampwidth == 2:
            npdata = numpy.fromstring(data, dtype=numpy.int16)
        elif sampwidth == 3:
            npdata = samplerbox_audio.binary24_to_int16(data, len(data)/3)
        if numchan == 1:
            npdata = numpy.repeat(npdata, 2)
        return npdata
