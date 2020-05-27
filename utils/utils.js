const fs = require("fs");

module.exports = {
    validateDirectory: function(dir) {
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
    },
    fileExists: function(filePath) {
        return fs.existsSync(filePath);
    }
}