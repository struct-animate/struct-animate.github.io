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
			initX=50,
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
     trier=$('#trier').button(),
     fusionner=$('#fusion').button(),
     startFusion=$('#start_fusion').button(),
     canvas = LIB.$('#canvas'),               // espace de dessin ( pour les fleches )
     canvas2 = LIB.$('#canvas2');
    // initialisation des dimension de l'interface
    UI.outputHeight(oHeight);
    UI.outputWidth(oWidth);
// initialisation des dimension de l'espace de dessin
    canvas.height = oHeight;
    canvas.width = oWidth;
    canvas2.height = oHeight;
    canvas2.width = oWidth;
 var ctx = canvas.getContext("2d");
 var ctx2 = canvas2.getContext("2d"); 
 ctx.clearRect(0,0,oWidth,oHeight);
 ctx2.clearRect(0,0,oWidth,oHeight);
 var fact = LIB.Factory({ canvas : canvas });
 //var line = LIB.LineFactory({ canvas : canvas2 });
 var ligneFD = {};
/******************************************************/ 
 function max(a,b){
  return(a<=b ? b : a);
 }
/*****************************************************/ 
 function  rech_seq (valeur) {
	 
		var i=0 ;
		for(i in tab){
			tab[i].animate({background: VERT}, 500);
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
        tab.length--;

         fleche[fleche.length-1].remove();
         fact.animate(250);
         ligneFD.right.remove();
		 ligneFD.bottom.remove();
		 ligneFD.left.remove();
		 
		 if(tab.length == 1){
			ligneFD.top.remove();
			ligneFD.final.remove(); 
			fact.animate(0);
		 }
		 else{
			 ligneFD.right=fact.Line({x:initX+UNIT+(i-2)*(flecheSize+UNIT),y:initY+UNIT/2},{x:initX+(1.5)*UNIT+(i-2)*(flecheSize+UNIT),y:initY+UNIT/2});
			 ligneFD.bottom=fact.Line({x:initX+(1.5)*UNIT+(i-2)*(flecheSize+UNIT),y:initY+UNIT/2},{x:initX+(1.5)*UNIT+(i-2)*(flecheSize+UNIT),y:initY+2*UNIT});
			 ligneFD.left=fact.Line({x:initX+(1.5)*UNIT+(i-2)*(flecheSize+UNIT),y:initY+2*UNIT},{x:initX-UNIT/2,y:initY+2*UNIT});
	     }		 
		 fact.animate(0);         
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
		var comment=UI.Comment({x:initX+i*(flecheSize+UNIT),y:initY-80,height:'35px',width:'190px',background:JAUNE,html:'la valeur '+valeur+' n\'existe pas !!!',queue:Q,output:output});				
				comment.animate({background:JAUNE},2000,2000);
				comment.remove();
	}
	else {
         var comment=UI.Comment({x:initX+i*(flecheSize+UNIT),y:initY-80,height:'35px',width:'250px',background:JAUNE,html:'la valeur '+valeur+' se trouveà l\'adresse : '+obj.pos,queue:Q,output:output});				
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
		var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'265px',html:'veuillez entrer une adresse valide SVP !',output:output});
		   comment.animate({background:JAUNE},1500,1500);
		   comment.remove();
	       Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0); 
	     return;
	   }
	var i=0;
	while(i<tab.length && i!=adr){
	    tab[i].animate({background: VERT}, 500);
        tab[i].animate({background: GRIS}, 500);	
 		i++;       
	}
	if(i==adr && i<tab.length){
		var comment=UI.Comment({x:X(tab.length-1)+UNIT,y:initY-80,height:'55px',width:'222px',background:JAUNE,html:'la valeur qui se trouve a l\'adresse '+adr+' est : '+tab[i].val(),queue:Q,output:output});
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
	   //valeur=parseInt(valeur);
	   if(parseInt(valeur) != valeur){
		   var comment=UI.Comment({x:initX,y:initY-100,background:JAUNE,height:'35px',width:'340px',html:'veuillez entrer une valeur numérique entière SVP  !',output:output});
		   comment.animate({background:JAUNE},2000,2000);
		   comment.remove();
		   Q.enQueue(function () {
                      UI.selectToolbar(1);
                       }, 0); 
		   return;
	   }
	   if(isNaN(valeur)){
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
		  if(i == 1){
			  var comment=UI.Comment({x:initX+UNIT/2,y:initY-50,height:'35px',width:'173px',background:JAUNE,html:'Chainage avec le suivant',output:output});
		      comment.animate({background:JAUNE},1000,1000);
		      comment.remove();
		  }
		  if(i>0){			  			  
			  fleche[i-1]=fact.Arrow({x:initX+(i-1)*(flecheSize+UNIT)+UNIT,y:initY+UNIT/2},{x:initX+(i)*(flecheSize+UNIT),y:initY+UNIT/2});			 
			  fact.animate(0);
			  
			  if(i==1){
				  Q.wait(500);
				  var comment=UI.Comment({x:initX+(1.5)*UNIT,y:initY-80,height:'45px',width:'185px',background:JAUNE,html:'Chainage entre le premier et le dernier maillon',output:output});			  
				  comment.animate({background:JAUNE},1000,1000);
				  comment.remove();
		      }
			  if(ligneFD.right != null){
				  ligneFD.right.remove();
				  ligneFD.bottom.remove();
				  ligneFD.left.remove();
				  ligneFD.top.remove();
				  ligneFD.final.remove();
			  }
			  
			  ligneFD.right=fact.Line({x:initX+UNIT+(i)*(flecheSize+UNIT),y:initY+UNIT/2},{x:initX+(1.5)*UNIT+(i)*(flecheSize+UNIT),y:initY+UNIT/2});
			  ligneFD.bottom=fact.Line({x:initX+(1.5)*UNIT+(i)*(flecheSize+UNIT),y:initY+UNIT/2},{x:initX+(1.5)*UNIT+(i)*(flecheSize+UNIT),y:initY+2*UNIT});
			  ligneFD.left=fact.Line({x:initX+(1.5)*UNIT+(i)*(flecheSize+UNIT),y:initY+2*UNIT},{x:initX-UNIT/2,y:initY+2*UNIT});
			  ligneFD.top=fact.Line({x:initX-UNIT/2,y:initY+2*UNIT},{x:initX-UNIT/2,y:initY+UNIT/2});
			  ligneFD.final=fact.Arrow({x:initX-UNIT/2,y:initY+UNIT/2},{x:initX,y:initY+UNIT/2});
			  
			  fact.animate(0);
			  //line.animate(0);
			  
	       }
		  if(i==0){
				  var comment=UI.Comment({x:initX-115,y:initY-40,height:'35px',width:'120px',background:JAUNE,html:'La tête de la liste',queue:Q,output:output});
				  comment.animate({background:JAUNE},2000,2000);
				  comment.remove();		  
	      }	       
          i+=1;
          if(X(i)+3*UNIT>oWidth){
			  Q.enQueue( function(){
					 oWidth += UNITY ;
					 UI.outputWidth(oWidth);
					 canvas.width = oWidth; 
					 canvas2.width= oWidth;
					 fact.animate(0);
					 //line.animate(0);
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
		   var comment=UI.Comment({x:initX+3*UNIT,y:initY-80,height:'35px',width:'208px',background:JAUNE,html:'Rechercher la valeur '+valeur+' .',queue:Q,output:output});
		      comment.animate({background:JAUNE},1500,1500);
			  comment.remove();
 do{
	  var obj=rech_seq(valeur);
	  if(obj.trouv == false) {
				var comment=UI.Comment({x:initX+i*(flecheSize+UNIT),y:initY-80,height:'35px',width:'190px',background:JAUNE,html:'Aucun élément a supprimé  !',queue:Q,output:output});				
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
		  var comment=UI.Comment({x:initX+3*UNIT,y:initY-80,height:'55px',width:'198px',background:JAUNE,html:'Rechercher la prochaine occurence de '+valeur+' si elle existe',queue:Q,output:output});
          comment.animate({background:JAUNE},2000,2000);
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
			var comment=UI.Comment({x:initX+2*UNIT,y:initY-1.5*UNIT,background:'#FFC',height:'37px',width:'145px',html:'Aucune liste à trier  !!',output:output});
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
       var comment2=UI.Comment({x:initX+2*UNIT,y:initY-1.5*UNIT,background:'#FFC',height:'37px',width:'185px',queue:Q,output:output});
        comment2.html("La liste est maintenant triée.");
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
 
 
 function afficherPrincipe() {
		
		$("#principe").dialog({ height: 590, width: 1000, autoOpen: false, modal: true , title : "Principe"});
		$("#principe").dialog("open");
	};           
 afficherPrincipe();
 });
  
