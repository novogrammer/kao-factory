import {
  IS_DEBUG,
} from "../../common/constants";

import FastPriorityQueue from 'fastpriorityqueue';

import RandomDriver from "../Driver/RandomDriver";
import RouteDriver from "../Driver/RouteDriver";

export default class CommanderBase {
  constructor({ car, sections }) {
    Object.assign(this, {
      car,
      sections,
    });
  }
  commandRandom(timeoutTime = Infinity) {
    const { car } = this;
    // car.setColor(0x00ff00);
    const driver = new RandomDriver({
      car,
      timeoutTime,
      onTimeout: this.onTimeout.bind(this),
    });
    car.assign(driver);
  }
  commandDestination(to, stuckTime = Infinity) {
    const { car } = this;
    // car.setColor(0xff8080);
    const from = car.getSectionForNavigation();

    const sections = this.findShortestPath(from, to);
    if (0 < sections.length) {
      const driver = new RouteDriver({
        car,
        sections,
        isLoop: false,
        onComplete: this.onComplete.bind(this),
        stuckTime,
        onStuck: this.onStuck.bind(this),
      });
      car.assign(driver);
    } else {
      //すでに到着している
      if (IS_DEBUG) {
        console.log("すでに到着している");
      }
      this.onComplete();
    }

  }

  //ダイクストラ法
  findShortestPath(from, to) {
    const { sections } = this;
    const priorityQueue = new FastPriorityQueue((a, b) => a.distance < b.distance);
    const weakMap = new WeakMap();
    for (let section of sections) {
      const time = section == from ? 0 : Infinity;
      const node = {
        section,
        prev: null,
        time,
      };
      priorityQueue.add(node);
      weakMap.set(section, node);
    }
    while (0 < priorityQueue.size) {
      const node = priorityQueue.poll();
      const section = node.section;
      for (const segment of section.segments) {
        const neighborSection = segment.to;
        const timeToNeighbor = node.time + segment.getTime();
        const neighborNode = weakMap.get(neighborSection);
        if (timeToNeighbor < neighborNode.time) {
          neighborNode.time = timeToNeighbor;
          neighborNode.prev = node;
          priorityQueue.removeOne((n) => n == neighborNode);
          priorityQueue.add(neighborNode);
        }
      }
    }
    const shortestPath = [];
    const toNode = weakMap.get(to);
    {
      let node = toNode;
      while (node != null) {
        shortestPath.unshift(node.section);
        node = node.prev;
      }

    }
    //あらかじめ始点を削除しておく
    shortestPath.shift();
    return shortestPath;
  }
  findShortestPathRelay(relaySections) {
    console.log(relaySections.length);
    const { sections } = this;
    let resultPath = [];
    for (let i = 1; i < relaySections.length; ++i) {
      const from = relaySections[i - 1];
      const to = relaySections[i];
      const shortestPath = this.findShortestPath(from, to);
      resultPath = resultPath.concat(shortestPath);
    }
    return resultPath;
  }
  onStuck() {
    // console.log("onStuck");

  }
  onComplete() {
    // console.log("onComplete");

  }
  onTimeout() {
    // console.log("onTimeout");

  }

}

