module.exports = {
    apps: [
        {
            name: "node-sso",
            script: "./bin/www",
            env: {
                "NODE_ENV": "dev",
                "PORT": "8081"
            }
        },
    ]
}
