import sounddevice as sd
import soundfile as sf
import samplerbox_audio
import numpy
import sys
import json
import os

from load import load_samples
from config import Config
from midi import Midi_Handler
from logger import response, info, error

config = Config()
playingsounds = []
global_volume = 10 ** (-12.0/20)  # -12dB default global volume
samples = []
while len(samples) < 16:
  samples.append({})
midi_handler = Midi_Handler()

def startup():
  file = os.path.join(config.SAMPLES_FOLDER + '/startup.wav')
  
  if os.path.isfile(file):
    try:
      data, fs = sf.read(file)
      sd.play(data, fs, device=config.AUDIO_DEVICE_ID)
      status = sd.wait()
      if (status): info('startup status', status)
    except Exception as e:
      error('startup', e)

def audio_callback(outdata, frame_count, time_info, status):
  global playingsounds
  global global_volume

  if (status): print(status)
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
  samplerate = sd.query_devices(config.AUDIO_DEVICE_ID, 'output')['default_samplerate']
  try:
    stream = sd.OutputStream(device=config.AUDIO_DEVICE_ID, blocksize=512, samplerate=samplerate, channels=2,  dtype='int16', callback=audio_callback)
    stream.start()
    info('audio stream', 'Opened audio device: '+ str(config.AUDIO_DEVICE_ID))
  except Exception as e:
    error('outputstream', e)
    exit(1)

def controlCallback(message):
  if message['type'] == 'request':
    if message['id'] == 'getDevices':
      devices = sd.query_devices()
      response(message['id'], devices)

    if message['id'] == 'playFile':
      response(message['id'], 'not yet')

  if message['type'] == 'midi':
    try:
      midi_handler.use_command(message['message'], samples, playingsounds)
    except Exception as e:
      error('midi handler', e)
      

load_samples(config, samples)
startup()
start_audio()

while True:
  for line in sys.stdin:
    message = json.loads(line)
    controlCallback(message)

