import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { stark, Contract } from 'starknet';
import { useStarknet } from 'context';
import { Canvas } from 'components/canvas';
import { Toolbar } from 'components/layout';
import { colorMap, reverseColorMap } from '../constants/colorPalette';
import contractAbi from '../../artifacts/abis/contract.json';

// TODO: deploy latest contract revision
const CONTRACT_ADDRESS = '0x039d629ffa38a38c633ad2ba222dca43cfb6424755e91fca3c1f5bd2c5f998c6';

// TODO: implement real data source for constants
const paintCost = 1;
const totalPaintBalance = 3.2;

const Home = () => {
  const { connected, connectBrowserWallet, library } = useStarknet();

  const [canvasLength, updateCanvasLength] = useState(0);
  const [canvasData, setCanvasData] = useState([]);

  const [userModificationsCounter, setUserModificationsCounter] = useState(0);
  const [userCanvasData, setUserCanvasData] = useState([]);

  const [currentPaintColor, setCurrentPaintColor] = useState('#FFFFFF');
  const [currentTool, setCurrentTool] = useState('add');

  const [allowAddTool, setAllowAddTool] = useState(paintCost < totalPaintBalance);

  const canvasContract = useRef();

  useEffect(() => {
    canvasContract.current = new Contract(contractAbi, CONTRACT_ADDRESS);
  });

  const fetchCanvas = React.useCallback(async () => {
    const canvas = await library.callContract({
      contract_address: CONTRACT_ADDRESS,
      entry_point_selector: stark.getSelectorFromName('get_canvas_data'),
      calldata: [],
    });
    const nextCanvasLength = parseInt(canvas.result[0], 16);
    const nextCanvasData = canvas.result.splice(1, nextCanvasLength).map(number => parseInt(number, 16));

    updateCanvasLength(nextCanvasLength);
    setCanvasData(nextCanvasData);

    if (userCanvasData.length === 0) {
      setUserCanvasData(Array(nextCanvasLength).fill(null));
    }
  }, [library]);

  // eager polling of canvas data with leading call on page mount
  React.useEffect(() => {
    fetchCanvas();
    const intervalId = setInterval(() => {
      fetchCanvas();
    }, 30 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchCanvas]);

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

  const handleSave = async () => {
    if (!connected) {
      // TODO: is this ok? should user initiate the action?
      connectBrowserWallet();
    }

    const modifications = userCanvasData.reduce((modifications, pixelData, pixelIndex) => {
      if (pixelData === null) {
        return modifications;
      }
      modifications[pixelIndex] = pixelData;
      return modifications;
    }, {});

    const changedIndexes = Object.keys(modifications).map(x => parseInt(x));
    const changedValues = Object.values(modifications);

    console.log('Saving modifications to canvas', changedIndexes, changedValues, userModificationsCounter);

    // TODO: using Contract class to invoke method doesn't require a signature in wallet -- why?
    const paintCanvasResult = canvasContract.current.invoke('update_canvas_data', {
      indexes: changedIndexes.map(x => String(x)),
      values: changedValues.map(x => String(x)),
      updates: String(userModificationsCounter),
    });

    console.log(paintCanvasResult);
  }

  const compiledCanvasData = userCanvasData.map((userPixelValue, i) => (
    userPixelValue !== null ? colorMap[userPixelValue] : colorMap[canvasData[i]]
  ));

  return (
    <>
      <Box mb={8} width="full" height="full" display="flex" flexDirection="column">
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
        onSave={handleSave}
      />
    </>
  );
};

export default Home;
