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
 
    var Q = LIB.getQueue(),  // file d'animation        
        tab=[],
		_tab=[],
		N_tab=[],
		fleche=[],
		_fleche=[],
	    N_fleche=[],
        UNIT = 50,
        initX=0,
        initY=140,
        i=0,
        sauv=0,
        flecheSize=60,
        UNITY=flecheSize+2*UNIT,
        oHeight = 250,
        oWidth = 450; 
        UI.init({queue:Q});           
        
 var output =LIB.$('#output'),
     inserer=$('#inserer').button(),
     rechercher_val=$('#rechercher_val').button(),
     rechercher_adr=$('#rechercher_adr').button(),
     supprimer=$('#supprimer').button(),
     fusionner=$('#fusion').button(),
     startFusion=$('#start_fusion').button(),     
     canvas = LIB.$('#canvas');  // espace de dessin ( pour les fleches )
     
 // initialisation des dimension de l'interface
    UI.outputHeight(oHeight);
    UI.outputWidth(oWidth);
// initialisation des dimension de l'espace de dessin
    canvas.height = oHeight;
    canvas.width = oWidth;
 var ctx = canvas.getContext("2d"); 
 ctx.clearRect(0,0,oWidth,oHeight);
 var fact = LIB.Factory({ canvas : canvas , queue : Q });
/******************************************************/ 
function max(i,j){
	return(i<=j ? j : i);
}
/******************************************************/
function rech_tri(nbre){
	var i=0,
	    trouv=false;
	  
	if(tab.length == 1){
		if(nbre <= tab[0].val()){
		   var _med = LIB.Rect({
				height: UNIT + 'px',
				width: UNIT + 'px',
				x: X(-1) - 4,
				y: initY - 4,
				borderWidth: '5px',
				background: TRANS,
				borderColor: VERT,
				borderRadius: '5px',
				output: output,
				queue: Q
			});
		    _med.animate({x:X(0)},500,500);
			Q.wait(500);
			_med.remove();
     		return({pos:0,trouv:false});
			}
		else {
		      var _med = LIB.Rect({
				height: UNIT + 'px',
				width: UNIT + 'px',
				x: X(-1) - 4,
				y: initY - 4,
				borderWidth: '5px',
				background: TRANS,
				borderColor: VERT,
				borderRadius: '5px',
				output: output,
				queue: Q
			});
		      _med.animate({x:X(0)},500,500);
			  Q.wait(500);
			  _med.animate({x:X(1)},500,500);
			  Q.wait(500);
			  _med.remove();
		      return({pos:1,trouv:false});
		   }
	} 
	else if(tab.length == 0) return({pos:0,trouv:false});   
	else {
        var _med = LIB.Rect({
				height: UNIT + 'px',
				width: UNIT + 'px',
				x: X(0) - 4,
				y: initY - 4,
				borderWidth: '5px',
				background: TRANS,
				borderColor: VERT,
				borderRadius: '5px',
				output: output,
				queue: Q
			});	
		  if(tab[0].val() > nbre) {
			_med.animate({x:X(0)},500,500);
			Q.wait(500);
			_med.remove();
     		return({pos:0,trouv:false});
			}
		while(i<tab.length && nbre >= tab[i].val()){
			_med.animate({x:X(i+1)},500,500);
			Q.wait(500);
			i++;					
		}
		_med.remove();
	 return({pos:i,trouv:false});
	}
}
/*************************************************/

	function X(i){
		return(initX+i*(flecheSize+UNIT));
	}
    /****************************************/
    function decalageDroite(i){
		if(tab.length == 0) return;
		else if(tab.length==1){
			if(i==0){ tab[0].animate({x:X(1)},500);
			          tab[1]=tab[0];
			         return;
					}
		    else return;			
		}
        for ( var j = tab.length-1; i <= j ; j--){
            tab[j+1] = tab[j];
			if(j-1>=0) fleche[j]=fleche[j-1];
            tab[j].animate({ x: X(j+1) }, 500);
			if(j-1>=0) {fleche[j-1].update({ x: X(j)+UNIT,y:initY+UNIT/2},{x:X(j+1),y:initY+UNIT/2});fact.animate(0);}
        }       
    }
  /*********************************/  
    function decalageGauche(k){
		if(tab.length == 0)  return;
			for (var j = k; j < (tab.length)-1 ; j++){           
				tab[j] = tab[j+1];
				tab[j].animate({ x: X(j) }, 700);       
			}
			if(fleche.length >=1) {
			     fleche[fleche.length-1].remove();
				 fleche.length--;
			}
			 fact.animate(250);
			 tab.length--;		
    }
