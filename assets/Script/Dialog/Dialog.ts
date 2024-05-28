import {_decorator, Component, Label, Sprite, resources, SpriteFrame, input, Input, KeyCode} from 'cc';
import {ENTITY_STATE_ENUM, EVENT_TYPE_ENUM, ROLE_PATH_ENUM, ROLE_TYPE_ENUM} from "db://assets/Enum";
import EventManager from "db://assets/Runtime/EventManager";

const {ccclass, property} = _decorator;

type ITextContent = { role: ROLE_TYPE_ENUM, content: string }
type ITextDataArr = Array<ITextContent>

@ccclass('Dialog')
export class Dialog extends Component {
    // 头像图片
    @property(Sprite) picSprite: Sprite = null!
    // 名称
    @property(Label) nameLabel: Label = null!
    // 对话
    @property(Label) textLabel: Label = null!

    // 对话列表
    private textDataArr: ITextDataArr = []
    // 对话数组索引
    private _dialogContentIndex = -1
    // 对话框状态
    private _state: ENTITY_STATE_ENUM = ENTITY_STATE_ENUM.DEAD
    // 文字显示索引
    private _textContentIndex = 0
    // 文字显示定时器
    private _textContentTimer = null!
    // 文字显示间隔
    private _textContentInterval = 0.1

    get state() {
        return this._state
    }

    set state(value) {
        if (this._state === value) return
        this._state = value
    }

    get dialogContentIndex() {
        return this._dialogContentIndex
    }

    set dialogContentIndex(value) {
        if (value < 0 || value >= this.textDataArr.length) {
            this.closeDialog()
            return
        }
        this._dialogContentIndex = value
        // 更新对话内容
        this.setDialogContent(this.textDataArr[this.dialogContentIndex])
    }

    onLoad () {
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy () {
        input.off(Input.EventType.KEY_UP, this.onKeyUp);
    }

    onKeyUp (event) {
        if (event.keyCode === KeyCode.SPACE) {
            if (this._textContentIndex && this._textContentIndex < this.textDataArr[this.dialogContentIndex].content.length - 1) {
                this._textContentIndex = this.textDataArr[this.dialogContentIndex].content.length - 2
            } else {
                this.dialogContentIndex++
            }
        }
    }

    start() {
        this.init([
            {
                role: ROLE_TYPE_ENUM.SKELETON_KING,
                content: '少年！你渴望力量吗？'
            },
            {
                role: ROLE_TYPE_ENUM.HERO,
                content: '是的，我非常渴望，快tm给我'
            }
        ])
    }

    init(textDataArr: ITextDataArr) {
        this.textDataArr = textDataArr
        // 激活节点
        this.node.active = true
        // 更新对话内容
        this.dialogContentIndex = 0
        // 开始事件 —— dialog 运行
        EventManager.Instance.emit(EVENT_TYPE_ENUM.DIALOG_RUNNING)
    }

    // 更新对话
    setDialogContent (textContent: ITextContent) {
        this._textContentTimer && (this._textContentTimer = null)
        // 设置name名称
        this.nameLabel.string = textContent.role === ROLE_TYPE_ENUM.HERO ? '？？？' : '骷髅王'
        // 设置对话
        this._textContentTimer = function () {
            this._textContentIndex++

            if (this._textContentIndex > textContent.content.length) {
                this.unschedule(this._textContentTimer)
                this._textContentTimer = null
                this._textContentIndex = 0
                return
            }

            this.textLabel.string = textContent.content.slice(0, this._textContentIndex)
        }
        this.schedule(this._textContentTimer, this._textContentInterval)

        resources.load(`${ROLE_PATH_ENUM[textContent.role]}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) return console.error(err)
            this.picSprite.spriteFrame = spriteFrame
        });
    }

    closeDialog () {
        this.node.active = false
        // 关闭事件dialog运行
        EventManager.Instance.emit(EVENT_TYPE_ENUM.DIALOG_FINISHED)
    }
}


