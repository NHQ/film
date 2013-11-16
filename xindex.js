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

module.exports = function(video, mirror, exposure, render){
    
	var reflection = mirror.getContext('2d')
    
	var film = exposure.getContext('2d')
	var print = render.getContext('2d')
	
	
    var time = Time();
    var frameCount = 0;
    var delta = 0;
    
	var recording = false;
	var frames = [];
	var defaults = {
        shutterSpeed: 2000,
        invert: false,
        filmSpeed: {
            r: 20,
            g: 11,
            b: 10
        },
        r: 0,
        g: 45,
        b: 45,
        a: 255
    };
    
	var app = new emitter();
//    app.on('snapShot', snapShot)
//    app.on('setParams', setParams)
    
    monitor()
    setInterval(expose, 2111)
    
    var last = 0
    
	return app 
	
	function monitor(t){
	    window.requestAnimationFrame(monitor)
	    frameCount++
    	reflection.drawImage(video, 0, 0);
        window.frameRate = frameCount / (time.sinceBeginNS() / 1e9)
	}
	
	function expose(params){
	    
	    var d = 0, fcp = 0;
                        
        if(params) {
            for (var attrname in defaults) {
                if(typeof params.filmSpeed == 'number'){
                    var n = params.filmSpeed;
                    params.filmSpeed = {
                        r: n,
                        g: n,
                        b: n
                    }
                }
                if(!params[attrname] && params[attrname] != 0) params[attrname] = defaults[attrname]
            }
        }
        
        else {
            params = defaults;
        }

    	var positive = print.getImageData(0,0, render.width, render.height)
        
        if(params.blob){
            var positive = params.blob           
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
    	window.requestAnimationFrame(function(time){
    	    d = time + params.shutterSpeed
    	    window.requestAnimationFrame(f)
    	})
    	
        function f(time){
        	if(time > d) {
                app.emit('expose', positive)
        	    window.cancelAnimationFrame(f)
        	    print.putImageData(positive, 0, 0)
                console.log('fpc', fcp)
    	        return
    	    }
        	window.requestAnimationFrame(f)
        	fcp++
        	var negative = reflection.getImageData(0,0,render.width,render.height);  
            
            for(n=0; n<render.width*render.height; n++) {  
                var index = n*4;   
                var r = negative.data[index+0]
                , g = negative.data[index+1]
                , b = negative.data[index+2]
                , re = (0.299 * r + 0.587 * g + 0.114 * b)
                positive.data[index+0] =  vert(positive.data[index+0], (re / params.filmSpeed.r));
                positive.data[index+1] = vert(positive.data[index+1], (re / params.filmSpeed.g));
                positive.data[index+2] = vert(positive.data[index+2], (re / params.filmSpeed.b));
                positive.data[index + 3] = params.a;
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