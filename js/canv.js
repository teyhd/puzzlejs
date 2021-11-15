
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var inputImage = new Image();
    inputImage.onload = loadimg;
    inputImage.onerror=() =>{show_msg("Вы прошли все уровни!</br>Начать сначала?","#c62626",0)};
    game_init();
var pies;
var field;
var inputWidth;
var inputHeight;
var coef;
var dragok;
var startY,startX,wasx,wasy;
var BB;
var offsetX;
var offsetY;
var lvl_val;
var lvl;

$("#help").click(function() {
    if (stay('help')>0){
        let h = stay('help');
        stay('help',h-1);
        help_me();
    }
    show_help();
});

function show_help(){
    if (stay('help')<=0){
        $("#help").text('Пусто');
    } else{
        $("#help").html('');
        for (var i = 0; i < stay('help'); i++) {
             $("#help").append( `<img src="img/help.png" height="35" />` );
        }
    }    
}

function game_init(){
    if (name=='undefined' || name=='')
    get_name();
    else {
        console.log(name);
        lvl = parseInt(getCookie(`${name}_lvl`));
        if (isNaN(lvl)) {
            lvl_up(1);
            return 0;
        }
        
        $("#plvl").text(`Пазлы уровень: ${lvl}`);
        name_text.text("Игрок: "+name);
        show_help();
        lvl_val = 2+ Math.floor(lvl / 5);
        console.log(lvl_val);  
        
        console.log(lvl);
        inputImage.src = `img/${lvl}.jpg`;
        
        pies=[];
        field = [];
    inputWidth = inputImage.naturalWidth;
    inputHeight = inputImage.naturalHeight;
    coef = (inputWidth/inputHeight)* Math.abs(Math.ceil((inputHeight-window.innerHeight))/tesz);
        dragok = false;
        startY,startX,wasx,wasy;
        BB=canvas.getBoundingClientRect();
        offsetX=BB.left;
        offsetY=BB.top;    
        lvl_val;  
        show_msg("Вы готовы начать?","#577fd2",-1);  
    }
}
function lvl_up(val){
     let lvl = getCookie(`${name}_lvl`);
          if(typeof(val) != "undefined" && val !== null) {
    lvl = val;
    }  else lvl = parseInt(lvl)+1;
     document.cookie = `${name}_lvl=${lvl}`;
     game_init();
}

function stay(type,val,planame=name){
    let tmp = getCookie(`${planame}_${type}`);
    
    if(val!=undefined){
        document.cookie = `${planame}_${type}=${val}`;
    } else{
        return parseInt(tmp);
    }
    console.log(val);
    
}
var tesz = 2;

