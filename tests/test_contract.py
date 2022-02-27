import os

import pytest
from starkware.starknet.compiler.compile import compile_starknet_files
from starkware.starknet.testing.starknet import Starknet
from starkware.starknet.testing.contract import StarknetContract
from starkware.starknet.testing.objects import StarknetTransactionExecutionInfo
from starkware.starknet.testing.state import StarknetState

# Contract source
CONTRACT_FILE = os.path.join(os.path.dirname(__file__), "../contracts/contract.cairo")

@pytest.fixture
async def canvasContract() -> StarknetContract:
    contract_definition = compile_starknet_files([CONTRACT_FILE], debug_info=True)
    state = await StarknetState.empty()
    contract_address, execution_info = await state.deploy(
        constructor_calldata=[],
        contract_definition=contract_definition,
    )
    deploy_execution_info = StarknetTransactionExecutionInfo.from_internal(
        tx_execution_info=execution_info, result=(), main_call_events=[]
    )
    assert contract_definition.abi is not None

    return StarknetContract(
        state=state,
        abi=contract_definition.abi,
        contract_address=contract_address,
        deploy_execution_info=deploy_execution_info,
    )

@pytest.mark.asyncio
async def test_update_canvas(canvasContract: StarknetContract):
 """Test update_canvas method."""
 # Create a new Starknet class that simulates the StarkNet system
 starknet = await Starknet.empty()

 # Deploy the canvas contract.

 # Set initial canvas pixels
 await canvasContract.update_canvas(
   indexes=[0,1,2,3,4,24],
   values=[1,2,3,4,5,6],
   updates=6,
 ).invoke()

 execution_info = await canvasContract.get_array().call()
 assert execution_info.result.arr[0] == 1
 assert execution_info.result.arr[1] == 2
 assert execution_info.result.arr[2] == 3
 assert execution_info.result.arr[3] == 4
 assert execution_info.result.arr[4] == 5
 assert execution_info.result.arr[24] == 6

 # Overwrite existing canvas pixel values
 await canvasContract.update_canvas(
   indexes=[0,5,23],
   values=[7,7,7],
   updates=3
 ).invoke()

 execution_info = await canvasContract.get_array().call()
 assert execution_info.result.arr[0] == 7
 assert execution_info.result.arr[1] == 2
 assert execution_info.result.arr[2] == 3
 assert execution_info.result.arr[3] == 4
 assert execution_info.result.arr[4] == 5
 assert execution_info.result.arr[5] == 7
 assert execution_info.result.arr[23] == 7

 # Check the result state
 execution_info = await canvasContract.get_array().call()
 print(execution_info.result.arr)
