import React  from 'react';
import { Flex, Box, Text, IconButton, useColorModeValue } from '@chakra-ui/react';
import { RiBrushFill, RiBrushLine, RiEraserFill, RiEraserLine } from 'react-icons/ri';
import { ColorPicker } from 'chakra-color-picker';
import { colorMap } from '../../constants/colorPalette';

const colors = Object.values(colorMap);

const Toolbar = ({ onChangeColor, onChangeTool, currentTool, modificationsCounter, children }) => {
  const backgroundColor = useColorModeValue('gray.100', 'whiteAlpha.200')
  const popoverBackgroundColor = useColorModeValue('gray.200', 'whiteAlpha.300')

  return (
    <>
      <Box
        position="absolute"
        left="10px"
        top="calc(50% - 31px)"
      >
        <Flex
          border="gray.50"
          background={backgroundColor}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius="50px"
                    paddingY={1}
          paddingX="5px"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="6px"
        >
          <IconButton
            aria-label="theme toggle"
            textDecoration="none !important"
            outline="none !important"
            boxShadow="none !important"
            isActive={currentTool === 'remove'}
            icon={currentTool === 'remove' ? <RiEraserFill /> : <RiEraserLine />}
            onClick={() => onChangeTool('remove')}
          />
          <IconButton
            aria-label="theme toggle"
            textDecoration="none !important"
            outline="none !important"
            boxShadow="none !important"
            isActive={currentTool === 'add'}
            icon={currentTool === 'add' ? <RiBrushFill /> : <RiBrushLine />}
            onClick={() => onChangeTool('add')}
          />
          {currentTool === 'add' ? (
            <Box position="relative" height="50px" width="50px">
              <ColorPicker bg={popoverBackgroundColor} borderWidth="1px" onChange={onChangeColor} colors={colors} placement="right-end" />
              <Text as="a" pointerEvents="none" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">{modificationsCounter}</Text>
            </Box>
          ) : null}
        </Flex>
      </Box>
    </>
  );
}

export default Toolbar;
