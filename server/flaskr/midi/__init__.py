import logging
logger = logging.getLogger(__name__)

class Midi():
    def __init__(self, samples, playingsounds):
        self.playingnotes = {}
        self.sustainplayingnotes = []
        self.sustain = False
        self.samples = samples
        self.playingsounds = playingsounds

        channel = 0
        while channel < 16:
            self.playingnotes[channel] = {}
            channel += 1

    def send_command(self, channel, command, note, velocity=0):
        print('channel: ' + str(channel) + ' command: ' + str(command) + ' note: ' + str(note) + ' velocity: ' + str(velocity))

        if command == 9:    # Note on
            try:
                self.playingnotes[channel].setdefault(note, []).append(self.samples[channel][note, velocity].play(note, self.playingsounds))
            except:
                pass

        elif command == 8:  # Note off
            if note in self.playingnotes[channel]:
                for n in self.playingnotes[channel][note]:
                    if self.sustain:
                        self.sustainplayingnotes[channel].append(n)
                    else:
                        n.fadeout(50)
                self.playingnotes[channel][note] = []

        elif (command == 11) and (note == 64) and (velocity < 64):  # sustain pedal off
            for n in self.sustainplayingnotes[channel]:
                n.fadeout(50)
            self.sustainplayingnotes = []
            self.sustain = False

        elif (command == 11) and (note == 64) and (velocity >= 64):  # sustain pedal on
            self.sustain = True

    def rtpmidi_callback(self, command):
        commandMap = {
            'note_on': 9,
            'note_off': 8,
            'sustain': 11,
        }

        self.send_command(command.channel, commandMap[command.command], int(command.params.key), command.params.velocity)

    def rtmidi_callback(self, message, time_stamp):
        messagetype = message[0] >> 4
        messagechannel = (message[0] & 15) + 1
        note = message[1] if len(message) > 1 else None
        midinote = note
        velocity = message[2] if len(message) > 2 else None

        self.send_command(messagechannel, messagetype, midinote, velocity)
