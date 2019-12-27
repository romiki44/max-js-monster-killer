const ATTACK_VALUE=10;
const STRONG_ATTACK_VALUE=17;
const MONSTER_ATTACK_VALUE=14;
const HEAL_VALUE=20;

const MODE_ATTACK='ATTACK';
const MODE_STRONG_ATTACK='STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK='PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK='PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK='MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL='PLAYER_HEAL';
const LOG_EVENT_GAME_OVER='GAME_OVER';

let battleLog=[];

function getMaxLifeValues() {
  const enteredValue=prompt('Maximum life for you and the monster', '100');
  let parsedValue=parseInt(enteredValue);
  if(isNaN(parsedValue) || parsedValue<=0) {
    throw {message: 'Invalid user input'};
  }
  return parsedValue;
}

let chosenMaxLife;
try {
  chosenMaxLife=getMaxLifeValues();
} catch(error) {
  console.log(error);
  alert('You enterd wrong input value, default value of 100 was used.');
  chosenMaxLife=100;
} finally {
  // finally...
}

let currentMonsterHealth=chosenMaxLife;
let currentPlayerHealth=chosenMaxLife;
let hasBonusLife=true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
  const logEntry={
    event: event,
    value: value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  };

  switch(event) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target='MONSTER';
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target='MONSTER';
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target='PLAYER';
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target='PLAYER';
      break;
  }
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth=chosenMaxLife;
  currentPlayerHealth=chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth=currentPlayerHealth;
  const playerDamage=dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

  if(currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife=false;
    removeBonusLife();
    currentPlayerHealth=initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('You would be dead but the bonus life saved you!');
  }

  if(currentMonsterHealth <= 0 && currentPlayerHealth>0) {
    alert("You won!");
    writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth);
  } else if(currentPlayerHealth <=0 && currentMonsterHealth>0) {
    alert('You lost!');
    writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth);
  } else if(currentPlayerHealth<=0 && currentMonsterHealth<=0) {
    alert('You have a draw!');
    writeToLog(LOG_EVENT_GAME_OVER, 'A DRAW', currentMonsterHealth, currentPlayerHealth);
  }

  if(currentPlayerHealth<=0 || currentPlayerHealth<=0) {
    reset();
  }
}

function attackMonster(mode) {
  const maxDamage = mode==MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent = mode==MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
  const damage=dealMonsterDamage(maxDamage);
  currentMonsterHealth -=damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHnadler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function heealPlayerHandler() {
  let healValue;
  if(currentPlayerHealth>=chosenMaxLife-HEAL_VALUE) {
    alert("You can't heal more than your max initial health");
    healValue=chosenMaxLife-currentPlayerHealth;
  } else {
    healValue=HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth +=healValue;
  writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function printLogHandler() {
  for(let i=0; i< 3; i++) {
    console.log('----------------')
  }
  // for(const logEntry of battleLog) {
  //   console.log(logEntry);
  // }
  // for(let i=0; i<battleLog.length;i++) {
  //   console.log(battleLog[i]);
  // }
  //console.log(battleLog);

  let i=0;
  for(const logEntry of battleLog) {
    console.log(`#${i}`);
    for(const key in logEntry) {
      console.log(`${key}: ${logEntry[key]}`);
    }
    i++;
  }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHnadler);
healBtn.addEventListener('click', heealPlayerHandler);
logBtn.addEventListener('click', printLogHandler);