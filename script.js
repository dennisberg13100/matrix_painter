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

function createNewMatrixFilledWithZeros() {
	let matrix = [];

	for ( i = 0; i < settings.verticalSquares; i++){
		matrix.push([]);
		for (j = 0; j < settings.horizontalSquares; j++){
			matrix[i].push(0)
		}
	}

	return matrix;
}

function createCanvas(){
	canvasDiv.innerHTML = '';
	let divInfo = canvasDiv.getBoundingClientRect();
	let divWidth = divInfo.width;
	let divHeight = divInfo.height; 
	
	calculateSquaresSizes(divHeight, divWidth);
	canvasHeight = settings.squareSize * settings.verticalSquares;
	canvasWidht = settings.squareSize * settings.horizontalSquares;
	canvasDiv.innerHTML = '<canvas id=' + canvasId + ' width=' + canvasWidht + ' height=' + canvasHeight + '></canvas>';
	addMarginToCanvas(divHeight, divWidth);
}

function calculateSquaresSizes(divHeight, divWidth){
	if(divWidth / settings.horizontalSquares < divHeight / settings.verticalSquares) {
		settings.squareSize = divWidth / settings.horizontalSquares;
	} else {
		settings.squareSize = divHeight / settings.verticalSquares
	}
}

function addMarginToCanvas(divHeight, divWidth) {
	marginVertival = (divHeight - (settings.verticalSquares * settings.squareSize)) / 2;
	marginHorizontal = (divWidth - (settings.horizontalSquares * settings.squareSize)) / 2;

	canvasDiv.style.paddingTop =  marginVertival;
	canvasDiv.style.paddingBottom =  marginVertival;
	canvasDiv.style.paddingLeft =  marginHorizontal;
	canvasDiv.style.paddingRight =  marginHorizontal;
}

function selectColor(e) {
	let elements = document.getElementsByClassName('selected');

	while(elements.length > 0){
	    elements[0].classList.remove('selected');
	}
	let index =  e.getAttribute("data");
	settings.selected = index;
	e.classList.add("selected");
}

function drawColorMenu() {
	let content = "";
	
	for( let i = 0; i < settings.colors.length; i++){
		content += '<div class="color-selector ';
		if ( i == settings.selected ){
			content += 'selected';
		}
		content += '" data="' + i + '" onclick="selectColor(this)">';
		content += '<div><input type="color" value="' + settings.colors[i]; 
		content += '" onchange="updateMatrixItem(this,';
		content += "'colors'" + ')" data="' + i + '"></div>';
		content += '<div><input type="text" value="' + settings.values[i]; 
		content += '" onkeyup="updateMatrixItem(this,';
		content += "'values'" + ')" data="' + i + '"></div>';
		content += '</div>';
	}

	colorMenu.innerHTML = content;
}

function writeMatrixInMatirxPreview() {
	let content = "[";

	for(let i = 0; i < settings.matrix.length; i++){
		if( i != 0 ){
			content += "&nbsp;[";
		} else {
			content += "[";
		}

		for ( let j = 0; j < settings.matrix[i].length; j++) {
			content += settings.values[settings.matrix[i][j]];
			if ( j != (settings.matrix[i].length - 1)){
				content += ", ";
			}
		}

		content += "]";

		if( i != (settings.matrix.length-1)){
			content += ",</br>";
		}
	}
	content += "]</br>&nbsp;";

	matirxPreview.innerHTML = content;
}

function onClickOnCanvas(e){
	let canvas = document.getElementById(canvasId).getBoundingClientRect();
	let x = e.clientX - canvas.x;
	let y = e.clientY - canvas.y;

	x = Math.floor(x / settings.squareSize);
	y = Math.floor(y / settings.squareSize);
	position = [y, x];
	addChangeToHistory(position);
	paintHistory.stepList = paintHistory.stepList.slice(0,(paintHistory.undoIndex +1))
	settings.matrix[y][x] = parseInt(settings.selected);
	renderWorkingArea();
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

// Update de Color or the value from a matrix item (the second variable tells if the item is a color or a value)
function updateMatrixItem(e, colorValue){
	let value = e.value;
	let index =  e.getAttribute("data");
	if (value != "") {
		if (colorValue == "colors"){
			settings.colors[index] = value;
		} else {
			settings.values[index] = value;
		}
		renderWorkingArea();
	}	
}

function addNewColorButtonAction() {
	settings.colors.push("#FFFFFF");
	settings.values.push("0");

	drawColorMenu(settings.colors, settings.values, settings.selected, colorMenu);
}

function renderWorkingArea() {
	createCanvas();
	renderCanvas();
	document.getElementById('canvas').addEventListener('click', function(e){onClickOnCanvas(e);});
	writeMatrixInMatirxPreview();
}

function drawSquare(x, y, color) {
	const cvs = document.getElementById(canvasId); 
	const ctx = cvs.getContext("2d");
	let squareSize = settings.squareSize;
	
	ctx.fillStyle = color;
	ctx.fillRect(x*squareSize , y*squareSize , squareSize , squareSize );

	ctx.strokeStyle = "#333";
	ctx.strokeRect(x*squareSize , y*squareSize , squareSize , squareSize );
}

function renderCanvas() {

	for(let i = 0; i < settings.horizontalSquares ; i++){
		for(let j = 0; j < settings.verticalSquares; j++){
			index = settings.matrix[i][j];
			drawSquare(j, i, settings.colors[index]);
		}
	}
}

initialForm.onsubmit = function (e){
	e.preventDefault();
	settings.horizontalSquares = document.getElementById('horizontal').value;
	settings.verticalSquares = document.getElementById('vertical').value;
	if ( settings.horizontalSquares > 0 && settings.verticalSquares > 0){
		initialSettings.style.display = 'none';
		workingArea.style.display = 'flex';
		settings.matrix = createNewMatrixFilledWithZeros();
		renderWorkingArea();
		drawColorMenu(settings.colors, settings.values, settings.selected, colorMenu);

	} else {
		alert("Please fill in the amount of horizontal and vertical squares!");
	}	
};

// Redraw the canvas on the right size after changing the size of the canvas
window.addEventListener("resize", function(){renderWorkingArea();}, true);

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

		renderWorkingArea();
	}
}

window.addEventListener('wheel', function(e) {zoom(e);}, false);
 

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
		renderCanvas();
	} else if (paintHistory.undoIndex === 0) {
		settings.matrix = createNewMatrixFilledWithZeros();
		paintHistory.undoIndex == -1;
		renderCanvas();
	}
}

function redoStep(e) {
	e.preventDefault();
	if ((paintHistory.stepList.length - 1) > paintHistory.undoIndex) {
		paintHistory.undoIndex += 1;
		let index = paintHistory.undoIndex;
		let data = paintHistory.stepList[index];
		settings.matrix[data.position[0]][data.position[1]] = data.newValue;
		renderCanvas();
	}
}