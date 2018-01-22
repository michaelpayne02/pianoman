//  @input Component.AudioComponent tapAudio
//  @input Component.PostEffectVisual tapPost
//  @input Asset.Texture deviceCameraTexture
//  @input Component.MeshVisual meshVisual

//Everything in this script is triggered when the user starts touching the screen.

//toggles all the assets and the api boolean (see Init.js)
if (script.api.active == false) {
	script.meshVisual.mainPass.baseColor = new vec4(1, 1, 1, 1);
	script.api.active = true;

	script.meshVisual.enabled = true;
	script.tapPost.enabled = true;
	script.tapAudio.play(1);
	

} else if (script.api.active == true) {
	script.api.active = false;

	script.meshVisual.enabled = false;
	script.tapPost.enabled = false;
	if (script.tapAudio.isPlaying()) {
		script.tapAudio.stop(false);
	}
}
