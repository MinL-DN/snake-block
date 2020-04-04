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
        // newSnake.setPosition(0, 0 - index * newSnake.width);
        newSnake.getComponent('SnakeBody').init(this);
        newSnake.index = index;

        if (index == 0) {
            this.header = newSnake;
        }
    }

    onTouchMove(event) {
        this.moveDistance = event.getPreviousLocation().x - event.getLocation().x; // moveDistance > 0 左移否则右移
    }

    onTouchEnd(event) {
        this.moveDistance = 0;
    }

    update() {
        let x = this.header.x - this.moveDistance;
        let y = this.game.distance;
        let pos = Utils.computerOffset([x, y], [this.header.x, this.header['relativeY']]);

        for (let index = 0; index < pos.z; index++) {
            this.tracking.unshift([this.tracking[0][0] + pos.sin, this.tracking[0][1] + pos.cos]);
        }

        this.header.setPosition(this.tracking[0][0], 0);
        this.header['relativeY'] = this.tracking[0][1];
    }
}
