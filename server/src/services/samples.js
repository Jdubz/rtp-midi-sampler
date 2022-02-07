var fs = require('fs');

const walkDir = async (dir, results) => {
  const files = await fs.promises.readdir(dir)
  files.forEach((file) => {
    const stat = await fs.promises.stat(file);
    if (stat && stat.isDirectory()) {
      const directory = {};
      directory.name = file;
      directory.files = await walkDir(file, results);
      results.push(directory);
    } else {
      results.push(file);
    }
    return results;
  });
}

class SamplesService {
  readSamplesFolder() {
    return await walkDir(dir);
  }
}

module.exports = SamplesService;
