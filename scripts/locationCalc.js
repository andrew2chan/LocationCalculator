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