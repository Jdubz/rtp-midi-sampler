import os

from logger import info
from sound import Sound 

def load_channel(SAMPLES_FOLDER, channel, folder, samples):
    loadSamples = {}

    for midinote in range(0, 127):
        file = os.path.join(SAMPLES_FOLDER + '/' + folder, "%d.wav" % midinote)

        if os.path.isfile(file):
            # info('file loading', file)
            loadSamples[midinote, 127] = Sound(file, midinote, 127)

    initial_keys = set(loadSamples.keys())
    for midinote in range(128):
        lastvelocity = None
        for velocity in range(128):
            if (midinote, velocity) not in initial_keys:
                loadSamples[midinote, velocity] = lastvelocity
            else:
                if not lastvelocity:
                    for v in range(velocity):
                        loadSamples[midinote, v] = loadSamples[midinote, velocity]
                lastvelocity = loadSamples[midinote, velocity]
        if not lastvelocity:
            for velocity in range(128):
                try:
                    loadSamples[midinote, velocity] = loadSamples[midinote-1, velocity]
                except:
                    pass

    samples[channel] = loadSamples
    info('sample loader', 'channel ' + str(channel) + ': ' + folder)

def load_samples(SAMPLES_FOLDER, channels, samples):
    samples.clear()
    while len(samples) < 16:
        samples.append(None)
    channel = 0
    while channel < 16:
        if channels[channel]:
            load_channel(SAMPLES_FOLDER, channel, channels[channel], samples)

        channel += 1
    info('samples', 'loading finished')
