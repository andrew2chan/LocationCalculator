var dropBox;

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

function processFiles(f) {
	var file = f[0];
	
	var reader = new FileReader();
	
	reader.onload = function() {
		console.log(reader.result);
	};
	reader.readAsText(file);
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

function initMap(position) {
	var latlon = {lat: position.coords.latitude, lng: position.coords.longitude};
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
	alert("Error:" + error.message)
}