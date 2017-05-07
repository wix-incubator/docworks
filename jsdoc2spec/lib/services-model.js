
class ServiceModel {
    constructor() {
        this.services = [];
    }

    clear() {
        this.services = [];
    }

    add(added) {
        this.services = this.services.concat(added);
    }

    get() {
        return this.services;
    }
}



export default ServiceModel;
