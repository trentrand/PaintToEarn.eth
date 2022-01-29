import React, { useRef, useEffect } from "react";
import { Text } from "@chakra-ui/react";

const ROW_LENGTH = 5;
const PIXEL_SIZE = 50;

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
        (index % ROW_LENGTH) * PIXEL_SIZE,
        Math.floor(index / ROW_LENGTH) * PIXEL_SIZE,
        PIXEL_SIZE,
        PIXEL_SIZE
      );
    });
  }

  useEffect(() => {
    if (value?.length === 0) {
      return;
    }

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    draw(context, value)
  }, [draw, value])

  if (value?.length === 0) {
    return (
       <Text>Could not fetch canvas data</Text>
    );
  }
  
  return (
    <canvas
      ref={canvasRef}
      width={ROW_LENGTH * PIXEL_SIZE}
      height={ROW_LENGTH * PIXEL_SIZE}
      {...props}
    />
  );
}

export default Canvas;
