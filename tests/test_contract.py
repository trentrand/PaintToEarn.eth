import os

import pytest
from starkware.starknet.testing.starknet import Starknet

CONTRACT_FILE = os.path.join("contracts", "contract.cairo")

@pytest.mark.asyncio
async def test_update_canvas():
 """Test update_canvas method."""
 # Create a new Starknet class that simulates the StarkNet system
 starknet = await Starknet.empty()

 # Deploy the contract.
 contract = await starknet.deploy(
   source=CONTRACT_FILE,
 )

 # Set initial canvas pixels
 await contract.update_canvas(
   indexes=[0,1,2,3,4,24],
   values=[1,2,3,4,5,6],
   updates=6
 ).invoke()

 execution_info = await contract.get_array().call()
 assert execution_info.result.arr[0] == 1
 assert execution_info.result.arr[1] == 2
 assert execution_info.result.arr[2] == 3
 assert execution_info.result.arr[3] == 4
 assert execution_info.result.arr[4] == 5
 assert execution_info.result.arr[24] == 6

 # Overwrite existing canvas pixel values
 await contract.update_canvas(
   indexes=[0,5,23],
   values=[7,7,7],
   updates=3
 ).invoke()

 execution_info = await contract.get_array().call()
 assert execution_info.result.arr[0] == 7
 assert execution_info.result.arr[1] == 2
 assert execution_info.result.arr[2] == 3
 assert execution_info.result.arr[3] == 4
 assert execution_info.result.arr[4] == 5
 assert execution_info.result.arr[5] == 7
 assert execution_info.result.arr[23] == 7

 # Check the result state
 execution_info = await contract.get_array().call()
 print(execution_info.result.arr)
