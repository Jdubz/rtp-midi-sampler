class Router {
  constructor() {
    this.inputs = {};
    this.outputs = {};
  }

  createInput(input) {
    this.inputs[input.name] = {
      device: input,
      callbacks: {},
    };
  }

  createOutput(output) {
    this.outputs[output.name] = output;
  }

  mountCallback(input, output, callback) {
    this.inputs[input.name].callbacks[output.name] = callback;
  }

  removeCallback(input, output) {
    delete this.inputs[input.name].callbacks[output.name];
  }

  route(input, message) {
    Object.values(this.inputs[input.name].callbacks)
      .forEach((callback) => callback(message));
  }
}

module.exports = Router;
