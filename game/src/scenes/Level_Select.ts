import { wrap } from "module";
import { levels } from "../game/levels/Levels";
import Base_Scene from "../util/Base_Scene";
import Game_Scene from "./Game";

export default class Level_Select_Scene extends Base_Scene {
    private rocket_launch;
    private back;

    constructor() {
        super('Level_Select_Scene');
    }

    preload() {
        this.load.image("rocket_launch", "assets/Rocket_Launch.jpg");
        this.load.image("back", "assets/Slant.png");
        this.load.image("chunk_up", "assets/Chunk.png");
        this.load.image("back_icon", "assets/Back_Icon.png");
    }

    create() {
        let w = this.get_width();
        let h = this.get_height();

        this.back = this.create_back(this, 25, 30);

        this.rocket_launch = new Phaser.GameObjects.Sprite(this, w/2, h/2, "rocket_launch").setDisplaySize(w, h).setAlpha(0.5);
        this.add.existing(this.rocket_launch);
        
        var gridTable = this.create_grid_table(this, w/2, h/2, 760, 640, levels);

        const resize = () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            this.on_resize();
        }    
        window.addEventListener("resize", resize, false);
    }

    update(time: number, delta: number) {
        
    }

    on_resize(): void {
        let w = this.get_width();
        let h = this.get_height();
        this.rocket_launch.setPosition(w/2, h/2);
        this.rocket_launch.setDisplaySize(w, h);
    }

    create_grid_table(scene: Phaser.Scene, x: number, y: number, w: number, h: number, levels) {
        var grid_table = this.rexUI.add.gridTable({
            x: x,//w/2,
            y: y,//h/2,
            width: w,//760,
            height: h,//400,

            scrollMode: 0, // 0:vertical, 1:horizontal

            table: {
                cellWidth: 480, //TODO: doubled width so it fits the starting screen
                cellHeight: 120,

                columns: 2,

                mask: {
                    padding: 2,
                },

                reuseCellContainer: true,
            },

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,

                table: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                },
                header: 10,
                footer: 10,
            },

            createCellContainerCallback: function (cell, cellContainer) {
                var scene = cell.scene,
                    width = cell.width,
                    height = cell.height,
                    item = cell.item,
                    index = cell.index;
                if (cellContainer === null) {
                    cellContainer = scene.create_button(scene, levels[index]);
                }

                let name = levels[item.id].name;
                let wrapindex = name.indexOf(" ") + 1;
                if(wrapindex == 0) { wrapindex == 16; }

                // Set properties from item value
                cellContainer!.setMinSize(240, 120); // Size might changed in this demo
                //cellContainer!.getElement('background').setTint(0xcccccc);
                cellContainer!.getElement('text').setText((name.length <= 16) ? name : name.slice(0, wrapindex) + "\n" + name.slice(wrapindex));
                //cellContainer!.getElement('icon').setFillStyle(item.color); // Set fill color of round rectangle object
                return cellContainer;
            },
            items: this.create_items(levels.length)
        }).layout()

        grid_table
            .on('cell.over', function (cellContainer, cellIndex, pointer) {
                //cellContainer.getElement('background').clearTint();
                cellContainer.getElement('background').setTexture("chunk_down_hover");
                /* cellContainer.getElement('background').setVisible(false);
                cellContainer.background = this.add.existing(new Phaser.GameObjects.Sprite(this, 0, 0, "chunk_down_hover")) */
                /* cellContainer.background = this.add.existing(new Phaser.GameObjects.Sprite(this, 0, 0, "chunk_up"));
                gridTable.layout(); */
            }, this)
            .on('cell.out', function (cellContainer, cellIndex, pointer) {
                //cellContainer.getElement('background').setTint(0xcccccc);
                cellContainer.getElement('background').setTexture("chunk_down");
            }, this)
            .on('cell.click', function (cellContainer, cellIndex, pointer) {
                //this.scene.start('Game_Scene', { level: this.swap_xy(cellIndex, 2, Math.ceil(levels.length/2)) });
                this.scene.start('Game_Scene', { level: cellIndex });
            
            }, this)
        return grid_table;
    }

    create_button(scene, level) {
        let wrapindex = level.name.indexOf(" ") + 1;
        if(wrapindex == 0) { wrapindex == 16; }
        var button = scene.rexUI.add.label({
            width: 240,
            height: 120,

            orientation: 0,
            background: scene.add.existing(new Phaser.GameObjects.Sprite(scene, 0, 0, "chunk_down")),

            icon: scene.add.existing(new Phaser.GameObjects.Sprite(scene, 0, 0, "dot")),//scene.rexUI.add.roundRectangle(0, 0, 5, 5, 5, 0xffffff, 0x0),
            text: (level.name.length <= 16) ? scene.add.text(0, 0, level.name) : scene.add.text(0, 0, level.name.slice(0, wrapindex) + "\n" + level.name.slice(wrapindex)),

            space: {
                icon: 10,
                left: 25,
                right: 0,
                top: 0,
                bottom: 20,
            }
        });

        return button;
    }

    create_items(count: number) {
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({
                //id: this.swap_xy(i, 2, Math.ceil(count/2)),
                id: i,
                color: 0xffffff,
            } as never /* TODO: Why need be never type???? */);
        }
        return data;
    }

    swap_xy(index: number, width: number, height: number): number {
        return (index % width)*(height-1) + Math.ceil(index/width);
    }

    private create_back(scene: Base_Scene, x, y) {
        var button = scene.rexUI.add.label({
            width: 60,
            height: 60,

            orientation: 0,

            icon: scene.add.existing(new Phaser.GameObjects.Sprite(scene, 0, 0, "back_icon").setDisplaySize(40, 40).setAlpha(0.6)),

            space: {
                icon: 10,
                left: 15,
                right: 0,
                top: 0,
                bottom: 0,
            }
        }).layout();

        var buttons = scene.rexUI.add.buttons({
            x: x,
            y: y,
            buttons: [],
        })
        .addButton(button)
        .layout();

        buttons.on('button.over', function(button, index, pointer, event) {
            button.getElement('icon').setAlpha(1);
        })
        buttons.on('button.out', function(button, index, pointer, event) {
            button.getElement('icon').setAlpha(0.6);
        })
        buttons.on('button.click', function(button, index, pointer, event) {
            scene.scene.start('Main_Menu_Scene');
        })

        return buttons;
    }

}