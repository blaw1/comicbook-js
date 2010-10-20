let processor = {
  timerCallback: function() {
    if (this.video.paused || this.video.ended) {
      return;
    }
	//this.moveFrame();
    this.computeFrame();
    let self = this;
    setTimeout(function () {
        self.timerCallback();
      }, 0);
  },

  doLoad: function() {
    this.video = document.getElementById("video");
    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");
    //this.c2 = document.getElementById("c2");
    //this.ctx2 = this.c2.getContext("2d");
	this.c3 = document.getElementById("c3");
    this.ctx3 = this.c3.getContext("2d");
	
	this.c4 = document.getElementById("c4");
    this.ctx4 = this.c4.getContext("2d");
	this.c5 = document.getElementById("c5");
    this.ctx5 = this.c5.getContext("2d");
	this.c6 = document.getElementById("c6");
    this.ctx6 = this.c6.getContext("2d");
	
	this.position = 0;
	this.direction = new Boolean(true);
	
    let self = this;
    this.video.addEventListener("play", function() {
        self.width = self.video.videoWidth / 2;
        self.height = self.video.videoHeight / 2;
        self.timerCallback();
      }, false);
	  
  },

  moveFrame: function()
  {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
	
	let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
	let l = frame.data.length / 4;
	
	for (let i = 0; i < l; i++) {
	  frame.data[i * 4 + 0] = 255;
	  frame.data[i * 4 + 1] = 255;
	  frame.data[i * 4 + 2] = 255;		 
	}	
	this.ctx4.putImageData(frame, 0, 0);
	this.ctx5.putImageData(frame, 0, 0);
	this.ctx6.putImageData(frame, 0, 0);
	
	this.ctx4.drawImage(this.video, this.position, 0, this.width, this.height);
	this.ctx5.drawImage(this.video, this.position-this.width, 0, this.width, this.height);
	this.ctx6.drawImage(this.video, this.position-this.width*2, 0, this.width, this.height);
	
	if(this.direction)
	{
		this.position++;
		if(this.position > this.width*2)
		{
			this.direction = false;
		}
	}
	else
	{
		this.position--;
		if(this.position <= 0)
		{
			this.direction = true;
		}
	}		
			
	document.getElementById('t1').innerHTML=document.getElementById('video').currentTime.toFixed(4);
  },
  
  computeFrame: function() {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
	
    let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
	let l = frame.data.length / 4;
	
	/*
	//background
    for (let i = 0; i < l; i++) {
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];
      if (g > 100 && r > 100 && b < 43)
        frame.data[i * 4 + 3] = 0;
    }

    this.ctx2.putImageData(frame, 0, 0);
	
	frame = this.ctx1.getImageData(0, 0, this.width, this.height);
	*/
		
	//comic book effect
    for (let i = 0; i < l; i++) {
	
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];
	  
	  
	  if (g < 125 && r < 125 && b < 125) //range of color on shirt
	  {
		//change to any color: http://en.wikipedia.org/wiki/Web_colors
		frame.data[i * 4 + 0] = r * .2;//red
        frame.data[i * 4 + 1] = g * .2;	//green
        frame.data[i * 4 + 2] = b * .2;//blue
	  }
	  if (g >= 125 && r >= 125 && b >= 125) //range of color on shirt
	  {
		//change to any color: http://en.wikipedia.org/wiki/Web_colors
		frame.data[i * 4 + 0] = r * 1.2;//red
        frame.data[i * 4 + 1] = g * 1.2;	//green
        frame.data[i * 4 + 2] = b * 1.2;//blue
	  }
    }//end of comic book effect
	this.ctx3.putImageData(frame, 0, 0);

	
	frame = this.ctx1.getImageData(0, 0, this.width, this.height);
	
	this.moveFrame();
    return;
  }  
};

function gettime()
{
	document.getElementById('t2').innerHTML=document.getElementById('video').currentTime.toFixed(1);
}