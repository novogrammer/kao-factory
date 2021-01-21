import * as THREE from "three";


import Car from "../Car/Car";
import OsakaGridNetwork from "../Network/OsakaGridNetwork";
import RandomWalkCommander from "../Commander/RandomWalkCommander";
import TourCommander from "../Commander/TourCommander";


import SocietyBase from "./SocietyBase";
import MultipleCarrier from "../Carrier/MultipleCarrier";
import SingleCarrier from "../Carrier/SingleCarrier";
import DeliveryPlace from "../DeliveryPlace/DeliveryPlace";

export default class SimpleFactorySociety extends SocietyBase {
  constructor(params) {
    super(params);
  }
  setup() {
    const { cars, commanders, emitter, deliveryPlaces } = this;

    const grid = new OsakaGridNetwork(20, 10, 1.5);
    this.sections = this.sections.concat(grid.sections);;
    const { sections } = this;

    {
      const inletSectionTags = [
        "[0,0]", "[1,0]", "[2,0]", "[3,0]", "[4,0]",
        "[5,0]", "[6,0]", "[7,0]", "[8,0]", "[9,0]",
        "[10,0]", "[11,0]", "[12,0]", "[13,0]", "[14,0]",
        "[15,0]", "[16,0]", "[17,0]", "[18,0]", "[19,0]",
      ];
      for (let i = 0; i < inletSectionTags.length; ++i) {
        const inletSectionTag = inletSectionTags[i];
        const section = grid.findSectionByTag(inletSectionTag);
        if (!section) {
          throw new Error("section not found. inletSectionTag:" + inletSectionTag);
        }
        const deliveryPlace = new DeliveryPlace();
        deliveryPlace.sections.push(section);
        deliveryPlaces.push(deliveryPlace);

        const carrier = new SingleCarrier({ emitter });
        deliveryPlace.carrier = carrier;
        this.carriers.push(carrier);
        this.inletCarriers[i] = carrier;

      }
    }
    //作業用変数
    const outletCarriers = []
    {
      //一旦一箇所バージョン
      const outletSectionTags = [
        "[2,9]",
        "[7,9]",
        "[12,9]",
        "[17,9]",
      ];
      for (let outletSectionTag of outletSectionTags) {
        const section = grid.findSectionByTag(outletSectionTag);
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
      for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 5; ++j) {
          const tripPlan = {
            deliveryPlaceFrom: deliveryPlaces[i * 5 + j],
            deliveryPlaceTo: this.filterDeliveryPlaceByCarrier(outletCarriers[(i + j) % 4])[0],
          };
          tripPlans.push(tripPlan);

        }
      }
      for (let tripPlan of tripPlans) {
        const { deliveryPlaceFrom, deliveryPlaceTo } = tripPlan;
        const from = this.filterSectionsByDeliveryPlace(deliveryPlaceFrom)[0];
        const to = this.filterSectionsByDeliveryPlace(deliveryPlaceTo)[0];
        const car = new Car({ emitter });
        car.position.copy(from.position);
        from.enter(car);
        car.userData.section = from;

        const carrier = new SingleCarrier({ emitter });
        car.carrier = carrier;
        this.carriers.push(carrier);

        const places = [
          {
            section: from,
            onArrival: () => {
              //コピーする
              const parts = deliveryPlaceFrom.carrier.getAllParts().filter((part) => !!part).map((part) => part.clone());
              for (let part of parts) {
                carrier.add(part);
              }
            }
          },
          {
            section: to,
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