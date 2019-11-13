# Docworks

A tool for parsing documentation and transforming it to a JSON as a model.

## Getting started
* `yarn` (using yarn workspaces)

#### Commands
* `local` - generates the JSON model from the JSDoc to a local directory
* `ecp` - generates the JSON model from the JSDoc, compares with previous model, commits and pushes the changes
* `tern` - builds a tern model from the generated JSON model
* `dts` - builds typescript decleartion files from the generated JSON model
* `validate`

#### Tests
* Use `yarn test` to run the tests in all packages

#### Publishing
1. Use `yarn release` to create a release commit and git tag.
2. Use `git push --follow-tags` so that CI can pick up the new tag and trigger publishing to npm (CI will run `yarn ci:publish`)
