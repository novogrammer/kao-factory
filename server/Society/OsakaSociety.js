import * as THREE from "three";


import Car from "../Car/Car";
import OsakaGridNetwork from "../Network/OsakaGridNetwork";
import RandomWalkCommander from "../Commander/RandomWalkCommander";
import TourCommander from "../Commander/TourCommander";


import SocietyBase from "./SocietyBase";
import MultipleCarrier from "../Carrier/MultipleCarrier";
import SingleCarrier from "../Carrier/SingleCarrier";
import DeliveryPlace from "../DeliveryPlace/DeliveryPlace";

export default class OsakaSociety extends SocietyBase {
  constructor(params) {
    super(params);
  }
  setup() {
    const { cars, commanders, emitter, deliveryPlaces } = this;

    const grid = new OsakaGridNetwork(10, 10, 2);
    this.sections = this.sections.concat(grid.sections);

    const { sections } = this;

    {
      const inletSectionTagsList = [
        ["[0,0]", "[1,0]", "[2,0]", "[3,0]", "[4,0]",],
        ["[5,0]", "[6,0]", "[7,0]", "[8,0]", "[9,0]",],
        ["[0,1]", "[1,1]", "[2,1]", "[3,1]", "[4,1]",],
        ["[5,1]", "[6,1]", "[7,1]", "[8,1]", "[9,1]",],
      ];
      for (let i = 0; i < inletSectionTagsList.length; ++i) {
        const inletSectionTags = inletSectionTagsList[i];
        const deliveryPlace = new DeliveryPlace();
        deliveryPlaces.push(deliveryPlace);
        const carrier = new MultipleCarrier({ emitter });
        deliveryPlace.carrier = carrier;
        this.carriers.push(carrier);
        this.inletCarriers[i] = carrier;

        for (let j = 0; j < inletSectionTags.length; ++j) {
          const inletSectionTag = inletSectionTags[j];
          const section = grid.findSectionByTag(inletSectionTag);
          if (!section) {
            throw new Error("section not found. inletSectionTag:" + inletSectionTag);
          }
          deliveryPlace.sections.push(section);

        }

      }
    }

    for (let i = 0; i < 20; ++i) {
      if (i < sections.length) {
        const section = sections[i];
        const car = new Car({ emitter });
        car.position.copy(section.position);
        section.enter(car);
        car.userData.section = section;

        const carrier = new SingleCarrier({ emitter });
        car.carrier = carrier;
        this.carriers.push(carrier);


        const from = sections[0];
        const to = sections[sections.length - 1];

        let commander = null;
        if (false) {
          commander = new RandomWalkCommander({
            car,
            sections,
          });

        } else {
          commander = new TourCommander({
            car,
            sections,
            places: [
              {
                section: from,
                onArrival: () => { },
              },
              {
                section: to,
                onArrival: () => { },
              },
            ],
          });

        }
        commanders.push(commander);

        cars.push(car);
      }
    }



  }

}