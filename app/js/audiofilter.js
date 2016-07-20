"use strict";

var context = new AudioContext(),
    myAudioElement = document.querySelector('.video-block__audio'),
    source = context.createMediaElementSource(myAudioElement);

//Now we want to create a filter
var filter = context.createBiquadFilter();
source.connect(filter); //and of course connect it
filter.type = "peaking"; //this is a lowshelffilter (try excuting filter1.LOWSHELF in your console)
filter.frequency.value = 976; //as this is a lowshelf filter, it strongens all sounds beneath this frequency
filter.frequency.Q = 0.69; //the gain with which it should increase
filter.gain.value = 9;

//now we want to connect that to the output
filter.connect(context.destination);