import os

from sound import Sound 

def load_samples(config, samples):
    channel = 0
    while channel < 16:
        if config.channels[channel]:
            for midinote in range(0, 127):
                file = os.path.join(config.SAMPLES_FOLDER + '/' + config.channels[channel], "%d.wav" % midinote)

                if os.path.isfile(file):
                    samples[channel][midinote, 127] = Sound(file, midinote, 127)

        initial_keys = set(samples[channel].keys())
        for midinote in range(128):
            lastvelocity = None
            for velocity in range(128):
                if (midinote, velocity) not in initial_keys:
                    samples[channel][midinote, velocity] = lastvelocity
                else:
                    if not lastvelocity:
                        for v in range(velocity):
                            samples[channel][midinote, v] = samples[channel][midinote, velocity]
                    lastvelocity = samples[channel][midinote, velocity]
            if not lastvelocity:
                for velocity in range(128):
                    try:
                        samples[channel][midinote, velocity] = samples[channel][midinote-1, velocity]
                    except:
                        pass
        channel += 1
