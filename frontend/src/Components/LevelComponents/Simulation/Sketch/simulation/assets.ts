import alien from '../../../../../assets/images/simulation/decorations/alien.gif';
import crack from '../../../../../assets/images/simulation/decorations/crack.png';
import holeCrack from '../../../../../assets/images/simulation/decorations/holeCrack.png';
import satelitte from '../../../../../assets/images/simulation/decorations/satelitte.png';
import copy from '../../../../../assets/images/simulation/editeur/copy.png';
import information from '../../../../../assets/images/simulation/editeur/information.png';
import linkOff from '../../../../../assets/images/simulation/editeur/linkOff.png';
import linkOn from '../../../../../assets/images/simulation/editeur/linkOn.png';
import pasteOff from '../../../../../assets/images/simulation/editeur/pasteOff.png';
import pasteOn from '../../../../../assets/images/simulation/editeur/pasteOn.png';
import pinOff from '../../../../../assets/images/simulation/editeur/pinOff.png';
import pinOn from '../../../../../assets/images/simulation/editeur/pinOn.png';
import redo from '../../../../../assets/images/simulation/editeur/redo.png';
import rotate_clockwise from '../../../../../assets/images/simulation/editeur/rotate_clockwise.png';
import rotate_counterclockwise from '../../../../../assets/images/simulation/editeur/rotate_counterclockwise.png';
import selectionOff from '../../../../../assets/images/simulation/editeur/selectionOff.png';
import selectionOn from '../../../../../assets/images/simulation/editeur/selectionOn.png';
import tools from '../../../../../assets/images/simulation/editeur/tools.png';
import trash from '../../../../../assets/images/simulation/editeur/trash.png';
import trashOpen from '../../../../../assets/images/simulation/editeur/trashOpen.png';
import undo from '../../../../../assets/images/simulation/editeur/undo.png';
import zoom_in from '../../../../../assets/images/simulation/editeur/zoom_in.png';
import zoom_out from '../../../../../assets/images/simulation/editeur/zoom_out.png';
import hole from '../../../../../assets/images/simulation/gifs/hole.gif';
import lavaAnimation from '../../../../../assets/images/simulation/gifs/lava.gif';
import water_splash from '../../../../../assets/images/simulation/gifs/water_splash.gif';
import coin from '../../../../../assets/images/simulation/interactifs/coin.png';
import finishLine from '../../../../../assets/images/simulation/interactifs/finishLine.png';
import flag from '../../../../../assets/images/simulation/interactifs/flag.png';
import green_button_pressed from '../../../../../assets/images/simulation/interactifs/green_button_pressed.png';
import red_button_unpressed from '../../../../../assets/images/simulation/interactifs/red_button_unpressed.png';
import repair_tools from '../../../../../assets/images/simulation/interactifs/repair_tools.png';
import spring from '../../../../../assets/images/simulation/interactifs/spring.png';
import treadmill from '../../../../../assets/images/simulation/interactifs/treadmill.png';
import animatedCar from '../../../../../assets/images/simulation/misc/animatedCar.gif';
import carTop from '../../../../../assets/images/simulation/misc/carTop.png';
import carTopD from '../../../../../assets/images/simulation/misc/carTopD.png';
import carTopG from '../../../../../assets/images/simulation/misc/carTopG.png';
import black_hole from '../../../../../assets/images/simulation/obstacles/black_hole.png';
import brokenRocket from '../../../../../assets/images/simulation/obstacles/brokenRocket.png';
import hole2 from '../../../../../assets/images/simulation/obstacles/hole.png';
import house from '../../../../../assets/images/simulation/obstacles/house.png';
import lava from '../../../../../assets/images/simulation/obstacles/lava.png';
import mars_dome from '../../../../../assets/images/simulation/obstacles/mars_dome.png';
import mountains from '../../../../../assets/images/simulation/obstacles/mountains.png';
import rocheMars1 from '../../../../../assets/images/simulation/obstacles/rocheMars1.png';
import rocheMars2 from '../../../../../assets/images/simulation/obstacles/rocheMars2.png';
import stone from '../../../../../assets/images/simulation/obstacles/stone.png';
import tree from '../../../../../assets/images/simulation/obstacles/tree.png';
import water from '../../../../../assets/images/simulation/obstacles/water.jpg';
import bridge from '../../../../../assets/images/simulation/routes/bridge.png';
import road1 from '../../../../../assets/images/simulation/routes/road1.jpg';
import tire_tracks from '../../../../../assets/images/simulation/routes/tire_tracks.png';
import darkLava from '../../../../../assets/images/simulation/terrains/darkLava.jpg';
import gazon from '../../../../../assets/images/simulation/terrains/gazon.gif';
import grass from '../../../../../assets/images/simulation/terrains/grass.jpg';
import mars_surface from '../../../../../assets/images/simulation/terrains/mars_surface.png';
import mud from '../../../../../assets/images/simulation/terrains/mud.jpg';
import rock from '../../../../../assets/images/simulation/terrains/rock.jpg';
import sand from '../../../../../assets/images/simulation/terrains/sand.jpg';

