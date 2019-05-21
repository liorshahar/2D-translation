/* Created by Lior Shahar and Hanan Avraham */

/* ------------Utility Functions------------------------------------------------ */

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

function relMouseCoords(ctxCanvas, event) {
  let totalOffsetX = 0;
  let totalOffsetY = 0;
  let canvasX = 0;
  let canvasY = 0;
  let currentElement = ctxCanvas;

  do {
    totalOffsetX += currentElement.offsetLeft;
    totalOffsetY += currentElement.offsetTop;
  } while ((currentElement = currentElement.offsetParent));

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  // Fix for variable canvas width
  canvasX = Math.round(canvasX * (ctxCanvas.width / ctxCanvas.offsetWidth));
  canvasY = Math.round(canvasY * (ctxCanvas.height / ctxCanvas.offsetHeight));

  return { x: canvasX, y: canvasY };
}

function clearCanvas(ctxCanvas) {
  console.log(ctxCanvas.canvas);
  ctxCanvas.clearRect(0, 0, ctxCanvas.canvas.width, ctxCanvas.canvas.height);
}

function setLeftMenuAndCanvasHight() {
  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;
  /* Set canvas height */
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  ctx.canvas.height = windowHeight - 173; // minus -> header + footer = 200
  ctx.canvas.width = windowWidth - 232;
  /* Set side menu height */
  let leftMenuBar = document.getElementById("leftMenuBar");
  leftMenuBar.style.height = `${windowHeight - 172}px`; // minus -> header + footer + border  = 202
}

/* Draw line */
function moveLines(lineArray, tx, ty, ctx) {
  ctx.beginPath();
  for (let i = 0; i < lineArray.length; i++) {
    if (lineArray[i].line == 0) {
      ctx.moveTo(lineArray[i].x + tx, lineArray[i].y + ty);
      lineArray[i].x += tx;
      lineArray[i].y += ty;
    } else {
      ctx.lineTo(lineArray[i].x + tx, lineArray[i].y + ty);
      lineArray[i].x += tx;
      lineArray[i].y += ty;
    }
  }
  ctx.stroke();
  return lineArray;
}
/* Draw Circle */

function moveCircles(circleArray, tx, ty, ctx) {
  for (let i = 0; i < circleArray.length; i++) {
    ctx.beginPath();
    ctx.arc(
      circleArray[i].x + tx,
      circleArray[i].y + ty,
      circleArray[i].r,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    circleArray[i].x += tx;
    circleArray[i].y += ty;
  }
  return circleArray;
}
/* Draw Curve */
function moveCurves(curveArray, tx, ty, ctx) {
  for (let i = 0; i < curveArray.length; i++) {
    ctx.beginPath();
    ctx.moveTo(curveArray[i].cp1x + tx, curveArray[i].cp1y + ty);
    ctx.bezierCurveTo(
      curveArray[i].cp1x + tx,
      curveArray[i].cp1y + ty,
      curveArray[i].cp2x + tx,
      curveArray[i].cp2y + ty,
      curveArray[i].x + tx,
      curveArray[i].y + ty
    );
    ctx.stroke();
    curveArray[i].cp1x += tx;
    curveArray[i].cp1y += ty;
    curveArray[i].cp2x += tx;
    curveArray[i].cp2y += ty;
    curveArray[i].x += tx;
    curveArray[i].y += ty;
  }
  return curveArray;
}

/* Window on load */

window.onresize = () => {
  setLeftMenuAndCanvasHight();
};

window.onload = () => {
  /* Ajust canvas and left menu size*/
  setLeftMenuAndCanvasHight();

  /* Get url info */
  let url = window.location.href;
  let splitUrl = url.split("/");

  /* Canvas */
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");

  /* Global scope variables */
  let fileName;
  let moveButtonFlag = false;
  let isDraw = false;
  /*  Set input file lisener*/
  let loadFileInput = document.getElementById("loadFileInput");
  loadFileInput.addEventListener("change", e => {
    fileName = e.target.files[0].name;
    if (fileName) {
      document.getElementById("loadFileLable").children[1].innerHTML = fileName;
    }
  });

  /* Set draw button lisener */
  let drawButton = document.getElementById("draw");
  drawButton.addEventListener("click", () => {
    if (!fileName) {
      alert("Please load file");
    } else {
      fetch(`http://${splitUrl[2]}/${fileName}`)
        .then(response => response.json())
        .then(data => {
          /* Drawing the picture from the text file */
          localStorage.setItem("points", JSON.stringify(data));
          moveLines(data.lines, 0, 0, ctx);
          moveCircles(data.circle, 0, 0, ctx);
          moveCurves(data.curve, 0, 0, ctx);
          isDraw = true;
        });
    }
  });

  /* Set moveButton listner */
  let moveButton = document.getElementById("moveButton");
  moveButton.addEventListener("click", () => {
    if (isDraw) {
      moveButton.style.backgroundColor = "darkgrey";
      moveButtonFlag = true;
    } else {
      alert("Load file Please...");
    }
  });

  /* Move variables */

  let movePoints = [];
  let movePointsIndex = 0;

  /* main */
  canvas.onclick = event => {
    if (moveButtonFlag) {
      movePoints[movePointsIndex] = relMouseCoords(ctx.canvas, event);
      movePointsIndex++;

      if (movePoints.length == 2) {
        let tx = movePoints[1].x - movePoints[0].x;
        let ty = movePoints[1].y - movePoints[0].y;
        let pointsArray;
        let newLineArray, newCircleArray, newCurveArray;

        if (localStorage.points) {
          pointsArray = JSON.parse(localStorage.points);
          clearCanvas(ctx);
          pointsArray.lines = moveLines(pointsArray.lines, tx, ty, ctx);
          pointsArray.circle = moveCircles(pointsArray.circle, tx, ty, ctx);
          pointsArray.curve = moveCurves(pointsArray.curve, tx, ty, ctx);
          localStorage.setItem("points", JSON.stringify(pointsArray));
          movePoints = [];
          movePointsIndex = 0;
          moveButton.style.backgroundColor = "rgb(114, 111, 111)";
          moveButtonFlag = false;
        }
      }
    }
  };
};
