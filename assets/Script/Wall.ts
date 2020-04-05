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
export default class Wall extends cc.Component {

    // @property(cc.Label) label: cc.Label = null;

    game: Game

    ctx: cc.Graphics

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.enabled = false;
    }

    init(game: Game) {
        this.enabled = true;
        this.game = game;

        let width = this.node.width;
        let height = game.blockSize + 10;

        // 清除预制资源画面
        if (this.ctx) this.ctx.clear();
        this.ctx = this.getComponent(cc.Graphics);
        this.ctx.roundRect(width / -2, height / -2, width, height, 4);
        this.ctx.fillColor = cc.Color.WHITE;
        this.ctx.fill();
        this.node.getComponent(cc.BoxCollider).size.height = height;
        this.node.height = height;
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
