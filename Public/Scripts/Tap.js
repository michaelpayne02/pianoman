//Everything in this script is triggered when the user starts touching the screen.

//toggles all the assets and the api boolean (see Init.js)
script.tapPost.enabled = true;
if (!script.api.active) {
	script.spriteVisual.mainPass.baseColor = new vec4(1, 1, 1, 1);
	script.api.active = true;
	script.startAudio.stop(false);
	script.spriteVisual.enabled = true;
	script.tapPost.enabled = true;
	script.tapAudio.play(1);
	

} else if (script.api.active) {
	script.api.active = false;
	script.startAudio.play(-1);
	script.spriteVisual.enabled = false;
	script.tapPost.enabled = false;
	if (script.tapAudio.isPlaying()) {
		script.tapAudio.stop(false);
	}
}

