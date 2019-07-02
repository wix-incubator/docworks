
class ServiceModel {
    constructor() {
        this.services = []
        this.errors = []
    }

    clear() {
        this.services = []
    }

    add(added) {
        this.services = this.services.concat(added)
    }

    get() {
        return this.services
    }

    addError(jsDocError) {
        this.errors.push(jsDocError)
    }
}



module.exports = ServiceModel
