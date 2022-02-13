import sounddevice as sd
import soundfile as sf
import samplerbox_audio
import numpy
import sys
import json
import os

from load import load_samples, load_channel
from midi import Midi_Handler
from logger import response, info, error, event

playingsounds = []
global_volume = 10 ** (-12.0/20)  # -12dB default global volume
samples = []
while len(samples) < 16:
  samples.append({})
midi_handler = Midi_Handler()
outStream = None
audio_device = 0
SAMPLES_FOLDER = sys.argv[1]

def startup(audio_device):
  file = os.path.join(SAMPLES_FOLDER + '/startup.wav')
  
  if os.path.isfile(file):
    try:
      data, fs = sf.read(file)
      sd.play(data, fs, device=audio_device)
      status = sd.wait()
      if (status): info('startup status', status)
    except Exception as e:
      error('startup', e)

def audio_callback(outdata, frame_count, time_info, status):
  global playingsounds
  global global_volume

  if (status): error('audio callback', status)
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

def start_audio(device_id=None):
  global audio_device
  global outStream

  if (device_id):
    audio_device = device_id

  samplerate = sd.query_devices(device_id, 'output')['default_samplerate']
  try:
    outStream = sd.OutputStream(device=device_id, blocksize=512, samplerate=samplerate, channels=2,  dtype='int16', callback=audio_callback)
    outStream.start()
    info('audio stream', 'Opened audio device id: '+ str(audio_device))
  except Exception as e:
    error('outputstream', e)
    exit(1)

def stop_audio():
  global outStream
  if (outStream):
    outStream.stop()

# TODO catch / handle / return errors
def controlCallback(message):
  global samples
  global playingsounds
  global SAMPLES_FOLDER

  if message['type'] == 'request':
    if message['id'] == 'getDevices':
      devices = sd.query_devices()
      response(message['id'], devices)

    if message['id'] == 'playFile':
      response(message['id'], 'development in progress')

    if message['id'] == 'loadSamples':
      load_samples(SAMPLES_FOLDER, message['message'], samples)
      info('load samples 0', len(samples[0].keys()))
      response(message['id'], 'samples loaded')

    if message['id'] == 'loadChannel':
      load_channel(SAMPLES_FOLDER, message['message']['channel'], message['message']['folder'], samples)
      response(message['id'], 'channel loaded')
    
    if message['id'] == 'start_audio':
      stop_audio()
      startup(message['message'])
      start_audio(message['message'])
      response(message['id'], 'audio started')

  if message['type'] == 'midi':
    try:
      midi_handler.use_command(message['message'], samples, playingsounds)
    except Exception as e:
      error('midi handler', e)

event('ready', { 'audioDevices': sd.query_devices() })
while True:
  for line in sys.stdin:
    message = json.loads(line)
    controlCallback(message)