/*************************************************/
 function  rech_seq (valeur) {
	 
		var i=0 ;
		for(i in tab){
			tab[i].animate({background: BLEU}, 500);
            tab[i].animate({background: GRIS}, 500);
			if(tab[i].val() === valeur){
				return { pos: i, trouv: true };
			}
			else if(tab[i].val() > valeur){
				return { pos: i, trouv: false };
			}		
		}		
		return {  pos: i , trouv: false };
  } 
/************************************************/
function recherche_val(valeur){
	
	UI.selectToolbar(0); 
	UI.selectAlgo(0);
	if(tab.length==0) {
			var comment=UI.Comment({x:initX+2*UNIT,y:initY-1.5*UNIT,background:'#FFC',height:'37px',width:'135px',html:'La liste est vide  !!',output:output});
	        comment.animate({background:JAUNE},1500,1500);
			comment.remove();
			Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0);  
			return;
	   }
	   if(valeur === null){
		   return;
	   }
	   
	     if(parseInt(valeur) != valeur){
			   var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'340px',html:'veuillez entrer une valeur numérique entière SVP  !',output:output});
			   comment.animate({background:JAUNE},2000,2000);
			   comment.remove();
			   Q.enQueue(function () {
						  UI.selectToolbar(1);
						   }, 0); 
			   return;
	        }
	valeur=parseInt(valeur);
	var obj=rech_seq(valeur);
	if(obj.trouv == false){
		var comment=UI.Comment({x:initX+(obj.pos)*(flecheSize+UNIT),y:initY-80,height:'35px',width:'175px',background:JAUNE,html:'la valeur '+valeur+' n\'existe pas  !',queue:Q,output:output});				
				comment.animate({background:JAUNE},1500,1500);
				comment.remove();
	 }
	else {
         var comment=UI.Comment({x:initX+(obj.pos)*(flecheSize+UNIT),y:initY-80,height:'35px',width:'250px',background:JAUNE,html:'la valeur '+valeur+' se trouve à l\'adresse : '+obj.pos,queue:Q,output:output});				
				tab[obj.pos].animate({background:ROUGE,scaleX:1.5,scaleY:1.5},1000,1000);
				comment.animate({background:JAUNE},1500,500);
				tab[obj.pos].animate({background:GRIS,scaleX:1,scaleY:1},500,0);
				comment.remove();				
	}
	Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0); 
	
}
/*************************************************/
function recherche_adr(adr){
	
	UI.selectToolbar(0); 
	UI.selectAlgo(0);
	if(tab.length==0) {
			var comment=UI.Comment({x:initX+2*UNIT,y:initY-1.5*UNIT,background:'#FFC',height:'37px',width:'135px',html:'La liste est vide  !!',output:output});
	        comment.animate({background:JAUNE},1500,1500);
			comment.remove();
			Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0);  
			return;
	   }
	if(adr===null) return;

	
	if(parseInt(adr) != adr){
			   var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'340px',html:'veuillez entrer une valeur numérique entière SVP  !',output:output});
			   comment.animate({background:JAUNE},2000,2000);
			   comment.remove();
			   Q.enQueue(function () {
						  UI.selectToolbar(1);
						   }, 0); 
			   return;
	        }
	adr=parseInt(adr);		
	if(adr < 0) {
		var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'265px',html:'veuillez entrer une adresse valide SVP  !',output:output});
		   comment.animate({background:JAUNE},1500,1500);
		   comment.remove();
	       Q.enQueue(function () {
                      UI.selectToolbar(1);
            }, 0); 
	     return;
	}
	var i=0;
	while(i<tab.length && i!=adr){
	    tab[i].animate({background: BLEU}, 500);
        tab[i].animate({background: GRIS}, 500);	
 		i++;       
	}
	if(i==adr && i<tab.length){
		 var comment=UI.Comment({x:X(tab.length-1)+UNIT,y:initY-80,height:'55px',width:'175px',background:JAUNE,html:'la valeur qui se trouve a l\'adresse '+adr+' est : '+tab[i].val(),queue:Q,output:output});
		tab[adr].animate({background:ROUGE,scaleX:1.5,scaleY:1.5},1000,1000);
		comment.animate({background:JAUNE},1500,500);
		tab[adr].animate({background:GRIS,scaleX:1,scaleY:1},500,0);
		comment.remove();
	}
	else{
		var comment=UI.Comment({x:X(tab.length-1)+UNIT,y:initY-80,height:'35px',width:'225px',background:JAUNE,html:'aucune valeur n\'est à l\'adresse '+adr,queue:Q,output:output});				
				comment.animate({background:JAUNE},1500,1500);
				comment.remove();
	}
	Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0);
	
}

