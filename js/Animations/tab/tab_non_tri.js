/*jslint indent: 4, nomen: true, devel: true, vars: true, browser: true */
/*globals jQuery, $, UI, LIB*/

$(function () {
    'use strict';
    
    var Q = LIB.getQueue(); /// file d'animation
    
	UI.init({queue: Q});    /// user Interface
	
    var UNIT = 50, 				/// La taille des carrés contenant les valeurs
		tabX = -10, tabY = 210;    /// La position du tableau
    
	var $output = $('#output'),  /// l'espace d'animation
		output = $output[0],
		$rechercher = $('#rechercher').button(), /// les boutons 
		$inserer = $("#inserer").button(),
		$supprimer = $("#supprimer").button(),
		$triBulles = $("#triBulles").button().bind("click",tri_bulles),
		$quickSort = $("#quickSort").button().bind("click",e_quickSort),
		$charger = $("#charger").button();
	
	var tab = [],         /// Le tableau
        max_taille = 20,  /// La taille maximale
        taille = 0;		  /// La taille effective
        
    UI.outputHeight( 7 * UNIT );
	UI.outputWidth( 20 * UNIT ); 
	
    
    var Rect = LIB.Rect,   /// Constructeurs
        RectVal = LIB.RectVal,
        after = LIB.after,
        comment = UI.Comment;
    
    var ROUGE = "rgba(255, 0, 0, 0.6)",  /// Couleurs
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
        return tabX + (UNIT  * i) ;
    }
    
    var _tab = Rect({height: UNIT+'px', width: (UNIT * max_taille)+'px', x: tabX, y: tabY, boxShadow : "5px 5px 5px rgba(0,0,0,0.6)", output: output}), ///Le tableau afiiché
    	_tabInd = []; /// Le tableau contenant les indices
    
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
		comment_taille = comment({x: tabX + UNIT + 0.7 * (max_taille) * UNIT, y: tabY - 4* UNIT, width:'200px', height:'40px', opacity:0, background:BLANC, borderColor: ORANGE, html:"", output:output});
		
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
				
			        
        
        for ( ind_alea = 0; ind_alea < taille + nbr; ind_alea++ ) {
			
			tab[ind_alea] = new RectVal({  x: x(ind_alea), y : tabY, height: UNIT  +'px', width: UNIT +'px', val: Tsav[ind_alea], opacity : 1, output: output});
	
		}       
				
	  	taille += nbr;
		_taille.animate({background: ORANGE}, 1000);
		_taille.val(taille);
		_taille.animate({background: GRIS}, 0, 0);			
	}	

			
    /// La recherche sequentielle
    function rech_seq(nbr) {
        var i = 0;
        while ( i < taille ) {
            tab[i].animate({background: ORANGE}, 1000);
            tab[i].animate({background: GRIS}, 700,300);
            
            if ( tab[i].val() === nbr ){
				
				tab[i].animate({background: BLEU},2000);
				tab[i].animate({background: GRIS},500);
                return { pos: i, trouv: true };
			}  
            i += 1;
        }
        
        return { trouv: false, pos: i };
    }
   
    /// Les fonctions de décalage gauche et droite dont on a besoin pour la suppression et l'insertion'
    
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
			tab_i.animate({ background : VERT}, 1500,    0  );
			tab_j.animate({ background : VERT}, 1500, 1000  );			
		}
		
        /// on deplace les deux carres vers le haut et vers le milieu 
        tab_i.animate({ x: ( x(i) + x(j) ) / 2 , y: tabY - 1.5 * UNIT }, 1500,    0  );
        tab_j.animate({ x: ( x(i) + x(j) ) / 2 , y: tabY + 1.5 * UNIT }, 1500, 1500  );
        
        /// puis vers leurs positions definitives
        tab_i.animate({  x : x(j) , y : tabY }, 1500 , 0 );
        tab_j.animate({  x : x(i) , y : tabY }, 1500 , 1500 );
        
		if ( !garde_couleur ) {			
			/// et on les décolore
			tab_i.animate({  background : GRIS }, 1500 , 0 );
			tab_j.animate({  background : GRIS }, 1500 , 1500 );
		}	
					
    }

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
        tab_i.animate({ x: ( x(i) + x(j) ) / 2 , y: tabY - UNIT }, 1000,    0  );
        tab_j.animate({ x: ( x(i) + x(j) ) / 2 , y: tabY + UNIT }, 1000, 1000  );
                
        /// puis vers leurs positions definitives
        tab_j.animate({  x : x(i) , y : tabY }, 1000 , 0 );
        tab_i.animate({  x : x(j) , y : tabY }, 1000 , 1000 );
        
        /// et on les décolore
        tab_j.animate({  background : GRIS }, 1000 , 0 );
        tab_i.animate({  background : GRIS }, 1000 , 1000 );
                
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
        
    function tri_bulles() {
		
		 if(taille == 0) {
			afficher_Vide();
			return;
		}
        
         /// On masque la barre des menus
         masquerMenu();
         UI.selectAlgo(3);
        
        comment_oper.html("Operation en cours : Tri bulles ");
        comment_oper.animate({opacity : 1}, 0,2000);

        ///  'perm' est le booleen de permutaion
        var perm = false,
			i = 0,
			c = tab.length - 1,
			j=0; 
             
        do {
                        
            perm = false ; 
            i = 0;
            while( i < c-j ) {
                
                if (tab[i].val() > tab[i+1].val()) {
					
					comment_oper.html("<p>Operation en cours : Tri bulles.</p> <p>- On permute.</p>  ");
					comment_oper.animate({opacity : 1}, 0);
                    
                    permut_bulles(i, i+1) ;
                    perm = true ;
                    
                }
                else {
					
					comment_oper.html("<p>Operation en cours : Tri bulles.</p> <p>- On a le bon ordre.</p>");
					comment_oper.animate({opacity : 1}, 0);
                    
                    tab[i].animate( { background : VERT } , 1000,    0 ) ;
                    tab[i+1].animate( { background : VERT } , 1000, 2000 ) ;
                    
                    tab[i].animate( { background : GRIS } , 1000,    0 ) ;
                    tab[i+1].animate( { background : GRIS } , 1000, 1000 ) ;                  
                }
                i++;
            }   
            j++;
                    
         } while (perm == true) ;
        
        comment_oper.html("Le tableau est maintenant trié.");
		comment_oper.animate({opacity : 1}, 0,3000);
		
        comment_oper.animate({opacity : 0}, 0);

		/// On affiche la barre des menus
         afficherMenu();
   
    }
 
	/// Retourne un entier aleatoire entre a et b
    function randomBetween(a, b) {
            return Math.floor(Math.random() * (b - a + 1)) + a;
        }
        
    function e_quickSort() {
		if(taille == 0) {
			afficher_Vide();
			return;
		}
			
        masquerMenu();
        UI.selectAlgo(4);
        
        comment_oper.html("Operation en cours : Quicksort.");
        comment_oper.animate({ borderColor : NOIR, opacity: 1}, 2000);
       
        function qSort(l, r) {
            
            if ( l >= r )
                return;
            
            /// Animation du sous tableau à trier    
            for ( var j = l ; j < r ; j++ ) {
                _tabInd[j].animate( { background : ROUGE }, 0, 0 ) ;
            }
            _tabInd[r].animate( { background : ROUGE }, 0, 4000 ) ;
                  
            comment_oper.animate({opacity: 0}, 500);
                    
            /// Choix d'un pivot aléatoire
          
			comment_oper.html("On choisi un pivot aléatoirement.");
            comment_oper.animate({color : BLEU, opacity: 1}, 500, 2000);
            
            var i = randomBetween(l, r),
				p = l;
				
                tab[i].animate( { background : BLEU }, 0, 2000 ) ;
            
            /// Mise du pivot à la fin du sous tableau 
                 
            if( i != r ) {
				
				comment_oper.html("On met le pivot à la fin de notre sous tableau.");
				comment_oper.animate({ opacity: 1}, 500, 0);
                permut(i, r, true);
			}
			else{
				
				comment_oper.html("Le pivot est déja à la fin de notre sous tableau.");
				comment_oper.animate({ opacity: 1}, 500, 0);
			}
			
            tab[r].animate( { background : BLEU }, 0, 2000 ) ;
            
            /// Recherche de la position du pivot
            
            comment_oper.html("<p color:\"VERT\">Recherche de la position du pivot dans le tableau.</p>");
			comment_oper.animate({ opacity: 1}, 500, 3000);
			
			comment_oper.html("<p color:\"VERT\">On suppose que le pivot doit être mis au début.</p>");
			comment_oper.animate({ opacity: 1}, 500, 0);
			
			_tabInd[p].animate({background:VERT}, 500, 3000);

			comment_oper.html("On teste les valeurs une à une.");
			comment_oper.animate({ opacity: 1}, 0, 3000);			
			
            for ( i = l; i < r; i++ ) {
				
                if ( tab[r].val() > tab[i].val() )
                {
					if ( p != i ) { 
							
						comment_oper.html("La valeur est inférieure au pivot");
						comment_oper.animate({ opacity: 1}, 0, 0);
						tab[i].animate({background:VERT}, 0, 3000);
						
						comment_oper.html("On permute donc cette valeur avec la valeur à place supposée du pivot");
						comment_oper.animate({ opacity: 1}, 0, 3000);
						
                        permut( p, i,true );  
                        
                        comment_oper.animate({opacity: 0}, 0, 1500);  
                        tab[i].animate({background:GRIS}, 0);
                        tab[p].animate({background:GRIS}, 0, 1000);
                    }
                    
                    comment_oper.html("La place du pivot est plus loin.");
					comment_oper.animate({ opacity: 1}, 0, 0);
					_tabInd[p].animate({background:ROUGE}, 500, 2000); 
					
					p += 1;
                                    
					_tabInd[p].animate({background:VERT}, 500, 2000);
                   
                }
                else {
						comment_oper.html("la valeur est supérieure à la valeur du pivot");
						comment_oper.animate({opacity: 1}, 0, 0);
						tab[i].animate({background:VERT}, 0, 2000);
				}
				tab[i].animate({background:GRIS}, 0, 2000);
			}
            
            if( p != r ) {
                
                comment_oper.html("On met le pivot à sa bonne place.");
				comment_oper.animate({ opacity: 1}, 0, 2500);
				
                permut(r, p, true);
                
                tab[p].animate({background:JAUNE}, 500, 1000);
                
                comment_oper.animate({opacity: 0}, 0, 1500);  

			}
                
            tab[p].animate({background : GRIS}, 0, 1000) ;
            
            for ( j = l ; j <= r ; j++ ) {
                _tabInd[j].animate({background : GRIS}, 0) ;
            }
				
            /// On lance les tris des sous tableau à gauche et à droite du pivot       
            
            comment_oper.html("Voici le sous tableau à trié.");
            comment_oper.animate({borderColor : ROUGE, opacity: 1}, 200, 0);
            
            qSort( l, p - 1 );
            
            for ( j = l ; j <= p-1 ; j++ ) {
                tab[j].animate({background : JAUNE}, 0) ;
            }
            
            comment_oper.html("Voici le sous tableau à trié.");
            comment_oper.animate({borderColor : ROUGE, opacity: 1}, 200, 0);
            
            qSort( p + 1, r );
            
            comment_oper.html("Le tableau est maintenant trié.");
			comment_oper.animate({opacity: 1}, 0, 2500);
			
			comment_oper.animate({opacity: 0}, 0);  

            afficherMenu();
        };
        
        /// appel de la fonction recursive 
        qSort( 0 , tab.length - 1 );
        
        for ( var ind = 0 ; tab.length ; ind++ ) {
                tab[ind].animate({background : GRIS}, 0) ;
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
            afficher_erreur();
            return;
        }
        
        masquerMenu();
        /// On séléctionne l'algorithme de la recherche
        UI.selectAlgo(0);
        
        comment_oper.html("Operation en cours : Recherche de " + nbr);
        comment_oper.animate({opacity : 1}, 0,2000);
        
        var resultat = rech_seq(nbr);
        
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
        
        nbr = parseInt(nbr);
        
        if ( !isNaN(nbr) ) {
            
            masquerMenu();
            /// On séléctionne l'algorithme de l'insertion
			UI.selectAlgo(1);
            
            comment_oper.html("Operation en cours : Insertion de " + nbr + ".");
			comment_oper.animate({opacity : 1}, 0,2000);
        
			/// non trie
			/// insertion directe
			var _nouv = RectVal({ height: UNIT +'px', w: UNIT +'px', val: nbr, output: output });
			
			tab.push( _nouv );
			taille += 1;
			
			comment_taille.html("Incrementation de la taille.");
			comment_taille.animate({opacity :1},500,2000);
			
			_taille.animate({background: ORANGE}, 250);
			_taille.val(taille);
			_taille.animate({background: GRIS}, 250, 0);
			
			comment_taille.animate({opacity :0},500);
							
			_nouv.animate({
				x: x(taille - 1), /// car nous avons deja incrementer taille
				y: tabY
			}, 500);
			
			afficherMenu();
			
			comment_oper.animate({opacity : 0}, 0);
		
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
			/// On séléctionne l'algorithme de la recherche
			UI.selectAlgo(0);
                    
            comment_oper.html("Operation en cours : Suppression de " + nbr + ".");
			comment_oper.animate({opacity : 1}, 0,2000);
            	
			comment_oper.html("Recherche séquentielle de " + nbr + ".");
			comment_oper.animate({opacity:1},0,2000);
			var resultat = rech_seq(nbr);
			
			comment_oper.animate({opacity:0},0);

			if (!resultat.trouv) {
				
				Q.enQueue(function () {
					alert('La valeur '+ nbr +" n'existe pas dans le tableau.");
					activer_les_boutons();
				}, 0);
				
			} else {
			   
				if(resultat.pos != taille - 1) {
				
					tab[resultat.pos].remove();	
					tab[resultat.pos] = tab.pop();
					
					comment_oper.html("Remplacement par le dernier du tableau ");
					comment_oper.animate({opacity:1},0,2000);
				
					tab[resultat.pos].animate( {x: x(resultat.pos) }, 1000);	
					
					comment_oper.animate({opacity:0},0);					
				}
				else {
					comment_oper.html("C'est le dernier élement qui est supprimé");
					comment_oper.animate({opacity:1},0,3000);
					
					tab[resultat.pos].remove();
												
					comment_oper.animate({opacity:0},0);					

				}
				taille -= 1;
				
				comment_taille.html("Décrementation de la taille.");
				comment_taille.animate({opacity :1},500,2000);
				
				_taille.animate({background: ORANGE}, 500);
				_taille.val(taille);
				_taille.animate({background: GRIS}, 500);
				
				comment_taille.animate({opacity :0},500);
				
				masquerMenu();                
			}
            
            
        } else
			afficher_erreur();
	}

    
    UI.inputMenu({
        button: $rechercher,
        onok: e_rechercher,
        autoClear: true,
        defaultValue: "0"
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
	};
	afficherPrincipe();
	
});
