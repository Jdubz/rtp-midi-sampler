import os

from logger import info
from sound import Sound 

def load_channel(config, channel, samples):
    samples[channel['channel']] = {}

    for midinote in range(0, 127):
        file = os.path.join(config.SAMPLES_FOLDER + '/' + channel['folder'], "%d.wav" % midinote)

        if os.path.isfile(file):
            # info('file loaded', file)
            samples[channel['channel']][midinote, 127] = Sound(file, midinote, 127)

    initial_keys = set(samples[channel['channel']].keys())
    for midinote in range(128):
        lastvelocity = None
        for velocity in range(128):
            if (midinote, velocity) not in initial_keys:
                samples[channel['channel']][midinote, velocity] = lastvelocity
            else:
                if not lastvelocity:
                    for v in range(velocity):
                        samples[channel['channel']][midinote, v] = samples[channel['channel']][midinote, velocity]
                lastvelocity = samples[channel['channel']][midinote, velocity]
        if not lastvelocity:
            for velocity in range(128):
                try:
                    samples[channel['channel']][midinote, velocity] = samples[channel['channel']][midinote-1, velocity]
                except:
                    pass

def load_samples(config, channels, samples):
    samples = []
    while len(samples) < 16:
        samples.append({})
    channel = 0
    while channel < 16:
        if channels[channel]:
            load_channel(config, {
              'channel': channel,
              'folder': channels[channel],
            }, samples)
            
        else:
            samples[channel] = None

        channel += 1
    info('samples', 'loading finished')
