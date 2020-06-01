import CryptoJS from 'crypto-js';

export default (key) => {
    return {
        stringify: function (cipherParams) {
            const value = cipherParams.ciphertext.toString(CryptoJS.enc.Base64);
            const iv = cipherParams.iv.toString(CryptoJS.enc.Base64);
            const params = {
                value,
                iv,
                mac: CryptoJS.HmacSHA256(iv + value, CryptoJS.enc.Base64.parse(key)).toString(),
            };
            return btoa(JSON.stringify(params));
        }
    }
}