export type imageNameType =
	| 'alien'
	| 'crack'
	| 'holeCrack'
	| 'satelitte'
	| 'copy'
	| 'information'
	| 'linkOff'
	| 'linkOn'
	| 'pasteOff'
	| 'pasteOn'
	| 'pinOff'
	| 'pinOn'
	| 'redo'
	| 'rotate_clockwise'
	| 'rotate_counterclockwise'
	| 'selectionOff'
	| 'selectionOn'
	| 'tools'
	| 'trash'
	| 'trashOpen'
	| 'undo'
	| 'zoom_in'
	| 'zoom_out'
	| 'hole'
	| 'lava'
	| 'water_splash'
	| 'coin'
	| 'finishLine'
	| 'flag'
	| 'green_button_pressed'
	| 'red_button_unpressed'
	| 'repair_tools'
	| 'spring'
	| 'treadmill'
	| 'animatedCar'
	| 'carTop'
	| 'carTopD'
	| 'carTopG'
	| 'black_hole'
	| 'brokenRocket'
	| 'hole2'
	| 'house'
	| 'lavaAnimation'
	| 'mars_dome'
	| 'mountains'
	| 'rocheMars1'
	| 'rocheMars2'
	| 'stone'
	| 'tree'
	| 'water'
	| 'bridge'
	| 'road1'
	| 'tire_tracks'
	| 'darkLava'
	| 'gazon'
	| 'grass'
	| 'mars_surface'
	| 'mud'
	| 'rock'
	| 'sand';

/*import  from '../../../../../assets/images/';
import  from '../../../../../assets/images/';
import  from '../../../../../assets/images/';
import  from '../../../../../assets/images/';
*/

//export const dictImages: { [key: string]: any } = {};

//const importImg = (s: any, path: string, deep: boolean) => {
//	const images: { [key: string]: string } = {};
//	const ctx = require.context(path, deep, /\.(png|jpe?g|gif|svg)$/);
//
//	ctx.keys().forEach(item => {
//		images[item.replace(/\.(\/.*\/)+/, '').replace(/\..*$/, '')] =
//			s.loadImage(item);
//	});
//
//	return images;
//};

export const imagesPath: {[key in imageNameType]: string} = {
	alien,
	crack,
	holeCrack,
	satelitte,
	copy,
	information,
	linkOff,
	linkOn,
	pasteOff,
	pasteOn,
	pinOff,
	pinOn,
	redo,
	rotate_clockwise,
	rotate_counterclockwise,
	selectionOff,
	selectionOn,
	tools,
	trash,
	trashOpen,
	undo,
	zoom_in,
	zoom_out,
	hole,
	lavaAnimation,
	water_splash,
	coin,
	finishLine,
	flag,
	green_button_pressed,
	red_button_unpressed,
	repair_tools,
	spring,
	treadmill,
	animatedCar,
	carTop,
	carTopD,
	carTopG,
	black_hole,
	brokenRocket,
	hole2,
	house,
	lava,
	mars_dome,
	mountains,
	rocheMars1,
	rocheMars2,
	stone,
	tree,
	water,
	bridge,
	road1,
	tire_tracks,
	darkLava,
	gazon,
	grass,
	mars_surface,
	mud,
	rock,
	sand,
}


export const images: { [key in imageNameType]: any } = {
	alien,
	crack,
	holeCrack,
	satelitte,
	copy,
	information,
	linkOff,
	linkOn,
	pasteOff,
	pasteOn,
	pinOff,
	pinOn,
	redo,
	rotate_clockwise,
	rotate_counterclockwise,
	selectionOff,
	selectionOn,
	tools,
	trash,
	trashOpen,
	undo,
	zoom_in,
	zoom_out,
	hole,
	lavaAnimation,
	water_splash,
	coin,
	finishLine,
	flag,
	green_button_pressed,
	red_button_unpressed,
	repair_tools,
	spring,
	treadmill,
	animatedCar,
	carTop,
	carTopD,
	carTopG,
	black_hole,
	brokenRocket,
	hole2,
	house,
	lava,
	mars_dome,
	mountains,
	rocheMars1,
	rocheMars2,
	stone,
	tree,
	water,
	bridge,
	road1,
	tire_tracks,
	darkLava,
	gazon,
	grass,
	mars_surface,
	mud,
	rock,
	sand,
};

