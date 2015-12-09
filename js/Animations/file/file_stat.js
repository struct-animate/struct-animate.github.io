/*jslint indent: 4, nomen: true, devel: true, vars: true, browser: true */
/*globals jQuery, $, UI, LIB*/
$(function(){
		//'use strict';

	    var ROUGE = "rgba(255, 0, 0, 0.6)",
			TRANS = "rgba(0, 0, 0, 0)",
			VERT  = "rgba(0, 255, 0, 0.6)",
			BLEU  = "rgba(0, 0, 255, 0.6)",
			_BLEU = "rgba(0,255,255,0.6)",
			JAUNE = "#FFC",
			GRIS  = "#EEE";

    var Q = LIB.getQueue();
         UI.init({queue:Q});
    var tab = [],
        max_taille = 10,
        taille = 0;
 var UNIT = 50, tabX = 100, tabY = 60, tabw=180,TAILLE=8;
 
 var output =LIB.$('#output'),
     stEnfiler=$('#stEnfiler').button(),
     stDefiler=$('#stDefiler').button();

 var indice=4;
 var F_Statique=LIB.Rect({height:UNIT*TAILLE+'px', 
                          width: tabw+'px', 
                          x: tabX, 
                          y:tabY-20, 
                          output:output , 
                          background:GRIS,
                          queue:Q});
 var tete=LIB.Rect({height:UNIT+'px', 
                    width: tabw+'px',
                    x:tabX,
                    y:tabY-20+4*UNIT,
                    output:output,
                    background:'#FFF',
                    borderColor:'rgba(255,0,255,0.6)',
                    borderWidth:2+'px',
                    queue:Q});	
 var TETE=LIB.Comment({x:5,
                       y:tabY-16+4*UNIT,
                       height:UNIT-15+'px',
                       width:'60px',
                       background:'#FFF',
                       borderColor:'rgba(255,0,255,0.6)',
                       borderWidth:'2px',
                       html:' La <strong>tête</strong>',
                       output:output,
                       queue:Q});
 var tab2=[];
 
 function st_filePleine(){
 return(indice == 5);
 }
 
 function st_fileVide(){
	 return(indice == 4);
 }
 
 function ENFILER_ST(valeur){
    UI.selectToolbar(0); 
	if(st_filePleine()){
		var commentaire=LIB.Comment({x:tabX+tabw+20,
									 y:tabY-3+4*UNIT,
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
	}
	else{
		if(valeur === null) return;	
		if(parseInt(valeur) != valeur){ 
						 var comment=LIB.Comment({x:tabX-5*UNIT,y:tabY-180,background:JAUNE,height:'35px',width:'340px',html:'veuillez entrer une valeur numérique entière SVP  !',output:output});
						 comment.animate({background:JAUNE},1500,1500);
					     comment.remove();
						 Q.enQueue(function () {
						  UI.selectToolbar(1);
						 }, 0); 
						 return;
						 }
		indice--;
		valeur=parseInt(valeur);
		if(indice<0) indice+=TAILLE;
		
		  var rectval=LIB.RectVal({x:0,
		                           y:0,
		                           height:UNIT+'px',
		                           width:UNIT+'px',
		                           output:output,
		                           background:GRIS,
		                           queue:Q,
		                           val:valeur});
               rectval.animate({x:tabX,y:tabY-20+indice*UNIT,background:VERT,width:tabw+'px'},1000,1000);	
               rectval.animate({background:GRIS},500,500);
               tab2.push(rectval);
               var comment=LIB.Comment({x:tabX+tabw+20,
                                        y:tabY-40+indice*UNIT,
                                        height:'35px',
                                        width:'110px',
                                        background:JAUNE,
                                        output:output,
                                        queue:Q,
                                        html:'<em>Queue</em> de la file'});	 	
		           comment.animate({},1000,1000);
		           comment.remove();
		}
	Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0); 
  }
	
function DEFILER_ST(){
    UI.selectToolbar(0);
	if(st_fileVide()){
		var commentaire=LIB.Comment({x:tabX+tabw+20,
									 y:tabY-26+4*UNIT,
									 width:'70px',
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
		}
	else{
		tab2[0].animate({background:VERT},500,0);
		tab2[0].animate({x:tabX+3*tabw,y:0,scaleX:0,scaleY:0,rotate:30,background:ROUGE},1500,1500);
		tab2[0].remove();
		if(tab2.length>1){
			var comment=LIB.Comment({x:tabX+tabw+20,y:tabY,height:'55px',width:'220px',html:'décalage des éléments de la file (les cases du tableau) vers la tête',output:output});
			comment.animate({background:JAUNE},1500,1500);
			comment.remove();
		}
		if(tab2.length == 2 ) {
		 	tab2[0]=tab2[1];
		 	tab2[0].animate({y:tabY-20+3*UNIT,background:BLEU},500,500);
			tab2[0].animate({background:GRIS},500);
			tab2.length--;
		}
		else{
		for(var j=0;j<tab2.length-1;j++) {
				tab2[j]=tab2[j+1];				
				if(j<3) tab2[j].animate({y:tabY-20+(3-j)*UNIT,background:BLEU},500,500);
			    else if(j==3) {tab2[j].animate({y:tabY-20,background:BLEU},500,500);}
			    else if(j==4) {tab2[j].animate({y:tabY-20+7*UNIT,background:BLEU},500,500);}
			    else if(j==5) {tab2[5].animate({y:tabY-20+6*UNIT,background:BLEU},500,500);}
				tab2[j].animate({background:GRIS},500);
				
				
			}
			tab2.length--;
		}
		indice++;
		if(indice==TAILLE) indice=0;
	}	
  Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0); 	

 }
 
  UI.inputMenu({
        button: stEnfiler,
        onok: ENFILER_ST,
        autoClear: true,
        text: "Entrer une valeur entière SVP"
    });
  stDefiler.bind('click',DEFILER_ST);													  
  
  
 function afficherPrincipe() {
		
		$("#principe").dialog({ height: 590, width: 1000, autoOpen: false, modal: true , title : "Principe"});
		$("#principe").dialog("open");
	};           
 //afficherPrincipe();  
});


