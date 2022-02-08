var fs = require('fs');

const walkDir = async (dir, results) => {
  const files = await fs.promises.readdir(dir)
  for (const file in files) {
    const stat = await fs.promises.stat(dir + '/' + files[file]);
    if (stat && stat.isDirectory()) {
      const directory = {};
      directory.name = files[file];
      directory.files = await walkDir(dir + '/' + files[file], []);
      results.push(directory);
    } else {
      results.push(files[file]);
    }
  }
  return results;
}

class SamplesService {
  readSamplesFolder = async () => {
    return await walkDir('../samples', []);
  }
}

module.exports = SamplesService;
