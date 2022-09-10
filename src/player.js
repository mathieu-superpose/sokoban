import * as PIXI from "pixi.js";
import { Container } from '@pixi/display';

const PLAYER_SPEED = 3;

export function addPlayer(app) {
  const player = getPlayer(app);

  player.container.x = app.view.width / 2;
  player.container.y = app.view.height - 150;
  app.stage.addChild(player.container);

  const { container: playerContainer, inputs: playerInputs } = player;

  app.ticker.add((timeDelta) => {
    const previousPos = {x: playerContainer.x, y: playerContainer.y}

    if (playerInputs.has("moveUp")) {
        playerContainer.y -= timeDelta * PLAYER_SPEED;
        if(player.direction !== 'up') {
            playerContainer.children.pop();
            player.animations.back.play();
            playerContainer.addChild(player.animations.back);
            player.direction = 'up';
        }
    }
    if (playerInputs.has("moveDown")) {
        playerContainer.y += timeDelta * PLAYER_SPEED;
        if(player.direction !== 'down') {
            playerContainer.children.pop();
            player.animations.front.play();
            playerContainer.addChild(player.animations.front);
            player.direction = 'down';
        }
    }
    if (playerInputs.has("moveLeft")) {
        playerContainer.x -= timeDelta * PLAYER_SPEED;
        if(player.direction !== 'left') {
            playerContainer.children.pop();
            player.animations.left.play();
            playerContainer.addChild(player.animations.left);
            player.direction = 'left';
        }
    }
    if (playerInputs.has("moveRight")) {
        playerContainer.x += timeDelta * PLAYER_SPEED;
        if(player.direction !== 'right') {
            playerContainer.children.pop();
            player.animations.right.play();
            playerContainer.addChild(player.animations.right);
            player.direction = 'right';
        }
    }

    // clamp player to screen
    playerContainer.x = Math.max(0, (Math.min(playerContainer.x, app.view.width - playerContainer.width)));
    playerContainer.y = Math.max(0, (Math.min(playerContainer.y, app.view.height - playerContainer.height)));

    const isMoving = Boolean(Math.abs(previousPos.x - playerContainer.x) + Math.abs(previousPos.y - playerContainer.y));
    if(!isMoving && playerContainer.children.length) {
        playerContainer.children[0].gotoAndStop(0);
    }
  });

  return player;
}

function getPlayer(app) {
    const player = {
        id: (Math.random() * 1000000).toFixed(),
        container: new Container(),
        inputs: getPlayerInputs(),
        direction: "down",
    };

    app.loader
    .add('assets/character/character-walk.json')
    .load((loader, resources) => {
        const sheet = resources['assets/character/character-walk.json'].spritesheet;

        const front = new PIXI.AnimatedSprite(sheet.animations["character-walk-front"])
        front.animationSpeed = 0.15
        const back = new PIXI.AnimatedSprite(sheet.animations["character-walk-back"])
        back.animationSpeed = 0.15
        const left = new PIXI.AnimatedSprite(sheet.animations["character-walk-left"])
        left.animationSpeed = 0.15
        const right = new PIXI.AnimatedSprite(sheet.animations["character-walk-right"])
        right.animationSpeed = 0.15
        player.animations = { front, back, left, right };

        const walkFrontTextures = resources['assets/character/character-walk.json'].data.animations['character-walk-front'].map(img => PIXI.Texture.from(img))
        const walkFrontAnim = new PIXI.AnimatedSprite(walkFrontTextures);
        walkFrontAnim.animationSpeed = 0.15;
        player.container.addChild(walkFrontAnim);
    });
    
    return player
}

const keyToMoveMap = {
  ArrowUp: "moveUp",
  ArrowDown: "moveDown",
  ArrowLeft: "moveLeft",
  ArrowRight: "moveRight",
};

function getPlayerInputs() {
  const playerInputs = new Set();
  const handleKeyDown = ({ key }) => {
    if (keyToMoveMap[key]) playerInputs.add(keyToMoveMap[key]);
  };
  const handleKeyUp = ({ key }) => {
    if (keyToMoveMap[key]) playerInputs.delete(keyToMoveMap[key]);
  };
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  return playerInputs;
}
