import Perlin from 'phaser3-rex-plugins/plugins/perlin.js';
import { Rule, Rules } from '../game/Game_Rules';
import Base_Scene from './Base_Scene';

export let text_style = {
  fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
  wordWrap: {
    width: 1000
  },
  maxLines: 3
};

export enum Game_Graphics_Mode {
    Formula,
    Formula_Choice,
    Possibility_World_Choice,
    Necessity_World_Choice,
    Sphere_Selection,
    Counterfactual_World_Choice,
    Vacuous_World_Choice,
    Transition
}

export enum Graph_Graphics_Mode {
    Display,
    World_Choice,
    Might_World_Choice,
    Would_World_Choice
}

export function is_world_choice(mode: Game_Graphics_Mode): boolean {
  switch(mode) {
    case Game_Graphics_Mode.Possibility_World_Choice:
    case Game_Graphics_Mode.Necessity_World_Choice:
    case Game_Graphics_Mode.Sphere_Selection:
    case Game_Graphics_Mode.Counterfactual_World_Choice:
    case Game_Graphics_Mode.Vacuous_World_Choice:
      return true;
    default:
      return false;
  }
}

export function world_choice_moves_to_mode(moves: Rule[]): Game_Graphics_Mode {
  switch(true) {
    case moves.some((value) => value.get_name() == Rules.Defender_Possibility):
    case moves.some((value) => value.get_name() == Rules.Attacker_Necessity):
      return Game_Graphics_Mode.Possibility_World_Choice;
    case moves.some((value) => value.get_name() == Rules.Defender_Might_Sphere_Selection):
    case moves.some((value) => value.get_name() == Rules.Defender_Would_Sphere_Selection):
    //case moves.some((value) => value.get_name() == Rules.Attacker_Might_Sphere_Selection):
      return Game_Graphics_Mode.Sphere_Selection;
    case moves.some((value) => value.get_name() == Rules.Defender_Might_Closer_Phi_World):
    case moves.some((value) => value.get_name() == Rules.Defender_Might_Target_Evaluation):
    case moves.some((value) => value.get_name() == Rules.Defender_Would_Closer_Phi_World):
    case moves.some((value) => value.get_name() == Rules.Defender_Would_Target_Evaluation):
      return Game_Graphics_Mode.Counterfactual_World_Choice;
    default:
      throw new Error("Rules don't map to any world choice!");
  }
}

export function interpolate_colors(color1: number, color2: number, frac: number) {
  if(frac < 0 || frac > 1) { return; }

  let source = Phaser.Display.Color.IntegerToColor(color1);
  let dest = Phaser.Display.Color.IntegerToColor(color2);

  let color = new Phaser.Display.Color(
    source.red + (dest.red - source.red) * frac,
    source.green + (dest.green - source.green) * frac,
    source.blue + (dest.blue - source.blue) * frac,
    source.alpha + (dest.alpha - source.alpha) * frac
  );
  return color.color32;
  /* let r1 = color1 >> 16;
  let r2 = color2 >> 16;
  let g1 = (color1 & 0x00ff00) >> 8;
  let g2 = (color2 & 0x00ff00) >> 8;
  let b1 = color1 & 0x0000ff;
  let b2 = color2 & 0x0000ff;

  let r = r1 + (r2 - r1) * frac;
  let g = g1 + (g2 - g1) * frac;
  let b = b1 + (b2 - b1) * frac;
  return r << 16 + g << 8 + b; */
}

export function duplicate_texture(scene: Phaser.Scene, texture_key: string, new_texture_key: string) {
    let texture = scene.game.textures.get(texture_key);
    let texture_source = texture.getSourceImage(texture_key);
    let canvas_texture = scene.game.textures.createCanvas(new_texture_key, texture_source.width, texture_source.height);
    let canvas = canvas_texture.getSourceImage();
    let context = (canvas as HTMLCanvasElement).getContext('2d');
    //context!.getContextAttributes().willReadFrequently = true;
    context!.drawImage((texture_source as HTMLImageElement), 0, 0);
    (canvas_texture as Phaser.Textures.CanvasTexture).refresh();
}

