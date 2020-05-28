import axios from "axios";

/**
 * 1. Crypton(key).request().encrypt(axios);
 * 2. Crypton(key).response().encrypt(axios);
 * 3. Crypton(key).both().encrypt(axios); -> Crypton(key).encrypt(axios);
 * 4. cryptonite.request().clear(axios);
 * 5. cryptonite.response().clear(axios);
 * 6. cryptonite.both().clear(axios); -> cryptonite.clear(axios);
 */

const handleError = (error) => {
    Promise.reject(error);
}

class Applyer {
    constructor() {
        this.apply = [];
    }

    request() {
        this.apply.push('request');

        return this;
    }

    response() {
        this.apply.push('response');

        return this;
    }

    both() {
        this.apply = ['request', 'response'];

        return this;
    }
}

class CryptonClearer extends Applyer {
    constructor(instances, axios) {
        super();
        this.interceptorInstances = instances;
        this.axios = axios;
    }

    clear() {
        this.both();

        this.apply.forEach((item) => {
            if (this.interceptorInstances[item] !== undefined) {
                this.axios.interceptors[item].eject(this.interceptorInstances[item]);
            }
        });
    }
}

class CryptonHandler extends Applyer {
    constructor(key = null) {
        super();
        if (key) {
            this.key = key;
            // this.encrypter = new Encrypter(key);
            this.headers = {
                request: 'x-request-encrypted',
                response: 'x-response-encrypted'
            };
        }
        this.interceptorInstances = {};
    }

    encrypt(axios) {
        if (!this.key) {
            throw new Error('Cannot encrypt');
        }

        if (this.apply.length <= 0) {
            this.both();
        }

        this.interceptorInstances.request = axios.interceptors.request.use((config) => {
            this.apply.forEach((item) => {
                config.headers[this.headers[item]] = 1;
            });

        console.log('config');
        console.log(config);

            return config;
        }, handleError);

        if (this.apply.indexOf('response') >= 0) {
            this.interceptorInstances.response = axios.interceptors.response.use((response) => {
                console.log('response');
                console.log(response);


                if (response.config.headers[this.headers.response] !== undefined) {
                    if (response.data.payload !== undefined) {
                        response.data = this.encrypter.decrypt(response.data.payload);
                    }
                }

                return response;
            });
        }

        return new CryptonClearer(this.interceptorInstances, axios);
    }
}

const Ncoder = (key = null) => {
    return new CryptonHandler(key);
};

export default Ncoder;
