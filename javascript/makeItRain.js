// rain sources
var rainSources = ["resources\\rain\\Backyard Rain.wav",
					"resources\\rain\\City Rain.wav"];

// thunder sources
var thunderSources = ["resources\\thunder\\Thunder1.wav",
						"resources\\thunder\\Thunder2.wav",
						"resources\\thunder\\Thunder3.wav",
						"resources\\thunder\\Thunder4.wav",
						"resources\\thunder\\Thunder5.wav",
						"resources\\thunder\\Thunder6.wav",];

function run()
{
	// user input variables
	var rainFreq = document.getElementById("rainFreq");
	var thunderFreq = document.getElementById("thunderFreq");

	// show values of sliders
	document.getElementById("rainFreqLbl").innerHTML = rainFreq.value;
	document.getElementById("thunderFreqLbl").innerHTML = thunderFreq.value;

	// grab 3 audio elements
	var rain1 = document.getElementById("rain1");
	var rain2 = document.getElementById("rain2");
	var thunder = document.getElementById("thunder");

	// crossfade check timers
	var shouldICrossfadeTimer;
	var crossfadeTimer;
	var thunderTimer;

	// set volume and stop autoplay
	rain1.volume = 1.00;
	rain2.volume = 0.00;
	thunder.volume = 1.00;
	rain1.autoplay = false;
	rain2.autoplay = false;
	thunder.autoplay = false;

	// assign initial tracks
	rain1.src = randomElement(rainSources);
	rain2.src = randomElement(rainSources);
	while(rain1.src == rain2.src)
	{
		rain2.src = randomElement(rainSources);
	}
	thunder.src = randomElement(thunderSources);


	// event listener for when the audio can play.
	rain1.addEventListener("loadedmetadata",metaDataReadyRain1);
	rain2.addEventListener("loadedmetadata",metaDataReadyRain2);
	thunder.addEventListener("canplaythrough",startThunder);

}

// when the new track can be played without pausing
function readyToCrossfade()
{
	//console.log("rain2 ready to crossfade");
	rain2.removeEventListener("canplaythrough",readyToCrossfade);
	shouldICrossfadeTimer = setInterval(shouldICrossfade,5000);
}

//random chance to crossfade influenced by user input and duration through the track.
function shouldICrossfade()
{
	//console.log("Checking if I should crossfade...")

	// grab the input value as well as the % of the way through the track
	var userValue = Number(rainFreq.value);
	var nearingEnd = rain1.currentTime/rain1.duration;

	// how fast each crossfade amount is by
	var rate = 250;

	//console.log("Current Time: " + rain1.currentTime);

	// add together to get a threshold for the RGN to roll against
	var score = userValue + nearingEnd;

	//console.log(userValue + " + " + nearingEnd + " = " + score)

	var randSwitch = Math.random();

	//console.log(score +" < " + randSwitch + " ?");

	// if we generate a number lower than the score;
	// will become more difficult to fail as user increases 
	// frequency as well as the track coming close to the end.
	if(randSwitch < score)
	{
		//console.log("Time to crossfade");
		clearInterval(shouldICrossfadeTimer);
		rain2.play();
		crossfadeTimer = setInterval(crossfade,rate);
	}
	/*else
	{
		console.log("Do not crossfade")
	}*/
	//console.log("===================================")
}

// the actual crossfade work-horse function
function crossfade()
{
	// amount to crossfade by
	var amount = .01;

	// if the crossfade has completed
	if(rain1.volume - amount < 0 && rain2.volume + amount > 1)
	{
		// stop the crossfade
		clearInterval(crossfadeTimer);

		// stop rain1 and wait for the next crossfade
		rain1.volume = 0.00;
		rain2.volume = 1.00;
		rain1.pause();

		// juggle the ID's around
		rain2.id = "rainTemp";
		rain1.id = "rain2";
		rainTemp.id = "rain1";

		// randomize next track
		rain2.src = randomElement(rainSources);
		while(rain1.src == rain2.src)
		{
			rain2.src = randomElement(rainSources);
		}
		rain2.addEventListener("loadedmetadata",metaDataReadyRain2);
	}
	else
	{
		rain1.volume -= amount;
		rain2.volume += amount;
	}
	//console.log("Vol1: " + rain1.volume);
	//console.log("Vol2: " + rain2.volume);
}

// return random resource from the element list
function randomElement(elementList)
{
	return elementList[Math.floor(Math.random() * elementList.length)];
}

// return a random time for the given track
function randomStartTime(trackDuration)
{
	var temp = Math.floor(Math.random() * trackDuration);
	return temp;
}

// when the meta data is ready we can pick a random time to start
function metaDataReadyRain1()
{
	//console.log("rain1 meta data ready");
	rain1.removeEventListener("loadedmetadata", metaDataReadyRain1);
	rain1.currentTime = randomStartTime(rain1.duration);
	rain1.addEventListener("canplaythrough",rain1.play);
}

// when the meta data is ready we can pick a random time to start
// this function was broken in 2 because rain2 always usurps rain1
function metaDataReadyRain2()
{
	//console.log("rain2 meta data ready");
	rain2.removeEventListener("loadedmetadata",metaDataReadyRain2);
	rain2.currentTime = randomStartTime(rain2.duration);
	rain2.addEventListener("canplaythrough", readyToCrossfade);
}

// probably for debugging
function updateFreq()
{
	document.getElementById("rainFreqLbl").innerHTML = rainFreq.value;
	document.getElementById("thunderFreqLbl").innerHTML = thunderFreq.value;
}

// start randomly triggering thunder
function startThunder()
{
	thunderTimer = setInterval(shouldIThunder,10000);
}

// random rolls for when thunder should play
function shouldIThunder()
{
	console.log("should I thunder?");
	if(thunderFreq.value > Math.random())
	{
		clearInterval(thunderTimer);
		thunder.play();
		thunder.addEventListener("ended",resetThunder);
		//console.log("yes");
	}
	/*else
	{
		console.log("no");
	}*/
}

// when the last thunder has finished, pick a new thunder and start randomly triggering thunder again
function resetThunder()
{
	thunder.removeEventListener("ended",resetThunder);
	thunder.src = randomElement(thunderSources);
	thunder.addEventListener("canplaythrough", startThunder);
}