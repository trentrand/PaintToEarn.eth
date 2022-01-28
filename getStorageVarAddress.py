from starkware.starknet.public.abi import get_storage_var_address

key = get_storage_var_address('canvas_pixels')
print(f'key: {key}')
