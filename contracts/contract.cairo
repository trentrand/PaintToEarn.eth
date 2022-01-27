%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.cairo_builtins import HashBuiltin

# TODO: enforce maximum size
@storage_var
func canvas_pixels_len() -> (res: felt):
end

# TODO: expand value to struct with timestamp, last_updated_by and pixel_data
@storage_var
func canvas_pixels(index: felt) -> (res: felt):
end

@constructor
func constructor{
  syscall_ptr : felt*,
  pedersen_ptr : HashBuiltin*,
  range_check_ptr
}(owner_address: felt):
  canvas_pixels_len.write(10)
  return ()
end

@external
func update_canvas{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(pixelIndex: felt, pixelData: felt):
  canvas_pixels.write(pixelIndex, pixelData)
  return ()
end

@view
func get_array{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}() -> (arr_len: felt, arr: felt*):
  alloc_locals

  let (local arr) = alloc()
  let (local arr_len) = canvas_pixels_len.read()

  prepare_array(arr_len=arr_len, arr=arr)

  return (arr_len=arr_len, arr=arr)
end

func prepare_array{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(arr_len: felt, arr: felt*):
  if arr_len == 0:
    return ()
  end
  let (base) = canvas_pixels.read(arr_len)
  assert [arr] = base
  prepare_array(arr_len=arr_len - 1, arr=arr + 1)
  return ()
end
