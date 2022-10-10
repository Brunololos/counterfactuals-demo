import Base_Scene from "../util/Base_Scene";
import Game_Scene from "./Game";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class Level_Select_Scene extends Base_Scene {

  constructor() {
    super('Level_Select_Scene');
  }

  preload() {
    this.load.image("rocket_launch", "assets/Rocket_Launch.jpg");
    this.load.image("back", "assets/Slant.png");
    this.load.image("chunk_up", "assets/Chunk.png");
    this.load.image("chunk_down", "assets/Chunk_Down.png");
    this.load.image("chunk_down_hover", "assets/Chunk_Down_Hover.png");
  }

  create() {
    let w = this.get_width();
    let h = this.get_height();

    this.add.existing(new Phaser.GameObjects.Sprite(this, w/2, h/2, "rocket_launch").setDisplaySize(w, h).setAlpha(0.5));

    var levels = [
        { name: 'Disjunction' },
        { name: 'Conjunction 1' },
        { name: 'Conjunction 2' },
        { name: 'Counterfactual 1' },
        { name: 'Counterfactual 2' },
        { name: 'Test' },
    ];

    var gridTable = this.create_grid_table(this, w/2, h/2, 760, 400, levels);
  }

  update(time: number, delta: number) {
    
  }

  on_resize(): void {
      
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

            // Set properties from item value
            cellContainer!.setMinSize(240, 120); // Size might changed in this demo
            cellContainer!.getElement('background').setTint(0xcccccc);
            cellContainer!.getElement('text').setText(levels[item.id].name);
            cellContainer!.getElement('icon').setFillStyle(item.color); // Set fill color of round rectangle object
            return cellContainer;
        },
        items: this.create_items(6)
    }).layout()

    grid_table
        .on('cell.over', function (cellContainer, cellIndex, pointer) {
            cellContainer.getElement('background').clearTint()
            /* cellContainer.getElement('background').setVisible(false)
            cellContainer.background = this.add.existing(new Phaser.GameObjects.Sprite(this, 0, 0, "chunk_down_hover")) */
            /* cellContainer.background = this.add.existing(new Phaser.GameObjects.Sprite(this, 0, 0, "chunk_up"));
            gridTable.layout(); */
        }, this)
        .on('cell.out', function (cellContainer, cellIndex, pointer) {
            cellContainer.getElement('background').setTint(0xcccccc)
        }, this)
        .on('cell.click', function (cellContainer, cellIndex, pointer) {
            this.scene.start('Game_Scene', { level: this.swap_xy(cellIndex) });
        
        }, this)
    return grid_table;
  }

    create_button(scene, level) {
        var button = scene.rexUI.add.label({
            width: 240,
            height: 120,

            orientation: 0,
            background: scene.add.existing(new Phaser.GameObjects.Sprite(scene, 0, 0, "chunk_down")),

            icon: scene.rexUI.add.roundRectangle(0, 0, 5, 5, 5, 0xffffff, 0x0),
            text: scene.add.text(0, 0, level.name),

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
                id: this.swap_xy(i),
                color: 0xffffff,
            } as never /* TODO: Why need be never type???? */);
        }
        return data;
    }

    swap_xy(index: number): number {
        return (index % 2)*2 + Math.ceil(index/2);
    }
}