import { Button, ButtonGroup, Text } from "@chakra-ui/react";
import { useEffect } from "react";

import { useStarknet } from "context";

const WalletConnect = () => {
  const {
    account,
    connected,
    setConnected,
    connectBrowserWallet,
    checkMissingWallet,
  } = useStarknet();

  useEffect(() => {
    checkMissingWallet();
  }, [checkMissingWallet]);

  useEffect(() => {
    if (account && account.length > 0) {
      setConnected(true);
    }
  }, [account, setConnected, connected]);

  return !connected ? (
    <Button
      ml="4"
      textDecoration="none !important"
      outline="none !important"
      boxShadow="none !important"
      onClick={() => {
        connectBrowserWallet();
      }}
    >
      Connect Wallet
    </Button>
  ) : (
    <ButtonGroup ml="4" isAttached variant="outline">
      <Button
        textDecoration="none !important"
        outline="none !important"
        boxShadow="none !important"
      >
        {/* TODO: mock tokens with localstorage balance */}
        <Text fontSize="md">3.2</Text>
        <Text fontSize="xs" color="gray.500" ml={1}>
          PAINT
        </Text>
      </Button>
      <Button
        textDecoration="none !important"
        outline="none !important"
        boxShadow="none !important"
        onClick={() => {
          setConnected(false);
        }}
      >
        {account
          ? `${account.substring(0, 4)}...${account.substring(
              account.length - 4
            )}`
          : "No Account"}
      </Button>
    </ButtonGroup>
  );
};

export default WalletConnect;
