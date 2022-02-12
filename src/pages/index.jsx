import React, { useEffect, useState } from 'react';
import { Box } from "@chakra-ui/react";
import { stark } from "starknet";
import { useStarknet } from "context";
import { Canvas } from "components/canvas";
import { Transactions } from "components/wallet";
import { Toolbar } from "components/layout";
import colorMap from "../constants/colorPalette";

const Home = () => {
  const { connected, library } = useStarknet();

  const [canvasLength, updateCanvasLength] = useState(0);
  const [canvasData, setCanvasData] = useState(Array(25).fill(colorMap[0]));

  const [currentPaintColor, setCurrentPaintColor] = useState('#FFFFFF');
  const [currentTool, setCurrentTool] = useState('add');

  // TODO: update canvas state when new block has changed canvas data
  useEffect(() => {
    const getCanvasData = async () => {
      const canvas = await library.callContract({
        contract_address: '0x0305b4e97174ffe80f469b578bdca17f723b4ec2d11dfb516ee86d7a791ac6be',
        entry_point_selector: stark.getSelectorFromName("get_array"),
        calldata: [],
      });
      const nextCanvasLength = parseInt(canvas.result[0], 16);
      const nextCanvasData = canvas.result.splice(1, nextCanvasLength).map(number => parseInt(number, 16));

      updateCanvasLength(nextCanvasLength);
      setCanvasData(nextCanvasData);
    }
    getCanvasData();
  }, []);

  const handleChange = (index, paintColor) => {
    setCanvasData(prevCanvasState => {
      const nextCanvasState = [...prevCanvasState];
      nextCanvasState[index] = paintColor;
      return nextCanvasState;
    });
  }

  return (
    <>
      <Box mb={8} w="full" h="full" d="flex" flexDirection="column">
        <Box flex="1 1 auto" display="flex" alignItems="center" justifyContent="center">
          <Canvas
            length={canvasLength}
            value={canvasData}
            currentPaintColor={currentPaintColor}
            currentTool={currentTool}
            onChange={handleChange}
          />
        </Box>
      </Box>
      <Toolbar
        currentTool={currentTool}
        onChangeTool={setCurrentTool}
        onChangeColor={setCurrentPaintColor}
      />
    </>
  );
};

export default Home;
