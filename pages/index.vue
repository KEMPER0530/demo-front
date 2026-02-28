<template>
  <div class="dashboard-page">
    <div class="ambient ambient-left" />
    <div class="ambient ambient-right" />
    <main class="dashboard-shell">
      <section class="hero fade-up">
        <p class="eyebrow">Dashboard</p>
        <h1>機能一覧</h1>
        <p>主要機能へアクセスできます。</p>
      </section>

      <section class="actions-grid">
        <nuxt-link to="/inquiry" class="action-card fade-up delay-1">
          <span class="action-label">メール送信機能</span>
          <small>お問い合わせフォームへ</small>
        </nuxt-link>
        <nuxt-link v-if="isLoggedInAndAllowed" to="/search" class="action-card fade-up delay-2">
          <span class="action-label">Qiita記事</span>
          <small>検索ページへ</small>
        </nuxt-link>
        <nuxt-link v-if="isLoggedInAndAllowed" to="/gpt" class="action-card fade-up delay-3">
          <span class="action-label">OpenAI</span>
          <small>チャットページへ</small>
        </nuxt-link>
        <button class="action-card logout-card fade-up delay-3" @click.prevent="$auth.logout()">
          <span class="action-label">Logout</span>
          <small>サインアウト</small>
        </button>
      </section>

      <section
        class="game-panel fade-up delay-2"
        tabindex="0"
        @click="focusAndJump"
      >
        <div class="game-head">
          <h2>Jump Run</h2>
          <p class="score-board">SCORE {{ score }} / BEST {{ bestScore }}</p>
        </div>
        <div class="control-hint">SPACE / ↑ JUMP ・ ↓ DUCK</div>
        <div class="difficulty-row">
          <span>Difficulty</span>
          <button
            v-for="level in difficulties"
            :key="level.id"
            :class="['difficulty-btn', { active: difficulty === level.id }]"
            @click.stop="setDifficulty(level.id)"
          >
            {{ level.label }}
          </button>
        </div>

        <div class="game-track">
          <div class="skyline" />
          <div class="sun" />
          <div class="cloud cloud-a" :style="{ transform: `translateX(${groundMotionX * 0.12}px)` }" />
          <div class="cloud cloud-b" :style="{ transform: `translateX(${groundMotionX * 0.18}px)` }" />
          <div class="mountains back" :style="{ transform: `translateX(${groundMotionX * 0.2}px)` }" />
          <div class="mountains front" :style="{ transform: `translateX(${groundMotionX * 0.35}px)` }" />
          <div class="trees" :style="{ transform: `translateX(${groundMotionX * 0.55}px)` }" />
          <div class="ground-line" />
          <div class="ground-motion" :style="{ backgroundPositionX: `${groundMotionX}px` }" />
          <div class="grass" :style="{ backgroundPositionX: `${groundMotionX * 1.1}px` }" />

          <div
            :class="['runner', { crouch: isCrouching && playerY === 0, running: isGameStarted && !isGameOver }]"
            :style="{
              bottom: `${groundOffset + playerY}px`,
              transform: `translateX(${runnerOffsetX}px)`
            }"
          >
            <div class="runner-sprite">
              <img class="runner-img" :src="runnerSpriteSrc" alt="runner" />
            </div>
          </div>

          <div
            v-for="ob in obstacles"
            :key="ob.id"
            :class="['obstacle', `obstacle-${ob.type}`]"
            :style="{
              left: `${ob.x}px`,
              width: `${ob.width}px`,
              height: `${ob.height}px`,
              bottom: `${groundOffset + ob.yOffset}px`
            }"
          >
            <span v-if="ob.type === 'barrel'" class="barrel-ring" />
          </div>
        </div>

        <div class="game-overlay" v-if="!isGameStarted">
          <p>Press Space to Start</p>
        </div>
        <div class="game-overlay game-over" v-if="isGameOver">
          <p>Game Over</p>
          <small>Spaceで再スタート</small>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      gameWidth: 980,
      groundOffset: 22,
      playerX: 72,
      playerY: 0,
      playerW: 58,
      playerH: 74,
      crouchH: 46,
      isCrouching: false,
      velocityY: 0,
      gravity: 1900,
      jumpPower: 760,
      baseSpeed: 300,
      obstacleGapMin: 90,
      obstacleGapRange: 160,
      speedRamp: 7,
      score: 0,
      bestScore: 0,
      isGameStarted: false,
      isGameOver: false,
      obstacles: [] as Array<{
        id: number;
        x: number;
        width: number;
        height: number;
        type: 'barrel' | 'fire';
        yOffset: number;
        phase: number;
      }>,
      nextObstacleId: 1,
      groundMotionX: 0,
      runnerOffsetX: 0,
      runPhase: 0,
      runFrameTimer: 0,
      runFrameIndex: 0,
      difficulty: 'normal',
      difficulties: [
        { id: 'easy', label: 'Easy' },
        { id: 'normal', label: 'Normal' },
        { id: 'hard', label: 'Hard' },
      ],
      rafId: 0 as number,
      lastTime: 0,
    };
  },
  computed: {
    isLoggedInAndAllowed(): boolean {
      return Boolean(this.$auth.loggedIn && (this.$auth.user as any).cognito.username === this.$config.allowedUsername);
    },
    runnerSpriteSrc(): string {
      if (this.isCrouching && this.playerY === 0) {
        return '/game/runner-duck.png';
      }
      if (this.playerY > 0) {
        return '/game/runner-jump.png';
      }
      return this.runFrameIndex % 2 === 0
        ? '/game/runner-run.png'
        : '/game/runner-run-right.png';
    },
  },
  mounted() {
    if (typeof window !== 'undefined') {
      const best = window.localStorage.getItem('jump_run_best');
      this.bestScore = best ? Number(best) : 0;
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);
      this.seedObstacles();
      this.rafId = window.requestAnimationFrame((t: number) => this.tick(t));
    }
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('keyup', this.onKeyUp);
      window.cancelAnimationFrame(this.rafId);
    }
  },
  methods: {
    seedObstacles() {
      this.obstacles = [];
      let x = this.gameWidth * 0.72;
      for (let i = 0; i < 2; i += 1) {
        const ob = this.generateObstacle(x);
        this.obstacles.push(ob);
        x += this.obstacleGapMin + Math.random() * this.obstacleGapRange;
      }
    },
    generateObstacle(startX: number) {
      const fireChance = this.difficulty === 'hard' ? 0.45 : this.difficulty === 'normal' ? 0.33 : 0.2;
      const type = (Math.random() < fireChance ? 'fire' : 'barrel') as 'barrel' | 'fire';
      if (type === 'fire') {
        return {
          id: this.nextObstacleId++,
          x: startX,
          width: 26,
          height: 34 + Math.floor(Math.random() * 18),
          type,
          yOffset: 8,
          phase: Math.random() * Math.PI,
        };
      }
      return {
        id: this.nextObstacleId++,
        x: startX,
        width: 30 + Math.floor(Math.random() * 18),
        height: 38 + Math.floor(Math.random() * 24),
        type,
        yOffset: 0,
        phase: 0,
      };
    },
    setDifficulty(levelId: string) {
      if (this.difficulty === levelId) {
        return;
      }
      this.difficulty = levelId;
      this.applyDifficulty();
      this.resetGame();
      this.isGameStarted = false;
    },
    applyDifficulty() {
      if (this.difficulty === 'easy') {
        this.baseSpeed = 250;
        this.gravity = 1700;
        this.jumpPower = 760;
        this.obstacleGapMin = 148;
        this.obstacleGapRange = 92;
        this.speedRamp = 4.5;
        return;
      }
      if (this.difficulty === 'hard') {
        this.baseSpeed = 360;
        this.gravity = 2050;
        this.jumpPower = 780;
        this.obstacleGapMin = 122;
        this.obstacleGapRange = 72;
        this.speedRamp = 6.5;
        return;
      }

      this.baseSpeed = 305;
      this.gravity = 1900;
      this.jumpPower = 760;
      this.obstacleGapMin = 136;
      this.obstacleGapRange = 84;
      this.speedRamp = 5.2;
    },
    onKeyDown(e: KeyboardEvent) {
      if (e.code === 'ArrowDown') {
        this.isCrouching = true;
        return;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.jumpOrStart();
      }
    },
    onKeyUp(e: KeyboardEvent) {
      if (e.code === 'ArrowDown') {
        this.isCrouching = false;
      }
    },
    focusAndJump() {
      this.jumpOrStart();
    },
    jumpOrStart() {
      if (!this.isGameStarted || this.isGameOver) {
        this.resetGame();
        this.isGameStarted = true;
        return;
      }

      if (this.playerY === 0 && !this.isCrouching) {
        this.velocityY = this.jumpPower;
      }
    },
    resetGame() {
      this.applyDifficulty();
      this.playerY = 0;
      this.velocityY = 0;
      this.isCrouching = false;
      this.seedObstacles();
      this.groundMotionX = 0;
      this.runPhase = 0;
      this.runFrameTimer = 0;
      this.runFrameIndex = 0;
      this.runnerOffsetX = 0;
      this.score = 0;
      this.lastTime = 0;
      this.isGameOver = false;
    },
    tick(time: number) {
      const dtRaw = this.lastTime ? (time - this.lastTime) / 1000 : 0;
      const dt = Math.min(dtRaw, 0.03);
      this.lastTime = time;

      if (this.isGameStarted && !this.isGameOver) {
        this.updatePhysics(dt);
        this.updateObstacle(dt);
        this.updateRunnerEffect(dt);
        this.detectCollision();
      }

      this.rafId = window.requestAnimationFrame((t: number) => this.tick(t));
    },
    updatePhysics(dt: number) {
      this.velocityY -= this.gravity * dt;
      this.playerY += this.velocityY * dt;
      if (this.playerY < 0) {
        this.playerY = 0;
        this.velocityY = 0;
      }
    },
    updateObstacle(dt: number) {
      const speed = this.baseSpeed + this.score * this.speedRamp;
      this.groundMotionX -= speed * dt;

      for (let i = 0; i < this.obstacles.length; i += 1) {
        const ob = this.obstacles[i];
        ob.x -= speed * dt;
        ob.phase += dt * (this.difficulty === 'hard' ? 14 : 11);
        if (ob.type === 'fire') {
          ob.yOffset = 4 + Math.abs(Math.sin(ob.phase)) * (this.difficulty === 'hard' ? 20 : 14);
        } else {
          ob.yOffset = 0;
        }

        if (ob.x < -ob.width) {
          const farthestX = this.obstacles.reduce((max, current) => Math.max(max, current.x), this.gameWidth);
          const nextX = farthestX + this.obstacleGapMin + Math.random() * this.obstacleGapRange;
          this.obstacles[i] = this.generateObstacle(nextX);
          this.score += 1;
          if (this.score > this.bestScore) {
            this.bestScore = this.score;
            window.localStorage.setItem('jump_run_best', String(this.bestScore));
          }
        }
      }
    },
    updateRunnerEffect(dt: number) {
      this.runPhase += dt * 8;
      this.runnerOffsetX = Math.sin(this.runPhase) * 0.7;
      if (this.playerY === 0 && !this.isCrouching) {
        this.runFrameTimer += dt;
        if (this.runFrameTimer >= 0.16) {
          this.runFrameTimer = 0;
          this.runFrameIndex = (this.runFrameIndex + 1) % 2;
        }
      } else {
        this.runFrameTimer = 0;
      }
    },
    currentPlayerHeight() {
      return this.isCrouching && this.playerY === 0 ? this.crouchH : this.playerH;
    },
    currentPlayerTop() {
      const effectiveH = this.currentPlayerHeight();
      return this.playerY + effectiveH;
    },
    currentPlayerBottom() {
      return this.playerY;
    },
    currentPlayerWidth() {
      return this.isCrouching && this.playerY === 0 ? this.playerW + 6 : this.playerW;
    },
    currentPlayerX() {
      return this.playerX;
    },
    detectCollision() {
      const playerX = this.currentPlayerX();
      const playerW = this.currentPlayerWidth();
      const playerBottom = this.currentPlayerBottom();
      const playerTop = this.currentPlayerTop();

      for (let i = 0; i < this.obstacles.length; i += 1) {
        const ob = this.obstacles[i];
        const overlapX = playerX < ob.x + ob.width && playerX + playerW > ob.x;
        const obstacleBottom = ob.yOffset;
        const obstacleTop = ob.yOffset + ob.height;
        const overlapY = playerBottom < obstacleTop - 1 && playerTop > obstacleBottom + 1;
        if (overlapX && overlapY) {
          this.isGameOver = true;
          break;
        }
      }
    },
  },
});
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  color: #f7fbff;
  background:
    radial-gradient(circle at 10% 12%, rgba(0, 221, 255, 0.2), transparent 38%),
    radial-gradient(circle at 88% 75%, rgba(255, 161, 0, 0.2), transparent 42%),
    linear-gradient(135deg, #0a172e, #101626 44%, #141112 100%);
}

