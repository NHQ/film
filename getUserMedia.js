var emitter = require('events').EventEmitter

navigator.getUserMedia = (navigator.getUserMedia || 
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia);

module.exports = function(opts){
    
    var om = new emitter()
    
    navigator.getUserMedia(opts, function(stream){
        om.emit('stream', stream)
    }, function(err){
        alert('no webcam or no getUserMedia support detected.  Try Using Chome')
    })
    
    return om
}
