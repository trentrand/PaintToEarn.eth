import React, { useEffect, useState } from 'react';
import { Box } from "@chakra-ui/react";
import { stark } from "starknet";
import { useStarknet } from "context";
import { Canvas } from "components/canvas";
import { Transactions } from "components/wallet";
import { Toolbar } from "components/layout";

const Home = () => {
  const { connected, library } = useStarknet();

  const [canvasLength, updateCanvasLength] = useState(0);
  const [canvasData, updateCanvasData] = useState([]);

  const [currentPaintColor, setCurrentPaintColor] = useState('#FFFFFF');

  useEffect(() => {
    const getCanvasData = async () => {
      const canvas = await library.callContract({
        contract_address: '0x0305b4e97174ffe80f469b578bdca17f723b4ec2d11dfb516ee86d7a791ac6be',
        entry_point_selector: stark.getSelectorFromName("get_array"),
        calldata: [],
      });
      const canvasLength = parseInt(canvas.result[0], 16);
      const canvasData = canvas.result.splice(1, canvasLength).map(number => parseInt(number, 16));

      updateCanvasLength(canvasLength);
      updateCanvasData(canvasData);
    }
    getCanvasData();
  }, []);

  return (
    <>
      <Box mb={8} w="full" h="full" d="flex" flexDirection="column">
        <Box flex="1 1 auto" display="flex" alignItems="center" justifyContent="center">
          <Canvas
            length={canvasLength}
            value={canvasData}
            currentPaintColor={currentPaintColor}
          />
        </Box>
      </Box>
      <Toolbar onChangeColor={setCurrentPaintColor} />
    </>
  );
};

export default Home;
