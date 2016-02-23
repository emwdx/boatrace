
var dots = [];
var boats = [];
var lines = [];
var i = 0;
var boatDistance = 0;
var elapsedTime = 0;
var totalTime = 0;
var finishState = 'failure';

var boatSpeed = 10;

function pixelsToCoords(x,y){
var originPixels = [49,545];
var pointBPixels = [796,255];
var originCoords = [0,0];
var pointBCoords = [170,70];

var coordsX = (pointBCoords[0]-originCoords[0])/(pointBPixels[0]-originPixels[0])*(x - originPixels[0]) + originCoords[0];
var coordsY = (pointBCoords[1]-originCoords[1])/(pointBPixels[1]-originPixels[1])*(y -  originPixels[1]) + originCoords[1];

return [parseInt(coordsX),parseInt(coordsY)];
}

function coordsToPixels(x,y){
var originPixels = [49,545];
var pointBPixels = [796,255];
var originCoords = [0,0];
var pointBCoords = [170,70];

var coordsX = (pointBPixels[0]-originPixels[0])/(pointBCoords[0]-originCoords[0])*(x - originCoords[0]) + originPixels[0];
var coordsY = (pointBPixels[1]-originPixels[1])/(pointBCoords[1]-originCoords[1])*(y -  originCoords[1]) + originPixels[1];

return [parseInt(coordsX),parseInt(coordsY)];
}

function plotCoords(paper,x,y){

  var dotSize = 8;
  var dotColor = "rgb(255,0,0)";
return paper.circle(x,y,dotSize).attr({"fill":dotColor});


}

function pointsToDots(paper,coords){

  coords.forEach(function(pt){
  var currentPixels = coordsToPixels(pt[0],pt[1]);
  dots.push(plotCoords(paper,currentPixels[0],currentPixels[1]));

  })


}

function moveTo(start,distance,angle){

if(angle<90){

var newX = start[0]+Math.cos((90 - angle)*3.1415926535/180)*distance;
var newY = start[1]+Math.sin((90 - angle)*3.1415926535/180)*distance;

}
else if(angle>=90 && angle < 180){

  var newX = start[0]+Math.cos((angle - 90)*3.1415926535/180)*distance;
  var newY = start[1]-Math.sin((angle - 90)*3.1415926535/180)*distance;

}

else if(angle >=180 && angle < 270){

  var newX = start[0]-Math.sin((angle - 180)*3.1415926535/180)*distance;
  var newY = start[1]-Math.cos((angle - 180)*3.1415926535/180)*distance;


}
else if(angle >=270 && angle <360){

  var newX = start[0]-Math.cos((angle - 270)*3.1415926535/180)*distance;
  var newY = start[1]+Math.sin((angle - 270)*3.1415926535/180)*distance;


}
return [newX,newY]



}

/*
if(dx>=0){
  if(dy>=0){

     th = 90 - Math.atan(dy/dx)*180/3.1415926535;
  }

  else{

    th = 90 + Math.atan(Math.abs(dy/dx))*180/3.1415926535;

  }

}
else{
  if(dy>=0){

    th = Math.atan(Math.abs(dy/dx))*180/3.1415926535+270;

  }

  else{

    th = 180 + Math.atan(Math.abs(dx/dy))*180/3.1415926535;

  }

}
*/

function clearDots(){

dots.forEach(function(d){

d.remove();

})
dots = [];

}

function clearBoats(){

boats.forEach(function(d){

d.remove();
})
boats = [];

}

function clearLines(){

lines.forEach(function(d){

d.remove();

})
lines = [];

}

