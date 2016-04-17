'use strict';

const remote    = require('electron').remote;
const os        = require('os');
const fs        = require('graceful-fs');
const path      = require('path');
const exec      = require('child_process').exec;
const svgexport = require('svgexport');

module.exports = function($lbEditor, $lbCanvas) {
  return {
    open: function(){
      remote.dialog.showOpenDialog({
        title: 'open file...'
      }, function(selectedFilePaths){
        if (_.isEmpty(selectedFilePaths)) { return; }

        let selectedFilePath = selectedFilePaths[0];
        fs.readFile(selectedFilePath, (err, data) => {
          if (err) throw err;

          let content = String(data);
          window.document.title = selectedFilePath;
          window.document.filePath = selectedFilePath;

          $lbEditor.val(content);
          $lbCanvas.render();
        });
      });
    },
    save: function(){
      if (window.document.filePath) {
        fs.writeFile(window.document.filePath, $lbEditor.val(), (err) => {
          if (err) throw err;

          console.log('It\'s saved!');
        });
      } else {
        remote.dialog.showSaveDialog({
          title: 'save file...'
        }, function(selectedFilePath){
          if (_.isEmpty(selectedFilePath)) { return; }

          fs.writeFile(selectedFilePath, $lbEditor.val(), (err) => {
            if (err) throw err;

            console.log('It\'s saved!');
            window.document.title = selectedFilePath;
            window.document.filePath = selectedFilePath;
          });
        });
      }

      console.log('render');
      $lbCanvas.render();
    },
    export: function(){
      let data = $lbCanvas.html();
      let basename = path.basename((window.document.filePath || Date.now()), '.txt');
      let srcFilePath = path.join(os.tmpdir(), basename + '.svg');
      let dstFilePath = path.join(os.homedir(), 'Desktop', basename + '.png');

      fs.writeFile(srcFilePath, data, (err) => {
        if (err) throw err;

        // svgexport.cli([srcFilePath, dstFilePath]);
        // /*
        svgexport.render({
          input: srcFilePath,
          output: dstFilePath
        }, function(err){
          if (err) throw err;

          var saveNotification = new Notification('Logic-board', {
            body: `success save\n${dstFilePath}`,
          });
          saveNotification.onclick = function(){
            let dstDir = path.dirname(dstFilePath);
            let openCommand = 'explorer.exe';
            switch (process.platform) {
              case 'darwin':
                openCommand = 'open';
                break;
              default:
                throw new Error('not found open command');
                break;
            }
            exec(`${openCommand} ${dstDir}`, (error, stdout, stderr) => {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                if (error !== null) {
                  console.log(`exec error: ${error}`);
                }
            });
          }
        });
        // */
      });
    }
  };
}
