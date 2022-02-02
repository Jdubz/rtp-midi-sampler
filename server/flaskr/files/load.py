import threading
import os

from audio.sound import Sound

class Loader():
    def __init__(self, config):
        self.LoadingThread = None
        self.LoadingInterrupt = False
        self.config = config
        self.samples = {}
        
        channel = 0
        while channel < 16:
            self.samples[channel] = {}
            channel += 1

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
        samplesdir = self.config["SAMPLES_FOLDER"]
        channels = self.config['channels']

        channel = 0
        while channel < 16:
            if channels[channel]:
                for midinote in range(0, 127):
                    if self.LoadingInterrupt:
                        return
                    file = os.path.join(samplesdir + '/' + channels[channel], "%d.wav" % midinote)

                    if os.path.isfile(file):
                        self.samples[channel][midinote, 127] = Sound(file, midinote, 127)

            initial_keys = set(self.samples[channel].keys())
            for midinote in range(128):
                lastvelocity = None
                for velocity in range(128):
                    if (midinote, velocity) not in initial_keys:
                        self.samples[channel][midinote, velocity] = lastvelocity
                    else:
                        if not lastvelocity:
                            for v in range(velocity):
                                self.samples[channel][midinote, v] = self.samples[channel][midinote, velocity]
                        lastvelocity = self.samples[channel][midinote, velocity]
                if not lastvelocity:
                    for velocity in range(128):
                        try:
                            self.samples[channel][midinote, velocity] = self.samples[channel][midinote-1, velocity]
                        except:
                            pass
