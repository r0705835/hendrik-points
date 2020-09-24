const fsLibrary = require('fs');

// Load JSON text from server hosted file and return JSON parsed object
function loadJSON(filePath) {
  if(fsLibrary.existsSync(filePath))
  {
    // Load json file;
    var json = fsLibrary.readFileSync(filePath);
    console.log(JSON.parse(json));
    // Parse json
    return JSON.parse(json);
  }  
}

function saveJSON(filePath, cummies) {
  var data = JSON.stringify(cummies);
  console.log(data);
  fsLibrary.writeFileSync(filePath, data);
}

module.exports = { loadJSON, saveJSON } 