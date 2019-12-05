import WebSocket from "ws";
import { clientCheckShakeHands } from "./core/shake-hands";

class YosoroSocksClient {
  constructor(props) {
    this.config = props;
    this.client = null;
    this.shakeHandsStatus = false;
    this.clientInfo = {
      version: 1
    };
  }

  mounted(message) {
    if (message.indexOf("shake-hands ") !== -1) {
      if (clientCheckShakeHands(message)) {
        this.shakeHandsStatus = true;
        console.log("握手成功");
      } else {
        console.log("握手失败");
      }
    } else {
      if (this.shakeHandsStatus === false) {
        console.log(
          message.indexOf("shake-hands") === -1 &&
            message.indexOf("shake-hands ") !== -1
            ? "连接中断"
            : "首次握手"
        );
      } else {
        //正常
        console.log(message);
      }
    }
  }
  created() {
    this.client.send("shake-hands " + JSON.stringify(this.clientInfo));
  }
  destoryed() {}
  init() {
    this.client = new WebSocket("ws://localhost:8080/ws");
    this.client.on("open", () => this.created());
    this.client.on("message", message => this.mounted(message));
    this.client.on("close", () => this.destoryed());
  }
}

setTimeout(() => {
  let test = new YosoroSocksClient();
  test.init();
}, 1500);
