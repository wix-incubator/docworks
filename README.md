# Docworks

A tool for parsing documentation and transforming it to a JSON as a model.

#### Commands
* `local` - generates the JSON model from the JSDoc to a local directory
* `ecp` - generates the JSON model from the JSDoc, compares with previous model, commits and pushes the changes
* `tern` - builds a tern model from the generated JSON model
* `validate`


#### Dev notes
* The project is built on top of `Lerna` 
* Use `npm run test` to run the tests in all packages
* Use `npm run release` to publish the latest Docworks changes to NPM 
**Refrain using `lerna publish` directly as tests won't run.** 
