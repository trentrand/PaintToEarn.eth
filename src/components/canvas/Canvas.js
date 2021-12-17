import React, { useRef, useEffect } from "react";
import { Text } from "@chakra-ui/react";

const GRID_SIZE = 10;

const colorMap = {
  0: '#000000', // black
  1: '#FFFFFF', // white
  2: '#FF0000', // red
  3: '#00FF00', // green
  4: '#0000FF', // blue
};

const Canvas = ({ value, ...props }) => {
  const canvasRef = useRef(null)

  const draw = ctx => {
    value.map((pixel, index) => {
      ctx.fillStyle = colorMap[pixel];
      ctx.fillRect(
        (index % 10) * 10,
        Math.floor(index / 10) * GRID_SIZE,
        GRID_SIZE,
        GRID_SIZE
      );
    });
  }

  useEffect(() => {
    if (typeof value !== 'array') {
      return;
    }

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    draw(context, value)
  }, [draw, value])

  if (typeof value !== 'array') {
    return (
       <Text>Could not fetch canvas data</Text>
    );
  }
  
  return (
    <canvas
      ref={canvasRef}
      width={10 * GRID_SIZE}
      height={10 * GRID_SIZE}
      {...props}
    />
  );
}

export default Canvas;
