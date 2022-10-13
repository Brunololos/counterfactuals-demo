import Perlin from 'phaser3-rex-plugins/plugins/perlin.js';
import Base_Scene from './Base_Scene';

export let text_style = { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' };

export enum Game_Graphics_Mode {
    Formula,
    Formula_Choice,
    Negated_Formula_Choice,
    Counterfactual_Choice,
    Negated_Counterfactual_Choice,
    World_Choice,
    Transition
}

export enum Graph_Graphics_Mode {
    Display,
    World_Choice
}

export function duplicate_texture(scene: Phaser.Scene, texture_key: string, new_texture_key: string) {
    let texture = scene.game.textures.get(texture_key);
    let texture_source = texture.getSourceImage(texture_key);
    let canvas_texture = scene.game.textures.createCanvas(new_texture_key, texture_source.width, texture_source.height);
    let canvas = canvas_texture.getSourceImage();
    let context = (canvas as HTMLCanvasElement).getContext('2d');
    context!.getContextAttributes().willReadFrequently = true;
    context!.drawImage((texture_source as HTMLImageElement), 0, 0);
    (canvas_texture as Phaser.Textures.CanvasTexture).refresh();
}

export function fill_texture(scene: Phaser.Scene, texture_key: string, color: number) {
    let texture = scene.game.textures.get(texture_key);
    let canvas = texture.getSourceImage(texture_key);
    let context = (canvas as HTMLCanvasElement).getContext('2d');
    context!.getContextAttributes().willReadFrequently = true;
    let image_data = context!.getImageData(0, 0, canvas.width, canvas.height);
    let pixel_array = image_data.data;

    for (let i = 0; i < pixel_array.length / 4; i++) {

        let index = i * 4
        let data = pixel_array;

        let r = ((color & 0xff0000) >> 16);
        let g = ((color & 0x00ff00) >> 8);
        let b = (color & 0x0000ff);

        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
    }
    context!.putImageData(image_data, 0, 0);
    (texture as Phaser.Textures.CanvasTexture).refresh();
}

export function dye_texture(scene: Phaser.Scene, texture_key: string, color: number) {
    let texture = scene.game.textures.get(texture_key);
    let canvas = texture.getSourceImage(texture_key);
    let context = (canvas as HTMLCanvasElement).getContext("2d");
    let image_data = context!.getImageData(0, 0, canvas.width, canvas.height);
    let pixel_array = image_data.data;

    let data = pixel_array;
    for (let i = 0; i < pixel_array.length / 4; i++) {

        let index = i * 4

        let r = ((color & 0xff0000) >> 16);
        let g = ((color & 0x00ff00) >> 8);
        let b = (color & 0x0000ff);

        let hsb = Phaser.Display.Color.RGBToHSV(r, g, b);
        let data_hsb = Phaser.Display.Color.RGBToHSV(data[index], data[index+1], data[index+2]);
        let rgb = Phaser.Display.Color.HSVToRGB(hsb.h, hsb.s, data_hsb.v) as Phaser.Display.Color;

        data[index] = ((rgb.color & 0xff0000) >> 16);
        data[index + 1] =  ((rgb.color & 0x00ff00) >> 8);
        data[index + 2] = (rgb.color & 0x0000ff);
    }
    context!.putImageData(image_data, 0, 0);
    (texture as Phaser.Textures.CanvasTexture).refresh();
}

// Code by Matt Blackstone, https://stackoverflow.com/questions/8507885/shift-hue-of-an-rgb-color
export function hueshift_texture(scene: Phaser.Scene, texture_key: string, delta_hue: number) {
    let texture = scene.game.textures.get(texture_key);
    let canvas = texture.getSourceImage(texture_key);
    let context = (canvas as HTMLCanvasElement).getContext('2d');
    let image_data = context!.getImageData(0, 0, canvas.width, canvas.height);
    let pixel_array = image_data.data;

    for (let i = 0; i < pixel_array.length / 4; i++) {

        let index = i * 4
        let data = pixel_array;

        let r = data[index];
        let g = data[index + 1];
        let b = data[index + 2];

        let result = rotateRGBHue(r, g, b, delta_hue);

        data[index] = result[0];
        data[index + 1] = result[1];
        data[index + 2] = result[2];
    }
    context!.putImageData(image_data, 0, 0);
    (texture as Phaser.Textures.CanvasTexture).refresh();
}

const deg = Math.PI / 180;

export function rotateRGBHue(r, g, b, hue) {
  const cosA = Math.cos(hue * deg);
  const sinA = Math.sin(hue * deg);
  const neo = [
    cosA + (1 - cosA) / 3,
    (1 - cosA) / 3 - Math.sqrt(1 / 3) * sinA,
    (1 - cosA) / 3 + Math.sqrt(1 / 3) * sinA,
  ];
  const result = [
    r * neo[0] + g * neo[1] + b * neo[2],
    r * neo[2] + g * neo[0] + b * neo[1],
    r * neo[1] + g * neo[2] + b * neo[0],
  ];
  return result.map(x => uint8(x));
}

export function dyeRGB(r, g, b, hue) {
  const cosA = Math.cos(hue * deg);
  const sinA = Math.sin(hue * deg);
  const neo = [
    cosA + (1 - cosA) / 3,
    (1 - cosA) / 3 - Math.sqrt(1 / 3) * sinA,
    (1 - cosA) / 3 + Math.sqrt(1 / 3) * sinA,
  ];
  const result = [
    r * neo[0] + g * neo[1] + b * neo[2],
    r * neo[2] + g * neo[0] + b * neo[1],
    r * neo[1] + g * neo[2] + b * neo[0],
  ];
  return result.map(x => uint8(x));
}

export function uint8(value) {
  return 0 > value ? 0 : (255 < value ? 255 : Math.round(value));
}
// End of Code by Matt Blackstone

export function RGB_to_HSB(color: number): number[] {
    return [hue(color), sat(color), bright(color)];
}

export function HSB_to_RGB(hue: number, sat: number, bright: number): number {
  let r, g, b;
  let v = bright;
  let i = Math.floor(hue * 6);
  let f = hue * 6 - i;
  let p = bright * (1 - sat);
  let q = bright * (1 - f * sat);
  let t = bright * (1 - (1 - f) * sat);
  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }
  return ((r * 255) << 16) + ((g * 255) << 8) + (b * 255);
}

