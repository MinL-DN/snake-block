// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import Utils from './utils/index';
import Pool from './utils/pool';
import Game from './Game';

@ccclass
export default class Player extends cc.Component {

    // @property(cc.Prefab) snakeBodyPrefab: cc.Prefab = null

    game: Game
    len = 10
    moveDistance = 0

    header: cc.Node
    tracking = [[0, 0]]

    playerLimitNodes: cc.Node[] = []

    // onLoad () {}

    init(game: Game) {
        this.game = game;
        let touchReceiver = cc.Canvas.instance.node;
        touchReceiver.on('touchmove', this.onTouchMove, this);
        touchReceiver.on('touchend', this.onTouchEnd, this);

        for (let index = 0; index < this.len; index++) {
            this.spwanNewSnake(index);
        }
    }
    start () {
    }

    spwanNewSnake(index) {
        let newSnake = Pool.spawnNewNode(this.game.snakeBodyPrefab);
        this.game.node.addChild(newSnake);
        newSnake.setPosition(0, 0);
        newSnake.getComponent('SnakeBody').init(this);
        newSnake.index = index;

        if (index == 0) {
            this.header = newSnake;
        }
    }

    onTouchMove(event) {

        this.moveDistance = event.getPreviousLocation().x - event.getLocation().x; // moveDistance > 0 左移否则右移
        let nextPos = {
            xMin: this.header.x - this.header.width / 2 - this.moveDistance,
            xMax: this.header.x + this.header.width / 2 - this.moveDistance
        }

        // 碰撞物体逻辑
        this.playerLimitNodes.forEach(v => {
            let limitPos = Utils.getPosMinMax(v);

            if (this.moveDistance > 0) { // 向左移动的
                if (this.header.x > v.x) { // 障碍物在左边
                    if (nextPos.xMin < limitPos.xMax) {
                        this.moveDistance = this.moveDistance + nextPos.xMin - limitPos.xMax;
                    }
                }
            } else if (this.moveDistance < 0) { // 向右移动的
                if (this.header.x < v.x) { // 障碍物在右边
                    if (nextPos.xMax > limitPos.xMin) {
                        this.moveDistance = this.moveDistance + nextPos.xMax - limitPos.xMin;
                    }
                }
            }

            // if (pos.xMin >= preMinMax.xMax) {
            //     if (this.moveDistance < 0 && preMinMax.xMax > pos.xMin) {
            //         preMinMax
            //     }
            // } else if (pos.xMax <= preMinMax.xMin) {
            //     if (this.moveDistance > 0 && preMinMax.xMin < pos.xMax) {
            //         preMinMax
            //     }
            // } else {
            //     if (v.x > this.node.x) { // 夹缝中
            //         preMinMax
            //     } else {
            //         preMinMax
            //     }
            // }
        });
    }

    onTouchEnd(event?) {
        this.moveDistance = 0;
    }

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter (other, self) {
        this.playerLimitNodes.push(other.node);

        let minMax = Utils.getPosMinMax(other.node);
        let playerMinMax = Utils.getPosMinMax(this.header);

        if (other.node.name == 'block-prefab') {
            if (
                playerMinMax.xMin > minMax.xMin &&
                playerMinMax.xMax < minMax.xMax
            ) {
                console.log('撞墙啦！' + other.node.getComponent('Block').number.string);
                this.game.hitBlock = other.node;
                setTimeout(() => {
                    this.game.hitBlock = false;
                }, other.node.getComponent('Block').number.string * 10)
            }
        }

    }

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit (other, self) {
        // console.log('on collision exit');
        this.playerLimitNodes = this.playerLimitNodes.filter(v => v.uuid != other.node.uuid);
    }

    update() {

        if (!this.header) return;

        let x = this.header.x - this.moveDistance;
        let y = this.game.distance;

        if (x > (this.header.parent.width - this.header.width) / 2) {
            x = (this.header.parent.width - this.header.width) / 2;
        } else if (x < (this.header.parent.width - this.header.width) / -2) {
            x = (this.header.parent.width - this.header.width) / -2;
        }

        let pos = Utils.computerOffset([x, y], [this.header.x, this.header['relativeY']]);

        for (let index = 0; index < pos.z; index++) {
            this.tracking.unshift([this.tracking[0][0] + pos.sin, this.tracking[0][1] + pos.cos]);
        }

        this.header.x = this.tracking[0][0];
        this.header['relativeY'] = this.tracking[0][1];

        this.onTouchEnd();
    }
}
