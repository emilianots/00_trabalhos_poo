import {cin, cout} from "./readline";
import {Repository} from "./repositorio";
import {Tweet} from "./tweet";
import {User} from "./user";
import {TweetGenerator} from "./tweetgen";

const HELP = `
help
users
addUser    _nome
seguir     _nome _outro
twittar    _nome _(mensagem com varias palavras)
like       _nome _tweetId
seguidores _nome
seguidos   _nome
timeline   _nome
myTweets   _nome
unread     _nome
`;

class Controller{
    repo: Repository<User>;
    twGen: TweetGenerator;
    repoTw: Repository<Tweet>;

    constructor(){
        this.repo = new Repository<User>("usuario");
        this.repoTw = new Repository<Tweet>("tweet");
        this.twGen = new TweetGenerator(this.repoTw);
    }

    process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];

        if(cmd == "help"){
            return HELP;
        } else if(cmd == "addUser") {
            this.repo.add(ui[1], new User(ui[1]));

        } else if(cmd == "users") {
            return "usuarios\n[" + this.repo.key().join(" ") + "]";

        } else if(cmd == "seguir") {
            this.repo.get(ui[1]).seguir(this.repo.get(ui[2]));
            return "" + ui[1] + " esta seguindo " + ui[2] + "\n";

        } else if(cmd == "twittar") {
            let user = this.repo.get(ui[1]);
            user.twitar(this.twGen.create(user.userName, ui.slice(2).join(" ")));

        } else if(cmd == "seguidores") {
            return User.genStrU(this.repo.get(ui[1]).seguidores);            

        } else if(cmd == "seguidos") {
            return User.genStrU(this.repo.get(ui[1]).seguindo);

        } else if(cmd == "timeline") {
            return User.genStrT(this.repo.get(ui[1]).timeline);

        } else if(cmd == "unread") {
            return User.genStrT(this.repo.get(ui[1]).getUnread());

        } else if(cmd == "myTweets") {
            return User.genStrT(this.repo.get(ui[1]).myTweets);

        } else if(cmd == "like") {
            this.repo.get(ui[1]).addLike(Number(ui[2]));

        } else {
            return "comando invalido";
        }
        return "done";
    }
    
    commandLine(){
        let line = "";
        cout("Digite cmd, help ou fim");
        while(line != "fim"){
            line = cin(">>>");
            if((line == "") || (line.substr(0, 2) == "  ") || (line[0] == "#"))
                continue;
            try {
                cout(this.process(line));
            }catch(e){
                cout("" + e.message);
            }
        }
    }
}

let c = new Controller();
c.commandLine();
