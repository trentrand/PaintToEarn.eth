import React, { useEffect, useState } from 'react';
import { Box, Text, useBreakpointValue, useColorMode } from "@chakra-ui/react";

import { useStarknet, useTransactions } from "context";

const Transactions = () => {
  const { transactions } = useTransactions();
  const { connected, library } = useStarknet();
  const { colorMode } = useColorMode();
  const textSize = useBreakpointValue({
    base: "xs",
    sm: "md",
  });

  const [canvasData, updateCanvasData] = useState();
  useEffect(() => {
    const getCanvasData = async () => {
      const response = await library.getStorageAt(
        '0x01f9f1b21b221d3ca767ef7fe547ffe1534f760a3517d81b170465d6b7ace4a5',
         // TODO: create util for `from_(bytes(keccak('canvasData')) & MASK_250) % ADDR_BOUND`
        '653665509287836679643972930765385092459909853369440396405538230152462745086'
      ); // e.g. 0x0
      updateCanvasData(Number(response));
    }
    getCanvasData();
  }, []);

  return (
    <Box>
      <Text as="h2" marginTop={4} fontSize="2xl">
        Transactions
      </Text>
      {canvasData}
      {connected &&
        transactions !== undefined &&
        transactions.length > 0 &&
        transactions.map((tx) => {
          return (
            <Box
              backgroundColor={colorMode === "light" ? "gray.200" : "gray.500"}
              padding={4}
              marginTop={4}
              borderRadius={4}
            >
              <Box fontSize={textSize}>{tx}</Box>
            </Box>
          );
        })}
      {connected && (transactions === undefined || transactions.length === 0) && (
        <Box
          backgroundColor={colorMode === "light" ? "gray.200" : "gray.500"}
          padding={4}
          marginTop={4}
          borderRadius={4}
        >
          <Box fontSize={textSize}>No Transactions</Box>
        </Box>
      )}
      {!connected && (
        <Box
          backgroundColor={colorMode === "light" ? "gray.200" : "gray.500"}
          padding={4}
          marginTop={4}
          borderRadius={4}
        >
          <Box fontSize={textSize}>
            Connect your wallet to view a list of your transactions.
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Transactions;
