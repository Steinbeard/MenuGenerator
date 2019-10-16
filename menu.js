/*
 * Random menu generator
 * Generates random menus to navigate
 * Writes movement times to CSV
 *
 * by Daniel Steinberg
 * 10/16/19
 */

const prompts = require('prompts');

const target = "Crerar";
var items = [
	"Woodlawn", "Regenstein", "University",
	"Harper", "Ratner", "Crown",
	"Baker", "Bartlett", "Cathey",
	"53rd", "55th", "57th",
	"59th", "61st", "63rd",
	"65th","Ellis","Medici",
	"Vue53","Soul Shack","Bond",
	"Midway","Dorcester","Hyde Park Produce",
	"Jewel","Trader Joe's","CVS",
	"Walgreens","Target","Native Foods",
	"Shinju Sushi","Starbucks","Pret a Manger",
	"Hallowed Grounds","Ex Libris","Dollop",
	"Barnes & Noble","Aloha Poke","Eckhart",
	"Social Science Research","Ida Noyes","Rosenwald",
	"Grounds of Being","Zoology","Botany",
	"Mansueto", "Peaches", "MADD"
]

var results = {
	reactionTimes: [],
	cursorDistance: []
}
const numItems = 8;
const numTrials = 30;
var currentTrial = 0;
var i = 0;
var listChoices = [];

function promptUser() {
	targetPlace = Math.floor(Math.random() * numItems);
	startingPoint = Math.floor(Math.random() * numItems);
	results.cursorDistance[currentTrial] = Math.abs(startingPoint - targetPlace);
	for (i = 0; i < numItems; i++) {
		if (i == targetPlace) {
			listChoices[i] = {
				title: target,
				value: 'true'
			}
		}
		else {
			listChoices[i] = {
				title: items[Math.floor(Math.random() * items.length)],
				value: 'false'
			}
		}
	}
	var d = new Date();
	var stamp1 = d.getTime();
	results.reactionTimes[currentTrial] = stamp1;
	getChoice();
}

function getChoice() {
	console.clear();
	(async () => {
		const response = await prompts(
		{
			type: 'select',
			name: 'choice',
			message: 'Which is UChicago\'s comp sci library?',
			choices: listChoices,
			initial: startingPoint
		});
		if (response['choice'] == 'false') {
			return getChoice();
		}

		d = new Date();
		var stamp2 = d.getTime();
		results.reactionTimes[currentTrial] = stamp2 - results.reactionTimes[currentTrial];
		console.log(response); // => { value: 24 }
		console.log("You took " + results.reactionTimes[currentTrial] + " ms");
		if (currentTrial < (numTrials - 1)) {
			currentTrial++;
			setTimeout(promptUser, 1500);
		} else {
			console.log("Testing complete")
			writeToCSV(results);
		}	
	})();
}

promptUser();

/* Write results to file */

const fs = require('fs');

function writeToCSV(resultsArray){
  var csv1 = resultsArray.reactionTimes.join(", ");
  console.log(csv1);
  var csv2 = resultsArray.cursorDistance.join(", ");
  console.log(csv2);
  var csv = csv1 + "\n" + csv2;
  fs.writeFile("flat.csv", csv, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("Results were saved to flat.csv");
  }); 
}