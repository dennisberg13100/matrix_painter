const initialForm = document.getElementById('initialForm');
const initialSettings =  document.getElementById('initialSettings');
const workingArea = document.getElementById('workingArea');
const canvasDiv = document.getElementById('canvasDiv');
const canvasId = "canvas";
const colorMenu = document.getElementById("colorMenu");
const matirxPreview = document.getElementById("matrixPreview");

const settings = {
	matrix: [],
	squareSize: 0,
	horizontalSquares: 0,
	verticalSquares: 0,
	colors: ["#FFFFFF"], 
	values: ["0"],
	margin: 0,
	selected: 0
};

const paintHistory = {
	stepList: [],
	undoIndex: -1,
}

// Create a new empty matrix filled with zeros
function createNewMatrix(obj) {
	let matrix = [];

	for ( i = 0; i < obj.verticalSquares; i++){
		matrix.push([]);
		for (j = 0; j < obj.horizontalSquares; j++){
			matrix[i].push(0)
		}
	}

	return matrix;
}

// Create a canvas in the div thas is passed in the function for specific size of the horizontal and vetical squares
function createCanvas(div, canvasId, obj){
	div.innerHTML = '';
	divInfo = div.getBoundingClientRect();
	divWidth = divInfo.width;
	divHeight = divInfo.height; 

	
	// Here we check the largest possible size to make the canvas wit the squares so taht it stays square
	if(divWidth / obj.horizontalSquares < divHeight / obj.verticalSquares) {
		obj.squareSize = divWidth / obj.horizontalSquares;
		canvasWidht = divWidth;
		canvasHeight = obj.squareSize * obj.verticalSquares;
	} else {
		obj.squareSize = divHeight / obj.verticalSquares
		canvasWidht = obj.squareSize * obj.horizontalSquares;
		canvasHeight = divHeight;
	}

	// Create the canvas
	div.innerHTML = '<canvas id=' + canvasId + ' width=' + canvasWidht + ' height=' + canvasHeight + '></canvas>';

	// Add margin to the canvas
	marginVertival = (divHeight - (obj.verticalSquares * obj.squareSize)) / 2;
	marginHorizontal = (divWidth - (obj.horizontalSquares * obj.squareSize)) / 2;

	div.style.paddingTop =  marginVertival;
	div.style.paddingBottom =  marginVertival;
	div.style.paddingLeft =  marginHorizontal;
	div.style.paddingRight =  marginHorizontal;

}

// Define a color as selected 
function selectColor(e) {

	let elements = document.getElementsByClassName('selected');

	while(elements.length > 0){
	    elements[0].classList.remove('selected');
	}
	let index =  e.getAttribute("data");
	settings.selected = index;
	e.classList.add("selected");
}

// Draw the color menu
function drawColorMenu(colors, values, selected, div) {
	let content = "";
	
	for( let i = 0; i < colors.length; i++){
		content += '<div class="color-selector ';
		if ( i == selected ){
			content += 'selected';
		}
		content += '" data="' + i + '" onclick="selectColor(this)">';
		content += '<div><input type="color" value="' + colors[i] + '" onchange="updateMatrixItem(this,'
		content += "'colors'" + ')" data="' + i + '"></div>';
		content += '<div><input type="text" value="' + values[i] + '" onkeyup="updateMatrixItem(this,'
		content += "'values'" + ')" data="' + i + '"></div>';
		content += '</div>';
	}

	div.innerHTML = content;
}

// Write the matrix preview in the matrixPreviw area 
function writeMatrixInDiv(matrix, values, div) {

	let content = "[";

	for(let i = 0; i < matrix.length; i++){

		if( i != 0 ){
			content += "&nbsp;[";
		} else {
			content += "[";
		}

		for ( let j = 0; j < matrix[i].length; j++) {
			content += values[matrix[i][j]];
			if ( j != (matrix[i].length - 1)){
				content += ", ";
			}
		}

		content += "]";

		if( i != (matrix.length-1)){
			content += ",</br>";
		}
	}
	content += "]</br>&nbsp;";

	div.innerHTML = content;
}

// Make the actions when you click on the canvas
function clickOnCanvas(e){
	let canvas = document.getElementById(canvasId).getBoundingClientRect();
	let x = e.clientX - canvas.x;
	let y = e.clientY - canvas.y;

	x = Math.floor(x / settings.squareSize);
	y = Math.floor(y / settings.squareSize);
	position = [x, y];
	addChangeToHistory(position);
	paintHistory.stepList = paintHistory.stepList.slice(0,(paintHistory.undoIndex +1))
	settings.matrix[x][y] = parseInt(settings.selected);
	renderWorkingArea(canvasDiv, canvasId, settings);
}

function addChangeToHistory (position) {
	let valueIndex = settings.matrix[position[0]][position[1]];
	const data = {
		position: position,
		oldValue: valueIndex,
		newValue: settings.selected
	}
	paintHistory.undoIndex +=1;
	paintHistory.stepList.push(data);

}

// This function takes a Matrix a old value and a new value and it returns the new matrix with the new values in the place of teh old ones
function updateMatrixValues(matrix, oldValue, newValue) {
	for (let i = 0; i < matrix.length; i++){
		for (let j = 0; j < matrix[i].length; j++) {
			if( matrix[i][j] == oldValue) {
				matrix[i][j] = newValue;
			}
		}
	}
	return matrix;
}

