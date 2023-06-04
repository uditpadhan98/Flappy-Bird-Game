let board;
let boardWidth=900;
let boardHeight=504;
let context;

let birdWidth=36; //width/height ratio=200/150=4/3
let birdHeight=27;
let birdX=boardWidth/10;
let birdY=boardHeight/2;
let birdImg;

let bird={
    x:birdX,
    y:birdY,
    width:birdWidth,
    height:birdHeight
}

//pipes
let pipeArray=[];
let pipeWidth=40; //width.height ratio=384/3072=1/8
let pipeHeight=320;
let pipeX=boardWidth;
let pipeY=0;

let topPipeImg;
let bottomPipeImg;

let gameOver=false;
let score=0;

//physics
let velocityX=-2;//pipes moving left speed
let velocityY=0;//bird jump speed
let gravity=0.4;

window.onload=function(){
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");//used for drawing on the board

    //draw flappy bird
    // context.fillStyle="green";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //load images
    birdImg=new Image();
    birdImg.src="./Flappy-Bird.png";
    birdImg.onload=function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    topPipeImg=new Image();
    topPipeImg.src="./toppipe.png";

    bottomPipeImg=new Image();
    bottomPipeImg.src="./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes,1500);

    document.addEventListener("keydown",moveBird);
}

function update(){
    requestAnimationFrame(update);

    if (gameOver){
        return;
    }

    context.clearRect(0,0,board.width,board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y=Math.max(bird.y+velocityY,0);//apply gravity to current bird.y,limit the bird.y to top of the canvas
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    if(bird.y>board.height){
        gameOver=true;
    }

    //pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe=pipeArray[i];
        pipe.x +=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x>pipe.x+pipe.width){
            score+=0.5;//0.5 because there are 2 pipes! so 0.5*2=1,1 for each set of pipes
            pipe.passed=true;
        }
        
        if(deleteCollision(bird,pipe)){
            gameOver=true;
        }
    }

    //clear pipes
    while(pipeArray.length>0 && pipeArray[0].x<-pipeWidth){
        pipeArray.shift();//removes first element from the array
    }

    //score
    context.fillStyle="white";
    context.font="45px sans-serif";
    context.fillText(score,5,45);

    if(gameOver){
        context.fillText("GAME OVER",5,90);
    }

}

function placePipes(){
    if(gameOver){
        return;
    }

    //(0-1)*pipeHeight/2
    //0 = -80 (pipeHeight/4)
    //1 = -80-160 (pipeHeight/4-pipeHeight/2)=-3/4 pipeHeight

    let randomPipeY=pipeY-pipeHeight/4 -Math.random()*(pipeHeight/2);
    let openingSpace=board.height/4;

    let topPipe={
        img:topPipeImg,
        x:pipeX,
        y:randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    }

    pipeArray.push(topPipe);

    let bottomPipe={
        img:bottomPipeImg,
        x:pipeX,
        y:randomPipeY+pipeHeight+openingSpace,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(e.code=="Space" || e.code=="ArrowUp" || e.code=="KeyX"){
        //jump
        velocityY=-6;

        //reset the game
        if(gameOver){
            bird.y=birdY;
            pipeArray=[];
            score=0;
            gameOver=false;
        }
    }
}

function deleteCollision(a,b){
    return a.x<b.x+b.width && //a's top left corner doesn't reach b's top right corner
            a.x+a.width>b.x && //a's top right corner passes b's top left corner
            a.y<b.y+b.height && //a's top left corner doesn't reach b's bottom left corner
            a.y+a.height>b.y; //a's bottom left corner passes b's top left corner
}