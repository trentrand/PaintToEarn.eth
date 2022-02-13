import React  from 'react';
import { Flex, Box, IconButton, useColorModeValue } from '@chakra-ui/react';
import { RiBrushFill, RiBrushLine, RiEraserFill, RiEraserLine } from 'react-icons/ri';
import { ColorPicker } from 'chakra-color-picker';
import { colorMap } from '../../constants/colorPalette';

const colors = Object.values(colorMap);

const Toolbar = ({ onChangeColor, onChangeTool, currentTool, children }) => {
  const backgroundColor = useColorModeValue('gray.100', 'whiteAlpha.200')
  const popoverBackgroundColor = useColorModeValue('gray.200', 'whiteAlpha.300')

  return (
    <Flex
      border="gray.50"
      background={backgroundColor}
      borderWidth="1px"
      borderStyle="solid"
      borderRadius="50px"
      position="absolute"
      left="10px"
      top="50%"
      paddingY={1}
      paddingX="5px"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      transform="translate(0, -50%)"
      gap="6px"
    >
      <ColorPicker bg={popoverBackgroundColor} borderWidth="1px" onChange={onChangeColor} colors={colors} placement="right-end" />
      <IconButton
        aria-label="theme toggle"
        textDecoration="none !important"
        outline="none !important"
        boxShadow="none !important"
        isActive={currentTool === 'add'}
        icon={currentTool === 'add' ? <RiBrushFill /> : <RiBrushLine />}
        onClick={() => onChangeTool('add')}
      />
      <IconButton
        aria-label="theme toggle"
        textDecoration="none !important"
        outline="none !important"
        boxShadow="none !important"
        isActive={currentTool === 'remove'}
        icon={currentTool === 'remove' ? <RiEraserFill /> : <RiEraserLine />}
        onClick={() => onChangeTool('remove')}
      />
    </Flex>
  );
}

export default Toolbar;
