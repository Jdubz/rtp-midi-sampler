import logging
logger = logging.getLogger(__name__)

class Midi():
    def __init__(self, samples):
        self.playingnotes = {}
        self.sustainplayingnotes = []
        self.sustain = False
        self.samples = samples

    def send_command(channel, command, note, velocity=127):


    def rtpmidi_callback(self, command):
        print(command.command)
        print(int(command.params.key))

    def rtmidi_callback(self, message, time_stamp):
        messagetype = message[0] >> 4
        messagechannel = (message[0] & 15) + 1
        note = message[1] if len(message) > 1 else None
        midinote = note
        velocity = message[2] if len(message) > 2 else None

        if messagetype == 9 and velocity == 0:
            messagetype = 8

        if messagetype == 9:    # Note on
            try:
                self.playingnotes.setdefault(midinote, []).append(self.samples[midinote, velocity].play(midinote))
            except:
                pass

        elif messagetype == 8:  # Note off
            if midinote in self.playingnotes:
                for n in self.playingnotes[midinote]:
                    if self.sustain:
                        self.sustainplayingnotes.append(n)
                    else:
                        n.fadeout(50)
                self.playingnotes[midinote] = []

        elif (messagetype == 11) and (note == 64) and (velocity < 64):  # sustain pedal off
            for n in self.sustainplayingnotes:
                n.fadeout(50)
            self.sustainplayingnotes = []
            self.sustain = False

        elif (messagetype == 11) and (note == 64) and (velocity >= 64):  # sustain pedal on
            self.sustain = True
