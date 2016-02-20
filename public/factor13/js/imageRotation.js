var top_container = "container1";
var bottom_container = "container2";
var rotation_time = 5000;
var intervalId = 0;
var topIdx = 0;
var bottomIdx = 1;
var images = new Array("images/video_still_01.jpg", 
						"images/video_still_02.jpg",
						"images/video_still_03.jpg",
						"images/video_still_04.jpg",
						"images/video_still_05.jpg",
						"images/video_still_06.jpg",
						"images/video_still_07.jpg",
						"images/video_still_028.jpg");

function startTimer()
{
	//alert("startTimer");
	intervalId = setInterval(rotateImage, rotation_time);
}

function stopTimer()
{
	clearInterval(intervalId); 
}

function setSource()
{
	document.getElementById(top_container).style = { opacity:1;
	document.getElementById(top_container).src = images[topIdx]; 
	document.getElementById(bottom_container).src = images[bottomIdx];

	//startTimer();
}

function rotateImage()
{
	stopTimer(); 

	if(topIdx < images.length - 1) 
	{
		topIdx++; 
	}
	else 
	{
		topIdx = 0;
	}
	
	if(bottomIdx < images.length - 1) 
	{
		bottomIdx++; 
	}
	else 
	{
		bottomIdx = 0; 
	}
	
	//alert("topIdx = " + topIdx + ", bottomIdx = " + bottomIdx); 

	setSource(); 
}



////////

