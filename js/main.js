const lvl_sec = 60;
var msg = $( ".msg" );
var overlay = $( ".overlay" );
var msg_btn = $( "#msg_btn" );
var name_text = $( "#text_name" );
var scrs = $( "#score" );
var time=60;
var timer = null;
var name='';
var players_name;
var plys;
//show_msg("Вы готовы начать?","#577fd2",-1);

$( "#tabl" ).hide();

$( "#scores" ).click(function() {
    players();
    scrs.html('');
    scrs.append(`<tr><th>Игрок</th><th>Очки</th></tr>`);
    for (var j = 0; j < plys.length; j++) {
       let scroro = stay("lvl",undefined,plys[j])*(stay("time",undefined,plys[j])+1)*(stay("help",undefined,plys[j])+1);
       scrs.append( `<tr><td>${plys[j]}</td><td>${scroro}</td></tr>` );

    }

  $( "#tabl" ).show();
  show_msg("Таблица рекордов",'#577fd2',3)
});

$("#reset").click(function() {
 lvl_up(1);
 name='';
 document.cookie = `name=`;
 get_name(); 
 //window.location.reload(true);
});

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function tick(){
   time -= 1;
  // time_text.text(`Осталось: ${time} `);
   prog_bar();
   if (time < 1){
      g_timer().stopt();
      show_msg("Вы проиграли!!! </br> Хотите попробовать еще раз?","#671212fa",0);
      
      //window.location.reload(true);
   }   
}
function get_name(){
    name = getCookie(`name`);
    show_help();
    console.log(name);
    if (name=='undefined' || name=='' || name==undefined)
    show_msg("Как вас зовут?","#577fd2",2,1); 
    else game_init();
}

function players(nam){
    players_name = getCookie(`players_name`);
    if (nam!=undefined){
        document.cookie = `name=${nam}`;
        players();
        for (var r in plys) {
            if (plys[r]==nam) {
                console.log('Yze est');
                return 0;
            }
        }
        
            if (players_name==undefined){
                players_name = nam;
                document.cookie = `players_name=${players_name}`;
            } else {
                document.cookie = `players_name=${players_name}_${nam}`;
            }
    } else {
        if (players_name!=undefined){
           plys = players_name.split('_');
        }
    }
    
}
function g_timer(){
    function start(){
     if (timer==null) 
     timer = setInterval(tick, 1000);
    }
    function stopt(){
        if (timer!=null) 
            clearInterval(timer);  
            timer = null;
        }
    return { start: start, stopt: stopt};
}
function show_msg(text,color='#577fd2',ev=null,int_tex=null){
 g_timer().stopt();
 overlay.show();   
 $( ".msg p" ).html(text);
 msg.css( "background-color", color );
 msg.show();
 if (int_tex!==null) $( "#inp_text" ).show();
 switch (ev) {
     case -1:
         msg_btn.one( "click", function() {
            if (!isNaN(stay('time')) && stay('time')!=0) time = stay('time');
            else time = lvl_sec;
            overlay.hide();
            msg.hide();
            show_help();
            g_timer().start();
        });
    break;
    
    case 0:
        msg_btn.one( "click", function() {
             name='';
             document.cookie = `name=`;
             get_name(); 
            /*time = lvl_sec;
            lvl_up(1);
             stay("help",3);
             stay("time",0);
            overlay.hide();
            msg.hide();*/
            g_timer().start();
        });          
     break;
     case 1:
        msg_btn.one( "click", function() {
            if (time>60) time = lvl_sec+60;
            else time = lvl_sec+time;
            stay("time",time);
            lvl_up();
            overlay.hide();
            msg.hide();
            g_timer().start();
        });         // code
     break;
     case 2:
        msg_btn.one( "click", function() {
             if($( "#inp_text" ).val()!='' && $( "#inp_text" ).val()!=undefined){
             name = $( "#inp_text" ).val();
             overlay.hide();  
             $( "#inp_text" ).hide();
             msg.hide();
             
             name_text.text("Игрок: "+name);
             players(name);
             console.log(name);  
             
             game_init();
             g_timer().start();
             
             stay("help",3);
             stay("time",0);
             } else {
                 console.log('fuck');
                 get_name();
             }
        });         
     break;
     case 3:
        msg_btn.one( "click", function() {
           msg.hide(); 
           overlay.hide();  
           $( "#tabl" ).hide();
           g_timer().start();
        }); 
     break;
 }
 show_help();
}