import React, { useEffect, useState } from 'react';
import { Box } from "@chakra-ui/react";

import SomeText from "components/samples/SomeText";
import { MintTokens, Transactions } from "components/wallet";
import { useStarknet } from "context";
import { Canvas } from "components/canvas";

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
      <SomeText />
      <Box flex="1 1 auto">
        <Canvas value={canvasData} />
        <Transactions />
      </Box>
    </Box>
  );
};

export default Home;
