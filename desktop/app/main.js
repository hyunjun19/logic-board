import _ from 'underscore';
import $ from 'jquery';
import mermaid from 'mermaid';
import 'mermaid/dist/mermaid.forest.css!';

const remote = require('electron').remote;
const fs     = require('fs');

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
    mermaidAPI.render('lb-output', $lbEditor.val(), function(svgCode, bindFunctions){
      $lbCanvas.html(svgCode);
    });
  };

  $lbCanvas.render();

  $(document.body).on('keypress', (e) => {
    if (e.ctrlKey && e.keyCode === 19) {
      if (filePath) {
        fs.writeFile(filePath, $lbEditor.val(), (err) => {
          if (err) throw err;
          console.log('It\'s saved!');
        });
      } else {
        remote.dialog.showSaveDialog({
          title: 'save file...'
        }, function(selectedFilePath){
          console.log('showSaveDialog', selectedFilePath);
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
  });
});
