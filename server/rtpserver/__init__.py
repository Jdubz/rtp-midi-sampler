

from pymidi import server

class RTPServer():
  def __init__(self):
    self.server = server.Server([('0.0.0.0', 5051)])
    self.server.add_handler(self.Handler())

  def start(self):
    self.server.serve_forever()

class RTPHandler(server.Handler):
  def on_peer_connected(self, peer):
    print('Peer connected: {}'.format(peer))

  def on_peer_disconnected(self, peer):
    print('Peer disconnected: {}'.format(peer))

  def on_midi_commands(self, peer, command_list):
    for command in command_list:
      if command.command == 'note_on':
        key = command.params.key
        velocity = command.params.velocity
        print('Someone hit the key {} with velocity {}'.format(key, velocity))
