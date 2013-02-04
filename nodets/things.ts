///<reference path='../headers/socket.io/socket.io.d.ts' />
///<reference path='persons.ts' />

module TechRadar.Server{

  export class Thing{
  	constructor(public name:string, public description:string){
  		// default constructor
  	}
  }

  export class Things{
  	constructor(
      private socketManager:SocketManager, 
      private currentUser:Person){

  		this.setupSocketIO();
  		      
  	}
    private setupSocketIO(){
      var socketNs = this.socketManager.of("/Thing");
      socketNs.on("connection", (socket:Socket) => {      

        socket.on("new", (name:string, description:string) => this.Create(new Thing(name, description)));

        socket.on("update", (updatedThing:Thing) => this.Update(updatedThing));
        console.log("conntected with a new socket on /Thing");
      });
    }
    public Create(newThing:Thing){
      if (this.currentUser.IsAllowedTo(Action.Create, newThing)
          && !this.HasA(newThing)){
          console.log("creating new Thing("+newThing.name+")");
      }
    }
    public Update(updatedThing:Thing){
      if (this.currentUser.IsAllowedTo(Action.Update, updatedThing)
          && this.HasA(updatedThing)){
          console.log("updating new Thing("+updatedThing.name+","+updatedThing.description+")");
      }
    }
    public HasA(thing:Thing){
      return false;
    }
  }
}