function loadimg(){

    inputWidth = inputImage.naturalWidth;
    inputHeight = inputImage.naturalHeight;   
    
    //if ((window.innerHeight-420)/inputHeight < window.innerWidth/inputWidth){
        coef = (inputHeight+inputHeight/lvl_val) / (window.innerHeight-((window.innerHeight/100)*20));
   // } else coef = inputWidth/window.innerWidth;
    

   /* if ((inputHeight*4)<window.innerHeight){
        coef = 1/2;
        
    } else {
        coef = 2;
    }*/
    console.log(coef);
    /*console.log(coef);
    if(window.innerHeight<=inputHeight){
       coef = (window.innerHeight+500)/inputHeight
    }else{
       coef =  (window.innerHeight+500)/inputHeight/10
    }*/
  
    dragok = false;
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    canvas.onmousemove = myMove;
    $( window ).resize(function() {
      BB=canvas.getBoundingClientRect();
     offsetX=BB.left;
     offsetY=BB.top;
    });
//  console.log(coef);
    /*console.log(inputWidth);
    console.log(inputWidth/coef);*/
    canvas.width = inputWidth/coef+21;
    $( ".can" ).width(canvas.width);
    canvas.height = inputHeight/coef+inputHeight/coef/lvl_val;
    BB=canvas.getBoundingClientRect();
    offsetX=BB.left;
    offsetY=BB.top;    
    init();
}
function init() {
    for (var i = 0; i < lvl_val; i++) {
        for (var j = 0; j < lvl_val; j++) {
           // console.log(i);
        pies.push([
        inputWidth/lvl_val*i,
        inputHeight/lvl_val*j,
        inputWidth/lvl_val,
        inputHeight/lvl_val, 
        
        inputWidth/coef/lvl_val*i,
        inputHeight/coef/lvl_val*j,
        inputWidth/coef/lvl_val,
        inputHeight/coef/lvl_val,
        false,1]);  
        
        field.push([inputWidth/coef/lvl_val*i,inputHeight/coef/lvl_val*j,inputWidth/coef/lvl_val,inputHeight/coef/lvl_val,false]);
        }
    }
    //console.log(pies);
    //console.log(field);
    shaf();
    draw();

//console.log(getRan(0, lvl_val*lvl_val));
//return [inputWidth,coef,inputHeight];
}
function prog_bar(){
    ctx.fillStyle = "#bc1c4b";
    ctx.clearRect(inputWidth/coef,1,20,inputHeight/coef+(inputHeight/coef/lvl_val));
    //ctx.fillRect(inputWidth/coef, time*((inputHeight/coef+158)/lvl_sec),20,1);
    ctx.fillRect(inputWidth/coef+2, time*((inputHeight/coef+(inputHeight/coef/lvl_val))/lvl_sec),18,canvas.height);
    ctx.strokeRect(inputWidth/coef,1,20,inputHeight/coef+(inputHeight/coef/lvl_val));
    ctx.fillStyle = "#ffffff";
    ctx.font = '10pt georgia';
    ctx.textAlign = 'center';
    ctx.fillText(`${time}`, inputWidth/coef+10, (inputHeight/coef+inputHeight/coef/lvl_val)/2);
   // console.log(time*((inputHeight/coef+158)/lvl_sec));
}            
function border(x,y){
let frm = [    0,y,
               x,y,
               x,0,
               0,0,
               
               0,y+inputHeight/coef/lvl_val,
               x,y+inputHeight/coef/lvl_val,
               //x,y+80, 
               //0,y+80, 
              // 0,y, 
               x,y, 
               x,y+80,
    ];            
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineWidth = 2;
    for (var i=0; i < frm.length; i+=2) {
       // console.log(i);
        ctx.lineTo(frm[i], frm[i+1]);
    }
    ctx.stroke();
    ctx.fillStyle = "#bc1c4b54";
    ctx.font = '20pt georgia';
    ctx.textAlign = 'center';
    ctx.fillText('Поле для картинок', x/2, y+60);
    prog_bar;
}
function draw_line(xs,ys,x,y){
    ctx.beginPath();
    ctx.moveTo(xs,ys);
    ctx.lineWidth = 2;
    ctx.lineTo(x, y);
    ctx.stroke();
    
}
function puz(x,y){
    ctx.lineWidth = 1;
    for (let i = 0; i < lvl_val; i++) {
            draw_line(i*(x/lvl_val),0, i*(x/lvl_val),y);
            draw_line(0,i*(y/lvl_val),x,i*(y/lvl_val));
    }
    border(x,y);
}
function draw(){
    ctx.clearRect(0, 0,  canvas.width-21, canvas.height);
    for (var i = 0; i < pies.length; i++) {
        ctx.drawImage(inputImage,
        pies[i][0],
        pies[i][1],
        pies[i][2],
        pies[i][3],
        pies[i][4],
        pies[i][5],
        pies[i][6]/pies[i][9],
        pies[i][7]/pies[i][9]);
    }
    puz(inputWidth/coef,inputHeight/coef);
    prog_bar();
}

function help_me(){
  let err = is_win();    
  let img = pies[err];
  let fi = field[err];
  ctx.fillStyle = "#f71a0059";
  ctx.fillRect(img[4], img[5], img[6], img[7]);
  ctx.fillStyle = "#59f70054";
  ctx.fillRect(fi[0], fi[1], fi[2], fi[3]);
}

function myUp(e){
    let moved_id=false;
    let field_id=false;
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    
    // clear all the dragging flags
    if(dragok){
        
     dragok = false;
    for(var i=0;i<pies.length;i++){
        if (pies[i][8]===true){
            moved_id = i;
            console.log(moved_id);
            pies[i][8]=false;
        }
        
    }        
for (var i = 0; i < field.length; i++) {
           if(field[i][4]===moved_id){
               field_id = i; 
               break;
           }
}
       for (var i = 0; i < field.length; i++) {

                    if(pies[moved_id][4]+pies[moved_id][6]/2>field[i][0] && pies[moved_id][5]+pies[moved_id][7]/2>field[i][1]&&pies[moved_id][4]+pies[moved_id][6]/2<field[i][0]+field[i][2] &&pies[moved_id][5]+pies[moved_id][7]/2<field[i][1]+field[i][3]){
                           
                if (field[i][4]!==false && field[i][4]!==moved_id) {
                    console.log(moved_id);
                    pies[moved_id][4] = wasx;
                    pies[moved_id][5] = wasy;   
                    draw();
                    console.log(is_win());
                    return 0;
                    } else {
                        if (field_id!==false) 
                        field[field_id][4] =false;
                        field[i][4] = moved_id;
                        pies[moved_id][4]=field[i][0];
                        pies[moved_id][5]=field[i][1];  
                        draw();
                        console.log(is_win());
                        return 0;
                         }
                    }               
                    //console.log(`${j} ${pies[j][4]} >${field[i][0]}&&${pies[j][5]}>${field[i][1]}`)
            }      
              if (field_id!==false) 
              field[field_id][4] =false;
             console.log(is_win()); 
                // console.log(field); 
draw();

    
    }
    console.log(field);
}
function myDown(e){

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx=parseInt(e.clientX-offsetX);
        var my=parseInt(e.clientY-offsetY+window.scrollY);

        // test each rect to see if mouse is inside
        dragok=false;
        for(var i=0;i<pies.length;i++){
            var r=pies[i];
            if(mx>r[4] && mx<r[4]+r[6] && my>r[5] && my<r[5]+r[7]){
                // if yes, set that rects isDragging=true
                
                dragok=true;
                r[8]=true;
                wasx = r[4];
                wasy = r[5];
                break;
            }
        }
        // save the current mouse position
        startX=mx;
        startY=my;
    }
