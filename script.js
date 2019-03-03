var output = document.querySelector("h3");
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

//When window resized, adjust height and width variables.
var resizeEvent = function(){
  width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  halfHeight = height/2;
  halfWidth = width/2;
  console.log(halfWidth);
}
window.addEventListener("resize", resizeEvent);

function colorChanged(){
  body.style.background = `linear-gradient(${deg}deg, ${color1.value}, ${pct}%, ${color2.value})`;
  output.textContent = body.style.background + ";";
}

dragElement(mouse);

//When mouse dragged, get the element and the cursor postion (x,y)
function dragElement(elmnt) {

  elmnt.classList.toggle("mouse-transition");
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  //Call the drawScreen method draw new gradient
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
    drawScreen(pos3, pos4);
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    elmnt.classList.toggle("mouse-transition");
  }
}

// Draw the gradient by calculating the gradient angle by the cursor position
// and calculating the percentage by how far away from center the cursor is
function drawScreen(x, y){
  if(x > halfWidth){
    a = Math.abs(halfHeight - y);
    b = Math.abs(halfWidth - x);
    c = Math.sqrt(a*a + b*b);
    var cosA = (b*b + c*c - a*a) / (2*b*c);
    cosA = Math.acos(cosA);
    cosA = cosA*180/Math.PI;
    deg = cosA;
    pctY = (a / halfHeight) * 100;
    pctX = (b / halfWidth) * 100;
    pct = Math.max(pctY, pctX);
    if(y < halfHeight){
      deg = 0 - deg;
    }
  }
  else {
    console.log(x + " " + y + halfWidth + " " + halfHeight);
    a = Math.abs(halfWidth - x);
    b = Math.abs(halfHeight - y);
    c = Math.sqrt(a*a + b*b);

    var cosA = (b*b + c*c - a*a) / (2*b*c);
    cosA = Math.acos(cosA);
    cosA = cosA*180/Math.PI;
    deg = cosA;
    pctY = (b / halfHeight) * 100;
    pctX = (a / halfWidth) * 100;
    pct = Math.max(pctY, pctX);
    if(y > halfHeight){
      deg += 90;
    }
    else{
      deg = -90 - deg;
    }
  }
  colorChanged();
}
