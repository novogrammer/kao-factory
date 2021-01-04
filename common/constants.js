import * as THREE from "three";

export const IS_DEBUG = true;

export const ROOM_ENTRY = "entry";
export const ROOM_FACTORY = "factory";

export const FPS_ENTRY = 10;
export const FPS_FACTORY = 60;
export const FPS_SERVER = 10;

export const VIDEO_SIZE = 512;
// export const VIDEO_SIZE = 256;

export const JPEG_QUALITY = 9.5;

export const INLET_FACES_QTY = 4;

//const FOVY = 60;


//[rad/s]
export const CAR_ANGULAR_VELOCITY = THREE.MathUtils.degToRad(360);

//[m/s]
export const CAR_VELOCITY = 10;



// Vector3 = {
//   x: Number,
//   y: Number,
//   z: Number,
// }
// Quaternion = {
//   x: Number,
//   y: Number,
//   z: Number,
//   w: Number,
// }
// base64 = String


//entry -> server
// {
//   image: base64,
//   prediction: AnnotatedPredictionValues,
// }
export const EVENT_NOTIFY_UPLOAD_FACE = "notify upload face";


// server -> factory
// {
//   place: Integer,
//   hash: String,
// }
export const EVENT_NOTIFY_NEW_FACE = "notify new face";

// factory -> server
// {
//   hash: String,
// }
export const EVENT_REQUEST_FACE = "request face";


// server -> factory
// {
//   hash: String,
//   image: base64,
//   prediction: AnnotatedPredictionValues,
// }
export const EVENT_RESPONSE_FACE = "response face";


// server -> factory
// "notify initialize":{
//   faces:{
//     hash:String,
//     place:Integer,
//   }[],
//   cars:{
//     id:String,
//     position:Vector3,
//     quaternion:Quaternion,
//   }[],
// }


export const EVENT_NOTIFY_INITIALIZE = "notify initialize";



// server -> factory
// {
//   id: String,
//   duration: Number,
//   from: {
//     quaternion: Quaternion,
//   },
//   to: {
//     quaternion: Quaternion,
//   },
// }
export const EVENT_NOTIFY_CAR_TURN = "notify car turn";


// server -> factory
// {
//   id: String,
//   duration: Number,
//   from: {
//     position: Vector3,
//   },
//   to: {
//     position: Vector3,
//   },
// }
export const EVENT_NOTIFY_CAR_MOVE = "notify car move";


