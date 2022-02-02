import rtmidi_python as rtmidi
import logging

logger = logging.getLogger(__name__)

def open(callback):
  midi_in = [rtmidi.MidiIn(b'in')]
  previous = []
  while True:
      for port in midi_in[0].ports:
          if port not in previous and b'Midi Through' not in port:
              midi_in.append(rtmidi.MidiIn(b'in'))
              midi_in[-1].callback = callback
              midi_in[-1].open_port(port)
              logger.info('Opened MIDI: ' + str(port))
      previous = midi_in[0].ports
