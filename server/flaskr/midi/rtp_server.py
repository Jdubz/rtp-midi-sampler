from pymidi import server
import logging

logger = logging.getLogger(__name__)

def start_server(host, port, callback):
  bind_addrs = host + ':' + str(port)
  midi_server = server.Server.from_bind_addrs([bind_addrs])
  midi_server.add_handler(RTPHandler(callback))
  midi_server.serve_forever()

class RTPHandler(server.Handler):
  def __init__(self, callback):
    self.callback = callback

  def on_peer_connected(self, peer):
    logger.info('Peer connected: {}'.format(peer))

  def on_peer_disconnected(self, peer):
    logger.info('Peer disconnected: {}'.format(peer))

  def on_midi_commands(self, peer, command_list):
    for command in command_list:
      self.callback(command)

