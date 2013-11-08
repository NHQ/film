require('./reqFrame')

navigator.getUserMedia = (navigator.getUserMedia || 
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia);




module.exports = function(video, film, mirror){
	
	navigator.getUserMedia({audio: true, video: true}, function(stream){
	    video.src = window.URL.createObjectURL(stream)
	})
	
	return {snapShot: snapShot, record: record, expose: expose}
	
	function getTime(){
	    var t
	    
	    return
	    
	    window.requestAnimationFrame(timer)
	    
	    function timer(time){t = time}
	}
	
	function snapShot(){
    	render = film.getContext('2d')
    	render.drawImage(video, 0, 0)
    	    
	}

    function record(){
        window.requestAnimationFrame(animate)		
    }
    
    function expose(params){
        
        var defaults = {
            shutterSpeed: 1000 / 60,
            filmSpeed: 5,
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
                if(!params[attrname]) params[attrname] = defaults[attrname]
            }
        }

        var d = 0;
        var render = film.getContext('2d')
    	var reflection = mirror.getContext('2d')

    	var positive = render.getImageData(0,0,film.width, film.height)
        var positive = new Uint8ClampedArray(positive.data.length)

    	for(var m = 0; m < film.width * film.height; m++){
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
        	    var p = render.getImageData(0,0,mirror.width, mirror.height)
                 p.data.set(positive)
        	    render.putImageData(p, 0, 0)
        	    window.cancelAnimationFrame(f)
    	        return
    	    }
        	window.requestAnimationFrame(f)
        	reflection.drawImage(video, 0, 0)
        	var negative = reflection.getImageData(0,0,mirror.width,mirror.height);  
                for(n=0; n<negative.width*negative.height; n++) {  
                    var index = n*4;   
                    positive[index+0] =  positive[index+0] + (negative.data[index] / params.filmSpeed)
                    positive[index+1] =  positive[index+1] + (negative.data[index+1] / params.filmSpeed)
                    positive[index+2] =  positive[index+2] + (negative.data[index+2] / params.filmSpeed)  
                }
//        	pos.data = positive
        }
    }
    
    function animate(time){
    	window.requestAnimationFrame(animate)
    	render = film.getContext('2d')
    	render.drawImage(video, 0, 0)	
	}    
	
		
}