export function hue(color: number): number {
    color = (color & 0xffffff);

    let r = ((color & 0xff0000) >> 16) / 0xff;
    let g = ((color & 0x00ff00) >> 8) / 0xff;
    let b = (color & 0x0000ff) / 0xff;

    switch(true) {
      case (r >= g) && (g >= b):
        return 60 * ((g - b)/(r - b));
      case (g > r) && (r >= b):
        return 60 * (2 - (r - b)/(g - b));
      case (g >= b) && (b > r):
        return 60 * (2 + (b - r)/(g - r));
      case (b > g) && (g > r):
        return 60 * (4 - (g - r)/(b - r));
      case (b > r) && (r >= g):
        return 60 * (4 + (r - g)/(b - g));
      case (r >= b) && (b > g):
        return 60 * (6 - (b - g)/(r - g));
    }
    throw new Error("Hue ascertation failed!");
}

/* export function sat(color: number): number {
    color = (color & 0xffffff);

    let r = ((color & 0xff0000) >> 16) / 0xff;
    let g = ((color & 0x00ff00) >> 8) / 0xff;
    let b = (color & 0x0000ff) / 0xff;

    let max = (r >= g) ? r : g;
    max = (b > max) ? b : max;
    
    let min = (r <= g) ? r : g;
    min = (b < min) ? b : min;

    let lum = (max + min)/2;

    switch(true) {
      case lum < 1:
        return (max - min)/(1-Math.abs(2*lum - 1));
      case lum == 1:
        return 0;
    }
    throw new Error("Saturation ascertation failed!");
} */
export function sat(color: number): number {
    color = (color & 0xffffff);

    let r = ((color & 0xff0000) >> 16) / 0xff;
    let g = ((color & 0x00ff00) >> 8) / 0xff;
    let b = (color & 0x0000ff) / 0xff;

    let max = (r >= g) ? r : g;
    max = (b > max) ? b : max;
    
    let min = (r <= g) ? r : g;
    min = (b < min) ? b : min;

    let lum = (max + min)/2;

    return (max == 0) ? 0 : (max - min)/max;
}

export function bright(color: number): number {
  color = (color & 0xffffff);

  let r = ((color & 0xff0000) >> 16) / 0xff;
  let g = ((color & 0x00ff00) >> 8) / 0xff;
  let b = (color & 0x0000ff) / 0xff;

  let max = (r >= g) ? r : g;
  max = (b > max) ? b : max;
  
  let min = (r <= g) ? r : g;
  min = (b < min) ? b : min;

  return max;
}

export function lum(color: number): number {
    color = (color & 0xffffff);

    let r = ((color & 0xff0000) >> 16) / 0xff;
    let g = ((color & 0x00ff00) >> 8) / 0xff;
    let b = (color & 0x0000ff) / 0xff;

    let max = (r >= g) ? r : g;
    max = (b > max) ? b : max;
    
    let min = (r <= g) ? r : g;
    min = (b < min) ? b : min;

    return (max + min)/2;
}

