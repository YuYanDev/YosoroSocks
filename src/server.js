import YosoroSocks from "./core/core";
import command from "commander";
import throng from "throng";
import log4js from "log4js";

const logger = log4js.getLogger("server");

command
  .option("-m --method <method>", "encryption method, default: aes-256-cfb")
  .option("-k --password <password>", "password")
  .option("-s --server-address <address>", "server address")
  .option("-p --server-port <port>", "server port, default: 8388")
  .option(
    "--log-level <level>",
    "log level(debug|info|warn|error|fatal)",
    /^(debug|info|warn|error|fatal)$/i,
    "info"
  )
  .option("--log-file <file>", "log file")
  .parse(process.argv);

const startYosoroSocksServerMaster = () => {
  logger.info("started master");
};

const startYosoroSocksServerWorker = id => {
  logger.info(`started worker ${id}`);
  let YosoroSocksServer = new YosoroSocks(
    {
      serverAddress:
        process.env["SERVER_ADDRESS"] || command.serverAddress || "127.0.0.1",
      serverPort: process.env["PORT"] || command.serverPort || 8388,
      password:
        process.env["PASSWORD"] ||
        command.password ||
        "shadowsocks-over-websocket",
      method: process.env["METHOD"] || command.method || "aes-256-cfb"
    },
    false
  );

  YosoroSocksServer.setLogLevel(command.logLevel);
  YosoroSocksServer.setLogFile(command.logFile);
  YosoroSocksServer.setServerName("server-" + id);
  YosoroSocksServer.bootstrap();
};

throng({
    workers: process.env.WEB_CONCURRENCY || 1,
    master: startYosoroSocksServerMaster,
    start: startYosoroSocksServerWorker
  });