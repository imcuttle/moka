/**
 * Created by Moyu on 16/10/28.
 */


module.exports = {
    deploy: require('./lib/deploy_bak').deploy,
    bak: require('./lib/deploy_bak').bak,
    new: require('./lib/new'),
    server: require('./lib/server'),
    staticServer: require('./lib/static-server'),
    init: require('./lib/init'),
    generate: require('./lib/generate').generate
}