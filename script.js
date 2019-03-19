var output = document.getElementById("code");
var color1 = document.getElementById("color1");
var color2 = document.getElementById("color2");
var body = document.getElementById("gradient");
var mouse = document.getElementById("mouse-icon");
var scrollWheel = document.getElementById("scroll-wheel");
var radioBtns = document.getElementsByClassName("radio");
var spans = document.getElementsByClassName('span');
var warnMsg = document.getElementById('warnMsg');
var deg = 90;
var pct = 50;
var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var halfHeight = height/2;
var halfWidth = width/2;

// Attaching radio buttons to click listener
// These radio buttons change how many midpoints we have in our gradient 
for(let i = 0; i < radioBtns.length; i++){
  radioBtns[i].addEventListener('click', colorChanged)
  if(i === 2){
    radioBtns[i].addEventListener('click', showMsg)
  } else {
    radioBtns[i].addEventListener('click', hideMsg)
  }
}

//When window resized, adjust client height and width variables.
var resizeEvent = function(){
  width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  halfHeight = height/2;
  halfWidth = width/2;
}
window.addEventListener("resize", resizeEvent);

//Setting up Color pickers
const pickr1 = new Pickr({
    el: '.color-picker1',
    default: 'rgb(85, 208, 120)',
    comparison: true,
    useAsButton: true,
    defaultRepresentation: 'HEX',
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            hsva: true,
            input: true,
            clear: false,
            save: false
        }
    }
});

const pickr2 = new Pickr({
    el: '.color-picker2',
    comparison: true,
    useAsButton: true,
    default: 'rgb(0, 18, 192)',
    defaultRepresentation: 'HEX',
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            hsva: true,
            input: true,
            clear: false,
            save: false
        }
    }
});
//Attaching the change listeners to the colour pickers
//These will change the background gradient color and button color live 
pickr1.on('change', (...args) => {
    const {toHEX} = args[0]
    color1.value = args[0].toHEX();
    color1.style.background = args[0].toHEX();
    colorChanged()
  });
pickr2.on('change', (...args) => {
  const {toHEX} = args[0]
  color2.value = args[0].toHEX();
  color2.style.background = args[0].toHEX();
  colorChanged()
});

//Show the warn message if we are on the third midpoint setting
//pct% functionality on third setting is disabled
function showMsg(){ warnMsg.style.opacity = '1'}
function hideMsg(){ warnMsg.style.opacity = '0'}

//Change gradient color when a new color has been selected
function colorChanged(){
  body.style.background = `linear-gradient( ${deg}deg, ${color1.value}, ${pct}%, ${color2.value} )`;

  //If more than one midpoint is selected
  if(!radioBtns[0].checked){ getMidPoints() }

  //Set css output text
  output.textContent = "background: " +  body.style.background;
  
  //change textColor
  changeTextColor();
}
//Calculates the mid point color codes
function getMidPoints(){
  //Finding first midpoint between two colours chosen
  let [r,g,b] = emphasis_diminish(
    ((parseInt("0x" + color1.value[1] + color1.value[2]) + parseInt("0x" + color2.value[1] + color2.value[2])) / 2), 
    ((parseInt("0x" + color1.value[3] + color1.value[4]) + parseInt("0x" + color2.value[3] + color2.value[4])) / 2),
    ((parseInt("0x" + color1.value[5] + color1.value[6]) + parseInt("0x" + color2.value[5] + color2.value[6])) / 2),
    0.3
  )
  //only one midpoint
  if(radioBtns[1].checked){
    body.style.background = `linear-gradient( ${deg}deg, ${color1.value}, ${pct*0.7}%, rgb(${r},${g},${b}), ${pct*1.3}%, ${color2.value})`;
  } //Three midpoints, calculate between each colour and the last mid point
  else if(radioBtns[2].checked){
    let [r2, g2, b2] = emphasis_diminish(
      (r + (parseInt("0x" + color1.value[1] + color1.value[2]))) /2,
      (g + (parseInt("0x" + color1.value[3] + color1.value[4]))) /2,
      (b + (parseInt("0x" + color1.value[5] + color1.value[6]))) /2,
      0.1
    )
    let [r3, g3, b3] = emphasis_diminish(
      (r + (parseInt("0x" + color2.value[1] + color2.value[2]))) /2,
      (g + (parseInt("0x" + color2.value[3] + color2.value[4]))) /2, 
      (b + (parseInt("0x" + color2.value[5] + color2.value[6]))) /2,
      0.1
    )
    body.style.background = `linear-gradient( ${deg}deg, ${color1.value}, rgb(${r2},${g2},${b2}), rgb(${r},${g},${b}), rgb(${r3},${g3},${b3}), ${color2.value} )`;
  }
}