export function fill_texture(scene: Phaser.Scene, texture_key: string, color: number) {
    let texture = scene.game.textures.get(texture_key);
    let canvas = texture.getSourceImage(texture_key);
    let context = (canvas as HTMLCanvasElement).getContext('2d');
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

export function RGB_to_HSB(color: number): number[] {
    return [hue(color), sat(color), bright(color)];
}

export function HSB_to_RGB(hue: number, sat: number, bright: number): number {
  let r=0, g=0, b=0;
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
      r = 24 /* 64 */ + (noise.perlin2(j/width, i/height)+1)*63 + 64*center_dist;
      g = 24 /* 64 */ + (noise.perlin2((j+25)/width, i/height)+1)*64 + 64*center_dist;
      b = 24 /* 64 */ + (noise.perlin2((j-25)/width, i/height)+1)*64 + 64*center_dist;
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

export function linebreaks(text: string): number {
  let n = 0;
  for(let i=0; i<text.length; i++) {
    if(text[i] == '\n') { n++; }
  }
  return n;
}

export function describe_move(move: Rule): string {
  switch(move.get_name()) {
    // TODO: need a special description for jumping in place
    default:
      return Rule_Descriptions[move.get_name()];
  }
}

export let Rule_Descriptions : string[] = [
  "You lose!",
  "You win!",
  /* "You win!",
  "You lose!", */

  "Your copilot landed",
  "You landed",
  "Your copilot stranded",
  "You stranded",

  "The world is habitable",
  "The world is habitable",
  "The world is uninhabitable",
  "The world is uninhabitable",
  /* "The atom is true at the current world",
  "The atom is true at the current world",
  "The atom is false at the current world",
  "The atom is false at the current world", */

  "Your shift begins", // TODO: Maybe better description of Pilot/Copilot shifts starting & ending
  "Your shift ends",

  "The copilot chose the left instructions",
  "The copilot chose the right instructions",
  "You chose the left instructions",
  "You chose the right instructions",

  "You took over chose the left instructions",
  "You took over chose the right instructions",
  "The copilot took over and chose the left instructions",
  "The copilot took over chose the right instructions",

  /* "The attacker chose the left formula",
  "The attacker chose the right formula",
  "You chose the left formula",
  "You chose the right formula",
  "The attacker chose the left formula",
  "The attacker chose the right formula",
  "You chose the left formula",
  "You chose the right formula", */

  "The copilot jumped to a world",
  "The copilot couldn't jump to a world",
  "You jumped to a world",
  "You couldn't jump to a world",
  "You took over and jumped to a world",
  "The copilot couldn't jump to a world",
  "The copilot took over and jumped to a world",
  "You couldn't jump to a world",
  /* "The attacker chose a world",
  "The attacker couldn't chose a world",
  "You chose a world",
  "You couldn't chose a world",
  "You chose a world",
  "You couldn't chose a world",
  "The attacker chose a world",
  "The attacker couldn't chose a world", */

  "The copilot limited the ships jump-range",
  "The jump-drive malfunctioned", // No worlds to jump to
  "You took over and jumped to the limit-world",
  "You took over and jumped to a closer world",
  "You limited the ships jump-range",
  "The jump-drive malfunctioned", // No worlds to jump to
  "The copilot took over and jumped to the limit-world",
  "The copilot took over and jumped to a closer world",

  "The copilot took over and limited the ships jump-range",
  "The jump-drive malfunctioned while the copilot took over", // No worlds to jump to
  "You jumped to the limit-world",
  "You jumped to a closer world",
  "You took over and limited the ships jump-range",
  "The jump-drive malfunctioned while you took over", // No worlds to jump to
  "The copilot jumped to the limit-world",
  "The copilot jumped to a closer world",
  /* "You chose a sphere of accessibility",
  "The attacker chose to evaluate the sphere-delimiting world", //"The attacker chose to evaluate the antecedent at the sphere-delimiting world",
  "The attacker chose a world to evaluate the counterfactual at",
  "You claimed that the counterfactual is vacuously true",
  "The attacker chose a world to disprove your vacuous truth claim",

  "The attacker chose a sphere of accessibility",
  "You chose to evaluate the sphere-delimiting world", //"You chose to evaluate the antecedent at the sphere-delimiting world",
  "You chose to evaluate the counterfactual at a world",
  "The attacker claimed that the counterfactual is vacuously true",
  "You chose a world to disprove the attackers vacuous truth claim", */

  ""];

/**
 * Clipping shapes
 */
export let banner_mask_path : [number, number][][] = 
  [[[29, 97], [57, 50], [80, 50], [95, 35], [196, 35], [225, 20], [674, 20], [703, 35], [804, 35], [819, 50], [842, 50], [870, 97],
  [870, 101], [843, 147], [820, 147], [803, 164], [96, 164], [79, 147], [57, 147], [29, 101]],
  [[140, 170], [759, 170], [749, 180], [150, 180]]];
