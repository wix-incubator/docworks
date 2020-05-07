This docworks pluging supports tagging services, properties & operations as experimental.

Add that tag: `@experimental ExperimentName` to a service / property / operation, and the resulting docworks model will have this info as part of its `extra` values:
```js
{
    ...,
    extra: {
        ...,
        experimental: ExperimentName
    }
}
`````````