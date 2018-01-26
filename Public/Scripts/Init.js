//  @input Component.AudioComponent startAudio
//  @input Component.AudioComponent tapAudio
//  @input Component.PostEffectVisual tapPost
//  @input Asset.Texture deviceCameraTexture
//  @input Component.SpriteVisual spriteVisual

global.touchSystem.touchBlocking = true;

script.api.active = false;

var frameBuffer = []; //Stores 1-2 of the slo-motion frames at a time.
var deltaTime = 0; //Time since the screen has been tapped.
var frameNumber = 0; //How many frames have been captured since the screen was touched.

var rate = 3; //How fast the frames will be played back at (relative to the deltaTime). IMPORTANT (this is what you need to choose. Either 2 or 3)

var length = 19.3; //Length of the audio clip in seconds.

var fadeOut = 4; //Time that the screen fades out.

script.startAudio.play(-1);

//Create an even that triggers every time the frame is updated.
var update = script.createEvent("UpdateEvent");
update.bind(function (eventData)
{
	//check if the screen has been tapped (see Tap.js)
	if (script.api.active) {
		deltaTime += eventData.getDeltaTime(); //Adds the time since the last frame was calculated to the deltaTime variable.

		if (eventData.getDeltaTime() >= 20) return; 
		//Don't insert another frame into the buffer if we're having performance issues. This will help midigate performance issues. 
		//Minimum framerate set at 20fps, as specified by Snapchat's "Performance and Optimization" article: 
		//https://lensstudio.snapchat.com/guides/submission/performance-and-optimization/ 

		if (frameBuffer.length < length / rate * 30) {
			//Stores the frames into an array to be deisplayed on a sprite.
			frameBuffer[frameNumber] = script.deviceCameraTexture.copyFrame();
		}
		if (deltaTime < length) {
			if (frameNumber % rate == 0 && frameNumber < frameBuffer.length * rate) {
				//Places stored frames into the spriteVisual's texture.
				script.spriteVisual.mainPass.baseTex = frameBuffer[frameNumber/rate];
				//Prevent memory leaks by removing the frames before the current one.
				if (frameNumber > 0) frameBuffer[frameNumber/rate - 1] = null; 
			}
			//Fade out at the desired seconds.
			if (deltaTime > length - fadeOut && deltaTime < length) {
				var alpha = (length - deltaTime)/fadeOut;
				script.spriteVisual.mainPass.baseColor = new vec4(alpha, alpha, alpha, 1);
			}
		} else frameBuffer = [];
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