// Update de Color or the value from a matrix item (the second variable tells if the item is a color or a value)
function updateMatrixItem(e, colorValue){
	let value = e.value;
	let index =  e.getAttribute("data");
	let oldValue = settings.values[index];
	if (value != "") {
		if (colorValue == "colors"){
			settings.colors[index] = value;
		} else {
			// settings.matrix = updateMatrixValues(settings.matrix, oldValue, value);
			settings.values[index] = value;
		}
		renderWorkingArea(canvasDiv, canvasId, settings);
	}	
}

// And a new color/value to the matrix 
function addNewColor() {
	settings.colors.push("#FFFFFF");
	settings.values.push("0");

	drawColorMenu(settings.colors, settings.values, settings.selected, colorMenu);
}

// This redner function updates the whole working area each time that it's necessary (including margins and squaresizes)
function renderWorkingArea(canvasDiv, canvasId, obj) {
	createCanvas(canvasDiv, canvasId, obj);
	renderCanvas(canvasId, obj);
	document.getElementById('canvas').addEventListener('click', function(e){clickOnCanvas(e);});
	writeMatrixInDiv(settings.matrix, settings.values, matirxPreview);
}

// Draw the square
function drawSquare(x, y, color, squareSize, ctx) {
	ctx.fillStyle = color;
	ctx.fillRect(x*squareSize , y*squareSize , squareSize , squareSize );

	ctx.strokeStyle = "#333";
	ctx.strokeRect(x*squareSize , y*squareSize , squareSize , squareSize );
}

// This function update just what is inside the canvas
function renderCanvas(canvasId, obj) {
	const cvs = document.getElementById(canvasId); 
	const ctx = cvs.getContext("2d");

	for(let i = 0; i < obj.horizontalSquares ; i++){
		for(let j = 0; j < obj.verticalSquares; j++){
			index = obj.matrix[i][j];
			drawSquare(i, j, obj.colors[index], obj.squareSize, ctx);
		}
	}
}

// Hide the instructions page and show the working area 
initialForm.onsubmit = function (e){
	e.preventDefault();

	// Get the number of vetical and horizontal squares
	settings.horizontalSquares = document.getElementById('horizontal').value;
	settings.verticalSquares = document.getElementById('vertical').value;
	if ( settings.horizontalSquares > 0 && settings.verticalSquares > 0){
		initialSettings.style.display = 'none';
		workingArea.style.display = 'flex';
		settings.matrix = createNewMatrix(settings);
		renderWorkingArea(canvasDiv, canvasId, settings);
		drawColorMenu(settings.colors, settings.values, settings.selected, colorMenu);

	} else {
		alert("Please fill in the amount of horizontal and vertical squares!");
	}	
};

// Control that the canvas has the right  size after changing the size of the screen 
window.addEventListener("resize", function(){renderWorkingArea(canvasDiv, canvasId, settings);}, true);

// Zoom in and out 
function zoom(e){
	if(e.deltaY > 0 && settings.squareSize > 10){
		canvasDiv.innerHTML = "";
		marginDelta = 5

		for( let i = 0; i < marginDelta; i++){
			settings.margin += 1;
			canvasDiv.style.margin = settings.margin;
			setTimeout(function(){ renderWorkingArea(canvasDiv, canvasId, settings); }, 50);
		}
	} else if(e.deltaY < 0 && settings.margin > 0)  {
		canvasDiv.innerHTML = "";
		settings.margin -= 5;
		canvasDiv.style.margin = settings.margin;

		renderWorkingArea(canvasDiv, canvasId, settings);
	}
}

window.addEventListener('wheel', function(e) {zoom(e);}, false);
 

// ctrl+z function 
document.addEventListener('keydown', (e) => {keyPress(e);});

function keyPress(e){
	if(e.keyCode === 90 && e.ctrlKey === true && e.shiftKey === false){
		e.preventDefault();
		undoStep(e);
	} else if(e.keyCode === 90 && e.ctrlKey === true && e.shiftKey === true){
		e.preventDefault();
		redoStep(e);
	}
	
}

function undoStep(e){
	e.preventDefault();
	if( paintHistory.undoIndex > 0 ){
		let index = paintHistory.undoIndex;
		let data = paintHistory.stepList[index];
		settings.matrix[data.position[0]][data.position[1]] = data.oldValue;
		paintHistory.undoIndex -= 1;
		renderCanvas(canvasId, settings);
	} else if (paintHistory.undoIndex === 0) {
		settings.matrix = createNewMatrix(settings);
		paintHistory.undoIndex == -1;
		renderCanvas(canvasId, settings);
	}
}

// Now working 100% 
function redoStep(e) {
	e.preventDefault();
	if ((paintHistory.stepList.length - 1) > paintHistory.undoIndex) {
		paintHistory.undoIndex += 1;
		let index = paintHistory.undoIndex;
		let data = paintHistory.stepList[index];
		settings.matrix[data.position[0]][data.position[1]] = data.newValue;
		renderCanvas(canvasId, settings);
	}
}