function myMove(e){
        // if we're dragging anything...

        if (dragok){

          // tell the browser we're handling this mouse event
          e.preventDefault();
          e.stopPropagation();

          // get the current mouse position
          var mx=parseInt(e.clientX-offsetX);
          var my=parseInt(e.clientY-offsetY+window.scrollY);

          // calculate the distance the mouse has moved
          // since the last mousemove
          var dx=mx-startX;
          var dy=my-startY;

          // move each rect that isDragging 
          // by the distance the mouse has moved
          // since the last mousemove
          for(var i=0;i<pies.length;i++){
              var r=pies[i];
              if(r[8]){
                  r[4]+=dx;
                  r[5]+=dy;
              }
              if (r[5]+r[7]/2>field[field.length-1][1]+field[field.length-1][3]){
                pies[i][9] = 1.5;
              } else pies[i][9] =1;
              
              if (r[5]+r[7]/2<field[0][1]){
                
                pies[i][4] = wasx;
                pies[i][5] = wasy;
                myUp(e);
              }
          }

          // redraw the scene with the new rect positions
          draw();

          // reset the starting mouse position for the next mousemove
          startX=mx;
          startY=my;

        }
    }
function is_win(){
    for (var i = 0; i < field.length; i++) {
        if (field[i][4]===i){
            //alert(field[i][4]);
        } else {
            console.log(`${field[i][4]} ${i}`);
            return i;
        }
    }
    draw();
    show_msg("Уровень пройден","#57d2be",1);
    return true;
}    
function shaf(){
    let max = lvl_val*lvl_val;
    for (let co = 0; co < 1000; co++) {
       pies=swap(getRan(0, max), getRan(0, max));
    }
    field_init();
  //  console.log(pies);
}
function field_init(){
     for (var i = 0; i < field.length; i++) {
            outer: for (var j = 0; j < pies.length; j++) {
                    if(pies[j][4]+pies[j][6]/2>field[i][0] && pies[j][5]+pies[j][7]/2>field[i][1]&&pies[j][4]+pies[j][6]/2<field[i][0]+field[i][2] &&pies[j][5]+pies[j][7]/2<field[i][1]+field[i][3]){
                        
                        field[i][4] = j;
   
                        pies[j][4]=field[i][0];
                        pies[j][5]=field[i][1];
                        draw();
                       // console.log(`${i} ${field[i]}`);
                               //i++;    
                               break;
                    }  else {
                        field[i][4] = false;
                        //console.log(`${i} ${field[i]}`);
                    }
                    //console.log(`${j} ${pies[j][4]} >${field[i][0]}&&${pies[j][5]}>${field[i][1]}`)
                }
            }      
}
function swap(ir,jr){
    let tx,ty,txx,tyy;
  // console.log(`${ir} c ${jr}`);
    //console.log(`До ${pies[ir]} c ${pies[jr]}`);
 // console.log(`ДО ${pies[ir][0]} ${pies[jr][0]}`);
 //   tx = pies[ir][0];
   // ty = pies[ir][1];
    txx = pies[ir][4];
    tyy = pies[ir][5];
    
   // pies[ir][0] = pies[jr][0]+10;
   // pies[ir][1] = pies[jr][1];
    pies[ir][4] = pies[jr][4];
    pies[ir][5] = pies[jr][5];
    
  //  pies[jr][0] = tx;
  //  pies[jr][1] = ty;
    pies[jr][4] = txx;
    pies[jr][5] = tyy;
    // console.log(`После ${pies[ir][0]} ${pies[jr][0]}`);
    return pies;
    //console.log(`После ${pies[ir]} c ${pies[jr]}`);
}
function getRan(min, max) {
    return  Math.floor(Math.random() * (max - min) + min);
}

