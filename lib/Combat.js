import rand from './rand.js';

export default class Combat {
  constructor(player,enemy) {
    this.player = player
    this.enemy = enemy
    this.turnCount = 1
  }

  get ended() {
    return this.enemy.isDead || this.player.isDead
  }

  turn(action) {
    if (this.enemy.isDead || this.player.isDead) return;
      this.turnCount += 1;
      let playerCrit = this.criticalHit(this.player);
      let enemyCrit = this.criticalHit(this.enemy);
      const escape = this.runConfirmed(this.player, this.enemy)
      const playerAnimation = []
      const enemyAnimation = []
      // player phase
      let playerHit
      if (action === 'run') {
        playerHit = false
        playerCrit = false
        this.player.turnDamage = NaN
        escape ? playerAnimation.push('run') : playerAnimation.push('run-failed')
      } else if (playerCrit) {
        playerHit = true
        this.player.turnDamage = this.player.attributes.atk * 3
      } else {
        playerHit = this.hitConfirmed(this.enemy, this.player);
        playerHit ? this.calculateDamage(this.enemy, this.player) : this.player.turnDamage = 'miss'
      }
      // applying damage to enemy
      this.applyDamage(this.enemy, this.player)
      if (action === 'attack') {
        if (this.enemy.isDead) {
          playerAnimation.push('player-atk')
          enemyAnimation.push('enemy-hit')
        } else {
          playerHit ? enemyAnimation.push('atk-hit') : enemyAnimation.push('atk-miss')
        }
        if (playerCrit) enemyAnimation.push('critical')
        }
      if (action === 'run' && !escape) {
        enemyAnimation.push('run-failed')
        if (enemyCrit) playerAnimation.push('critical')
      }
      // enemy phase
      let enemyHit
      if (action === 'run' && escape) {
        enemyHit = false
        this.enemy.turnDamage = NaN
      } else if (enemyCrit) {
        enemyHit = true
        this.enemy.turnDamage = this.enemy.attributes.atk * 3
      } else {
        enemyHit = this.hitConfirmed(this.player, this.enemy) || !escape
        enemyHit ? this.calculateDamage(this.player, this.enemy) : this.enemy.turnDamage = 'miss'
      }
      // applying damage to player
      if (action === 'attack') {
        enemyHit ? playerAnimation.push('atk-hit') : playerAnimation.push('atk-miss')
      }
      if (enemyCrit) playerAnimation.push('critical')

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

  calculateDamage(defender, attacker) {
    const damage = Math.round(attacker.attributes.atk - (defender.attributes.def/3));
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