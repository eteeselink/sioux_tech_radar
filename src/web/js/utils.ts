/// base class for fake enums; searches the constructor object
/// for a slow but functional toString implementation.
module TechRadar{
  export class Enum {
    constructor(private clss:Object){}

    public toString() : string {
      var classObj = this['constructor'];
      for (var key in classObj) {
        if (this.clss[key] === this) {
          return key;
        }
      }
      return null;
    }
  }
  export function random(from: number, to: number) {
    var domain = to - from;
    return Math.random() * domain + from;
  }

  export function cap(lowerBound: number, value: number, upperBound: number) {
    return Math.max(lowerBound, Math.min(upperBound, value));
  }
}