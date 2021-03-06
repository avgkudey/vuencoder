import CryptoJS from 'crypto-js';
import serializer from './serializer';
import unSerializer from './unserializer';
import formatter from './formatter';


class Encrypter {
    constructor(key) {
        if (key.startsWith('base64:')) {
            key = key.substr(7);
        }
        this.key = key;
    }

    encrypt(data, convert = true) {
        console.log(CryptoJS.lib.WordArray.random(16))
        let payload = convert ? serializer(data) : data;
        return CryptoJS.AES.encrypt(payload, CryptoJS.enc.Base64.parse(this.key), {
            format: formatter(this.key),
            iv: CryptoJS.lib.WordArray.random(16)
        }).toString();
    }

    decrypt(data, convert = true) {
        let params = JSON.parse(atob(data));
        let decrypted = CryptoJS.AES.decrypt(params.value, CryptoJS.enc.Base64.parse(this.key), {
            iv: CryptoJS.enc.Base64.parse(params.iv)
        }).toString(CryptoJS.enc.Utf8);

        return convert ? unSerializer(decrypted) : decrypted;
    }


}


class AxiosConfigure {
    constructor(key = null, encrypt = true) {
        if (key) {
            this.key = key;
            this.encrypter = new Encrypter(key);
        }
        if (key) {
            this.enableEncription = encrypt;
        }
    }


    handle(axios) {

        if (this.enableEncription) {
        if (!this.key) {
            throw new Error('Cannot Encrypt Without a Encryption KEY');
        }

        axios.interceptors.request.use(
            config => {
                config.headers['x-request-encrypted'] = 1;
                config.headers['x-response-encrypted'] = 1;

                if (config.data) {
                    config.data = {payload: this.encrypter.encrypt(config.data)};
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );
        }

        axios.interceptors.response.use(
            response => {
                if (response.config.headers['x-response-encrypted'] !== undefined || response.headers['x-response-encrypted'] !== undefined) {
                    if (response.data.payload !== undefined) {
                        response.data = this.encrypter.decrypt(response.data.payload);

                    }
                }

                return response;
            },
            error => {

                if (error.response.config.headers['x-response-encrypted'] !== undefined || error.response.headers['x-response-encrypted'] !== undefined) {
                    if (error.response.data.payload !== undefined) {
                        error.response.data = this.encrypter.decrypt(error.response.data.payload);
                    }
                }
                return Promise.reject(error);
            }
        );


        return axios;
    }
}


const Ncoder = (key = null, encrypt = true) => {
    return new AxiosConfigure(key, encrypt);
};

export default Ncoder;
