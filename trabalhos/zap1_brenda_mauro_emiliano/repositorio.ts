

export class Repository<T>{
    private _map: Map<string, T>;
    private filetype: string;

    public constructor(filetype: string) {
        this.filetype = filetype;
        this._map = new Map<string, T>();
    }

    public add(key: string, t: T): void {
        if (this._map.has(key)) {
            throw new Error(key + " ja existe\n");
        }
        this._map.set(key, t);
    }

    public rm(key: string): void {
        if (!this._map.delete(key))
            throw new Error("" + key + " nao encontrado\n");
    }

    public key(): Array<string> {
        let saida = new Array<string>();
        for (let key of this._map.keys()) {
            saida.push(key);
        }
        return saida;
    }

    public get(key: string): T {
        let value = this._map.get(key);
        if (value) {
            return value;
        } else {
            throw new Error("" + key + " nao encontrado\n");
        }
    }

    public getAll(): Array<T> {
        let saida = new Array<T>();
        for (let t of this._map.values()) {
            saida.push(t);
        }
        return saida;
    }
    public has(key: string): boolean {
        return this._map.has(key);
    }
}//Repository
