
/*jslint indent: 4, nomen: true, devel: true, vars: true, browser: true */
/*globals jQuery, $, UI, LIB*/

$(function(){
	 'use strict';
	    var ROUGE = "rgba(255, 0, 0, 0.6)",
			TRANS = "rgba(0, 0, 0, 0)",
			VERT  = "rgba(0, 255, 0, 0.6)",
			BLEU  = "rgba(0, 0, 255, 0.6)",
			JAUNE = "#FFC",
			GRIS  = "#EEE";
			
 var arithmx= 10 ,
     UNIT=40,
     tabw=180,
     arithmy= 50,
     TAILLE=10;
     
 var Q = LIB.getQueue(); // file d'animation 
  UI.init({queue:Q});           
          
 var ExpAr=$('#btn_exp_ar').button(),
     bottom_left=LIB.$('#bottom-left'),
     output =LIB.$('#output');
 var comment=UI.Comment({x:'10px',y:'10px',height:'80px',width:'285px',background:'#fff',html:"Evaluation de l'expression : a*(((b-c)*d)+e) . <br /><br />En postfixée : a bc- d* e+ *",output:bottom_left});
          
 var pile_arith=LIB.Rect({height:UNIT*TAILLE+'px', 
                          width: tabw+'px', 
                          x: arithmx, 
                          y:arithmy, 
                          output:output, 
                          background:GRIS,
                          queue:Q}); 
 
 function exp_arithm(){
	 UI.selectToolbar(0);
	  var tab=[];
	  
	  var rectval=LIB.RectVal({x:-UNIT,
	                           y:-UNIT,
	                           height:UNIT+'px',
	                           width:UNIT+'px',
	                           background:GRIS,
	                           queue:Q,
	                           output:output,
	                           val:'a'});
	  
	  var commentaire=UI.Comment({x:arithmx+tabw+20,
	                               y:arithmy+(TAILLE-2)*UNIT,
	                               height:'35px',
	                               width:'145px',
	                               background:JAUNE,
	                               html:"Empiler l'opérande 'a'",
	                               queue:Q,
	                               output:output});
	                               
		  rectval.animate({x:arithmx,
		                   y:arithmy+(TAILLE-1)*UNIT, 
		                   width: tabw+'px',
		                   background:VERT},1500,1500);
		                   
		  commentaire.remove();
		  rectval.animate({background:GRIS},500,500);tab[0]=rectval;		  
		  rectval=LIB.RectVal({x:-UNIT,
		                       y:-UNIT,
		                       height:UNIT+'px',
		                       width:UNIT+'px',
		                       background:GRIS,
		                       queue:Q,
		                       output:output,
		                       val:'b'});
		 
		  commentaire=UI.Comment({x:arithmx+tabw+20,
		                           y:arithmy+(TAILLE-3)*UNIT,
		                           height:'35px',
		                           width:'145px',
		                           background:JAUNE,
		                           html:"Empiler l'opérande 'b'",
		                           queue:Q,
		                           output:output}); 
		                           
          rectval.animate({x:arithmx,
                           y:arithmy+(TAILLE-2)*UNIT, 
                           width: tabw+'px',
                           background:VERT},1500,1500);
          commentaire.remove();
		  rectval.animate({background:GRIS},500,500);tab[1]=rectval;
		           
		  rectval=LIB.RectVal({x:-UNIT,
		                       y:-UNIT,
		                       height:UNIT+'px',
		                       width:UNIT+'px',
		                       background:GRIS,
		                       queue:Q,
		                       output:output,
		                       val:'c'});
		  
		  commentaire=UI.Comment({x:arithmx+tabw+20,
		                           y:arithmy+(TAILLE-4)*UNIT,
		                           height:'35px',
		                           width:'145px',
		                           background:JAUNE,
		                           html:"Empiler l'opérande 'c'",
		                           queue:Q,
		                           output:output});
		                           
		  rectval.animate({x:arithmx,
		                   y:arithmy+(TAILLE-3)*UNIT, 
		                   width: tabw+'px',
		                   background:VERT},1500,1500);
		  commentaire.remove();
		  rectval.animate({background:GRIS},500,500);tab[2]=rectval;
		  
		  
		  commentaire=UI.Comment({x:arithmx+tabw+20,
								   y:arithmy+(TAILLE-6)*UNIT,
								   height:'70px',
								   width:'280px',
								   background:JAUNE,
								   html:"Détection de l'opérateur '-' et comme il est binaire alors dépilement des deux derniers éléments de la pile.",
								   queue:Q,
								   output:output});
								   
          commentaire.animate({},3000,3000);commentaire.remove();
          tab[2].animate({x:arithmx+tabw+80,y:arithmy-3*UNIT,background:BLEU},2000,2000);
          tab[2].animate({x:arithmx+tabw+330,background:GRIS},1000,1000);
          tab[1].animate({x:arithmx+tabw+80,y:arithmy-3*UNIT,background:BLEU},2000,2000);
          tab[1].animate({x:arithmx+330-50,background:GRIS},500,500);
         
		  rectval=LIB.RectVal({x:-2*UNIT,
		                       y:arithmy-6*UNIT+UNIT/4,
		                       height:'0px',
		                       width:'0px',
		                       background:GRIS,
		                       queue:Q,
		                       output:output,
		                       val:'-'});
		                       
		  rectval.animate({x:arithmx+330-50+tabw+5+UNIT/4,
						   y:arithmy-3*UNIT+UNIT/4-UNIT,
						   height:UNIT/2+'px',
						   width:UNIT/2+'px',
						   background:VERT},1500,1500);
						   
		  rectval.animate({background:GRIS,
		                   x:arithmx+330-50+tabw+5+UNIT/4,
		                   y:arithmy-3*UNIT+UNIT/4},1000,1000); 
		                   
         var comment=UI.Comment({x:arithmx+tabw+330-2*tabw-80,
							   y:arithmy-3*UNIT+UNIT+10,
							   height:'57px',
							   width:'200px',
							   background:JAUNE,
							   queue:Q,
							   output:output,
							   html:"Execution de l'opération '-' et récupération du résultat: b-c"});  
							         
          comment.animate({},2500,2500);comment.remove();
          tab[2].animate({x:arithmx+1000,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
          tab[1].animate({x:arithmx+1000-tabw-20,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
		  rectval.animate({x:arithmx+800+tabw,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
		  
		  rectval=LIB.RectVal({x:arithmx+1000,
		                       y:arithmy-300,
		                       height:UNIT+'px',
		                       width:UNIT+'px',
		                       background:GRIS,
		                       queue:Q,
		                       output:output,
		                       val:'b-c'});
		                       
          comment=UI.Comment({x:arithmx+tabw+20,
                               y:arithmy+(TAILLE-8)*UNIT,
                               height:'38px',
                               width:'220px',
                               background:JAUNE,
                               queue:Q,
                               output:output,
                               html:"Empilement du résultat: b-c"});   
                                     
          rectval.animate({x:arithmx,y:arithmy+(TAILLE-2)*UNIT,width:tabw+'px'},2000,0);tab[1]=rectval;
          comment.animate({},2500,2500);
          comment.remove();
       
          rectval=LIB.RectVal({x:-UNIT,
                               y:-UNIT,
                               height:UNIT+'px',
                               width:UNIT+'px',
                               background:GRIS,
                               queue:Q,
                               output:output,
                               val:'d'});
		  
		  commentaire=UI.Comment({x:arithmx+tabw+20,
		                           y:arithmy+(TAILLE-4)*UNIT,
		                           height:'35px',
		                           width:'145px',
		                           background:JAUNE,
		                           html:"Empiler l'opérande : d",
		                           queue:Q,
		                           output:output});
		                           
		  rectval.animate({x:arithmx,
		                   y:arithmy+(TAILLE-3)*UNIT, 
		                   width: tabw+'px',
		                   background:VERT},1500,1500);
		                   
		  commentaire.remove();
		  rectval.animate({background:GRIS},500,500);tab[2]=rectval;

		  commentaire=UI.Comment({x:arithmx+tabw+20,
		                           y:arithmy+(TAILLE-6)*UNIT,
		                           height:'70px',
		                           width:'280px',
		                           background:JAUNE,
		                           html:"Détection de l'opérateur '*' et comme il est binaire alors dépilement des deux derniers éléments de la pile.",
		                           queue:Q,
		                           output:output});
		                           
          commentaire.animate({},3000,3000);commentaire.remove();
          tab[2].animate({x:arithmx+tabw+80,y:arithmy-3*UNIT,background:BLEU},2000,2000);
          tab[2].animate({x:arithmx+tabw+330,background:GRIS},1000,1000);
          tab[1].animate({x:arithmx+tabw+80,y:arithmy-3*UNIT,background:BLEU},2000,2000);
          tab[1].animate({x:arithmx+330-50,background:GRIS},500,500);
		  
		  rectval=LIB.RectVal({x:-2*UNIT,
							   y:arithmy-6*UNIT+UNIT/4,
							   height:'0px',
							   width:'0px',
							   background:GRIS,
							   queue:Q,
							   output:output,
							   val:'*'});
							   
		  rectval.animate({x:arithmx+330-50+tabw+5+UNIT/4,
		                   y:arithmy-3*UNIT+UNIT/4-UNIT,
		                   height:UNIT/2+'px',
		                   width:UNIT/2+'px',
		                   background:VERT},1500,1500);
		  rectval.animate({background:GRIS,x:arithmx+330-50+tabw+5+UNIT/4,y:arithmy-3*UNIT+UNIT/4},1000,1000); 
		  
          comment=UI.Comment({x:arithmx+tabw+330-2*tabw-80,
                               y:arithmy-3*UNIT+UNIT+10,
                               height:'57px',
                               width:'210px',
                               background:JAUNE,
                               queue:Q,
                               output:output,
                               html:"Execution de l'opération '*' et récupération du résultat: (b-c)*d"});   
                                    
          comment.animate({},2500,2500);comment.remove();
          tab[2].animate({x:arithmx+1000,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
          tab[1].animate({x:arithmx+1000-tabw-20,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
		  rectval.animate({x:arithmx+800+tabw,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
		  
		  rectval=LIB.RectVal({x:arithmx+1000,
		                       y:arithmy-300,
		                       height:UNIT+'px',
		                       width:UNIT+'px',
		                       background:GRIS,
		                       queue:Q,
		                       output:output,
		                       val:'(b-c)*d'});
		                       
          comment=UI.Comment({x:arithmx+tabw+20,
                               y:arithmy+(TAILLE-8)*UNIT,
                               height:'38px',
                               width:'210px',
                               background:JAUNE,
                               queue:Q,
                               output:output,
                               html:"Empilement du résultat: (b-c)*d"}); 
                                       
          rectval.animate({x:arithmx,y:arithmy+(TAILLE-2)*UNIT,width:tabw+'px'},2000,0);tab[1]=rectval;
          comment.animate({},2500,2500);
          comment.remove(); 
          
          rectval=LIB.RectVal({x:-UNIT,y:-UNIT,height:UNIT+'px',width:UNIT+'px',background:GRIS,queue:Q,output:output,val:'e'});
          
		  commentaire=UI.Comment({x:arithmx+tabw+20,
		                           y:arithmy+(TAILLE-4)*UNIT,
		                           height:'35px',
		                           width:'145px',
		                           background:JAUNE,
		                           html:"Empiler l'opérande : e",
		                           queue:Q,
		                           output:output});
		                           
		  rectval.animate({x:arithmx,y:arithmy+(TAILLE-3)*UNIT, width: tabw+'px',background:VERT},1500,1500);commentaire.remove();
		  rectval.animate({background:GRIS},500,500);tab[2]=rectval; 
		   
		  commentaire=UI.Comment({x:arithmx+tabw+20,
		                           y:arithmy+(TAILLE-6)*UNIT,
		                           height:'70px',
		                           width:'280px',
		                           background:JAUNE,
		                           html:"Détection de l'opérateur '+' et comme il est binaire alors dépilement des deux derniers éléments de la pile.",
		                           queue:Q,
		                           output:output});
		                           
          commentaire.animate({},3000,3000);commentaire.remove();
          tab[2].animate({x:arithmx+tabw+80,y:arithmy-3*UNIT,background:BLEU},2000,2000);
          tab[2].animate({x:arithmx+tabw+330,background:GRIS},1000,1000);
          tab[1].animate({x:arithmx+tabw+80,y:arithmy-3*UNIT,background:BLEU},2000,2000);
          tab[1].animate({x:arithmx+330-50,background:GRIS},500,500);
          
          rectval=LIB.RectVal({x:-2*UNIT,
                               y:arithmy-6*UNIT+UNIT/4,
                               height:'0px',
                               width:'0px',
                               background:GRIS,
                               queue:Q,
                               output:output,
                               val:'+'});
                               
		  rectval.animate({x:arithmx+330-50+tabw+5+UNIT/4,
		                   y:arithmy-3*UNIT+UNIT/4-UNIT,
		                   height:UNIT/2+'px',
		                   width:UNIT/2+'px',
		                   background:VERT},1500,1500);
		                   
		  rectval.animate({background:GRIS,x:arithmx+330-50+tabw+5+UNIT/4,y:arithmy-3*UNIT+UNIT/4},1000,1000); 
		  
          comment=UI.Comment({x:arithmx+tabw+330-2*tabw-120,
                               y:arithmy-3*UNIT+UNIT+10,
                               height:'57px',
                               width:'270px',
                               background:JAUNE,
                               queue:Q,
                               output:output,
                               html:"Execution de l'opération '+' et récupération du résultat: ((b-c)*d)+e"});
                               
          comment.animate({},2500,2500);comment.remove();
          tab[2].animate({x:arithmx+1000,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
          tab[1].animate({x:arithmx+1000-tabw-20,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
		  rectval.animate({x:arithmx+800+tabw,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
		  
		  rectval=LIB.RectVal({x:arithmx+1000,
		                       y:arithmy-300,
		                       height:UNIT+'px',
		                       width:UNIT+'px',
		                       background:GRIS,
		                       queue:Q,
		                       output:output,
		                       val:'((b-c)*d)+e'});		  
         
		  
          comment=UI.Comment({x:arithmx+tabw+20,
                               y:arithmy+(TAILLE-8)*UNIT,
                               height:'38px',
                               width:'240px',
                               background:JAUNE,
                               queue:Q,
                               output:output,
                               html:"Empilement du résultat: ((b-c)*d)+e"});     
                                   
          rectval.animate({x:arithmx,y:arithmy+(TAILLE-2)*UNIT,width:tabw+'px'},2000,0);tab[1]=rectval;
          comment.animate({},2500,2500);
          comment.remove();  
        
          commentaire=UI.Comment({x:arithmx+tabw+20,
                                   y:arithmy+(TAILLE-6)*UNIT,
                                   height:'70px',
                                   width:'280px',
                                   background:JAUNE,
                                   html:"Détection de l'opérateur '*' et comme il est binaire alors dépilement des deux derniers éléments de la pile.",
                                   queue:Q,
                                   output:output});
                                   
          commentaire.animate({},3000,3000);commentaire.remove();
          tab[1].animate({x:arithmx+tabw+80,y:arithmy-3*UNIT,background:BLEU},2000,2000);
          tab[1].animate({x:arithmx+tabw+330,background:GRIS},1000,1000);
          tab[0].animate({x:arithmx+tabw+80,y:arithmy-3*UNIT,background:BLEU},2000,2000);
          tab[0].animate({x:arithmx+330-50,background:GRIS},500,500);
          
		  rectval=LIB.RectVal({x:-2*UNIT,
		                       y:arithmy-6*UNIT+UNIT/4,
		                       height:'0px',
		                       width:'0px',
		                       background:GRIS,
		                       queue:Q,
		                       output:output,
		                       val:'*'});
		  rectval.animate({x:arithmx+330-50+tabw+5+UNIT/4,
		                   y:arithmy-3*UNIT+UNIT/4-UNIT,
		                   height:UNIT/2+'px',
		                   width:UNIT/2+'px',
		                   background:VERT},1500,1500);
		                   
		  rectval.animate({background:GRIS,x:arithmx+330-50+tabw+5+UNIT/4,y:arithmy-3*UNIT+UNIT/4},1000,1000); 
		  
          comment=UI.Comment({x:arithmx+tabw+330-2*tabw-130,
                               y:arithmy-3*UNIT+UNIT+10,
                               height:'57px',
                               width:'280px',
                               background:JAUNE,
                               queue:Q,
                               output:output,
                               html:"Execution de l'opération '*' et récupération du résultat :    a*((b-c)*d)+e)"}); 
                                      
          comment.animate({},2500,2500);comment.remove();
          tab[1].animate({x:arithmx+1000,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
          tab[0].animate({x:arithmx+1000-tabw-20,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
		  rectval.animate({x:arithmx+800+tabw,y:arithmy-300,scaleX:0,scaleY:0},1500,0);
		  
		  rectval=LIB.RectVal({x:arithmx+1000,
		                       y:arithmy-300,
		                       height:UNIT+'px',
		                       width:UNIT+'px',
		                       background:GRIS,
		                       queue:Q,
		                       output:output,
		                       val:'a*((b-c)*d)+e)'});

          comment=UI.Comment({x:arithmx+tabw+20,
                               y:arithmy+(TAILLE-8)*UNIT,
                               height:'57px',
                               width:'160px',
                               background:JAUNE,
                               queue:Q,
                               output:output,
                               html:"Empilement du résultat: a*((b-c)*d+e)"});  
                                      
          rectval.animate({x:arithmx,y:arithmy+(TAILLE-1)*UNIT,width:tabw+'px'},2000,0);tab[0]=rectval;
          comment.animate({},2500,2500);
          comment.remove();   
          
          comment=UI.Comment({x:arithmx+tabw+20,
                               y:arithmy+(TAILLE-2)*UNIT,
                               height:'57px',
                               width:'200px',
                               background:JAUNE,
                               queue:Q,
                               output:output,
                               html:"La pile ne contient que le résultat finale : a*((b-c)*d+e)"});    
                                    
		  comment.animate({background:ROUGE},500,500);
		  comment.animate({background:TRANS},100,100);
		  comment.animate({background:ROUGE},500,500);
		  comment.animate({background:TRANS},100,100);
		  comment.animate({background:ROUGE},500,500);
		  comment.animate({background:TRANS},100,100);
		  comment.animate({background:ROUGE},500,500);
		  comment.animate({background:TRANS},100,100);
		  comment.animate({background:ROUGE},500,500);
		  comment.animate({background:TRANS},100,100);
		  comment.animate({background:ROUGE},500,500);
		  comment.remove(); 
		  tab[0].animate({x:arithmx+1000-tabw-20,y:arithmy-300,scaleX:0,scaleY:0,background:ROUGE},2500,2500);
		  
		  Q.enQueue(function () {
                          UI.selectToolbar(1);
                          }, 0); 
	  }      
     //   ExpAr.addEventListener('click',exp_arithm,false);
     ExpAr.bind("click",exp_arithm);
     
     
 function afficherPrincipe() {
		
		$("#principe").dialog({ height: 590, width: 1000, autoOpen: false, modal: true , title : "Principe"});
		$("#principe").dialog("open");
	};           
 //afficherPrincipe();
	 
  });
