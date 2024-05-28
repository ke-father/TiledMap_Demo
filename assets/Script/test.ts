import { _decorator, Component, Node, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {
    start() {
        console.log(this.getComponent(RigidBody2D))
    }

    update(deltaTime: number) {

    }
}


