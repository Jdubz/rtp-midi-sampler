import threading
import os

from audio.sound import Sound

class Loader():
    def __init__(self, config):
        self.LoadingThread = None
        self.LoadingInterrupt = False
        self.config = config
        self.samples = {}

    def LoadSamples(self):
        if self.LoadingThread:
            self.LoadingInterrupt = True
            self.LoadingThread.join()
            self.LoadingThread = None

        self.LoadingInterrupt = False
        self.LoadingThread = threading.Thread(target=self.ActuallyLoad)
        self.LoadingThread.daemon = True
        self.LoadingThread.start()

    def ActuallyLoad(self):
        NOTES = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"]

        samplesdir = self.config["SAMPLES_FOLDER"]

        for midinote in range(0, 127):
            if self.LoadingInterrupt:
                return
            file = os.path.join(samplesdir, "%d.wav" % midinote)
            if os.path.isfile(file):
                self.samples[midinote, 127] = Sound(file, midinote, 127)

        initial_keys = set(self.samples.keys())
        for midinote in range(128):
            lastvelocity = None
            for velocity in range(128):
                if (midinote, velocity) not in initial_keys:
                    self.samples[midinote, velocity] = lastvelocity
                else:
                    if not lastvelocity:
                        for v in range(velocity):
                            self.samples[midinote, v] = self.samples[midinote, velocity]
                    lastvelocity = self.samples[midinote, velocity]
            if not lastvelocity:
                for velocity in range(128):
                    try:
                        self.samples[midinote, velocity] = self.samples[midinote-1, velocity]
                    except:
                        pass
