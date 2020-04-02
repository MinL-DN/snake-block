// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import Game from './Game';
import Utils from './utils/index';

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
        // console.log('on collision enter');

        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = self.world;

        // 碰撞组件的 aabb 碰撞框
        var aabb = world.aabb;

        // 节点碰撞前上一帧 aabb 碰撞框的位置
        var preAabb = world.preAabb;

        // 碰撞框的世界矩阵
        var t = world.transform;

        // 以下属性为圆形碰撞组件特有属性
        var r = world.radius;
        var p = world.position;

        // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        var ps = world.points;

        this.game.player;

        let playerPos = Utils.getPosMinMax(this.game.player);
        let otherPos = Utils.getPosMinMax(other.node);

        if (playerPos.xMax <= otherPos.xMin) { // 目标物体在右侧
            if (!this.game.playerLimitRight) {
                this.game.playerLimitRight = other.node;
            } else {
                let rightPos = Utils.getPosMinMax(this.game.playerLimitRight);
                if (otherPos.xMin <= rightPos.xMin) {
                    this.game.playerLimitRight = other.node;
                }
            }
        } else if (playerPos.xMin >= otherPos.xMax) { // 目标物体在右侧
            if (!this.game.playerLimitLeft) {
                this.game.playerLimitLeft = other.node;
            } else {
                let leftPos = Utils.getPosMinMax(this.game.playerLimitLeft);
                if (otherPos.xMax >= leftPos.xMax) {
                    this.game.playerLimitLeft = other.node;
                }
            }
        } else {
            console.log('物体在正头');
        }
    }

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit (other, self) {
        // console.log('on collision exit');
        if (this.game.playerLimitRight && other.node.uuid == this.game.playerLimitRight.uuid) {
            this.game.playerLimitRight = null;
        } else if (this.game.playerLimitLeft && other.node.uuid == this.game.playerLimitLeft.uuid) {
            this.game.playerLimitLeft = null;
        }
    }

    // update (dt) {}
}
