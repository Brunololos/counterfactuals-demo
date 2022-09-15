export let text_style = { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' };

export enum Game_Graphics_Mode {
    Formula,
    Formula_Choice,
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
    context!.drawImage((texture_source as HTMLImageElement), 0, 0);
    (canvas_texture as Phaser.Textures.CanvasTexture).refresh();
}

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

// Code by Matt Blackstone, https://stackoverflow.com/questions/8507885/shift-hue-of-an-rgb-color
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

export function uint8(value) {
  return 0 > value ? 0 : (255 < value ? 255 : Math.round(value));
}

export let Rule_Descriptions  = [
  "You lose!",
  "You win!",
  "The atom is true at the current world",
  "The atom is false at the current world",
  "The negation of the atom is true at the current world",
  "The negation of the atom is false at the current world",

  "Eliminating double negation...",
  "You chose the left formula",
  "You chose the right formula",
  "The attacker chose the left formula",
  "The attacker chose the right formula",

  "You chose a sphere of accessibility",
  "The attacker chose to evaluate the antecedent at the sphere-delimiting world",
  "The attacker chose a world to evaluate the counterfactual at",
  "You claimed that the counterfactual is vacuously true",
  "The attacker chose a world to disprove your vacuous truth claim",

  "The attacker chose a sphere of accessibility",
  "You chose to evaluate the antecedent at the sphere-delimiting world",
  "You chose to evaluate the counterfactual at a world",
  "The attacker claimed that the counterfactual is vacuously true",
  "You chose a world to disprove your vacuous truth claim",

  ""]
