

bearings = [{index:0,distance:20,bearing:30}];
reactiveBearings = new ReactiveVar(bearings);
var hasCrashed = new ReactiveVar(false);
var boatsMoving = new ReactiveVar(false);


Template.panel.helpers({

bearings: function(){return reactiveBearings.get()},
index: function(){return this.index+1},
hasCrashed:function(){
return hasCrashed.get()},
boatsMoving: function(){

return boatsMoving.get();

}
})

Template.panel.events({
'click #addSegment':function(e){

e.preventDefault();
insertNewBearing({distance:10,bearing:20,index: reactiveBearings.get().length});

},
'click #setSail':function(e){
boatsMoving.set(true);
plotPath();

},
'click .deleteSegment':function(e,t){

var segments = reactiveBearings.get();
if(segments.length>1){
segments.splice(this.index,1);
console.log(segments);

reactiveBearings.set([].concat(segments));
}
},

'click #resetTrip':function(e){

clearLines();
clearBoats();
clearDots();

clearInterval(crashMonitor);
clearInterval(timeMonitor);
clearInterval(finishMonitor);

boatsMoving.set(false)
}
})

insertNewBearing = function(newBearing){
var currentBearings= reactiveBearings.get();
reactiveBearings.set(currentBearings.concat([newBearing]));


}
