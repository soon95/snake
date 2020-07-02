const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

const score: HTMLElement = <HTMLElement>document.getElementById('score')


/**
 * 这边定义画布大小
 */
let cellSize: number = 20
let lineSize: number = 10

/**
 * 实际游戏区域的大小
 */
let panelSize: number = 600

let width: number = panelSize + lineSize
let height: number = panelSize + lineSize

canvas.width = width
canvas.height = height

let axisFrom: number = lineSize / 2
let axisTo: number = panelSize + lineSize / 2


interface Point {
    x: number,
    y: number,
}

class Map {
    public width: number
    public height: number
    public cellSize: number

    constructor(width: number, height: number, cellSize: number) {
        this.width = width
        this.height = height
        this.cellSize = cellSize
    }

    public draw() {

        context.fillStyle = 'white'
        context.fillRect(axisFrom, axisFrom, axisTo, axisTo)

        context.strokeStyle = 'black'
        context.lineWidth = lineSize
        context.strokeRect(0, 0, this.width, this.height)
    }


}

class Food {

    public location: Point

    constructor(location: Point) {
        this.location = location
    }

    public draw() {
        let x: number = this.location.x
        let y: number = this.location.y

        // console.log("食物坐标 x:",x,",y:",y)
        context.fillStyle = 'green'
        context.fillRect(x, y, cellSize, cellSize)
    }


}

class Snake {
    public body: Array<Point>
    public direction: Point

    constructor() {
        this.body = [{
            x: width / 2,
            y: height / 2,
        }]

        this.direction = {
            x: 0,
            y: 1,
        }
    }

    public eat() {
        let tail: Point = this.body[this.body.length - 1]
        this.body.push(tail)
        this.run()
    }

    public move() {
        let oldHead: Point = this.body[0]

        let newHead: Point = {
            x: oldHead.x + this.direction.x * cellSize,
            y: oldHead.y + this.direction.y * cellSize,
        }


        this.body.unshift(newHead)
        this.body.pop()
    }

    public createSnake() {
        this.body.forEach((item, index) => {
            if (index === 0) {
                context.fillStyle = '#666666';
            } else {
                context.fillStyle = '#888888';
            }
            context.fillRect(item.x, item.y, cellSize, cellSize);
        });
    }

    public eraseSnake() {
        this.body.forEach((item, index) => {
            context.fillStyle = 'white'
            context.fillRect(item.x, item.y, cellSize, cellSize)
        })
    }

    public run() {
        this.eraseSnake()
        this.move()
        this.createSnake()
    }

}


class App {

    public map: Map
    public snake: Snake
    public food: Food

    public interval: number

    constructor() {
        this.map = new Map(width, height, cellSize)
        this.snake = new Snake()
        this.food = new Food(this.createFood())
    }

    public run() {
        this.interval = setInterval(() => {
            this.snakeMove()
        }, 500)

        // 电脑方向键控制
        onkeydown = (e) => {
            let oldDirection: Point = this.snake.direction;
            switch (e.key) {
                case 'ArrowUp':
                    this.snake.direction = {
                        x: 0,
                        y: -1,
                    }
                    break
                case 'ArrowDown':
                    this.snake.direction = {
                        x: 0,
                        y: 1,
                    }
                    break
                case 'ArrowLeft':
                    this.snake.direction = {
                        x: -1,
                        y: 0,
                    }
                    break
                case 'ArrowRight':
                    this.snake.direction = {
                        x: 1,
                        y: 0,
                    }
                    break
                default:
                    return
            }

            // 长按加速
            if (oldDirection.x === this.snake.direction.x && oldDirection.y === this.snake.direction.y) {
                this.snakeMove();
            }

        }


    }


    public snakeMove() {
        this.snake.run()

        if (this.snake.body[0].x === this.food.location.x && this.snake.body[0].y === this.food.location.y) {

            this.snake.eat()
            console.log("吃！！！")

            score.innerText = (this.snake.body.length - 1).toString()

            this.food = new Food(this.createFood())
        }

        if (this.isOver()) {
            score.innerText = "0"
            clearInterval(this.interval)
            gameStart()
        }
    }

    public isOver(): boolean {
        let snake: Snake = this.snake

        if (snake.body[0].x < axisFrom || snake.body[0].x > axisTo || snake.body[0].y < axisFrom || snake.body[0].y > axisTo) {
            return true
        }

        let head: Point = snake.body[0]
        for (let i = 1; i < snake.body.length; i++) {
            if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
                return true
            }
        }

        return false
    }


    public createFood(): Point {
        let stepCount: number = panelSize / cellSize - 1

        let x: number
        let y: number
        let flag: boolean = false

        while (!flag) {
            x = Math.round(Math.random() * stepCount) * cellSize + axisFrom
            y = Math.round(Math.random() * stepCount) * cellSize + axisFrom

            flag = true

            flag = !this.snake.body.some(item => (x === item.y && y === item.y))
        }

        console.log("食物坐标 x:", x, ",y:", y)


        return {x, y}
    }

    public draw() {
        requestAnimationFrame(() => this.draw());

        this.map.draw();
        this.snake.createSnake()
        this.food.draw();
    }


    /**
     * 启动程序
     */
    public init() {
        console.log("游戏启动")

        this.draw()

        onkeydown = (e) => {
            this.run()
        }

    }

}

function gameStart() {
    let app: App = new App()
    app.init()
}

gameStart()
