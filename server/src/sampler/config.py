import sys
import json

class Config():
  def __init__(self):
    self.AUDIO_DEVICE_ID = int(sys.argv[1])
    self.SAMPLES_FOLDER = sys.argv[2]
    with open(sys.argv[2] + '/channels.json', 'r') as f:
      data = json.load(f)
      self.channels = data
