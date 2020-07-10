
module.exports = (api) => {
    api.cache(true);
    return {
        presets: [
            [require('@babel/preset-env'), {
                modules: false,
            }],
            [require('@cocos/babel-preset-cc'), {
                allowDeclareFields: true,
            }]
        ],
    };
};