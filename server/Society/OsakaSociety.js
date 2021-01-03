import * as THREE from "three";


import Car from "../Car/Car";
import OsakaGridNetwork from "../Network/OsakaGridNetwork";
import RandomWalkCommander from "../Commander/RandomWalkCommander";
import RoundTripCommander from "../Commander/RoundTripCommander";


import SocietyBase from "./SocietyBase";

export default class OsakaSociety extends SocietyBase {
  constructor() {
    super();
  }
  setup() {
    const { cars, commanders } = this;

    const grid = new OsakaGridNetwork(10, 10, 2);
    const allSections = grid.sections;


    for (let i = 0; i < 20; ++i) {
      if (i < allSections.length) {
        const section = allSections[i];
        const car = new Car();
        car.position.copy(section.position);
        section.enter(car);
        car.userData.section = section;
        const from = allSections[0];
        const to = allSections[allSections.length - 1];

        let commander = null;
        if (false) {
          commander = new RandomWalkCommander({
            car,
            sections: allSections,
          });

        } else {
          commander = new RoundTripCommander({
            car,
            sections: allSections,
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