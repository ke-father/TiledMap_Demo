// 事件中心
import {resources, SpriteFrame } from "cc";
import Singleton from "db://assets/Base/Singleton";

interface IItem {
    func: Function
    ctx: unknown
}

export default class ResourceLoadManager extends Singleton {
    static get Instance() {
        return super.GetInstance<ResourceLoadManager>()
    }

    load <T = any>(path: string, type: T) {
        return new Promise<T[]>((resolve, reject) => {
            resources.load(path, type as any, (err, assets) => {
                if (err) {
                    reject(err)
                    return
                }

                resolve(assets as any)
            })
        })
    }
}
