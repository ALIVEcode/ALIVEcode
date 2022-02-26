##### How to do migrations with typeorm

### Creating a blank migration:

ts-node ./node_modules/typeorm/cli.js migration:create -n MigrationName


### Generating a migration automatically based on model changes:

ts-node ./node_modules/typeorm/cli.js migration:generate -n MigrationName


### Running the migrations

ts-node ./node_modules/typeorm/cli.js migration:run


### Reverting the migrations

ts-node ./node_modules/typeorm/cli.js migration:revert