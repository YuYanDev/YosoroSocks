import YosoroSocks from './core/core'
import command from 'commander'

command
    // .version(constants.VERSION)
    .option('-m --method <method>', 'encryption method, default: aes-256-cfb')
    .option('-k --password <password>', 'password')
    .option('-s --server-address <address>', 'server address')
    .option('-p --server-port <port>', 'server port, default: 8388')
    .option('-b --local-address <address>', 'local binding address, default: 127.0.0.1')
    .option('-l --local-port <port>', 'local port, default: 1080')
    .option('--log-level <level>', 'log level(debug|info|warn|error|fatal)', /^(debug|info|warn|error|fatal)$/i, 'info')
    .option('--log-file <file>', 'log file')
    .parse(process.argv);

let YosoroSocksClient = new YosoroSocks({
    localAddress: command.localAddress || '127.0.0.1',
    localPort: command.localPort || 1080,
    serverAddress: command.serverAddress || '127.0.0.1',
    serverPort: command.serverPort || 8388,
    password: command.password || 'shadowsocks-over-websocket',
    method: command.method || 'aes-256-cfb'
}, true);

YosoroSocksClient.setLogLevel(command.logLevel);
YosoroSocksClient.setLogFile(command.logFile);
YosoroSocksClient.bootstrap();