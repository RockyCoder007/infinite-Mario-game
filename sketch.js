var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided,bg,bg2;
var ground, invisibleGround, groundImage;

var coinGroup, coinImage,coinSound;
var obstaclesGroup, obstacle2, obstacle1,obstacle3,life;
life=3;
var score=0;


var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  bg=loadImage("backg.jpg");
  mario_running = loadAnimation("Capture1.png","Capture3.png","Capture4.png");
  coinSound=loadSound("coin.wav");
  mario_collided = loadAnimation("mariodead.png");
  groundImage = loadImage("backg.jpg");
  
  coinImage = loadImage("coin.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle3 = loadImage("obstacle3.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
    bg2=createSprite(width/2,height/2,10,10);
  bg2.addImage("background",bg);
  mario = createSprite(50,height-(height/3),20,50);
  mario.addAnimation("running", mario_running);
  mario.scale = 0.5;
  ground = createSprite(0,height-(height/6.5),1600,10);
  bg2.x = bg2.width /2;

  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,gameOver.y+40);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background("lightblue");
  ground.visible=false;

  textSize(20);
  fill(255);

  drawSprites();
    text("Score: "+ score, width-100,40);
text("life: "+ life , width-100,60);
  if (gameState===PLAY){
      bg2.velocityX = -(6 + 3*score/100);
   //score = score + Math.round(getFrameRate()/60);
     if (mario.isTouching(coinGroup)){
    score=score+1;
       coinSound.play();
       coinGroup[0].destroy();
    
  }
    if(score >= 0){
      bg2.velocityX = -6;
    }else{
      bg2.velocityX = -(6 + 3*score/100);
    }

    if(touches.length>0||keyDown("space") && mario.y >= ground.y-51) {
      mario.velocityY = -12;
      touches=[];
    }

    mario.velocityY = mario.velocityY + 0.8
  
    if (bg2.x < 0){
      bg2.x = (bg2.width/2)-2;
    }
  
    mario.collide(ground);
    
    spawnCoin();
    spawnObstacles();

  
   if(obstaclesGroup.isTouching(mario)){
        life=life-1;
     gameState=END;
     
     obstaclesGroup[0].destroy();
    } 
  }
if(life===0){
  life=3;
  score=0;
  gameOver.visible = true;
}
  
else if (gameState === END) {

    bg2.velocityX=0;
    restart.visible = true;
    mario.addAnimation("collided", mario_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    mario.scale =0.35;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart )||touches.length>0) {
      reset();
      touches=[];
    }
  }

}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(width,120,40,10);
    coin.y = Math.round(random(height-(height/5),height-(height/3)));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = width/3;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
       
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-(height/5),10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  mario.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  

  
}