import React  from 'react';
import { Flex, Box, Text, IconButton, useColorModeValue } from '@chakra-ui/react';
import { RiBrushFill, RiBrushLine, RiEraserFill, RiEraserLine } from 'react-icons/ri';
import { HiOutlineSaveAs } from 'react-icons/hi';
import { ColorPicker } from 'chakra-color-picker';
import { colorMap } from '../../constants/colorPalette';

const colors = Object.values(colorMap);

const Toolbar = ({ onSave, onChangeColor, onChangeTool, currentTool, modificationsCounter, children }) => {
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
          paddingX="5px"
          paddingY={1}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="6px"
        >
          <IconButton
            aria-label="eraser mode"
            textDecoration="none !important"
            outline="none !important"
            boxShadow="none !important"
            isActive={currentTool === 'remove'}
            icon={currentTool === 'remove' ? <RiEraserFill /> : <RiEraserLine />}
            onClick={() => onChangeTool('remove')}
          />
          <IconButton
            aria-label="paint mode"
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
          <IconButton
            aria-label="save modifications"
            textDecoration="none !important"
            outline="none !important"
            boxShadow="none !important"
            isDisabled={modificationsCounter === 0}
            icon={<HiOutlineSaveAs />}
            onClick={() => onSave()}
          />
        </Flex>
      </Box>
    </>
  );
}

export default Toolbar;
