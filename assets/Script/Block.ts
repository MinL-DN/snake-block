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

    onLoad () {
        this.enabled = false;
    }

    init(game: Game) {
        this.enabled = true;
        this.game = game;
        let random = Utils.random(this.game.maxBlockScore);
        this.number.string = (random + 1).toString();

        let color = game.colors[random];

        if (this.ctx) this.ctx.clear();
        this.ctx = this.getComponent(cc.Graphics);
        this.ctx.roundRect(-73, -73, 146, 146, 15);
        this.ctx.fillColor.fromHEX(color);
        this.ctx.fill();
    }

    start () {

    }

    update (dt) {

        if (this.game.hitBlock) return;

        this.node.y = this.node.y - this.game.speed;

        if (this.node.y <= this.game.top * -1) {
            // 删除节点
            Pool.despawn(this.node);
        }
    }
}
