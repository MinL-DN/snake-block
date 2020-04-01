// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Game from './Game';
import Utils from './utils/index';
import Pool from './utils/pool';

@ccclass
export default class Block extends cc.Component {

    @property(cc.Label) number: cc.Label = null;

    game: Game

    ctx: cc.Graphics

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.enabled = false;
    }

    init(game: Game) {
        this.enabled = true;
        this.game = game;
        let color = game.colors[Math.floor(Math.random() * game.colors.length)];

        this.ctx = this.getComponent(cc.Graphics);
        this.ctx.roundRect(-73, -73, 146, 146, 15);
        this.ctx.fillColor.fromHEX(color);
        this.ctx.fill();

        this.number.string = (Utils.random(30) + 1).toString();
    }

    start () {

    }

    update (dt) {
        this.node.y = this.node.y - this.game.speed;

        if (this.node.y <= this.game.top * -1) {
            // 删除节点
            Pool.despawn(this.node);
        }
    }
}
