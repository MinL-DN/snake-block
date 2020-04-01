const pool = {};

// 应用池方法
namespace Pool {

    export function spawnNewNode(node: cc.Prefab) {

        if (!node.name) return;

        let poolName = node.name + 'Pool';

        if (!pool[poolName]) {
            pool[poolName] = new cc.NodePool(node.name);
        }

        return pool[poolName].size() > 0 ? pool[poolName].get() : cc.instantiate(node);
    }

    export function despawn(node: cc.Node) {
        let poolName = node.name + 'Pool';
        if (pool[poolName]) pool[poolName].put(node);
    }
}

export default Pool;
