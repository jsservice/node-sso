const os = require('os');
module.exports = {

    /**
     * 获取本机IP地址
     * @returns {*}
     */
    getLocalIPAddress() {
        let interfaces = require('os').networkInterfaces();
        for (let devName in interfaces) {
            let ifc = interfaces[devName];
            for (let i = 0; i < ifc.length; i++) {
                let alias = ifc[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    // console.log(alias.address);

                    return alias.address
                }
            }
        }
    },

    /**
     * 获取本地主机名
     */
    getLocalHostName(){
        return os.hostname();//主机名
    }
}
