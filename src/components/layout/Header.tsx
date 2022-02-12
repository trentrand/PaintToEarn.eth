import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { AiFillGithub } from "react-icons/ai";
import Link from "next/link";

import { ThemeToggle } from "components/layout";
import { WalletConnect } from "components/wallet";

const Header = () => {
  return (
    <Flex as="header" width="full" align="center">
      <Heading as="h1" size="md">
        <Link href="https://github.com/trentrand/PaintToEarn.eth">PaintToEarn.eth</Link>
      </Heading>

      <Box marginLeft="auto">
        <IconButton
          aria-label="theme toggle"
          textDecoration="none !important"
          outline="none !important"
          boxShadow="none !important"
          icon={<AiFillGithub />}
          onClick={() => window.open('https://github.com/trentrand/PaintToEarn.eth')}
          mr={2}
        />
        <ThemeToggle />
        <WalletConnect />
      </Box>
    </Flex>
  );
};

export default Header;
