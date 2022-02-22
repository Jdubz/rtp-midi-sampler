class Socket {
  constructor(io) {
    this.io = io;
  }

  send(type, message) {
    this.io.emit(type, message);
  }
}

module.exports = Socket;
