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

  /* Set canvas height */
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  ctx.canvas.height = windowHeight - 173; // minus -> header + footer = 200

  /* Set side menu height */
  let leftMenuBar = document.getElementById("leftMenuBar");
  leftMenuBar.style.height = `${windowHeight - 172}px`; // minus -> header + footer + border  = 202
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

  let fileName;

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
          ctx.beginPath();
          for (let i = 0; i < data.lines.length; i++) {
            if (data.lines[i].line == 0) {
              ctx.moveTo(data.lines[i].x, data.lines[i].y);
            } else {
              ctx.lineTo(data.lines[i].x, data.lines[i].y);
            }
          }
          ctx.stroke();

          for (let i = 0; i < data.circle.length; i++) {
            ctx.beginPath();
            ctx.arc(
              data.circle[i].x,
              data.circle[i].y,
              data.circle[i].r,
              0,
              2 * Math.PI
            );
            ctx.stroke();
          }

          for (let i = 0; i < data.curve.length; i++) {
            ctx.beginPath();
            ctx.moveTo(data.curve[i].cp1x, data.curve[i].cp1y);
            ctx.bezierCurveTo(
              data.curve[i].cp1x,
              data.curve[i].cp1y,
              data.curve[i].cp2x,
              data.curve[i].cp2y,
              data.curve[i].x,
              data.curve[i].y
            );
            ctx.stroke();
          }
        });
    }
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
