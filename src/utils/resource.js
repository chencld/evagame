/*
 * @Author: lidan
 * @Date: 2022-03-09 09:47:47
 * @LastEditors: lidan
 * @LastEditTime: 2022-04-02 15:35:03
 * @Description: 
 */
import { RESOURCE_TYPE } from "@eva/eva.js";
export default [
  {
    name: "bg",
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: "png",
        url: "./static/bg.png",
      },
    },
    preload: true,
  },
  {
    name: "ground",
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: "png",
        url: "./static/ground.png",
      },
    },
    preload: true,
  },
  {
    name: "bird",
    type: RESOURCE_TYPE.SPRITE_ANIMATION,
    src: {
      image: {
        type: "png",
        url: "./static/bird.png",
      },
      json: {
        type: "json",
        url: "./static/bird.json",
      },
    },
    preload: true,
  },
]