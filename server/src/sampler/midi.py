class Midi_Handler():
  def __init__(self):
    self.playingnotes = []
    while len(self.playingnotes) < 16:
      self.playingnotes.append({})
    self.sustainplayingnotes = []
    self.sustain = False

  def use_command(self, message, samples, playingsounds):

    if message["command"] == 9:    # Note on
      try:
        self.playingnotes[message["channel"]].setdefault(message["note"], []).append(samples[message["channel"]][message["note"], message["velocity"]].play(message["note"], playingsounds))
      except:
        pass

    elif message["command"] == 8:  # Note off
      if message["note"] in self.playingnotes[message["channel"]]:
        for n in self.playingnotes[message["channel"]][message["note"]]:
          if self.sustain:
            self.sustainplayingnotes[message["channel"]].append(n)
          else:
            n.fadeout(50)
        self.playingnotes[message["channel"]][message["note"]] = []

    elif (message["command"] == 11) and (message["note"] == 64) and (message["velocity"] < 64):  # sustain pedal off
      for n in self.sustainplayingnotes[message["channel"]]:
        n.fadeout(50)
      self.sustainplayingnotes = []
      self.sustain = False

    elif (message["command"] == 11) and (message["note"] == 64) and (message["velocity"] >= 64):  # sustain pedal on
      self.sustain = True
