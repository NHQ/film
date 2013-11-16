var camera = require('./')
var videoEl = document.getElementById('source')
var film = document.getElementById('film')
var mirror = document.getElementById('mirror')

var userMediaStream = require('./getUserMedia.js')({audio: true, video: true})

userMediaStream.on('stream', function(stream){
    
    var controller = camera(stream, videoEl, mirror, film)

    controller.on('expose', function(data){
        var render = film.getContext('2d')
        render.putImageData(data, 0, 0)

    })

    controller.on('snapshot', function(data){
        var render = film.getContext('2d')
        render.putImageData(data, 0, 0)
    })

    controller.on('record', function(data){
        console.log(data.length)
    })

    //controller.record()

    setTimeout(function(){
     //   controller.record()
    }, 5000)

    setInterval(function(){
        controller.expose({shutterSpeed: 2000, filmSpeed:{
            r: 7,
            g: 11,
            b: 2
        }})
    }, 3000)
    setInterval(function(){
 //       controller.snapShot({shutterSpeed: 2000})
    }, 5000)
    
})

