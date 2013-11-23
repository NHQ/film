require('./reqFrame')
var emitter = require('events').EventEmitter
var Time = require('since-when')
var spin = require('uxer/spin')

var knob = document.getElementById('knob')
var knob2 = document.getElementById('knob2')

var getCSS = function(el, prop){
        var propValue = document.defaultView.getComputedStyle(el).getPropertyValue(prop)
        if(!propValue) throw new Error("No prop valueValue. Is the element appended to the document yet?")
        if(!propValue) return false
        return (parseInt(propValue) || 0)
}

var defaults = {
    shutterSpeed: 1000/24,
    invert: false,
    blob: undefined,
    filmSpeed: {
        r: 1,
        g: 1,
        b: 1
    },
    r: 0,
    g: 0,
    b: 0,
    a: 255
};

module.exports = function(video, mirror, exposure, render){
    
	var reflection = mirror.getContext('2d')
    
	var film = exposure.getContext('2d')
	var print = render.getContext('2d')
	var params = setParams({})
	
    var time = Time();
    var frameCount = 0;
    var delta = 0;
    
	var recording = false;
	var frames = [];

    
	var app = new emitter();
//    app.on('snapShot', snapShot)
//    app.on('setParams', setParams)
    
    monitor()
    setInterval(expose, 1000/24)
    
    var last = 0
    
	return app 
	
	function monitor(t){
	    window.requestAnimationFrame(monitor)
	    frameCount++
    	reflection.drawImage(video, 0, 0);
        window.frameRate = frameCount / (time.sinceBeginNS() / 1e9)
	}
	
	function setParams(p){
	    if(!p) return;
	    for (var attrname in defaults) {
            if(typeof params.filmSpeed == 'number'){
                var n = params.filmSpeed;
                params.filmSpeed = {
                    r: Math,ax(n, .001),
                    g: Math,ax(n, .001),
                    b: Math,ax(n, .001)
                }
            }
            if(!params[attrname] && params[attrname] != 0) params[attrname] = defaults[attrname]
        }
        return params
	}
	
	function expose(blob){
	    
	    var d = 0, fcp = 0;

    	var positive = print.getImageData(0,0, render.width, render.height)
        
        if(blob){
            var positive = blob           
        }
        
        else {
        	for(var m = 0; m < render.width * render.height; m++){
        	    var index = m * 4;
        	    positive.data[index] = params.r;
        	    positive.data[index + 1] = params.g;
                positive.data[index + 2] = params.b;
                positive.data[index + 3] = params.a
        	}   
        }
    	var frame;
    	
    	window.requestAnimationFrame(function(time){
    	    d = time + params.shutterSpeed
    	    frame = window.requestAnimationFrame(f)
    	})
    	
        function f(time){
            frame = window.requestAnimationFrame(f)
            var negative = reflection.getImageData(0,0,render.width,render.height);  
            
            for(n=0; n<render.width*render.height; n++) {  
                var index = n*4;   
                positive.data[index+0] =  vert(positive.data[index+0], negative.data[index+0] * params.filmSpeed.r);
                positive.data[index+1] = vert(positive.data[index+1], negative.data[index+1] * params.filmSpeed.g);
                positive.data[index+2] = vert(positive.data[index+2], negative.data[index+2] * params.filmSpeed.b);
                positive.data[index + 3] = params.a;
            }
                    	
        	if(time > d) {
        	    window.cancelAnimationFrame(frame)

        	    print.putImageData(positive, 0, 0)
        	    film.putImageData(positive, 0, 0)
                app.emit('expose', positive)
        	    
    	        return
    	    }
    	    film.putImageData(positive, 0, 0)
        };
        
        function vert(a, b){
            if(params.invert){
                return a - b
            }
            else return a + b
        }
    }
		
}