pragma solidity >=0.6.0 <0.9.0;
// SPDX-License-Identifier: MIT

import 'hardhat/console.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Canvas is Ownable {
  uint32 constant canvasSize = 100;
  uint32[canvasSize] canvasPixels;

  event CanvasUpdated(uint32[canvasSize] nextCanvas);

  constructor() public {
    canvasPixels = [
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0
    ];
  }

  function updateCanvas(uint32[100] calldata updatedCanvasPixels) external payable {
    uint32[canvasSize] storage nextCanvasPixels = canvasPixels;
    for (uint32 i = 0; i < canvasSize; i++) {
      if (updatedCanvasPixels[i] != 0x0) {
        nextCanvasPixels[i] = updatedCanvasPixels[i];
      }
    }
    canvasPixels = nextCanvasPixels;
    emit CanvasUpdated(nextCanvasPixels);
  }

  function getCanvas() internal view returns(uint32[canvasSize] storage) {
    return canvasPixels;
  }
}