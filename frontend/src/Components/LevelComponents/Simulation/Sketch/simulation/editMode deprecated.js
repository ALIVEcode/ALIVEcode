import { FixedTextObject } from "./FixedTextObject";
import { Obstacle } from './ts/Obstacle';
import { InteractiveObject } from './ts/Interactive';
import { Vector } from './Vector';
import { images, sounds } from './assets';

export function editModeSection(s) {
	// #region EnterEditMode
	s.enterEditMode = () => {
		s.editMode = true;

		//********************************* Menus **********************************
		// Top menu
		s.topMenu = s.spawnFixedRect(
			0,
			s.height / 2 - (s.isMobile ? 18.75 : 25),
			s.width,
			s.isMobile ? 37.5 : 50,
			600,
		);
		s.topMenu.color = '#70caff';
		s.topMenu.strokeColor = s.color(0, 0);
		s.topMenu.onHover(() => {
			s.fullscreenDiv.css('cursor', 'default');
		});

		// Side menu
		s.sideMenu = s.spawnFixedRect(
			-s.width / 2 + (s.isMobile ? 75 : 100),
			-s.topMenu.getHeight() / 2,
			s.isMobile ? 150 : 200,
			s.height - s.topMenu.getHeight(),
		);
		s.sideMenu.color = '#03a2ff';
		s.sideMenu.strokeColor = s.color(0, 0);
		s.sideMenu.onClickDown(() => {
			s.startingPointScroll = s.mouse.roundVector(1).clone();
		});

		s.sideMenu.onScroll(e => {
			// Limite pour scroll dans la barre de menu
			const limiteScroll = 25;

			if (
				(s.sideMenu.children[0].top.y + limiteScroll > s.sideMenu.top.y &&
					e.delta < 0) ||
				(s.sideMenu.children[s.sideMenu.children.length - 1].bottom.y -
					limiteScroll <
					-s.height / 2 &&
					e.delta > 0)
			) {
				for (let i = 0; i < s.sideMenu.children.length; i++) {
					const posNew = new Vector(
						s.sideMenu.children[i].pos.x,
						s.sideMenu.children[i].pos.y + e.delta / 2,
					);
					s.sideMenu.children[i].setPos(posNew, false);
				}
			}
		});

		//********************************* Items **********************************
		s.spawnSideMenuItems();

		s.spawnTopMenuItems();

		s.spawnInteractiveButtons();

		//********************************* Autre *********************************
		s.changeCursorOnMovement();

		s.showDebug();
	};

	s.exitEditMode = () => {
		s.editMode = false;
		s.deleteShape(s.sideMenu, true);
		s.deleteShape(s.topMenu, true);
		s.deleteShape(s.trashCan, true);
		s.deleteShape(s.zoom_In_Button);
		s.deleteShape(s.zoom_Out_Button);
	};

	s.toggleEditMode = () => {
		s.zoomButton.click();
		if (s.editMode === undefined || !s.editMode) s.enterEditMode();
		else s.exitEditMode();
	};

	//#endregion

	// #region Menu Items

	const size = s.sideMenu.getWidth() / 4;
	const space = s.sideMenu.getWidth() / 20;

	function addMenuSection(title, spawnItems) {
		const text = s.spawnFixedTextObject(title, size / 2, 0, 0);
		s.sideMenu.addChild(text, true);
		spawnItems();
		s.sideMenu.children[s.sideMenu.children.length - 1].lastInSection = true;
	}

	s.spawnSideMenuItems = () => {
		// taille de formes dans le menu
		let size = s.sideMenu.getWidth() / 4;
		// espace entre les formes du menu
		let space = s.sideMenu.getWidth() / 20;

		addMenuSection('Roads', s.menuRoadItems);
		addMenuSection('Terrains', s.menuTerraiItems);
		addMenuSection('Obstacles', s.menuObstacleItems);
		addMenuSection('Interactives', s.menuInteractiveObjectItems);
		addMenuSection('Decorations', s.menuDecorationItems);
		addMenuSection('Other', s.menuOtherShapeItems);

		//******************************** Organisation ****************************
		let top = s.sideMenu.top.y - size * 1.5;
		let count = 0;
		const ratio = 150 / size;
		s.sideMenu.children.forEach(child => {
			if (!(child instanceof FixedTextObject)) {
				let image = s.spawnFixedRect(
					child.left.x + child.getWidth() / ratio / 2,
					child.top.y - child.getHeight() / ratio / 2,
					child.getWidth() / ratio,
					child.getHeight() / ratio,
				);
				child.resizeShape(image);
				s.deleteShape(image);

				child.setPos(
					new Vector(
						s.sideMenu.pos.x + (count % 3) * (size + space) - (size + space),
						top - size / 2,
					),
					false,
				);
				count += 1;
				if (count % 3 === 0 && !child.lastInSection) {
					top -= size + space;
					count = 0;
				}
				if (child.lastInSection) {
					top -= 2 * size + space;
					count = 0;
				}

				child.onHover(() => {
					if (s.pressedObject == null && !s.topMenu.hovering)
						s.fullscreenDiv.css('cursor', 'grab');
				});
				child.onHoverExit(() => {
					s.fullscreenDiv.css('cursor', 'default');
				});
			} else {
				// position des textes
				child.setPos(
					new Vector(
						s.sideMenu.pos.x -
							s.sideMenu.getWidth() / 2 +
							space * 1.5 +
							child.getWidth() / 2,
						top + size / 2 - space,
					),
					false,
				);
			}
		});
	};

	s.menuRoadItems = () => {
		// Route 1
		const route1 = s.spawnFixedRect(0, 0, 150, 150); //Premier item dans menu
		route1.color = s.color(0, 0);
		route1.setTexture(images.road1, 0.5);
		route1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(route1, s.spawnRoad(150, 150, 150, 1));
		});
		s.sideMenu.addChild(route1, true);

		// Bridge 1
		const bridge1 = s.spawnFixedRect(0, 0, 150, 60);
		bridge1.color = s.color(0, 0);
		bridge1.setImg(images.bridge);
		bridge1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(bridge1, s.spawnTerrain(375, 150, 1, 4));
		});
		s.sideMenu.addChild(bridge1, true);

		// Tire Tracks 1
		const tire_tracks1 = s.spawnFixedRect(0, 0, 150, 150);
		tire_tracks1.color = s.color(0, 0);
		tire_tracks1.setTexture(images.tire_tracks, 0.72);
		tire_tracks1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(tire_tracks1, s.spawnRoad(75, 75, 75, 1));
		});
		s.sideMenu.addChild(tire_tracks1, true);
	};

	s.menuTerrainItems = () => {
		// Gazon 1
		const gazon1 = s.spawnFixedRect(0, 0, 150, 150);
		gazon1.color = s.color(0, 0);
		gazon1.setTexture(images.grass, (2 / 3) * 0.5);
		gazon1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(gazon1, s.spawnTerrain(150, 150, 1, 0));
		});
		s.sideMenu.addChild(gazon1, true);

		// Mud 1
		const mud1 = s.spawnFixedRect(0, 0, 150, 150);
		mud1.color = s.color(0, 0);
		mud1.setTexture(images.mud, (2 / 3) * 0.5);
		mud1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(mud1, s.spawnTerrain(150, 150, 1.08, 2));
		});
		s.sideMenu.addChild(mud1, true);

		// Sand 1
		const sand1 = s.spawnFixedRect(0, 0, 150, 150);
		sand1.color = s.color(0, 0);
		sand1.setTexture(images.sand, 0.5);
		sand1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(sand1, s.spawnTerrain(150, 150, 1.05, 0));
		});
		s.sideMenu.addChild(sand1, true);

		// Mars terrain 1
		const mars_terrain1 = s.spawnFixedRect(0, 0, 150, 150);
		mars_terrain1.color = s.color(0, 0);
		mars_terrain1.setTexture(images.mars_terrain, 0.3);
		mars_terrain1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(mars_terrain1, s.spawnTerrain(150, 150, 1, 0));
		});
		s.sideMenu.addChild(mars_terrain1, true);

		// Dark lava 1
		const dark_lava1 = s.spawnFixedRect(0, 0, 150, 150);
		dark_lava1.color = s.color(0, 0);
		dark_lava1.setTexture(images.darkLava, 0.3);
		dark_lava1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(dark_lava1, s.spawnTerrain(150, 150, 1.03, 0));
		});
		s.sideMenu.addChild(dark_lava1, true);

		// Rock terrain 1
		const rock1 = s.spawnFixedRect(0, 0, 150, 150);
		rock1.color = s.color(0, 0);
		rock1.setTexture(images.rock, 0.3);
		rock1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(rock1, s.spawnTerrain(150, 150, 1, 0));
		});
		s.sideMenu.addChild(rock1, true);
	};

	s.menuObstacleItems = () => {
		// Maison 1
		const maison1 = s.spawnFixedRect(0, 0, 150, 150);
		maison1.color = s.color(0, 0);
		maison1.setImg(images.house);
		maison1.setSoundOnCollision(sounds.house_impact_audio);
		maison1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(maison1, s.spawnObstacle(300, 300, false, 4));
		});
		s.sideMenu.addChild(maison1, true);

		// Stone 1
		const stone1 = s.spawnFixedRect(0, 0, 150, 100);
		stone1.color = s.color(0, 0);
		stone1.setImg(images.stone);
		stone1.setSoundOnCollision(sounds.stone_impact_audio);
		stone1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(stone1, s.spawnObstacle(150, 100, false, 4));
		});
		s.sideMenu.addChild(stone1, true);

		// Rock Mars 1
		const rocheMars1 = s.spawnFixedRect(0, 0, 150, 100);
		rocheMars1.color = s.color(0, 0);
		rocheMars1.setImg(images.marsRock1);
		rocheMars1.setSoundOnCollision(sounds.stone_impact_audio);
		rocheMars1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(rocheMars1, s.spawnObstacle(150, 100, false, 4));
		});
		s.sideMenu.addChild(rocheMars1, true);

		// Rock Mars 2
		const rocheMars2 = s.spawnFixedRect(0, 0, 150, 150);
		rocheMars2.color = s.color(0, 0);
		rocheMars2.setImg(images.marsRock2);
		rocheMars2.setSoundOnCollision(sounds.stone_impact_audio);
		rocheMars2.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(rocheMars2, s.spawnObstacle(150, 150, false, 4));
		});
		s.sideMenu.addChild(rocheMars2, true);

		// Mountain 1
		const mountains1 = s.spawnFixedRect(0, 0, 150, 100);
		mountains1.color = s.color(0, 0);
		mountains1.setImg(images.mountains);
		mountains1.setSoundOnCollision(sounds.stone_impact_audio);
		mountains1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(mountains1, s.spawnObstacle(150, 100, false, 4));
		});
		s.sideMenu.addChild(mountains1, true);

		// Tree 1
		const tree1 = s.spawnFixedRect(0, 0, 150, 150);
		tree1.color = s.color(0, 0);
		tree1.setImg(images.tree);
		tree1.setSoundOnCollision(sounds.tree_impact_audio);
		tree1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(tree1, s.spawnObstacle(150, 150, false, 4));
		});
		s.sideMenu.addChild(tree1, true);

		// Water 1
		const water1 = s.spawnFixedRect(0, 0, 150, 150);
		water1.color = s.color(0, 0);
		water1.setTexture(images.water, 0.3);
		water1.setSoundOnCollision(sounds.water_impact_audio);
		water1.gameOverEvent = {
			gameOverImg: '/static/images/gifs/water_splash.gif',
			message: "La voiture est tombé dans l'eau!",
		};
		water1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(water1, s.spawnObstacle(150, 150, true, 3));
		});
		s.sideMenu.addChild(water1, true);

		// Lava 1
		const lava1 = s.spawnFixedRect(0, 0, 150, 150);
		lava1.color = s.color(0, 0);
		lava1.setTexture(images.lava, 0.3);
		lava1.setSoundOnCollision(sounds.lava_bubbles_audio);
		lava1.gameOverEvent = {
			gameOverImg: images.lavaAnimation,
			message: 'La voiture est tombée dans la lave!',
		};
		lava1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(lava1, s.spawnObstacle(150, 150, true, 3));
		});
		s.sideMenu.addChild(lava1, true);

		// Hole 1
		const hole1 = s.spawnFixedRect(0, 0, 125, 75);
		hole1.color = s.color(0, 0);
		hole1.setImg(images.hole);
		hole1.setSoundOnCollision(sounds.falling_down_audio);
		hole1.gameOverEvent = {
			gameOverImg: '/static/images/gifs/hole.gif',
			message: 'La voiture est tombée dans un trou!',
		};
		hole1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(hole1, s.spawnObstacle(125, 75, true, 3));
		});
		s.sideMenu.addChild(hole1, true);

		// Mars Dome 1
		const mars_dome1 = s.spawnFixedRect(0, 0, 150, 150);
		mars_dome1.color = s.color(0, 0);
		mars_dome1.setImg(images.mars_dome);
		mars_dome1.setSoundOnCollision(sounds.metal_impact_audio);
		mars_dome1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(mars_dome1, s.spawnObstacle(400, 300, false, 4));
		});
		s.sideMenu.addChild(mars_dome1, true);

		// Broken Rocket 1
		const broken_rocket1 = s.spawnFixedRect(0, 0, 150, 150);
		broken_rocket1.color = s.color(0, 0);
		broken_rocket1.setImg(images.broken_rocket);
		broken_rocket1.setSoundOnCollision(sounds.metal_impact_audio);
		broken_rocket1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(
					broken_rocket1,
					s.spawnObstacle(150, 150, false, 4),
				);
		});
		s.sideMenu.addChild(broken_rocket1, true);

		// Black Hole 1
		const black_hole1 = s.spawnFixedRect(0, 0, 150, 150);
		black_hole1.color = s.color(0, 0);
		black_hole1.setImg(images.black_hole);
		black_hole1.setSoundOnCollision(sounds.falling_down_audio);
		black_hole1.gameOverEvent = {
			gameOverImg: '/static/images/gifs/hole.gif',
			message: 'La voiture est tombée dans un trou!',
		};
		black_hole1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(black_hole1, s.spawnObstacle(150, 150, true, 3));
		});
		s.sideMenu.addChild(black_hole1, true);
	};

	s.menuInteractiveObjectItems = () => {
		// Monnaie de mario
		const coinObject = s.spawnFixedRect(0, 0, 75, 100);
		coinObject.color = s.color(0, 0);
		coinObject.setImg(images.coin);
		coinObject.setSoundOnCollision(sounds.coin_collect_audio);
		coinObject.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(
					coinObject,
					s.spawnInteractiveObject(75, 100, true, false, false, 5),
				);
		});
		s.sideMenu.addChild(coinObject, true);

		// Repair tools 1
		const repair_tools1 = s.spawnFixedRect(0, 0, 100, 100);
		repair_tools1.color = s.color(0, 0);
		repair_tools1.setImg(images.repair_tools);
		repair_tools1.setSoundOnCollision(sounds.coin_collect_audio);
		repair_tools1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(
					repair_tools1,
					s.spawnInteractiveObject(100, 100, true, false, false, 5),
				);
		});
		s.sideMenu.addChild(repair_tools1, true);

		// finish line texture
		const finishLineObject = s.spawnFixedRect(0, 0, 150, 150);
		finishLineObject.color = s.color(0, 0);
		finishLineObject.setTexture(images.finishLine, (2 / 3) * 0.5);
		finishLineObject.setSoundOnCollision(sounds.level_complete_audio);
		finishLineObject.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(
					finishLineObject,
					s.spawnInteractiveObject(195, 75, false, true, false, 5),
				);
		});
		s.sideMenu.addChild(finishLineObject, true);

		// finish line flag
		const flag1 = s.spawnFixedRect(0, 0, 150, 150);
		flag1.color = s.color(0, 0);
		flag1.setImg(images.flag);
		flag1.setSoundOnCollision(sounds.level_complete_audio);
		flag1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(
					flag1,
					s.spawnInteractiveObject(150, 150, false, true, false, 5),
				);
		});
		s.sideMenu.addChild(flag1, true);

		// Bouton rouge (et vert lorsqu'il à été activé)
		const button_red_green = s.spawnFixedRect(0, 0, 150, 150);
		button_red_green.color = s.color(0, 0);
		button_red_green.setImg(images.red_button);
		//button_red_green.setSoundOnCollision(level_complete_audio)
		button_red_green.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(
					button_red_green,
					s.spawnInteractiveObject(100, 100, false, false, true, 5),
				);
		});
		s.sideMenu.addChild(button_red_green, true);

		// Tapis roulant
		const treadmill1 = s.spawnFixedRect(0, 0, 150, 150);
		treadmill1.color = s.color(0, 0);
		treadmill1.setTexture(images.treadmill, 0.2);
		treadmill1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(treadmill1, s.spawnTerrain(150, 150, 0, 3));
		});
		s.sideMenu.addChild(treadmill1, true);

		// Spring 1
		const spring1 = s.spawnFixedRect(0, 0, 75, 100);
		spring1.color = s.color(0, 0);
		spring1.setImg(images.spring);
		spring1.setSoundOnCollision(sounds.coin_collect_audio);
		spring1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(
					spring1,
					s.spawnInteractiveObject(75, 100, false, false, false, 5),
				);
		});
		s.sideMenu.addChild(spring1, true);
	};

	s.menuDecorationItems = () => {
		// Satelitte 1
		const satelitte1 = s.spawnFixedRect(0, 0, 150, 150);
		satelitte1.setImg(images.satelitte);
		satelitte1.color = s.color(0, 0);
		satelitte1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(satelitte1, s.spawnRect(0, 0, 150, 150, 110));
		});
		s.sideMenu.addChild(satelitte1, true);

		// Alien 1
		const alien1 = s.spawnFixedRect(0, 0, 150, 150);
		alien1.setImg(images.alien);
		alien1.color = s.color(0, 0);
		alien1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(alien1, s.spawnRect(0, 0, 150, 150, 110));
		});
		s.sideMenu.addChild(alien1, true);

		// Crack hole 1
		const crackHole1 = s.spawnFixedRect(0, 0, 150, 150);
		crackHole1.setImg(images.crackHole);
		crackHole1.color = s.color(0, 0);
		crackHole1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(crackHole1, s.spawnRect(0, 0, 150, 150, 95));
		});
		s.sideMenu.addChild(crackHole1, true);

		// Crack  1
		const crack1 = s.spawnFixedRect(0, 0, 150, 150);
		crack1.setImg(images.crack);
		crack1.color = s.color(0, 0);
		crack1.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(crack1, s.spawnRect(0, 0, 150, 150, 95));
		});
		s.sideMenu.addChild(crack1, true);
	};

	s.menuOtherShapeItems = () => {
		// Figure fleche
		const fleche = s.spawnFixedObject(
			500,
			[-75, 25],
			[30, 25],
			[30, 50],
			[75, 0],
			[30, -50],
			[30, -25],
			[-75, -25],
		);
		fleche.color = 'blue';
		fleche.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(
					fleche,
					s.spawnShape(
						10,
						[-75, 25],
						[30, 25],
						[30, 50],
						[75, 0],
						[30, -50],
						[30, -25],
						[-75, -25],
					),
				);
		});
		s.sideMenu.addChild(fleche, true);

		// Figure triangle
		const triangle = s.spawnFixedObject(500, [-75, -50], [0, 50], [75, -50]);
		triangle.color = 'purple';
		triangle.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(
					triangle,
					s.spawnShape(10, [-75, -150], [0, -50], [75, -150]),
				);
		});
		s.sideMenu.addChild(triangle, true);

		// Carre
		const carre = s.spawnFixedRect(0, 0, 150, 150);
		carre.color = 'cyan';
		carre.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(carre, s.spawnRect(0, 0, 150, 150, 10));
		});
		s.sideMenu.addChild(carre, true);

		// Rectangle
		const rectangle = s.spawnFixedRect(0, 0, 100, 150);
		rectangle.color = 'red';
		rectangle.onClickDown(() => {
			if (!s.topMenu.hovering)
				s.spawnShapeFromMenu(rectangle, s.spawnRect(0, 0, 100, 150, 10));
		});
		s.sideMenu.addChild(rectangle, true);
	};

	// Méthode qui permet de "spawn" n'importe quel "shape" (incluant les rectangles)
	// P.S si on veut spawn un rectangle avec cette méthode, pas besoin de width/height, seulement besoin des points x et y (regarder dans la méthode s.enterEditMode)

	s.spawnShapeFromMenu = (menuItem, shape, copiedShaped = false) => {
		//if (!copiedShaped)
		shape.setPos(new Vector(s.mouse.x, s.mouse.y), false);

		shape.color = menuItem.color;
		shape.movable = true;

		// Si image est un carré ou un rectangle, permettra de set une image
		// P.S., si on enleve ce if il y aura une erreur lorsqu'on déplace des "shapes" autres que des carrés ou rectangles.
		// P.S., si on laisse ce if il copier une forme en diagonale peut ne pas avoir d'image et fera surment erreur dans le load. lol
		//if (shape.isRect()) {
		if (menuItem.hasTexture) shape.setTexture(menuItem.img, menuItem.res);
		else shape.setImg(menuItem.img);
		//}

		if (menuItem.soundOnCollision != null) {
			shape.setSoundOnCollision(menuItem.soundOnCollision);
		}

		shape.onClickDown(() => {
			if (s.editMode) {
				if (shape.pinned) s.pinButton.setImg(images.pinOn);
				else s.pinButton.setImg(images.pinOff);
			}
		});

		shape.onHover(() => {
			if (s.editMode) {
				if (s.sideMenu.hovering) {
					s.fullscreenDiv.css('cursor', 'grabbing');
				} else if (s.trashCan.hovering) {
					s.trashCan.setImg(images.trashOpen);
					s.fullscreenDiv.css('cursor', 'grabbing');
				} else if (!shape.pinned) {
					s.fullscreenDiv.css('cursor', 'move');
				} else if (shape.pinned) {
					s.fullscreenDiv.css('cursor', 'pointer');
				}
			}
		});

		shape.onClick(() => {
			if (s.editMode && !(s.keyIsDown(32) || s.keyIsDown(17))) {
				if (!shape.pinned) {
					if (shape.children.length === 0) shape.editShape();

					if (s.trashCan.hovering || s.sideMenu.hovering) {
						shape.hovering = false;
						s.deleteShapeWithExtraSteps(shape);
						s.fullscreenDiv.css('cursor', 'default');
						s.trashCan.setImg(images.trash);
					}
				}
			}
		});

		shape.onHoverExit(() => {
			if (s.editMode) {
				s.fullscreenDiv.css('cursor', 'default');
			}
		});

		if (shape.isGameOver) shape.setGameOverEvent(menuItem.gameOverEvent);

		if (!copiedShaped) {
			s.pressedObject = shape;
			s.pressedObject.mouseOffset = s.mouse
				.clone()
				.substract(s.pressedObject.pos);
		}
	};

	// Spawn top menu buttons
	s.spawnTopMenuItems = () => {
		s.topMenuItemSize = s.topMenu.getHeight() * 0.7;

		s.spawnUndoButton();
		s.spawnRedoButton();
		s.spawnCopyButton();
		s.spawnPasteButton();
		s.spawnRotateLeftButton();
		s.spawnRotateRightButton();
		s.spawnLinkButton();
		s.spawnPinButton();
		s.spawnInformationButton();
		if (s.isMobile) s.spawnSelectionButton();

		s.topMenu.addChild(s.undoButton, true);
		s.topMenu.addChild(s.redoButton, true);
		s.topMenu.addChild(s.copyButton, true);
		s.topMenu.addChild(s.pasteButton, true);
		s.topMenu.addChild(s.rotate_Counter_Clockwise, true);
		s.topMenu.addChild(s.rotate_Clockwise, true);
		s.topMenu.addChild(s.linkButton, true);
		s.topMenu.addChild(s.pinButton, true);
		if (s.isMobile) s.topMenu.addChild(s.selectionButton, true);

		s.topMenu.addChild(s.informationButton, true);

		let left = -s.width / 2 + s.sideMenu.getWidth() + s.topMenuItemSize / 2;

		s.topMenu.children.forEach(child => {
			child.setPos(new Vector(left, s.topMenu.pos.y), false);
			left += s.topMenu.getHeight();

			child.color = s.color(0, 0);
			child.strokeColor = s.color(0, 0);

			child.onHoverExit(() => {
				s.fullscreenDiv.css('cursor', 'default');
			});
		});
	};

	s.spawnUndoButton = () => {
		// Undo button
		s.undoButton = s.spawnFixedRect(
			0,
			0,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.undoButton.setImg(images.undo);
		s.undoButton.isUndo = true;
		s.undoButton.onClick(() => {
			// P.S. À chaque changement fait sur un shape, les changements seront enregistrés dans le tableau s.undoShapes

			// Si la liste s.undoShapes est plus grand que 0
			if (s.undoShapes.length > 0) {
				let hasPreviousShape = false;

				// Dernier shape qui à été modifié
				let lastShapeModified = s.undoShapes[s.undoShapes.length - 1];

				if (lastShapeModified.isMultipleObjects) {
					if (lastShapeModified.wereDeletedViaTrash) {
						/*
                        if (!lastShapeModified.wasDeletedViaRedo) {
                            s.undoShapes.pop()
                        }
                        */
						lastShapeModified = s.undoShapes[s.undoShapes.length - 1];
						let tableauClone = [];

						// Pour chaque shape dans ShapeData
						for (let i = 0; i < lastShapeModified.shapeData.length; i++) {
							tableauClone.push(
								s.storeShapeData(
									lastShapeModified.shapeData[i].originalShape,
									false,
									false,
									true,
								),
							);
							s.revertToLastShape(lastShapeModified.shapeData[i]);
							s.addShapeWithExtraSteps(
								lastShapeModified.shapeData[i].originalShape,
							);
						}

						s.redoShapes.push({
							shapeData: tableauClone,
							isMultipleObjects: true,
							wereDeletedViaTrash: true,
							wasDeletedViaRedo: false,
						});
						s.undoShapes.pop();
					} else {
						/*
                        if (!lastShapeModified.wasDeletedViaRedo) {
                            s.undoShapes.pop()
                        }
                        */
						let tableauClone = [];

						// Pour chaque shape dans ShapeData
						for (let i = 0; i < lastShapeModified.shapeData.length; i++) {
							tableauClone.push(
								s.storeShapeData(lastShapeModified.shapeData[i].originalShape),
							);
							s.revertToLastShape(lastShapeModified.shapeData[i]);
						}

						// La collection de for et de if ici sert à détecter si un shape modifier à un shape antérieur
						for (let i = s.undoShapes.length - 2; i >= 0; i--) {
							if (s.undoShapes[i].isMultipleObjects) {
								for (let j = 0; j < s.undoShapes[i].shapeData.length; j++) {
									for (let y = 0; y < lastShapeModified.shapeData.length; y++) {
										if (
											s.undoShapes[i].shapeData[j].originalShape.id ===
											lastShapeModified.shapeData[y].originalShape.id
										) {
											hasPreviousShape = true;
										}
									}
								}
							} else if (!s.undoShapes[i].isMultipleObjects) {
								for (let y = 0; y < lastShapeModified.shapeData.length; y++) {
									if (
										s.undoShapes[i].originalShape.id ===
										lastShapeModified.shapeData[y].originalShape.id
									) {
										hasPreviousShape = true;
									}
								}
							}
						}

						// S'il n'y a pas de shape antérieur
						if (hasPreviousShape === false) {
							for (let i = 0; i < lastShapeModified.shapeData.length; i++) {
								s.deleteShapeWithExtraSteps(
									lastShapeModified.shapeData[i].originalShape,
								);
							}
							s.redoShapes.push({
								shapeData: tableauClone,
								isMultipleObjects: true,
								wereDeletedViaTrash: false,
								wereDeletedViaUndo: true,
								wasDeletedViaRedo: false,
							});
						}
						// Sinon, s'il Y A un shape antérieur
						else {
							s.redoShapes.push({
								shapeData: tableauClone,
								isMultipleObjects: true,
								wereDeletedViaTrash: false,
								wereDeletedViaUndo: false,
								wasDeletedViaRedo: false,
							});
						}

						s.undoShapes.pop();
					}
				}
				// S'il y a eu une modification sur UN SEUL shape
				else {
					// Enleve tout les petits carrés qui nous permet de resize un shape
					lastShapeModified.originalShape.removeAllChildren();

					// Si le dernier shape modifier n'est pas un shape qui à été refait (Redo)
					if (!lastShapeModified.wasRedo) {
						s.undoShapes.pop();
					}

					s.changeCursorOnUndo();

					for (let i = s.undoShapes.length - 1; i >= 0; i--) {
						if (s.undoShapes[i].isMultipleObjects !== true) {
							// Si le id du dernier shape modifié est égal à un des id des changements dans la liste s.undoShapes
							if (
								s.undoShapes[i].originalShape.id ===
								lastShapeModified.originalShape.id
							) {
								hasPreviousShape = true;

								// Si le dernier shape modifier n'a pas été effacé via Undo ou via TrashCan
								if (
									lastShapeModified.wasDeletedViaUndo === false &&
									lastShapeModified.wasDeletedViaTrash === false
								) {
									s.redoShapes.push(
										s.storeShapeData(lastShapeModified.originalShape),
									);
								} else {
									// Si dernier shape modifier à été effacer via le bouton Undo
									if (lastShapeModified.wasDeletedViaUndo) {
										// Pousse le dernier shape modifier dans le tableau s.redoShapes juste avant son changement + wasDeletedViaUndo = true
										s.redoShapes.push(
											s.storeShapeData(lastShapeModified.originalShape, true),
										);
									}
									// Si dernier shape modifier à été effacer via le bouton TrashCan
									else if (lastShapeModified.wasDeletedViaTrash) {
										// Pousse le dernier shape modifier dans le tableau s.redoShapes juste avant son changement + wasDeletedViaTrash = true
										s.redoShapes.push(
											s.storeShapeData(
												lastShapeModified.originalShape,
												false,
												false,
												true,
											),
										);
									}
									s.addShapeWithExtraSteps(lastShapeModified.originalShape);
								}

								// Revient au changements précendents
								s.revertToLastShape(s.undoShapes[i]);

								// Si le dernier shape modifier était de type wasRedo, pop le tableau s.undoShapes
								if (lastShapeModified.wasRedo) {
									s.undoShapes.pop();
								}
								break;
							}
						}
					}

					// Si le dernier shape modifié a un changement antérieur dans la liste de changements (s.undoShapes)
					if (hasPreviousShape === false) {
						let isCar = false;

						for (let car of s.cars)
							if (car.shape === lastShapeModified.originalShape) isCar = true;

						// Pousse le dernier shape modifier dans le tableau s.redoShapes juste avant son changement + wasDeletedViaUndo = true
						if (!isCar) {
							s.redoShapes.push(
								s.storeShapeData(lastShapeModified.originalShape, true),
							);
							s.deleteShapeWithExtraSteps(lastShapeModified.originalShape);
						}
					}
				}
			}
			s.changeCursorOnUndo();
		});
	};

	s.spawnRedoButton = () => {
		// Bouton Redo
		s.redoButton = s.spawnFixedRect(
			0,
			0,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.redoButton.setImg(images.redo);
		s.redoButton.isRedo = true;
		s.redoButton.onClick(() => {
			// P.S. À chaque fois que la fonction Undo est effctuer, les changements seront enregistrés dans le tableau s.redoShapes

			// Si la liste s.redoShapes est plus grand que 0
			if (s.redoShapes.length > 0) {
				let lastShapeModified = s.redoShapes[s.redoShapes.length - 1];

				// Si la derniere modification concerne plusieurs shapes
				if (lastShapeModified.isMultipleObjects) {
					if (lastShapeModified.wereDeletedViaTrash) {
						let tableauClone = [];

						// Itération de chaque shape dans lastShapeModified.shapeData
						for (let i = 0; i < lastShapeModified.shapeData.length; i++) {
							tableauClone.push(
								s.storeShapeData(
									lastShapeModified.shapeData[i].originalShape,
									false,
									false,
									true,
								),
							);
							s.revertToLastShape(lastShapeModified.shapeData[i]);

							if (lastShapeModified.shapeData[i].wasDeletedViaTrash) {
								s.deleteShapeWithExtraSteps(
									lastShapeModified.shapeData[i].originalShape,
								);
							}
						}
						s.undoShapes.push({
							shapeData: tableauClone,
							isMultipleObjects: true,
							wereDeletedViaTrash: true,
							wasDeletedViaRedo: true,
						});
						s.redoShapes.pop();
					} else if (lastShapeModified.wereDeletedViaUndo) {
						let tableauClone = [];

						// Itération de chaque shape dans lastShapeModified.shapeData
						for (let i = 0; i < lastShapeModified.shapeData.length; i++) {
							tableauClone.push(
								s.storeShapeData(
									lastShapeModified.shapeData[i].originalShape,
									false,
									false,
									true,
								),
							);
							s.revertToLastShape(lastShapeModified.shapeData[i]);
							s.addShapeWithExtraSteps(
								lastShapeModified.shapeData[i].originalShape,
							);
						}
						s.undoShapes.push({
							shapeData: tableauClone,
							isMultipleObjects: true,
							wereDeletedViaTrash: false,
							wereDeletedViaUndo: false,
							wasDeletedViaRedo: false,
						});
						s.redoShapes.pop();
					}
					// Si la collection de shapes dernierement modifier n'avaient pas été effacés via TrashCan ou via Undo
					else {
						let tableauClone = [];

						// Itération de chaque shape dans lastShapeModified.shapeData
						for (let i = 0; i < lastShapeModified.shapeData.length; i++) {
							tableauClone.push(
								s.storeShapeData(lastShapeModified.shapeData[i].originalShape),
							);
							s.revertToLastShape(lastShapeModified.shapeData[i]);
						}
						s.undoShapes.push({
							shapeData: tableauClone,
							isMultipleObjects: true,
							wereDeletedViaTrash: false,
							wasDeletedViaRedo: false,
						});
						s.redoShapes.pop();
					}
				}
				// S'il y a eu une modification sur UN SEUL shape
				else {
					// Enleve tout les petits carrés qui nous permet de resize un shape
					lastShapeModified.originalShape.removeAllChildren();

					if (lastShapeModified.wasDeletedViaTrash) {
						s.addSingleUndoWithData(
							lastShapeModified.originalShape,
							false,
							false,
							true,
						);
						s.deleteShapeWithExtraSteps(lastShapeModified.originalShape);
						s.redoShapes.pop();
						return;
					}

					for (let i = s.redoShapes.length - 1; i >= 0; i--) {
						// Si le id du dernier shape modifié est égal à un des id des changements dans la liste s.redoShapes
						if (
							s.redoShapes[i].originalShape.id ===
							lastShapeModified.originalShape.id
						) {
							if (
								lastShapeModified.wasDeletedViaUndo === false &&
								lastShapeModified.wasDeletedViaTrash === false
							) {
								s.addSingleUndo(lastShapeModified);
							} else {
								if (lastShapeModified.wasDeletedViaUndo) {
									s.addSingleUndoWithData(
										lastShapeModified.originalShape,
										true,
									);
									s.addShapeWithExtraSteps(lastShapeModified.originalShape);
								}
							}
							// Revient au changements précendents
							s.revertToLastShape(s.redoShapes[i]);
							s.redoShapes.pop();
							s.changeCursorOnRedo();
							break;
						}
					}
				}
			}
		});
	};

	s.spawnCopyButton = () => {
		// Copy Button (clone un shape)
		s.copyButton = s.spawnFixedRect(
			0,
			0,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.copyButton.setImg(images.copy);
		s.copyButton.onClick(() => {
			// Si le derniere objet movable n'est pas null
			if (s.lastMovableObject != null) {
				s.lastMovableObject.removeAllChildren();
				let shapeToCopy = s.copyShape(s.lastMovableObject);
				s.lastCopiedObjects = [];
				s.lastCopiedObjects.push(shapeToCopy);
				s.listPreviousSelect = [];
				s.deleteSelection();
				s.showPopUpMessage('Copied!');
			}
			// Si la collection de shapes sélectionnés contient plus que 1 shape
			else if (s.listPreviousSelect.length > 1) {
				s.lastCopiedObjects = [];
				s.listPreviousSelect.forEach(shape => {
					s.lastCopiedObjects.push(s.copyShape(shape));
					shape.removeAllChildren();
				});

				s.listPreviousSelect = [];
				s.deleteSelection();
				s.showPopUpMessage('Copied!');
			}
			// Si la collection de shapes sélectionnés contient 1 seul shape
			else if (s.listPreviousSelect.length === 1) {
				s.listPreviousSelect[0].removeAllChildren();
				let shapeToCopy = s.copyShape(s.listPreviousSelect[0]);
				s.lastCopiedObjects = [];
				s.lastCopiedObjects.push(shapeToCopy);
				s.listPreviousSelect = [];
				s.deleteSelection();
				s.showPopUpMessage('Copied!');
			}
		});
	};

	s.spawnPasteButton = () => {
		s.pasteButton = s.spawnFixedRect(
			0,
			0,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.pasteButton.setImg(images.pasteOff);
		s.pasteButton.onClick(() => {
			s.togglePasteButton();
		});
	};

	s.spawnRotateLeftButton = () => {
		s.rotate_Counter_Clockwise = s.spawnFixedRect(
			0,
			0,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.rotate_Counter_Clockwise.setImg(images.rotate_Counter_Clockwise_Img);
		s.rotate_Counter_Clockwise.onClick(() => {
			s.rotateShapeFromMenu(-45);
		});
	};

	s.spawnRotateRightButton = () => {
		s.rotate_Clockwise = s.spawnFixedRect(
			0,
			0,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.rotate_Clockwise.setImg(images.rotate_Clockwise_Img);
		s.rotate_Clockwise.onClick(() => {
			s.rotateShapeFromMenu(45);
		});
	};

	s.spawnLinkButton = () => {
		s.linkButton = s.spawnFixedRect(
			0,
			0,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.linkButton.setImg(images.linkOff);
		s.linkButton.onClick(() => {
			if (s.lastMovableObject instanceof InteractiveObject) {
				if (s.lastMovableObject.isButton) {
					s.lastSelectedButton = s.lastMovableObject;
					s.toggleLinkButton(); // toggle to true
					s.showPopUpMessage('Select an object!');
				}
			}
		});
	};

	s.spawnPinButton = () => {
		s.pinButton = s.spawnFixedRect(
			0,
			0,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.pinButton.setImg(images.pinOff);
		s.pinButton.onClick(() => {
			s.togglePinButton();
		});
	};

	s.spawnSelectionButton = () => {
		s.selectionButton = s.spawnFixedRect(
			0,
			0,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.selectionButton.setImg(images.selectionOff);
		s.selectionButton.onClick(() => {
			s.toggleSelectionButton();
		});
	};
	// TODO add information modal
	s.spawnInformationButton = () => {
		s.informationButton = s.spawnFixedRect(
			0,
			0,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.informationButton.setImg(images.information);
		s.informationButton.onClick(() => {
			//informationModal.modal('show')
		});
	};

	s.spawnInteractiveButtons = () => {
		s.spawnTrashCanButton();
		s.spawnZoomInButton();
		s.spawnZoomOutButton();
	};

	s.spawnTrashCanButton = () => {
		s.trashCan = s.spawnFixedRect(
			s.width / 2 - 35,
			s.height / 2 - s.topMenu.getHeight() - 50,
			50,
			50,
		);
		s.trashCan.setImg(images.trash);
		s.trashCan.color = s.color(0, 0);
		s.trashCan.strokeColor = s.color(0, 0);
		s.trashCan.onHoverExit(() => {
			s.trashCan.setImg(images.trash);
		});
	};

	s.spawnZoomInButton = () => {
		s.zoom_In_Button = s.spawnFixedRect(
			-s.width / 2 + s.sideMenu.getWidth() + s.topMenuItemSize,
			-s.height / 2 + s.topMenuItemSize,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.zoom_In_Button.color = s.color(0, 0);
		s.zoom_In_Button.setImg(images.zoom_In);
		s.zoom_In_Button.onClick(() => {
			s.canvasCamera.addScale(-500 * (s.canvasCamera.scale / 1000));
		});
	};

	s.spawnZoomOutButton = () => {
		s.zoom_Out_Button = s.spawnFixedRect(
			-s.width / 2 + s.sideMenu.getWidth() + s.topMenuItemSize * 2 + 10,
			-s.height / 2 + s.topMenuItemSize,
			s.topMenuItemSize,
			s.topMenuItemSize,
			650,
		);
		s.zoom_Out_Button.color = s.color(0, 0);
		s.zoom_Out_Button.setImg(images.zoom_Out);
		s.zoom_Out_Button.onClick(() => {
			s.canvasCamera.addScale(500 * (s.canvasCamera.scale / 1000));
		});
	};

	//#endregion

	// #region Our Methods

	// Méthode qui fait jouer un son entrer en paramètre. (On peut également mettre en paramètre son volume)
	s.playSound = (sound, volume = 1) => {
		if (sound != null) {
			sound.volume = volume;
			sound.play();
		}
	};

	// TODO confettis
	// Méthode qui fait apparaitre des confetti
	s.confetti = () => {
		//confetti()
	};

	// Méthode qui retourne l'audio d'un coin collecte
	s.newCoinCollectedAudio = () => {
		return sounds.coin_collected_audio();
	};

	// Méthode qui augmente le nombre de monnaies total (s.coinsTotal)
	s.addInteractiveObject = shape => {
		if (shape instanceof InteractiveObject) {
			s.interactiveObjects.push(shape);

			if (shape.isCoin) s.coinsTotal += 1;
		}
	};

	// Méthode qui reduit le nombre de monnaies total (s.coinsTotal)
	s.removeInteractiveObject = shape => {
		if (shape instanceof InteractiveObject) {
			s.interactiveObjects.forEach((interactiveObject, index) => {
				if (s.interactiveObjects[index].id === shape.id)
					s.interactiveObjects.splice(index, 1);
			});

			if (shape.isCoin) s.coinsTotal -= 1;
		}
	};

	s.addSingleUndo = shape => {
		s.undoShapes.push(shape);
	};

	//s.storeShapeData = (shape, wasDeletedViaUndo = false, wasRedo = false, wasDeletedViaTrash = false)
	s.addSingleUndoWithData = (
		shape,
		wasDeletedViaUndo = false,
		wasRedo = false,
		wasDeletedViaTrash = false,
	) => {
		s.undoShapes.push(
			s.storeShapeData(shape, wasDeletedViaUndo, wasRedo, wasDeletedViaTrash),
		);
	};

	/*
    s.addMultipleUndoWithData = (shape) => {
        s.undoShapes.push({ shapeData: tableauClone, isMultipleObjects: true, wereDeletedViaTrash: true, wasDeletedViaRedo: true })
    }
    
    s.addSingleRedo = () => {
        
    }
    
    s.addSingleRedoWithData = () => {
        
    }
    
    s.addMultipleRedoWithData = () => {
        
    }
    */

	// Méthode qui change la position, les vecteurs, et la rotation d'une forme à ses caractéristiques précédents
	s.revertToLastShape = shapeData => {
		// Remet à sa position antérieur
		shapeData.originalShape.setPos(
			new Vector(shapeData.clonedShape.pos.x, shapeData.clonedShape.pos.y),
			false,
		);

		// Remet les vecteurs du dernier shape modifié à leur postion antérieur
		for (let i = 0; i < shapeData.originalShape.vertices.length; i++) {
			let vector = shapeData.clonedShape.vertices[i].clone();
			let angle = (shapeData.clonedShape.rotation.x * s.PI) / 180;
			vector.rotate(angle, shapeData.clonedShape.pos);
			shapeData.originalShape.vertices[i] = vector;
		}

		shapeData.originalShape.setBounds();

		// Remet a sa rotation antérieur
		shapeData.originalShape.rotation.x = 0;
		shapeData.originalShape.rotate(shapeData.clonedShape.rotation.x);
	};

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

	// Méthodes qui change le curseur lors d'un cas unique
	s.changeCursorOnMovement = () => {
		s.topMenu.children.forEach(child => {
			if (child.isRedo && s.redoShapes.length === 0) {
				child.onHover(() => {
					if (s.pressedObject == null && !s.sideMenu.hovering)
						s.fullscreenDiv.css('cursor', 'not-allowed');
				});
			} else {
				child.onHover(() => {
					if (s.pressedObject == null && !s.sideMenu.hovering)
						s.fullscreenDiv.css('cursor', 'pointer');
				});
			}
		});
	};

	s.changeCursorOnUndo = () => {
		if (s.undoShapes.length === 0) {
			s.topMenu.children.forEach(child => {
				if (child.isUndo) {
					child.onHover(() => {
						if (s.pressedObject == null && !s.sideMenu.hovering)
							s.fullscreenDiv.css('cursor', 'not-allowed');
					});
				} else if (child.isRedo) {
					child.onHover(() => {
						if (s.pressedObject == null && !s.sideMenu.hovering)
							s.fullscreenDiv.css('cursor', 'pointer');
					});
				}
			});
		} else {
			s.topMenu.children.forEach(child => {
				if (child.isUndo) {
					child.onHover(() => {
						if (s.pressedObject == null && !s.sideMenu.hovering)
							s.fullscreenDiv.css('cursor', 'pointer');
					});
				} else if (child.isRedo) {
					child.onHover(() => {
						if (s.pressedObject == null && !s.sideMenu.hovering)
							s.fullscreenDiv.css('cursor', 'pointer');
					});
				}
			});
		}
	};

	s.changeCursorOnRedo = () => {
		if (s.redoShapes.length === 0) {
			s.topMenu.children.forEach(child => {
				if (child.isRedo) {
					child.onHover(() => {
						if (s.pressedObject == null && !s.sideMenu.hovering)
							s.fullscreenDiv.css('cursor', 'not-allowed');
					});
				}
			});
		}
	};

	// Méthode qui sert à copier un objet sans qu'il y ait de référence
	s.copyShape = shape => {
		let copiedShaped = shape.cloneShape();

		if (shape.shapeOffset != null) copiedShaped.shapeOffset = shape.shapeOffset;

		s.spawnShapeFromMenu(shape, copiedShaped, true);
		return copiedShaped;
	};

	// Méthode qui active ou désactive le bouton paste dans la barre de menu
	s.togglePasteButton = () => {
		if (s.pasteButtonState) {
			s.pasteButtonState = false;
			s.pasteButton.setImg(images.pasteOff);
		} else {
			if (s.lastCopiedObjects.length === 0)
				s.showPopUpMessage('Copy an object first!');
			else {
				s.pasteButtonState = true;
				s.pasteButton.setImg(images.pasteOn);
				s.showPopUpMessage('Tap to paste!');
			}
		}
	};

	// Méthode qui sert à coller un ou des objets copiés
	s.pasteShape = () => {
		if (s.lastCopiedObjects.length !== 0) {
			s.deleteSelection();
			s.initSelection();

			if (s.lastMovableObject != null) s.lastMovableObject.removeAllChildren();

			if (s.lastCopiedObjects.length > 1) {
				let tableauClone = [];

				s.lastCopiedObjects.forEach(copiedShape => {
					let shapeToPaste = s.pasteSingleShape(copiedShape);
					shapeToPaste.setPos(
						s.mouse.clone().substract(copiedShape.shapeOffset).roundVector(1),
						false,
					);
					tableauClone.push(s.storeShapeData(shapeToPaste));
					s.selectionShape.colliding.push(shapeToPaste);
				});
				s.undoShapes.push({
					shapeData: tableauClone,
					isMultipleObjects: true,
					wereDeletedViaTrash: false,
					wereDeletedViaUndo: false,
					wasDeletedViaRedo: false,
				});
				s.adjustSelection();
			} else {
				let shapeToPaste = s.pasteSingleShape(s.lastCopiedObjects[0]);
				s.addSingleUndoWithData(shapeToPaste);
				s.selectionShape.colliding.push(shapeToPaste);
				s.adjustSelection();
			}
		}
	};

	// Méthode qui sert à coller un seul objet
	s.pasteSingleShape = shape => {
		let shapeToPaste = s.copyShape(shape);
		shapeToPaste.setPos(new Vector(s.mouse.x, s.mouse.y), false);
		s.addShapeWithExtraSteps(shapeToPaste);
		return shapeToPaste;
	};

	// Méthode qui sert à faire la rotation de un ou des objets selon un angle précis
	s.rotateShapeFromMenu = angle => {
		let shapesExistsInCanvas = false;

		//Si la liste d'objets sélectionnés contient 1 shape ou plus
		if (s.listPreviousSelect.length > 0) {
			// Vérifie si les derniers objets dans la selection sont toujours présents dans le canvas
			s.movableShapes.forEach(movableShape => {
				s.listPreviousSelect.forEach(shapeInSelect => {
					if (movableShape.originalShape.id === shapeInSelect.id)
						shapesExistsInCanvas = true;
				});
			});

			// Si les dernier shapes sur lequel on veut faire une rotation EXISTENT
			if (shapesExistsInCanvas) {
				s.redoShapes.splice(0, s.redoShapes.length);
				let tableauClone = [];
				// Si c'est la premiere fois qu'on rotationne la liste de shapes sélectionnés
				if (s.firstTimeRotation) {
					s.listPreviousSelect.forEach(shapeInSelect => {
						for (let i = s.undoShapes.length - 1; i >= 0; i--) {
							if (!s.undoShapes[i].isMultipleObjects) {
								if (s.undoShapes[i].originalShape.id === shapeInSelect.id) {
									let shapeClone = s.storeShapeData(
										s.undoShapes[i].originalShape,
									);
									tableauClone.push(shapeClone);
									break;
								}
							} else if (s.undoShapes[i].isMultipleObjects) {
								for (let j = 0; j < s.undoShapes[i].shapeData.length; j++) {
									if (
										s.undoShapes[i].shapeData[j].originalShape.id ===
										shapeInSelect.id
									) {
										let shapeClone = s.storeShapeData(
											s.undoShapes[i].shapeData[j].originalShape,
										);
										tableauClone.push(shapeClone);
									}
								}
							}
						}
					});
					s.undoShapes.push({
						shapeData: tableauClone,
						isMultipleObjects: true,
						wereDeletedViaTrash: false,
						wasDeletedViaRedo: false,
					});
					tableauClone = [];
					s.listPreviousSelect.forEach(shapeInSelect => {
						shapeInSelect.rotate(angle, s.previousSelectionShape.pos);
						tableauClone.push(s.storeShapeData(shapeInSelect));
					});
					s.undoShapes.push({
						shapeData: tableauClone,
						isMultipleObjects: true,
						wereDeletedViaTrash: false,
						wasDeletedViaRedo: false,
					});
					s.firstTimeRotation = false;
				}
				// Si ce n'est PAS la premiere fois qu'on rotationne la liste de shapes sélectionnés
				else if (!s.firstTimeRotation) {
					s.listPreviousSelect.forEach(shapeInSelect => {
						shapeInSelect.rotate(angle, s.previousSelectionShape.pos);
						tableauClone.push(s.storeShapeData(shapeInSelect));
					});
					s.undoShapes.push({
						shapeData: tableauClone,
						isMultipleObjects: true,
						wereDeletedViaTrash: false,
						wasDeletedViaRedo: false,
					});
				}
			}
		}
		// Si le dernier objet movable n'est pas null ET SI on désire faire une rotation sur UN SEUL shape
		else if (s.lastMovableObject != null) {
			// Vérifie si le dernier movable objet est présent dans le canvas
			s.movableShapes.forEach(movableShape => {
				if (movableShape.originalShape.id === s.lastMovableObject.id)
					shapesExistsInCanvas = true;
			});

			// Si le dernier shapes sur lequel on veut faire une rotation EXISTE
			if (shapesExistsInCanvas) {
				s.redoShapes.splice(0, s.redoShapes.length);
				s.lastMovableObject.rotate(angle);
				s.addSingleUndoWithData(s.lastMovableObject);
			}
		}
	};

	s.contextMenuClick = () => {
		let isHoveringShape = false;
		let shapeHovering = null;

		s.movableShapes.forEach(shape => {
			if (shape.originalShape.hovering) {
				isHoveringShape = true;
				shapeHovering = shape.originalShape;
			}
		});

		if (isHoveringShape && !s.contextMenuState) {
			let isCar = false;
			for (const car of s.cars) if (car.shape === shapeHovering) isCar = true;

			if (!isCar) s.toggleContextMenuShapeOn(shapeHovering);

			s.undoShapes.pop();
		} else if (
			!isHoveringShape &&
			!s.contextMenuState &&
			s.lastCopiedObjects.length !== 0
		)
			s.toggleContextMenuCanvasOn();
		else if (s.contextMenuState) s.toggleContextMenuOff();
	};

	s.toggleContextMenuShapeOn = shape => {
		s.contextMenuState = true;

		let totalShapesInsideSelection = s.listPreviousSelect.length;
		let contextMenuPin;
		let contextMenuCopy;
		let contextMenuDelete;
		let contextMenuLink;

		if (s.linkButtonState) {
			s.toggleLinkButton(); // toggle to false
			s.showPopUpMessage('Linking cancelled');
		}

		s.contextMenu = s.spawnRect(
			shape.calcRightX() + 100,
			shape.calcTopY() - 50,
			200,
			shape.isButton ? 190 : 140,
			400,
		);
		s.contextMenu.color = '#303030';
		s.contextMenu.isHelp = true;
		s.contextMenu.scaleWithCamera = true;

		contextMenuPin = s.spawnTextObject(
			!shape.pinned ? 'Pin' : 'Unpin',
			26,
			0,
			50,
			400,
		);
		contextMenuCopy = s.spawnTextObject('Copy', 26, 0, 0, 400);
		contextMenuDelete = s.spawnTextObject('Delete', 26, 0, -50, 400);

		s.contextMenu.addChild(contextMenuPin, true);
		s.contextMenu.addChild(contextMenuCopy, true);
		s.contextMenu.addChild(contextMenuDelete, true);

		if (shape.isButton) {
			contextMenuLink = s.spawnTextObject(
				s.linkButtonState ? 'Cancel Linking' : 'Add/Remove link',
				26,
				0,
				-100,
				400,
			);

			s.contextMenu.addChild(contextMenuLink, true);

			contextMenuLink.onClick(() => {
				s.lastSelectedButton = shape;
				s.toggleLinkButton(); // toggle to true
				s.showPopUpMessage('Select an object!');
				s.toggleContextMenuOff();
			});
		}

		s.contextMenu.children.forEach(child => {
			child.color = 'white';
			child.setBackgroundColor('#303030');
			child.isHelp = true;
		});

		contextMenuPin.onClick(() => {
			shape.pinned = !shape.pinned;
			if (shape.pinned) shape.removeAllChildren();
			s.showPopUpMessage(shape.pinned ? 'Pinned!' : 'Unpinned!');
			s.toggleContextMenuOff();
		});

		contextMenuCopy.onClick(() => {
			if (s.listPreviousSelect.length !== totalShapesInsideSelection)
				s.listPreviousSelect.splice(
					s.listPreviousSelect.length - totalShapesInsideSelection,
					totalShapesInsideSelection,
				);

			s.copyButton.click();
			s.toggleContextMenuOff();
		});

		contextMenuDelete.onClick(() => {
			if (s.listPreviousSelect.length !== totalShapesInsideSelection)
				s.listPreviousSelect.splice(
					s.listPreviousSelect.length - totalShapesInsideSelection,
					totalShapesInsideSelection,
				);

			if (s.lastMovableObject != null) {
				s.addSingleUndoWithData(s.lastMovableObject, false, false, true);
				s.deleteShapeWithExtraSteps(s.lastMovableObject);
				s.toggleContextMenuOff();
				s.lastMovableObject = null;
			} else if (s.listPreviousSelect.length === 1) {
				s.addSingleUndoWithData(s.listPreviousSelect[0], false, false, true);
				s.deleteShapeWithExtraSteps(s.listPreviousSelect[0]);
				s.listPreviousSelect = [];
				s.deleteSelection();
				s.toggleContextMenuOff();
				s.lastMovableObject = null;
			} else if (s.listPreviousSelect.length > 1) {
				s.contextMenuState = false;
				let lastSelectedShapes = [];

				for (let selection of s.listPreviousSelect) {
					selection.hovering = false;
					lastSelectedShapes.push(
						s.storeShapeData(selection, false, false, true),
					);
					s.deleteShapeWithExtraSteps(selection);
				}

				s.listPreviousSelect = [];
				s.deleteSelection();
				// deux undoshapes.push parce sinon sa ne fonctionne pas idk why
				s.undoShapes.push({
					shapeData: lastSelectedShapes,
					isMultipleObjects: true,
					wereDeletedViaTrash: true,
					wasDeletedViaRedo: false,
				});
				s.undoShapes.push({
					shapeData: lastSelectedShapes,
					isMultipleObjects: true,
					wereDeletedViaTrash: true,
					wasDeletedViaRedo: false,
				});

				s.deleteShape(s.contextMenu, true);
				s.lastMovableObject = null;
			}
		});
	};

	s.toggleContextMenuCanvasOn = () => {
		s.contextMenuState = true;
		s.contextMenu = s.spawnRect(s.mouse.x + 50, s.mouse.y, 100, 50, 400);
		s.contextMenu.color = '#303030';
		s.contextMenu.isHelp = true;
		s.contextMenu.scaleWithCamera = true;

		let contextMenuPaste = s.spawnTextObject('Paste', 26, 0, 0, 400);

		s.contextMenu.addChild(contextMenuPaste, true);

		s.contextMenu.children.forEach(child => {
			child.color = '#white';
			child.setBackgroundColor('#303030');
			child.isHelp = true;
		});

		contextMenuPaste.onClick(() => {
			s.pasteShape();
			s.toggleContextMenuOff();
		});
	};

	s.toggleContextMenuOff = () => {
		s.contextMenuState = false;
		s.deleteShape(s.contextMenu, true);
	};

	s.toggleSelectionButton = () => {
		if (s.selectionButtonState) {
			s.selectionButtonState = false;
			s.selectionButton.setImg(images.selectionOff);
		} else {
			s.selectionButtonState = true;
			s.selectionButton.setImg(images.selectionOn);
			s.showPopUpMessage('Tap and drag to create selection!');
		}
	};

	s.selectionClickDown = () => {
		s.startingPointSelection = s.mouse.roundVector(1).clone();

		if (
			s.selectionShape != null &&
			!(s.keyIsDown(32) || s.keyIsDown(17)) &&
			s.selectionShape.listSelect != null
		) {
			let inSelection = false;
			for (const selection of s.selectionShape.listSelect) {
				if (selection.hovering) inSelection = true;
			}
			if (s.selectionShape.children.length > 0) {
				for (const child of s.selectionShape.children[0].children) {
					if (child.hovering) inSelection = true;
				}
			}
			if (!inSelection) {
				if (
					!s.rotate_Counter_Clockwise.hovering ||
					s.rotate_Clockwise.hovering
				) {
					s.firstTimeRotation = true;
					s.deleteSelection();
				}
			} else {
				if (s.selectionShape.listSelect.length > 0) {
					let lastSelectedModifications = [];

					s.selectionShape.listSelect.forEach(shapeSelected => {
						lastSelectedModifications.push(s.storeShapeData(shapeSelected));
					});
					s.undoShapes.push({
						shapeData: lastSelectedModifications,
						isMultipleObjects: true,
						wereDeletedViaTrash: false,
						wasDeletedViaRedo: false,
					});
				}
			}
		}
	};

	s.initSelection = (x = 0, y = 0, w = 0, h = 0) => {
		s.selectionShape = s.spawnRect(x, y, w, h, 300);
		s.selectionShape.alwaysStroke = true;
		s.selectionShape.strokeColor = s.color(0, 150, 255);
		s.selectionShape.color = s.color(0, 150, 255, 25);
		s.selectionShape.isHelp = true;
	};

	s.createSelection = () => {
		if (
			(s.pressedObject == null || s.pressedObject?.pinned === true) &&
			s.startingPointSelection != null &&
			s.selectionShape == null &&
			s.editMode
		) {
			let x = (s.startingPointSelection.x + s.mouse.x) / 2;
			let y = (s.startingPointSelection.y + s.mouse.y) / 2;
			let w = Math.abs(s.startingPointSelection.x - s.mouse.x);
			let h = Math.abs(s.startingPointSelection.y - s.mouse.y);
			s.initSelection(x, y, w, h);
		} else if (s.selectionShape != null) {
			s.selectionShape.vertices[1].x = s.mouse.x;
			s.selectionShape.vertices[2] = s.mouse.clone();
			s.selectionShape.vertices[3].y = s.mouse.y;
		}
	};

	s.adjustSelection = () => {
		if (s.selectionShape != null) {
			if (s.selectionShape.colliding.length === 0 && !s.contextMenu.hovering) {
				//Suppression
				s.deleteSelection();
			} else if (!s.selectionShape.movable) {
				//Ajustement de la forme
				const listLeftX = [];
				const listRightX = [];
				const listTopY = [];
				const listBottomY = [];
				const listSelect = [];
				for (const collider of s.selectionShape.colliding.filter(
					shape => !shape.pinned,
				)) {
					listLeftX.push(collider.calcLeftX());
					listRightX.push(collider.calcRightX());
					listTopY.push(collider.calcTopY());
					listBottomY.push(collider.calcBottomY());
					listSelect.push(collider);
				}
				const x = (Math.min(...listLeftX) + Math.max(...listRightX)) / 2;
				const y = (Math.min(...listBottomY) + Math.max(...listTopY)) / 2;
				const w = Math.abs(Math.min(...listLeftX) - Math.max(...listRightX));
				const h = Math.abs(Math.min(...listBottomY) - Math.max(...listTopY));

				s.deleteShape(s.selectionShape, true);
				s.initSelection(x, y, w, h);
				s.selectionShape.movable = true;
				s.selectionShape.listSelect = listSelect;
				s.listPreviousSelect = [];
				s.lastMovableObject = null;
			} else if (
				s.trashCan.hovering ||
				(s.sideMenu.hovering && s.selectionShape.movable)
			) {
				// Suppression de toute la selection
				let lastSelectedShapes = [];

				for (let selection of s.selectionShape.listSelect) {
					selection.hovering = false;
					lastSelectedShapes.push(
						s.storeShapeData(selection, false, false, true),
					);
					s.deleteShapeWithExtraSteps(selection);
				}

				s.listPreviousSelect = [];
				s.lastMovableObject = null;
				s.deleteSelection();

				s.undoShapes.push({
					shapeData: lastSelectedShapes,
					isMultipleObjects: true,
					wereDeletedViaTrash: true,
					wasDeletedViaRedo: false,
				});
				s.fullscreenDiv.css('cursor', 'default');
				s.trashCan.setImg(images.trash);
			}

			if (s.selectionShape != null) {
				if (s.selectionShape.children.length === 0)
					s.selectionShape.editShape(true);

				for (let selection of s.selectionShape.listSelect) {
					selection.shapeOffset = s.selectionShape.pos
						.clone()
						.substract(selection.pos);
					s.listPreviousSelect.push(selection);
				}
				s.previousSelectionShape = s.selectionShape;
			}
			s.mobileSelection = false;
		}
	};

	s.deleteSelection = () => {
		if (s.selectionShape != null) {
			s.deleteShape(s.selectionShape, true);
			s.selectionShape = null;
		}
	};

	s.addOrRemoveLink = () => {
		let objectAlreadyLinked = false;

		for (let i = 0; i < s.movableShapes.length; i++) {
			if (
				s.movableShapes[i].originalShape.hovering &&
				s.movableShapes[i].originalShape instanceof Obstacle
			) {
				// vérifie si l'objet selectionné à déjà un link avec le dernier bouton
				for (let j = 0; j < s.lastSelectedButton.linkedId.length; j++) {
					if (
						s.lastSelectedButton.linkedId[j] ===
						s.movableShapes[i].originalShape.id
					) {
						objectAlreadyLinked = true;
						s.lastSelectedButton.linkedId.splice(j, 1);
						break;
					}
				}
				if (objectAlreadyLinked) s.showPopUpMessage('Link has been removed!');
				else {
					s.lastSelectedButton.linkedId.push(
						s.movableShapes[i].originalShape.id,
					);
					s.showPopUpMessage('Link has been added!');
					break;
				}
			} else if (
				s.movableShapes[i].originalShape.hovering &&
				!(s.movableShapes[i].originalShape instanceof Obstacle)
			) {
				s.showPopUpMessage('Cannot link to this object');
			}
		}
		s.toggleLinkButton();
	};

	s.toggleLinkButton = () => {
		if (s.linkButtonState) {
			s.linkButtonState = false;
			s.linkButton.setImg(images.linkOff);
			//s.lastSelectedButton = null
		} else {
			s.linkButtonState = true;
			s.linkButton.setImg(images.linkOn);
		}
	};

	s.togglePinButton = () => {
		if (s.lastPinnabledObject != null) {
			s.lastPinnabledObject.pinned = !s.lastPinnabledObject.pinned;
			if (s.lastPinnabledObject.pinned) {
				s.lastPinnabledObject.removeAllChildren();
				s.pinButton.setImg(images.pinOn);
			} else s.pinButton.setImg(images.pinOff);
			s.showPopUpMessage(
				s.lastPinnabledObject.pinned ? 'Pinned!' : 'Unpinned!',
			);
		}
	};

	s.addShapeWithExtraSteps = shape => {
		s.addObjectToScene(shape, shape.zIndex);
		s.addInteractiveObject(shape);
		s.addMovableShape(shape);
	};

	s.deleteShapeWithExtraSteps = shape => {
		s.removeInteractiveObject(shape);
		s.deleteShape(shape, true);
		s.removeMovableShape(shape);
	};

	s.addMovableShape = shape => {
		s.movableShapes.push(s.storeShapeData(shape));
	};

	s.removeMovableShape = shape => {
		s.movableShapes.forEach((shapeToRemove, index) => {
			if (s.movableShapes[index].originalShape.id === shape.id)
				s.movableShapes.splice(index, 1);
		});
	};

	s.showPopUpMessage = (message, time = 1) => {
		// Fait apparaitre un message de notre choix durant la duree de 'time' et apres la moitie du temps le message commencera a disparaitre
		if (s.popUpMessage == null) {
			s.popUpMessage = s.spawnFixedTextObject(
				message,
				25,
				0,
				s.height / 2 - s.topMenu.getHeight() * 2,
			);

			let count = 0;
			let intervall = setInterval(() => {
				count += 1;
				if (count >= 25) {
					if (count < 50)
						s.popUpMessage.color = s.color(0, 255 - 10 * (count - 25));
					else {
						s.deleteShape(s.popUpMessage);
						s.popUpMessage = null;
						clearInterval(intervall);
					}
				}
			}, 20 * time);
		}
	};

	s.spawnCustomSelection = (shape, color, gap) => {
		// Fait apparaitre un contour sur la shape qu'on veut
		let customSelection = s.spawnRect(
			shape.pos.x,
			shape.pos.y,
			shape.getWidth() + gap,
			shape.getHeight() + gap,
			150,
		);
		customSelection.rotate(shape.rotation.x);
		customSelection.color = s.color(0, 0);
		customSelection.alwaysStroke = true;
		customSelection.strokeColor = color;
		customSelection.isHelp = true;
		return customSelection;
	};
	//#endregion
}