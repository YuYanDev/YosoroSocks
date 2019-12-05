import WebSocket from "ws";
import { serverCheckShakeHands } from "./core/shake-hands";

class YosoroSocksServer {
  constructor(props) {
    this.config = props;
    this.server = null;
    this.serverInfo = {
      version: 1
    };
    this.shakeHandsStatus = false;
  }

  mounted(ws, req) {
    const clientIP = req.connection.remoteAddress;
    const clientPort = req.connection.remotePort;
    const clientName = clientIP + clientPort;

    console.log("%s is connected", clientName);

    // 发送欢迎信息给客户端
    ws.send("shake-hands");

    ws.on("message", message => {
      console.log("received: %s from %s", message, clientName);
      // 握手校验
      if (message.indexOf("shake-hands") !== -1) {
        if (serverCheckShakeHands(message)) {
          this.shakeHandsStatus = true;
          console.log("握手成功");
          ws.send(
            "shake-hands " +
              JSON.stringify({
                success: true
              })
          );
        } else {
          console.log("握手失败");
          ws.send(
            "shake-hands " +
              JSON.stringify({
                success: false
              })
          );
        }
      } else {
        if (this.shakeHandsStatus === false) {
          ws.send(
            "shake-hands " +
              JSON.stringify({
                success: false
              })
          );
        } else {
          // 正常传输
        }
      }
    });
  }
  created(ws, req) {
    console.log("created %s is connected", clientName);
  }
  destoryed() {
    console.log("disconnected");
  }
  init() {
    this.server = new WebSocket.Server({ port: 8080 });
    this.server.on("open", () => this.created());
    this.server.on("connection", (ws, req) => this.mounted(ws, req));
    this.server.on("close", () => this.destoryed());
  }
}

let test = new YosoroSocksServer({ test: 1 });
test.init();
