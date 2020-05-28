import axios from 'axios';
import Ncoder from './ncoder';

const VueNcoder = (key) => {
    return {
        install(Vue, options) {
            const settings = options ? options : {};
            Vue.prototype.$ncoder = axios.create(settings);

            let instance = axios.create(settings);
            Vue.prototype.$cryptonite = Ncoder(key).encrypt(instance);
            Vue.prototype.$ncoders = instance;

            console.log('vue ncoder')
        }
    }
};
export default VueNcoder;
