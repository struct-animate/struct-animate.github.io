/*jslint indent: 4, nomen: true, devel: true, vars: true, browser: true */
/*globals jQuery, $, UI, LIB*/
$(function(){
	 'use strict';
	 
	  var ROUGE = "rgba(255, 0, 0, 0.6)",
			TRANS = "rgba(0, 0, 0, 0)",
			VERT  = "rgba(0, 255, 0, 0.6)",
			BLEU  = "rgba(0, 0, 255, 0.6)",
			_BLEU = "rgba(0,255,255,0.6)",
			JAUNE = "#FFC",
			GRIS  = "#EEE";
			
	var Q = LIB.getQueue(),  // file d'animation
		tab = [],
        max_taille = 10,
        taille = 0,
        UNIT = 50, 
        tabX = 10, 
        tabY = 100, 
        tabw=180,
        TAILLE=8;
   UI.init({queue:Q});           
             
 var output=LIB.$('#output'),
     enfiler=$('#enfiler').button(),
     defiler=$('#defiler').button(); 
  
 var file=LIB.Rect({height: UNIT+'px', width: UNIT * max_taille+'px', x: tabX, y: tabY, output: output,queue:Q});

/*******************************************/
    function x(i) {
        return tabX + (UNIT * (max_taille-i-1));
    }
    
    function decalageGauche(i){
        for (var j = i; j < taille-1 ; j++){
            tab[j] = tab[j+1];
            tab[j].animate({ x: x(j),background:BLEU }, 800);
            tab[j].animate({background:GRIS},500,100);
        }
    }
/*******************************************/
function file_vide(){
	return taille == 0;
}
function file_pleine(){
		return taille==max_taille;
}

function enfile(valeur){
	
    UI.selectToolbar(0); 
	UI.selectAlgo(0);
	if(file_pleine()){
		var filePleine=LIB.$('#filePleine');
		var commentaire=UI.Comment({x:tabX-UNIT,
									 y:tabY-60,
									 width:'80px',
									 height:'35px',
									 background:TRANS,
									 html:"File pleine",
									 queue:Q,
									 output:output});
									 
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
		if(parseInt(valeur) != valeur){
			 var comment=UI.Comment({x:tabX-100,y:tabY-150,background:JAUNE,height:'35px',width:'275px',html:'veuillez entrer une valeur numérique SVP !!!',output:output});
				 comment.animate({background:JAUNE},2000,2000);
				 comment.remove();
			Q.enQueue(function () {
                      UI.selectToolbar(1);
                     }, 0); 
			return;
		  }
		  else
		  {
		    valeur=parseInt(valeur);
			var enfil=LIB.$('#enfil');
			var rectval = LIB.RectVal({height: UNIT+'px', width: UNIT+'px', x: 0,y: 0, val: valeur,output: output, queue: Q });
			rectval.animate({x: tabX+UNIT*(max_taille-taille-1),y:tabY},1000,0);
			rectval.animate({background:VERT},300,1000);
			rectval.animate({background:GRIS},300,300);
			tab[taille]=rectval;
			taille+=1;
	     }
    }
		Q.enQueue(function () {
                          UI.selectToolbar(1);
                          }, 0);     
			
}

 function defile(){
		 UI.selectToolbar(0); 
		 UI.selectAlgo(1);	
	if(file_vide()){
		var commentaire=UI.Comment({x:tabX+UNIT*max_taille,
									 y:tabY-60,
									 width:'65px',
									 height:'35px',
									 background:TRANS,
									 html:"File vide",
									 queue:Q,
									 output:output});
									 
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
		var commentaire=UI.Comment({x:tabX+UNIT*(max_taille-1),
		                             y:tabY+80,
		                             height:'60px',
		                             width:'195px',
		                             background:TRANS,
		                             html:"Défilement de l'élément qui se trouve dans la tête de la file !!",
		                             queue:Q,
		                             output:output});
		commentaire.animate({background:JAUNE},2500,0);
		tab[0].animate({background:VERT},1000,0);
		tab[0].animate({x:tabX+UNIT*max_taille+150,y:-UNIT,background:ROUGE,scaleX:0,scaleY:0},1500,1000);
		tab[0].remove();
		commentaire.remove();
		if(taille>1){
		commentaire=UI.Comment({x:tabX+UNIT*(max_taille-1),
		                         y:tabY-2*UNIT,
		                         background:JAUNE,
		                         height:UNIT+'px',
		                         width:'250px',
		                         html:'Décalage aprés défilement vers la tête de la file',
		                         queue:Q,
		                         output:output});
		commentaire.animate({background:JAUNE,x:tabX+UNIT*(max_taille-taille)},taille*1000,0);
	  }
		decalageGauche(0);
		commentaire.remove();
		taille-=1;
	}
       Q.enQueue(function () {
                          UI.selectToolbar(1);
                          }, 0); 	
 }
 
 UI.inputMenu({
        button: enfiler,
        onok: enfile,
        autoClear: true,
        text: "Entrer une valeur entière SVP"
    });   
 defiler.bind("click",defile);
 	
 function afficherPrincipe() {
		
		$("#principe").dialog({ height: 590, width: 1000, autoOpen: false, modal: true , title : "Principe"});
		$("#principe").dialog("open");
	};           
 afficherPrincipe();	 
});	 
	 
