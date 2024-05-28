import { _decorator, Component, Node, UITransform, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Camera')
export class Camera extends Component {
    @property(Node) playerNode: Node

    start() {

    }

    update(deltaTime: number) {
        if (!this.playerNode) return

        // 获取玩家节点的世界坐标
        let w_pos = this.playerNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0,0,0))
        // 将玩家节点的世界坐标转换为相机的本地坐标
        this.node.position = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(w_pos)
    }
}


