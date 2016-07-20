let videoBlock = $('.video-block'),
			infContainer = $('.information-block'),
			video = document.querySelector('.video-block__video'),
			canvas = document.querySelector('.video-block__canvas'),
			audio = document.querySelector('.video-block__audio'),
			subtitle = document.querySelector('.video-block__subtitle'),
			form = $('.information-block__form'),
			textTracks = video.textTracks, // one for each track element
			textTrack = textTracks[0], // corresponds to the first track element
			cues = textTrack.cues,
			trackElements = document.querySelectorAll("track"),
			delays = [],
			corsString = 'http://146.185.134.219/';


// for each track element
	for (let i = 0; i < cues.length; i++ ) {
		let cue = cues[i],
				delay = cue.endTime - cue.startTime;
		delays.push(delay);
		cue.startTime = cue.startTime + (cue.endTime - cue.startTime);
		cue.endTime = cue.startTime + 0.3;
		cue.onenter = function() {
			video.pause();
			video.classList.add('tracked');
			setTimeout(() => {
				video.classList.remove('tracked');
				video.play();
			}, delays[this.id - 1] * 1000);
		}
	}

	$('.information-block__button').on('click', onInformationBlockButtonClick);
	$('.video-block__button').on('click', onVideoBlockButtonClick);

	function onInformationBlockButtonClick(e) {
		let formValues = form.serializeArray(),
				videoSrc = formValues[0].value,
				subtitleSrc = formValues[1].value,
				audioSrc = formValues[2].value;
		video.setAttribute('src', `${corsString}${videoSrc}`);
		audio.setAttribute('src', `${corsString}${audioSrc}`);
		// subtitle.setAttribute('src', `${corsString}${subtitleSrc}`);

		infContainer.fadeOut(() => {
			videoBlock.fadeIn();
			distructuring.doLoad();
			audio.play();
		});
	}

	function onVideoBlockButtonClick(e) {
		videoBlock.fadeOut(() => {
			infContainer.fadeIn();
			audio.pause();
		});
	}

	