.ambient {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(2px);
  animation: float 10s ease-in-out infinite;
}

.ambient-left {
  width: 370px;
  height: 370px;
  top: -110px;
  left: -80px;
  background: radial-gradient(circle at 40% 35%, rgba(18, 242, 255, 0.35), rgba(17, 112, 255, 0.02) 68%);
}

.ambient-right {
  width: 330px;
  height: 330px;
  right: -90px;
  bottom: -70px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 174, 0, 0.35), rgba(255, 80, 0, 0.03) 72%);
  animation-delay: -3s;
}

.dashboard-shell {
  width: min(1160px, 100%);
  margin: 0 auto;
  padding: clamp(1.2rem, 2.6vw, 2.2rem);
  position: relative;
  z-index: 1;
}

.hero {
  margin-top: 0.7rem;
  margin-bottom: 1.2rem;
  padding: clamp(1.2rem, 2.2vw, 1.9rem);
  border-radius: 20px;
  border: 1px solid rgba(145, 195, 255, 0.24);
  background: linear-gradient(148deg, rgba(6, 24, 53, 0.7), rgba(17, 20, 30, 0.66));
  box-shadow: 0 15px 34px rgba(0, 0, 0, 0.32);
}

.hero h1 {
  margin: 0.2rem 0 0.65rem;
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  line-height: 1.22;
}

