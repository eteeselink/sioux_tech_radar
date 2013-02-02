
declare var io : {
    connect(url: string): Socket;
}
export interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
}
export class Guid{
    public static New(){
        var S4 = function ()
        {
            return Math.floor(
                    Math.random() * 0x10000 /* 65536 */
                ).toString(16);
        };

        return (
                S4() + S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + S4() + S4()
            );
    }
}
export class Bus{
    private socket: Socket;
    private thingSocket: Socket;
    private personSocket: Socket;
    private opinionSocket: Socket;

    private static single:Bus;
    public static instance(){
        if (single == null) single = new Bus();
        return single;
    }

    constructor(){
        this.thingSocket = io.connect("http://localhost/Thing");
        this.personSocket = io.connect("http://localhost/Person");
        this.opinionSocket = io.connect("http://localhost/Opinion");
    }
    getSocket(namespace:string):Socket{
        if (namespace == "Thing") return this.thingSocket;
        if (namespace == "Person") return this.personSocket;
        if (namespace == "Opinion") return this.opinionSocket;
   }

}
