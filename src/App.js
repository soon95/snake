var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var score = document.getElementById('score');
/**
 * 这边定义画布大小
 */
var cellSize = 20;
var lineSize = 10;
/**
 * 实际游戏区域的大小
 */
var panelSize = 600;
var width = panelSize + lineSize;
var height = panelSize + lineSize;
canvas.width = width;
canvas.height = height;
var axisFrom = lineSize / 2;
var axisTo = panelSize + lineSize / 2;
var Map = /** @class */ (function () {
    function Map(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
    }
    Map.prototype.draw = function () {
        context.fillStyle = 'white';
        context.fillRect(axisFrom, axisFrom, axisTo, axisTo);
        context.strokeStyle = 'black';
        context.lineWidth = lineSize;
        context.strokeRect(0, 0, this.width, this.height);
    };
    return Map;
}());
var Food = /** @class */ (function () {
    function Food(location) {
        this.location = location;
    }
    Food.prototype.draw = function () {
        var x = this.location.x;
        var y = this.location.y;
        // console.log("食物坐标 x:",x,",y:",y)
        context.fillStyle = 'green';
        context.fillRect(x, y, cellSize, cellSize);
    };
    return Food;
}());
var Snake = /** @class */ (function () {
    function Snake() {
        this.body = [{
                x: width / 2,
                y: height / 2,
            }];
        this.direction = {
            x: 0,
            y: 1,
        };
    }
    Snake.prototype.eat = function () {
        var tail = this.body[this.body.length - 1];
        this.body.push(tail);
        this.run();
    };
    Snake.prototype.move = function () {
        var oldHead = this.body[0];
        var newHead = {
            x: oldHead.x + this.direction.x * cellSize,
            y: oldHead.y + this.direction.y * cellSize,
        };
        this.body.unshift(newHead);
        this.body.pop();
    };
    Snake.prototype.createSnake = function () {
        this.body.forEach(function (item, index) {
            if (index === 0) {
                context.fillStyle = '#666666';
            }
            else {
                context.fillStyle = '#888888';
            }
            context.fillRect(item.x, item.y, cellSize, cellSize);
        });
    };
    Snake.prototype.eraseSnake = function () {
        this.body.forEach(function (item, index) {
            context.fillStyle = 'white';
            context.fillRect(item.x, item.y, cellSize, cellSize);
        });
    };
    Snake.prototype.run = function () {
        this.eraseSnake();
        this.move();
        this.createSnake();
    };
    return Snake;
}());
var App = /** @class */ (function () {
    function App() {
        this.map = new Map(width, height, cellSize);
        this.snake = new Snake();
        this.food = new Food(this.createFood());
    }
    App.prototype.run = function () {
        var _this = this;
        this.interval = setInterval(function () {
            _this.snakeMove();
        }, 500);
        // 电脑方向键控制
        onkeydown = function (e) {
            var oldDirection = _this.snake.direction;
            switch (e.key) {
                case 'ArrowUp':
                    _this.snake.direction = {
                        x: 0,
                        y: -1,
                    };
                    break;
                case 'ArrowDown':
                    _this.snake.direction = {
                        x: 0,
                        y: 1,
                    };
                    break;
                case 'ArrowLeft':
                    _this.snake.direction = {
                        x: -1,
                        y: 0,
                    };
                    break;
                case 'ArrowRight':
                    _this.snake.direction = {
                        x: 1,
                        y: 0,
                    };
                    break;
                default:
                    return;
            }
            // 长按加速
            if (oldDirection.x === _this.snake.direction.x && oldDirection.y === _this.snake.direction.y) {
                _this.snakeMove();
            }
        };
    };
    App.prototype.snakeMove = function () {
        this.snake.run();
        if (this.snake.body[0].x === this.food.location.x && this.snake.body[0].y === this.food.location.y) {
            this.snake.eat();
            console.log("吃！！！");
            score.innerText = (this.snake.body.length - 1).toString();
            this.food = new Food(this.createFood());
        }
        if (this.isOver()) {
            score.innerText = "0";
            clearInterval(this.interval);
            gameStart();
        }
    };
    App.prototype.isOver = function () {
        var snake = this.snake;
        if (snake.body[0].x < axisFrom || snake.body[0].x > axisTo || snake.body[0].y < axisFrom || snake.body[0].y > axisTo) {
            return true;
        }
        var head = snake.body[0];
        for (var i = 1; i < snake.body.length; i++) {
            if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
                return true;
            }
        }
        return false;
    };
    App.prototype.createFood = function () {
        var stepCount = panelSize / cellSize - 1;
        var x;
        var y;
        var flag = false;
        while (!flag) {
            x = Math.round(Math.random() * stepCount) * cellSize + axisFrom;
            y = Math.round(Math.random() * stepCount) * cellSize + axisFrom;
            flag = true;
            flag = !this.snake.body.some(function (item) { return (x === item.x && y === item.y); });
        }
        console.log("食物坐标 x:", x, ",y:", y);
        return { x: x, y: y };
    };
    App.prototype.draw = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.draw(); });
        this.map.draw();
        this.snake.createSnake();
        this.food.draw();
    };
    /**
     * 启动程序
     */
    App.prototype.init = function () {
        var _this = this;
        console.log("游戏启动");
        this.draw();
        onkeydown = function (e) {
            _this.run();
        };
    };
    return App;
}());
function gameStart() {
    var app = new App();
    app.init();
}
gameStart();
//# sourceMappingURL=App.js.map