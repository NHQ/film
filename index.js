require('./reqFrame')
var emitter = require('events').EventEmitter

navigator.getUserMedia = (navigator.getUserMedia || 
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia);

if(!navigator.getUserMedia){
    alert('no webcam or no getUserMedia support detected.  Try Using Chome')
}

module.exports = function(video, mirror){
	
	navigator.getUserMedia({audio: true, video: true}, function(stream){
	    video.src = window.URL.createObjectURL(stream)
	}, function(err){
	    alert('no webcam or no getUserMedia support detected.  Try Using Chome')
	})
	
	var app = new emitter();
	app.snapShot = snapShot;
	app.record = record;
	app.expose = expose;

    var recording = false;
	var frames = [];
	
	return app // {snapShot: snapShot, record: record, expose: expose}
	
	function getTime(){
	    var t
	    
	    return
	    
	    window.requestAnimationFrame(timer)
	    
	    function timer(time){t = time}
	}
	
	function snapShot(){
    	var reflection = mirror.getContext('2d');
    	reflection.drawImage(video, 0, 0);
	    var p = reflection.getImageData(0, 0, mirror.width, mirror.height)
        app.emit('snapshot', p)
	}

    function record(){
        if(recording){
            app.emit('record', frames)
            recording = false
        }
        recording = true;
        frames = [];
        var reflection = mirror.getContext('2d');
        window.requestAnimationFrame(rec)		
    	
        function rec(time){
        	window.requestAnimationFrame(rec)
        	reflection.drawImage(video, 0, 0)
    	    var frame = reflection.getImageData(0, 0, mirror.width, mirror.height)
    	    frames.push(frame)
    	}
    	
    }
    
    function expose(params){
        
        var defaults = {
            shutterSpeed: 1000 / 24,
            filmSpeed: {
                r: 5,
                g: 5,
                b: 5
            },
            r: 0,
            g: 0,
            b: 0,
            a: 255
        }
        
        if(!params){
            params = defaults
        }
        
        else {
            for (var attrname in defaults) {
                if(typeof params.filmSpeed == 'number'){
                    var n = params.filmSpeed;
                    params.filmSpeed = {
                        r: n,
                        g: n,
                        b: n
                    }
                }
                if(!params[attrname]) params[attrname] = defaults[attrname]
            }
        }
        var d = 0;
    	var reflection = mirror.getContext('2d')

    	var positive = reflection.getImageData(0,0,mirror.width, mirror.height)
        positive = new Uint8ClampedArray(positive.data.length)

    	for(var m = 0; m < mirror.width * mirror.height; m++){
    	    var index = m * 4;
    	    positive[index] = params.r;
    	    positive[index + 1] = params.g;
            positive[index + 2] = params.b;
            positive[index + 3] = params.a
    	}

    	window.requestAnimationFrame(function(time){
    	    d = time + params.shutterSpeed
    	    window.requestAnimationFrame(f)
    	})
    	
        function f(time){
        	if(time > d) {
        	    var p = reflection.getImageData(0,0,mirror.width, mirror.height)
                p.data.set(positive)
                app.emit('expose', p)
        	    window.cancelAnimationFrame(f)
    	        return
    	    }
        	window.requestAnimationFrame(f)
        	reflection.drawImage(video, 0, 0)
        	var negative = reflection.getImageData(0,0,mirror.width,mirror.height);  
                for(n=0; n<negative.width*negative.height; n++) {  
                    var index = n*4;   
                    positive[index+0] =  positive[index+0] + (negative.data[index] / params.filmSpeed.r)
                    positive[index+1] =  positive[index+1] + (negative.data[index+1] / params.filmSpeed.g)
                    positive[index+2] =  positive[index+2] + (negative.data[index+2] / params.filmSpeed.b)  
                }
        }
    }
    
    function animate(time){
    	window.requestAnimationFrame(animate)
    	render = mirror.getContext('2d')
    	render.drawImage(video, 0, 0)	
	}    
	
		
}