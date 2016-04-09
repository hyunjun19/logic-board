import _ from 'lodash';
import $ from 'jquery';
import mermaid from 'mermaid';
import 'mermaid/dist/mermaid.forest.css!';

const remote = require('electron').remote;
const fs     = require('graceful-fs');

/////////////////////////////////////
// for debugging                   //
/////////////////////////////////////
window.remote = remote;


console.log('app version is', remote.app.getVersion());
console.log('main.js underscore version is', _.VERSION);
console.log('main.js jquery     version is', $.fn.jquery);
console.log('main.js mermaid    version is', mermaid.version());

mermaidAPI.initialize({startOnLoad:false});

$(function(){
  let diagram = [
    'graph',
    'sequenceDiagram',
    'gantt'
  ];
  let filePath;

  window.$lbEditor = $('#lb-editor');
  window.$lbCanvas = $('#lb-canvas');

  $lbCanvas.render = function(){
    $lbCanvas.empty();
    var logicTxt = $lbEditor.val();
    if (logicTxt) {
      mermaidAPI.render('lb-output', logicTxt, function(svgCode, bindFunctions){
        $lbCanvas.html(svgCode);
        console.log('input\n---------------------\n', logicTxt);
      });
    }
  };

  $lbCanvas.render();

  $(document.body).on('keypress', (e) => {
    if (!e.ctrlKey) { return; }

    switch (e.keyCode) {
      case 19:
        commands.save();
        break;
      case 15:
        commands.open();
        break;
      default:
        break;
    }
  });

  const commands = {
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
          filePath = selectedFilePath;

          $lbEditor.val(content);
          $lbCanvas.render();
        });
      });
    },
    save: function(){
      if (filePath) {
        fs.writeFile(filePath, $lbEditor.val(), (err) => {
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
            filePath = selectedFilePath;
          });
        });
      }

      console.log('render');
      // TODO change command pattern
      $lbCanvas.render();
    }
  };
});
