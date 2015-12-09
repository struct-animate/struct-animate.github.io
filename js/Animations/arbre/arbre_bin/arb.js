/*jslint indent: 4, nomen: true, devel: true, vars: true, browser: true */
/*globals jQuery, $, UI, LIB*/

$(function () {
    'use strict';
		
    var Q = LIB.getQueue();   // file d'animation
	UI.init({queue : Q, autoClear: true});          // user Interface
    var Rect = LIB.Rect,           // constructeur d'un rectangle
        RectVal = LIB.RectVal,     // constructeur d'un rectangle avec une valeur
        Circle = LIB.Circle,       // constructeur d'un cercle
        CircleVal = LIB.CircleVal, // constructeur d'un cercle avec une valeur
        Comment = LIB.Comment;     // constructeur d'un commentaire
    
    var output = LIB.$('#output'),               // espace d'animation
        $inserer = $('#inserer').button(),       // button d'insertion
        $rechercher = $('#rechercher').button(), // button de recherche
        $supprimer =  $('#supprimer').button(),  // button de suppression
        $rand =  $('#random').button(),          // button d'insertion aleatoire
		$parcours =  $('#parcours').button(),    // button de parcours
		$inordre =  $('#inordre').button(),      // button de parcours inordre
		$preordre =  $('#preordre').button(),    // button de parcours preordre
		$postordre =  $('#postordre').button(),  // button de parcours postordre
		$retour =  $('#retour').button(),        // button de retour vers le menu principal
        canvas = LIB.$('#canvas');               // espace de dessin ( pour les fleches )
    
	
// initialisation des dimension de l'output    
    var oHeight = 150,
        oWidth = 150;
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
    
// some cstes
    var UNIT  = 50,
        arbX  = (oHeight + UNIT) / 2,
        arbY  = 10,
        UNITY = 100,
        SEP   = 10;
    
    var ROUGE = "rgba(255, 0, 0, 0.6)",
        TRANS = "rgba(0, 0, 0, 0)",
        VERT  = "rgba(0, 255, 0, 0.6)",
        BLEU  = "rgba(0, 0, 255, 0.6)",
        JAUNE = "#FFC",
        GRIS  = "#EEE";
    
// les variable de la structure de l'arbre
    var racine = null,
        newNode = null,
        profondeur = 0;
    
// le constructeur des fleches
    var fact = LIB.Factory({ canvas : canvas, queue : Q });
    
    /***************************************************************************************************************************/
    /********************************* FONCTIONs DE L'IMPLEMENTATION DES ARBRES ************************************************/
    /***************************************************************************************************************************/
    
    function fg(node) {
        return (node === null) ? null : node.fg;
    }
    
    function fd(node) {
        return (node === null) ? null : node.fd;
    }
    
    function pere(node) {
        return (node === null) ? null : node.pere;
    }
    
    function x(node) {
        return (node === null) ? 0 : node.x;
    }
    
    function y(node) {
        return (node === null) ? 0 : node.y;
    }
    
// -> la valeur du noeud
    function valeur(node) {
        return (node) ? node.node.val() : undefined;
    }
    
    function afProf(node, prof) {
        if (node === null) { return; }
        node.prof = prof;
        afProf(node.fg, prof + 1);
        afProf(node.fd, prof + 1);
    }
    
    function afFg(node, f) {
        if (node === null) { return; }
        node.fg = f;
        if (f !== null) {
            f.pere = node;
            afProf(f, node.prof + 1);
        }
    }
    
    function afFd(node, f) {
        if (node === null) { return; }
        node.fd = f;
        if (f !== null) {
            f.pere = node;
            afProf(f, node.prof + 1);
        }
    }
    
// test si le noeud est un fils gauche ( retourne faux en cas de la racine )
    function isFg(node) {
        return (fg(pere(node)) === node);
    }
    
// -> nombre de feuilles dans l'arbre (node)
    function nbrFeuilles(node) {
        if (node === null) { return 0; }
        if (node.fg === null && node.fd === null) { return 1; }
        return nbrFeuilles(node.fg) + nbrFeuilles(node.fd);
    }
    
// -> nombre de noeuds dans l'arbre (node)
    function nbrNode(node) {
        if (node === null) {
            return 0;
        } else {
            return nbrNode(node.fg) + nbrNode(node.fd) + 1;
        }
    }
    
// -> nombre de pointeur vers null dans l'arbre (node)
    function nbrNull(node) {
        if (node === null) {
            return 1;
        }
        return nbrNull(node.fg) + nbrNull(node.fd);
    }
    
// applique une fonction a tous les noeuds d'un arbre
    function forEachArbre(node, fct) {
        if (node === null) {
            return null;
        } else {
            fct(node);
            if (node.fg !== null) { forEachArbre(node.fg, fct); }
            if (node.fd !== null) { forEachArbre(node.fd, fct); }
        }
    }
    
// applique des fonctions a une branche d'un arbre 
// nbr pour choisir la branche
// anotherShape : est une variable de type Rect ( ou une derivée )
// pere : si on a besion du pere en cas de null
    function forEachPath(node, nbr, funcSup, funcInf, funcEg, funcNull, anotherShape, pere) {
        if (node === null) {
            funcNull(node, anotherShape, pere);
        } else if (nbr < node.node.val()) {
            funcInf(node, anotherShape);
            forEachPath(node.fg, nbr, funcSup, funcInf, funcEg, funcNull, anotherShape, node);
        } else if (nbr > node.node.val()) {
            funcSup(node, anotherShape);
            forEachPath(node.fd, nbr, funcSup, funcInf, funcEg, funcNull, anotherShape, node);
        } else {
            funcEg(node, anotherShape);
        }
    }
    
/***************************************************************************************************************************/
/********************************* FONCTIONS D'INFORMATION SUR LE POSITIONEMENT ********************************************/
/***************************************************************************************************************************/
    
// -> la position du noeud maximal dans l'arbre
    function maxX(node) {
        if (node === null) { return -5000; }
        return Math.max(node.x, Math.max(maxX(node.fd), maxX(node.fg)));
    }
    
// -> la position du noeud minimal dans l'arbre
    function minX(node) {
        if (node === null) { return oWidth * 50; }
        return Math.min(node.x, Math.min(minX(node.fd), minX(node.fg)));
    }
    
// -> la taille effective de l'arbre ( la taille dans l'animation )
    function tailleArbre(node) {
        if (node === undefined || node === null) { return UNIT / 2 + SEP; }
        return (nbrNull(node) + nbrNode(node) - nbrFeuilles(node)) * (UNIT / 2 + SEP);
    }
// -> la profendeur maximal    
    function maxProf(node) {
        if (node === null) { return -5000;
                           } else if (fg(node) !== null || fd(node) !== null) { return Math.max(maxProf(fg(node)), maxProf(fd(node)));
                                                                              } else { return node.prof; }
    }
/***************************************************************************************************************************/
/********************************************* FONCTIONS DE POSITIONEMENT **************************************************/
/***************************************************************************************************************************/

// decalage sans animation : MAJ des coordonées du noeud  
    function decalerArb(node, dx, dy) {
        if (node === null) { return; }
        if (dx === undefined) { dx = 0; }
        if (dy === undefined) { dy = 0; }
        node.x += dx;
        node.y += dy;
        if (node.fg !== null) { decalerArb(node.fg, dx, dy); }
        if (node.fd !== null) { decalerArb(node.fd, dx, dy); }
    }
    
// centrer chaque pere par rapport a ces fils ( sans animation , juste une MAJ dans le noued )
    function centrerArb(node) {
        if (node !== null) {
            centrerArb(fg(node));
            centrerArb(fd(node));
            if (fg(node) !== null || fd(node) !== null) {
                var distance, posPere;
                if (fg(node) !== null && fd(node) !== null) {
                    distance = fd(node).x - fg(node).x;
                    posPere = distance / 2 + fg(node).x;
                } else if (fg(node) !== null) {
                    distance = (node.x - fg(node).x) + UNIT / 2 + 2 * SEP;
                    posPere = distance / 2 + fg(node).x;
                } else {
                    distance =  (fd(node).x - node.x) + UNIT / 2 + 2 * SEP;
                    posPere = fd(node).x - distance / 2;
                }
                node.x = posPere;
            }
        }
    }
    
// repositionner les noeuds de l'arbre pour optimiser l'espace pris par les sous-arbres ( sans animation )
    function rePosArb(node) {
        forEachArbre(node, function (node) {
            if (node === null) {
                return;
            }
            if (isFg(node)) {
                node.x = pere(node).x + UNIT / 2 - tailleArbre(node.fd) - UNIT / 2;
            } else {
                node.x = pere(node).x + UNIT / 2 + tailleArbre(node.fg);
            }
            node.y = pere(node).y + UNITY;
            node.prof = pere(node).prof + 1;
        });
    }
    
// redessiner toutes les fleches de l'arbre
    function redrawArrows(node) {
        forEachArbre(node, function (node) {
            if (node === null) { return; }
            if (node.arrowG !== undefined && node.fg !== null) { node.arrowG.update({x : node.x + UNIT / 4, y : node.y + UNIT}, {x : node.fg.x + 3 * UNIT / 4, y : node.fg.y}); }
            if (node.arrowG !== undefined && node.fg === null) { node.arrowG.remove(); node.arrowG = undefined; }
            if (node.arrowD !== undefined && node.fd !== null) { node.arrowD.update({x : node.x + 3 * UNIT / 4, y : node.y + UNIT}, {x : node.fd.x + UNIT / 4, y : node.fd.y}); }
            if (node.arrowD !== undefined && node.fd === null) { node.arrowD.remove(); node.arrowD = undefined; }
        });
    }
/************************************************************************************************************************************************/
/************************************************************************************************************************************************/
/************************************************************************************************************************************************/
    
// mettre chaque noeud en sa position et animer les fleches
    function animation(node, a) {
        if (node === null) { return; }
        node.node.animate({ x : node.x, y : node.y }, a * 250, 0);
		if (node.arrowG !== undefined && node.fg === null) {
			node.arrowG.remove();
			node.arrowG = undefined;
		}
        if (node.arrowG !== undefined && node.fg !== null) {
            node.arrowG.update({x : node.x + UNIT / 4, y : node.y + UNIT}, {x : x(fg(node)) + 3 * UNIT / 4, y : y(fg(node))});
        } else if (node.fg !== null) {
            node.arrowG = fact.Arrow({x : node.x + UNIT / 4, y : node.y + UNIT}, {x : x(fg(node)) + 3 * UNIT / 4, y : y(fg(node))});
        }
		
		if (node.arrowD !== undefined && node.fd === null) {
			node.arrowD.remove();
			node.arrowD = undefined;
		}
        if (node.arrowD !== undefined && node.fd !== null) {
            node.arrowD.update({x : node.x + 3 * UNIT / 4, y : node.y + UNIT}, {x : x(fd(node)) + UNIT / 4, y : y(fd(node))});
        } else if (node.fd !== null) {
            node.arrowD = fact.Arrow({x : node.x + 3 * UNIT / 4, y : node.y + UNIT}, {x : x(fd(node)) + UNIT / 4, y : y(fd(node))});
        }
        if (fg(node) !== null) { animation(fg(node), a); }
        if (fd(node) !== null) { animation(fd(node), a); }
    }
    
// reorganition de l'arbre 
    function redoArbre(racine, a) {
        
        profondeur = maxProf(racine);
        if (profondeur * (UNITY) + SEP > oHeight) {
            oHeight += UNITY;
            Q.enQueue(function () {
                hAff += UNITY;
                UI.outputHeight(hAff);
                canvas.height = hAff;
                redrawArrows(racine);
            }, 0);
            fact.animate(0);
        }
       
    // on recalcul les coordonées de l'arbre gauche/droit
        rePosArb(fg(racine));
        rePosArb(fd(racine));
        
    // on centre tous les noeuds
        centrerArb(racine);
        
    // on decale l'arbre pour optimiser l'espace    
        decalerArb(racine, -minX(racine) + UNIT, 0);
        
    // on MAJ les dimension de l'interface , output et canvas 
        
        Q.enQueue( (function (oWidth, oHeight) {
            return function () {
                oWidth = maxX(racine) + 2 * UNIT;
                UI.outputWidth(oWidth);
                canvas.width = oWidth;
                oHeight = profondeur * UNITY + arbX + UNIT;
                UI.outputHeight(oHeight);
                canvas.height = oHeight;
                redrawArrows(racine);
            }
        }(oWidth, oHeight)), 0);
    // on anime le tous
        
        animation(racine, a);
        fact.animate(a * 250);
    }
	function suivantInordre(node){
			var suiv=node.fd,_node = Rect({
						h: 50, w: 50,
						x: node.x + "px",
						y: node.y + "px",
						background: BLEU,
						borderColor: GRIS,
						output: output,
						queue: Q
				});
			if (suiv!=null){
				
				_node.animate({x:node.x, y: node.y,background: BLEU},1000,1000);
				UI.notify("descendons vers le fills droit",2000,500);
				_node.animate({x:suiv.x,y:suiv.y,background:BLEU,borderColor: GRIS},1500,1700);
				while(suiv.fg!=null){
					UI.notify("descendons vers le noeud le plus à gauche", 1500, 0);
					_node.animate({x:suiv.fg.x,y:suiv.fg.y,background:BLEU,borderColor: GRIS},1000,1700);
					suiv=suiv.fg;
				}
			}
			else {
				suiv=node.pere;
			}
			_node.remove();
			return suiv;
		}
		
	function isFg (node){
		if(node==racine) return false;
		if (node.pere.fg!=null) return (node.pere.fg.node.val()  == node.node.val());
		else return false;
	}
/************************************************************************************************************************************************/
/********************************************** LA FONCTON D'INSERTION **************************************************************************/
/************************************************************************************************************************************************/
    function e_insert(v, a) {
        var nbr = parseInt(v, 10);
        if (isNaN(nbr)) {
            alert("veuillez entrer un nombre ");
            return;
        }
        
        if (isNaN(a)) { a = 4; }
        if (a) {
            UI.selectToolbar(0); // choisir le toolbar des options
            UI.selectAlgo(1);    // choisir l'algorithme de l'insertion
        }
        var x,
            y = 10,
            pos;
        
    // notre cercle qui vas etre inserée    
        var _nouv = new CircleVal({ h: UNIT - 4, w: UNIT - 4, val: nbr, output: output, queue: Q });
        _nouv.animate({scaleY : 0.75, scaleX : 0.75, boxShadow : "5px 5px 5px rgba(0,0,0,0.6)"}, a * 50, 0);
        
        var algo_insertion = LIB.Algo({
            defaultCSS: { background: "" },
            activeCSS: { background: "#FF0" },
            domElement: $("#algo-insertion")[0],
            queue: Q
        });
    //***********************************************************************************************************************//
    //********************** defenition des fonctions utilisées dans les 4 cas possible *************************************//
    //***********************************************************************************************************************//
    
        function fSup(node, shape) {
            y = UNITY + y;
            pos = (fd(node) !== null) ? fd(node).x : node.x + UNIT / 2 + SEP;
            
            shape.animate({ background : BLEU}, a * 500, a * 250);
            shape.animate({x : pos, y : y + UNIT * 0.75}, a * 250, a * 250);
            shape.animate({ background : GRIS}, a * 250, a * 250);
        }
        
        function fInf(node, shape) {
            y = UNITY + y;
            pos = (fg(node) !== null) ? fg(node).x : node.x - UNIT / 2;
			
            shape.animate({ background : ROUGE }, a * 500, a * 250);
            shape.animate({ x : pos, y : y + UNIT * 0.75 }, a * 250, a * 250);
            shape.animate({ background : GRIS }, a * 250, a * 250);
        }
        
        function fEg(node, shape) {
            if (a !== 0) { UI.notify(" Element existe déja , on ne peut pas inserer", 250 * a, 250 * a); }
            node.node.animate({ background : VERT }, a * 500, a * 250);
            shape.animate({scaleX: 0, scaleY : 0, rotate : 359}, a * 250);
            shape.remove();
            node.node.animate({ background : GRIS }, a * 500, a * 250);
        }
        
        function fNull(node, shape, pere) {
            newNode = { node: shape,
                        fg: null,
                        fd: null,
                        prof:  (pere) ? pere.prof + 1 : 1,
                        pere: pere,
                        x: pos,
                        y: y };
            
            if (newNode.prof * (UNITY) + SEP > oHeight) {
                oHeight += UNITY;
                Q.enQueue(function () {
                    hAff += UNITY;
                    UI.outputHeight(hAff);
                    canvas.height = hAff;
                    redrawArrows(racine);
                }, 0);
                fact.animate(0);
            }
            
            if (nbr < pere.node.val()) {
                pere.fg = newNode;
            } else if (nbr > pere.node.val()) {
                pere.fd = newNode;
            }
            if (newNode.prof > profondeur) { profondeur = newNode.prof; }
            shape.animate({ scaleY: 1, scaleX: 1, borderRadius: "0%", background: JAUNE, y : y}, a * 250, a * 250);
            if (a !== 0) { UI.notify(" Emplacement trouvée , on alloue de l'espace memoire puis on le chaine avec son pere .", 250 * a, 250 * a); }
            shape.animate({ background: GRIS}, a * 250, 0);
        }
    
    //***********************************************************************************************************************//
    //*********************************************** le traitment commence *************************************************//
    //***********************************************************************************************************************//
    
    // si la racine == null on insere directement a la racine
        if (racine === null) {
            if (a !== 0) { UI.notify(" la racine = null donc on insere l'element directement à la racine .", 250 * a, 250 * a); }
            Q.wait(a * 500);
            _nouv.animate({
                x : (oWidth) / 2 - UNIT / 2,
                y : 10,
                scaleX : 1,
                scaleY : 1
            }, 500, 250);
            _nouv.animate({borderRadius : '0% 0%' }, a * 250);
            
            profondeur = 1;
            racine = {node: _nouv, fg: null, fd: null, prof: 1, pere: null, x: oWidth / 2 - UNIT / 2, y: 10};
        } else { // si racine != null
            if (a !== 0) { UI.notify(" on cherche l'emplacement de l'element ( superieur : droite , inferieur : gauche )", 250 * a, 250 * a); }
            
            pos = racine.x;
            _nouv.animate({ x: racine.x, y: 10 + UNIT * 0.75}, a * 500, a * 500);
        // on applique les 4 fonction a la branche choisie en utilisant nbr 
            forEachPath(racine, nbr, fSup, fInf, fEg, fNull, _nouv, null);
        // reorganisation de l'arbre
            redoArbre(racine, a);
        // on attend la fin de l'animation
            Q.wait(250 * a);
        }
        
    // on reselectionne le 1er toolbbar
        Q.enQueue(function () {
            UI.selectToolbar(1);
        }, 0);
        
    }
/************************************************************************************************************************************************/
/************************************************* LA FONTION RANDOM ****************************************************************************/
/************************************************************************************************************************************************/

// insertion de 'n' element aleatoirement 
    function e_rand(n) {
        if (isNaN(n)) { return; }
        var  i = 0;
        for (i = 0; i < n; i += 1) {
            e_insert(Math.random() * 1000, 0);
        }
    }
	function e_rechercher(nbr,a) {
	// rechercher un element dans un arbre 
        UI.selectToolbar(0); // choisir le toolbar des options
		UI.selectAlgo(0);
		var tr = false, // tr represente la condition d'arret
            z = 1;
        if (nbr === null) {//si nbr est null on s'arrete
            return;
        }
        nbr = parseInt(nbr, 10);
				
        if (!isNaN(nbr)) {
		// si nbr represente une valeur entière on lance le traitement
                var _node = CircleVal({// le cercle qui anime le parcours de l'arbre lors de la recherche
                    height: "50px", width: "50px",
                    x: arbX,
                    y: arbY,
                    val : nbr,
                    background: GRIS,
                    output: output,
                    queue: Q
                });
                
                _node.animate({scaleX : .75 , scaleY : .75},0);
                var x = (racine)? racine.x : 10 ;
                var y = arbY + UNIT*0.75;
                _node.animate({x : x , y : y },1000);
                var trace;
               (function recherche(currNode){
                trace=currNode;
                
                if(currNode == null){
                    UI.notify("L'arbre est vide aucune valeur n'existe !", 3000);
                    _node.remove();
                }
                else{
                    
                    
                    if(currNode.node.val() == nbr){
                        UI.notify(" la valeur recherchee existe !", 2500,0);
						_node.animate({x:currNode.x,y:currNode.y,background: VERT,scaleX:2,scaleY:2},1000,1300);
                        _node.animate({height:UNIT+"px",width:UNIT+"px",borderRadius:0,scaleX:1,scaleY:1},700,1200);
                        _node.remove();
                        tr=true;
                    }
                    else if(currNode.node.val()< nbr){
                        x=(currNode.fd !== null)? currNode.fd.x : currNode.x + UNIT / 2 + SEP;
                        y += UNITY;
                        _node.animate({ background : BLEU }, 1000, 500);
                        
                        if(currNode.fd!=null){
                            UI.notify(" la valeur recherchée est superièure à celle du noeud actuel : parcourons le sous-arbre droit", 3000, 2400);
							_node.animate({ x : x, y : y  }, 500, 500);
                            _node.animate({ background : GRIS }, 500, 700);	
                            recherche(currNode.fd);
                        }
                        else{
                            UI.notify(" la valeur recherchée est superièure à celle du noeud actuel et le fills droit et à null: on s'arrête !", 2000, 2200);
                            _node.remove();
                        }
                    }		
                    else{
                        x = (currNode.fg !== null)? currNode.fg.x : currNode.x - UNIT / 2;
                        y += UNITY;
                        _node.animate({ background : ROUGE }, 1000, 500);
                        
                        if(currNode.fg!=null){
							UI.notify(" la valeur recherchee est inferieure à celle du noeud actuel : parcourons le sous-arbre gauche", 3000, 2400);
                            _node.animate({ x : x, y : y }, 500, 500);
                            _node.animate({ background : GRIS }, 500, 700);
                            recherche(currNode.fg);
                        }
                        else{
                            UI.notify(" la valeur recherchee est superieure à celle du noeud actuel et le fills gauche et à null: on s'arrete", 2000, 2100);
                            _node.remove();
                        }
                    }
                }
                return trace;
                })(racine);
            }
            // on reselectionne le 1er toolbbar
            if(a === undefined){
				Q.enQueue(function () {
					UI.selectToolbar(1);
				}, 0);
			}
			else {
				Q.enQueue(function () {
					UI.selectAlgo(2);
				}, 0);
				
			}
            return {result: trace,trouv:tr};
    }
    
    
		
	function e_supprimer(nbr){
		var rech= e_rechercher(nbr,0);
		if(rech.trouv){
			var _nouv=Rect({
					h: 50, w: 50,
					x: rech.result.x,
					y: rech.result.y,
					b: 5,
					background: TRANS,
					borderColor: TRANS,
					output: output,
					queue: Q
			});
			if(rech.result.fd==null && rech.result.fg==null){
				UI.notify("le noeud se trouve dans une feuille : on doit just le supprimer et ");
				rech.result.node.animate({background:ROUGE,scaleX:0,scaleY:0,rotate:360},1000,1000);
				if(rech.result==racine) racine=null;
				else{
					if(isFg(rech.result)) {rech.result.pere.fg=null;UI.notify("on remet le fils gauche de son pere a null ");}
					else {UI.notify("on remet le fils droit de son pere a null ");rech.result.pere.fd=null;}
					rech.result.node.remove();
					if (nbr > rech.result.pere.node.val()) {
						rech.result.pere.arrowD.remove();
						rech.result.pere.arrowD = undefined;
					} else if (nbr < rech.result.pere.node.val()) {
						rech.result.pere.arrowG.remove();
						rech.result.pere.arrowG = undefined;
					}
				}
			}
			else if(rech.result.fd!=null && rech.result.fg!=null){
				UI.notify("la valeur qu'on souhaite supprimer se trouve dans un noued interne dont les 2 fils != null");
				UI.notify("on recherche le suivant inordre du noeud trouve");
				var si=suivantInordre(rech.result);
				_nouv.remove();
				rech.result.node.animate({background: ROUGE,scaleX:0,scaleY:0,rotate:360},1000,1000);
				si.node.animate({x:rech.result.x,y:rech.result.y},1000,1000);
				rech.result.node.animate({background:GRIS,scaleX:1,scaleY:1},0,0);
				si.node.remove();
				rech.result.node.animate({background:GRIS},0,0);
				rech.result.node.val(si.node.val());
				if(si.fd!=null) {
				if(rech.result.fd!=si) {si.pere.fg=si.fd; 					
				si.fd.pere=si.pere;}
				else {rech.result.fd=si.fd;si.fd.pere=rech.result; }
				}
				else {
					if(rech.result.fd!=si) si.pere.fg=null;
					else rech.result.fd=null;
				}
				if(rech.result==racine) rech.result.pere=null;
				si.x=rech.result.x;
				si.y=rech.result.y;
				
				if (si.arrowG !== undefined) {
					si.arrowG.remove();
					si.arrowG = undefined;
				}
				if (si.arrowD !== undefined) {
					si.arrowD.remove();
					si.arrowD = undefined;
				}
			}
			else {
				UI.notify("la valeur qu'on souhaite supprimer se trouve dans un noued interne dont 1 seule fils != null",2500,2600);						
				if(rech.result.fg!=null) {
					if(rech.result!=racine){
					if(isFg(rech.result)) {rech.result.pere.fg=rech.result.fg;rech.result.fg.pere=rech.result.pere;}
					else {rech.result.pere.fd=rech.result.fg;rech.result.fg.pere=rech.result.pere;}
					}
					else {racine=racine.fg;racine.pere=null;decalerArb(racine,0,-UNITY);}
					_nouv.remove();
					UI.notify("on le remplace par le sous-arbre gauche",3000,2000);
					rech.result.node.animate({background: ROUGE,scaleX:0,scaleY:0,rotate:360},1000,1000);
					rech.result.node.remove();//						
					
					if (rech.result.arrowG !== undefined) {
						rech.result.arrowG.remove();
						rech.result.arrowG = undefined;
					}
				}
				else {
					if(rech.result!=racine){
					if(isFg(rech.result)) {rech.result.pere.fg=rech.result.fd;rech.result.fd.pere=rech.result.pere;}
					else {rech.result.pere.fd=rech.result.fd;rech.result.fd.pere=rech.result.pere;}						
					}
					else {racine=racine.fd;racine.pere=null;decalerArb(racine,0,-UNITY);}
					_nouv.remove();
					UI.notify("on le remplace par le sous-arbre droit",3000,2000);
					rech.result.node.animate({background: ROUGE,scaleX:0,scaleY:0,rotate:360},1000,1000);
					rech.result.node.remove();
					if (rech.result.arrowD !== undefined) {
						rech.result.arrowD.remove();
						rech.result.arrowD = undefined;
					}
				}
			}
				fact.animate(0);
				// reorganisation de l'arbre
				redoArbre(racine,2);
				// on attend la fin de l'animation
				Q.wait(250);
		}
		Q.enQueue(function () {
			UI.selectToolbar(1);
		}, 0);
	}
	
	function pInordre(){
		UI.selectToolbar(0);
		var cpt=0,tab =[],i=0;
		var message = "";
		(function inordre(node){
			if(node!=null){
				inordre(node.fg);
				cpt++;
				var _node = new CircleVal({
						"font-size" :'30px',
						boxShadow : "5px 5px 5px rgba(255,255,255,0.8)",
						val : cpt,
						h: UNIT / 4, w: UNIT / 4,
						x: node.x ,
						y: node.y +30,
						textShadow: "5px 5px 5px #FF0000",
						scaleX:0.5,
						scaleY:0.5,
						background: "#FF6119",
						borderColor: GRIS,
						output: output,
						queue: Q
				});
				tab.push(_node);
				if(cpt === 1) message +=node.node.val();
				else message += " , "+node.node.val();
				UI.notify(message,2000,1000);
				node.node.animate({background: BLEU},1000,1000);
				_node.animate({val : cpt},0,0);
				inordre(node.fd);		
			}
		})(racine);
		(function reColor(node){
			if(node!=null){
				reColor(node.fg);
				tab[i].remove();
				i++;
				node.node.animate({background: GRIS},0,0);
				reColor(node.fd);		
			}
		})(racine);
		Q.enQueue(function () {
            UI.selectToolbar(1);
        }, 0);
	}
	function pPreordre(){
		UI.selectToolbar(0);
		var cpt=0,tab =[],i=0;
		var message = "";
		(function preordre(node){
			if(node!=null){
				cpt++;
				var _node = new CircleVal({
						"font-size" :'30px',
						boxShadow : "5px 5px 5px rgba(255,255,255,0.8)",
						val : cpt,
						h: UNIT / 4, w: UNIT / 4,
						x: node.x ,
						y: node.y +30,
						textShadow: "5px 5px 5px #FF0000",
						scaleX:0.5,
						scaleY:0.5,
						background: "#FF6119",
						borderColor: GRIS,
						output: output,
						queue: Q
				});
				tab.push(_node);
				if(cpt === 1) message +=node.node.val();
				else message += " , "+node.node.val();
				UI.notify(message,2000,1000);
				node.node.animate({background: BLEU},1000,1000);
				_node.animate({val : cpt},0,0);
				preordre(node.fg);
				preordre(node.fd);		
			}
		})(racine);
		(function reColor(node){
			if(node!=null){
				tab[i].remove();
				i++;
				node.node.animate({background: GRIS},0,0);
				reColor(node.fg);
				reColor(node.fd);		
			}
		})(racine);
		Q.enQueue(function () {
            UI.selectToolbar(1);
        }, 0);
	}
	function pPostordre(){
		UI.selectToolbar(0);
		var cpt=0,i=0,tab = [];
		var message = "";
		(function postordre(node){	
			if(node!=null){
				postordre(node.fg);
				postordre(node.fd);		
				cpt++;
				var _node = new CircleVal({
						"font-size" :'30px',
						boxShadow : "5px 5px 5px rgba(255,255,255,0.8)",
						val : cpt,
						h: UNIT / 4, w: UNIT / 4,
						x: node.x ,
						y: node.y +30,
						textShadow: "5px 5px 5px #FF0000",
						scaleX:0.5,
						scaleY:0.5,
						background: "#FF6119",
						borderColor: GRIS,
						output: output,
						queue: Q
				});
				tab.push(_node);
				if(cpt === 1) message +=node.node.val();
				else message += " , "+node.node.val();
				UI.notify(message,2000,1000);
				node.node.animate({background: BLEU},1000,1000);
				_node.animate({val : cpt},0,0);
				
			}
		})(racine);
				(function reColor(node){
			if(node!=null){
				reColor(node.fg);
				reColor(node.fd);		
				tab[i].remove();
				i++;
				node.node.animate({background: GRIS},0,0);
			}
		})(racine);
		Q.enQueue(function () {
            UI.selectToolbar(1);
        }, 0);
	}
	function cretour(){
		UI.selectToolbar(1);
	}
/** integration des buttons**/
    
      
    UI.inputMenu({
        button: $rechercher,
        onok: e_rechercher,
        text: " Veuiller introduire une valeur numérique ",
        autoClear: true,
        defaultValue: "0"
    });
    
    
    UI.inputMenu({
        button: $inserer,
        onok: e_insert,
        text: " Veuiller introduire une valeur numérique ",
        autoClear: true,
        defaultValue: "0"
    });
	function parcours (){
		UI.selectToolbar(2);
	}
	$parcours.bind("click", parcours);
	$inordre.bind("click", pInordre);
	$preordre.bind("click", pPreordre);
	$postordre.bind("click", pPostordre);
    $retour.bind("click",cretour); 
    UI.inputMenu({
        button: $supprimer,
        onok: e_supprimer,
        text: " Veuiller introduire une valeur numérique ",
        autoClear: true,
        defaultValue : '0'
    });
    
    UI.inputMenu({
        button: $rand,
        onok: e_rand,
        text: " Veuiller introduire une valeur numérique ",
        autoClear: true,
        defaultValue : '0'
    });
	
	
    $("#fenetre-principe").dialog({height : 550, width : 1000, autoOpen : false , modal : true , title : "Les Arbres de recherche binaires :" });
	$("#fenetre-principe").dialog("open");
});
