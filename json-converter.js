const fsLibrary = require('fs');

// Load JSON text from server hosted file and return JSON parsed object
function loadJSON(filePath) {
    // Load json file;
    var json = fsLibrary.readFileSync(filePath);
    // Parse json
    return JSON.parse(json);
  }

  module.exports = { loadJSON }