export const loadAllImages = (s: any) => {
	//images = importImg(s, '../../../../../assets/imulation/miscmages/si', false);
	for (const [imageName, image] of Object.entries(images)) {
		if (typeof image !== 'string') continue;
		images[imageName as imageNameType] = [imageName, s.loadImage(image)];
	}
};

export const loadImages = (s: any, ...imagesName: imageNameType[]) => {
	for (const imageName of imagesName) {
		if (typeof images[imageName] !== 'string') continue;
		images[imageName] = [imageName, s.loadImage(images[imageName])];
	}
};

export const unloadImages = (s: any, ...imagesName: imageNameType[]) => {
	for (const imageName of imagesName) {
		if (typeof images[imageName] !== 'string')
		  images[imageName] = imageName;
	}
};

export const unloadUnusedImages = (s: any, ..._images: any[]) => {
	for (const [imageName, image] of Object.entries(images)) {
    if (_images.includes([imageName, image]))
      images[imageName as imageNameType] = imageName;
	}
};


export const sounds: { [key: string]: any } = {};

export const loadSounds = (s: any) => {
	/*sounds.coin_collect_audio = new Audio('/static/sounds/simulation/coin_collect.wav');
  sounds.level_complete_audio = new Audio('/static/sounds/simulation/level_complete.mp3');
  sounds.house_impact_audio = new Audio('/static/sounds/simulation/house_impact.mp3');
  sounds.tree_impact_audio = new Audio('/static/sounds/simulation/tree_impact.mp3');
  sounds.stone_impact_audio = new Audio('/static/sounds/simulation/stone_impact.mp3');
  sounds.water_impact_audio = new Audio('/static/sounds/simulation/water_impact.mp3');
  sounds.falling_down_audio = new Audio('/static/sounds/simulation/falling_down.mp3');
  sounds.lava_bubbles_audio = new Audio('/static/sounds/simulation/lava_bubbles.mp3');
  sounds.metal_impact_audio = new Audio('/static/sounds/simulation/metal_impact.mp3');*/
};