.hero p {
  margin: 0;
  color: rgba(223, 235, 251, 0.92);
  line-height: 1.7;
}

.eyebrow {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(119, 217, 255, 0.95);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 12px;
  margin-bottom: 1rem;
}

.action-card {
  border: 1px solid rgba(161, 210, 255, 0.24);
  border-radius: 16px;
  text-decoration: none;
  color: #ffffff;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: linear-gradient(132deg, rgba(13, 43, 89, 0.8), rgba(18, 22, 34, 0.8));
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.26);
  transition: transform 0.24s ease, filter 0.24s ease, border-color 0.24s ease;
}

.action-card:hover {
  transform: translateY(-2px) scale(1.01);
  filter: saturate(1.1);
  border-color: rgba(211, 237, 255, 0.55);
}

.action-label {
  font-weight: 700;
  font-size: 1.08rem;
}

.action-card small {
  opacity: 0.82;
  margin-top: 0.28rem;
}

.logout-card {
  cursor: pointer;
  width: 100%;
  text-align: left;
  background: linear-gradient(132deg, rgba(111, 27, 34, 0.86), rgba(39, 16, 20, 0.84));
}

.game-panel {
  position: relative;
  border-radius: 20px;
  border: 1px solid rgba(158, 210, 255, 0.22);
  background: linear-gradient(145deg, rgba(8, 26, 57, 0.72), rgba(15, 18, 26, 0.78));
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.3);
  padding: 0.9rem;
}

