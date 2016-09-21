// user variables
var rainFreq = .5;

// global
var timer;

// state based system
// 0 = playing
// 1 = crossfading
var state = 0;

// rain sources
var rainSources = ["resources\\rain\\Backyard Rain.wav",
					"resources\\rain\\City Rain.wav"];

// thunder sources
var thunderSources = [];

// grab 2 audio elements
var rain1 = document.getElementById("rain1");
var rain2 = document.getElementById("rain2");
// don't play immediately
rain1.autoplay = false;
rain2.autoplay = false;

// initial load
rain1.src = randomElement(rainSources);
rain2.src = randomElement(rainSources);
rain1.volume = 1.00;
rain2.volume = 0.00;
document.getElementById("vol1").innerHTML = rain1.volume;
document.getElementById("vol2").innerHTML = rain2.volume;

// start loop
rain1.play();
setTimeout(delay,10000,rain1,rain2);

// dummy function to continue the loop once the proper time has waited.
function delay(audio1,audio2)
{
	crossfadeWho(audio1,audio2);
}

// decide who to crossfade
function crossfadeWho(audio1,audio2)
{
	// how often to call crossfade by the amount defined in crossfade.
	var crossfadeSpeed = 250;

	if(!audio1.paused)
	{
		audio2.play();
		timer = setInterval(crossfade,crossfadeSpeed,audio1,audio2);
	}
	else if(!audio2.paused)
	{
		audio1.play();
		timer = setInterval(crossfade,crossfadeSpeed,audio2,audio1);
	}
}

// fade audio1 out and audio2 in
function crossfade(audio1,audio2)
{
	// amount to crossfade by
	var amount = .01;

	// if the crossfade has completed
	if(audio1.volume - amount < 0 && audio2.volume + amount > 1)
	{
		// stop audio1 and wait for the next crossfade
		audio1.volume = 0.00;
		audio2.volume = 1.00;
		audio1.pause();
		clearInterval(timer);
		setTimeout(delay,10000,audio1,audio2);
	}
	else
	{
		audio1.volume -= amount;
		audio2.volume += amount;
	}
	document.getElementById("vol1").innerHTML = audio1.volume;
	document.getElementById("vol2").innerHTML = audio2.volume;
}

// return random resource from the element list
function randomElement(elementList)
{
	return elementList[Math.floor(Math.random() * elementList.length)];
}