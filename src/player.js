import * as PIXI from "pixi.js";

const PLAYER_SPEED = 3;
const PLAYER_SCALE = 2;

export function addPlayer(app) {
  const player = getPlayer();
  app.stage.addChild(player.sprite);
  const { sprite: playerSprite, inputs: playerInputs } = player;
  player.sprite.x = app.view.width / 2;
  player.sprite.y = app.view.height - 150;

  app.ticker.add((timeDelta) => {
    if (playerInputs.has("moveUp"))
      playerSprite.y -= timeDelta * PLAYER_SPEED;
    if (playerInputs.has("moveDown"))
      playerSprite.y += timeDelta * PLAYER_SPEED;
    if (playerInputs.has("moveLeft"))
      playerSprite.x -= timeDelta * PLAYER_SPEED;
    if (playerInputs.has("moveRight"))
      playerSprite.x += timeDelta * PLAYER_SPEED;

    // clamp player to screen
    playerSprite.x = Math.max(0, (Math.min(playerSprite.x, app.view.width - playerSprite.width)))
    playerSprite.y = Math.max(0, (Math.min(playerSprite.y, app.view.height - playerSprite.height)))
  });

  return player;
}

function getPlayer() {
  return {
    id: (Math.random() * 1000000).toFixed(),
    sprite: getPlayerSprite(),
    inputs: getPlayerInputs(),
  };
}

function getPlayerSprite() {
  const playerSprite = PIXI.Sprite.from("character-front.png");
  playerSprite.transform.scale._x = PLAYER_SCALE
  playerSprite.transform.scale._y = PLAYER_SCALE
  return playerSprite;
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
