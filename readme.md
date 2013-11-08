# Film

A webcam module with a few features.

NOTE: this module will handle the getUserMedia stream, and apply it to your video element. See:

##Usage

```js
var film = require('film');

var camera = film(videoElement, canvasElement)
```

The constructor returns an event emitter with methods

##Methods and Events

All events return canvas Image Data objects, or in the case of record, a set of Image Data objects.

```js
camera.snapshot()
camera.record()
camera.expose(params)

camera.on('snapshot', fn(data){})
camera.on('record', fn(data){})
camera.on('expose', fn(data){})

```
###camera.snapshot()
Call this method to capture a snapshot from the source (the video element)
listen for the 'snapshot' event to get the frame.

###camera.record()
This method starts and ends the capturing of canvas frames.
call record() again to stop
listen for the 'record' event to get an array of all frames recorded, in order of course

##camera.expose([params])
This method is like snapshot, except that it takes some optional camera-like parameters.  
Here they are, with their defaults and descriptions:
```js
var params = {
  shutterSpeed: 1000 / 24, // how long to hold exposure open on the capture, in milliseconds.  The default here is for 1 frame @ 24fps.
  filmSpeed: 5, // the larger this number, the "slower" the film, see further description below
  r: 0, // the "film" defaults to black, and exposes to light. 
  g: 0, // but by setting these rgb[a] values, you can set the starting color
  b: 0, // which will boost that color value in the exposure
  a: 255 // values must be between 0-255
}
```

###filmSpeed

This parameter mimics film speed, which is sort of a density/resistance value.
Faster film speed saturates quicker.  With actual film, the higher the number, the faster the film.
This module builds up an exposure over time, dividing rgb values by the filmSpeed value.
Ergo, with this parameter, the lower the value, the faster the film. 

The filmSpeed can be an object with rgb values, which sets the "resistance" for each color separately.
```js
var params = {
  shutterSpeed: 1000 / 60, // how long to hold exposure open on the capture, in milliseconds
  filmSpeed: {
    r: 5,
    g: 10,
    b: 5
  }
 }
```

##Example

to run this example
Edit entry.js to fuddle with methods and params
```
git clone this repo
npm install -g watchify opa
cd this repo
~$ opa
```