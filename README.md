# Vue Ncoder: Laravel API Encryption Frontend Package
[![GitHub issues](https://img.shields.io/github/issues/avgkudey/vuencoder)](https://github.com/avgkudey/vuencoder/issues)
   [![GitHub forks](https://img.shields.io/github/forks/avgkudey/vuencoder)](https://github.com/avgkudey/vuencoder/network)
   [![GitHub stars](https://img.shields.io/github/stars/avgkudey/vuencoder)](https://github.com/avgkudey/vuencoder/stargazers)

    lorem ipsom
    
  ## Installation
  ```bash
npm install vuencoder
```

##Usage
### Configuration
**plugins/vue-ncoder.js**

  ```javascript
import {VueNcoder} from 'vuencoder';
import Vue from "vue";

const key = 'your base64 Encryption Key';
const enableEncryption = true;  // Enable Or Disable Encryption

const axiosOptions = {
    baseURL: 'api/',
};

Vue.use(VueNcoder(key, enableEncryption), axiosOptions);
```


**app.js**
  ```javascript
window.Vue = require('vue');
Vue.config.productionTip = false;

require('~/plugins/vue-ncoder');

const app = new Vue({
    el: '#app',
});

```

### Example
####Send Request
  ```javascript
ncoder.post('auth/login', this.loginForm).then((response) => {
                // Success
                }).catch((error) => {
                // Error
                });

ncoder.get('auth/user').then((response) => {
                // Success
                }).catch((error) => {
                // Error
                });
```
####Set Headers
  ```javascript
ncoder.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```
## Credits

- [All Contributors][link-contributors]
