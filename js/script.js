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

/* Window on load */

window.onload = () => {
  let url = window.location.href;
  let splitUrl = url.split("/");
  //console.log(splitUrl[2]);
  fetch(`http://${splitUrl[2]}/foo.txt`)
    .then(response => response.text())
    .then(data => {
      console.log(data);
    });

  /*   let drawLineDiv = document.getElementById("drawLineDiv");
  let drawLineCtx = drawLineDiv.getContext("2d");

  let clearLineBtn = document.getElementById("clearLine");
  clearLineBtn.addEventListener("click", () => {
    if (drawLineCtx) {
      clearCanvas(drawLineCtx);
    } else {
      console.log("Can't find Line ctx");
    }
  });
  let drawLinectxCanvas = drawLineCtx.canvas;
  let lineCoordArray = [];
  let lineCoord;

  drawLineDiv.onclick = event => {
    lineCoord = relMouseCoords(drawLinectxCanvas, event);
    lineCoordArray.push(lineCoord);
    myCircle(
      [lineCoord, { x: lineCoord.x + 3, y: lineCoord.y + 3 }],
      drawLineCtx
    );

    if (lineCoordArray.length === 2) {
      myLine(lineCoordArray, drawLineCtx);
      lineCoordArray = [];
    }
  }; */
};
