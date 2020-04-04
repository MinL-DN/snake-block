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
export default class Play extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    game: Game

    start () {
        // this.collider.node.on(cc.Node.EventType.TOUCH_START, (touch, event) => {
        //     // 返回世界坐标
        //     let touchLoc = touch.getLocation();
        //     // https://docs.cocos.com/creator/api/zh/classes/Intersection.html 检测辅助类
        //     // if (cc.Intersection.pointInPolygon(touchLoc, this.collider.world.points)) {
        //     //     console.log("Hit!");
        //     // } else {
        //     //     console.log("No hit");
        //     // }
        // }, this);

    }

    init(game: Game) {
        this.game = game;
    }

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter (other, self) {
        // this.game.playerLimitNodes.push(other.node);
    }

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit (other, self) {
        // console.log('on collision exit');
        // this.game.playerLimitNodes = this.game.playerLimitNodes.filter(v => v.uuid != other.node.uuid);
    }

    // update (dt) {}
}
