// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import Player from './Player';
import Utils from './utils/index';

@ccclass
export default class SnakeBody extends cc.Component {

    player: Player
    hitNode: cc.Node

    init(player: Player) {
        this.player = player;
    }

    onLoad() {
        this.enabled = true;
    }

    start(){
    }

    update (dt) {
        if (this.node['index'] != 0) {

            let index = this.node.width * this.node['index'];

            let pos = this.player.tracking[index];
            if (pos) {
                this.node.setPosition(pos[0], pos[1] - this.player.game.distance);
            }

            if (this.node['index'] == this.player.len - 1) {
                this.player.tracking.splice(index, this.player.tracking.length - index);
            }
        }
    }
}
