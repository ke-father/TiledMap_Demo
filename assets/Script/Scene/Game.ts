import { _decorator, Node, Component, RigidBody2D, TiledMap, ERigidBody2DType, BoxCollider2D, v2, PhysicsSystem2D, EPhysics2DDrawFlags, PhysicsGroup,  TiledMapAsset, UITransform, Sprite, Color, Label, v3 } from 'cc';
import ResourceLoadManager from "db://assets/Runtime/ResourceLoadManager";
import {Dialog} from "db://assets/Script/Dialog/Dialog";
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
    @property(Node) MapNode: Node = null!

    async onLoad () {
        // profiler.hideStats();
        // PhysicsSystem2D.instance.debugDrawFlags =
        //     EPhysics2DDrawFlags.Shape;

        this.initTiledMap([
            ['01000', '10010', '00000'],
            ['01000', '11110', '10000'],
            ['00000', '00100', '00000']
        ])
    }

    start () {
        // let copyLabel: Node = this.node.getChildByName('Label')
        //
        // copyLabel.name = 'label'
        // let label = copyLabel.getComponent(Label)
        // label.string = '11111111111111111'
        // copyLabel.parent = this.MapNode
        //
        // console.log(this.node)

        // let node = new Node()
        // // node.parent = this.MapNode
        // let transform = node.addComponent(UITransform)
        // // transform.setContentSize(384, 384)
        // // 设置锚点
        // transform.setAnchorPoint(1,1)
        // // transform.anchorX = transform.anchorY = 0.5
        // let label = node.addComponent(Label)
        // label.string = '1111111111111111'
        //
        // // let sprite = node.addComponent(Sprite)
        // // sprite.color = new Color(255,255,255,1)
        //
        // node.parent = this.MapNode


        // console.log(label)
        // label.string = '111111111111111111111111'
    }

    async initTiledMap (mapArray: Array<Array<string>>) {
        for (let i = 0; i < mapArray.length; i++) {
            for (let j = 0; j < mapArray[i].length; j++) {
                let mapName = mapArray[i][j]
                if (!mapName || mapName === '00000') continue

                // 获取资源
                let mapAsset = await ResourceLoadManager.Instance.load(`tiledMap/${mapName}`, TiledMapAsset)

                // 创建节点
                let node = new Node()

                let transform = node.addComponent(UITransform)

                // 添加tileMap组件
                let map = node.addComponent(TiledMap)
                try {
                    map.tmxAsset = mapAsset as unknown as TiledMapAsset
                } catch (e) {
                    console.log(e)
                }

                // 设置位置
                node.setPosition(v3(i * 384, -j * 384, 0))

                // 创建地图
                this.generateWallRigidBody2D(node)

                node.parent = this.MapNode
                // 设置锚点
                transform.anchorX = transform.anchorY = 0
            }
        }
    }



    generateWallRigidBody2D (MapNode: Node) {
        let tiledMap = MapNode.getComponent(TiledMap)
        // 获取图层
        let layer = tiledMap.getLayer('wall')
        // 获取瓦片数量 Object{x, y}
        let layerSize = layer.getLayerSize()
        // 获取瓦片尺寸
        let tiledSize = tiledMap.getTileSize()
        // 获取烟雾层
        let smogLayer = tiledMap.getLayer('smog')
        // 是否开启烟雾层
        smogLayer.node.active = false

        // 横向
        for (let widthIndex = 0; widthIndex < layerSize.width; widthIndex++) {
            // 纵向
            for (let heightIndex = 0; heightIndex < layerSize.height; heightIndex++) {
                // 获取砖块内容
                let tiledItem = layer.getTiledTileAt(widthIndex, heightIndex, true)
                // 如果节点id不存在 表示该节点无tile
                if (tiledItem.grid !== 0) {
                    // 添加刚体组件
                    let rigidBody2D = tiledItem.addComponent(RigidBody2D)
                    // 设置分组
                    rigidBody2D.group = PhysicsGroup['wall']
                    // 设置类型 —— 静态
                    rigidBody2D.type =  ERigidBody2DType.Static
                    rigidBody2D.enabledContactListener = true

                    // 添加碰撞体组件
                    let collider = tiledItem.addComponent(BoxCollider2D)
                    collider.group = PhysicsGroup['wall']
                    // 设置偏移量
                    collider.offset = v2(tiledSize.width / 2, tiledSize.height / 2)
                    // 设置大小
                    collider.size = tiledSize
                    collider.apply()
                }

                // let tiledCircleItem = smogLayer.getTiledTileAt(widthIndex, heightIndex, true)
                //
                // if (tiledCircleItem.grid !== 0) {
                //     // 添加刚体组件
                //     let rigidBody2D = tiledCircleItem.addComponent(RigidBody2D)
                //     // 设置分组
                //     rigidBody2D.group = PhysicsGroup['smog']
                //     // 设置类型 —— 静态
                //     rigidBody2D.type =  ERigidBody2DType.Static
                //
                //     rigidBody2D.enabledContactListener = true
                //     // 添加碰撞体
                //     let collider = tiledCircleItem.addComponent(BoxCollider2D)
                //     // 不产生物理效果 只是传感器
                //     collider.sensor = true
                //     collider.group = PhysicsGroup['smog']
                //     // 设置偏移量
                //     collider.offset = v2(tiledSize.width / 2, tiledSize.height / 2)
                //     // 设置大小
                //     collider.size = tiledSize
                // }
            }
        }
    }
}


