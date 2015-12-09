/*jslint indent: 4, nomen: true, devel: true, vars: true, browser: true */
/*globals jQuery, $, UI, LIB*/

$(function () {
    'use strict';
    
    var Q = LIB.getQueue(); /// file d'animation
    
	UI.init({queue: Q});            /// user Interface
      
        
    var Rect = LIB.Rect,           /// constructeur d'un rectangle
        RectVal = LIB.RectVal,     /// constructeur d'un rectangle avec une valeur
        Circle = LIB.Circle,       /// constructeur d'un cercle
        CircleVal = LIB.CircleVal, /// constructeur d'un cercle avec une valeur
        Comment = UI.Comment;     /// constructeur d'un commentaire
    
    var output = LIB.$('#output'),               						/// l'espace d'animation
        $inserer    = $('#inserer').button(),    						/// boutton d'insertion
        $rechercher = $('#rechercher').button(), 						/// boutton de recherche
        $supprimer  = $('#supprimer').button(),  						///boutton de suppression
        $rand       = $('#random').button(),     						/// boutton d'insertion aleatoire
        $parcours   = $('#parcours').button().bind("click",parcours), /// boutton des parcours
        $inordre    = $('#inordre').button().bind("click",inordre),          
        $preordre   = $('#preordre').button().bind("click",preordre),          
        $postordre   = $('#postordre').button().bind("click",postordre),
        $annuler    = $('#annuler').button().bind("click",annuler),    /// pour l'annulation du parcours'
        
        canvas = LIB.$('#canvas');               /// espace de dessin ( pour les fleches )
   
	/// quelques  cstes
    var UNIT  = 30, /// La taille des carrés contenant les valeurs
        UNITY = 60, /// la distance entre deux niveaux de l'arbre'
        SEP   = 10; /// la separation horizontale minimale entre les noeuds
        
    /// les variables de la structure de l'arbre
    var racine = null,
        newNode = null,
        ORDRE = 4,
        profondeur = 1;
	// initialisation des dimensions de l'output    
    var oHeight = 2 * UNIT * (profondeur + 1),
        oWidth = (ORDRE * UNIT + SEP) * ORDRE + SEP;
        
    var wAff = oWidth,
        hAff = oHeight;

	// initialisation des dimension de l'interface
    UI.outputHeight(oHeight);
    UI.outputWidth(oWidth);
    
	// initialisation des dimension de l'espace de dessin
    canvas.height = oHeight;
    canvas.width = oWidth;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, oHeight, oWidth); // effacement du contenu du canvas
    
    var ROUGE = "rgba(255, 0, 0, 0.6)",
        TRANS = "rgba(0, 0, 0, 0)",
        VERT  = "rgba(0, 255, 0, 0.6)",
        BLEU  = "rgba(0, 0, 255, 0.6)",
        JAUNE = "#FFC",
        GRIS  = "#EEE";
    
    // le constructeur des fleches
    var fact = LIB.Factory({ canvas : canvas }),
		comm = Comment({x : 0,
					y : oHeight,
					background : " rbga(255 , 255 , 255 , .6)",
					height: UNIT + 'px',
					width: oWidth + 'px',
					border : "0px",
					'text-align' : 'center',
					opacity : 0,
					output: output});

    /***************************************************************************************************************************/
    /********************************** FONCTIONS DE L'IMPLEMENTATION DES ARBRES  M-AIRES **************************************/
    /***************************************************************************************************************************/
    
    function Noeud(_premiereVal, posX, posY, prof, pere) {
        
        var cadre = new Rect({height: UNIT + 'px', width: ORDRE * UNIT + 'px', x : posX, y : posY, zIndex : -1, boxShadow : "5px 5px 5px rgba(0,0,0,0.6)", output: output}),
            fils = [],
            val = [],
            arrow = [],
            x = posX,
            y = posY,
            degre = 1,
            supp = [false],
            i;
        
        ///On met la valeur dans la premiere case du tableau des valeurs 
        val.push(_premiereVal);
        
        _premiereVal.animate({x : posX, y : posY, scaleX : 1, scaleY : 1, borderRadius : '0% 0%' }, 500, 0);
        
        /// On remplis par des carres vides
        for (i = 1; i < ORDRE; i += 1) {
			
            val.push(new Rect({height: UNIT + 'px', width: UNIT + 'px', x: posX + i * UNIT, y : posY, output: output}));
            supp.push(false);
        }
        /// On mets les fils a null 
        for (i = 0; i <= ORDRE; i += 1) {
            fils.push(null);
        }
        
		///------------------------------------------Definition des fonctions propres au noeud------------------------------------------
        
        /// Fonction de l'animation du noeud sans mouvement
        function animate(conf, animTime, waitTime) {
            var i;
            for (i = 0; i < ORDRE; i += 1) {
                val[i].animate(conf, animTime, 0);
            }
            cadre.animate(conf, animTime, waitTime);
        }
        
        /// Fonction de mouvement du noeud
        function move(conf, animTime, waitTime) {
			if (animTime == undefined) {
                animTime = waitTime;
            }
			x = conf.x || x;
			y = conf.y || y;
			
			for(var i = 0; i < ORDRE; i+=1)
                val[i].animate({x: x + i * UNIT, y: y}, animTime, 0);
                
            cadre.animate({x: x , y: y}, animTime, waitTime); 
		}
        
        /// Fonction de suppression du noeud de l'affichage
        function remove(){
            
            for(var i = 0; i < ORDRE; i+=1)
                val[i].remove();
                
            cadre.remove();
        }
             
               
        /// affecte 'leNoeud' comme i -eme fils de noeud
        function affecterFils(i, leNoeud) {
            
            fils[i] = leNoeud;
              
        }
        
        /// affecte 'val' comme i -eme valeur du noeud
        function affecterVal(i, node) {
            
            val[i].remove();
            
            val[i] = node;
            node.animate({x: this.x + i * UNIT,y : this.y}, 500, 0); 
            
        }
        
        function decalerValeurs(i, a) {
						
			val[this.degre].remove();
			
			for(var j = this.degre - 1; i <= j; j--) {
					
				val[j+1] = val[j];
				val[j].animate({x: x + (j + 1) * UNIT}, a*250);
				
			}
			val[i] = new Rect({height: UNIT + 'px', width: UNIT + 'px', x: x + i * UNIT, y: y, output: output});
			this.degre+=1;
		}
        
        
    return {
        animate        : animate,
        move           : move,
        remove         : remove,
        affecterFils   : affecterFils,
        affecterVal    : affecterVal,
        decalerValeurs : decalerValeurs,
        
        fils           : fils,
        val            : val,
        arrow		   : arrow,
        x              : x,
        y              : y,
        prof           : prof,
        pere           : pere,
        supp           : supp,
        degre          : degre
		};
    }
/***************************************************************************************************************************/
/********************************************* FONCTIONS DE PARCOURS *******************************************************/
/***************************************************************************************************************************/    
    
    
    
        
     
    
    function preordre() {
		
		var message = "",zero = 0;
		
		masquerMenu();
		
		function pre_ordre(noeud) {
		
        if(noeud != null) { 
			
            for(var i = 0; i < noeud.degre; i+=1) {
          
            if(!noeud.supp[i]) {
					if(!zero) {
						message += noeud.val[i].val();
						zero++;
					}
					else 
						message += " , "+noeud.val[i].val();
						
					UI.notify(message,2000,0);
					noeud.val[i].animate({background :VERT},2000);
					noeud.val[i].animate({background :GRIS},500);
				}
			}
			for(var i = 0; i <= noeud.degre; i+=1) {
				
                pre_ordre(noeud.fils[i]);
            }
        }   
    }
		pre_ordre(racine);
		afficherMenu();
	}
		
    function inordre() {
		var message = "",zero = 0;
		
		masquerMenu();
		
		function in_ordre(noeud) {
		
        if(noeud != null) { 
			
            for(var i = 0; i < noeud.degre; i+=1) {
				
                in_ordre(noeud.fils[i]);
                if(!noeud.supp[i]) {
					if(!zero) {message += noeud.val[i].val();zero++;}
					else {message += " , "+noeud.val[i].val();}
					UI.notify(message,2000,0);
					noeud.val[i].animate({background :VERT},2000);
					noeud.val[i].animate({background :GRIS},500);
				}
            }
            in_ordre(noeud.fils[noeud.degre]);
        }   
    }
		in_ordre(racine);
		afficherMenu();
	}
		
    function postordre() {
		
		var message = "",zero = 0;
		
		masquerMenu();
		
		function post_ordre(noeud) {
		
        if(noeud != null) { 
			
            for(var i = 0; i <= noeud.degre; i+=1) {
				
                post_ordre(noeud.fils[i]);
            }
            for(var i = 0; i < noeud.degre; i+=1) {
          
            if(!noeud.supp[i]) {
					if(!zero) {
						message +=noeud.val[i].val();
						zero++;
					}
					else 
						message += " , "+noeud.val[i].val();
						
					UI.notify(message,2000,0);
					noeud.val[i].animate({background :VERT},2000);
					noeud.val[i].animate({background :GRIS},500);
				}
			}
        }   
    }

		post_ordre(racine);
		afficherMenu();
    }
    
    function parcours() {UI.selectToolbar(2);} /// Affiche la barre des parcours
    
    function annuler() {UI.selectToolbar(1);}  /// Affiche la première barre d'outil
    

/***************************************************************************************************************************/
/********************************************* FONCTIONS DE BASE ***********************************************************/
/***************************************************************************************************************************/    

    /*
     * **************************** La recherche  ****************************
     * 
     * valeur :la valeur cherché
     * anim  : à vrai si on doit effectuer l'animation
     * 
     */
    function rech(valeur, anim) {
        
        if(racine == null) {
			
           afficherVide();/// Message d'erreur
           afficherMenu();
           return;
        } 
        else {
            var i = 0,  			/// Pour parcourir les noeuds
			trouv = false,      	/// Le booleen de la recherche
			noeudCourant = racine,
            Courant = null,
            fils = null,
            pos = 0;
            
            masquerMenu();
			
			if(anim) {
                
				var	tBorder = 4;	/// la taille de la bordure du carré de l'affichage
                
				var _cadre = Rect({ /// Le cadre qui va montré le noeud courant 
					height: UNIT +'px', width: UNIT +'px',
					x: racine.x - tBorder,
					y: racine.y - tBorder,
					border: '5px solid',
					background: TRANS,
					borderColor: VERT,
					output: output
				});
				
				
				comm.animate({y: oHeight, width: oWidth + 'px'}, 0); /// On ajuste le bloc de commentaires
				comm.html("On commence la recherche à la racine.");  /// et on l'affiche
				comm.animate({ opacity : 1}, 0, 2000);
			}
			
			while(!trouv) {
						
				while(i < noeudCourant.degre) { /// On parcours le noeud
					
					if(noeudCourant.val[i].val() == valeur) {  /// on a trouvé la valeur
                        
					if(anim) {
						_cadre.remove(); /// On supprime le cadre
                    }
						return {
							trouv : true,
							supp  : noeudCourant.supp[i],
							noeud : noeudCourant,
							pos : i
						}
					}
					
					if( valeur < noeudCourant.val[i].val()) { /// 'valeur'  est inferieure à la valeur courante
						
						if(noeudCourant.fils[i])  {/// Si le fils à gauche existe
						
                                Courant = noeudCourant;
                                fils = noeudCourant.fils[i];
                                pos = i;
                                
                                noeudCourant = noeudCourant.fils[i]; /// On continue la recherche dans le i-ème fils
                                i = 0;		
                            
							if(anim) {
								
								comm.html(" La valeur est supérieure à " + valeur + ". On continue la recherche dans ce fils.");
								comm.animate({opacity : 1}, 0);
								
								Q.enQueue(function(Courant, fils, pos){  /// On differencie le fils lien vers le fils
									return function (){
									fact.drawArrow({x : Courant.x + UNIT * pos, y : Courant.y + UNIT}, {x : fils.x + ORDRE * UNIT / 2, y : fils.y}, {color : "rgba(208, 25, 25, 0.9)", width: 3})
								}
								}(Courant, fils, pos),0);
                                
								Q.wait(3000);
								
								fact.animate(0);
                                
								Q.enQueue(function(){
								    ctx.clearRect(0, 0,  oWidth,oHeight); /// Effacement du contenu du canvas (les flèches)
                                    redrawArrows(racine, anim);
                               	},0);
                                
								fact.animate(0);
                                _cadre.animate({x:fils.x - tBorder, y:fils.y - tBorder}, 3000);
                                
                                Q.wait(2000);
							}							
							break;
						}
						else { /// Le fils gauche n'existe pas
							
							if(anim) {
								comm.html(" La valeur est supérieure à " + valeur + " et il n'y a pas de fils gauche. On s'arrête.");
								comm.animate({opacity : 1}, 0,4000);
							
								_cadre.remove(); /// On supprime le cadre
							}
							return {
								trouv : false,
								noeud : noeudCourant,
								pos : i
							}
						}
					} else { /// 'valeur'  est superieure à la valeur courante
						
						if (i + 1 < noeudCourant.degre) { /// S'il y a encore des valeurs dans le noeud
							i+=1;						  /// On s'y rend				
							
							if (anim){
								
								_cadre.animate({x : noeudCourant.x + i * UNIT - tBorder}, 500, 0);
								
								comm.html(" La valeur est inférieure à " + valeur + " et ce n'est pas la dernière valeur. On passe à suivante.");
								comm.animate({opacity : 1}, 0, 3000);
							}
						}
						else if(noeudCourant.fils[i+1]) { /// Si le fils à droite existe
                            
									Courant = noeudCourant;
                                    fils = noeudCourant.fils[i+1];
                                    pos = i+1;
                                    
                                    noeudCourant = noeudCourant.fils[i+1]; /// On continu la recherche dans le i-ème fils
                                    i = 0;	 /// à parir de la 1ère valeur	
                                                            
 							if(anim) {
								
								comm.html( valeur + " est supérieure à la dernière valeur du noeud. On continue la recherche dans le dernier fils ");
								comm.animate({opacity : 1}, 0);
								
								Q.enQueue(function(Courant, fils, pos){ /// On differencie le fils lien vers le fils
									return function (){
										fact.drawArrow({x : Courant.x + UNIT * pos, y : Courant.y + UNIT}, {x : fils.x + ORDRE* UNIT / 2, y : fils.y}, {color : "rgba(208, 25, 25, 0.9)", width: 3});
									}   
								}(Courant,fils, pos),0);
																
								Q.wait(4000);
								fact.animate(0);
								
								Q.enQueue(function(){
									
									ctx.clearRect(0, 0,  oWidth,oHeight); /// effacement du contenu du canvas
								
								    redrawArrows(racine, anim);	
                                },0);
								fact.animate(0);
                                Q.enQueue(function(fils){
									_cadre.animate({x:fils.x - tBorder, y:fils.y - tBorder}, 3000);
								}(fils),0);
                                Q.wait(2000);
							}   
							break;
						}
						else {///  le fils à droite n'existe pas
						
						if(anim) {
							
								comm.html(" La valeur est inferieure a " + valeur + " et il n'y a pas de fils droite. On s'arrête.");
								comm.animate({opacity : 1}, 0, 4000);
                            
								_cadre.remove(); /// On supprime le cadre
						
							}
							return {
								trouv : false,
								noeud : noeudCourant,
								pos : i+1
							}
						}
					}
				}
			}
        }
	}
        	        
/***************************************************************************************************************************/
/********************************************* FONCTIONS DE POSITIONEMENT **************************************************/
/***************************************************************************************************************************/

	/*
	 *  Décalage récursif de l'arbre sans animation : MAJ des coordonées de noeuds
	 */
    function decalerArb(node, dx, dy) {
		
		/// On met a jour les coordonnées du noeud
        if (dx === undefined) { dx = 0; }
        if (dy === undefined) { dy = 0; }
        
        node.x += dx;
        node.y += dy;
        
        /// Puis les coordonnées ces fils
        for(var i = 0; i <= node.ordre; i+=1) {
			
			if(node.fils[i]) { /// Si le fils existe
				
				decalerArb(node.fils[i], dx, dy)	/// On le décale
			}
		}
    }
    /*
     * **************************** Repositionnement de l'arbre  ****************************
     */
    
    function reposArbre() {
	
	var espaceDejaPris = SEP;
	
	function espacePris(noeud) {
		
		if(noeud === null)
			return 0;
		var espacePrisAvantNoeud = espaceDejaPris,
			espacePrisAvantFils  = espaceDejaPris;
		
		
		for (var i = 0; i <= noeud.degre; i+=1) {
			
			espacePrisAvantFils  = espaceDejaPris;
			if(noeud.fils[i]) {
				
				espaceDejaPris += espacePris(noeud.fils[i]);
				
				noeud.fils[i].x = (espaceDejaPris + espacePrisAvantFils) / 2 - (ORDRE * UNIT / 2);
			}
		}
		
		if (espacePrisAvantNoeud == espaceDejaPris) {
			
			noeud.x = espaceDejaPris;
			return ORDRE * UNIT + SEP;
		}
		else {
			
			noeud.x = (espacePrisAvantNoeud + espaceDejaPris) / 2 - (ORDRE * UNIT / 2);
			return espaceDejaPris - espacePrisAvantNoeud;
		}
		
	}
	var pris = espacePris(racine);
	
	racine.x = Math.max(pris/ 2 - ORDRE * UNIT / 2, oWidth / 2 - ORDRE * UNIT / 2);
	
	return  pris + SEP
}
    
// redessiner toutes les fleches de l'arbre
    function redrawArrows(node, a) {
           if (node === null) { return; }
           			
			for (var i = 0;i <= node.degre; i+=1) {
				if(node.fils[i]) {
						
					if (node.arrow[i] !== undefined) {
						
						node.arrow[i].update({x : node.x + UNIT * i, y : node.y + UNIT}, {x : node.fils[i].x + ORDRE* UNIT / 2, y : node.fils[i].y});
					} 
				} 
	}
    } 
/************************************************************************************************************************************************/
/****************************************************** La fonctions d'animation ***************************************************************/
/************************************************************************************************************************************************/
    
	/// Mise de chaque noeud a sa bonne position et mise a jour des fleches
    function animation(node, a) {
		
        if (node === null) { return; }
			node.move({ x : node.x, y : node.y }, a * 100, 0);
			
			for (var i = 0;i <= node.degre; i+=1) {
				if(node.fils[i]) {
						
					if (node.arrow[i] !== undefined) {
						
						node.arrow[i].update({x : node.x + UNIT * i, y : node.y + UNIT}, {x : node.fils[i].x + ORDRE* UNIT / 2, y : node.fils[i].y});
					} 
					else {
						node.arrow[i] = fact.Arrow({x : node.x + UNIT * i, y : node.y + UNIT}, {x : node.fils[i].x + ORDRE* UNIT / 2, y : node.fils[i].y});
					}
				} else if ( (node.arrow[i]) ) {
					node.arrow[i].remove();
				} 
				fact.animate(a);
	}
        
        for (var i = 0; i<=node.degre; i+=1) {
			
			if(node.fils[i])
				animation(node.fils[i], a);
		}
    }
    
/************************************************************************************************************************************************/
/********************************************** LA FONCTON DE RECHERCHE *************************************************************************/
/************************************************************************************************************************************************/
    function e_rechercher(v) {
		
		var nbr = parseInt(v, 10);
		
        if (isNaN(nbr) || nbr != v) {
			
            afficherErreur();
            return;
            
        } else if(racine === null) {
            
            afficherVide();
            return;
        }
        masquerMenu();

		var resultat = rech(nbr , true);
		
		if(resultat.trouv && !resultat.supp) {
			
			resultat.noeud.val[resultat.pos].animate({background : VERT}, 2000, 0);
			comm.html("Valeur trouvée.");
			comm.animate({opacity : 1}, 2000);
			
			comm.animate({opacity : 0}, 0 );
			resultat.noeud.val[resultat.pos].animate({background : TRANS},2000);
			
		}
		else {
			
			comm.html("Valeur introuvée.");
			comm.animate({opacity : 1}, 2000);
			comm.animate({opacity : 0}, 0);
		}
		afficherMenu();
    }
    
/************************************************************************************************************************************************/
/********************************************** LA FONCTON D'INSERTION **************************************************************************/
/************************************************************************************************************************************************/
    function e_inserer(v, a) {
        
    // a : ( a == 0 ) => random
    // a : undefined => insertion normale 
        
        if (isNaN(a)) { a = 2; }
        if (a) /// Dans le cas d'une insertion normale
			masquerMenu();
			
        var nbr = parseInt(v, 10);
        
        if (isNaN(nbr) ) { ///L'entrée est erronnée'
        
            afficherErreur();
            afficherMenu();
            return;
        }
        
    /// Notre cercle qui vas être inseré    
        var _nouv = new CircleVal({ x : 0, y : 0, height: UNIT + 'px', width: UNIT + 'px', val: nbr, output: output});
        _nouv.animate({scaleY : 0.8, scaleX : 0.8}, a * 50);
        
		/// On  met le commentaire en bas de l'animation
		comm.animate({y : oHeight, width: oWidth + 'px'}, 0);
	
        ///*********************************************** le traitment commence *************************************************//
        
    /// si la racine == null on insere directement a la racine
        if (racine === null) {
            comm.html(" La racine = null. On crée uneracine et on y insére l'élement.");
            comm.animate({opacity : 1}, a * 50, a * 1500);            
            
            profondeur = 1;
            racine = new Noeud(_nouv, oWidth / 2 - UNIT * ORDRE / 2, 10, profondeur, null);
                        
        } else { ///  racine != null
            comm.html("On cherche l'emplacement de l'élément. ");
            comm.animate({opacity : 1}, a * 1500);
            
            var resultat = rech(nbr, a);
            
            if(resultat.trouv && !resultat.supp) {
				
				comm.html(" L'élement existe déja.  ");
				comm.animate({opacity : 1}, a * 1500);
				
				_nouv.remove();			
			}
			else {
				comm.html("L'élement n'existe pas, on peut l'insérer.");
								
				_nouv.animate({scaleY: 1, scaleX: 1, borderRadius : '0% 0%' }, a * 1000);
				
				if(resultat.noeud.degre < ORDRE) {
					
					resultat.noeud.decalerValeurs(resultat.pos, a);
					resultat.noeud.affecterVal(resultat.pos, _nouv);
					}
				else { /// Le noeud ou on doit inserer est deja plein on en crée un nouveau avec la valeur
					
					var _nouvNoeud = Noeud(_nouv, resultat.noeud.x, resultat.noeud.y +  UNITY, resultat.noeud.prof + 1, resultat.noeud);
					
					resultat.noeud.affecterFils(resultat.pos, _nouvNoeud);
					
					profondeur = Math.max(profondeur,resultat.noeud.prof + 1);
				}	
			}
		}
		comm.animate({opacity : 0},0);   
		
		var max = reposArbre();
		
		/// on met à jour les dimension de l'interface , output et canvas 
		Q.enQueue(function () {
			
			oWidth = Math.max(max, (ORDRE * UNIT + SEP) * ORDRE + SEP);
			oHeight = 2 * UNIT * (profondeur + 1);
					
			UI.outputWidth(oWidth); /// redimendionnement de l'output
			UI.outputHeight(oHeight);
			 
			canvas.width  = oWidth; /// redimendionnement du canvas
			canvas.height = oHeight;		
		}, 0);
		
		animation(racine, a); /// repositionnement de l'arbre et mise à jour des coordonnées des fléches
		fact.animate(a);        /// dessin des flèches
				
		afficherMenu();
    }
    
/************************************************************************************************************************************************/
/********************************************** LA FONCTON DE SUPPRESSION *************************************************************************/
/************************************************************************************************************************************************/
    function e_supprimer(v) {
        		
        var nbr = parseInt(v, 10);
        
        if (isNaN(nbr) || nbr != v) { ///L'entrée est erronnée
        
            afficherErreur();
            return;
            
        }else if(racine === null) {
            
            afficherVide();
            return;
        }
        masquerMenu();
        
        var resultat = rech(nbr, 2);
        
        /// On le met le commentaire en bas de l'animation
		comm.animate({y : oHeight, width: oWidth + 'px'}, 0);
		
        if(resultat.trouv && !resultat.supp) {
			
			comm.html("La valeur a été trouvée. On la supprime logiquement ");
			comm.animate({opacity : 1}, 2500);
					
			resultat.noeud.supp[resultat.pos] = true;		
			resultat.noeud.val[resultat.pos].animate({color : ROUGE}, 1000);
			
			comm.animate({opacity : 0}, 0);
		}
		else {
			
			comm.html("La valeur n'existe pas. Suppression impossible. ");
			comm.animate({opacity : 1}, 3000);
			comm.animate({opacity : 0}, 0);
		}
		
		afficherMenu();
    }
    
/************************************************************************************************************************************************/
/************************************************* LA FONTION RANDOM ****************************************************************************/
/************************************************************************************************************************************************/

	/// Retourne un entier aleatoire entre a et b
    function randomBetween(a, b) {
            return Math.floor(Math.random() * (b - a + 1)) + a;
        }

	/// insertion de 'val_lu' element aleatoirement 
    function e_rand(val_lu) {
		
        var nb_inser = parseInt(val_lu, 10);
        
        if(isNaN(nb_inser) || nb_inser != val_lu) { ///L'entrée est erronnée
        
            afficherErreur();
            return;
        }
        var  i = 0;
        for (i = 0; i < nb_inser; i += 1) {
			
            e_inserer(randomBetween(0, 999), 0);
        }
    }
    
	/// integration des buttons dans l'interface
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
        button: $rand,
        onok: e_rand,
        autoClear: true,
        text: "Entrer le nombre de valeurs à insérer.",
        width: "250px"
    });
    
    
    /// Les fonctions de masquage et d'affichage de la barre des menus
    function masquerMenu() {
		
		UI.selectToolbar(0);
		UI.selectAlgo(0);
	}
	
	function afficherMenu() {
		
		Q.enQueue(function () {
			UI.selectToolbar(1);
			UI.fire("anim-end");
		}, 0);
	}
	
	function afficherErreur() {
		
		$("#erreur").dialog({ height: 100, width: 500, autoOpen: false, modal: true , title : "Entrée erronée"});
		$("#erreur").dialog("open");
	}
	
	function afficherVide() {
		
		$("#vide").dialog({ height: 100, width: 630, autoOpen: false, modal: true , title : "Erreur"});
		$("#vide").dialog("open");
		
	}
	
	function afficherPrincipe() {
		
		$("#principe").dialog({ height: 400, width: 800, autoOpen: false, modal: true , title : "Principe"});
		$("#principe").dialog("open");
	}
	afficherPrincipe();
});
