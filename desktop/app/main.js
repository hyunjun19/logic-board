import _ from 'underscore';
import $ from 'jquery';
import mermaid from 'mermaid';

console.log('main.js underscore version is', _.VERSION);
console.log('main.js jquery     version is', $.fn.jquery);
console.log('main.js mermaid    version is', mermaid.version());

mermaidAPI.initialize({startOnLoad:false});

$(function(){
    // Example of using the API
    window.$logicEditor   = $('#logic-editor');
    window.$mermaidCanvas = $('#mermaid-canvas');

    $mermaidCanvas.render = function(){
        mermaidAPI.render('canvas', $logicEditor.val(), function(svgCode, bindFunctions){
            $mermaidCanvas.html(svgCode);
        });
    };

    $mermaidCanvas.render();
});