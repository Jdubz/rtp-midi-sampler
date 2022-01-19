
from pymidi import server

class RTPServer():
  def __init__(self, host, port):
    midi_server = server.Server([(host, port)])
    midi_server.add_handler(RTPHandler())
    print('rtp server starting on '+host+':'+str(port))
    midi_server.serve_forever()

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
        channel = command.channel
        print('Note: {} Velocity: {} Channel: {}'.format(key, velocity, channel))
