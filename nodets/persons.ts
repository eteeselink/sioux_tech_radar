/// <reference path="../bootstrap/js/utils.ts" />

module TechRadar.Server{
  export class Person {
  	constructor(
  		public username:string,
  		public fullName:string){
      //default constructor
    }
    public IsAllowedTo(action:Action, thing:Thing){
      return true;
    }
  }

  export class Action extends Enum{
    constructor(){ super(Action); }
    public static Create = new Action();
    public static Read = new Action();
    public static Update = new Action();
  }

  export class Persons{
    public static GetCurrentUser(){
      return new Person("unknown","Unk Nown");
    }
  }
}