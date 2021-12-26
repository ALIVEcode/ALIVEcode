// La simulation utilse la library p5.js
import { Shape } from './Shape';
import { FixedObject } from './FixedObject';
import { FixedTextObject } from './FixedTextObject';
import { Obstacle } from './ts/Obstacle';
import { Road } from './ts/Road';
import { Terrain } from './ts/Terrain';
import { Interactive as InteractiveObject } from './ts/Interactive';
import { TextObject } from './ts/TextObject';
import { Car } from './Car';
import { CanvasCamera } from './Camera';
import { Vector } from './Vector';
import { loadAllImages, loadSounds, images } from './assets';
import { editModeSection } from './editMode';
import { floatEquals, overlap } from './functions';
import $ from 'jquery';
import { PhysicEngine } from '../physicEngine/physicEngine';
import { Serializer } from './ts/Serializer';
import { Decoration } from './ts/Decoration';
import { Figure } from './ts/Figure';

export const sketch = s => {
	// #region Setup
	let width;
	let height;
	let canvas;
	let jCanvas;
	let canvasDiv;
	let previousParent;

	s.updateWithProps = props => {
		if (props.init) s.init = props.init;
		if (props.fullscreenDiv)
			s.fullscreenDiv = $(`.${props.fullscreenDiv}`).first();
		if (props.canvasDiv) {
			canvasDiv = props.canvasDiv;
			if (!s.canvasLoaded) s.setup();
			s.canvasLoaded = true;
		}
		if (props.onChange) s.onChange = props.onChange;
		if (props.onWin) s.onWin = props.onWin;
		if (props.onLose) s.onLose = props.onLose;
		if (props.onConnectCar) s.onConnectCar = props.onConnectCar;
	};

	// Used when simulation unmount
	s.cleanup = () => {
		s.noLoop();
		s.canvasLoaded = false;
		s.remove();
	};

	s.preload = () => {
		//********************************* Images *********************************
		// Load des images
		loadAllImages(s);

		//********************************* Audio **********************************
		loadSounds(s);
	};

	s.setup = () => {
		if (canvasDiv == null) return;
		s.canvasLoaded = true;
		s.loading = true;

		editModeSection(s);
		//************************** Setup Canvas **********************************

		s.zoomButton = $('.zoom-button').first();

		width = canvasDiv.width();
		height = canvasDiv.height();
		canvas = s.createCanvas(width, height);
		canvas.parent(canvasDiv[0]);
		jCanvas = $('canvas').last();
		s.resize();
		setTimeout(s.resize, 100);
		$(window).resize(s.resize);
		s.fullscreen = false;

		//********************** Variables pour mobile *****************************
		// Detection mobile
		s.isMobile = false;
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
				navigator.userAgent,
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
				navigator.userAgent.substring(0, 4),
			)
		) {
			s.isMobile = true;
		}
		s.mobileClickDown = true;
		s.mobilePressed = false;
		s.mobileDoublePressed = false;
		s.mobileSelection = false;

		s.startingPointScroll = null;
		s.touche1 = null;
		s.touche2 = null;

		//********************** Variables de travail ******************************
		// Variable pour le système d'id des objets (compteur)
		s.id = 0;
		// Creer la camera
		s.canvasCamera = new CanvasCamera();
		// Liste des objets de la simulation (triés par z_index)
		s.shapes = {};
		// Liste des voitures
		s.cars = [];
		// previousDeltaTime (utile pour faire en sorte que la simulation se déroule toujours à la même vitesse)
		s.pdt = 0;
		// Mouse
		s.mouse = new Vector(s.mouseX, s.mouseY);
		// Pour enable le contrôle d'un véhicule par défaut avec les touches WASD
		s.carController = false;
		// Pour afficher des valeurs sur la simulation
		s.debug = false;
		// Pour le mode editeur
		s.editMode = false;
		// Mettre en pause la simulation
		s.pause = false;

		s.undoShapes = []; // liste des shapes qu'on peut undo
		s.redoShapes = []; // liste des shapes qu'on peut redo
		s.movableShapes = []; // contient toutes shapes qui peuvent etre bougés
		s.listPreviousSelect = []; // liste des shapes qui étaient antérieurement sélectionnés
		s.coinsToRespawn = [];
		s.objectsToRespawn = [];
		s.interactiveObjects = [];
		s.linkedObjectsList = [];
		s.lastCopiedObjects = [];

		s.contextMenu = {};

		s.selectionShape = null;
		s.startingPointSelection = null;
		s.previousSelectionShape = null;
		s.lastSelectedButton = null;
		s.lastPinnabledObject = null;
		s.pressedObject = null;
		s.hoveredObject = null;
		s.lastMovableObject = null; // dernier movable objet clique
		s.popUpMessage = null; // pop-up-message en cours
		s.save = null; // garde le dernier save fait dans la simulation

		/*s.progression = false; // permet d'augmenter la progression dans un cours
        if (typeof progression !== 'undefined')
            s.progression = progression;
        s.creator = false; // donne le droit de modifier le niveau
        if (typeof creator !== 'undefined')
            s.creator = creator;*/

		s.saving = false; // verifier si l'application est en train de sauvegarder
		s.contextMenuState = false;
		s.pasteButtonState = false;
		s.selectionButtonState = false;
		s.linkButtonState = false;
		s.pinButtonState = false;
		s.levelHasChanged = false;
		s.mouseWasPressed = false;
		s.firstTimeRotation = true;

		s.coinsTotal = 0; // compteur des coins
		s.editBoxSize = s.isMobile ? 15 : 10; // taille des editbox selon la plateforme

		//******************************** Autres **********************************
		// Call la fonction init si elle à été initialisée
		// (sert à modifier les propriétés de la simulation pour créer divers jeux/expérimentations)

		// Fonction pour zoomer/dezoomer
		const zoom = () => {
			if (s.fullscreenDiv.css('display') === 'none') {
				previousParent = canvasDiv.parent();
				s.fullscreenDiv.css('display', 'block');
				canvasDiv.css('height', '100%');
				canvasDiv.appendTo(s.fullscreenDiv);

				if (s.isMobile) {
					var elem = document.documentElement;
					if (elem.requestFullscreen) {
						elem.requestFullscreen();
					}
					s.fullscreen = true;
				}

				s.zoomButton.attr('src', '/static/images/fullscreen-off.png');
			} else if (!s.editorButton?.hovering) {
				s.fullscreenDiv.css('display', 'none');
				canvasDiv.css('height', '60vh');
				canvasDiv.appendTo(previousParent);

				if (s.isMobile) {
					if (document.exitFullscreen) {
						document.exitFullscreen();
						s.fullscreen = false;
					}
				}

				s.zoomButton.attr('src', '/static/images/fullscreen-on.png');
				if (s.editMode) {
					s.exitEditMode();
				}
				setTimeout(s.resize, 1000);
			}
		};

		if (s.zoomButton) s.zoomButton.click(zoom);

		s.maxFPS = 30;
		s.frameRate(60);
		s.rectMode(s.CENTER);
		s.imageMode(s.CENTER);
		s.angleMode(s.DEGREES);
		s.pdt = Date.now();

		// set the physic engine sketch canvas for reference
		PhysicEngine.s = s;

		//setInterval(() => {
		//	if (!s.execution && s.creator && s.levelHasChanged) {
		//		s.onChange();
		//		s.levelHasChanged = false;
		//	}
		//}, 5000);
	};

	// #endregion

	// #region Draw
	s.draw = () => {
		if (s.loading) {
			s.loading = false;
			if (s.init) s.init(s);
		}
		if (!s.pause && s.canvasLoaded) {
			//******************************** Debut ***********************************
			// Resize automatique du canvas
			s.canvasAutoResize();

			s.background(240); // Couleur de background
			s.translate(s.width / 2, s.height / 2);
			s.fill(255, 0, 0);
			s.textAlign(s.CENTER, s.CENTER);

			//******************************** Mouse ***********************************
			// Collision avec la souris
			s.lookForMouseCollisions();

			// Les actions de la souris dans le canvas
			if (s.isInsideCanvas()) {
				if (s.keyIsDown(32) || s.keyIsDown(17))
					// Espace = s.keyIsDown(32)  Ctrl = s.keyIsDown(17)
					s.fullscreenDiv.css('cursor', 'grab');

				if (s.editMode) {
					// ClickDown general pour la version Mobile
					if (s.mobilePressed && s.mobileClickDown && !s.mobileDoublePressed) {
						s.clickDownGeneralMobile();
					}
					// ClickDown general pour la version PC
					else if (!s.isMobile && s.mouseIsPressed && !s.mouseWasPressed) {
						s.clickDownGeneralPC();
					}
				}
				// Mouse pressed
				if ((!s.isMobile && s.mouseIsPressed) || s.mobilePressed) {
					s.mousePressedActions();
				}
				// Click pour pressedObject
				else if (
					s.pressedObject != null &&
					s.editMode &&
					!(s.keyIsDown(32) || s.keyIsDown(17))
				) {
					s.clickPressedObjectActions();
				}
				// Click qui se fait tout le temps
				if (!s.mouseIsPressed && s.mouseWasPressed) {
					s.clickGeneral();
				}
			}

			// Calcul de la position "fictive" de la souris dans la simulation
			s.mouse.x = s.mouseX - s.width / 2;
			s.mouse.y = -s.mouseY + s.height / 2;
			s.mouse
				.multiplyScalar(s.canvasCamera.scale / 1000)
				.add(s.canvasCamera.pos);

			//******************************** Shapes **********************************
			s.lookForShapesCollisions();

			for (let car of s.cars) car.update();

			// Grid
			s.drawGrid();

			// Draw de chaque shape
			for (const objects of Object.values(s.shapes))
				for (let obj of objects) obj.draw();

			//******************************** Autre ***********************************
			s.canvasCamera.update();

			// Affichage des infos de la simulation
			s.debugInfos();

			s.mouseWasPressed = s.mouseIsPressed;

			// TODO: save
			//Save
			if (s.levelHasChanged) {
				if (process.env.REACT_APP_DEBUG)
					console.log('level changed, it will be saved automatically soon...');
				s.onChange(s);
				s.levelHasChanged = false;
			}

			// TOUJOURS EN DERNIER DANS DRAW (si pas pause)
			s.pdt = Date.now();
		}
	};

	// #region Draw Methods
	s.canvasAutoResize = () => {
		if (
			!floatEquals(canvasDiv.width(), s.width) ||
			!floatEquals(canvasDiv.height(), s.height)
		) {
			s.resize(canvasDiv.width(), canvasDiv.height());
			if (s.editMode) {
				s.exitEditMode();
				s.enterEditMode();
			}
			// correction pour fullscreen en mobile
			if (s.isMobile)
				if (s.fullscreen && document.fullscreenElement == null)
					s.zoomButton.click();
		}
	};

	s.lookForMouseCollisions = () => {
		for (const shapes of Object.values(s.shapes)) {
			for (const shape of shapes) {
				let collide;

				if (s.isMobile && s.mouseIsPressed && s.mouseWasPressed) {
					s.mobilePressed = true;
					if (s.touches.length === 2) s.mobileDoublePressed = true;
					else s.mobileDoublePressed = false;
				} else s.mobilePressed = false;

				if (shape instanceof FixedObject || shape instanceof FixedTextObject) {
					// Vraie position de la souris sur le canvas
					collide = overlap(shape.vertices, [
						new Vector(s.mouseX - s.width / 2, -s.mouseY + s.height / 2),
					]);
				} else {
					// Position "fictive" de la souris dans la simulation
					collide = overlap(shape.vertices, [s.mouse]);
				}

				const e = {
					x: s.mouse.x,
					y: s.mouse.y,
				};

				if (collide && !s.mobileDoublePressed) {
					// Call des events de mouse
					if (!s.isMobile || s.mobilePressed) {
						shape.hover(e);
						s.hoveredObject = shape;
					}
					if (
						(!s.isMobile && s.mouseIsPressed && !s.mouseWasPressed) ||
						(s.mobilePressed && s.mobileClickDown)
					) {
						s.pressedObject = shape;
						s.pressedObject.mouseOffset = s.mouse
							.clone()
							.substract(s.pressedObject.pos);
						s.pressedObject.clickDown();
					} else if ((!s.isMobile && s.mouseIsPressed) || s.mobilePressed) {
						shape.pressed();
					} else if (!s.mouseIsPressed && s.mouseWasPressed) {
						if (
							s.pressedObject != null &&
							s.pressedObject === shape &&
							!s.editMode
						) {
							s.pressedObject.click();
							s.pressedObject = null;
						}
						s.mobileClickDown = true;
					}
				} else if (shape.hovering) {
					shape.hoverExit(e);
					s.hoveredObject = null;
				}
			}
		}
	};

	s.clickDownGeneralMobile = () => {
		if (s.pressedObject != null) {
			// ClickDown du pressedObject dans Mobile
			s.mobileClickDown = false;
		}

		if (s.selectionShape != null) {
			s.selectionClickDown();
			s.mobileClickDown = false;
		}

		if (!s.topMenu.hovering && !s.sideMenu.hovering) {
			if (s.selectionButtonState) {
				s.selectionClickDown();
				s.mobileSelection = true;
				s.toggleSelectionButton();
				s.mobileClickDown = false;
			}
			if (s.pasteButtonState) {
				s.pasteShape();
				s.togglePasteButton();
				s.pressedObject = s.selectionShape;
				s.pressedObject.mouseOffset = s.mouse
					.clone()
					.substract(s.pressedObject.pos);
				s.mobileClickDown = false;
			} else if (s.linkButtonState) {
				s.addOrRemoveLink();
				s.mobileClickDown = false;
			}
		}

		s.deleteSelectionOnLinkedObjects();
		s.deleteLastMovableObjectChildren();
	};

	s.clickDownGeneralPC = () => {
		s.deleteSelectionOnLinkedObjects();
		s.deleteLastMovableObjectChildren();

		s.selectionClickDown();

		if (s.mouseButton === s.LEFT) {
			if (s.contextMenuState === true && s.contextMenu != null) {
				if (!s.contextMenu.hovering) s.toggleContextMenuOff();
			} else if (!s.topMenu.hovering && !s.sideMenu.hovering) {
				if (s.pasteButtonState) {
					s.pasteShape();
					s.togglePasteButton();
				} else if (s.linkButtonState) {
					s.addOrRemoveLink();
				}
			}
		}

		//if (s.mouseButton === s.RIGHT) s.contextMenuClick();
	};

	s.mousePressedActions = () => {
		// Zoomer / Dezoomer avec deux doigts
		if (s.mobileDoublePressed) s.doubleTouchZoom();
		// Deplacer la camera version PC
		else if (
			s.mouseButton === s.CENTER ||
			s.keyIsDown(32) ||
			s.keyIsDown(17) ||
			!s.editMode
		) {
			// Espace = s.keyIsDown(32)  Ctrl = s.keyIsDown(17)
			s.canvasCamera.move(
				new Vector(
					(s.pmouseX - s.mouseX) * (s.canvasCamera.scale / 1000),
					(s.mouseY - s.pmouseY) * (s.canvasCamera.scale / 1000),
				),
			);
		} else if (s.pressedObject != null && s.pressedObject?.pinned === false) {
			// Rotater ou modifier la taille d'une forme
			if (s.pressedObject.isEditBox) {
				if (s.pressedObject.isRotateBox) {
					let angle = s.pressedObject.rotateFromRotateBox(); //Rotate une seule forme
					if (s.selectionShape === s.pressedObject.parent.parent)
						for (const selection of s.selectionShape.listSelect) //Rotate les formes dans une selection
							selection.rotate(angle, s.selectionShape.pos);
				} else s.pressedObject.modifySize();
			}
			// Deplacer une forme
			else if (s.pressedObject.movable) {
				s.pressedObject.setPos(
					s.mouse.clone().substract(s.pressedObject.mouseOffset).roundVector(5),
					false,
				); //Deplacer une seule forme
				if (s.selectionShape === s.pressedObject)
					for (let selection of s.selectionShape.listSelect) //Deplacer les formes dans une selection
						selection.setPos(
							s.selectionShape.pos
								.clone()
								.substract(selection.shapeOffset)
								.roundVector(1),
							false,
						);
			}
			// Scroll le sideMenu avec le mouse (bon pour la version mobile)
			else if (s.pressedObject === s.sideMenu) {
				let endingPointScroll = s.mouse.roundVector(1).clone();
				let scrollDist = endingPointScroll.y - s.startingPointScroll.y;
				s.sideMenu.scroll({
					delta: scrollDist,
				});
				s.startingPointScroll = endingPointScroll;
			}
		}

		// Deplacer la camera version mobile
		else if (s.isMobile && !s.mobileSelection) {
			s.canvasCamera.move(
				new Vector(
					(s.pmouseX - s.mouseX) * (s.canvasCamera.scale / 1000),
					(s.mouseY - s.pmouseY) * (s.canvasCamera.scale / 1000),
				),
			);
		}

		// Rectangle de selection qui se cree aussi quand le pressedObject est pinned
		else s.createSelection();
	};

	s.clickPressedObjectActions = () => {
		/*
        if (s.pressedObject.movable && s.pressedObject.isHelp && s.selectionShape != null) {
            for (let i = 0; i < s.selectionShape.listSelect.length; i++) {
                s.selectionShape.listSelect[i]

                for (let j = s.undoShapes.length - 1; j >= 0; j--) {
                    if (!s.undoShapes[j].isMultipleObjects) {
                        if (s.selectionShape.listSelect[i].id == s.undoShapes[j].originalShape.id) {
                            let selectionAPush = s.storeShapeData(s.selectionShape.listSelect[i])
                            s.undoShapes.splice(j + 1, 0, selectionAPush);
                            //s.undoShapes.push(selectionAPush)
                            break
                        }
                    }
                }
            }
        }
        */

		s.addSelectionOnLinkedObjects();

		// Si objet est movable
		if (s.pressedObject.movable && !s.pressedObject.isHelp) {
			s.lastPinnabledObject = s.pressedObject;
			s.lastMovableObject = s.pressedObject;
			s.listPreviousSelect = [];

			if (!s.pressedObject.pinned) {
				for (const car of s.cars)
					if (car.shape === s.pressedObject && !s.execution)
						car.setInitialPlacement();

				let shapeAlreadyExists = s.movableShapes.find(shape => {
					return shape.originalShape.id === s.pressedObject.id;
				});

				if (s.trashCan.hovering || s.sideMenu.hovering) {
					s.addSingleUndoWithData(s.pressedObject, false, false, true);

					if (shapeAlreadyExists === undefined)
						s.movableShapes.push(
							s.storeShapeData(s.pressedObject, false, false, true),
						);
					else
						s.movableShapes.splice(
							s.movableShapes.indexOf(shapeAlreadyExists),
							1,
							s.storeShapeData(s.pressedObject, false, false, true),
						);

					s.lastMovableObject = null;
				} else {
					s.addSingleUndoWithData(s.pressedObject);

					if (shapeAlreadyExists === undefined)
						s.movableShapes.push(s.storeShapeData(s.pressedObject));
					else
						s.movableShapes.splice(
							s.movableShapes.indexOf(shapeAlreadyExists),
							1,
							s.storeShapeData(s.pressedObject),
						);
				}
			}
		}
		// Si objet est un EditBox (les petits carrés sur les bordures d'un "shape")
		else if (s.pressedObject.isEditBox && !s.pressedObject.isRotateBox)
			s.addSingleUndoWithData(s.pressedObject.parent.parent);
		else if (s.pressedObject.isRotateBox) {
			for (let car of s.cars)
				if (car.shape === s.pressedObject.parent.parent && !s.execution)
					car.setInitialPlacement();
		}

		if (
			!(
				s.pressedObject instanceof FixedObject ||
				s.pressedObject instanceof FixedTextObject
			)
		)
			s.redoShapes.splice(0, s.redoShapes.length);

		// Change l'icone de la souris par rapport au dernier objet movable sélectionné / bougé
		s.changeCursorOnMovement();

		if (s.mouseButton === s.RIGHT) s.pressedObject.rightClick();
		else s.pressedObject.click();
		s.pressedObject = null;
		s.mobileClickDown = true;
		s.levelHasChanged = true;
	};

	s.clickGeneral = () => {
		if (s.editMode) s.adjustSelection();
		s.touche1 = null;
		s.touche2 = null;
	};

	s.addSelectionOnLinkedObjects = () => {
		if (s.pressedObject.isButton) {
			s.pressedObject.linkedId.forEach(shapeId => {
				let shape = s.getShapeById(shapeId);
				if (shape != null)
					s.linkedObjectsList.push(s.spawnCustomSelection(shape, 'blue', 25));
			});
		}
	};

	s.deleteSelectionOnLinkedObjects = () => {
		s.linkedObjectsList.forEach(shape => {
			s.deleteShape(shape);
		});

		s.linkedObjectsList = [];
	};

	s.deleteLastMovableObjectChildren = () => {
		// Delete les enfants d'un object movable
		if (s.lastMovableObject != null) {
			if (s.hoveredObject == null) s.lastMovableObject.removeAllChildren();
			else if (!s.hoveredObject.isHelp) s.lastMovableObject.removeAllChildren();
		}
	};

	s.doubleTouchZoom = () => {
		// Zoom avec 2 doigts
		let newTouche1 = new Vector(s.touches[0].x, s.touches[0].y);
		let newTouche2 = new Vector(s.touches[1].x, s.touches[1].y);
		if (s.touche1 == null && s.touche2 == null) {
			s.touche1 = newTouche1.clone();
			s.touche2 = newTouche2.clone();
		}
		let dist1 = newTouche1.clone().dist(newTouche2);
		let dist2 = s.touche1.clone().dist(s.touche2);
		s.canvasCamera.addScale(
			Math.round(dist2 - dist1) * 10 * (s.canvasCamera.scale / 1000),
		);
		s.touche1 = newTouche1.clone();
		s.touche2 = newTouche2.clone();
	};

	s.lookForShapesCollisions = () => {
		// Check des collisions entre les objets sur la scène et les voitures
		for (const shapes of Object.values(s.shapes)) {
			for (let shape of shapes) {
				if (shape instanceof FixedObject) continue;
				if (shape instanceof FixedTextObject) continue;
				// Collisions avac la voiture
				for (let car of s.cars) {
					if (shape.isHelp) continue;
					if (car.shape === shape) continue;

					let collide = overlap(shape.vertices, car.shape.vertices);
					if (collide) {
						// Call les events de collision (onCollision et onCollisionEnter)
						shape.collision({
							collider: shape,
							collidingWith: car,
						});
						car.shape.collision({
							collider: car,
							collidingWith: shape,
						});
					} else {
						// Call les events de collision exit (onCollisionExit)
						if (shape.colliding.includes(car)) {
							shape.collisionExit({
								collider: shape,
								collidingWith: car,
							});
						}
						if (car.shape.colliding.includes(shape)) {
							car.shape.collisionExit({
								collider: car,
								collidingWith: shape,
							});
						}
					}
				}

				// Collisions avec d'autre shapes
				for (const shapesCompare of Object.values(s.shapes)) {
					for (let shapeCompare of shapesCompare) {
						if (shapeCompare instanceof FixedObject) continue;
						if (shapeCompare instanceof FixedTextObject) continue;
						if (shapeCompare === shape) continue;
						if (shapeCompare.isHelp) continue;
						let isCar = false;
						for (const car of s.cars)
							if (car.shape === shapeCompare) isCar = true;
						if (isCar) continue;
						let collide = overlap(shape.vertices, shapeCompare.vertices);
						if (collide) {
							// Call les events de collision (onCollision et onCollisionEnter)
							shape.collision({
								collider: shape,
								collidingWith: shapeCompare,
							});
						} else {
							// Call les events de collision exit (onCollisionExit)
							if (shape.colliding.includes(shapeCompare)) {
								shape.collisionExit({
									collider: shape,
									collidingWith: shapeCompare,
								});
							}
						}
					}
				}
			}
		}
	};

	s.drawGrid = () => {
		// Il faudrait faire une classe pour creer de lignes
		s.stroke(200);
		s.strokeWeight(0.5);
		let step = 50;
		let w =
			Math.round(((s.width * (s.canvasCamera.scale / 1000)) / step) * 2) *
			step *
			2;
		let h =
			Math.round(((s.height * (s.canvasCamera.scale / 1000)) / step) * 2) *
			step *
			2;
		let vlines = w / step;
		let hlines = h / step;

		for (let i = 0; i < vlines; i++) {
			if (
				(i * step -
					w / 2 +
					Math.ceil(
						s.canvasCamera.pos.x <= 0
							? s.canvasCamera.pos.x / step
							: s.canvasCamera.pos.x / step - 1,
					) *
						step) %
					(step * 5) ===
				0
			)
				s.stroke(100);
			s.line(
				(i * step - w / 2 - (s.canvasCamera.pos.x % step)) *
					(1000 / s.canvasCamera.scale),
				((s.canvasCamera.pos.y % step) - h / 2) * (1000 / s.canvasCamera.scale),
				(i * step - w / 2 - (s.canvasCamera.pos.x % step)) *
					(1000 / s.canvasCamera.scale),
				((s.canvasCamera.pos.y % step) + h / 2) * (1000 / s.canvasCamera.scale),
			);
			s.stroke(200);
		}
		for (let i = 0; i < hlines; i++) {
			if (
				(i * step -
					h / 2 +
					Math.ceil(
						s.canvasCamera.pos.y <= 0
							? s.canvasCamera.pos.y / step
							: s.canvasCamera.pos.y / step - 1,
					) *
						step) %
					(step * 5) ===
				0
			)
				s.stroke(100);
			s.line(
				(-w / 2 - (s.canvasCamera.pos.x % step)) *
					(1000 / s.canvasCamera.scale),
				((s.canvasCamera.pos.y % step) - i * step + h / 2) *
					(1000 / s.canvasCamera.scale),
				(w / 2 - (s.canvasCamera.pos.x % step)) * (1000 / s.canvasCamera.scale),
				((s.canvasCamera.pos.y % step) - i * step + h / 2) *
					(1000 / s.canvasCamera.scale),
			);
			s.stroke(200);
		}
	};

	s.debugInfos = () => {
		s.fill('black');
		s.noStroke();
		s.textSize(35);
		s.textAlign(s.LEFT);
		if (s.debug) {
			s.text('x : ' + s.canvasCamera.pos.x.toFixed(2), -490, -475);
			s.text('y : ' + s.canvasCamera.pos.y.toFixed(2), -490, -440);
			s.text('scaling : ' + s.canvasCamera.scale.toFixed(0), -490, -405);
			s.text('car : ' + s.selectedCar, -490, -370);
		}
		let fps = (1000 / s.maxFPS / (Date.now() - s.pdt)) * s.maxFPS;
		let size = s.isMobile ? 18 : 25;
		s.textSize(size);
		s.text('FPS: ' + Math.round(fps), s.width / 10, s.height / 2 - size);
	};

	// TODO: Move save conditions
	s.saveConditions = () => {
		if (s.levelHasChanged) {
			s.onChange();
		}
	};
	// #endregion

	// #endregion

	// #region Help Methods
	s.isInsideCanvas = () => {
		return (
			s.mouseX >= 0 &&
			s.mouseX <= s.width &&
			s.mouseY >= 0 &&
			s.mouseY <= s.height
		);
	};

	s.convertToRealPos = vec => {
		return new Vector(s.convertToRealPosX(vec.x), s.convertToRealPosY(vec.y));
	};

	s.convertToFictPos = vec => {
		return new Vector(s.convertToFictPosX(vec.x), s.convertToFictPosY(vec.y));
	};

	s.convertToRealPosX = x => {
		return (x - s.canvasCamera.pos.x) * (1000 / s.canvasCamera.scale);
	};

	s.convertToRealPosY = y => {
		return (s.canvasCamera.pos.y - y) * (1000 / s.canvasCamera.scale);
	};

	s.convertToFictPosX = x => {
		return x * (s.canvasCamera.scale / 1000) + s.canvasCamera.pos.x;
	};

	s.convertToFictPosY = y => {
		return y * (s.canvasCamera.scale / 1000) - s.canvasCamera.pos.y;
	};

	s.convertPixelsToMeters = nb_pixels => {
		const RATIO = 1 / 50; // 1 meter / 50 pixel
		return nb_pixels * RATIO;
	};

	s.convertMetersToPixels = meters => {
		const RATIO = 50 / 1; // 50 pixels / 1 meter
		return meters * RATIO;
	};

	s.showDebug = bool => {
		s.debug = bool;
	};

	// #endregion

	// #region P5 methods
	s.mouseWheel = e => {
		// Idee de future sroll
		/*if(s.hoveredObject != null) {
            if(s.hoveredObject.hasEventListener(s.hoveredObject.scrollFct)) {
                s.hoveredObject.scroll({
                    delta: e.delta
                })
            } else if(s.hoveredObject.hasParent() && s.hoveredObject.parent.hasEventListener(s.hoveredObject.parent.scrollFct)) {
                s.hoveredObject.parent.scroll({
                    delta: e.delta
                })
            }
        }*/
		if (s.sideMenu != null) {
			if (s.sideMenu.hovering) {
				s.sideMenu.scroll({
					delta: e.delta,
				});
			} else if (s.isInsideCanvas() && s.canvasCamera?.wheelScaling) {
				s.canvasCamera.addScale(e.delta * (s.canvasCamera.scale / 1000));
				// Prevent default
				return false;
			}
		}
		// À CHANGER (set clipping à chaque genre 50?)
		else if (s.isInsideCanvas() && s.canvasCamera?.wheelScaling) {
			s.canvasCamera.addScale(e.delta * (s.canvasCamera.scale / 1000));
			// Prevent default
			return false;
		}
	};

	s.keyPressed = () => {
		// Controller du véhicule

		if (
			s.carController &&
			s.selectedCar != null &&
			s.selectedCar < s.cars.length
		) {
			// R
			if (s.keyCode === 82 && s.cars.length > 1) {
				s.cars[s.selectedCar].stop();
				s.selectedCar = (s.selectedCar + 1) % s.cars.length;
			}
			// W
			else if (s.keyCode === 83) {
				s.cars[s.selectedCar].dir.y = 1;
			}
			// S
			else if (s.keyCode === 88) {
				s.cars[s.selectedCar].dir.y = -1;
			}
			// A
			else if (s.keyCode === 90) {
				s.cars[s.selectedCar].dir.x = -1;
			}
			// D
			else if (s.keyCode === 67) {
				s.cars[s.selectedCar].dir.x = 1;
			}
		}

		if (s.editMode) {
			// Ctrl + Z undo
			if (s.keyIsDown(17) && s.keyCode === 90 && s.undoShapes.length > 0) {
				s.undoButton.click();
				s.deleteSelection();
			}

			// Ctrl + Y redo
			if (s.keyIsDown(17) && s.keyCode === 89 && s.redoShapes.length > 0) {
				s.redoButton.click();
			}

			// Ctrl + C pour copier un objet
			if (s.keyIsDown(17) && s.keyCode === 67) {
				s.copyButton.click();
				if (s.lastMovableObject != null) {
					s.lastMovableObject.removeAllChildren();
				}
			}

			// Ctrl + V pour coller un objet
			if (s.keyIsDown(17) && s.keyCode === 86) {
				s.pasteShape();
			}

			// change de z index (+ -> + 1), (- -> -1)
			// 187 == "+" et 189 == "-"
			if (s.keyCode === 189 && s.pressedObject?.zIndex > 0) {
				s.pressedObject.setZIndex(Number(s.pressedObject.zIndex) - 1);
			} else if (s.keyCode === 187 && s.pressedObject?.zIndex < 400) {
				s.pressedObject.setZIndex(Number(s.pressedObject.zIndex) + 1);
			}
			return false; // prevent any default behavior
		}
	};

	s.keyReleased = () => {
		// Controller du véhicule

		if (s.carController) {
			// W
			if (s.keyCode === 83 && s.cars[s.selectedCar].dir.y > 0) {
				s.cars[s.selectedCar].dir.y = 0;
			}
			// S
			else if (s.keyCode === 88 && s.cars[s.selectedCar].dir.y < 0) {
				s.cars[s.selectedCar].dir.y = 0;
			}
			// A
			else if (s.keyCode === 90 && s.cars[s.selectedCar].dir.x < 0) {
				s.cars[s.selectedCar].dir.x = 0;
			}
			// D
			else if (s.keyCode === 67 && s.cars[s.selectedCar].dir.x > 0) {
				s.cars[s.selectedCar].dir.x = 0;
			}
		}

		// Espace
		if (s.keyCode === 32 || s.keyCode === 17) {
			s.fullscreenDiv.css('cursor', 'default');
		}
	};

	// #endregion

	// #region Spawn Shapes and Delete Shapes

	// Méthode qui sert à garder dans une seule variable la forme originale, le clone de la forme, et d'autres caractéristiques
	s.storeShapeData = (
		shape,
		wasDeletedViaUndo = false,
		wasRedo = false,
		wasDeletedViaTrash = false,
	) => {
		let shapeData = {
			originalShape: shape,
			clonedShape: shape.cloneShape(),
			wasDeletedViaUndo: wasDeletedViaUndo,
			wasRedo: wasRedo,
			wasDeletedViaTrash: wasDeletedViaTrash,
		};
		return shapeData;
	};

	s.addObjectToScene = (obj, z_index = undefined) => {
		if (z_index === undefined) z_index = Object.keys(s.shapes).length;
		if (!(z_index in s.shapes)) s.shapes[z_index] = [];
		s.shapes[z_index].push(obj);
		obj.zIndex = z_index;

		let sortedKeys = [];
		for (const key in s.shapes) {
			sortedKeys.push(key);
		}
		sortedKeys.sort();

		let tempDict = {};
		for (const sortedKey of sortedKeys) {
			tempDict[sortedKey] = s.shapes[sortedKey];
		}
		s.shapes = tempDict;
	};

	s.deleteShape = (
		shape,
		recursively = true,
		copiedFromContextMenu = false,
	) => {
		// À CHANGER
		for (const [key, arr] of Object.entries(s.shapes)) {
			s.shapes[key] = arr.filter(el => el !== shape);
		}
		if (recursively && shape.children != null) {
			for (let child of shape.children) s.deleteShape(child);
		}
		if (copiedFromContextMenu) {
			s.addSingleUndoWithData(s.lastMovableObject, false, false, true);
			s.movableShapes.push(
				s.storeShapeData(s.lastMovableObject, false, false, true),
			);
		}
	};

	s.spawnRect = (x, y, w, h, z_index = 0) => {
		let shape = s.spawnShape(
			z_index,
			[-w / 2, h / 2],
			[w / 2, h / 2],
			[w / 2, -h / 2],
			[-w / 2, -h / 2],
		);
		shape.setPos(new Vector(x, y), false);
		return shape;
	};

	s.spawnShape = (z_index, ...points) => {
		let shape = new Shape(s, ...points);
		s.addObjectToScene(shape, z_index);
		return shape;
	};

	s.spawnDecoration = (x, y, w, h, z_index = undefined) => {
		let decoration = new Decoration(
			s,
			'base',
			[-w / 2, h / 2],
			[w / 2, h / 2],
			[w / 2, -h / 2],
			[-w / 2, -h / 2],
		);
		s.addObjectToScene(decoration, z_index);
		return decoration;
	};

	/**
	 *
	 * @param {number} w
	 * @param {number} h
	 * @param {import('./ts/Terrain').TemplateNamesTerrain} templateName
	 * @param {number} z_index
	 * @returns
	 */
	s.spawnTerrain = (w, h, templateName, z_index = undefined) => {
		let terrain = new Terrain(
			s,
			templateName,
			[-w / 2, h / 2],
			[w / 2, h / 2],
			[w / 2, -h / 2],
			[-w / 2, -h / 2],
		);
		s.addObjectToScene(terrain, z_index);
		return terrain;
	};

	s.spawnRoad = (w, h, minimumSize, z_index = undefined) => {
		let road = new Road(
			s,
			minimumSize,
			[-w / 2, h / 2],
			[w / 2, h / 2],
			[w / 2, -h / 2],
			[-w / 2, -h / 2],
		);
		s.addObjectToScene(road, z_index);
		return road;
	};

	s.spawnObstacle = (w, h, isGameOver, z_index = undefined) => {
		let obstacle = new Obstacle(
			s,
			isGameOver,
			[-w / 2, h / 2],
			[w / 2, h / 2],
			[w / 2, -h / 2],
			[-w / 2, -h / 2],
		);
		s.addObjectToScene(obstacle, z_index);
		return obstacle;
	};

	s.spawnInteractiveObject = (
		w,
		h,
		isCoin,
		isObjectif,
		isButton,
		z_index = undefined,
	) => {
		let interaction = new InteractiveObject(
			s,
			isCoin
				? 'collectable'
				: isObjectif
				? 'objective'
				: isButton
				? 'button'
				: 'spring',
			[-w / 2, h / 2],
			[w / 2, h / 2],
			[w / 2, -h / 2],
			[-w / 2, -h / 2],
		);
		s.addObjectToScene(interaction, z_index);
		s.addInteractiveObject(interaction);

		return interaction;
	};

	s.spawnFixedObject = (z_index, ...points) => {
		let shape = new FixedObject(s, ...points);
		s.addObjectToScene(shape, z_index);
		return shape;
	};

	s.spawnFigure = (z_index, templateName, ...points) => {
		let shape = new Figure(s, templateName, ...points);
		s.addObjectToScene(shape);
		return shape;
	};

	s.spawnFixedRect = (x, y, w, h, z_index = 500) => {
		return s.spawnFixedObject(
			z_index,
			[x - w / 2, y + h / 2],
			[x + w / 2, y + h / 2],
			[x + w / 2, y - h / 2],
			[x - w / 2, y - h / 2],
		);
	};

	s.spawnTextObject = (text, size, x, y, z_index = undefined) => {
		let shape = new TextObject(
			s,
			'base',
			[x - size / 2, y + size / 2],
			[x + size / 2, y + size / 2],
			[x + size / 2, y - size / 2],
			[x - size / 2, y - size / 2],
		);
		shape.text = text;
		s.addObjectToScene(shape, z_index);
		return shape;
	};

	s.spawnFixedTextObject = (text, size, x, y, z_index = undefined) => {
		let shape = new FixedTextObject(s, text, size, x, y, 'white');
		s.addObjectToScene(shape, z_index);
		return shape;
	};

	// #endregion

	// #region Car Methods
	s.spawnCar = (x, y, w, h, z_index = 100) => {
		let shape = s.spawnRect(x, y, w, h, z_index);

		let car = new Car(s, shape);
		//car.shapeId = shape.id;
		car.shape.setImg(images.carTop);
		s.cars.push(car);
		s.selectedCar = s.cars.length - 1;
		s.car = car;
		return car;
	};

	s.deleteCar = car => {
		s.cars = s.cars.filter(el => el !== car);
		s.deleteShape(car.shape);
	};

	s.enableCarController = () => {
		s.carController = true;
	};

	s.disableCarController = () => {
		s.carController = false;
	};

	//#endregion

	// #region Others Methods
	s.stringify = (lines = []) => {
		let json = {
			initial_code: lines,
			cars: s.cars,
			shapes: s.shapes,
			cam: s.canvasCamera,
		};
		// A possiblement changer pour l'inverse lol
		let ignores = [
			's',
			'img',
			'length',
			'colliding',
			'hovering',
			'camera',
			'forward',
			'dir',
			'shape',
			'children',
			'parent',
			'strokeColor',
			'alwaysStroke',
			'scaleWithCamera',
			'carInteraction',
			'isEditBox',
			'bounds',
			'middle',
			'left',
			'top',
			'right',
			'bottom',
			'oldLeft',
			'oldTop',
			'oldRight',
			'oldBottom',
			'oldMiddle',
			'oldWidth',
			'oldHeight',
			'mouseOffset',
			'isRotateBox',
			'cursor',
			'leftEdgeClickDown',
			'upEdgeClickDown',
			'rightEdgeClickDown',
			'bottomEdgeClickDown',
		];

		let stringified = JSON.stringify(json, (key, value) => {
			if (ignores.includes(key)) return undefined;
			else if (typeof value === 'number') return parseFloat(value.toFixed(2));
			else if (value instanceof FixedObject) return undefined;
			else if (value instanceof FixedTextObject) return undefined;
			else return value;
		});

		return stringified;
		/*console.log(JSON.stringify(s.shapes, (key, value) => {
            if (key == "s") return undefined;
            else if (key == "img") return undefined;
            else return value;
        }))*/
	};

	s.automaticSave = () => {
		s.saving = true;
		setTimeout(() => {
			s.saveLevel();
			s.saving = false;
		}, 5000);
	};

	s.saveLevel = () => {
		return Serializer.serialize(Object.values(s.shapes).flat(1));
	};
	/*
	s.load = data => {
		s.clear();
		let json = JSON.parse(data, (key, value) => {
			if (
				value != null &&
				typeof value === 'object' &&
				Object.keys(value).length === 2 &&
				'x' in value &&
				'y' in value
			) {
				// eslint-disable-next-line new-parens
				let vec = Object.assign(new Vector(), value);
				vec.calculateLength();
				return vec;
			}
			return value;
		});
		// eslint-disable-next-line new-parens
		s.canvasCamera = Object.assign(new CanvasCamera(), json['cam']);

		for (const [z_index, shapes] of Object.entries(json['shapes'])) {
			let i = 0;
			for (i; i < shapes.length; i++) {
				if (shapes[i]?.movable && !shapes[i]?.isHelp) {
					// Verification de voiture
					let thisCar = null;
					for (const car of json['cars'])
						if (car.shapeId === shapes[i].id) thisCar = car;

					// Replacer vecteurs aux bons endroits
					let points = [];
					for (const vector of shapes[i].vertices) {
						let point = vector.clone();
						let angle = (shapes[i].rotation.x * s.PI) / 180;
						point.rotate(angle, shapes[i].pos);
						points.push([point.x, point.y]);
					}

					// Creer un clone du shape
					let cloned;

					if (shapes[i].class === 'Obstacle') {
						cloned = new Obstacle(s, shapes[i].isGameOver, ...points);
						if (shapes[i].isGameOver)
							cloned.setGameOverEvent(shapes[i].gameOverEvent);
					} else if (shapes[i].class === 'Road')
						cloned = new Road(s, shapes[i].minimumSize, ...points);
					else if (shapes[i].class === 'Terrain')
						cloned = new Terrain(s, shapes[i].frictionCoef, ...points);
					else if (shapes[i].class === 'InteractiveObject') {
						cloned = new InteractiveObject(
							s,
							shapes[i].isCoin,
							shapes[i].isObjectif,
							shapes[i].isButton,
							...points,
						);
						s.addInteractiveObject(cloned);
						for (let j = 0; j < shapes[i].linkedId.length; j++)
							cloned.linkedId.push(shapes[i].linkedId[j]);
					} else if (shapes[i].class === 'TextObject')
						cloned = new TextObject(
							s,
							shapes[i].text,
							shapes[i].size,
							0,
							0,
							shapes[i].color,
						);
					else cloned = new Shape(s, ...points);

					cloned.id = shapes[i].id;
					cloned.zIndex = shapes[i].zIndex;
					cloned.pinned = shapes[i].pinned;
					cloned.rotate(shapes[i].rotation.x);
					cloned.color = s.color(0, 0);

					if (shapes[i].hasTexture)
						cloned.setTexture(s.dictImages[shapes[i].imgName], shapes[i].res);
					else if (shapes[i].imgName)
						cloned.setImg(s.dictImages[shapes[i].imgName]);
					else cloned.color = shapes[i].color; // A CHANGER CAR CAUSE DES ERREURS (fonctionne juste avec les colors en string ex: "red", "blue", "cyan"; le reste fait erreur)

					if (shapes[i].soundOnCollision)
						cloned.setSoundOnCollision(
							s.dictAudios[shapes[i].soundOnCollisionName],
						);

					s.spawnShapeFromMenu(cloned, cloned, true);
					cloned.setPos(new Vector(shapes[i].pos.x, shapes[i].pos.y), false);

					// Ajouter dans la liste des shapes
					json['shapes'][z_index][i] = cloned;

					// Si c'est une voiture ajouter la voiture
					if (thisCar != null) {
						thisCar.shape = cloned;
						let initializedCar = Object.assign(
							new Car(s, thisCar.shape),
							thisCar,
						);
						s.cars.push(initializedCar);
					} else s.movableShapes.push(s.storeShapeData(cloned));

					// Remettre le id ou il etait rendu
					if (cloned.id > s.id) s.id = cloned.id + 1;
				} else {
					// Si c'est une forme qu'on ne veut pas garder, on l'enleve
					json['shapes'][z_index].splice(i, 1);
					i--;
				}
			}
		}

		// Voiture qui conduira
		s.selectedCar = 0;
		s.car = s.cars[s.selectedCar];
		s.shapes = json['shapes'];
		s.canvasCamera.setPos(s.car.shape.pos.clone(), false);

		// TODO: change this thing
		/*if (!s.progression)
            editor.setValue(json["initial_code"].join("\n"));

		return json;
	};
	*/

	s.clear = () => {
		s.shapes = {};
		s.cars = [];
		s.canvasCamera = null;
		s.editMode = false;
		s.coinsTotal = 0;
		s.coinsToRespawn = [];
		s.interactiveObjects = [];
		s.movableShapes = [];
		s.undoShapes = [];
		s.redoShapes = [];
	};

	s.getShapeById = id => {
		for (let shapes of Object.values(s.shapes)) {
			for (let shape of shapes) {
				if (shape.id === id) return shape;
			}
		}
		return null;
	};

	s.resize = (w = null, h = null) => {
		if (w != null && h != null && (w !== s.width || h !== s.height)) {
			s.resizeCanvas(w, h);
			/*for (const [z_index, shapes] of Object.entries(s.shapes)) {
                    for (let shape of shapes) {
                        if (shape instanceof FixedObject) shape.resize(oldWidth, oldHeight)
                    }
                }*/
			if (s.editMode)
				s.editorButton?.setPos(
					new Vector(s.width / 2 - 35, -s.height / 2 + 95),
					false,
				);
			if (s.robotConnectButton != null)
				s.robotConnectButton.setPos(
					new Vector(s.width / 2 - 35, -s.height / 2 + 35),
					false,
				);
		}
		if (canvasDiv.height() * (s.width / s.height) < canvasDiv.width()) {
			jCanvas.css('height', '100%');
			jCanvas.css('width', jCanvas.height() * (s.width / s.height) + 'px');
		} else {
			jCanvas.css('width', '100%');
			jCanvas.css('height', jCanvas.width() * (s.height / s.width) + 'px');
		}
	};

	s.winTrigger = () => {
		/*
        if (s.progression) {
            $.ajax({
                type: "POST",
                url: JSON.parse($('#destination-url').text()) + "/success",
                data: {
                    'csrfmiddlewaretoken': csrftoken,
                },
                success: (data) => {
                    $('#activity-title').html(data.html);
                    $(`#activityDiv${data.activityUnlock}`).find("#activity-progression-state-locked").remove();
                }
            });
        }
        */
	};

	//#endregion
};