var  funstance = require('funstance');

module.exports = function(delay){
		
  var delay = Math.floor(delay)

  var bufferSize = delay * 2;

  var d = new Delay(delay,bufferSize)

  var fn = funstance(d, Sample)

  return fn

  function Delay(delay, bufferSize){
			
	  this.delay = delay;

	  this.buffer = new Uint8ClampedArray(bufferSize);
	
	  this.writeOffset = 0;

	  this.endPoint = (this.delay * 2)
		
	  this.readOffset = this.delay + 1

          this.readZero = 0;
	
 	};


  function Sample(sample){

      var s = sample;

    if (this.readOffset >= this.endPoint) this.readOffset = 0;

    sample += (this.readZero-- > 0) ? 0 : (this.buffer[this.readOffset] * this.mix);

//    sample/=2

//    var write = sample * this.feedback

//    write = Math.floor(write)

    this.buffer[this.writeOffset] = (s + (sample * this.feedback)) / 2

    this.writeOffset++;

    this.readOffset++;

    if (this.writeOffset >= this.endPoint) this.writeOffset = 0;

    return isNaN(sample) ? Math.random() : sample

  };

};
