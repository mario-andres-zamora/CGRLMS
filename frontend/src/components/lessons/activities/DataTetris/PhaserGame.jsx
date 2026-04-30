import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import MainScene from './MainScene';

const PhaserGame = ({ onScoreChange, onLinesChange, onSpeedChange, onIntegrityChange, onGameOver, difficulty, isMuted }) => {
  const gameRef = useRef(null);
  const phaserInstanceRef = useRef(null);

  useEffect(() => {
    if (phaserInstanceRef.current) {
        phaserInstanceRef.current.sound.mute = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (!gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#0a0a14',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: null
    };

    const game = new Phaser.Game(config);
    phaserInstanceRef.current = game;

    const setupListener = (scene) => {
        scene.events.on('score-changed', (score, combo) => {
            if (onScoreChange) onScoreChange(score, combo);
        });
        scene.events.on('integrity-changed', (integrity) => {
            if (onIntegrityChange) onIntegrityChange(integrity);
        });
        scene.events.on('game-over', (finalScore) => {
            if (onGameOver) onGameOver(finalScore);
        });
        scene.events.on('lines-changed', (lines) => {
            if (onLinesChange) onLinesChange(lines);
        });
        scene.events.on('speed-changed', (speed) => {
            if (onSpeedChange) onSpeedChange(speed);
        });
    };

    game.events.on('ready', () => {
        game.registry.set('difficulty', difficulty);
        game.scene.add('MainScene', MainScene, true, { difficulty });
        
        // Sync initial mute state
        game.sound.mute = isMuted;

        // Short delay to ensure scene is active
        setTimeout(() => {
            const scene = game.scene.getScene('MainScene');
            if (scene) setupListener(scene);
        }, 50);
    });

    return () => {
      if (phaserInstanceRef.current) {
        phaserInstanceRef.current.destroy(true);
        phaserInstanceRef.current = null;
      }
    };
  }, [difficulty]); // Restart game if difficulty changes while playing (though usually handled by start screen)

  return (
    <div className="phaser-container">
        <div ref={gameRef} className="phaser-canvas-wrapper" />
    </div>
  );
};

export default PhaserGame;
