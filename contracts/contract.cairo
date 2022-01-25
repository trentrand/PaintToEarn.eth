%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin

const canvas_size = 10

@storage_var
func canvasPixels(index: felt) -> (res: felt):
end

@external
func update_canvas{
  syscall_ptr: felt*,
  pedersen_ptr: HashBuiltin*,
  range_check_ptr
}(pixelIndex: felt, pixelData: felt):
  canvasPixels.write(pixelIndex, pixelData)
  return ()
end
