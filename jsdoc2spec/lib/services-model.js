
class ServiceModel {
    constructor() {
        this.services = [];
    }

    clear() {
        console.log('clear');
        this.services = [];
    }

    add(added) {
        console.log(1, added);
        this.services = this.services.concat(added);
        console.log(2, this.services);
    }

    get() {
        console.log(2, this.services);
        return this.services;
    }
}



export default ServiceModel;
