# SP.js
A comprehensive object oriented modular package for deploying interacting with and testing *Satoshi's Palace* smart contracts.

## Usage

Add the following to your `package.json` `dependencies`
```
	"spjs": "github:SatoshisPalace/SP.js"
```

Add the following to your projects `tscongig.json` `compilerOptions`:
```
    "baseUrl": ".",
    "paths": {
            "spjs": [
        "node_modules/spjs"
      ],
    }
```
## Modules
### [Blackjack](./src/modules/blackjack/)
### [Snip20](./src/modules/snip20/)
### [Snip721](./src/modules/snip721/)


## Development

### Deployment
```
npm run deploy
```

### Compile
```
nvm install
```
```
nvm use
```
```
npm install
```
```
npm run build
```
### [Tests](./src/tests/)

### Schemas
On your smart contract run to generate json schemas of of your Query/Execute Msg/Answers
```
cargo schema
```
Turn your schemas in TypeScript (outputes to `./schema/types`)


Edit `package.json` `scripts.convert-schema`, the paramaters should match the folder which you would like to generate schemas for example contests:
```
./schema/contests ./schema/contests/types
```
Run the convert Schema script:
```
npm run convert-schema
```
Now take your converted schemas, place them in your respective module, and manually format them as seen in [contests](./src/modules//contests/types/execute_msg.ts)
