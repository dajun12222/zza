const api = 'http://192.168.0.16/'
module.exports = {
    '/api/': {
        target: api,
        changeOrigin: true,
    },
    '/externalLink/': {
        target: api,
        changeOrigin: true,
    },
    '/apis/': {
        target: api,
        changeOrigin: true,
        pathRewrite: {
            '^/apis': '',
        },
    },
    '/v1/': {
        target: api,
        changeOrigin: true,
    },
    '/external/': {
        target: api,
        changeOrigin: true,
    },
}
