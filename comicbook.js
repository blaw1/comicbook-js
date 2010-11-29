var processor = {
  timerCallback: function() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    var self = this;
    setTimeout(function () {
        self.timerCallback();
      }, 0);
  },
   doLoad: function() {
    this.video = document.getElementById("video");
    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");
	
	this.PI2 = Math.PI*2;
	this.PI1_4 = Math.PI/4
	
	var self = this;
  this.video.addEventListener("play", function() {
        self.width = self.video.videoWidth;
        self.height = self.video.videoHeight;
        self.timerCallback();
      }, false);
	  
  },
  renderToCanvas: function (width, height, renderFunction) {
	var buffer = document.createElement('canvas');
	buffer.width = width;
	buffer.height = height;
	renderFunction(buffer.getContext('2d'));
	return buffer;
  },
  computeFrame: function() {
    
	this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
			
	this.renderClosePixels([
		{ resolution: 32 },
		{ shape : 'circle', resolution : 32, offset: 15 },
		{ shape : 'circle', resolution : 32, size: 26, offset: 13 },
		{ shape : 'circle', resolution : 32, size: 18, offset: 10 },
		{ shape : 'circle', resolution : 32, size: 12, offset: 8 }
	]);
  },  
  /* Close Pixelate
 * http://desandro.com/resources/close-pixelate/
 * 
 * Developed by
 * - David DeSandro  http://desandro.com
 * - John Schulz  http://twitter.com/jfsiii
 * 
 * Thanks to Max Novakovic for getImageData API http://www.maxnov.com/getimagedata
 * 
 * Copyright (c) 2010
 * Licensed under MIT license
 * 
 */
  renderClosePixels: function (renderOptions) {
  
  var imgData = this.ctx1.getImageData(0, 0, this.c1.width, this.c1.height);//.data;
  
  this.ctx1.clearRect( 0, 0, this.c1.width, this.c1.height);

  for (var i=0, len = renderOptions.length; i < len; i++) {
    var opts = renderOptions[i],
        res = opts.resolution,
        // option defaults
        size = opts.size || res,
        alpha = opts.alpha || 1,
        offset = opts.offset || 0,
        offsetX = 0, 
        offsetY = 0,
        cols = this.c1.width / res + 1,
        rows = this.c1.height / res + 1,
        halfSize = size / 2,
        diamondSize = size / Math.SQRT2,
        halfDiamondSize = diamondSize / 2;

	offsetX = offsetY = offset;
	
    for ( var row = 0; row < rows; row++ ) {
      var y = ( row - 0.5 ) * res + offsetY,
        // normalize y so shapes around edges get color
        pixelY = Math.max( Math.min( y, this.c1.height-1), 0);

      for ( var col = 0; col < cols; col++ ) {
	  
		
        var x = ( col - 0.5 ) * res + offsetX,
            // normalize y so shapes around edges get color
            pixelX = Math.max( Math.min( x, this.c1.width-1), 0),
            pixelIndex = ( pixelX + pixelY * this.c1.width ) * 4,
            red = imgData.data[ pixelIndex + 0 ],
            green = imgData.data[ pixelIndex + 1 ],
            blue = imgData.data[ pixelIndex + 2 ],
            pixelAlpha = alpha * (imgData.data[ pixelIndex + 3 ] / 255);

        this.ctx1.fillStyle = 'rgba(' + red +','+ green +','+ blue +','+ pixelAlpha + ')';

		
		
        switch ( opts.shape ) {
          case 'circle' :
            this.ctx1.beginPath();
              this.ctx1.arc ( x, y, halfSize, 0, this.PI2, true );
              this.ctx1.fill();
            this.ctx1.closePath();
            break;
          case 'diamond' :
            this.ctx1.save();
              this.ctx1.translate( x, y );
              this.ctx1.rotate( this.PI1_4 );
              this.ctx1.fillRect( -halfDiamondSize, -halfDiamondSize, diamondSize, diamondSize );
            this.ctx1.restore();
            break;
          default :  				
            // square			
				this.ctx1.fillRect( x - halfSize, y - halfSize, size, size );
        } // switch
		
      } // col
    } // row
	
  } // options
 }

};
