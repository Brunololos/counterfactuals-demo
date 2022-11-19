import Base_Scene from "../util/Base_Scene";

export class Icon_Text {
    private scene: Base_Scene;
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private icons: Phaser.GameObjects.Sprite[] = [];
    private text: Phaser.GameObjects.Text;

    constructor(scene: Base_Scene, x: number, y: number, width: number, height: number, text: string, style) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        let parsed = this.parse_text(text);
        this.text = new Phaser.GameObjects.Text(scene, x, y, parsed, style).setFixedSize(width, height);
        this.text.setWordWrapWidth(width);
    }

    add_to_container(container: Phaser.GameObjects.Container) {
        container.add(this.text);
        for(let i=0; i<this.icons.length; i++) {
            container.add(this.icons[i]);
        }
    }

    static load_sprites(scene: Phaser.Scene) {
        scene.load.image("pilot_text_icon", "assets/text_icons/Pilot_Text_Icon.png");
    }

    private parse_text(text: string): string {
        let parsed = "";
        let xpos = 0;
        let ypos = 0;
        for(let i=0; i<text.length; i++) {
            if(text[i] == ' ') {
                parsed += ' ';
                //xpos = (xpos+7 > this.width) ? xpos = 7 : xpos = (xpos + 7)%this.width;
                if(xpos+7 > this.width) {
                    xpos = 7;
                    ypos += 20;
                } else if(xpos+7 == this.width) {
                    xpos = 0;
                    ypos += 20;
                } else {
                    xpos = (xpos + 7);
                }
                continue;
            }
            if(text[i] != '{') {
                let k=i+1;
                while(k < text.length && text[k] != '{' && text[k] != ' ') {
                    k++;
                }
                let slice = text.slice(i, k);
                let len = slice.length*7;
                if(xpos+len > this.width) {
                    xpos = len;
                    ypos += 20;
                } else if(xpos+len == this.width) {
                    xpos = 0;
                    ypos += 20;
                } else {
                    xpos = (xpos + len);
                }
                parsed += slice;
                i += (slice.length-1);
                continue;
            }

            let j=i+1;
            while(j < text.length && text[j] != '}') {
                j++;
            }
            let icon;
            let code = text.slice(i+1, j);
            switch(code) {
                case "pilot":
                    let newlen = xpos+28;
                    if(newlen >= this.width) {
                        console.log(newlen-this.width)
                        console.log((newlen-this.width)/7)
                        for(let l=1; l*7+xpos<this.width; l++) {
                            parsed += " ";
                        }
                        xpos = 0;
                        ypos += 20;
                    }
                    //icon = new Phaser.GameObjects.Sprite(this.scene, this.x+(i*7)%this.width, this.y+Math.floor((i*7)/this.width/* Add linebreaks */)*20, "pilot");
                    icon = new Phaser.GameObjects.Sprite(this.scene, this.x+xpos, this.y+ypos, "pilot_text_icon");
                    icon.setScale(0.75).setOrigin(0, 0.2).setTint(0x00dd00);
                    this.icons.push(icon);
                    parsed += "      ";
                    xpos += 28;
                    i += 6;
                    break;
                case "copilot":
                    icon = new Phaser.GameObjects.Sprite(this.scene, this.x+xpos, this.y+ypos, "pilot_text_icon");
                    icon.setScale(0.75).setOrigin(0, 0.2).setTint(0xdd0000);
                    this.icons.push(icon);
                    parsed += "      ";
                    xpos += 28;
                    i += 8;
                    break;
                default:
                    console.log("Unknown Code!");
                    break;
            }
        }
        return parsed;
    }
}