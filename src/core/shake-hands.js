export const serverCheckShakeHands = message => {
  let messageArr = message.split(" ");
  let clientInfo = JSON.parse(messageArr[1]);
//   console.log(clientInfo);
  return true;
};

export const clientCheckShakeHands = message => {
  let messageArr = message.split(" ");
  if (messageArr.length > 1) {
    let serverInfo = JSON.parse(messageArr[1]);
    // console.log(serverInfo);
    return true;
  } else {
    return false;
  }
};
