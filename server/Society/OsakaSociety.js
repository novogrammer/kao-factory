import * as THREE from "three";


import Car from "../Car/Car";
import OsakaGridNetwork from "../Network/OsakaGridNetwork";
import RandomWalkCommander from "../Commander/RandomWalkCommander";
import RoundTripCommander from "../Commander/RoundTripCommander";


import SocietyBase from "./SocietyBase";

export default class OsakaSociety extends SocietyBase {
  constructor(params) {
    super(params);
  }
  setup() {
    const { cars, commanders, emitter } = this;

    const grid = new OsakaGridNetwork(10, 10, 2);
    this.sections = this.sections.concat(grid.sections);

    const { sections } = this;

    for (let i = 0; i < 20; ++i) {
      if (i < sections.length) {
        const section = sections[i];
        const car = new Car({ emitter });
        car.position.copy(section.position);
        section.enter(car);
        car.userData.section = section;
        const from = sections[0];
        const to = sections[sections.length - 1];

        let commander = null;
        if (false) {
          commander = new RandomWalkCommander({
            car,
            sections,
          });

        } else {
          commander = new RoundTripCommander({
            car,
            sections,
            from,
            to,
          });

        }
        commanders.push(commander);

        cars.push(car);
      }
    }



  }

}