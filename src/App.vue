<!--
 * @Author: lidan6
 * @Date: 2022-03-25 15:27:43
 * @LastEditors: lidan
 * @LastEditTime: 2022-04-02 17:55:08
 * @Description: 
-->
<script setup>
  import {
    ref,
    onMounted
  } from 'vue'
  import {
    resource,
    RESOURCE_TYPE,
    Game,
    GameObject,
    LOAD_EVENT
  } from '@eva/eva.js'
  import {
    RendererSystem
  } from '@eva/plugin-renderer'
  import {
    Render,
    RenderSystem
  } from '@eva/plugin-renderer-render'
  import {
    Img,
    ImgSystem
  } from '@eva/plugin-renderer-img'
  import {
    Transition,
    TransitionSystem
  } from '@eva/plugin-transition'
  import {
    TilingSprite,
    TilingSpriteSystem
  } from '@eva/plugin-renderer-tiling-sprite'
  import {
    SpriteAnimation,
    SpriteAnimationSystem
  } from "@eva/plugin-renderer-sprite-animation";
  import {PhysicsSystem, Physics, PhysicsType} from '@eva/plugin-matterjs';
  import gameResource from './utils/resource.js'
  resource.addResource(gameResource);
  resource.on(LOAD_EVENT.START, () => {}) // 开始loader
  resource.on(LOAD_EVENT.PROGRESS, (num) => {}) // 加载进度更新
  resource.on(LOAD_EVENT.LOADED, () => {}) // 某文件加载成功
  resource.on(LOAD_EVENT.COMPLETE, () => {}) // 加载完成
  resource.on(LOAD_EVENT.ERROR, () => {}) // 某文件加载失败
  resource.preload()

  let container = ref(null);
  let canvasW = 750
  let canvasH = 0
  let game;
  let groundSprite;

  const createBg = () => {
    const bgObject = new GameObject('bg', {
      size: {
        width: canvasW,
        height: canvasH,
      }
    })
    bgObject.addComponent(
      new Img({
        resource: 'bg'
      })
    )
    game.scene.addChild(bgObject);
    const ground = new GameObject('sprite', {
      size: {
        width: canvasW,
        height: canvasH / 6
      },
      anchor: {
        x: 0.5,
        y: 1,
      },
      origin: {
        x: 0.5,
        y: 0.5
      },
    })
    ground.addComponent( 
      new Physics({
        type: PhysicsType.RECTANGLE,
        bodyOptions: {
            isStatic: true, // 物体是否静止，静止状态下任何作用力作用于物体都不会产生效果
        },
      }),
    )
    groundSprite = new TilingSprite({
      resource: 'ground',
      tileScale: {
        x: 1,
        y: 1
      },
      tilePosition: {
        x: 0,
        y: 0
      }
    })
    ground.addComponent(groundSprite)
    bgObject.addChild(ground)  
  }
  const createBird = ()=>{
    const birdObject = new GameObject('bird', {
      size: {
        width: 88,
        height: 66,
      },
      origin: {
        x: 0.5,
        y: 0.5
      },
      position: {
        x: canvasW / 2,
        y: canvasH / 2
      },

    })
    birdObject.addComponent(
      new SpriteAnimation({
        resource: "bird",
        speed: 500,
      })
    )
    const birdPhysics = birdObject.addComponent(
      new Physics({
        type: PhysicsType.RECTANGLE,
        bodyOptions: {
            isStatic: false, // 物体是否静止，静止状态下任何作用力作用于物体都不会产生效果
            restitution: 0.8,
            frictionAir: 0.1,
            friction: 0,
            frictionStatic: 0,
            force: {
              x: 0,
              y: 0,
            },
        },
        stopRotation: true, // 默认false，通常不用设置
      }),
    )
    game.scene.addChild(birdObject) 
    birdPhysics.on('collisionStart', (gameObject1, gameObject2) => {
      console.log(gameObject1)
      console.log(gameObject2)
    });

  }
  const updateRender = ()=>{
    requestAnimationFrame(updateRender)
    console.log(groundSprite)
    groundSprite.tilePosition.x -= 1;
  }
  onMounted(() => {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    canvasH = (screenHeight / screenWidth) * 750
    // 创建游戏对象
    game = new Game({
      frameRate: 60, // 可选，游戏帧率，默认60
      autoStart: true, // 可选，自动开始
      systems: [
        new RendererSystem({
          canvas: container.value, // 可选，自动生成 canvas 挂在 game.canvas 上
          width: canvasW,
          height: canvasH,
          transparent: false,
          enableScroll: false, // 允许页面滚动
          renderType: 0, // 0:自动判断，1: WebGL，2:Canvas，建议android6.1 ios9 以下使用Canvas，需业务判断。
          resolution: 2,
        }),
        new RenderSystem(),
        new ImgSystem(),
        new TilingSpriteSystem(),
        new TransitionSystem(),
        new SpriteAnimationSystem(),
        new PhysicsSystem({
          resolution: 2, // 保持RendererSystem的resolution一致
          // isTest: true, // 是否开启调试模式
          // element: document.getElementById('game-container'), // 调试模式下canvas节点的挂载点
          world: {
            gravity: {
              y: 2, // 重力
            },
          },
          mouse: {
            open: true,
          },
        }),
      ]
    })
    createBg()
    createBird();
    updateRender();
  })

  const setRem = () => {
    let docEl = document.documentElement;
    let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    let recalc = function () {
      let clientWidth = docEl.clientWidth;
      if (!clientWidth) {
        return;
      }
      let fsize = 100 * (clientWidth / 750);
      if (fsize > 50) {
        fsize = 50;
      }
      docEl.style.fontSize = fsize + 'px';
    };
    if (!document.addEventListener) {
      return;
    }
    recalc();
    window.addEventListener(resizeEvt, recalc, false);
    document.addEventListener('DOMContentLoaded', recalc, false);
  }
</script>

<template>
  <canvas class="container" ref="container"></canvas>
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .container {
    width: 100%;
    height: 100%;
  }
</style>