import { Flex, Button } from "@chakra-ui/react";
import { AiFillGithub } from "react-icons/ai";

const Footer = () => {
  return (
    <Flex as="footer" width="full" align="center" justifyContent="flex-end">
      <Button
        as="a"
        href="https://github.com/trentrand/PaintToEarn.eth"
        target="_blank"
        leftIcon={<AiFillGithub />}
        size="xs"
      >
        Contribute on GitHub
      </Button>
    </Flex>
  );
};

export default Footer;
