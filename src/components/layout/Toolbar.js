import React, { useRef, useState, useEffect } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { RiBrushFill, RiBrushLine, RiEraserFill, RiEraserLine } from "react-icons/ri";
import { ColorPicker } from "chakra-color-picker";
import colorPalette from "../../constants/colorPalette";

const colors = Object.values(colorPalette);

const Toolbar = ({ onChangeColor, onChangeTool, currentTool, children }) => {
  return (
    <Flex
      border="gray.50"
      background="gray.100"
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
      <ColorPicker bg="gray.200" borderWidth="1px" onChange={onChangeColor} colors={colors} placement="right-end" />
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
