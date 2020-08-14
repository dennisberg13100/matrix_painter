const welcomePageForm = document.getElementById('welcomePageForm');
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

welcomePageForm.onsubmit = function (e){
	e.preventDefault();
	setSquareNumbers();
	if ( settings.horizontalSquares > 0 && settings.verticalSquares > 0){
		hiddeInitialPage();
		showWorkingArea();
		createNewMatrixFilledWithZeros();
		renderWorkingArea();
		drawColorMenu();

	} else {
		alert("Please fill in the amount of horizontal and vertical squares!");
	}	
};

function setSquareNumbers(){
	settings.horizontalSquares = document.getElementById('horizontal').value;
	settings.verticalSquares = document.getElementById('vertical').value;
}

function hiddeInitialPage() {
	initialSettings.style.display = 'none';
}

function showWorkingArea() {
	workingArea.style.display = 'flex';
}

function createNewMatrixFilledWithZeros() {
	let matrix = [];

	for ( i = 0; i < settings.verticalSquares; i++){
		matrix.push([]);
		for (j = 0; j < settings.horizontalSquares; j++){
			matrix[i].push(0)
		}
	}

	settings.matrix = matrix;
}

function renderWorkingArea() {
	createCanvas();
	renderCanvas();
	document.getElementById('canvas').addEventListener('click', function(e){onClickOnCanvas(e);});
	writeMatrixInMatirxPreview();
}

function createCanvas(){
	canvasDiv.innerHTML = '';
	let divInfo = canvasDiv.getBoundingClientRect();
	let div = {
		height: divInfo.height,
		width: divInfo.width
	}; 
	calculateSquaresSizes(div);
	let canvasHeight = settings.squareSize * settings.verticalSquares;
	let canvasWidht = settings.squareSize * settings.horizontalSquares;
	canvasDiv.innerHTML = '<canvas id=' + canvasId + ' width=' + canvasWidht + ' height=' + canvasHeight + '></canvas>';
	addMarginToCanvas(div);
}

function calculateSquaresSizes(div){
	if(div.width / settings.horizontalSquares < div.height / settings.verticalSquares) {
		settings.squareSize = div.width / settings.horizontalSquares;
	} else {
		settings.squareSize = div.height / settings.verticalSquares
	}
}

function addMarginToCanvas(div) {
	let marginVertival = (div.height - (settings.verticalSquares * settings.squareSize)) / 2;
	let marginHorizontal = (div.width - (settings.horizontalSquares * settings.squareSize)) / 2;

	canvasDiv.style.paddingTop =  marginVertival;
	canvasDiv.style.paddingBottom =  marginVertival;
	canvasDiv.style.paddingLeft =  marginHorizontal;
	canvasDiv.style.paddingRight =  marginHorizontal;
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
		content += '" onchange="updateMatrixColor(this)" data="' + i + '"></div>';
		content += '<div><input type="text" value="' + settings.values[i]; 
		content += '" onkeyup="updateMatrixValue(this)" data="' + i + '"></div>';
		content += '</div>';
	}

	colorMenu.innerHTML = content;
}

function updateMatrixColor(e){
	let value = e.value;
	let index =  e.getAttribute("data");
	if (value != "") {
		settings.colors[index] = value;
		renderWorkingArea();
	}	
}

function updateMatrixValue(e){
	let value = e.value;
	let index =  e.getAttribute("data");
	if (value != "") {
		settings.values[index] = value;
		renderWorkingArea();
	}	
}

function renderCanvas() {

	for(let i = 0; i < settings.horizontalSquares ; i++){
		for(let j = 0; j < settings.verticalSquares; j++){
			index = settings.matrix[i][j];
			let position = {
				y: i,
				x: j
			}
			drawSquare(position, settings.colors[index]);
		}
	}
}

function drawSquare(position, color) {
	const cvs = document.getElementById(canvasId); 
	const ctx = cvs.getContext("2d");
	let squareSize = settings.squareSize;
	
	ctx.fillStyle = color;
	ctx.fillRect(position.x*squareSize , position.y*squareSize , squareSize , squareSize );

	ctx.strokeStyle = "#333";
	ctx.strokeRect(position.x*squareSize , position.y*squareSize , squareSize , squareSize );
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

function selectColor(e) {
	let elements = document.getElementsByClassName('selected');

	while(elements.length > 0){
	    elements[0].classList.remove('selected');
	}
	let index =  e.getAttribute("data");
	settings.selected = index;
	e.classList.add("selected");
}

function onClickOnCanvas(e){
	let clickedPosition = getClickedSquareOnCanvas(e);
	addChangeToHistory(clickedPosition);
	removeStpesHigherThenHistoryIndex();
	setSelectedValueIntoMatrix(clickedPosition);
	renderWorkingArea();
}

function getClickedSquareOnCanvas(e) {
	let canvas = document.getElementById(canvasId).getBoundingClientRect();
	let x = e.clientX - canvas.x;
	let y = e.clientY - canvas.y;

	x = Math.floor(x / settings.squareSize);
	y = Math.floor(y / settings.squareSize);
	return {y, x};
}

function addChangeToHistory (position) {
	let valueIndex = settings.matrix[position.y][position.x];
	const data = {
		position: [position.y , position.x],
		oldValue: valueIndex,
		newValue: settings.selected
	}
	paintHistory.undoIndex +=1;
	paintHistory.stepList.push(data);
}

function removeStpesHigherThenHistoryIndex(){
	paintHistory.stepList = paintHistory.stepList.slice(0,(paintHistory.undoIndex +1));
}

function setSelectedValueIntoMatrix(position){
	settings.matrix[position.y][position.x] = parseInt(settings.selected);
}

function addNewColorButtonAction() {
	settings.colors.push("#FFFFFF");
	settings.values.push("0");

	drawColorMenu();
}

window.addEventListener('wheel', function(e) {zoom(e);}, false);
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

// Redraw the canvas on the right size after changing the size of the canvas
window.addEventListener("resize", function(){renderWorkingArea();}, true);
 
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
	if( paintHistory.undoIndex >= 0 ){
		let index = paintHistory.undoIndex;
		let data = paintHistory.stepList[index];
		settings.matrix[data.position[0]][data.position[1]] = data.oldValue;
		paintHistory.undoIndex -= 1;
		renderWorkingArea();
	} else {
		createNewMatrixFilledWithZeros();
		paintHistory.undoIndex == -2;
		renderWorkingArea();
	}
}

function redoStep(e) {
	e.preventDefault();
	if ((paintHistory.stepList.length - 1) > paintHistory.undoIndex) {
		paintHistory.undoIndex += 1;
		let index = paintHistory.undoIndex;
		let data = paintHistory.stepList[index];
		settings.matrix[data.position[0]][data.position[1]] = data.newValue;
		renderWorkingArea();
	}
}