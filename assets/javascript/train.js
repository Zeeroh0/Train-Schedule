
// Initialize Firebase
	var config = {
		apiKey: "AIzaSyBi09Oxjb0y1riK7KZkQNpGxkgA335ix10",
		authDomain: "train-schedule-73e33.firebaseapp.com",
		databaseURL: "https://train-schedule-73e33.firebaseio.com",
		projectId: "train-schedule-73e33",
		storageBucket: "train-schedule-73e33.appspot.com",
		messagingSenderId: "437202373046"
	};
	firebase.initializeApp(config);


//************GLOBAL VARIABLES************
	var database = firebase.database();


// ************FUNCTIONS************

	//Click submit button to enter in a new train
		$("#submit").on("click", function(event) {
			// Don't refresh
			event.preventDefault();

			// Get the user's entered values
			var newName = $("#nameInput").val().trim();
			var newDestination = $("#destinationInput").val().trim();
			var newStart = moment($("#startTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
			var newFrequency = $("#frequencyInput").val().trim();

			// Store this all in an object to be uploaded to Firebase
			var newTrain = {
				name: newName,
				destination: newDestination,
				start: newStart,
				frequency: newFrequency,
			};

			// Uploads data to database
			database.ref().push(newTrain);

			$("#nameInput").val("");
			$("#destinationInput").val("");
			$("#startTimeInput").val("");
			$("#frequencyInput").val("");
		});


	//Display current and new database entries
		database.ref().on("child_added", function(snapshot) {
			//Show me the object
			console.log(snapshot.val());

			// Store each value into a variable.
			var trainName = snapshot.val().name;
			var trainDestination = snapshot.val().destination;
			var trainStart = snapshot.val().start;
			var trainFrequency = snapshot.val().frequency;

			// Calc difference from the 1st train to right now in minutes, 
			// then divide by the modulus of the frequency.  The remainder is what we want here. 
			var timeDiff = moment().diff(moment.unix(trainStart), "minutes")%trainFrequency;
			// In minutes, how much longer till the next train
			var waitTime = trainFrequency - timeDiff;
			// Display when the next arrival will be in 12 hour AM/PM time
			var nextArrival = moment().add(waitTime, "m").format("hh:mm A");


			// Print train info
			console.log("Name: " + trainName);
			console.log("Destination: " + trainDestination);
			console.log("First Train runs: " + trainStart);
			console.log("Frequency: " + trainFrequency);

			// Add each train's data into the table
			$("#displaySchedules > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
			trainFrequency + "</td><td>" + nextArrival + "</td><td>" + waitTime + "</td></tr>");
		});

