import rand from './rand.js';

export default class Combat {
  constructor(player,enemy) {
    this.player = player
    this.enemy = enemy
    this.turnCount = 1
    this.skillTurnCount = 0
  }

  get ended() {
    return this.enemy.isDead || this.player.isDead
  }

  turn(action) {
    if (this.enemy.isDead || this.player.isDead) return;
      this.turnCount += 1;
      let playerCrit = this.criticalHit(this.player);
      let enemyCrit = this.criticalHit(this.enemy);
      const escape = this.runConfirmed(this.player, this.enemy);
      const playerAnimation = []
      const enemyAnimation = []
      // player phase
      let playerHit
      switch (action) {
        case 'run':
          playerHit = false
          playerCrit = false
          this.player.turnDamage = NaN
          if (escape) {
            playerAnimation.push('run')
          } else {
            playerAnimation.push('run-failed')
            // run fails get hit
            enemyAnimation.push('run-failed');
            if (enemyCrit) playerAnimation.push('critical');
          }
          break;
        case 'attack':
          if (playerCrit) {
            playerHit = true
            this.player.turnDamage = this.player.attributes.atk * 3
          } else {
            playerHit = this.hitConfirmed(this.enemy, this.player);
            playerHit ? this.calculateDamage(this.enemy, this.player) : this.player.turnDamage = 'miss'
          }
          break;
        case 'skill':
          playerHit = this.hitConfirmed(this.enemy, this.player);
          if (['ranger', 'cleric', 'bard', 'monk'].includes(this.player.job)) {
            // can't miss skills
            switch (this.player.job) {
              case 'ranger':
                playerCrit = rand(100) <= 30 // 30% chance to CRIT
                let atkModifier = 1.5
                if (playerCrit) {
                  atkModifier = 4.5
                  playerHit = true
                }
                this.calculateDamage(this.enemy, this.player, atkModifier)
                break;
              case 'cleric':
                this.player.hp += this.player.max_hp * .2
                playerHit = false
                playerCrit = false
                this.player.turnDamage = NaN
                break;
              case 'monk':
                this.calculateDamage(this.enemy, this.player, false, this.enemy.attributes.atk)
                break;
              case 'bard':
                this.skillTurnCount = 5;
                break;
              default:
                break;
            }
          } else if (playerHit) {
            switch (this.player.job) {
              case 'warrior':
                this.calculateDamage(this.enemy, this.player, false, 2)
                break;
              case 'ninja':
                const ignoreDef = rand(100) <= 30 // 30% chance to ignore enemy DEF
                let defModifier = ignoreDef ? 0 : 1
                this.calculateDamage(this.enemy, this.player, defModifier, 1.5)
                break;
              case 'beastmaster':
                if (playerCrit) {
                  playerHit = true
                  this.calculateDamage(this.enemy, this.player, false, 4.5)
                } else {
                  this.calculateDamage(this.enemy, this.player, false, 1.5)
                }
                break;
              case 'mage':
                this.calculateDamage(this.enemy, this.player, false, 1.5)
                break;
              default:
                break;
            }
          } else {
            this.player.turnDamage = 'miss'
          }
          break;
        default:
          break;
      }

      // applying damage to enemy
      this.applyDamage(this.enemy, this.player)
      if (action === 'skill' && ['cleric', 'bard'].includes(this.player.job)) {
        switch (this.player.job) {
          case 'cleric':
          case 'bard':
            playerAnimation.push('heal');
            // run fails get hit
            enemyAnimation.push('run-failed');
            break;
          default:
            break;
          }
      } else if (action !== 'run') {
        if (this.enemy.isDead) {
          playerAnimation.push('player-atk');
          enemyAnimation.push('enemy-hit');
        } else {
          playerHit ? enemyAnimation.push('atk-hit') : enemyAnimation.push('atk-miss');
        }
        if (playerCrit) enemyAnimation.push('critical');
      }
      // enemy phase
      if (!this.enemy.isDead) {
        let enemyHit
        if (action === 'run' && escape) {
          enemyHit = false
          this.enemy.turnDamage = NaN
        } else if (enemyCrit) {
          enemyHit = true
          this.enemy.turnDamage = this.enemy.attributes.atk * 3
        } else {
          enemyHit = this.hitConfirmed(this.player, this.enemy) || !escape
          if (enemyHit) {
            if (['monk','necromancer'].includes(this.player.job) && action === 'skill') {
              if (this.player.job === "monk") {
                // monk
                this.calculateDamage(this.player, this.enemy, 2, false)
              } else {
                // necromancer
                this.calculateDamage(this.player, this.enemy, 999, false)
              }
            } else {
              // all other classes
              this.calculateDamage(this.player, this.enemy, false, false)
            }
          } else {
            this.enemy.turnDamage = 'miss'
          } 
        }
        // applying damage to player
        if (['attack', 'skill'].includes(action)) {
          enemyHit ? playerAnimation.push('atk-hit') : playerAnimation.push('atk-miss')
        }
        if (enemyCrit) playerAnimation.push('critical')
      }

      if (this.skillTurnCount > 0) this.skillTurnCount -= 1;

      return {
        player: playerAnimation,
        enemy: enemyAnimation,
        escape: escape
      }
  }

  hitConfirmed(defender, attacker) {
    return rand(attacker.attributes.dex) >= Math.floor(defender.attributes.agi/3)
  }

  runConfirmed(defender, attacker) {
    return rand(defender.attributes.agi) > Math.floor(attacker.attributes.agi/3) + 1
  }

  criticalHit(attacker) {
    return Math.round(attacker.attributes.luk) > rand(100)
  }

  calculateDamage(defender, attacker, def_modifier = false, atk_modifier = false) {
    let damage
    if (attacker.job === 'mage') {
      damage = Math.round((atk_modifier !== false ? attacker.attributes.mag * atk_modifier : attacker.attributes.mag) - (def_modifier !== false ? defender.attributes.mag/3 * def_modifier : defender.attributes.mag/3));
    } else {
      damage = Math.round((atk_modifier !== false ? attacker.attributes.atk * atk_modifier : attacker.attributes.atk) - (def_modifier !== false ? defender.attributes.def/3 * def_modifier : defender.attributes.def/3));
    }
    attacker.turnDamage = damage
  }

  applyDamage(defender, attacker) {
    if (Number(attacker.turnDamage) == NaN) return
    const damage = attacker.turnDamage
    if (damage <= 0) {
      attacker.turnDamage = 1
      defender.hp -= 1
    } else if (damage > 0) {
      defender.hp -= damage;
    }
    if (defender.hp <= 0) {
      defender.hp = 0
      defender.isDead = true
    };
  }
}