.game-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.game-head h2 {
  margin: 0;
  font-size: 1.1rem;
}

.score-board {
  margin: 0;
  color: #f8d089;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.control-hint {
  margin-bottom: 0.5rem;
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  color: rgba(206, 226, 251, 0.9);
}

.difficulty-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.6rem;
  color: rgba(224, 238, 255, 0.95);
}

.difficulty-btn {
  border: 1px solid rgba(173, 216, 255, 0.28);
  background: rgba(9, 21, 42, 0.62);
  color: #d7ecff;
  border-radius: 999px;
  padding: 0.28rem 0.72rem;
  font-size: 0.82rem;
  cursor: pointer;
}

.difficulty-btn.active {
  border-color: rgba(255, 201, 114, 0.7);
  color: #fff3d4;
  background: rgba(255, 138, 61, 0.28);
}

.game-track {
  width: 100%;
  height: 240px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  background:
    linear-gradient(to bottom, rgba(174, 233, 255, 0.8), rgba(123, 194, 255, 0.48) 52%, rgba(39, 81, 53, 0.18) 90%),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 0,
      rgba(255, 255, 255, 0.06) 8px,
      transparent 8px,
      transparent 16px
    );
}

.skyline {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(130, 198, 255, 0.18), transparent 55%);
}

.sun {
  position: absolute;
  width: 42px;
  height: 42px;
  right: 84px;
  top: 22px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fff7c2, #ffd068);
  box-shadow: 0 0 26px rgba(255, 209, 104, 0.6);
}

