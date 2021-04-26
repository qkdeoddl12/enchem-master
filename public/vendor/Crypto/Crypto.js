/*
    E3Crypto

    # Before using import
    <script src="/E3Crypto/vendor/aes.js"></script>
    <script src="/E3Crypto/vendor/aes-ctr.js"></script>
    <script src="/E3Crypto/vendor/e3base64.js"></script>
    <script src="/E3Crypto/vendor/utf8.js"></script>
    <script src="/E3Crypto/e3Crypto.js"></script>
 */

var Erypto = (function () {
    var api = {};

    api.encrypt = function(str) {
        if(str==""){ return ""}
        if(!str){ return ""}
        return Aes.Ctr.encrypt(str,'goodus..',256);
    };

    api.decrypt = function(str) {
        if(str==""){ return ""}
        if(!str){ return ""}
        return Aes.Ctr.decrypt(str,'goodus..',256);
    };

    return api;
})();