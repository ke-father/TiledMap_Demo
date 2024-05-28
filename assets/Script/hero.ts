import {_decorator, Animation, Component, Input, input, KeyCode, RigidBody2D, v2, CircleCollider2D, Contact2DType, Collider2D, IPhysics2DContact, PhysicsGroup, TiledTile} from 'cc';
import {DIRECTION_STATE_ENUM, ENTITY_STATE_ENUM, EVENT_TYPE_ENUM} from "db://assets/Enum";
import EventManager from "db://assets/Runtime/EventManager";

const { ccclass, property } = _decorator;

export const PLAYER_SPEED = 20

@ccclass('hero')
export class hero extends Component {
    // 输入状态
    InputCodeState: Map<number, number> = new Map()
    // 设置人物状态
    state: DIRECTION_STATE_ENUM
    // 人物动画
    heroAnimation: Animation = null!

    private dialogState: ENTITY_STATE_ENUM = ENTITY_STATE_ENUM.DEAD


    onLoad () {
        // 获取组件
        this.heroAnimation = this.getComponent(Animation)

        // 监听键盘输入事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        // 事件中心绑定
        EventManager.Instance.on(EVENT_TYPE_ENUM.DIALOG_RUNNING, this.onDialogRunning, this)
        EventManager.Instance.on(EVENT_TYPE_ENUM.DIALOG_FINISHED, this.onDialogFinished, this)
    }

    start () {
        // 获取原型碰撞盒 —— 迷雾效果
        let circleCollider2D = this.node.getComponent(CircleCollider2D)
        if (circleCollider2D) {
            // 监听碰撞
            circleCollider2D.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            // 监听碰撞结束
            // circleCollider2D.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    // 设置状态
    setState (state: DIRECTION_STATE_ENUM) {
        if (this.state === state) return
        // 设置状态
        this.state = state

        // 设置动画状态
        this.heroAnimation.play(this.state)
    }

    onDestroy () {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown)
    }

    onKeyDown (event) {
        if (this.dialogState !== ENTITY_STATE_ENUM.DEAD) return
        this.InputCodeState.set(event.keyCode, 1)
    }

    onKeyUp (event) {
        if (this.dialogState !== ENTITY_STATE_ENUM.DEAD) return
        this.InputCodeState.set(event.keyCode, 0)
    }

    update (deltaTime: number) {
        for (let key of this.InputCodeState.keys()) {
            // @ts-ignore
            if (![KeyCode.KEY_A, KeyCode.KEY_D, KeyCode.KEY_W, KeyCode.KEY_S, KeyCode.ARROW_RIGHT, KeyCode.ARROW_UP, KeyCode.ARROW_DOWN, KeyCode.ARROW_LEFT].includes(key)) continue
            // 获取值
            let value = this.InputCodeState.get(key)
            if (!value) continue

            // 获取线性速度
            const rigidBody2D = this.node.getComponent(RigidBody2D)
            const { x: playerX, y: playerY } = rigidBody2D.linearVelocity
            let shift_vector = v2(playerX, playerY)

            let state: DIRECTION_STATE_ENUM

            switch (key) {
                case KeyCode.KEY_D || KeyCode.ARROW_RIGHT:
                    state = DIRECTION_STATE_ENUM.RIGHT
                    shift_vector.x += PLAYER_SPEED * deltaTime
                    break
                case KeyCode.KEY_A || KeyCode.ARROW_LEFT:
                    state = DIRECTION_STATE_ENUM.LEFT
                    shift_vector.x -= PLAYER_SPEED * deltaTime
                    break
                case KeyCode.KEY_W || KeyCode.ARROW_UP:
                    state = DIRECTION_STATE_ENUM.UP
                    shift_vector.y += PLAYER_SPEED * deltaTime
                    break
                case KeyCode.KEY_S || KeyCode.ARROW_DOWN:
                    state = DIRECTION_STATE_ENUM.DOWN
                    shift_vector.y -= PLAYER_SPEED * deltaTime
                    break
            }

            rigidBody2D.linearVelocity = shift_vector
            state && this.setState(state)
        }
    }

    onDialogRunning () {
        this.dialogState = ENTITY_STATE_ENUM.SURVIVAL
        this.node.pauseSystemEvents(true);
    }

    onDialogFinished () {
        this.dialogState = ENTITY_STATE_ENUM.DEAD
        this.node.resumeSystemEvents(true);
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherGroup = otherCollider.getComponent(Collider2D).group
        if (otherGroup === PhysicsGroup['smog']) {
            this.scheduleOnce(function () {
                otherCollider.node.active = false
                otherCollider.getComponent(TiledTile).grid = 0
            }, 0)
        }
    }

    // onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    //     let otherGroup = otherCollider.getComponent(Collider2D).group
    //     if (otherGroup === PhysicsGroup['smog']) {
    //         this.scheduleOnce(function () {
    //             otherCollider.node.active = true
    //             otherCollider.getComponent(TiledTile).grid = Math.floor(Math.random() * 3)
    //         }, 0)
    //     }
    // }
}


