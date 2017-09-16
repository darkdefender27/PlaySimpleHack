var preLoad = function(game) {
    console.log("Starting to preload!");
};

module.exports = preLoad;
var gameLogic = require('./gameLogic.js');

preLoad.prototype = {

    preload: function() {
        initial_state = this.game.cache.getJSON('initial_state');
        level = this.game.cache['level'];
        if(level){
            this.game.cache['level'] += 1
        } else {
            this.game.cache['level'] = 1
        }
        console.log("sdf",level);
        gameLogic.init(initial_state[this.game.cache['level']]["grid"]);
    },

    create: function() {
        // var zombieCount = initial_state[this.game.cache['level']]['mummies'];
        // var ghostCount = initial_state[this.game.cache['level']]['ghosts'];
        // var VampireCount = initial_state[this.game.cache['level']]['vamps'];
        var rows = initial_state[this.game.cache['level']]["no_of_rows"];
        var cols = initial_state[this.game.cache['level']]["no_of_cols"];
        var deviceRatio = 1/((window.innerWidth / window.innerHeight))*rows/2;
        var sprite = this.game.add.sprite(0,0, 'bg');
        sprite.scale.setTo(window.innerWidth/1440, window.innerHeight/2560);
        var zombie = this.game.add.sprite(window.innerWidth/4,window.innerHeight/12, 'zombie');
        zombie.scale.setTo(1 / (deviceRatio/rows*3) , 1 / (deviceRatio/rows*3));
        var ghost = this.game.add.sprite(window.innerWidth/4+window.innerWidth/6,window.innerHeight/12, 'ghost');
        ghost.scale.setTo(1 / (deviceRatio/rows*3), 1 / (deviceRatio/rows*3));
        var vampire = this.game.add.sprite(window.innerWidth/4+ window.innerWidth/6 + window.innerWidth/6,window.innerHeight/12, 'vampire');
        vampire.scale.setTo(1 / (deviceRatio/rows*3), 1 / (deviceRatio/rows*3));

        var zombieCount = this.game.add.sprite(window.innerWidth/4,window.innerHeight/6, initial_state[this.game.cache['level']]['mummies'].toString());
        zombieCount.scale.setTo(1 / (deviceRatio/rows*3) , 1 / (deviceRatio/rows*3));
        var ghostCount = this.game.add.sprite(window.innerWidth/4+window.innerWidth/6,window.innerHeight/6, initial_state[this.game.cache['level']]['ghosts'].toString());
        ghostCount.scale.setTo(1 / (deviceRatio/rows*3), 1 / (deviceRatio/rows*3));
        var vampireCount = this.game.add.sprite(window.innerWidth/4+ window.innerWidth/6 + window.innerWidth/6,window.innerHeight/6, initial_state[this.game.cache['level']]['vamps'].toString());
        vampireCount.scale.setTo(1 / (deviceRatio/rows*3), 1 / (deviceRatio/rows*3));
        // var vampire = this.game.add.sprite(window.innerWidth/4,window.innerHeight/8, 'vampire');
        // vampire.scale.setTo(1 / deviceRatio , 1 / deviceRatio);
        // var zombie = this.game.add.sprite(window.innerWidth/4+window.innerWidth/6,window.innerHeight/8, 'zombie');
        // zombie.scale.setTo(1 / deviceRatio, 1 / deviceRatio);

        var txtStyle = {
            font: '65px Arial',
            fill: '#ffffff',
            align: 'center'
        };
        var logo = [];
        var xOff, yOff;
        var inputMatrix = initial_state[this.game.cache['level']]["grid"];
        for(var i=0;i<inputMatrix.length;i++) {
            for(var j=0;j<inputMatrix[i].length;j++) {
                if(!((inputMatrix[i][j] == '/') || (inputMatrix[i][j] == '\\')))
                    inputMatrix[i][j]='B';
            }
        }
        console.log("asf",inputMatrix);
        var countsArr = gameLogic.getCount();
        for(var i=0;i<cols+2;i++) {
            var row = [];
            for(var j=0;j<rows+2;j++) {
                yOff = window.innerHeight/2.5;
                xOff = window.innerWidth/4;
                if((j == 0 || i == 0  || j == (cols+1) || i == (rows+1))) {
                    if((i==0 && j==0) || (i==0 && j==rows+1) || (i==cols+1 && j==0) || (i==cols+1 && j==rows+1)) {
                        continue;
                    }
                    var count;
                    if(i == 0) {
                        count = countsArr["left"][j-1];
                    } else if(j == 0) {
                        count = countsArr["down"][i-1];
                    } else if(j == cols+1) {
                        count = countsArr["up"][i-1];
                    } else if(i == rows+1) {
                        count = countsArr["right"][j-1];
                    }

                    var text = this.game.add.text(138 / deviceRatio * (i - 1) + xOff, 138 / deviceRatio * (j - 1) + yOff, count.toString(), txtStyle);
                    text.scale.setTo(1/deviceRatio, 1/deviceRatio);
                    text.inputEnabled = true;
                    text.events.onInputDown.add(onDownCount.bind(this,j,i,inputMatrix,rows,cols), this);
                    text.anchor.setTo(0, 0);
                } else {
                    var cellSprite;
                    if(initial_state[this.game.cache['level']]["grid"][j-1][i-1] == '/') {
                        var sprite = this.game.add.sprite(138 / deviceRatio * (i - 1) + xOff, 138 / deviceRatio * (j - 1) + yOff, 'f');
                        sprite.scale.setTo(1 / deviceRatio, 1 / deviceRatio);
                    } else if(initial_state[this.game.cache['level']]["grid"][j-1][i-1] == '\\') {
                        var sprite = this.game.add.sprite(138 / deviceRatio * (i - 1) + xOff, 138 / deviceRatio * (j - 1) + yOff, 'b');
                        sprite.scale.setTo(1 / deviceRatio, 1 / deviceRatio);
                    } else {
                        var sprite = this.game.add.sprite(138 / deviceRatio * (i - 1) + xOff, 138 / deviceRatio * (j - 1) + yOff, 'e');
                        sprite.scale.setTo(1 / deviceRatio, 1 / deviceRatio);
                        sprite.inputEnabled = true;
                        sprite.events.onInputDown.add(onDown.bind(this,j,i,inputMatrix), this);
                        row.push(sprite);
                    }
                }
            }
            console.log(gameLogic.getCount());
//                logo.push(row);
        }

        function onDown(i,j,inputMatrix,sprite, pointer) {
            console.log(i,j);

            if (sprite.key === 'e') {
                sprite.loadTexture('z');
                inputMatrix[i-1][j-1] = 'Z'
            }
            else if (sprite.key === 'z') {
                sprite.loadTexture('g');
                inputMatrix[i-1][j-1] = 'G'
            }
            else if (sprite.key === 'g') {
                sprite.loadTexture('v');
                inputMatrix[i-1][j-1] = 'V'
            }
            else if (sprite.key === 'v') {
                sprite.loadTexture('e');
                inputMatrix[i-1][j-1] = 'B'
            }
            if(gameLogic.isWin(inputMatrix)){
                this.game.state.start("Preload")
            }
        }
        function onDownCount(i,j,inputMatrix, rows, cols, sprite, pointer) {
            // console.log(i,j,rows,cols);
            var direction;
            if(i == rows + 1) {
                direction = "up";
            } else if(i == 0) {
                direction = "down";
            } else if(j == 0) {
                direction = "right";
            } else if(j == cols+1) {
                direction = "left";
            }
            lineOfSight(i,j,direction,inputMatrix,rows,cols)
        }
        function lineOfSight(i,j,direction,inputMatrix,rows,cols) {
            // if((j == -1 || i == -1  || j == (cols+2) || i == (rows+2))) {
            //     return;
            // }
            if(direction == "up") {
                if(i == 1) {
                    return;
                }
                console.log(i-1,j);
                lineOfSight(i-1,j,direction,inputMatrix,rows,cols)
            } else if(direction == "down") {
                if(i == rows) {
                    return;
                }
                console.log(i + 1, j);
                lineOfSight(i+1,j,direction,inputMatrix,rows,cols)
            } else if(direction == "right") {
                console.log(i,j+1);
                lineOfSight(i,j+1,direction,inputMatrix,rows,cols)
            } else if(direction == "left") {
                console.log(i, j-1);
                lineOfSight(i,j-1,direction,inputMatrix,rows,cols)
            }
            // } else if(direction == "up") {
            //     console.log(i-1,j);
            // }
        }
        //this.game.state.start("InitGame");
    }
};