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
	
	var self = this;
  this.video.addEventListener("play", function() {
        self.width = self.video.videoWidth;
        self.height = self.video.videoHeight;
        self.timerCallback();
      }, false);
	  
  },
  computeFrame: function() {
    
	this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
			
	this.renderClosePixels([

//{ resolution : 6 }

//{ shape : 'circle', resolution : 24 }
//{ shape : 'circle', resolution : 24, size: 9, offset: 12 }

	{ resolution: 32 },
{ shape : 'circle', resolution : 32, offset: 15 },
{ shape : 'circle', resolution : 32, size: 26, offset: 13 },
{ shape : 'circle', resolution : 32, size: 18, offset: 10 },
{ shape : 'circle', resolution : 32, size: 12, offset: 8 }
	]);
  },  
  /*********************** Close Pixelate ************************/
  renderClosePixels: function (renderOptions) {


		w = this.c1.width;//document.getElementById('video').width;
		h = this.c1.height;//document.getElementById('video').height;
		ctx = this.ctx1;//canvas.getContext('2d');
  
  var PI2 = Math.PI*2, 
      PI1_4 = Math.PI/4,
      imgData = ctx.getImageData(0, 0, w, h).data, 
      isArray = function ( o ){ return Object.prototype.toString.call( o ) === "[object Array]"; },
      isObject = function ( o ){ return Object.prototype.toString.call( o ) === "[object Object]"; };

  ctx.clearRect( 0, 0, w, h);

  for (var i=0, len = renderOptions.length; i < len; i++) {
    var opts = renderOptions[i],
        res = opts.resolution,
        // option defaults
        size = opts.size || res,
        alpha = opts.alpha || 1,
        offset = opts.offset || 0,
        offsetX = 0, 
        offsetY = 0,
        cols = w / res + 1,
        rows = h / res + 1,
        halfSize = size / 2,
        diamondSize = size / Math.SQRT2,
        halfDiamondSize = diamondSize / 2;

    if ( isObject( offset ) ){ 
      offsetX = offset.x || 0;
      offsetY = offset.y || 0;
    } else if ( isArray( offset) ){
      offsetX = offset[0] || 0;
      offsetY = offset[1] || 0;
    } else {
      offsetX = offsetY = offset;
    }

    for ( var row = 0; row < rows; row++ ) {
      var y = ( row - 0.5 ) * res + offsetY,
        // normalize y so shapes around edges get color
        pixelY = Math.max( Math.min( y, h-1), 0);

      for ( var col = 0; col < cols; col++ ) {
        var x = ( col - 0.5 ) * res + offsetX,
            // normalize y so shapes around edges get color
            pixelX = Math.max( Math.min( x, w-1), 0),
            pixelIndex = ( pixelX + pixelY * w ) * 4,
            red = imgData[ pixelIndex + 0 ],
            green = imgData[ pixelIndex + 1 ],
            blue = imgData[ pixelIndex + 2 ],
            pixelAlpha = alpha * (imgData[ pixelIndex + 3 ] / 255);

        ctx.fillStyle = 'rgba(' + red +','+ green +','+ blue +','+ pixelAlpha + ')';

        switch ( opts.shape ) {
          case 'circle' :
            ctx.beginPath();
              ctx.arc ( x, y, halfSize, 0, PI2, true );
              ctx.fill();
            ctx.closePath();
            break;
          case 'diamond' :
            ctx.save();
              ctx.translate( x, y );
              ctx.rotate( PI1_4 );
              ctx.fillRect( -halfDiamondSize, -halfDiamondSize, diamondSize, diamondSize );
            ctx.restore();
            break;
          default :  
            // square
            ctx.fillRect( x - halfSize, y - halfSize, size, size );
        } // switch
      } // col
    } // row
  } // options
 }

};
