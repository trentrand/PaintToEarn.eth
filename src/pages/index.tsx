import React, { useEffect, useState } from 'react';
import { Box } from "@chakra-ui/react";
import { useStarknet } from "context";
import { Canvas } from "components/canvas";
import { Transactions } from "components/wallet";

const Home = () => {
  const { connected, library } = useStarknet();

  const [canvasData, updateCanvasData] = useState();
  useEffect(() => {
    const getCanvasData = async () => {
      const response = await library.getStorageAt(
        '0x00fd9cd81612d1e8b32a40f217bcd7a947b36f143dd96700ae1226122b1c2cb7',
         // TODO: create util for `from_(bytes(keccak('canvasData')) & MASK_250) % ADDR_BOUND`
        '1684464463832855853928619972158079927141424324047522736714930898785516187524'
      ); // e.g. 0x0
      updateCanvasData(response);
    }
    getCanvasData();
  }, []);

  return (
    <Box mb={8} w="full" h="full" d="flex" flexDirection="column">
      <Box flex="1 1 auto" display="flex" alignItems="center" justifyContent="center">
        <Canvas
          value={[
            3, 2, 1, 2, 3,
            4, 3, 2, 3, 4,
            2, 1, 0, 1, 2,
            1, 0, 0, 0, 1,
            3, 3, 3, 3, 3,
          ]}
        />
      </Box>
      <Transactions />
    </Box>
  );
};

export default Home;
