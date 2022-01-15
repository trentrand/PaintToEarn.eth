import { Box } from "@chakra-ui/react";

import SomeText from "components/samples/SomeText";
import { MintTokens, Transactions } from "components/wallet";

const Home = () => {
  return (
    <Box mb={8} w="full" h="full" d="flex" flexDirection="column">
      <SomeText />
      <Box flex="1 1 auto">
        <Transactions />
      </Box>
    </Box>
  );
};

export default Home;
