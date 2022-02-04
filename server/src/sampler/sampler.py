import sounddevice as sd
import samplerbox_audio
import numpy
import sys
import json

from load import load_samples
from config import Config
from midi import Midi_Handler

config = Config()
playingsounds = []
global_volume = 10 ** (-12.0/20)  # -12dB default global volume
samples = []
while len(samples) < 16:
  samples.append({})
midi_handler = Midi_Handler()

def audio_callback(outdata, frame_count, time_info, status):
  global playingsounds
  global global_volume

  if len(playingsounds):
    print(playingsounds)

  FADEOUTLENGTH = 30000
  FADEOUT = numpy.linspace(1., 0., FADEOUTLENGTH) # by default, float64
  FADEOUT = numpy.power(FADEOUT, 6)
  FADEOUT = numpy.append(FADEOUT, numpy.zeros(FADEOUTLENGTH, numpy.float32)).astype(numpy.float32)
  SPEED = numpy.power(2, numpy.arange(0.0, 84.0)/12).astype(numpy.float32)
  MAX_POLYPHONY = 80
  rmlist = []      
  playingsounds = playingsounds[-MAX_POLYPHONY:]
  b = samplerbox_audio.mixaudiobuffers(playingsounds, rmlist, frame_count, FADEOUT, FADEOUTLENGTH, SPEED)
  for e in rmlist:
    try:
      playingsounds.remove(e)
    except:
      pass
  b *= global_volume
  outdata[:] = b.reshape(outdata.shape)

def start_audio():
  try:
    stream = sd.OutputStream(device=config.AUDIO_DEVICE_ID, blocksize=512, samplerate=44100, channels=2,  dtype='int16', callback=audio_callback)
    stream.start()
    print('Opened audio device #%i' % config.AUDIO_DEVICE_ID)
  except Exception as e:
    print('Audio Device Error: ' + str(config.AUDIO_DEVICE_ID))
    print(e)
    exit(1)

load_samples(config, samples)
start_audio()

while True:
  for line in sys.stdin:
    try:
      midi_handler.use_command(json.loads(line), samples, playingsounds)
      print(playingsounds)
    except Exception as e:
      print(e)

