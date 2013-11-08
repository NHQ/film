var camera = require('./')

var videoEl = document.getElementById('source')
var film = document.getElementById('film')
var mirror = document.getElementById('mirror')

var controller = camera(videoEl, film, mirror)

//controller.record()

//setInterval(snapChat, 1000)

setInterval(function(){
    controller.expose({shutterSpeed: 2000})
}, 3000)

function snapChat(){
    controller.snapShot()
}
