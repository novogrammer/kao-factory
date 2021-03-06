import * as THREE from "three";


import Car from "../Car/Car";
import OsakaGridNetwork from "../Network/OsakaGridNetwork";
import RandomWalkCommander from "../Commander/RandomWalkCommander";
import TourCommander from "../Commander/TourCommander";

import LineSegment from "../Segment/LineSegment";

import SocietyBase from "./SocietyBase";
import MultipleCarrier from "../Carrier/MultipleCarrier";
import SingleCarrier from "../Carrier/SingleCarrier";
import DeliveryPlace from "../DeliveryPlace/DeliveryPlace";
import { PART_KIND_LIST } from "../../common/constants";

export default class ComplexFactorySociety extends SocietyBase {
  constructor(params) {
    super(params);
  }
  setup() {
    const { cars, commanders, emitter, deliveryPlaces } = this;

    const gridLength = 2;

    const grid1 = new OsakaGridNetwork(9, 9, gridLength);
    {
      const offset = new THREE.Vector3(gridLength * (-5), 0, 0);
      for (let section of grid1.sections) {
        section.position.add(offset);
      }
    }
    const grid2 = new OsakaGridNetwork(9, 9, gridLength);
    {
      const offset = new THREE.Vector3(gridLength * (+5), 0, 0);
      for (let section of grid2.sections) {
        section.position.add(offset);
      }
    }

    {
      let from = grid1.findSectionByTag("[8,2]");
      let to = grid2.findSectionByTag("[0,2]");
      let segment = new LineSegment({ from, to });
      from.segments.push(segment);

    }
    {
      let from = grid2.findSectionByTag("[0,6]");
      let to = grid1.findSectionByTag("[8,6]");
      let segment = new LineSegment({ from, to });
      from.segments.push(segment);

    }

    this.sections = this.sections.concat(grid1.sections).concat(grid2.sections);;
    const { sections } = this;

    {
      const inletSectionTagsList = [
        { x: 2, y: 2 },
        { x: 6, y: 2 },
        { x: 1, y: 7 },
        { x: 7, y: 7 },
      ].map(({ x, y }) => [
        `[${x},${y}]`,
      ]);
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
          const section = grid1.findSectionByTag(inletSectionTag);
          if (!section) {
            throw new Error("section not found. inletSectionTag:" + inletSectionTag);
          }
          deliveryPlace.sections.push(section);

        }

      }
    }
    //作業用変数
    const outletCarriers = []
    {
      //一旦一箇所バージョン
      const outletSectionTags = [
        "[2,2]",
        "[6,2]",
        "[1,7]",
        "[7,7]",
      ];
      for (let outletSectionTag of outletSectionTags) {
        const section = grid2.findSectionByTag(outletSectionTag);
        const deliveryPlace = new DeliveryPlace();
        deliveryPlace.sections.push(section);
        deliveryPlaces.push(deliveryPlace);
        const carrier = new MultipleCarrier({ emitter });
        deliveryPlace.carrier = carrier;
        this.carriers.push(carrier);
        outletCarriers.push(carrier);

      }

    }

    {
      //静的な構造なのでnullチェックしない。
      const tripPlans = [];
      for (let i = 0; i < this.inletCarriers.length; ++i) {
        for (let j = 0; j < PART_KIND_LIST.length; ++j) {
          const tripPlan = {
            sectionFrom: this.filterDeliveryPlaceByCarrier(this.inletCarriers[i])[0].sections[0],
            sectioneTo: this.filterDeliveryPlaceByCarrier(outletCarriers[(i + j) % 4])[0].sections[0],
          };
          tripPlans.push(tripPlan);

        }
      }
      for (let tripPlan of tripPlans) {
        const { sectionFrom, sectioneTo, partIndexFrom } = tripPlan;
        const deliveryPlaceFrom = this.filterDeliveryPlaceBySection(sectionFrom)[0];
        const deliveryPlaceTo = this.filterDeliveryPlaceBySection(sectioneTo)[0];
        const car = new Car({ emitter });
        const initialSection = sections[cars.length];
        car.position.copy(initialSection.position);
        initialSection.enter(car);
        car.userData.section = initialSection;

        const carrier = new SingleCarrier({ emitter });
        car.carrier = carrier;
        this.carriers.push(carrier);

        const places = [
          {
            section: sectionFrom,
            onArrival: () => {
              //MultipleCarrierからランダムにコピーする
              const partIndexFrom = Math.floor(Math.random() * PART_KIND_LIST.length)
              const parts = deliveryPlaceFrom.carrier.getAllParts()
                .filter((part, index) => index == partIndexFrom)
                .filter((part) => !!part)
                .map((part) => part.clone());
              for (let part of parts) {
                carrier.add(part);
              }
            }
          },
          {
            section: sectioneTo,
            onArrival: () => {
              //チェックなしで上書き
              const parts = carrier.getAllParts().filter((part) => !!part);

              for (let part of parts) {
                carrier.remove(part);
                deliveryPlaceTo.carrier.add(part);
              }
            }
          },
        ];
        const commander = new TourCommander({
          car,
          sections,
          places,
        });
        commanders.push(commander);

        cars.push(car);

      }

    }



  }

}