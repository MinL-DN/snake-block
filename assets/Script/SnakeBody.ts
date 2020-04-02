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
export default class SnakeBody extends cc.Component {

    @property(cc.Label) label: cc.Label = null;

    @property text: string = 'hello';

    game: Game

    touchList = [];
    touchStart = [];

    moveFlag = null; // 0 可移动 1、不可左移 2、不可右移

    // LIFE-CYCLE CALLBACKS:

    init(game: Game) {
        this.game = game;
    }

    onLoad() {

        this.enabled = false;

        let touchReceiver = cc.Canvas.instance.node;
        // touchReceiver.on('touchstart', this.onTouchStart, this);
        touchReceiver.on('touchmove', this.onTouchMove, this);
        // touchReceiver.on('touchend', this.onTouchEnd, this);
    }

    onTouchMove (event) {

        let moveD = event.getPreviousLocation().x - event.getLocation().x; // moveD > 0 左移否则右移
        let key = moveD > 0 ? 'playerLimitLeft' : 'playerLimitRight'

        this.node.x = this.node.x - moveD;
        let playerPos = Utils.getPosMinMax(this.node);

        if (this.game.playerLimitLeft) {
            let pos = Utils.getPosMinMax(this.game.playerLimitLeft);
            if (playerPos.xMin < pos.xMax) {
                this.node.x = pos.xMax + this.node.width / 2;
            }
        } else if (this.game.playerLimitRight) {
            let pos = Utils.getPosMinMax(this.game.playerLimitRight);
            if (playerPos.xMax > pos.xMin) {
                this.node.x = pos.xMin - this.node.width / 2;
            }
        }

        // 限制不要超出边界
        if (this.node.x > (this.node.parent.width - this.node.width) / 2) {
            this.node.x = (this.node.parent.width - this.node.width) / 2;
        } else if (this.node.x < (this.node.parent.width - this.node.width) / -2) {
            this.node.x = (this.node.parent.width - this.node.width) / -2;
        }
    }

    start(){
    }

    // /**
    //  * 当碰撞产生的时候调用
    //  * @param  {Collider} other 产生碰撞的另一个碰撞组件
    //  * @param  {Collider} self  产生碰撞的自身的碰撞组件
    //  */
    // onCollisionEnter (other, self) {
    //     // console.log('on collision enter');O

    //     // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
    //     var world = self.world;

    //     // 碰撞组件的 aabb 碰撞框
    //     var aabb = world.aabb;

    //     // 节点碰撞前上一帧 aabb 碰撞框的位置
    //     var preAabb = world.preAabb;

    //     // 碰撞框的世界矩阵
    //     var t = world.transform;

    //     // 以下属性为圆形碰撞组件特有属性
    //     var r = world.radius;
    //     var p = world.position;

    //     // 以下属性为 矩形 和 多边形 碰撞组件特有属性
    //     var ps = world.points;

    //     // if (self.world.aabb.yMax > other.world.aabb.yMin && ps == 1) { // 顶部碰撞到物体
    //     //     console.log('顶部碰撞到物体');
    //     // } else if ( // 左侧碰撞到物体
    //     //     self.world.aabb.xMin < other.world.aabb.xMax &&
    //     //     self.world.aabb.xMax > other.world.aabb.xMax
    //     // ) {
    //     //     console.log('左侧碰撞到物体');
    //     //     // this.moveFlag = 1;
    //     //     self.node.x = other.node.x + (other.node.width + self.node.width) / 2;
    //     //     this.moveFlag = self.node.x;
    //     // } else if ( // 右侧碰撞到物体
    //     //     self.world.aabb.xMax > other.world.aabb.xMin &&
    //     //     self.world.aabb.xMin < other.world.aabb.xMin
    //     // ) {
    //     //     console.log('右侧碰撞到物体');
    //     //     // this.moveFlag = 2;
    //     //     self.node.x = other.node.x - (other.node.width + self.node.width) / 2;
    //     //     this.moveFlag = self.node.x;
    //     // } else {
    //     //     console.log('1234');
    //     // }

    //     // if (other.node.name == 'wall-prefab') {
    //     //     this.moveFlagLeft = false;
    //     // }
    // }

    // /**
    //  * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
    //  * @param  {Collider} other 产生碰撞的另一个碰撞组件
    //  * @param  {Collider} self  产生碰撞的自身的碰撞组件
    //  */
    // onCollisionStay (other, self) {
    //     // console.log('on collision stay');
    // }

    // /**
    //  * 当碰撞结束后调用
    //  * @param  {Collider} other 产生碰撞的另一个碰撞组件
    //  * @param  {Collider} self  产生碰撞的自身的碰撞组件
    //  */
    // onCollisionExit (other, self) {
    //     // console.log('on collision exit');
    //     // this.moveFlag = 0;

    //     // if (other.node.name == 'wall-prefab') {
    //     //     this.moveFlag = 0;
    //     // }
    //     this.moveFlag = null;
    // }

    // update (dt) {}
}
