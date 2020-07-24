const initialForm = document.getElementById('initialForm');
const initialSettings =  document.getElementById('initialSettings');
const workingArea = document.getElementById('workingArea');
const canvasDiv = document.getElementById('canvasDiv');
const canvasId = "canvas"

const settings = {
	matrix: [],
	squareSize: 0,
	horizontalSquares: 0,
	verticalSquares: 0,
	colors: ["#FFFFFF"]
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
    console.log(matrix)
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

// This redner function updates the whole working area each time that it's necessary (including margins and squaresizes)
function renderWorkingArea(canvasDiv, canvasId, obj) {
	createCanvas(canvasDiv, canvasId, obj);
	renderCanvas(canvasId, obj);
}

// Draw the square
function drawSquare(x, y, color, squareSize, ctx) {
	console.log(color);
	ctx.fillStyle = color;
	ctx.fillRect(x*squareSize , y*squareSize , squareSize , squareSize );

	ctx.strokeStyle = "BLACK";
	ctx.strokeRect(x*squareSize , y*squareSize , squareSize , squareSize );
}

// This function update just what is inside the canvas
function renderCanvas(canvasId, obj) {
	console.log(obj);
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
		console.log(settings);
		renderWorkingArea(canvasDiv, canvasId, settings)
	} else {
		alert("Please fill in the amount of horizontal and vertical squares!");
	}	
};

window.addEventListener("resize", function(){renderWorkingArea(canvasDiv, canvasId, settings);}, true);
