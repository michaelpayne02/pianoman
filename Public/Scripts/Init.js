global.touchSystem.touchBlocking = true;

script.api.active = false;

var frameBuffer = []; //Stores 1-2 of the slo-motion frames at a time.
var deltaTime = 0; //Time since the screen has been tapped.
var frameNumber = 0; //How many frames have been captured since the screen was touched.

var rate = 2; //How fast the frames will be played back at (relative to the deltaTime). IMPORTANT (this is what you need to choose. Either 2 or 3)

var length = 19.3; //Length of the audio clip in seconds.

var fadeOut = 4; //Time that the screen fades out.

//Create an even that triggers every time the frame is updated.
var update = script.createEvent("UpdateEvent");
update.bind(function (eventData)
{
	//check if the screen has been tapped (see Tap.js)
	if (script.api.active) {
		deltaTime += eventData.getDeltaTime(); //Adds the time since the last frame was calculated to the deltaTime variable.

		if (deltaTime < length / rate) {
			//Stores the frames into an array to be deisplayed on a mesh.
			frameBuffer[frameNumber] = script.deviceCameraTexture.copyFrame();
		}
		if (deltaTime < length) {
			if (frameNumber % rate == 0 && frameNumber < frameBuffer.length * rate) {
				//Places stored frames into the meshVisual's texture.
				script.meshVisual.mainPass.baseTex = frameBuffer[frameNumber/rate];
				//Prevent memory leaks by removing the frames before the current one.
				if (frameNumber > 0) frameBuffer[frameNumber/rate - 1] = null; 
			}
			if (deltaTime > length - fadeOut) {
				var alpha = (length - deltaTime)/fadeOut;
				script.meshVisual.mainPass.baseColor = new vec4(alpha, alpha, alpha, 1);
			}
		}
		
		frameNumber++;
	} else reset();

	
});

var off = script.createEvent("TurnOffEvent");
off.bind(function (eventData)
{
	reset();
});

//Clears the frame buffer when the lens turns off, toggles, and ends the music. This also prevents memory leaks and crashes.
function reset() {
	frameBuffer = [];
	deltaTime = 0;
	frameNumber = 0;
}