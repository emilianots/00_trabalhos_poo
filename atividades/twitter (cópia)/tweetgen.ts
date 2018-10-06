import {Repository} from "./repositorio";
import {Tweet} from "./tweet";

export class TweetGenerator{
    public static _nextId: number = 0;
    public _r_tw: Repository<Tweet>;

    constructor(r_tw: Repository<Tweet>) {
        this._r_tw = r_tw;
    }

    public create(username: string, msg: string): Tweet {
        let nextId = TweetGenerator._nextId;
        this._r_tw.add("" + TweetGenerator._nextId, new Tweet(nextId, username, msg));
        TweetGenerator._nextId++;
        return this._r_tw.get("" + nextId);
    }
}