//This function changes the text color depending on how dark/light it is
function changeTextColor(){
  let total1 = 0
  let total2 = 0
  //Calculate the total RGB value
  for(let i = 1; i < 7; i+=2){
    total1 += parseInt("0x" + color1.value[i] + color1.value[i+1])
    total2 += parseInt("0x" + color2.value[i] + color2.value[i+1])
  }
  //If total is above 375(half of max) for one color then its too bright, change to black text
  //else it is too dark, change to white
  if(total1 > 375){
    color1.style.color = 'black'
  } else {
    color1.style.color = 'white'
  }
  if(total2 > 375){
    color2.style.color = "black"
  }else {
    color2.style.color = 'white'
  }
  //Same but for whole body text content, add up total for both colors and calculate
  //quite a few things to change here.
  if(total1 + total2 > 750){
    mouse.style.border = '2px solid black'
    body.style.color = 'black'
    scrollWheel.style.background = 'black'
    output.style.borderLeft =" 3px solid rgba(0,0,0, 0.5)";
    output.style.borderRight =" 3px solid rgba(0,0,0, 0.5)";
    for(let i = 0; i < radioBtns.length; i++){
      radioBtns[i].style.border = '2px solid black'
    }
    for(let i = 0; i < spans.length; i++){
      spans[i].style.color = 'black'
    }

  } else {
    mouse.style.border = '2px solid white'
    body.style.color = 'white'
    scrollWheel.style.background = 'white'
    output.style.borderLeft =" 3px solid rgba(255,255,255, 0.5)";
    output.style.borderRight =" 3px solid rgba(255,255,255, 0.5)";
    for(let i = 0; i < radioBtns.length; i++){
      radioBtns[i].style.border = '2px solid white'
    }
    for(let i = 0; i < spans.length; i++){
      spans[i].style.color = 'white'
    }
  }
}

// Function to emphasis the strongest colours and take away the weakest
// i thought this would be a good idea to add a bit more flavor to the colors. 
// It seems to work ok. Simple formula 
function emphasis_diminish(r,g,b, p){
  let max = Math.max(r,g,b)
  //if it is close to a shade of gray, do not add color
  if(r >= b - 5 && r <= b +5 && r >= g - 5 && r <= g + 5 && g >= b - 5 && g <= b + 5){
    return [r,g,b];
  }
  //Finds the brightest colour and emphasis's it, dim's the dimmest
  if(max == r){
    r = r * (1+p);
    if(Math.max(b,g) == b){
      g = g * (1-p)
    } else {
      b = b * (1-p)
    }
  } else if(max == b){
    b = b * (1+p)
    if(Math.max(r, g) == r){
      g = g * (1-p)
    } else {
      r = r * (1-p)
    }
  } else {
    g = g * (1+p)
    if(Math.max(r,b) == r){
      b = b * (1-p)
    } else {
      r = r * (1-p)
    }
  }
  //Making sure no value it too big or in negative
  r = r > 255 ? 255 : r 
  b = b > 255 ? 255 : b
  g = g > 255 ? 255 : g
  //Taking away decimal places
  r = Math.trunc(r)
  b = Math.trunc(b)
  g = Math.trunc(g)
  return [r,g,b]
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
  // Calculating percentage 
  pct = percentageFromCenter(a, b);
  //Calculation is slightly different for each half of the screen
  if(x > halfWidth){
    //Trig to find angle
    deg = trigCosA(a,b,c);
    // The degree in linear-gradient go -180 to 180 so here we use -90 to 90
    if(y < halfHeight){
      deg = 0 - deg;
    }
  }
  else {
    //Trig to find angle
    deg = trigCosA(b, a,c);
    // The degree in linear-gradient go -180 to 180 so here we use -180 to -90 and 90 to 180
    if(y > halfHeight){
      deg += 90;
    }
    else{
      deg = -90 - deg;
    }
  }
  deg = deg.toFixed(1);
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
  return Math.max(pctY, pctX).toFixed(1);
}

function createTriangle(x, y){
    a = Math.abs(halfHeight - y);
    b = Math.abs(halfWidth - x);
    //Pythag to find c
    c = Math.sqrt(a*a + b*b);
    return[a,b,c];
}
