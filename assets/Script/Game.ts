const {ccclass, property} = cc._decorator;

import Utils from './utils/index';
import Pool from './utils/pool';
import Player from './Player';

@ccclass
export default class Home extends cc.Component {

    @property(cc.Prefab) blockPrefab: cc.Prefab = null
    @property(cc.Prefab) snakeBodyPrefab: cc.Prefab = null
    @property(cc.Prefab) wallPrefab: cc.Prefab = null
    @property(cc.Node) playerLimit: cc.Node = null

    @property speed = 1
    @property top = 999

    colors: any[]
    spwanBlock = 0
    blockSize = 150
    hitBlock = false // 撞击石块

    distance = 0;

    player: Player
    playerLimitNodes: cc.Node[] = []

    // init logic
    start () {
        // 开启碰撞检测系统，未开启时无法检测
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;

        this.colors = Utils.gradient('#ff0000', '#ffff00', 10);
        this.playerLimit.getComponent('PlayerLimit').init(this);
        this.player = new Player();
        this.player.init(this);
    }

    spwanNewBlock() {
        for (let index = 0; index < 5; index++) {
            let randomNum = Utils.random(10);
            if (randomNum > 8) {
                let x = this.blockSize * (index - 2);
                let newBlock = Pool.spawnNewNode(this.blockPrefab) as cc.Node;
                this.node.addChild(newBlock);
                newBlock.setPosition(x, this.top);
                newBlock.getComponent('Block').init(this);
            }
        }
    }

    spwanNewWall() {
        let randomNum = Utils.random(10);

        if (randomNum > 5) {
            let x = this.blockSize * ((Utils.random(4) + 1) - 2.5);
            let newWall = Pool.spawnNewNode(this.wallPrefab) as cc.Node;
            this.node.addChild(newWall);
            newWall.setPosition(x, this.top);
            newWall.getComponent('Wall').init(this);
        }
    }

    update() {

        this.distance = this.distance + this.speed;
        this.player.update();

        // if (this.hitBlock) return;

        if (this.spwanBlock >= this.blockSize) {
            this.spwanBlock = 0;
            this.spwanNewBlock();
            this.spwanNewWall();
        } else {
            this.spwanBlock = this.spwanBlock + this.speed;
        }
    }
}
