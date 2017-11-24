const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const FsUtil = {};

// Scans a directory for files with a given suffix and passes each to a callback.
FsUtil.forEachFileInDir = function (dir, fileSuffix, callback) {
    if (!fs.existsSync(dir)) {
        return;
    }
    if (!fs.statSync(dir).isDirectory()) {
        return;
    }

    fs.readdirSync(dir).forEach(function (filename) {
        if (filename.endsWith(fileSuffix)) {
            const filePath = path.join(dir, filename);
            const name = filename.slice(0, -(fileSuffix.length));
            callback(filePath, name);
        }
    });
};

// Scans a directory for subdirectories and passes each to a callback.
FsUtil.forEachSubDirectoryInDir = function (directory, callback) {
    const subDirs = [];
    fs.readdirSync(directory).forEach(function (file) {
        // Check the type of each file
        const fileStat = fs.statSync(path.join(directory, file));

        // If the file is a directory, we can add it to the subDirs array
        if (fileStat.isDirectory()) {
            subDirs.push(file);
        }
    });

    _.each(subDirs.sort(), callback);
};

module.exports = FsUtil;