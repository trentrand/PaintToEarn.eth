import os

import pytest
from starkware.starknet.testing.starknet import Starknet

# The path to the contract source code.
CONTRACT_FILE = os.path.join("contracts", "contract.cairo")


# The testing library uses python's asyncio. So the following
# decorator and the ``async`` keyword are needed.
@pytest.mark.asyncio
async def test_update_canvas():
    """Test update_canvas method."""
    # Create a new Starknet class that simulates the StarkNet
    # system.
    starknet = await Starknet.empty()

    # Deploy the contract.
    contract = await starknet.deploy(
        source=CONTRACT_FILE,
    )

    # Invoke increase_balance() twice.
    await contract.update_canvas(pixelIndex=0, pixelData=1).invoke()
    await contract.update_canvas(pixelIndex=1, pixelData=2).invoke()
    await contract.update_canvas(pixelIndex=2, pixelData=3).invoke()
    await contract.update_canvas(pixelIndex=3, pixelData=4).invoke()
    await contract.update_canvas(pixelIndex=4, pixelData=5).invoke()
    await contract.update_canvas(pixelIndex=24, pixelData=5).invoke()

    # Check the result of get_balance().
    execution_info = await contract.get_array().call()
    print(execution_info.result.arr)