.cloud {
  position: absolute;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow:
    16px 0 0 0 rgba(255, 255, 255, 0.75),
    34px 0 0 0 rgba(255, 255, 255, 0.75);
}

.cloud-a {
  left: 180px;
  top: 34px;
  width: 30px;
  height: 14px;
}

.cloud-b {
  left: 520px;
  top: 56px;
  width: 26px;
  height: 12px;
}

.mountains {
  position: absolute;
  left: -20%;
  width: 140%;
  background-repeat: repeat-x;
}

.mountains.back {
  bottom: 62px;
  height: 90px;
  opacity: 0.6;
  background-image: linear-gradient(135deg, transparent 32%, #75ab88 32%, #75ab88 68%, transparent 68%);
  background-size: 110px 100%;
}

.mountains.front {
  bottom: 54px;
  height: 76px;
  opacity: 0.78;
  background-image: linear-gradient(135deg, transparent 28%, #4f8e68 28%, #4f8e68 72%, transparent 72%);
  background-size: 85px 100%;
}

.trees {
  position: absolute;
  left: -15%;
  right: -15%;
  bottom: 44px;
  height: 40px;
  opacity: 0.85;
  background:
    radial-gradient(circle at 25px 30px, #2f6f45 10px, transparent 11px),
    radial-gradient(circle at 75px 32px, #2b6841 9px, transparent 10px),
    radial-gradient(circle at 130px 29px, #326f47 11px, transparent 12px);
  background-size: 160px 100%;
  background-repeat: repeat-x;
}

.ground-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 22px;
  height: 2px;
  background: rgba(255, 255, 255, 0.38);
}

.ground-motion {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 28px;
  background:
    repeating-linear-gradient(
      90deg,
      #8b6a47 0,
      #8b6a47 18px,
      #75563b 18px,
      #75563b 36px
    );
}

.grass {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 22px;
  height: 14px;
  background:
    repeating-linear-gradient(
      90deg,
      #63b85d 0,
      #63b85d 8px,
      #56a950 8px,
      #56a950 16px
    );
}

.runner {
  position: absolute;
  left: 72px;
  width: 86px;
  height: 116px;
  border-radius: 0;
  image-rendering: auto;
  background: transparent;
  box-shadow: none;
  transition: bottom 0.05s linear, transform 0.05s linear, width 0.08s linear, height 0.08s linear;
}

.runner.running .runner-sprite {
  animation: runner-bob 0.2s linear infinite;
}

.runner.crouch {
  width: 96px;
  height: 72px;
}

.runner-sprite {
  position: relative;
  width: 100%;
  height: 100%;
}

.runner-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  image-rendering: pixelated;
  transform: scaleX(1);
}

.obstacle {
  position: absolute;
  border-radius: 5px;
  image-rendering: pixelated;
  transition: bottom 0.05s linear;
}

.obstacle-barrel {
  background: linear-gradient(140deg, #8a4a22, #5e2f16);
  border: 2px solid rgba(33, 14, 3, 0.7);
  box-shadow: 0 8px 16px rgba(39, 18, 5, 0.35);
}

.barrel-ring {
  position: absolute;
  left: 2px;
  right: 2px;
  top: 50%;
  height: 4px;
  margin-top: -2px;
  background: rgba(245, 207, 130, 0.85);
}

.obstacle-fire {
  background: linear-gradient(180deg, #ffd16a 0%, #ff9548 56%, #f84032 100%);
  border: 2px solid rgba(106, 28, 17, 0.8);
  border-radius: 50% 50% 42% 42%;
  box-shadow: 0 8px 18px rgba(255, 86, 48, 0.38);
}

.game-overlay {
  position: absolute;
  inset: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  pointer-events: none;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.game-overlay p {
  margin: 0;
  font-size: 1.2rem;
}

.game-overlay small {
  margin-top: 0.35rem;
  font-weight: 500;
  opacity: 0.9;
}

.game-over p {
  color: #ffb4be;
}

.fade-up {
  opacity: 0;
  transform: translateY(16px);
  animation: fade-up 0.72s ease forwards;
}

.delay-1 {
  animation-delay: 0.08s;
}

.delay-2 {
  animation-delay: 0.16s;
}

.delay-3 {
  animation-delay: 0.24s;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(12px, -10px) scale(1.04);
  }
}

@keyframes runner-bob {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(2px);
  }
}
</style>