export function create_cosmic_nebula_texture(scene: Phaser.Scene, width: number, height: number, texture_key: string) {
  let canvas_texture = scene.game.textures.createCanvas(texture_key, width, height);
  let canvas = canvas_texture.getSourceImage();
  let context = (canvas as HTMLCanvasElement).getContext('2d');
  context!.getContextAttributes().willReadFrequently = true;
  let image_data = context!.getImageData(0, 0, canvas.width, canvas.height);
  let pixel_array = image_data.data;

  let noise = new Perlin(Math.random());

  let div = (((width*width  + height*height)/9)/4);

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let x = j * 4;
      let y = i * width * 4;
      let index = x + y;

      let data = pixel_array;

      let r = 0;
      let g = 0;
      let b = 0;
      /* for(let k=0; k<8; k++) {
        r += (noise.perlin3(j/width, i/height, k/8)+1)*16;
        g += (noise.perlin3((j+25)/width, i/height, k/8)+1)*16;
        b += (noise.perlin3((j-25)/width, i/height, k/8)+1)*16;
      } */
      let x_dist = Math.abs(width/2 - j);
      let y_dist = Math.abs(height/2 - i);
      let center_dist;
      /* center_dist = Math.sqrt((x_dist*x_dist)/4 + (y_dist*y_dist)/4);
      center_dist = Math.sqrt((x_dist*x_dist)/4 + (y_dist*y_dist)/4)         / Math.sqrt(((width/2)*(width/2))/4 + ((height/2)*(height/2))/4);
      center_dist = ((x_dist*x_dist + y_dist*y_dist)/4)        / (((width/2)*(width/2) + (height/2)*(height/2))/4);
      center_dist = 1 - ((x_dist*x_dist + y_dist*y_dist)/4) / (((width/3)*(width/3) + (height/3)*(height/3))/4);
      center_dist = 1 - ((x_dist*x_dist + y_dist*y_dist)/4) / (((width*width  + height*height)/9)/4); */
      center_dist = 1 - ((x_dist*x_dist + y_dist*y_dist)/4) / div;
      r = 64 + (noise.perlin2(j/width, i/height)+1)*63 + 64*center_dist;
      g = 64 + (noise.perlin2((j+25)/width, i/height)+1)*64 + 64*center_dist;
      b = 64 + (noise.perlin2((j-25)/width, i/height)+1)*64 + 64*center_dist;
      /* r = (noise.perlin2(j/width, i/height)+1)*128;
      g = (noise.perlin2((j+25)/width, i/height)+1)*128;
      b = (noise.perlin2((j-25)/width, i/height)+1)*128; */

      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = 255;
    }
  }
  context!.putImageData(image_data, 0, 0);
  (canvas_texture as Phaser.Textures.CanvasTexture).refresh();
}

export function create_point_geometry_mask(scene: Base_Scene, x: number, y: number, texture_key: string): Phaser.Display.Masks.GeometryMask {
  let texture = scene.game.textures.get(texture_key);
  let texture_source = texture.getSourceImage(texture_key);
  let width = texture_source.width;
  let height = texture_source.height;

  let graphics = new Phaser.GameObjects.Graphics(scene).translateCanvas(x - width/2, y - height/2);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if(scene.game.textures.getPixelAlpha(j, i, texture_key) != 0) {
        graphics.fillPoint(j, i);
      }
    }
  }
  return graphics.createGeometryMask();
}

export function create_shape_geometry_mask(scene: Base_Scene, x: number, y: number, width: number, height: number, path: [number, number][][]): Phaser.Display.Masks.GeometryMask {

  let graphics = new Phaser.GameObjects.Graphics(scene).translateCanvas(x - width/2, y - height/2);
  for(let s=0; s<path.length; s++) {
    graphics.beginPath();
    graphics.moveTo(path[s][0][0], path[s][0][1]);
    for(let i=1; i<path[s].length; i++) {
      graphics.lineTo(path[s][i][0], path[s][i][1]);
    }
    graphics.lineTo(path[s][0][0], path[s][0][1]);
    graphics.closePath();
    graphics.fillPath();
  }
  return graphics.createGeometryMask();
}

export let Rule_Descriptions : string[] = [
  "You lose!",
  "You win!",
  "Resolving negated Untruth...",
  "Resolving negated Truth...",
  "The atom is true at the current world",
  "The atom is false at the current world",
  "The atom is true at the current world",
  "The atom is false at the current world",

  "Eliminating double negation...",
  "You chose the left formula",
  "You chose the right formula",
  "The attacker chose the left formula",
  "The attacker chose the right formula",
  "The attacker chose the left formula",
  "The attacker chose the right formula",
  "You chose the left formula",
  "You chose the right formula",

  "You chose to choose a sphere of accessibility",
  "The attacker chose to evaluate the sphere-delimiting world", /* "The attacker chose to evaluate the antecedent at the sphere-delimiting world", */
  "The attacker chose a world to evaluate the counterfactual at",
  "You claimed that the counterfactual is vacuously true",
  "The attacker chose a world to disprove your vacuous truth claim",

  "The attacker chose a sphere of accessibility",
  "You chose to evaluate the sphere-delimiting world", /* "You chose to evaluate the antecedent at the sphere-delimiting world", */
  "You chose to evaluate the counterfactual at a world",
  "The attacker claimed that the counterfactual is vacuously true",
  "You chose a world to disprove the attackers vacuous truth claim",

  ""];

/**
 * Clipping shapes
 */
export let banner_mask_path : [number, number][][] = 
  [[[29, 97], [57, 50], [80, 50], [95, 35], [196, 35], [225, 20], [674, 20], [703, 35], [804, 35], [819, 50], [842, 50], [870, 97],
  [870, 101], [843, 147], [820, 147], [803, 164], [96, 164], [79, 147], [57, 147], [29, 101]],
  [[140, 170], [759, 170], [749, 180], [150, 180]]];