/*************************************************/
  function insert(valeur){
	  
    UI.selectToolbar(0); 
	UI.selectAlgo(1);	  
	   if(valeur === null){
		   return;
	   }
	   
	   if(parseInt(valeur) != valeur){
			   var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'340px',html:'veuillez entrer une valeur numérique entière SVP  !',output:output});
			   comment.animate({background:JAUNE},2000,2000);
			   comment.remove();
			   Q.enQueue(function () {
						  UI.selectToolbar(1);
						   }, 0); 
			   return;
	        }
	   valeur=parseInt(valeur);		
	   if(tab.length >= 1 ){
		  var comment=UI.Comment( {x:initX, y:initY-100,height:'35px',width:'280px',background:JAUNE,html:'On recherche la position ou insérer la valeur',output:output});
			  comment.animate({},1500,1500);
			  comment.remove();
		  }
	  var obj=rech_tri(valeur);
	 
	  obj.pos=parseInt(obj.pos);
	  var maillon=LIB.RectVal({x:0,y:0,height:UNIT+'px',width:UNIT+'px',boxShadow:"5px 5px 5px rgba(0,0,0,0.8)",queue:Q,output:output,val:valeur});
	    decalageDroite(obj.pos);
          maillon.animate({x:initX+(obj.pos)*(flecheSize+UNIT),y:initY},1000,0);
          maillon.animate({background:JAUNE},300,1000);
		  maillon.animate({background:GRIS},300,300);		
		  tab[obj.pos]=maillon;
		 if(obj.pos == 0){
		    var comment=UI.Comment({x:initX-115,y:initY-40,height:'35px',width:'122px',background:JAUNE,html:'La tête de la liste',queue:Q,output:output});
				  comment.animate({background:JAUNE},1500,1500);
				  comment.remove();
		  }
		  if(obj.pos == 0 && tab.length > 1) obj.pos=1;		  
		  else if(obj.pos == 0 && tab.length == 1){
		   
		             Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0); 
					return;
				}
		  fleche[obj.pos-1]=fact.Arrow({x:initX+(obj.pos-1)*(flecheSize+UNIT)+UNIT,y:initY+UNIT/2},{x:initX+(obj.pos)*(flecheSize+UNIT),y:initY+UNIT/2});
		  fact.animate(0);
		  if(X(tab.length)>oWidth){
			  Q.enQueue( function(){
					 oWidth += UNITY ;
					 UI.outputWidth(oWidth);
					 canvas.width = oWidth; 
					 fact.animate(0);
				 },0);
		  }      
          Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0); 
}
/***********************************************/
	 function suppression(valeur){
		 
	   UI.selectToolbar(0); 
	   UI.selectAlgo(2);
		if(tab.length==0) {
			var comment=UI.Comment({x:initX+2*UNIT,y:initY-1.5*UNIT,background:'#FFC',height:'37px',width:'133px',html:'La liste est vide  !!',output:output});
	        comment.animate({background:JAUNE},1500,1500);
			comment.remove();
			Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0);  
			return;
	    } 
		   if(valeur === null){
			   return;
		   }
		   
		   if(parseInt(valeur) != valeur){
			   var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'340px',html:'veuillez entrer une valeur numérique entière SVP  !',output:output});
			   comment.animate({background:JAUNE},2000,2000);
			   comment.remove();
			   Q.enQueue(function () {
						  UI.selectToolbar(1);
						   }, 0); 
			   return;
	        }
		  valeur=parseInt(valeur);	
		  var comment=UI.Comment({x:initX+3*UNIT,y:initY-80,height:'35px',width:'208px',background:JAUNE,html:'Rechercher la valeur '+valeur+' .',queue:Q,output:output});
		      comment.animate({background:JAUNE},1500,1500);
			  comment.remove(); 
   do{
	  var obj=rech_seq(valeur);
	  if(obj.trouv == false) {
				var comment=UI.Comment({x:initX+3*UNIT,y:initY-80,height:'35px',width:'220px',background:JAUNE,html:'Valeur n\'existe pas dans la liste !',queue:Q,output:output});				
					comment.animate({background:JAUNE},1500,1500);
					comment.remove();  
	  }
	  else {
		  tab[obj.pos].animate({backgound:ROUGE,rotate:360,scaleX:0,scaleY:0},1000,1000);
		  tab[obj.pos].remove();
		  obj.pos=parseInt(obj.pos);
		  decalageGauche(obj.pos);
		  if(tab.length==0) {
			var comment=UI.Comment({x:initX+2*UNIT,y:initY-1.5*UNIT,background:'#FFC',height:'37px',width:'133px',html:'La liste est vide  !!',output:output});
	        comment.animate({background:JAUNE},1500,1500);
			comment.remove();
			Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0);  
			return;
	    } 
		  i-=1;
      var comment=UI.Comment({x:initX+3*UNIT,y:initY-80,height:'50px',width:'233px',background:JAUNE,html:'Rechercher la prochaine occurence de '+valeur+' si elle existe',queue:Q,output:output});
          comment.animate({background:JAUNE},1500,1500);
          comment.remove();	
	  }	
    }while(obj.trouv==true);
	  Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0);  
		  
	}
	/*****************************************************************/
      function fusion(){
	    UI.selectToolbar(0);
	    if(tab.length==0) {
							var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'220px',html:'remplis d\'abord la première liste !!',output:output});
						    comment.animate({background:JAUNE},1500,1500);
						    comment.remove();
							Q.enQueue(function () {
							UI.selectToolbar(1);
						    }, 0);
							return;
						 } 
		fusionner.unbind('click',fusion);
		var comment=UI.Comment({x:initX+2*UNIT,y:initY-4*UNIT,background:'#FFC',height:'55px',width:'240px',html:'veuillez remplir une deuxième liste, puis cliquer sur le btn "<span style="font-size:18px;color:green">Appliquer</span>"',queue:Q,output:output});
		comment.animate({background:JAUNE},2000,2000);
		comment.remove();
		/// augmenter la hauteur de l'output et de l'espace de dessin
	  Q.enQueue(function(){
	    oHeight += UNITY+UNIT ;
		UI.outputHeight(oHeight);
		canvas.height = oHeight;	
	  },0);
	     fact.animate(0); 		    
		 /// sauvegarder le tableau tab
		 for(var j=0;j<tab.length;j++){
			 _tab[j]=tab[j];///_tab[j].animate({background:JAUNE,x:initX+2*UNIT+j*(flecheSize+UNIT),y:initY-1.5*UNIT},2000,2000);
			 if(j<fleche.length) _fleche[j]=fleche[j];
		 }
		 tab.length=0;
		 fleche.length=0;
		 initY=initY+3*UNIT; ///nouvelle position des maillons de la deuxième liste	
		 i=0;  /// l'indice du tableau	
		 Q.enQueue(function () {
							UI.selectToolbar(1);
						    }, 0);
	}
	/********************************************************************/
	function start_fusion(){
		UI.selectToolbar(0);
        if(tab.length==0 && _tab.length==0) {
							var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'220px',html:'remplis d\'abord la première liste !!',output:output});
						    comment.animate({background:JAUNE},1500,1500);
						    comment.remove();
							Q.enQueue(function () {
							UI.selectToolbar(1);
						    }, 0);
							return;
						 } 
        if(tab.length==0 && _tab.length > 0) {
							var comment=UI.Comment({x:initX,y:initY-100-3*UNIT,background:JAUNE,height:'35px',width:'230px',html:'remplis d\'abord la deuxième liste !!',output:output});
						    comment.animate({background:JAUNE},1500,1500);
						    comment.remove();
							Q.enQueue(function () {
							UI.selectToolbar(1);
						    }, 0);
							return;
						 } 						 
		if(_tab.length==0 && tab.length > 0) {
							var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'260px',html:'cliquer d\'abord sur le button < Fusion >',output:output});
						    comment.animate({background:JAUNE},1500,1500);
						    comment.remove();
							Q.enQueue(function () {
							UI.selectToolbar(1);
						    }, 0);
							return;
						 }
						 
		UI.selectAlgo(3);				 
		var i1=0,
		    i2=0,
		   _i1=0,
		   _i2=0,
			 h=0;
		for(h=0;h<2*max(tab.length,_tab.length);h++){
            if(initX+3*UNIT+h*(flecheSize+UNIT)>oWidth){
			  Q.enQueue( function(){
					 oWidth += 4*UNIT+flecheSize  ;
					 UI.outputWidth(oWidth);
					 canvas.width = oWidth; 					 
				 },0);
				 fact.animate(0);
		    }
		    ///tab[i1].animate({x:initX+2*UNIT+w*(flecheSize+UNIT),y:initY-1.5*UNIT,background:JAUNE},2000,2000);
		  if(i1<tab.length && i2<_tab.length){  			
			if(tab[i1].val() <= _tab[i2].val()){
			    var comment=UI.Comment({x:X(i1),y:initY+1.5*UNIT,height:'70px',width:'250px',html:'Maillon2.val()\< Maillon1.val() donc : Nouv_Maillon=Maillon2 et on avance dans la deuxième liste',output:output});
				comment.animate({background:JAUNE},1500,1500);
				comment.remove();
				tab[i1].animate({x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-1.5*UNIT,background:JAUNE},2000,2000);
				tab[i1].animate({background:TRANS},0,0);
				N_tab[h]=tab[i1];
			   if(i1<fleche.length){
			        //alert('i1= '+i1);
					//i1=parseInt(i1);
					fleche[i1].remove();
					fact.animate(0);	
		        }				
				i1 += 1;
		        if(h>0){
					N_fleche[h-1]=fact.Arrow({x:initX+3*UNIT+(h-1)*(flecheSize+UNIT),y:initY-UNIT},{x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-UNIT});
					fact.animate(0);
				}
             			
			}
			else{
			    var comment=UI.Comment({x:X(i2),y:initY-5*UNIT,height:'70px',width:'250px',html:'Maillon1.val() \< Maillon2.val() donc : Nouv_Maillon=Maillon1 et on avance dans la première liste',output:output});
				comment.animate({background:JAUNE},1500,1500);
				comment.remove();
				_tab[i2].animate({background:JAUNE,x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-1.5*UNIT},2000,2000);
				_tab[i2].animate({background:TRANS},0,0);
				N_tab[h]=_tab[i2];
			    if(i2<_fleche.length){
				     // alert('i2= '+i2);
					_fleche[i2].remove();
					fact.animate(0);
		        }				
				i2 += 1;
		        if(h>0){
					N_fleche[h-1]=fact.Arrow({x:initX+3*UNIT+(h-1)*(flecheSize+UNIT),y:initY-UNIT},{x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-UNIT});
					fact.animate(0);
				}				
			}
		}		
	  else {
	    if(i1==tab.length && i2 <_tab.length){
		     if(_i2==0){
					var comment=UI.Comment({x:X(i2),y:initY-5*UNIT,height:'70px',width:'200px',html:'La deuxième liste n\'existe plus,donc on avance que dans la première liste ',output:output});
					comment.animate({background:JAUNE},1500,1500);
					comment.remove();
				}
				_i2 += 1;
				_tab[i2].animate({background:JAUNE,x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-1.5*UNIT},2000,2000);
				_tab[i2].animate({background:TRANS},0,0);
				N_tab[h]=_tab[i2];
			    if(i2<_fleche.length){
					_fleche[i2].remove();fact.animate(0);					
		        }				
				i2 += 1;
		        if(h>0){
					N_fleche[h-1]=fact.Arrow({x:initX+3*UNIT+(h-1)*(flecheSize+UNIT),y:initY-UNIT},{x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-UNIT});
					fact.animate(0);
				}		
	    }
	    else{
		     if(i2 ==_tab.length && i1<tab.length){
			   if(_i1=0){
					var comment=UI.Comment({x:X(i2),y:initY-1.5*UNIT,height:'70px',width:'200px',html:'La première liste n\'existe plus,donc on avance que dans la deuxième liste ',output:output});
					comment.animate({background:JAUNE},1500,1500);
					comment.remove();
				}
				_i1 += 1 ;
				tab[i1].animate({x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-1.5*UNIT,background:JAUNE},2000,2000);
				tab[i1].animate({background:TRANS},0,0);
				N_tab[h]=tab[i1];
			   if(i1<fleche.length){
					fleche[i1].remove();fact.animate(0);					
		        }				
				i1 += 1;
		        if(h>0){
					N_fleche[h-1]=fact.Arrow({x:initX+3*UNIT+(h-1)*(flecheSize+UNIT),y:initY-UNIT},{x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-UNIT});
					fact.animate(0);
				}		
	          }
			}
		}
	}	
	   initY=initY-1.5*UNIT;
	   initX=initX+2*UNIT;
       for(var j=0;j<N_tab.length;j++){
			 tab[j]=N_tab[j];
			 if(j<N_fleche.length) fleche[j]=N_fleche[j];
		 }	   
       N_tab.length=0;
       N_fleche.length=0;
	   _tab.length=0;
		fusionner.bind('click',fusion);
	    Q.enQueue(function () {
						UI.selectToolbar(1);
                       }, 0); 		
	}
	
	
	/********************************************************************/	
    
     UI.inputMenu({
        button: inserer,
        onok: insert,
        autoClear: true,
        text: "Entrer une valeur entière SVP"
    });
     UI.inputMenu({
        button: rechercher_val,
        onok: recherche_val,
        autoClear: true,
        text: "Entrer une valeur entière SVP"
    });
    UI.inputMenu({
        button: rechercher_adr,
        onok: recherche_adr,
        autoClear: true,
        text: "Entrer une valeur entière SVP"
    });
     UI.inputMenu({
        button: supprimer,
        onok: suppression,
        autoClear: true,
        text: "Entrer une valeur entière SVP"
    });
	 fusionner.bind('click',fusion);
	 startFusion.bind('click',start_fusion);    
	 
	 
    function afficherPrincipe() {
		
		$("#principe").dialog({ height: 590, width: 1000, autoOpen: false, modal: true , title : "Principe"});
		$("#principe").dialog("open");
	};           
 afficherPrincipe();
 });
  
