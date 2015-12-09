/*jslint indent: 4, nomen: true, devel: true, vars: true, browser: true */
/*globals jQuery, $, UI, LIB*/

$(function () {
    'use strict';
    
    var Q = LIB.getQueue(); // file d'animation
    
	UI.init({queue: Q});            // user Interface
     
    var UNIT = 50, 				/// La taille des carrés contenant les valeurs
        tabX = -10, tabY = 210;  /// La position du tableau
    
	var $output = $('#output'), // l'espace d'animation
		output = $output[0],
		$rechercher = $('#rechercher').button(), /// les boutons 
		$inserer = $("#inserer").button(),
		$supprimer = $("#supprimer").button(),
		$charger = $("#charger").button();
	
	
	UI.outputHeight( 7 * UNIT );
    UI.outputWidth( 20 * UNIT );
 
    var Rect = LIB.Rect,
        RectVal = LIB.RectVal,
        after = LIB.after,
        comment = UI.Comment;
    
    var tab = [],
        max_taille = 20,
        taille = 0;
    
    var ROUGE = "rgba(255, 0, 0, 0.6)",
		ROUGE_TRANS = "rgba(255, 0, 0, 0.4)",
        TRANS = "rgba(0, 0, 0, 0)",
        VERT  = "rgba(0, 255, 0, 0.6)",
        BLEU  = "rgba(0, 0, 255, 0.6)",
        JAUNE = "#FFC",
        ORANGE= "rgba(248, 125, 14, 0.6)",
        GRIS  = "#EEE",
        BLANC = "#FFF",
        NOIR  = "#000",
        BORDER_COLOR = "#AAA";
        
    
    function x(i) {
        return tabX + (UNIT * i);
    }
    
    var _tab = Rect({height: UNIT+'px', width: (UNIT * max_taille)+'px', x: tabX, y: tabY, boxShadow : "5px 5px 5px rgba(0,0,0,0.6)", output: output}),
    _tabInd = [];
    
    var _taille = RectVal({
        height: UNIT +'px', width: UNIT +'px',
        x: tabX + (0.8 * max_taille) * UNIT,
        y: tabY - 2 * UNIT,
        val: taille,
        output: output, 
        boxShadow : "5px 5px 5px rgba(0,0,0,0.6)"      
    }),
    
    _tailleInd = RectVal({
        height: UNIT / 2 +'px', width: UNIT +'px',
        x: tabX + (0.8 * max_taille) * UNIT,
        y: tabY - 2.5 * UNIT + 2,
        val: "Taille",
        output: output,
    });
        
    var comment_oper = comment({x:70, y:20, width:'300px', height:'100px', opacity:0, background:BLANC, borderColor: "rgb(15, 75, 234)", html:"", output:output}),
		comment_taille = comment({x: tabX + UNIT + 0.7*(max_taille) * UNIT, y: tabY - 4* UNIT, width:'200px', height:'40px', opacity:0, background:BLANC, borderColor: ORANGE, html:"", output:output});
		
	function aff() {
		
		  /// On remplis l'arriére plan du tableau avec des cases vides
		for ( var ind_alea = 0; ind_alea < max_taille ; ind_alea++ ) {
			
			var _nouv = Rect( { height: UNIT +'px', width: UNIT+'px',output: output, opacity : 0});
			
			_nouv.animate({
				x: x(ind_alea),
				y: tabY,
				opacity:1,
			}, 0);
		}
		///création des indices
        for ( ind_alea = 0; ind_alea < max_taille ; ind_alea++ ) {
			
			_tabInd.push(RectVal( {height: (UNIT / 2) +'px', width: UNIT +'px', val: ind_alea, output: output, boxShadow : "5px 5px 5px rgba(0,0,0,0.6)", opacity : 0}));
			
			_tabInd[ind_alea].animate({x: x(ind_alea),  y : tabY + UNIT + 2 }, 0) ;	
			_tabInd[ind_alea].animate({opacity : 1 }, 0);
		}
				
	}
	
	aff();
		
    function init(nb) {
		
		 var nbr = parseInt(nb, 10);
        
        if (isNaN(nbr) || nbr != nb) {
            
            afficher_erreur();
            return;
        }
        if(nbr<=0) return;
        if(taille + nbr > max_taille) {
			afficherDepas();
			return;
		}
		
				
        var ind_alea = 0 ;
        var Tsav=[];
        
        for ( ind_alea = 0; ind_alea < taille ; ind_alea++ ) {
			Tsav.push(tab[ind_alea].val());
		}
		
		
		for ( ind_alea = taille; ind_alea < nbr + taille ; ind_alea++ ) {
			Tsav.push(randomBetween( 0, 100 ));
		}
		
		/// on supprime les valeurs
		for ( ind_alea = 0; ind_alea < taille ; ind_alea++ ) {
			tab[ind_alea].remove();
		}
				
		tri_bulles_interne(Tsav);
		        
        
        for ( ind_alea = 0; ind_alea < taille + nbr; ind_alea++ ) {
			
			tab[ind_alea] = new RectVal({  x: x(ind_alea), y : tabY, height: UNIT  +'px', width: UNIT +'px', val: Tsav[ind_alea], opacity : 1, output: output});
	
		}       
				
	  	taille += nbr;
		_taille.animate({background: ORANGE}, 250);
		_taille.val(taille);
		_taille.animate({background: GRIS}, 0, 0);			
	}
	

    /// Retourne la mediane entre deux bornes
    function MED(inf,sup){
            return Math.floor( (inf+sup)/2 );
    }
        
    /// La recherche dichotomique
    function rech_dico(nbr) {
           
        var inf = 0,
            sup = taille - 1,
            med = MED(inf,sup),
            trouv = false;
        
        if ( taille === 0 )
            return { trouv: false, pos: 0 };
        
        var _inf, _med, _sup,
			leg_inf, leg_med, leg_sup,
			comment_inf,comment_med,comment_sup ;
        
        _inf = Rect({
            height: UNIT +'px', width: UNIT +'px',
            x: x(inf),
            y: tabY,
            background: ROUGE,
            output: output
        });     
        
        _med = Rect({
            height: UNIT +'px', width: UNIT +'px',
            x: x(med) - 5,
            y: tabY - 5,
            border: '5px solid',
            background: TRANS,
            borderColor: VERT,
            output: output
        });
        
        _sup = Rect({
            height: UNIT +'px', width: UNIT +'px',
            x: x(sup),
            y: tabY,
            background: BLEU,
            output: output
        });
        
        
        comment_med = comment({x:x(med) - 5,y:tabY-80,width:'140px',height:'50px',opacity:0,background:TRANS,borderColor: VERT,html:"On positionne le Med au milieu",output:output});
		comment_inf = comment({x:x(inf),y:tabY-80,width:'140px',height:'50px',opacity:0,background:TRANS,color:ROUGE,html:"L'inf devient le Med + 1.",output:output});        
		comment_sup = comment({x:x(sup),y:tabY-80,width:'140px',height:'50px',opacity:0,background:TRANS,color:BLEU ,html:"Le Sup devient le Med - 1.",output:output});        

        while (inf <= sup && !trouv) {
                        
            med = MED(inf,sup);
           
            comment_med.animate({x:x(med) - 5, opacity:1},1000,0);
            _med.animate({ x: x(med) - 5 }, 1000, 2000);
            
            comment_med.animate({opacity:0},0);

            //animAlgo(_algo, 8, 100, 100);///
            if (tab[med].val() === nbr) {
                
                _inf.remove();
                _med.remove();
                _sup.remove();
               /* leg_inf.remove();
				leg_med.remove();
				leg_sup.remove();*/
				comment_inf.remove();
				comment_med.remove();
				comment_sup.remove();
                
                //animAlgo(_algo, 10, 500, 500);///
                return { trouv: true, pos: med };
            }
            
           // animAlgo(_algo, 12, 500, 500);///
            
           // animAlgo(_algo, 14, 500, 500);///
            if ( tab[med].val() < nbr ) {
                
                inf = med + 1;
                
				comment_med.html("La valeur est supérieur au Med");
				comment_med.animate({opacity:1},500,2500);
				comment_med.animate({opacity:0},0);
				comment_med.html("On positionne le Med au milieu");						
		
                //animAlgo(_algo, 16, 1000, 2000);///
		
		
				comment_inf.animate({opacity:1},1000,1000);

				comment_inf.animate({x:x(inf),opacity:1},1000,0);
				_inf.animate({ x: x(inf) }, 1000, 2000);
				
				comment_inf.animate({opacity:0},1000);
		
            } else {
                //animAlgo(_algo, 18, 500, 500);///
                
                comment_med.html("La valeur est inferieur au Med");
				comment_med.animate({opacity:1},500,2500);
				comment_med.animate({opacity:0},0);
				comment_med.html("On positionne le Med au milieu");	
		
                sup = med - 1;
                
                //animAlgo(_algo, 20, 500, 500);///
                comment_sup.animate({opacity:1},1000,1000);

                
				comment_sup.animate({x:x(sup),opacity:1},1000,0);
                _sup.animate({ x: x(sup) }, 1000, 2000);
                
				comment_sup.animate({opacity:0},1000);
                
            }
        }
        
        comment_oper.html("La condition d'arrêt Sup < INF est verifiée  !");
        comment_oper.animate({background: ROUGE,opacity: 1},500,3000);
        
        _inf.remove();
        _med.remove();
        _sup.remove();
        /* leg_inf.remove();
        leg_med.remove();
        leg_sup.remove();*/
        comment_inf.remove();
        comment_med.remove();
        comment_sup.remove();
        
        //animAlgo(_algo, 27, 1000, 1000);///
        
        //animAlgo(_algo, 29, 500, 500);///
        return { trouv: false, pos: inf };
    }
    
    /// Les fonctions de décalage gauche et droite dont on a besoin pour la suppression et l'insertion
    function decalageDroite(i){
		
        for (var j = taille-1; i <= j ; j--){
            tab[j+1] = tab[j];
            tab[j].animate({ x: x(j+1) }, 500);
        }
    }
    
    function decalageGauche(i){
		
        for (var j = i; j < taille-1 ; j++){
            tab[j] = tab[j+1];
            tab[j].animate({ x: x(j) }, 500);
        }
    }
      
    /// permutation des deux elements aux indices 'i' et 'j'
    function xchg(i, j) {
		
        var temp = tab[i];
        tab[i] = tab[j];
        tab[j] = temp;
    }
    
    /// permutation des indices i et j dans le tableau 'tab' avec animation 
    function permut(i, j, garde_couleur) {               
     
        if ( garde_couleur == undefined )
			garde_couleur = false ;
        
        /// on recupere les deux cases
        var tab_i = tab[i], tab_j = tab[j] ;
        
        /// on permute les elements
        xchg(i, j);
        
		if ( !garde_couleur ) {			
			/// on colore les deux carres 
			tab_i.animate({ background : VERT}, 1000,    0  );
			tab_j.animate({ background : VERT}, 1000, 1000  );			
		}
		
        /// on deplace les deux carres vers le haut et vers le milieu 
        tab_i.animate({ x: ( x(i) + x(j) ) / 2 , y: tabY - 1.5 * UNIT }, 1000,    0  );
        tab_j.animate({ x: ( x(i) + x(j) ) / 2 , y: tabY + 1.5 * UNIT }, 1000, 1000  );
        
        /// puis vers leurs positions definitives
        tab_i.animate({  x : x(j) , y : tabY }, 1000 , 0 );
        tab_j.animate({  x : x(i) , y : tabY }, 1000 , 1000 );
        
		if ( !garde_couleur ) {			
			/// et on les décolore
			tab_i.animate({  background : GRIS }, 1000 , 0 );
			tab_j.animate({  background : GRIS }, 1000 , 1000 );
		}	
					
    }
    
    function tri_bulles_interne(array) {
                
        ///  'perm' est le booleen de permutaion
        var perm = false ,
			i = 0,
			c = array.length - 1,
			j = 0,
			tmp; 
             
        do {
                        
            perm = false ; 
            i=0;
            while( i < c - j ) {
                
                if ( array[i] > array[i+1] ) {
                    
                    tmp      = array[i];
                    array[i] = array[i+1];
                    array[i+1] = tmp;
                    
                    perm = true ;
                    
                }
                i++;                
            }   
            j++;
                    
         } while (perm == true) ;   
    }
  
	/// Retourne un entier aleatoire entre a et b
    function randomBetween(a, b) {
            return Math.floor(Math.random() * (b - a + 1)) + a;
        }
        
          
	function  fusionner ( indDebut, indMilieu, indFin ){
		
		var i = indDebut , j = indMilieu + 1 ;
		
		var temp = [];
		
		for ( var k = 0 ; k < indFin - indDebut+1 ; k++) {
			
			if ( i <= indMilieu && j <= indFin ) {
				
				/// on met la plus petite des valeurs entre tab[i] et tab[j] dans temp[k]
				if ( tab[i] <= tab[j]) {
					
					temp[k] = tab[i];
					i++;
				}
				else {
					
					temp[k] = tab[j];
					j++;
				}				
			}
			else {
				
				if( i <= indMilieu ) {
					
					temp[k] = tab[i];
					i++;
				}
				else {
					
					temp[k] = tab[j];
					j++;
				}
			}
		}
		
		///on recopie le tableau temporaire dans l'original
		for ( k = 0 ; k < indFin - indDebut +1; k++) {
			
			tab[indDebut + k] = temp[k];
		}
	}
       
    /// L'evenement de recherche de la valeur 'nbr'
    function e_rechercher(nbr) {
		
        if (taille === 0) {
            alert('Le tableau est vide.')
            return;
        }
        
        nbr = parseInt(nbr, 10);
        
        if (isNaN(nbr)) {
            //alert("Veuillez entrer une valeur numerique s.v.p");
            afficher_erreur();
            return;
        }
        
        /// On masque la barre des menus
        masquerMenu();
        /// On séléctionne l'algorithme de la recherche
        UI.selectAlgo(0);

        comment_oper.html("Operation en cours : Recherche de " + nbr);
        comment_oper.animate({opacity : 1}, 0,2000);
        
        var resultat = rech_dico(nbr);
        
        if (resultat.trouv) {
			
			tab[resultat.pos].animate({background:ORANGE},0);		
			comment_oper.html("La valeur " + nbr + " se trouve à la position "+ resultat.pos + " du tableau.");
			comment_oper.animate({ opacity : 1},0,5000); 
	
			comment_oper.animate({ opacity : 0},0);
			
			tab[resultat.pos].animate({background:GRIS},0);	
		}    
        else {
			
			comment_oper.html( "Le tableau ne contient pas la valeur " + nbr + ".");
			comment_oper.animate({ background: BLANC, opacity : 1},0,5000); 
			
			comment_oper.animate({ opacity : 0},0);
		}
		afficherMenu();
    }
    
	/// L'evenement d'insertion de la valeur 'nbr'		
    function e_inserer(nbr) {
        
        if ( taille === max_taille ) {
            afficher_Plein();
            return;
        }
        
        if (nbr === null)
            return;
        
        nbr = parseInt(nbr,10);
        
        if ( !isNaN(nbr) ) {
            
            masquerMenu();
            /// On séléctionne l'algorithme de l'insertion
			UI.selectAlgo(1);
            
            comment_oper.html("Opération en cours : Insertion de " + nbr + ".");
			comment_oper.animate({opacity : 1}, 0,2000);
           				   
			var _nouv = RectVal({ height: UNIT +'px', width: UNIT +'px', val: nbr, output: output });
			
			comment_oper.html("Détermination de la position de " + nbr + " par recherche dichotomique.");
			comment_oper.animate({opacity : 1}, 0,2000);
			
			var resultat = rech_dico(nbr);
			
			comment_oper.html("Opération en cours : Décalage. ");
			
			decalageDroite(resultat.pos)
			
			tab[resultat.pos] = _nouv;
			taille += 1;
			
			 _nouv.animate({
				x: x(resultat.pos),
				y: tabY
			}, 500);
			
			comment_taille.html("Incrémentation de la taille.");
			comment_taille.animate({opacity :1},500,2000);
			
			_taille.animate({background: ORANGE}, 250);
			_taille.val(taille);
			_taille.animate({background: GRIS}, 250, 0);
			
			comment_taille.animate({opacity :0},500);
			comment_oper.animate({ opacity : 0},0);

			afficherMenu();
        }
        else
			afficher_erreur();
    }
    
    /// L'evenement de suppression de la valeur 'nbr'
    function e_supprimer(nbr) {
        
        if (taille === 0) {
            afficher_Vide();
            return;
        }
        
        if (nbr === null)
            return;
        
        nbr = parseInt(nbr);
        
        if ( !isNaN(nbr) ) {
				
			masquerMenu();
			/// On séléctionne l'algorithme de la suppression
			UI.selectAlgo(2);
					
			comment_oper.html("Operation en cours : Suppression de " + nbr + ".");
			comment_oper.animate({opacity : 1}, 0,2000);
			
			comment_oper.html("Recherche dichotomique de " + nbr + ".");
			comment_oper.animate({opacity : 1}, 0,2000);
			
			var resultat = rech_dico(nbr);
			
			if (!resultat.trouv) {
				
				Q.enQueue(function () {
					alert('La valeur ' + nbr + " n'existe pas dans le tableau.");
					activer_les_boutons();
				}, 0);
				
			} else {
				
				tab[resultat.pos].remove();
				
				comment_oper.html("Décalage.");
				comment_oper.animate({opacity : 1}, 0,1000);
				
				decalageGauche(resultat.pos);
				
				comment_oper.animate({opacity : 0}, 0);
				
				taille -= 1;
				
				comment_taille.html("Décrementation de la taille.");
				comment_taille.animate({opacity :1},500,2000);
				
				_taille.animate({background: ORANGE}, 500);
				_taille.val(taille);
				_taille.animate({background: GRIS}, 500);
				
				comment_taille.animate({opacity :0},500);
				
				afficherMenu();
			}
	        
        } else
            afficher_erreur();
        
    }
    
    UI.inputMenu({
        button: $rechercher,
        onok: e_rechercher,
        autoClear: true,
        text: "Entrer la valeur à rechercher.",
        width: "180px"
    });
    
    UI.inputMenu({
        button: $inserer,
        onok: e_inserer,
        autoClear: true,
        text: "Entrer la valeur à insérer.",
        width: "170px"
    });
    
    UI.inputMenu({
        button: $supprimer,
        onok: e_supprimer,
        autoClear: true,
        text: "Entrer la valeur à supprimer.",
        width: "180px"
    });
    
    UI.inputMenu({
        button: $charger,
        onok: init,
        autoClear: true,
        text: "Entrer le nombre de valeurs à insérer.",
        width: "250px"
    });
           
    /// Les fonctions de masquage et d'affichage de la barre des menus
    function masquerMenu() {
		
		UI.selectToolbar(0);
	}
	
	function afficherMenu() {
		
		Q.enQueue(function () {
			UI.selectToolbar(1);
			UI.fire("anim-end");
		}, 0); 
	}
	
	function afficher_erreur() {
		
		$("#erreur").dialog({ height: 100, width: 500, autoOpen: false, modal: true , title : "Entrée erronée"});
		$("#erreur").dialog("open");
		
	}
	
	function afficher_Vide() {
		
		$("#vide").dialog({ height: 100, width: 700, autoOpen: false, modal: true , title : "Erreur"});
		$("#vide").dialog("open");		
	}
	
	function afficherDepas() {
		
		$("#depas").dialog({ height: 100, width: 700, autoOpen: false, modal: true , title : "Dépassement de capacité"});
		$("#depas").dialog("open");		
	}
	
	function afficher_Plein() {
		
		$("#plein").dialog({ height: 100, width: 700, autoOpen: false, modal: true , title : "Erreur"});
		$("#plein").dialog("open");		
	}
	
	function afficherPrincipe() {
		
		$("#principe").dialog({ height: 300, width: 800, autoOpen: false, modal: true , title : "Principe"});
		$("#principe").dialog("open");
	}
	afficherPrincipe();
	
});
