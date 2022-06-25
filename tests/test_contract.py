import os
import pytest
import asyncio
from starkware.starknet.testing.starknet import Starknet
from starkware.starknet.testing.contract import StarknetContract
from starkware.starkware_utils.error_handling import StarkException
from utils.Utilities import (uint, from_uint, str_to_felt, set_block_timestamp)
from utils.Signer import Signer

mockSigner = Signer(123456789987654321)

SECOND = 1
MINUTE = 60 * SECOND
HOUR = 60 * MINUTE
DAY = 24 * HOUR

@pytest.fixture(scope='module')
def event_loop():
    return asyncio.new_event_loop()

@pytest.fixture(scope='module')
async def get_starknet():
  starknet = await Starknet.empty()
  return starknet

# Contract fixture factories
ACCOUNT_CONTRACT_FILE= os.path.join(os.path.dirname(__file__), "../openzeppelin/account/Account.cairo")

@pytest.fixture
async def account_factory(get_starknet):
  starknet = get_starknet
  account = await starknet.deploy(
    source=ACCOUNT_CONTRACT_FILE,
    constructor_calldata=[mockSigner.public_key]
  )

  return account

CONTRACT_FILE = os.path.join(os.path.dirname(__file__), "../contracts/contract.cairo")

@pytest.fixture
async def canvas_factory(get_starknet) -> StarknetContract:
  starknet = get_starknet

  return await starknet.deploy(
    source=CONTRACT_FILE,
    constructor_calldata=[]
  )

TOKEN_CONTRACT_FILE = os.path.join(os.path.dirname(__file__), "../openzeppelin/token/erc20/ERC20_Mintable.cairo")

@pytest.fixture
async def token_factory(get_starknet, canvas_factory):
  starknet = get_starknet
  canvas = canvas_factory

  return await starknet.deploy(
    source=TOKEN_CONTRACT_FILE,
    constructor_calldata=[
      str_to_felt("Paint"),
      str_to_felt("PAINT"),
      *uint(1000), # initial_supply
      canvas.contract_address, # recipient
      canvas.contract_address # owner
    ]
  )

@pytest.mark.asyncio
async def test_update_canvas(get_starknet, account_factory, canvas_factory, token_factory):

  starknet = get_starknet
  account = account_factory
  canvas = canvas_factory
  token = token_factory

  execution_info = await canvas.get_canvas_data().call()
  print("\nCanvas state", execution_info.result.arr)

  execution_info = await token.totalSupply().call()
  assert from_uint(execution_info.result.totalSupply) == 1000
  print("Total token supply: ", from_uint(execution_info.result.totalSupply))

  # Set reference to $PAINT token contract
  await canvas.update_token_contract_address(
    contract_address=token.contract_address,
  ).invoke(caller_address=account.contract_address)

  get_token_contract_address_execution_info = await canvas.get_token_contract_address().call()

  assert get_token_contract_address_execution_info.result.contract_address == token.contract_address

  print("Canvas contract address", canvas.contract_address)
  print("Token contract address", token.contract_address)

  execution_info = await canvas.get_last_user_activity(account=account.contract_address).call()
  assert execution_info.result.last_activity_timestamp == 0
  print("User has not played before")

  # Simulate the beginning of time
  set_block_timestamp(starknet.state, 31 * SECOND)

  # Set initial canvas pixels
  await canvas.update_canvas_data(
    indexes=[0,1,2,3,4,24],
    values=[1,2,3,4,5,6],
    updates=6,
  ).invoke(caller_address=account.contract_address)

  execution_info = await canvas.get_canvas_data().call()
  assert execution_info.result.arr[0] == 1
  assert execution_info.result.arr[1] == 2
  assert execution_info.result.arr[2] == 3
  assert execution_info.result.arr[3] == 4
  assert execution_info.result.arr[4] == 5
  assert execution_info.result.arr[24] == 6

  execution_info_timestamps = await canvas.get_canvas_timestamps().call()
  assert execution_info_timestamps.result.arr[0] == 31 * SECOND
  assert execution_info_timestamps.result.arr[1] == 31 * SECOND
  assert execution_info_timestamps.result.arr[2] == 31 * SECOND
  assert execution_info_timestamps.result.arr[3] == 31 * SECOND
  assert execution_info_timestamps.result.arr[4] == 31 * SECOND
  assert execution_info_timestamps.result.arr[24] == 31 * SECOND

  print("Updated canvas state", execution_info.result.arr)
  print("with new timestamps", execution_info_timestamps.result.arr)

  execution_info = await canvas.get_token_balance_for_user(account=account.contract_address).call()
  assert from_uint(execution_info.result.balance) == 6
  print("Current account balance", from_uint(execution_info.result.balance))

  execution_info = await canvas.get_last_user_activity(account=account.contract_address).call()
  assert execution_info.result.last_activity_timestamp != 0
  print("User has played")

  print("Simulate 30 second wait")
  set_block_timestamp(starknet.state, 1 * MINUTE + 1 * SECOND)

  # Overwrite existing canvas pixel values
  execution_info = await canvas.update_canvas_data(
    indexes=[0,5,23],
    values=[7,7,7],
    updates=3
  ).invoke(caller_address=account.contract_address)

  # Check the result state
  execution_info = await canvas.get_canvas_data().call()
  assert execution_info.result.arr[0] == 7
  assert execution_info.result.arr[1] == 2
  assert execution_info.result.arr[2] == 3
  assert execution_info.result.arr[3] == 4
  assert execution_info.result.arr[4] == 5
  assert execution_info.result.arr[5] == 7
  assert execution_info.result.arr[23] == 7
  print("Updated canvas state", execution_info.result.arr)

  execution_info = await canvas.get_token_balance_for_user(account=account.contract_address).call()
  assert from_uint(execution_info.result.balance) == 9
  print("Current account Balance", from_uint(execution_info.result.balance))

  execution_info = await canvas.get_last_user_activity(account=account.contract_address).call()
  assert execution_info.result.last_activity_timestamp != 0
  print("User has played")

  # Ensure play fails if user doesn't wait
  with pytest.raises(StarkException, match="assert can_play = 1"):
    await canvas.update_canvas_data(
      indexes=[0],
      values=[0],
      updates=1
    ).invoke(caller_address=account.contract_address)
  print("Update canvas data failed as expected (requires 30 second wait)")