// Outils pour edit
/*
  images.tools = s.loadImage('/static/images/simulation/editeur/tools.png')
  images.trash = s.loadImage('/static/images/simulation/editeur/trash.png')
  images.trashOpen = s.loadImage('/static/images/simulation/editeur/trashOpen.png')
  images.undo = s.loadImage('/static/images/simulation/editeur/undo.png')
  images.redo = s.loadImage('/static/images/simulation/editeur/redo.png')
  images.copy = s.loadImage('/static/images/simulation/editeur/copy.png')
  images.selectionOff = s.loadImage('/static/images/simulation/editeur/selectionOff.png')
  images.selectionOn = s.loadImage('/static/images/simulation/editeur/selectionOn.png')
  images.pasteOff = s.loadImage('/static/images/simulation/editeur/pasteOff.png')
  images.pasteOn = s.loadImage('/static/images/simulation/editeur/pasteOn.png')
  images.rotate_Clockwise_Img = s.loadImage('/static/images/simulation/editeur/rotate_clockwise.png')
  images.rotate_Counter_Clockwise_Img = s.loadImage('/static/images/simulation/editeur/rotate_counterclockwise.png')
  images.pinOn = s.loadImage('/static/images/simulation/editeur/pinOn.png')
  images.pinOff = s.loadImage('/static/images/simulation/editeur/pinOff.png')
  images.zoom_In = s.loadImage('/static/images/simulation/editeur/zoom_in.png')
  images.zoom_Out = s.loadImage('/static/images/simulation/editeur/zoom_out.png')
  images.linkOn = s.loadImage('/static/images/simulation/editeur/linkOn.png')
  images.linkOff = s.loadImage('/static/images/simulation/editeur/linkOff.png')
  images.information = s.loadImage('/static/images/simulation/editeur/information.png')

  // Routes
  images.road1 = s.loadImage('/static/images/simulation/routes/road1.jpg')
  images.tire_tracks = s.loadImage('/static/images/simulation/routes/tire_tracks.png')
  images.bridge = s.loadImage('/static/images/simulation/routes/bridge.png')

  // Terrains
  images.gazon = s.loadImage('/static/images/simulation/terrains/gazon.gif')
  images.grass = s.loadImage('/static/images/simulation/terrains/grass.jpg')
  images.mud = s.loadImage('/static/images/simulation/terrains/mud.jpg')
  images.sand = s.loadImage('/static/images/simulation/terrains/sand.jpg')
  images.mars_terrain = s.loadImage('/static/images/simulation/terrains/mars_surface.png')
  images.rock = s.loadImage('/static/images/simulation/terrains/rock.jpg')
  images.darkLava = s.loadImage('/static/images/simulation/terrains/darkLava.jpg')

  // Obstacles
  images.house = s.loadImage('/static/images/simulation/obstacles/house.png')
  images.stone = s.loadImage('/static/images/simulation/obstacles/stone.png')
  images.marsRock1 = s.loadImage('/static/images/simulation/obstacles/rocheMars1.png')
  images.marsRock2 = s.loadImage('/static/images/simulation/obstacles/rocheMars2.png')
  images.tree = s.loadImage('/static/images/simulation/obstacles/tree.png')
  images.water = s.loadImage('/static/images/simulation/obstacles/water.jpg')
  images.hole = s.loadImage('/static/images/simulation/obstacles/hole.png')
  images.mars_dome = s.loadImage('/static/images/simulation/obstacles/mars_dome.png')
  images.broken_rocket = s.loadImage('/static/images/simulation/obstacles/brokenRocket.png')
  images.black_hole = s.loadImage('/static/images/simulation/obstacles/black_hole.png')
  images.lava = s.loadImage('/static/images/simulation/obstacles/lava.png')
  images.mountains = s.loadImage('/static/images/simulation/obstacles/mountains.png')

  // Interactive
  images.coin = s.loadImage('/static/images/simulation/interactifs/coin.png')
  images.finishLine = s.loadImage('/static/images/simulation/interactifs/finishLine.png')
  images.flag = s.loadImage('/static/images/simulation/interactifs/flag.png')
  images.red_button = s.loadImage('/static/images/simulation/interactifs/red_button_unpressed.png')
  images.green_button = s.loadImage('/static/images/simulation/interactifs/green_button_pressed.png')
  images.treadmill = s.loadImage('/static/images/simulation/interactifs/treadmill.png')
  images.spring = s.loadImage('/static/images/simulation/interactifs/spring.png')
  images.repair_tools = s.loadImage('/static/images/simulation/interactifs/repair_tools.png')

  // Décorations
  images.satelitte = s.loadImage('/static/images/simulation/decorations/satelitte.png')
  images.alien = s.loadImage('/static/images/simulation/decorations/alien.gif')
  images.crack = s.loadImage('/static/images/simulation/decorations/crack.png')
  images.crackHole = s.loadImage('/static/images/simulation/decorations/holeCrack.png')

  images.gazon.delay(10000);
  images.alien.delay(1000000000);*/

/*
  dictImages.carTop = images.carTop;
  dictImages.carTopG = images.carTopG;
  dictImages.carTopD = images.carTopD;

  dictImages.gazon = images.gazon;
  dictImages.grass = images.grass;
  dictImages.mud = images.mud;
  dictImages.road1 = images.road1;
  dictImages.sand = images.sand;
  dictImages.stone = images.stone;
  dictImages.rock = images.rock;
  dictImages.mars_terrain = images.mars_terrain;

  dictImages.tools = images.tools;
  dictImages.animatedCar = images.animatedCar;
  dictImages.house = images.house;
  dictImages.tree = images.tree;
  dictImages.coin = images.coin;
  dictImages.finishLine = images.finishLine;

  dictImages.water = images.water;
  dictImages.lava = images.lava;

  dictImages.hole = images.hole;
  dictImages.crack = images.crack;
  dictImages.crackHole = images.crackHole;

  dictImages.red_button = images.red_button;
  dictImages.green_button = images.green_button;
  dictImages.mars_dome = images.mars_dome;
  dictImages.broken_rocket = images.broken_rocket;
  dictImages.treadmill = images.treadmill;
  dictImages.spring = images.spring;
  dictImages.black_hole = images.black_hole;
  dictImages.tire_tracks = images.tire_tracks;
  dictImages.satelitte = images.satelitte;
  dictImages.alien = images.alien;

  dictImages.darkLava = images.darkLava;
  dictImages.mountains = images.;
  dictImages.repair_tools;

  dictImages.bridge;

  dictImages.marsRock1;
  dictImages.marsRock2;

  dictImages.flag;*/

