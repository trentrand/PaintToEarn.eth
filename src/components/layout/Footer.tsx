import { Flex, Link, Text, Button, Image } from "@chakra-ui/react";
import { AiFillGithub } from "react-icons/ai";

const Footer = () => {
  return (
    <Flex as="footer" width="full" align="center">
      <Flex justifyContent="center" alignItems="center" gridGap={2}>
        <Button
          as="a"
          href="https://github.com/trentrand/starknet-canvas"
          target="_blank"
          leftIcon={<AiFillGithub />}
          size="sm"
        >
          Contribute on GitHub
        </Button>
        <Button
          as="a"
          href={"https://github.com/abigger87/cairopal"}
          target="_blank"
          size="sm"
          variant="link"
        >
          Made with cairopal
        </Button>
      </Flex>
    </Flex>
  );
};

export default Footer;
