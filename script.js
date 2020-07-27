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

// Draw the color menu
function drawColorMenu(colors, values, div) {
	let content = "";
	for( let i = 0; i < colors.length; i++){
		content += '<div class="color-selector">';
		content += '<div class="color-border">';
		content += '<div class="color" style="background-color:' + colors[i] + ';"></div>';
		content += '</div>';
		content += '<div class="color-value">' + values[i] + '</div>';
		content += '</div>';
	}
	div.innerHTML = content;
}

// Write the matrix preview in the matrixPreviw area 
function writeMatrixInDiv(matrix, div) {
	let content = "["
	for(let i = 0; i < matrix.length; i++){
		if( i != 0 ){
			content += "&nbsp;[";
		} else {
			content += "[";
		}
		content += matrix[i];
		content += "]";
		if( i != (matrix.length-1)){
			content += "</br>";
		}
	}
	content += "]";

	div.innerHTML = content;
}

// Make the actions when you click on the canvas
function clickOnCanvas(e){
	console.log(e)
	let canvas = document.getElementById(canvasId).getBoundingClientRect();
	x = e.screenX - canvas.x;
	y = e.screenY - canvas.y;
	console.log(x + " - " + y);
	x = Math.floor(x / settings.squareSize);
	y = Math.floor(y / settings.squareSize);
	console.log(x + " - " + y);
}

// This redner function updates the whole working area each time that it's necessary (including margins and squaresizes)
function renderWorkingArea(canvasDiv, canvasId, obj) {
	createCanvas(canvasDiv, canvasId, obj);
	renderCanvas(canvasId, obj);
	document.getElementById('canvas').addEventListener('click', function(e){clickOnCanvas(e);});
	writeMatrixInDiv(settings.matrix, matirxPreview);

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
		renderWorkingArea(canvasDiv, canvasId, settings);
		drawColorMenu(settings.colors, settings.values, colorMenu);

	} else {
		alert("Please fill in the amount of horizontal and vertical squares!");
	}	
};

// Control that the canvas has the right  size after changing the size of the screen 
window.addEventListener("resize", function(){renderWorkingArea(canvasDiv, canvasId, settings);}, true);

// Zoom in and out 
function zoom(e){
	if(e.deltaY > 0 && settings.squareSize > 40){
		console.log("ZOOM OUT");
		canvasDiv.innerHTML = "";
		marginDelta = 5
		for( let i = 0; i < marginDelta; i++){
			settings.margin += 1;
			canvasDiv.style.margin = settings.margin;
			setTimeout(function(){ renderWorkingArea(canvasDiv, canvasId, settings); }, 50);
		}
	} else if(e.deltaY < 0 && settings.margin > 0)  {
		console.log("ZOOM IN")
		canvasDiv.innerHTML = "";
		settings.margin -= 5;
		canvasDiv.style.margin = settings.margin;
		renderWorkingArea(canvasDiv, canvasId, settings);
	}
}
window.addEventListener('wheel', function(e) {zoom(e);}, false);
