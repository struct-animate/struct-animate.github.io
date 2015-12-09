/*jslint indent: 4, nomen: true, devel: true, vars: true, browser: true */
/*globals jQuery, $, UI, LIB*/
$(function(){
	    'use strict';
	    
	    var Q = LIB.getQueue(),  // file d'animation  
	        ROUGE = "rgba(255, 0, 0, 0.6)",
			TRANS = "rgba(0, 0, 0, 0)",
			VERT  = "rgba(0, 255, 0, 0.6)",
			BLEU  = "rgba(0, 0, 255, 0.6)",
			JAUNE = "#FFC",
			GRIS  = "#EEE",
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
			UNITY=flecheSize+UNIT,
			oHeight = 250,
			oWidth = 450;
           
  UI.init({queue:Q});           
			      
        
 var output =LIB.$('#output'),
     inserer=$('#inserer').button(),
     rechercher_val=$('#rechercher_val').button(),
     rechercher_adr=$('#rechercher_adr').button(),
     supprimer=$('#supprimer').button(),
     trier=$('#trier').button(),
     fusionner=$('#fusion').button(),
     startFusion=$('#start_fusion').button(),
     canvas = LIB.$('#canvas');               // espace de dessin ( pour les fleches )
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
 function max(a,b){
  return(a<=b ? b : a);
 }
/*****************************************************/ 
 function  rech_seq (valeur) {
	 
		var i=0 ;
		for(i in tab){
			tab[i].animate({background: BLEU}, 500);
            tab[i].animate({background: GRIS}, 500);
			if(tab[i].val() === valeur){
				return { pos: i, trouv: true };
			}		
		}		
		return { trouv: false, pos: i };
  }  
  
/*************************************************/

	function X(i){
		return(initX+i*(flecheSize+UNIT));
	}
    /****************************************/
    function decalageDroite(i){
        for (var j = tab.length-1; i <= j ; j--){
            tab[j+1] = tab[j];
            tab[j].animate({ x: X(j+1) }, 500);
        }
    }
  /*********************************/  
    function decalageGauche(k){
		if(tab.length == 1) {tab.length=0;return;}
        for (var j = k; j < (tab.length)-1 ; j++){           
            tab[j] = tab[j+1];
            tab[j].animate({ x: X(j) }, 700);       
        }
        fleche[fleche.length-1].remove();
         fact.animate(250);
        tab.length--;
        fleche.length--;
    }
/*************************************************/
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
	if(obj.trouv == false) {
		var comment=UI.Comment({x:initX+i*(flecheSize+UNIT),y:initY-80,height:'35px',width:'195px',background:JAUNE,html:'la valeur '+valeur+' n\'existe pas  !',queue:Q,output:output});				
				comment.animate({background:JAUNE},1500,1500);
				comment.remove();
	}
	else {
         var comment=UI.Comment({x:initX+i*(flecheSize+UNIT),y:initY-80,height:'35px',width:'250px',background:JAUNE,html:'la valeur '+valeur+' se trouve à l\'adresse : '+obj.pos,queue:Q,output:output});				
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
		var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'258px',html:'veuillez entrer une adresse valide SVP !',output:output});
		   comment.animate({background:JAUNE},2000,2000);
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
	if(i==adr){
		 var comment=UI.Comment({x:X(tab.length-1)+UNIT,y:initY-80,height:'55px',width:'225px',background:JAUNE,html:'la valeur qui se trouve a l\'adresse '+adr+' est : '+tab[i].val(),queue:Q,output:output});
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
	  var maillon=LIB.RectVal({x:0,y:0,height:UNIT+'px',width:UNIT+'px',boxShadow:"5px 5px 5px rgba(0,0,0,0.8)",queue:Q,output:output,val:valeur});
          maillon.animate({x:initX+i*(flecheSize+UNIT),y:initY},1000,0);
          maillon.animate({background:JAUNE},300,1000);
          maillon.animate({background:GRIS},300,300);
		 // maillon.animate({background:JAUNE},0,0);
		  tab[i]=maillon;
		  if(tab.length == 2){
			  var comment=UI.Comment({x:initX+UNIT/2,y:initY-50,height:'35px',width:'178px',background:JAUNE,html:'Chainage avec le suivant',output:output});
		      comment.animate({background:JAUNE},1000,1000);
		      comment.remove();
		  }
		  if(i>0){
			  fleche[i-1]=fact.Arrow({x:initX+(i-1)*(flecheSize+UNIT)+UNIT,y:initY+UNIT/2},{x:initX+(i)*(flecheSize+UNIT),y:initY+UNIT/2});
			  fact.animate(0);			  
	       }
		  if(i==0){
				  var comment=UI.Comment({x:initX-115,y:initY-40,height:'35px',width:'125px',background:JAUNE,html:'La tête de la liste',queue:Q,output:output});
				  comment.animate({background:JAUNE},2000,2000);
				  comment.remove();		  
	      }	       
          i+=1;
          if(X(i)>oWidth){
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
/************************************************/
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
		  var comment=UI.Comment({x:initX+3*UNIT,y:initY-80,height:'35px',width:'200px',background:JAUNE,html:'Rechercher la valeur '+valeur+' .',queue:Q,output:output});
		      comment.animate({background:JAUNE},1500,1500);
			  comment.remove();
 do{
	  var obj=rech_seq(valeur);
	  if(obj.trouv == false) {
				var comment=UI.Comment({x:initX+i*(flecheSize+UNIT),y:initY-80,height:'35px',width:'200px',background:JAUNE,html:'Aucun élément à supprimé  !',queue:Q,output:output});				
					comment.animate({background:JAUNE},1500,1500);
					comment.remove();  
	  }
	  else {
		  tab[obj.pos].animate({backgound:ROUGE,rotate:360,scaleX:0,scaleY:0},1000,1000);
		  tab[obj.pos].remove();
		  obj.pos=parseInt(obj.pos);
		  decalageGauche(obj.pos);
		  i-=1;
		  if(tab.length==0) {
			var comment=UI.Comment({x:initX+2*UNIT,y:initY-1.5*UNIT,background:'#FFC',height:'37px',width:'133px',html:'La liste est vide  !!',output:output});
	        comment.animate({background:JAUNE},1500,1500);
			comment.remove();
			Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0);  
			return;
	    } 
		  var comment=UI.Comment({x:initX+3*UNIT,y:initY-80,height:'55px',width:'208px',background:JAUNE,html:'Rechercher la prochaine occurence de '+valeur+' si elle existe',queue:Q,output:output});
          comment.animate({background:JAUNE},1500,1500);
          comment.remove();
	  }
   }while(obj.trouv==true);
	  Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0);  
		  
	}
	/***********************************************/
	    function permut_bulles(i, j) {         /// permutation des indices i et j dans le tableau 'tab' sans animation 
        
        /// on sauvegarde la valeur de tab[i] dans tmp
        var tmp = tab[i] , tab_i = tab[i], tab_j = tab[j] ;
        
        /// on permute les elements
        tab[i] = tab[j];
        tab[j] = tmp ;
        
        /// on colore les deux carres 
        tab_j.animate({ background : ROUGE}, 1000,    0  );
        tab_i.animate({ background : ROUGE}, 1000, 1000  );
        
        /// on deplace les deux carres vers le haut et vers le milieu 
        tab_i.animate({ x: ( X(i) + X(j) ) / 2 , y: initY - UNIT }, 1000,    0  );
        tab_j.animate({ x: ( X(i) + X(j) ) / 2 , y: initY + UNIT }, 1000, 1000  );
                
        /// puis vers leurs positions definitives
        tab_j.animate({  x : X(i) , y : initY }, 1000 , 0 );
        tab_i.animate({  x : X(j) , y : initY }, 1000 , 1000 );
        
        /// et on les décolore
        tab_j.animate({  background : GRIS }, 1000 , 0 );
        tab_i.animate({  background : GRIS }, 1000 , 1000 );
                
    }
   /************************************************/
	function tri(){  /// on utilise le tri par bulles (celui des tableaux)
	
	   UI.selectToolbar(0);
	   UI.selectAlgo(3);
	   if(tab.length==0) {
			var comment=UI.Comment({x:initX+2*UNIT,y:initY-1.5*UNIT,background:'#FFC',height:'37px',width:'155px',html:'Aucune liste à trier  !!',output:output});
	        comment.animate({background:JAUNE},1500,1500);
			comment.remove();
			Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0);  
			return;
	   }
	   var perm = false,
			i = 0,
			c = tab.length - 1,
			j=0; 
			var comment=UI.Comment({x:initX+2*UNIT,y:initY-3*UNIT,background:'#FFC',height:'95px',width:'230px',queue:Q,output:output});
             
        do {
                        
            perm = false ; 
            i = 0;
            while( i < c-j ) {
                
                if (tab[i].val() > tab[i+1].val()) {
					
				    comment.html("<p>Operation en cours : Tri de la liste ...</p> <p><em style='font-size:22px;color:red'>- On permute.</em></p>  ");
					comment.animate({opacity : 1}, 0);
                    
                    permut_bulles(i, i+1) ;
                    perm = true ;
                    
                }
                else {
					
					comment.html("<p>Operation en cours : Tri de la liste ...</p> <p><em style='font-size:22px;color:green'>- On a le bon ordre.</em></p>");
					comment.animate({opacity : 1}, 0);
                    
                    tab[i].animate( { background : VERT } , 1000,    0 ) ;
                    tab[i+1].animate( { background : VERT } , 1000, 2000 ) ;
                    
                    tab[i].animate( { background : GRIS } , 1000,    0 ) ;
                    tab[i+1].animate( { background : GRIS } , 1000, 1000 ) ;                  
                }
                i++;
            }   
            j++;
                    
         } while (perm == true) ;
         comment.remove();
       var comment2=UI.Comment({x:initX+2*UNIT,y:initY-1.5*UNIT,background:'#FFC',height:'37px',width:'195px',queue:Q,output:output});
        comment2.html("La liste est maintenant trié.");
		comment2.animate({background:VERT},500,500);
		comment2.animate({background:TRANS},100,100);
		comment2.animate({background:VERT},500,500);
		comment2.animate({background:TRANS},100,100);
		comment2.animate({background:VERT},500,500);
		comment2.animate({background:TRANS},100,100);
		comment2.animate({background:VERT},500,500);		
        comment2.animate({opacity : 0}, 0);
  	    Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0);       
	
	}
	/******************************************************/
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
			 _tab[j]=tab[j];
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
	/**********************************************************/
   function start_fusion(){
	    UI.selectToolbar(0);
	   if(tab.length==0 && _tab.length==0) {
							var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'230px',html:'remplis d\'abord la première liste !!',output:output});
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
						 
	   UI.selectAlgo(4); 
	   var h=0;           
	   for(var k=0;k<max(tab.length,_tab.length);k++){
		  if(initX+3*UNIT+(h+2)*(flecheSize+UNIT)>oWidth){
			  Q.enQueue( function(){
					 oWidth += 2*(UNIT+flecheSize)  ;
					 UI.outputWidth(oWidth);
					 canvas.width = oWidth; 
					 
				 },0);
				 fact.animate(0);
		  }
		   if(k<_tab.length){
			   _tab[k].animate({background:JAUNE,x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-1.5*UNIT},2000,2000);
			   _tab[k].animate({background:TRANS},0,0);
			   N_tab[h]=_tab[k];
			   if(k<_fleche.length){
					_fleche[k].remove();
					fact.animate(0);					
		        }
		        if(h>0){
					N_fleche[h-1]=fact.Arrow({x:initX+3*UNIT+(h-1)*(flecheSize+UNIT),y:initY-UNIT},{x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-UNIT});
					fact.animate(0);
				}		        
			 h++;
		   }
		   /***********
		    **********/
           if(k<tab.length){
			   tab[k].animate({background:JAUNE,x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-1.5*UNIT},2000,2000);
			   tab[k].animate({background:TRANS},0,0);
			   N_tab[h]=tab[k];
			   if(k<fleche.length){
					fleche[k].remove();
					fact.animate(0);
			   }
			   if(h>0){
					N_fleche[h-1]=fact.Arrow({x:initX+3*UNIT+(h-1)*(flecheSize+UNIT),y:initY-UNIT},{x:initX+2*UNIT+h*(flecheSize+UNIT),y:initY-UNIT});
					fact.animate(0);
				}
			 h++;
		   }		   		   
	   }
	   i=h;
	   initY=initY-1.5*UNIT;
	   initX=initX+2*UNIT;
       for(var j=0;j<N_tab.length;j++){
			 tab[j]=N_tab[j];
			 if(j<N_fleche.length) fleche[j]=N_fleche[j];
		 }	   
       N_tab.length=0;
       N_fleche.length=0;
	   _tab.length=0;
	   Q.enQueue(function () {
           UI.selectToolbar(1);
       }, 0);
       fusionner.bind('click',fusion);    
   }
	/******************************************************/
  /// on ajoute les fonctions au buttons
  	    
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
 trier.bind("click",tri);
 fusionner.bind('click',fusion);
 startFusion.bind('click',start_fusion);
 
 
 function afficherPrincipe() {
		
		$("#principe").dialog({ height: 590, width: 1000, autoOpen: false, modal: true , title : "Principe"});
		$("#principe").dialog("open");
	};           
 afficherPrincipe();
 });
  
