'use strict';

const remote = require('electron').remote;
const fs     = require('graceful-fs');

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
    }
  };
}
