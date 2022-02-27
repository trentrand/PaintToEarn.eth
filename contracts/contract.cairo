%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.starknet.common.syscalls import get_caller_address

struct PixelEnum:
    member data: felt
    member timestamp: felt
    member last_updated_by: felt
end

@storage_var
func canvas_pixels_len() -> (res: felt):
end

@storage_var
func canvas_pixels(index: felt, param_index: felt) -> (res: felt):
end

@storage_var
func token_contract_address() -> (contract_address: felt):
end

@constructor
func constructor{
  syscall_ptr : felt*,
  pedersen_ptr : HashBuiltin*,
  range_check_ptr
}():
  canvas_pixels_len.write(25)
  return ()
end

@external
func update_canvas{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(indexes_len: felt, indexes: felt*, values_len: felt, values: felt*, updates: felt):
  alloc_locals

  # TODO: enforce timestamp restrictions (e.g. only can be updated after 30 seconds) https://starknet.io/docs/hello_starknet/more_features.html#block-number-and-timestamp
  let (caller_address) = get_caller_address()

  let (local arr_len) = canvas_pixels_len.read()

  patch_array(
    indexes=indexes,
    values=values,
    updates=updates,
    updater_address=caller_address
  )

  return ()
end

func patch_array{
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
  # canvas_pixels.write(updateIndex, PixelEnum.timestamp, timestamp

  patch_array(
    indexes=indexes,
    values=values,
    updates=updates - 1,
    updater_address=updater_address
  )

  return ()
end

@view
func get_array{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}() -> (arr_len: felt, arr: felt*):
  alloc_locals

  let (local arr: felt*) = alloc()
  let (local arr_len) = canvas_pixels_len.read()

  prepare_array(arr_len=arr_len, arr=arr, index=0)

  return (arr_len=arr_len, arr=arr)
end

func prepare_array{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(arr_len: felt, arr: felt*, index: felt):
  if arr_len == 0:
    return ()
  end
  let (base) = canvas_pixels.read(index, PixelEnum.data)
  assert [arr] = base
  prepare_array(arr_len=arr_len - 1, arr=&arr[1], index=index + 1)
  return ()
end

@view
func get_token_contract_address{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}() -> (contract_address: felt):
  let (res) = token_contract_address.read()
  return (contract_address=res)
end

# TODO: write test, fix issues
@external
func update_token_contract_address{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(contract_address: felt):
  token_contract_address.write(contract_address)
  return ()
end
