import { createConnection } from "net";
import { createInterface } from "readline";

let currentCommand = '';
let isAuthenticated = false;

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = createConnection({ port: 4242 }, () => {
  console.log("client connecté.");
  
  rl.question('commande : ', function (cmd) {
    client.write(cmd)
  })

  client.on("data", (data) => {
    const message = data.toString();
    console.log("Message reçu :", message);

    const [status, ...args] = message.trim().split(" ");
    if (status == 230 && currentCommand === "USER") {
      isAuthenticated = true;
    }

      rl.question('commande : ', function (cmd) {
        client.write(cmd)
      })      


  });
});