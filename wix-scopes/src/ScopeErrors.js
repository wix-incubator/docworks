const ScopeErrorKinds = {
    EMPTY_SCOPES:'EMPTY_SCOPES',
    INVALID_SCOPES_SCHEMA:'INVALID_SCOPES_SCHEMA',
    INVALID_SCOPE:'INVALID_SCOPE'
}

class ScopeError extends Error {
    constructor(message, kind){
        super(message)
        this.kind = kind
    }
}

class EmptyScopesError extends ScopeError {
    constructor(){
        super('scopes tag value is empty')
        this.kind = ScopeErrorKinds.EMPTY_SCOPES
    }
}

class InvalidScopeSchema extends ScopeError {
    constructor(scopeValue){
        super(`scopes schema ${scopeValue} is not valid`)
        this.kind = ScopeErrorKinds.INVALID_SCOPES_SCHEMA
    }
}

class InvalidScope extends ScopeError {
    constructor(invalidScope){
        super(`scopes value ${invalidScope} is not valid`)
        this.kind = ScopeErrorKinds.INVALID_SCOPE
    }
}

module.exports = {
    ScopeErrorKinds,
    EmptyScopesError,
    InvalidScopeSchema,
    InvalidScope
}