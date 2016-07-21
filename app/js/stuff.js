'use strict';

var videoBlock = $('.video-block'),
    infContainer = $('.information-block'),
    video = document.querySelector('.video-block__video'),
    canvas = document.querySelector('.video-block__canvas'),
    attritionCanvas = document.querySelector('.video-block__canvas_attrition'),
    audio = document.querySelector('.video-block__audio'),
    subtitle = document.querySelector('.video-block__subtitle'),
    form = $('.information-block__form'),
    textTracks = video.textTracks,
    // one for each track element
textTrack = textTracks[0],
    // corresponds to the first track element
cues = textTrack.cues,
    trackElements = document.querySelectorAll("track"),
    delays = [],
    corsString = 'http://146.185.134.219/';

// for each track element
for (var i = 0; i < cues.length; i++) {
	var cue = cues[i],
	    delay = cue.endTime - cue.startTime;
	delays.push(delay);
	cue.startTime = cue.startTime + (cue.endTime - cue.startTime);
	cue.endTime = cue.startTime + 0.3;
	cue.onenter = function () {
		video.pause();
		video.classList.add('tracked');
		attritionCanvas.classList.add('opacitied');
		setTimeout(function () {
			video.classList.remove('tracked');
			attritionCanvas.classList.remove('opacitied');
			video.play();
		}, delays[this.id - 1] * 1000);
	};
}

$('.information-block__button').on('click', onInformationBlockButtonClick);
$('.video-block__button').on('click', onVideoBlockButtonClick);

function onInformationBlockButtonClick(e) {
	var formValues = form.serializeArray(),
	    videoSrc = formValues[0].value,
	    subtitleSrc = formValues[1].value,
	    audioSrc = formValues[2].value;
	video.setAttribute('src', '' + corsString + videoSrc);
	audio.setAttribute('src', '' + corsString + audioSrc);
	// subtitle.setAttribute('src', `${corsString}${subtitleSrc}`);

	infContainer.fadeOut(function () {
		videoBlock.fadeIn();
		distructuring.doLoad();
		audio.play();
	});
}

function onVideoBlockButtonClick(e) {
	videoBlock.fadeOut(function () {
		infContainer.fadeIn();
		audio.pause();
	});
}