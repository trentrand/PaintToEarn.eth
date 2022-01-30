# Build and test
build :; nile compile
test  :; pytest tests/ -s -p no:warnings
