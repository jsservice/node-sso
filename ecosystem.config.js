module.exports = {
    apps: [
        {
            // 测试环境
            name: "node-sso",
            script: "./bin/www",
            env: {
                "NODE_ENV": "dev",
                "PORT": "8081"
            }
        },
    ]
}
