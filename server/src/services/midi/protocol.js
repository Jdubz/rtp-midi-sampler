module.exports.parseStatus = (int) => {
  const byte = int.toString(16);
  const channel = parseInt(byte[1], 16);
  const command = parseInt(byte[0], 16);
  return {
    channel,
    command,
  };
};
