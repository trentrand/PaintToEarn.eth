import React, { useRef, useEffect } from "react";
import { Text } from "@chakra-ui/react";

const PIXEL_SIZE = 50;

const colorMap = {
  0: '#000000', // black
  1: '#FFFFFF', // white
  2: '#FF0000', // red
  3: '#00FF00', // green
  4: '#0000FF', // blue
};

const Canvas = ({ length, value, ...props }) => {
  const canvasRef = useRef(null);
  const rowLength = Math.sqrt(length);

  const draw = ctx => {
    value.map((pixel, index) => {
      ctx.fillStyle = colorMap[pixel];
      ctx.fillRect(
        (index % rowLength) * PIXEL_SIZE,
        Math.floor(index / rowLength) * PIXEL_SIZE,
        PIXEL_SIZE,
        PIXEL_SIZE
      );
    });
  }

  useEffect(() => {
    if (length === 0) {
      return;
    }

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    draw(context, value)
  }, [draw, value])

  if (length === 0) {
    return (
       <Text>Fetching canvas data</Text>
    );
  }
  
  return (
    <canvas
      ref={canvasRef}
      width={rowLength * PIXEL_SIZE}
      height={rowLength * PIXEL_SIZE}
      {...props}
    />
  );
}

export default Canvas;
