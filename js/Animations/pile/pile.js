/*jslint indent: 4, nomen: true, devel: true, vars: true, browser: true */
/*globals jQuery, $, UI, LIB*/
$(function(){
	 'use strict';
	 
	    var ROUGE = "rgba(255, 0, 0, 0.6)",
			TRANS = "rgba(0, 0, 0, 0)",
			VERT  = "rgba(0, 255, 0, 0.6)",
			BLEU  = "rgba(0, 0, 255, 0.6)",
			JAUNE = "#FFC",
			GRIS  = "#EEE",
            UNIT=40 ,
            tabx=160,
            taby=40,
            tabw=180,
            TAILLE=10,           
			Q = LIB.getQueue(),  // file d'animation           
            tab=[],
		    i=10;
 UI.init({queue:Q});		     
 var output =LIB.$('#output'),
     empiler=$('#empiler').button(),
     depiler=$('#depiler').button(),
     pile = LIB.Rect({height:UNIT*TAILLE+'px', 
                     width: tabw+'px', 
                     x: tabx, 
                     y:taby, 
                     output: output, 
                     background:GRIS,
                     queue:Q}),
     curr_pos=0;  

    function isPileFull(){
		return curr_pos==10;	
	}
	function isPileEmpty(){
		return curr_pos==0;	
	}
	
	function empile(valeur){
		UI.selectToolbar(0); 
		UI.selectAlgo(0);
		if(isPileFull()) {
			var commentaire=UI.Comment({x:tabx+tabw+20,
										 y:taby-UNIT-10,
										 width:'80px',
										 height:'35px',
										 background:TRANS,
										 'text-align' : 'center',
										 queue:Q,
										 output:output});
										 commentaire.html("Pile pleine");
			commentaire.animate({background:ROUGE},500,500);
			commentaire.animate({background:TRANS},100,100);
			commentaire.animate({background:ROUGE},500,500);
			commentaire.animate({background:TRANS},100,100);
			commentaire.animate({background:ROUGE},500,500);
			commentaire.animate({background:TRANS},100,100);
			commentaire.animate({background:ROUGE},500,500);
			commentaire.remove();	
			Q.enQueue(function () {
							  UI.selectToolbar(1);
							  }, 0); 				
					 return;
		}
		else
		  { 
				if(valeur === null) return;
				
				if(parseInt(valeur,10) != valeur){ 
								 var comment=UI.Comment({x:0,y:taby-150,background:JAUNE,height:'35px',width:'340px',html:'veuillez entrer une valeur numérique entière SVP !',output:output});
								   comment.animate({background:JAUNE},2000,2000);
								   comment.remove();
								 Q.enQueue(function () {
											UI.selectToolbar(1);
										  }, 0); 
								 return;
							 }
				valeur=parseInt(valeur,10); 
			
				var rectval=LIB.RectVal({x:tabx,
										 y:-UNIT,
										 height:UNIT+'px',
										 width:UNIT+'px',
										 background:GRIS,
										 queue:Q,
										 output:output,
										 val:valeur});
										 
				rectval.animate({x:tabx,y:UNIT*i+taby-UNIT,width:tabw+'px'},1500,0);
				rectval.animate({background:JAUNE},1500,1300);
				rectval.animate({background:GRIS},300,900);	
				tab.push(rectval);
				i--;	
				curr_pos += 1;
			   if(tab.length == 1){
				 var comment=UI.Comment({x:tabx+tabw+20,y:UNIT*i+taby-UNIT,height:'35px',width:'125px',html:'Sommet de pile',output:output});
                     comment.animate({background:JAUNE},1500,1500);
					 comment.remove();
				}	
	      }
        Q.enQueue(function () {
                          UI.selectToolbar(1);
                          }, 0); 
	 }
	 
	function depile(){
		 UI.selectToolbar(0); 
		 UI.selectAlgo(1);
		 if(isPileEmpty())
		 {
			   var commentaire=UI.Comment({x:tabx+tabw+20,
										 y:taby+UNIT*(TAILLE-1),
										 width:'75px',
										 height:'35px',
										 background:TRANS,
										 'text-align' : 'center',
										 html:'Pile vide',
										 queue:Q,
										 output:output});
			   // commentaire.html('Pile vide');                         
				commentaire.animate({background:ROUGE},500,500);
				commentaire.animate({background:TRANS},100,100);
				commentaire.animate({background:ROUGE},500,500);
				commentaire.animate({background:TRANS},100,100);
				commentaire.animate({background:ROUGE},500,500);
				commentaire.animate({background:TRANS},100,100);
				commentaire.animate({background:ROUGE},500,500);
				commentaire.remove();
				Q.enQueue(function () {
								  UI.selectToolbar(1);
								  }, 0); 
				return;
		 }
		 else
		 {
			 curr_pos -= 1;	
			 tab[curr_pos].animate({background:VERT},1000,500);
			 
			 tab[curr_pos].animate({x:tabx+2*tabw,
									y:UNIT,
									background:ROUGE,
									rotate:30,
									scaleX:0,
									scaleY:0},1000,1000);
									
			 tab[curr_pos].remove();
			 tab.pop();
			 i++;
	     }
	     Q.enQueue(function () {
                          UI.selectToolbar(1);
                          }, 0); 
 }		

  	
// integration des buttons

 UI.inputMenu({
        button: empiler,
        onok: empile,
        autoClear: true,
        text: "Entrer une valeur entière SVP"
    });
    
 depiler.bind("click",depile);	
 
 function afficherPrincipe() {
		
		$("#principe").dialog({ height: 590, width: 1000, autoOpen: false, modal: true , title : "Principe"});
		$("#principe").dialog("open");
	};           
 afficherPrincipe();												  

});




