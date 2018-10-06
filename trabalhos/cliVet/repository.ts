export class Repository<T>{
    private _data: Map<string, T>; //no diagrama tem como lista mas é com mapa
    private _typeName: string;

    public constructor(typeName: string) {
        this._data = new Map<string, T>();
        this._typeName = typeName;
    }

    public add(key: string, t: T) {
        if (this._data.has(key)){
            throw new Error("O nome " + key + " já existe")
        }
        this._data.set(key, t);
    }

    public get(key: string): T{
        return 
    }

    public rm(key: string) {
        
    }

    public getAll(): Array<T>{
        return 
    }

}//Repository