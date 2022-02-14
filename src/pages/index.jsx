import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { stark } from 'starknet';
import { useStarknet } from 'context';
import { Canvas } from 'components/canvas';
import { Toolbar } from 'components/layout';
import { colorMap, reverseColorMap } from '../constants/colorPalette';

const paintCost = 1;
const totalPaintBalance = 3.2;

const Home = () => {
  const { connected, library } = useStarknet();

  const [canvasLength, updateCanvasLength] = useState(0);
  const [canvasData, setCanvasData] = useState([]);

  const [userModificationsCounter, setUserModificationsCounter] = useState(0);
  const [userCanvasData, setUserCanvasData] = useState([]);

  const [currentPaintColor, setCurrentPaintColor] = useState('#FFFFFF');
  const [currentTool, setCurrentTool] = useState('add');

  const [allowAddTool, setAllowAddTool] = useState(paintCost < totalPaintBalance);

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
      setUserCanvasData(Array(nextCanvasLength).fill(null));
    }
    getCanvasData();
  }, []);

  const handleChange = (index, paintColor, tool) => {
    setUserCanvasData(prevCanvasState => {
      const nextCanvasState = [...prevCanvasState];
      if (tool === 'add') {
        nextCanvasState[index] = reverseColorMap[paintColor];
      } else if (tool === 'remove') {
        nextCanvasState[index] = null;
      }
      setUserModificationsCounter(userCanvasData.filter(modification => modification !== null).length);
      setAllowAddTool(((userModificationsCounter * paintCost) + paintCost) < totalPaintBalance);

      return nextCanvasState;
    });
  }

  const compiledCanvasData = userCanvasData.map((userPixelValue, i) => (
    userPixelValue !== null ? colorMap[userPixelValue] : colorMap[canvasData[i]]
  ));

  return (
    <>
      <Box mb={8} w="full" h="full" d="flex" flexDirection="column">
        <Box flex="1 1 auto" display="flex" alignItems="center" justifyContent="center">
          <Canvas
            length={canvasLength}
            value={compiledCanvasData}
            currentPaintColor={currentPaintColor}
            currentTool={currentTool}
            onChange={handleChange}
            allowAddTool={allowAddTool}
          />
        </Box>
      </Box>
      <Toolbar
        currentTool={currentTool}
        modificationsCounter={userModificationsCounter}
        onChangeTool={setCurrentTool}
        onChangeColor={setCurrentPaintColor}
      />
    </>
  );
};

export default Home;
