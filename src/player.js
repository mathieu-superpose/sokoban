import * as PIXI from "pixi.js";
import { Container } from '@pixi/display';

const PLAYER_SPEED = 3;
const PLAYER_SCALE = 2;

export function addPlayer(app) {
  const player = getPlayer(app);

  player.container.x = app.view.width / 2;
  player.container.y = app.view.height - 150;
  app.stage.addChild(player.container);

  const { container: playerContainer, inputs: playerInputs } = player;

  app.ticker.add((timeDelta) => {

    if (playerInputs.has("moveUp")) {
        playerContainer.y -= timeDelta * PLAYER_SPEED;
        //animation.x -= timeDelta * PLAYER_SPEED;
    }
    if (playerInputs.has("moveDown")) {
        playerContainer.y += timeDelta * PLAYER_SPEED;
        //animation.x += timeDelta * PLAYER_SPEED;
    }
    if (playerInputs.has("moveLeft"))
    playerContainer.x -= timeDelta * PLAYER_SPEED;

    if (playerInputs.has("moveRight"))
    playerContainer.x += timeDelta * PLAYER_SPEED;


    // clamp player to screen
    playerContainer.x = Math.max(0, (Math.min(playerContainer.x, app.view.width - playerContainer.width)))
    playerContainer.y = Math.max(0, (Math.min(playerContainer.y, app.view.height - playerContainer.height)))
  });

  return player;
}

function getPlayer(app) {
    const player = {
        id: (Math.random() * 1000000).toFixed(),
        container: new Container(),
        inputs: getPlayerInputs(),
    };

    app.loader
    .add('assets/character/character-walk.json')
    .load((loader, resources) => {
        const walkFrontTextures = resources['assets/character/character-walk.json'].data.animations['character-walk-front'].map(img => PIXI.Texture.from(img))
        const walkFrontAnim = new PIXI.AnimatedSprite(walkFrontTextures);
        walkFrontAnim.animationSpeed = 0.15;
        walkFrontAnim.play();
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
