#  PaintToEarn.eth

> Earn $PAINT tokens by drawing on the ethereum blockchain

![Example of web application](./app-demo.png)

## Gameplay

This play-to-earn game allows players to paint on a canvas deployed on the Ethereum network.

Players must have $PAINT tokens to paint pixels on the canvas.
The game will reward player engagement, distributing players $PAINT as they play.

The canvas only allows player wallet addresses to participate after waiting a lockout period. This is meant to act as a reasonable timespan to prevent token farming and botting.

Changed pixels may be locked by dedicating $PAINT per pixel at the time of update. Dedicated $PAINT will be burned.

In the future, accumulating tokens may be advantageous because...
- The timespan can be bought:
  - e.g. 30 second delay by default, reduced by 1 second per $PAINT * 0.01, so you can essentially buy access instantly for 0.30 $PAINT
- Each pixel can be locked:
  - e.g. 0 second lock per pixel by default, increased by 1 second per $PAINT * 0.01, so you can lock a pixel from being changed for a minute by paying 0.60 $PAINT

## TODO

A few remaining features need to be developed to deliver an MVP version of the game:
- [x] Player wallet addresses can only re-participate after waiting a timeout duration
- [ ] Player wallet addresses can only change a number of pixels corresponding to their current balance of $PAINT tokens
- [ ] Pixel updates are locked for a default duration, and cannot be changed by others during this duration
- [ ] Pixel updates can be locked for a longer duration by dedicating their $PAINT tokens, which are burnt as a result

## Development

Scaling is achieved by using the [Starknet](https://starkware.co/starknet/) layer 2 network.

Run the StarkNet transaction execution environment (similar to EVM):

```bash
source ./env/bin/activate   # activate python virtual env
nile node
```

Install frontend dependencies

```bash
npm install
```

Run frontend locally

```bash
npm run dev
```

#### Run tests

```bash
npm run test
```

## Acknowledgements

- [StarkWare](https://starkware.co/)
- [Starknet.js](https://github.com/seanjameshan/starknet.js)
- [Argent-x](https://github.com/argentlabs/argent-x)
- [Fracek's React, Starknet Boilerplate](https://github.com/fracek/starknet-react-example)
- [OpenZeppelin](https://github.com/OpenZeppelin/cairo-contracts)
- [Nile](https://github.com/OpenZeppelin/nile)

## Security

This project is still in a very early and experimental phase. It has never been audited nor thoroughly reviewed for security vulnerabilities. Not recommended for production use.

Please report any security issues you find by opening up an issue in this repository.

## License

PaintToEarn.eth is released under the [AGPL-3.0-only](LICENSE) license.
