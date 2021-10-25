var Piece = (function() {
    function Piece(pos, img, i) {
        this.pos = pos;
        this.img = img;
        this.i = i;
        this.width = img.width;
        this.height = img.height;
    }//var 定義一個 piece fuction,


    //piece function "."調用指令，
    Piece.prototype.draw = function() {
        image(this.img, this.pos.x, this.pos.y);
    };
    //整碎圖片
    //開始
    Piece.prototype.hits = function(hitpos) {
        if (hitpos.x > this.pos.x &&
            hitpos.x < this.pos.x + this.width &&
            hitpos.y > this.pos.y &&
            hitpos.y < this.pos.y + this.height) {
            return true;
        }
        return false;
    };
    return Piece;
}());
//結束
var Puzzle = (function() {
    function Puzzle(x, y, img, side) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.side = side;
        this.isDragging = false;
        this.canPlay = true;
        this.pieces = [];
        this.width = img.width;
        this.height = img.height;
        this.w = this.width / side;
        this.h = this.height / side;
        this.placePieces();
    }
    Puzzle.prototype.placePieces = function() {
        for (var y = 0; y < this.side; y++) {
            for (var x = 0; x < this.side; x++) {
                var img = createImage(this.w, this.h);
                img.copy(this.img, this.w * x, this.h * y, this.w, this.h, 0, 0, this.w, this.h);
                var pos = this.randomPos(this.w, this.h);
                var index = x + y * this.side;
                this.pieces.push(new Piece(pos, img, index));
            }
        }
    };
    Puzzle.prototype.randomPos = function(marginRight, marginBottom) {
        return createVector(random(0, windowWidth - marginRight), random(0, windowHeight - marginBottom));
    };
    Puzzle.prototype.draw = function() {
        rect(this.x - 1, this.y - 1, this.width + 1, this.height + 1);
        fill('#87A0DE');
        this.pieces.forEach(function(r) {
            return r.draw();
        });
    };
    Puzzle.prototype.mousePressed = function(x, y) {
        var _this = this;
        if (this.canPlay) {
            var m_1 = createVector(x, y);
            var index_1;
            this.pieces.forEach(function(p, i) {
                if (p.hits(m_1)) {
                    _this.clickOffset = p5.Vector.sub(p.pos, m_1);
                    _this.isDragging = true;
                    _this.dragPiece = p;
                    index_1 = i;
                }
            });
            if (this.isDragging) {
                this.putOnTop(index_1);
            }
        }
    };
    Puzzle.prototype.mouseDragged = function(x, y) {
        if (this.isDragging) {
            var m = createVector(x, y);
            this.dragPiece.pos.set(m).add(this.clickOffset);
        }
    };
    Puzzle.prototype.mouseReleased = function() {
        if (this.isDragging) {
            this.isDragging = false;
            this.snapTo(this.dragPiece);
            this.checkEndGame();
        }
    };
    Puzzle.prototype.putOnTop = function(index) {
        this.pieces.splice(index, 1);
        this.pieces.push(this.dragPiece);
    };
    Puzzle.prototype.snapTo = function(p) {
        var dx = this.w / 2;
        var dy = this.h / 2;
        var x2 = this.x + this.width;
        var y2 = this.y + this.height;
        for (var y = this.y; y < y2; y += this.h) {
            for (var x = this.x; x < x2; x += this.w) {
                if (this.shouldSnapToX(p, x, dx, dy, y2)) {
                    p.pos.x = x;
                }
                if (this.shouldSnapToY(p, y, dx, dy, x2)) {
                    p.pos.y = y;
                }
            }
        }
    };
    Puzzle.prototype.shouldSnapToX = function(p, x, dx, dy, y2) {
        return this.isOnGrid(p.pos.x, x, dx) && this.isInsideFrame(p.pos.y, this.y, y2 - this.h, dy);
    };
    Puzzle.prototype.shouldSnapToY = function(p, y, dx, dy, x2) {
        return this.isOnGrid(p.pos.y, y, dy) && this.isInsideFrame(p.pos.x, this.x, x2 - this.w, dx);
    };
    Puzzle.prototype.isOnGrid = function(actualPos, gridPos, d) {
        return actualPos > gridPos - d && actualPos < gridPos + d;
    };
    Puzzle.prototype.isInsideFrame = function(actualPos, frameStart, frameEnd, d) {
        return actualPos > frameStart - d && actualPos < frameEnd + d;
    };

    //完成拼圖部分
    //開始
    Puzzle.prototype.checkEndGame = function() {
        var _this = this;
        var nrCorrectNeeded = this.side * this.side;
        var nrCorrect = 0;
        this.pieces.forEach(function(p) {
            var correctIndex = p.i;
            var actualIndex = (p.pos.x - _this.x) / _this.w + (p.pos.y - _this.y) / _this.h * _this.side;
            if (actualIndex === correctIndex) {
                nrCorrect += 1;
            }
        });
        if (nrCorrect === nrCorrectNeeded) {
            var h1 = createElement("h1", "You Got THIS");
          // when you done it will show up
            this.canPlay = false;
        } else {
            console.log("Right places: " + nrCorrect);
        }
    };
    return Puzzle;
}());//p完成拼圖部分結束
let puzzle;
let imgCb;
let song;
let sound;
let bgImg;

function preload() {
    imgCb = loadImage("images/overview_2.jpg");
    song = loadSound('audio/audio_page1audio.ogg');
    sound = loadSound('audio/popsound.mp3');
    bgImg = loadImage("images/backgd_2.png");

    //可添加圖片連接,225*225
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background = (bgImg);
    var x0 = windowWidth / 4 - imgCb.width / 4;
    var y0 = windowHeight / 4 - imgCb.height / 4;
    puzzle = new Puzzle(x0, y0, imgCb, 4);
    song.play();

}

function draw() {
    clear();
    puzzle.draw();
}

function mousePressed() {
    puzzle.mousePressed(mouseX, mouseY);
    if (sound.isPlaying()) {
    // .isPlaying() returns a boolean
    sound.stop();

  } else {
    sound.play();

  }
}

function mouseDragged() {
    puzzle.mouseDragged(mouseX, mouseY);
}

function mouseReleased() {
    puzzle.mouseReleased();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
