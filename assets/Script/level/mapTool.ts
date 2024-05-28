class CreateMapTool {
    // 水平方向向量
    horizontalVector: number = 4
    // 垂直方向向量
    verticalVector: number = 4
    // 地图数据
    mapNodeData = []
    // 地图节点
    mapNodeArray: Array<Array<MapNode>> = new Array(this.verticalVector).fill(new Array(this.horizontalVector).fill(new MapNode()))


    constructor(private randomPosition: [number, number] = [parseInt(String(Math.random() * 5)), parseInt(String(Math.random() * 5))]) {
    }

    // 随机四边
   randomFour () {
        let randomCount = [1,2,3,4][parseInt(String(Math.random() * 5))]
        let randomNumSet = new Set()

        while (randomNumSet.size < randomCount) {
            randomNumSet.add([1,2,3,4][parseInt(String(Math.random() * 5))])
        }

        return Array.from(randomNumSet).filter(i => i)
    }

    initMap () {
        // 获取该节点
        let mapNode = this.mapNodeArray[this.randomPosition[0]][this.randomPosition[1]]
        mapNode.enable = true
        mapNode.horizontalIndex = this.randomPosition[0]
        mapNode.verticalIndex = this.randomPosition[1]
        this.mapNodeData.push(mapNode)

        let currentNode = mapNode

        do {
            let randomNum = this.randomFour()
            console.log(randomNum)
            let position = {
                top: [currentNode.horizontalIndex - 1, currentNode.verticalIndex],
                right: [currentNode.horizontalIndex, currentNode.verticalIndex + 1],
                bottom: [currentNode.horizontalIndex + 1, currentNode.verticalIndex],
                left: [currentNode.horizontalIndex, currentNode.verticalIndex - 1]
            }
            console.log(position)
            randomNum.forEach(value => {
                switch (value) {
                    case 1:
                        if (position.top[0] >= this.verticalVector || position.top[0] < 0) break
                        console.log('up')

                        // 获取节点
                        let upNode = this.mapNodeArray[position.top[0]][position.top[1]]
                        upNode.enable = true
                        upNode.horizontalIndex = position.top[0]
                        upNode.verticalIndex = position.top[1]
                        upNode.downEnable = 1
                        upNode.downNode = currentNode

                        mapNode.upEnable = 1
                        mapNode.upNode = upNode

                        !this.mapNodeData.find(i => i.verticalVector === position.top[0] && i.horizontalVector === position.top[1]) && this.mapNodeData.push(upNode)
                        break

                    case 2:
                        if (position.bottom[0] >=  this.verticalVector || position.bottom[0] < 0) break
                        console.log('bottom')

                        // 获取节点
                        let downNode = this.mapNodeArray[position.bottom[0]][position.bottom[1]]
                        downNode.enable = true
                        downNode.horizontalIndex = position.bottom[0]
                        downNode.verticalIndex = position.bottom[1]
                        downNode.upEnable = 1
                        downNode.upNode = currentNode

                        mapNode.downEnable = 1
                        mapNode.downNode = downNode

                        !this.mapNodeData.find(i => i.verticalVector === position.bottom[0] && i.horizontalVector === position.bottom[1]) && this.mapNodeData.push(downNode)
                        break

                    case 3:
                        if (position.left[1] >=  this.horizontalVector || position.left[1] < 0) break
                        console.log('left')

                        // 获取节点
                        let leftNode = this.mapNodeArray[position.left[0]][position.left[1]]
                        leftNode.enable = true
                        leftNode.horizontalIndex = position.left[0]
                        leftNode.verticalIndex = position.left[1]
                        leftNode.rightEnable = 1
                        leftNode.rightNode = currentNode

                        mapNode.leftEnable = 1
                        mapNode.leftNode = leftNode

                        !this.mapNodeData.find(i => i.verticalVector === position.left[0] && i.horizontalVector === position.left[1]) && this.mapNodeData.push(leftNode)
                        break

                    case 4:
                        if (position.right[1] >=  this.horizontalVector || position.right[1] < 0) break
                        console.log('right')

                        // 获取节点
                        let rightNode = this.mapNodeArray[position.right[0]][position.right[1]]
                        rightNode.enable = true
                        rightNode.horizontalIndex = position.right[0]
                        rightNode.verticalIndex = position.right[1]
                        rightNode.leftEnable = 1
                        rightNode.leftNode = currentNode

                        mapNode.rightEnable = 1
                        mapNode.rightNode = rightNode

                        !this.mapNodeData.find(i => i.verticalVector === position.right[0] && i.horizontalVector === position.right[1]) && this.mapNodeData.push(rightNode)
                        break
                }
            })

            console.log(this.mapNodeData.length)
            if (currentNode.rightEnable) currentNode = currentNode.rightNode
            else if (currentNode.downEnable) currentNode = currentNode.downNode
            else if (currentNode.leftEnable) currentNode = currentNode.leftNode
            else if (currentNode.upEnable) currentNode = currentNode.upNode
        } while (this.mapNodeData.length < 7)

        console.log(this.mapNodeData)

    }
}

class MapNode {
    // 是否可用
    enable = false
    // 水平向索引
    horizontalIndex: number = -1
    // 垂直向索引
    verticalIndex: number = -1

    // 上侧节点
    upEnable = 0
    upNode: MapNode | null = null
    // 下侧节点
    downEnable = 0
    downNode: MapNode | null = null
    // 右侧节点
    rightEnable = 0
    rightNode: MapNode | null = null
    // 左侧节点
    leftEnable = 0
    leftNode: MapNode | null = null

    constructor(location: [number, number] = [0,0]) {
        this.horizontalIndex = location[0]
        this.verticalIndex = location[1]
    }
}

// export default CreateMapTool

let a = new CreateMapTool([2, 2])
a.initMap()
