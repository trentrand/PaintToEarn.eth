%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import assert_le
from starkware.cairo.common.math_cmp import is_le
from starkware.cairo.common.uint256 import (
  Uint256,
  uint256_le
)
from starkware.starknet.common.syscalls import (
    get_caller_address,
    get_contract_address,
    get_block_timestamp,
)
from openzeppelin.token.erc20.library import (
    ERC20_name,
    ERC20_symbol,
    ERC20_totalSupply,
    ERC20_decimals,
    ERC20_balanceOf,
    ERC20_allowance,

    ERC20_initializer,
    ERC20_approve,
    ERC20_increaseAllowance,
    ERC20_decreaseAllowance,
    ERC20_transfer,
    ERC20_transferFrom,
    ERC20_mint,
)

struct PixelEnum:
    member data: felt
    member timestamp: felt
    member last_updated_by: felt
end

const INITIAL_CANVAS_SIZE = 25
const PAINT_COST = 1

@storage_var
func canvas_pixels_len() -> (res: felt):
end

@storage_var
func canvas_pixels(index: felt, param_index: felt) -> (res: felt):
end

@storage_var
func token_contract_address() -> (address: felt):
end

@storage_var
func user_activity(account: felt) -> (last_activity_timestamp: felt):
end

@constructor
func constructor{
  syscall_ptr : felt*,
  pedersen_ptr : HashBuiltin*,
  range_check_ptr
}():
  canvas_pixels_len.write(INITIAL_CANVAS_SIZE)
  return ()
end

@external
func update_canvas_data{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(indexes_len: felt, indexes: felt*, values_len: felt, values: felt*, updates: felt) -> ():
  alloc_locals

  let (caller_address) = get_caller_address()

  # enforce timestamp restrictions - canvas can only be updated after 30 seconds
  let (last_activity_timestamp) = get_last_user_activity(account=caller_address)
  let locked_until_timestamp = last_activity_timestamp + 30
  let (block_timestamp) = get_block_timestamp()
  let (can_play_timestamp) = is_le(locked_until_timestamp, block_timestamp)
  assert can_play_timestamp = 1

  let update_cost: Uint256 = Uint256(updates * PAINT_COST, 0)
  let (caller_address_balance) = get_token_balance_for_user(account=caller_address)

  let (last_activity_timestamp) = get_last_user_activity(account=caller_address)
  if last_activity_timestamp != 0:
    let (can_play_balance) = uint256_le(update_cost, caller_address_balance)
    assert can_play_balance = 1
  end

  ERC20_mint(caller_address, update_cost)

  let (arr_len) = canvas_pixels_len.read()

  patch_canvas_data(
    indexes=indexes,
    values=values,
    updates=updates,
    updater_address=caller_address,
  )

  update_last_user_activity(account=caller_address)

  return ()
end

func patch_canvas_data{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(indexes: felt*, values: felt*, updates: felt, updater_address: felt) -> ():
  if updates == 0:
    return ()
  end

  # TODO: enforce maximum canvas size
  tempvar updateIndex = indexes[updates - 1]
  canvas_pixels.write(updateIndex, PixelEnum.data, values[updates - 1])
  canvas_pixels.write(updateIndex, PixelEnum.last_updated_by, updater_address)

  let (block_timestamp) = get_block_timestamp()
  canvas_pixels.write(updateIndex, PixelEnum.timestamp, block_timestamp)

  patch_canvas_data(
    indexes=indexes,
    values=values,
    updates=updates - 1,
    updater_address=updater_address
  )

  return ()
end

@view
func get_canvas_data{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}() -> (arr_len: felt, arr: felt*):
  alloc_locals

  let (local arr: felt*) = alloc()
  let (local arr_len) = canvas_pixels_len.read()

  reduce_to_canvas_data(arr_len=arr_len, arr=arr, index=0, field=PixelEnum.data)

  return (arr_len=arr_len, arr=arr)
end

@view
func get_canvas_timestamps{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}() -> (arr_len: felt, arr: felt*):
  alloc_locals

  let (local arr: felt*) = alloc()
  let (local arr_len) = canvas_pixels_len.read()

  reduce_to_canvas_data(arr_len=arr_len, arr=arr, index=0, field=PixelEnum.timestamp)

  return (arr_len=arr_len, arr=arr)
end

func reduce_to_canvas_data{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(arr_len: felt, arr: felt*, index: felt, field: felt):
  if arr_len == 0:
    return ()
  end
  let (base) = canvas_pixels.read(index, field)
  assert [arr] = base
  reduce_to_canvas_data(arr_len=arr_len - 1, arr=&arr[1], index=index + 1, field=field)
  return ()
end

@view
func get_token_contract_address{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}() -> (contract_address: felt):
  let (address) = token_contract_address.read()
  return (contract_address=address)
end

@external
func update_token_contract_address{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(contract_address: felt):
  # TODO: assert is owner
  token_contract_address.write(contract_address)
  return ()
end

@view
func get_token_balance_for_user{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(account: felt) -> (balance: Uint256):
  let (balance: Uint256) = ERC20_balanceOf(account)
  return (balance)
end

@view
func get_last_user_activity{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(account: felt) -> (last_activity_timestamp: felt):
  let (last_activity_timestamp) = user_activity.read(account)
  return (last_activity_timestamp)
end

@external
func update_last_user_activity{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(account: felt):
  # TODO: assert is owner
  let (block_timestamp) = get_block_timestamp()
  user_activity.write(account, block_timestamp)
  return ()
end
