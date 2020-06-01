import CryptoJS from 'crypto-js';
import unSerializer from './unserializer';


class Encrypter {
    constructor(key) {
        if (key.startsWith('base64:')) {
            key = key.substr(7);
        }
        this.key = key;
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
    constructor(key = null) {
        if (key) {
            this.key = key;
            this.encrypter = new Encrypter(key);
        }
    }


    handle(axios) {
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


const NcoderX = (key = null) => {
    return new AxiosConfigure(key);
};

export default NcoderX;
