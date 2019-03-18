var color1 = document.querySelector(".color1");
var color2 = document.querySelector(".color2");
var body = document.getElementById("gradient");
var mouse = document.getElementById("mouse-icon");
var deg = 90;
var pct = 50;
var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var halfHeight = height/2;
var halfWidth = width/2;
color1.addEventListener("input", colorChanged);
color2.addEventListener("input", colorChanged);

//When window resized, adjust client height and width variables.
var resizeEvent = function(){
  width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  halfHeight = height/2;
  halfWidth = width/2;
}
window.addEventListener("resize", resizeEvent);

//Change gradient color when a new color has been selected
function colorChanged(){
  body.style.background = `linear-gradient(${deg}deg, ${color1.value}, ${pct}%, ${color2.value})`;
  output.textContent = body.style.background + ";";
}

dragElement(mouse);

//When mouse dragged, get the element and the cursor postion (x,y)
function dragElement(elmnt) {

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    elmnt.classList.toggle("mouse-transition");
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  // This gets called every 0.1 seconds, finds the new cursor position and draws
  // calls the function to draw the gradient
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (pos4) + "px";
    elmnt.style.left = (pos3) + "px";
    // Draw the background gradient with the new parameters 
    drawScreen(pos3, pos4);
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    elmnt.classList.toggle("mouse-transition");
  }
}

//This method draws the gradient by calculating two values
// 1: Angle of gradient
//    Using pythagorean theorem to create a triangle and then triganometry to find the angle
//    center *
//  angle -> | \
//           |  \
//           |   \
//    side a |    \ side c
//           |     \
//           |______\ <- element position
//            side b
//    side a is calculated as the difference between center and elements y-value
//    side b is calculated as the difference betweeen centet and elements x-value
//    side c is calulated using pythag. c^2 = a^2 + b^2
//    angle is calculated using trig
// 2: Percentage of color 1 and color 2
//    this is found by calculating how far the draggable element is away from the
//    center (original location of element) as opposed to the nearest edge of screen  
//      e.g. all the way to the left is 100%, center is 0% and between left and center is 50%
function drawScreen(x, y){
  //Finding the three sides
  let [a,b,c] = createTriangle(x,y);
  //Calculation is slightly different for each half of the screen
  if(x > halfWidth){
    //Trig to find angle
    deg = trigCosA(a,b,c);
    // Calculating percentage 
    pct = percentageFromCenter(a, b);
    // The degree in linear-gradient go -180 to 180 so here we use -90 to 90
    if(y < halfHeight){
      deg = 0 - deg;
    }
  }
  else {
    //Trig to find angle
    deg = trigCosA(b, a,c);
    // Calculating percentage 
    pct = percentageFromCenter(b, a);
    // The degree in linear-gradient go -180 to 180 so here we use -180 to -90 and 90 to 180
    if(y > halfHeight){
      deg += 90;
    }
    else{
      deg = -90 - deg;
    }
  }
  colorChanged();
}

function trigCosA(a,b,c){
  let cosA = (b*b + c*c - a*a) / (2*b*c);
  cosA = Math.acos(cosA);
  return cosA*180/Math.PI;
}

function percentageFromCenter(a,b){
  let pctY = (a / halfHeight) * 100;
  let pctX = (b / halfWidth) * 100;
  return Math.max(pctY, pctX);
}

function createTriangle(x, y){
    a = Math.abs(halfHeight - y);
    b = Math.abs(halfWidth - x);
    //Pythag to find c
    c = Math.sqrt(a*a + b*b);
    return[a,b,c];
}
