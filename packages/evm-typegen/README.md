# evm-typegen

Hydra-cli plugin generates typescript type definations from contract abis for substrate evm pallet.

USAGE

```bash
$ evm-typegen [COMMAND]
```

COMMANDS

```bash
typegen  Generate types from solidity contract ABIs
```

### Environment Variables

evm-typegen depends on the following env vars:

`CONTRACT_ABIS=/path/to/abis` should be the location to look for ABIs. Glob patterns are allowed ie. `./abis/**/*.json`, `./abis/*.json`. If you have a single ABI file that's also allowed i.e `./SampleAbi.json` or `./abis/SampleAbi.json`.

Decoding evm events requires the contract ABIs so `CONTRACT_ABIS` env variable should be set.

`OUTPUT_DIR=generated/evm/types` is the path that will host generated typescript type definations. Default is set to `generated/evm/types`.

## Getting Started

Once you set the environment variables you can start generateting types. I have a sample ABI to use:

```bash
$ cd sample-project
$ tree .
abis
└── contracts
    ├── ContentDirectory.json
    └── Migrations.json
$ /hydra/packages/evm-typegen typegen --abi './abis/**/*.json' --output generated/evm/types
```

For the next step you can start to write event handlers:

```

```
