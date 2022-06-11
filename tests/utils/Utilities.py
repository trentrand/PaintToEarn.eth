from starkware.starknet.testing.starknet import Starknet
from starkware.starknet.business_logic.state.state import BlockInfo

def uint(a):
  return(a, 0)

def to_uint(a):
    """Takes in value, returns uint256-ish tuple."""
    return (a & ((1 << 128) - 1), a >> 128)

def from_uint(uint):
    """Takes in uint256-ish tuple, returns value."""
    return uint[0] + (uint[1] << 128)

def str_to_felt(text):
  b_text = bytes(text, 'ascii')
  return int.from_bytes(b_text, "big")

def get_block_timestamp(starknet_state):
  return starknet_state.state.block_info.block_timestamp

def set_block_timestamp(starknet_state, timestamp):
  starknet_state.state.block_info = BlockInfo.create_for_testing(
    starknet_state.state.block_info.block_number + 1,
    timestamp
  )
