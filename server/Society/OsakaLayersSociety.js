import * as THREE from "three";


import Car from "../Car/Car";
import OsakaGridNetwork from "../Network/OsakaGridNetwork";
import RandomWalkCommander from "../Commander/RandomWalkCommander";
import RoundTripCommander from "../Commander/RoundTripCommander";

import LineSegment from "../Segment/LineSegment";
import SocietyBase from "./SocietyBase";

export default class OsakaLayersSociety extends SocietyBase {
  constructor() {
    super();
  }
  setup() {
    const { cars, commanders } = this;

    const grid1 = new OsakaGridNetwork(10, 10, 2);
    const grid2 = new OsakaGridNetwork(10, 10, 2);
    {
      const offset = new THREE.Vector3(0, 2, 0);
      for (let section of grid2.sections) {
        section.position.add(offset);
      }
    }
    {
      let from = grid1.sections[0];
      let to = grid2.sections[0];
      let segment = new LineSegment({ from, to });
      from.segments.push(segment);

    }
    {
      let to = grid1.sections[grid1.sections.length - 1];
      let from = grid2.sections[grid2.sections.length - 1];
      let segment = new LineSegment({ from, to });
      from.segments.push(segment);

    }
    let allSections = [];
    allSections = allSections.concat(grid1.sections);
    allSections = allSections.concat(grid2.sections);



    for (let i = 0; i < 40; ++i) {
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