function plotPath(){
  i = 0;
  elapsedTime = 0;
  clearDots();
  clearBoats();
  clearLines();
  currentTime.show();
  var bearingDivs = $('.bearingEntry');
  var sailBearings = [];
  bearingDivs.each(function(n,e){

    var newBearing = []
    newBearing[0]=parseInt($(e).find('.bearingDistance').val());
    newBearing[1]=parseInt($(e).find('.bearingAngle').val());
    sailBearings.push(newBearing)

  })

    sailCoords = [[0,0]];
    var travelTime = 0;
    for(var j = 0;j<sailBearings.length;j++){

    var newCoords = moveTo(sailCoords[j],sailBearings[j][0],sailBearings[j][1]);
    sailCoords.push(newCoords);

    var pixelsSailCurrent = coordsToPixels(sailCoords[j][0],sailCoords[j][1]);
    var pixelsSailNext = coordsToPixels(newCoords[0],newCoords[1]);
    var dx = pixelsSailNext[0]-pixelsSailCurrent[0]
    var dy = pixelsSailNext[1]-pixelsSailCurrent[1]

    var pixelDistance= Math.sqrt(dx*dx+dy*dy);
    travelTime += (pixelDistance/boatSpeed);

    }

    console.log(travelTime);
    var finalDistance = Math.sqrt(sailCoords[sailCoords.length - 1][0]*sailCoords[sailCoords.length - 1][0] + sailCoords[sailCoords.length - 1][1]*sailCoords[sailCoords.length - 1][1]);


    var crashMonitor = setInterval(function(){

      if(boats.length>0){

         boats.forEach(function(boat){
           if(boat.attrs){
           if(island.isPointInside(boat.attrs.cx,boat.attrs.cy)){
             boatHasCrashed();

             clearInterval(crashMonitor);
             clearInterval(timeMonitor);
           }
         }
         })

      }

    },50);



      var finishMonitor = setInterval(function(){
          if(boats.length>0){

               boats.forEach(function(boat){

                 if(boat.attrs){
                 if(target.isPointInside(boat.attrs.cx,boat.attrs.cy)&&elapsedTime>10){

                   lines[i-1].show();
                   alert("You did it! Can you do it again in less time?")
                   clearInterval(crashMonitor);
                   clearInterval(timeMonitor);
                   clearInterval(finishMonitor);
                 }
               }


               })


             }



    },100);



    timeMonitor = setInterval(function(){

     elapsedTime+=0.05;
     currentTime.attr({"text":(elapsedTime.toFixed(2)+" seconds")});
     if(elapsedTime>travelTime){
       if(boats.length>0){

            boats.forEach(function(boat){

              if(boat.attrs){
              if(!target.isPointInside(boat.attrs.cx,boat.attrs.cy)){

                lines[i-1].show();
                alert("You didn't end up back at point A. Try again.")
                clearInterval(crashMonitor);
                clearInterval(timeMonitor);
                clearInterval(finishMonitor);
              }
            }


            })


          }


     }


    },50)



     animateBoats();






    //pointsToDots(paper, sailCoords);





}

function animateBoats(){


   if(i>0 && i <sailCoords.length-1){
   boats[i-1].remove();

   }

   if (i == sailCoords.length-1){

     //clearBoats();



   }

   if(i<sailCoords.length -1 && i >= 0){
     if(i>0){
    lines[i-1].show();
  }
    var pixelsSailCurrent = coordsToPixels(sailCoords[i][0],sailCoords[i][1]);
    var pixelsSailNext = coordsToPixels(sailCoords[i+1][0],sailCoords[i+1][1]);
    var dx = pixelsSailNext[0]-pixelsSailCurrent[0]
    var dy = pixelsSailNext[1]-pixelsSailCurrent[1]
var pixelDistance= Math.sqrt(dx*dx+dy*dy);
 var travelTimeSegment = parseInt(pixelDistance*1000/boatSpeed);


   var boat = paper.circle(pixelsSailCurrent[0],pixelsSailCurrent[1],5).attr({"fill":"rgb(210,210,210)"});


   boats.push(boat);
   lines.push(paper.path("M"+pixelsSailCurrent[0]+","+pixelsSailCurrent[1]+" l"+dx+","+dy).attr({"stroke":"white","stroke-dasharray":"-"}).hide());
   boat.animate({cx:pixelsSailNext[0],cy:pixelsSailNext[1]},travelTimeSegment,animateBoats);


   i++;


 }

}

function boatHasCrashed(){

alert('Your boat crashed into the island!');

clearBoats();

}
