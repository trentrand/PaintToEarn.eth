import React, { useRef, useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import colorMap from "../../constants/colorPalette"

const PIXEL_SIZE = 50;

function getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

const Canvas = ({ length, value, currentPaintColor, currentTool, ...props }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null)

  const gridCanvasRef = useRef(null);
  const gridContextRef = useRef(null)

  const [isMouseDown, setIsMouseDown] = useState(false);

  // TODO: separate row/column for better aspect ratio than 1:1?
  const rowLength = Math.sqrt(length);

  useEffect(() => {
    if (length === 0) {
      return;
    }
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    contextRef.current = context;

    // TODO: draw existing canvas data
    // drawCanvasState();

    const gridCanvas = gridCanvasRef.current
    const gridContext = gridCanvas.getContext('2d')
    gridContextRef.current = gridContext;
    drawGrid(rowLength, rowLength, PIXEL_SIZE);
  }, [length])

  // TODO: draw existing canvas when app loads and when new block has updated canvas
  // function drawCanvasState() {
    // state.map((pixel, index) => {
    //   ctx.fillStyle = colorMap[pixel];
    //   ctx.fillRect(
    //     (index % rowLength) * PIXEL_SIZE,
    //     Math.floor(index / rowLength) * PIXEL_SIZE,
    //     PIXEL_SIZE,
    //     PIXEL_SIZE
    //   );
    // });
  // }

  function draw(e, rows, columns, cellSize) {
    let mousePosition = getMousePos(canvasRef.current, e);
    const positionX = Math.floor(mousePosition.x / cellSize) * cellSize;
    const positionY = Math.floor(mousePosition.y / cellSize) * cellSize;
    contextRef.current.fillStyle = currentPaintColor; // TODO: colorMap[<pixelColorData>]
    if (currentTool === 'add') {
      contextRef.current.fillRect(positionX, positionY, cellSize, cellSize);
    } else if (currentTool === 'remove'){
      contextRef.current.clearRect(positionX, positionY, cellSize, cellSize);
    }
  }

  function drawGrid(rows, columns, cellSize) {
    const canvasEl = gridContextRef.current.canvas;
    gridContextRef.current.clearRect(0, 0, canvasEl.width, canvasEl.height);
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < columns; y++) {
        gridContextRef.current.strokeStyle = "gray";
        gridContextRef.current.lineWidth = 0.1;
        gridContextRef.current.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  const mouseDown = (e) => {
    setIsMouseDown(true);
    drawCanvas(e)
  }

  const mouseUp = (e) => {
    setIsMouseDown(false);
    drawCanvas(e)
  }

  const drawCanvas = (e) => {
    if (isMouseDown === true){
      draw(e, rowLength, rowLength, PIXEL_SIZE);
    }
  }

  if (length === 0) {
    return (
      <Text>Fetching canvas data</Text>
    );
  }

  return (
    <Box
      position="relative"
      width={rowLength * PIXEL_SIZE}
      height={rowLength * PIXEL_SIZE}
    >
      <canvas
        ref={canvasRef}
        width={rowLength * PIXEL_SIZE}
        height={rowLength * PIXEL_SIZE}
        onMouseMove={(e) => drawCanvas(e)}
        onMouseDown={(e) => mouseDown(e)}
        onMouseUp={(e) => mouseUp(e)}
        style={{ position: 'absolute', top: '0', left: '0' }}
        {...props}
      />
      <canvas
        ref={gridCanvasRef}
        width={rowLength * PIXEL_SIZE}
        height={rowLength * PIXEL_SIZE}
        onMouseMove={(e) => drawCanvas(e)}
        onMouseDown={(e) => mouseDown(e)}
        onMouseUp={(e) => mouseUp(e)}
        style={{ position: 'absolute', top: '0', left: '0' }}
      />
    </Box>
  );
}

export default Canvas;
