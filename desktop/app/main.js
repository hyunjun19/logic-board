import _ from 'lodash';
import $ from 'jquery';
import mermaid from 'mermaid';
import 'mermaid/dist/mermaid.forest.css!';

const remote   = require('electron').remote;
const Commands = require('./app/commands');

console.log('app version is', remote.app.getVersion());
console.log('main.js lodash  version is', _.VERSION);
console.log('main.js jquery  version is', $.fn.jquery);
console.log('main.js mermaid version is', mermaid.version());

$(function(){
  mermaidAPI.initialize({startOnLoad:false});

  let diagram = [
    'graph',
    'sequenceDiagram',
    'gantt'
  ];

  let $lbEditor = $('#lb-editor');
  let $lbCanvas = $('#lb-canvas');
  let commands = Commands($lbEditor, $lbCanvas);

  /////////////////////////////////////
  // for debugging                   //
  /////////////////////////////////////
  window.remote = remote;
  window.$lbEditor = $lbEditor;
  window.$lbCanvas = $lbCanvas;
  /////////////////////////////////////
  // for debugging                   //
  /////////////////////////////////////

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

});
