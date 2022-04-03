import { Box, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";

const PIXEL_SIZE = 50;

function getMousePos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

const Canvas = ({
  length,
  value,
  onChange,
  currentPaintColor,
  currentTool,
  allowAddTool,
  ...props
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const gridCanvasRef = useRef(null);
  const gridContextRef = useRef(null);

  const [isMouseDown, setIsMouseDown] = useState(false);

  // TODO: separate row/column for better aspect ratio than 1:1?
  const rowLength = Math.sqrt(length);

  useEffect(() => {
    if (gridContextRef.current && !allowAddTool && currentTool === "add") {
      gridCanvasRef.current.style.cursor = "not-allowed";
    } else if (gridContextRef.current) {
      gridCanvasRef.current.style.cursor = "pointer";
    }
  }, [allowAddTool, currentTool]);

  useEffect(() => {
    value.forEach((pixel, index) => {
      contextRef.current.fillStyle = pixel;
      contextRef.current.fillRect(
        (index % rowLength) * PIXEL_SIZE,
        Math.floor(index / rowLength) * PIXEL_SIZE,
        PIXEL_SIZE,
        PIXEL_SIZE
      );
    });
  }, [value, rowLength]);

  function draw(e, cellSize) {
    if (currentTool === "add" && !allowAddTool) {
      return;
    }

    const mousePosition = getMousePos(canvasRef.current, e);
    const cellPositionX = Math.floor(mousePosition.x / cellSize);
    const cellPositionY = Math.floor(mousePosition.y / cellSize);

    contextRef.current.fillStyle = currentPaintColor;
    if (currentTool === "add") {
      contextRef.current.fillRect(
        cellPositionX * cellSize,
        cellPositionY * cellSize,
        cellSize,
        cellSize
      );
    } else if (currentTool === "remove") {
      contextRef.current.clearRect(
        cellPositionX * cellSize,
        cellPositionY * cellSize,
        cellSize,
        cellSize
      );
    }

    onChange(
      cellPositionX + cellPositionY * rowLength,
      currentPaintColor,
      currentTool
    );
  }

  function drawGrid(rows, columns, cellSize) {
    const canvasEl = gridContextRef.current.canvas;
    gridContextRef.current.clearRect(0, 0, canvasEl.width, canvasEl.height);
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < columns; y++) {
        gridContextRef.current.strokeStyle = "gray";
        gridContextRef.current.lineWidth = 0.1;
        gridContextRef.current.strokeRect(
          x * cellSize,
          y * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }

  const drawCanvas = (e) => {
    if (isMouseDown === true) {
      draw(e, PIXEL_SIZE);
    }
  };

  const mouseDown = (e) => {
    setIsMouseDown(true);
    drawCanvas(e);
  };

  const mouseUp = (e) => {
    setIsMouseDown(false);
    drawCanvas(e);
  };

  useEffect(() => {
    if (length === 0) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;

    const gridCanvas = gridCanvasRef.current;
    const gridContext = gridCanvas.getContext("2d");
    gridContextRef.current = gridContext;
    drawGrid(rowLength, rowLength, PIXEL_SIZE);
  }, [length, rowLength]);

  if (length === 0) {
    return <Text>Fetching canvas data</Text>;
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
        style={{ position: "absolute", top: "0", left: "0" }}
        {...props}
      />
      <canvas
        ref={gridCanvasRef}
        width={rowLength * PIXEL_SIZE}
        height={rowLength * PIXEL_SIZE}
        onMouseMove={(e) => drawCanvas(e)}
        onMouseDown={(e) => mouseDown(e)}
        onMouseUp={(e) => mouseUp(e)}
        style={{ position: "absolute", top: "0", left: "0" }}
      />
    </Box>
  );
};

Canvas.propTypes = {
  length: PropTypes.number.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      pixel: PropTypes.string, // e.g. #ffaa00
      index: PropTypes.number,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  currentPaintColor: PropTypes.string.isRequired,
  currentTool: PropTypes.oneOf(["add", "remove"]).isRequired,
  allowAddTool: PropTypes.bool.isRequired,
};

export default Canvas;
