var camera = require('./xindex')
var videoEl = document.getElementById('source')
var mirror = document.getElementById('mirror')
var film = document.getElementById('film')
var print = document.getElementById('print')
var hideButton = document.getElementById('hide')
var ndelay = require('../../ndelay');

var delay = ndelay(640 * 480 * 4 * 20, 1, 1)

var userMediaStream = require('./getUserMedia.js')({audio: false, video: true})

hideButton.addEventListener('click', function(E){
    videoEl.style.display="none"
    mirror.style.display="none"
})
userMediaStream.on('stream', function(stream){
    
    videoEl.src = window.URL.createObjectURL(stream)
	
    var controller = camera(videoEl, mirror, film, print)
    
    var r = print.getContext('2d')
    
    controller.on('expose', function(data){
	var d = data.data
	for(var x = 0; x < d.length; x++){
	    d[x] = delay(d[x])
	}
        r.putImageData(data, 0, 0)
    })  
})

/*
knob.delta = 0;
spin(knob)

knob2.delta = 0;
spin(knob2)

knob2.addEventListener('spin', function(evt){
    console.log(evt)
    this.delta += evt.detail.delta
    this.style['-webkit-transform'] = 'rotateZ('+ this.delta +'deg)'
})


knob.addEventListener('spin', function(evt){
    console.log(evt)
    this.delta += evt.detail.delta
    this.style['-webkit-transform'] = 'rotateZ('+ this.delta +'deg)'
})
*/

