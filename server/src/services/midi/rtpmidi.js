const rtpmidi = require('rtpmidi');

class RtpMidi {
  constructor(name, port, callback) {
    const session = rtpmidi.manager.createSession({
      localName: name,
      bonjourName: name,
      port,
    });

    session.on('ready', () => {
      console.log(`rtpmidi ready: ${name}:${port}`);
    });

    session.on('message', (deltaTime, message) => {
      const commands = Array.prototype.slice.call(message, 0);
      callback(commands);
    });

    session.on('streamAdded', (event) => {
      console.log(`The stream "${event.stream.name}" was added to the session "${session.localName}"`);
    });

    session.on('streamRemoved', (event) => {
      console.log(`The stream "${event.stream.name}" was removed from the session "${session.localName}"`);
    });
  }
}

module.exports = RtpMidi;
