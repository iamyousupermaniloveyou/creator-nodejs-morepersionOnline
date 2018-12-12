var util = require("util")
Object.isString = function(){ 
    return Object.prototype.toString.call(this) ==="[object String]"
}
var log   = console.log
// var a = new Array(3,7) 
// a[2] = "中"
// log(a,a.length,a[2])
// var b = new Array(5,7)
// var c = [10,56] 
// log(c.shift(),c)
// log(a.concat(b))
// log(a.concat(c))
// log(a.join('-'))

var date = new Date()
// date.setDate(9)
log(util.format("%d月 %d号 周%d",date.getMonth()+1,date.getDate(),date.getDay()))
date.setTime(date.getTime()+1000*60*24*60)
// log(date.getTime()+10000*24*60)
log(util.format("%d月 %d号 周%d",date.getMonth()+1,date.getDate(),date.getDay()))
log(new Date(date.valueOf()).getDay())

// var arr = ["apple","orange","banager"];
// function noPassValue(){
//     return arr.reduce(function(prev,next){
//       console.log("prev:",prev);
//       console.log("next:",next);
//       return prev;
//     });
//   }
//   function passValue(){
//     return arr.reduce(function(prev,next){
//       console.log("prev:",prev);
//       console.log("next:",next);
//       prev[next] = 1;
//       return prev;
//     },{});
//   } 
//   console.log("No Additional parameter:",noPassValue());
//   console.log("----------------");
//   console.log("With {} as an additional parameter:",passValue());
  // console.log("************************************");
   
  // var initialState = {euros:0, yens: 0};
  // var items = [{price: 10}, {price: 120}, {price: 1000}];
  //  var a = items.reduce(function(state,item){
  //   state.euros = item.price + 1
  //   state.yens = item.price + 2
  //   return state
  // },initialState)

  // console.log("--------1--------");
  // console.log("===",a)
  // console.log("--------2--------");

