var distance;

function calculateHav(event) {
	var destLat, destLon, currLat, currLon, havLat, havLon, thetaLat, thetaLon;
	destLat = event.data[0] * (Math.PI/180);
	destLon = event.data[1] * (Math.PI/180);
	currLat = event.data[2] * (Math.PI/180);
	currLon = event.data[3] * (Math.PI/180);
	thetaLat = destLat - currLat;
	thetaLon = destLon - currLon;
	havLat = (1-Math.cos(thetaLat))/2;
	havLon = (1-Math.cos(thetaLon))/2;
	distance = 2 * 6371 * Math.asin(Math.sqrt(havLat + Math.cos(currLat) * Math.cos(destLat) * havLon));
	postMessage(distance);
}

self.addEventListener('message', calculateHav);