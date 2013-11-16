var camera = require('./xindex')
var videoEl = document.getElementById('source')
var mirror = document.getElementById('mirror')
var film = document.getElementById('film')
var print = document.getElementById('print')
var hideButton = document.getElementById('hide')

var userMediaStream = require('./getUserMedia.js')({audio: false, video: true})

hideButton.addEventListener('click', function(E){
    videoEl.style.display="none"
    mirror.style.display="none"
})
userMediaStream.on('stream', function(stream){
    
    videoEl.src = window.URL.createObjectURL(stream)
	
    var controller = camera(videoEl, mirror, film, print)
    
    controller.on('expose', function(data){
     //   var r = render.getContext('2d')
   //     r.putImageData(data, 0, 0)
 //       console.log(data)
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

