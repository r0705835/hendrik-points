const fsLibrary = require('fs');
const CryptoJS = require("crypto-js");

// Load JSON text from server hosted file and return JSON parsed object
function loadJSON(filePath) {
  if(fsLibrary.existsSync(filePath))
  {
    // Load json file;
    var json = fsLibrary.readFileSync(filePath);
    // Parse json
    return JSON.parse(json);
  }  
}

function loadEncryptedJSON(filePath) {
  if(fsLibrary.existsSync(filePath))
  {
    // Load json file;
    var json = fsLibrary.readFileSync(filePath);
    // Parse json
    var parsed = JSON.parse(json);
    var decrypted = [];
    parsed.forEach(element => {
      decrypted.push(CryptoJS.AES.decrypt(element, 'hendrik123').toString(CryptoJS.enc.Utf8));
    });
    return decrypted;
  } 
} 

function saveJSON(filePath, cummies) {
  var data = JSON.stringify(cummies);
  fsLibrary.writeFileSync(filePath, data);
}

module.exports = { loadJSON, loadEncryptedJSON, saveJSON } 