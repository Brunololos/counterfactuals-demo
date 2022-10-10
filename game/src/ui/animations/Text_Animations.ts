export enum Text_Animation {
    NONE,
    PULSE
}

export class Text_Animations {
    static fill_text_animation_timeline(timeline: Phaser.Tweens.Timeline, t: Phaser.GameObjects.Text, type: Text_Animation) {
        switch(type) {
            case Text_Animation.PULSE:
                timeline.add({ /* SCALE UP CAPTION */
                    targets: t,
                    scale: 1.125,
                    duration: 1000,
                    ease: 'Cubic.In',
                    yoyo: false,
                    repeat: 0,
                    offset: 0,
                });
                timeline.add({ /* SCALE DOWN CAPTION */
                    targets: t,
                    scale: 1,
                    duration: 1000,
                    ease: 'Cubic.Out',
                    yoyo: false,
                    repeat: 0,
                    offset: 1000
                });
                break;
        }
    }
}