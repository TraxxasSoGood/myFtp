import { createServer } from "net";
const fs = require("fs");
const comptes = JSON.parse(fs.readFileSync('./src/comptes.json'));


export function launch(port) {
  const server = createServer((socket) => {
    console.log("Nouvelle connexion.");
    socket.on("data", (data) => {
      const message = data.toString();

      const [command, ...args] = message.trim().split(" ");
      console.log(command, args);

      switch(command) {
        case "USER":     
        if (args[0] == undefined) {
          socket.write('Veuillez entrer un nom de compte.\r\n');
          break;
        }else{
          socket.name = args[0];
          let somme = "";
          comptes.forEach(compte => {
            if (compte.identifiant === socket.name){
              socket.pass = compte.mdp;
              somme = '230 compte connecté.\r\n';
            }else{
              somme = '230 ce compte n\"existe pas.\r\n';
            }
          });
          socket.write(somme);
          break;  
        }
      case "PASS":
        if (args[0] == undefined || args[0] != socket.pass) {
          socket.write('Veuillez entrer un mot de passe.\r\n');
        }else if (args[0] == socket.pass){
          socket.write('331 Mot de passe correct.\r\n');
        }
        break;
        case "LIST":
          socket.write(`\r\n`);
          fs.readdirSync(process.cwd()).forEach(file => {
          socket.write(`${file} \r\n`);
        });
          break;
      case "PWD":
        socket.write(`257, ${process.cwd()} \r\n`);
        break;
      case "CWD":
        if (args[0] == undefined) {
          process.chdir(directory);
          socket.write(`250 Nouveau chemin : ${process.cwd()} \r\n`);
          }
          else {
            try{
              process.chdir(args[0]);
              socket.write(`250 Nouveau chemin : ${process.cwd()} \r\n`);
            } catch(err) {
              socket.write(`Essayez un autre chemin.\r\n`);
            }
          }
        break;
      case "QUIT":
        socket.write(`221 Deconnection du serveur.\r\n`);
        socket.destroy();
      default:
        console.log("Cette commande n\"existe pas !", command, args);
      }
    });
  });

  server.listen(port, () => {
    console.log(`Serveur lancé sur localhost:${port}`);
  });
}