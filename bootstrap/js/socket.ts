
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
    public static Thing(){
        return Bus.instance().getSocket("Thing");
    }
    public static Person(){
        return Bus.instance().getSocket("Person");
    }
    public static Opinion(){
        return Bus.instance().getSocket("Opinion");
    }

    constructor(){
        var http = location.protocol;
        var slashes = http.concat("//");
        var port = window.location.port;
        var host = slashes.concat(window.location.hostname).concat(":"+port);
        this.thingSocket = io.connect(host+"/Thing");
        this.personSocket = io.connect(host+"/Person");
        this.opinionSocket = io.connect(host+"/Opinion");
    }
    getSocket(namespace:string):Socket{
        if (namespace == "Thing") return this.thingSocket;
        if (namespace == "Person") return this.personSocket;
        if (namespace == "Opinion") return this.opinionSocket;
   }

}
