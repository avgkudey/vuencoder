import axios from 'axios';
import Ncoder from './ncoder';
import NcoderX from './ncoderx';

const VueNcoder = (key, encrypt = true) => {
    return {
        install(Vue, options) {
            const settings = options ? options : {};
            let axiosInstance = axios.create(settings);
            window.axios = NcoderX(key).handle(axiosInstance);

            let ncoderInstance = axios.create(settings);
            window.ncoder = Ncoder(key, encrypt).handle(ncoderInstance);
        }
    }
};
export default VueNcoder;
