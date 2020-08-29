module.exports = {
    chainWebpack: config => {
        config.module
            .rule('worker')
            .test(/\.worker\.js$/)
            .use('worker-loader')
            .loader('worker-loader')
            .end();

        config.module.rule('js').exclude.add(/\.worker\.js$/);

        config.module
            .rule('babel-worker')
            .test(/\.worker\.js$/)
            .use('babel-loader')
            .loader('babel-loader')
            .end();
    }
};
