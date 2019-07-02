const {isArray, isObject} = require('lodash')

function toJson(obj, indentSize, spec) {
    let indent = new Array(indentSize + 1).join(' ')
    return serialize(obj, '', indent, spec)
}

function fromJson(json, spec) {
    let obj = JSON.parse(json)
    return deserialize(obj, spec)
}

function serialize(obj, indent, indentStep, spec) {
    let indentChilds = indent + indentStep
    let indentGrandChild = indentChilds + indentStep
    let names = Object.getOwnPropertyNames(obj)
    let orderedNames = specToOrderedNames(spec)
    let props = []

    function handleMultiLine(value, name) {
        let lines = value.split('\n')
          .map(JSON.stringify)
          .join(`,\n${indentGrandChild}${indentStep}`)

        props.push(`"${name}":\n${indentGrandChild}[${indentStep.slice(1)}${lines}${indentStep.slice(1)}]`)
    }

    function compare(a,b) {
        return (a>b)?1:(a<b)?-1:0
    }

    function handleArray(value, name, valueSpec) {
        if (!value.length)
            props.push(`"${name}": []`)
        else {
            let sortedValue = (valueSpec && valueSpec.orderBy)?
              value.slice(0).sort((a,b) => compare(a[valueSpec.orderBy], b[valueSpec.orderBy])):
              value
            props.push(`"${name}":\n${indentGrandChild}[${indentStep.slice(1)}` +
              sortedValue.map(v => {
                  if (isArray(v) || isObject(v))
                      return `${serialize(v, indentGrandChild + indentStep, indentStep, valueSpec)}`
                  else
                      return `${JSON.stringify(v)}`
              }).join(`,\n${indentGrandChild}${indentStep}`) +
              `${indentStep.slice(1)}]`)
        }
    }

    function handleValue(name, value, valueSpec) {
        if (valueSpec && valueSpec.multiLine && value) {
            handleMultiLine(value, name)
        }
        else if (isArray(value)) {
            handleArray(value, name, valueSpec)
        }
        else if (isObject(value))
            props.push(`"${name}":\n${indentGrandChild}` + serialize(value, indentGrandChild, indentStep, valueSpec))
        else if (value === null)
            props.push(`"${name}": null`)
        else if (value !== undefined)
            props.push(`"${name}": ` + JSON.stringify(value))
    }

    for (let i in orderedNames) {
        let name = orderedNames[i]
        handleValue(name, obj[name], spec[name])
    }

    for (let i in names) {
        let name = names[i]
        if (!orderedNames.find(_ => _ === name)) {
            handleValue(name, obj[name])
        }
    }
    return '{' + indentStep.slice(1) +
      props.join(`,\n${indentChilds}`) +
      indentStep.slice(1)+ '}'
}

function specToOrderedNames(spec){
    spec = spec || []
    let keys = Object.keys(spec)
    return keys.map(key => {
        let value = spec[key]
        if (value && value.pos)
            return [key, value.pos]
        else
            return undefined
    })
        .filter(_ => !!_)
        .sort((a,b) => a[1] - b[1])
        .map(_ => _[0])
}

function deserialize(obj, spec) {
    spec = spec || []
    let keys = Object.keys(obj)
    keys.forEach(key => {
        if (spec[key] && spec[key].multiLine && isArray(obj[key]))
            obj[key] = obj[key].join('\n')
        else if (isArray(obj[key]))
            obj[key].forEach((obj) => deserialize(obj, spec[key]))
        else if (isObject(obj[key]) && spec[key])
            obj[key] = deserialize(obj[key], spec[key])
    })
    return obj
}

module.exports = {
  toJson,
  fromJson
}
