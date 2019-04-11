var config = {}

config.port = 8763
config.server = process.env.HDFSUP_TORUS_IP//"10.100.2.2"
config.user = process.env.HDFSUP_TORUS_USERNAME

module.exports = config
