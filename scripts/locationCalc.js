var dropBox;
var latlong;
var resultsInfo = [];
var resultsLatlon;

window.onload = function() {
	dropBox = document.getElementById("dropBox");
	dropBox.ondragenter = ignoreDrag;
	dropBox.ondragover = ignoreDrag;
	dropBox.ondragleave = changeBack;
	dropBox.ondrop = drop;
}

function ignoreDrag(e) {
	e.stopPropagation();
	e.preventDefault();
	dropBox.style.backgroundColor = "#999999";
}

function changeBack(e) {
	dropBox.style.backgroundColor = "grey";
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();
	
	var data = e.dataTransfer;
	var files = data.files;
	
	processFiles(files);
	changeBack(e);
}

function processFiles(f) { //set other locations
	var file = f[0];
	
	var reader = new FileReader();
	
	reader.onload = function() {
		var i;
		var worker = new Worker("./scripts/calculateHav.js");
		resultsLatlon = reader.result.split("\n");
		for(i=0; i < resultsLatlon.length; i++) {
			var tempResults = resultsLatlon[i].split(",");
			resultsInfo.push(parseInt(tempResults[0]));
			resultsInfo.push(parseInt(tempResults[1]));
			
			//resultsInfo = reader.result.split(",");
			worker.postMessage([resultsInfo[0], resultsInfo[1], latlong[0], latlong[1]]);
			worker.addEventListener('message', calculateHav);
			//worker.terminate();
			
			resultsInfo.pop(tempResults[0]);
			resultsInfo.pop(tempResults[1]);
		}
		
		function calculateHav(event) {
			document.getElementById("distance").innerHTML += "Distance:" +  + event.data + " km<br>";
			//worker.terminate();
		}
	};
	reader.readAsText(file);
	
	var geocoder = new google.maps.Geocoder;

	geocodeLatLng(geocoder);
}

function makeWorker() {
	
}
	
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(initMap, error, 
		{
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		});
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

function initMap(position) { //shows your location
	var latlon = {lat: position.coords.latitude, lng: position.coords.longitude};
	latlong = [latlon.lat];
	latlong.push(latlon.lng);
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: latlon
	});
	var marker = new google.maps.Marker({
		position: latlon,
		map: map
	});
	console.log(position.coords.accuracy);
}

function error() {
	alert("Error: " + error.message)
}

function changeLocation() { //change own position
	var lat, lon;
	lat = document.getElementById("latitude").value;
	lon = document.getElementById("longitude").value;
	changeMap(lat, lon);
}

function changeMap(latitude, longitude) {
	var latlon = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
	console.log(latlon);
	latlong[0] = latlon.lat;
	latlong[1] = latlon.lng;
	console.log(latlong);
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: latlon
	});
	var marker = new google.maps.Marker({
		position: latlon,
		map: map
	});
	
	var worker = new Worker("./scripts/calculateHav.js");
	worker.postMessage([resultsInfo[0], resultsInfo[1], latlong[0], latlong[1]]);
	worker.addEventListener('message', calculateHav);
	//worker.terminate();
	function calculateHav(event) {
		document.getElementById("distance").innerHTML = "Distance: " + event.data + " km";
		worker.terminate();
	}
	
	var geocoder = new google.maps.Geocoder;

	geocodeLatLng(geocoder);
}

function geocodeLatLng(geocoder) {
	var latlng = {lat: latlong[0], lng: latlong[1]};
	geocoder.geocode({'location': latlng}, function(results, status) {
		if (status === 'OK') {
			if (results[1]) {
				document.getElementById("reverseGeocode").innerHTML = "Location: " + results[1].formatted_address;
			} else {
				window.alert('No results found');
			}
			} else {
				window.alert('Geocoder failed due to: ' + status);
		}
	});
}