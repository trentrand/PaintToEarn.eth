from starkware.starknet.public.abi import get_storage_var_address

key = get_storage_var_address('canvasPixels')
print(f'key: {key}')
