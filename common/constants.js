import * as THREE from "three";

export const IS_DEBUG = true;

export const ROOM_DEBUG = "debug";
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



export const FACE_INDEX_NOSE_TIP = 1;
export const FACE_INDEX_FACE_TOP = 10;
export const FACE_INDEX_FACE_BOTTOM = 152;


//[m]
export const FACE_HEIGHT = 10;
export const Z_OFFSET_PART = 0.3;
export const Z_OFFSET_MASK = 0.001;


export const DATA_DIR = "data/";
export const FILEPATH_INLET_FACES_JSON = DATA_DIR + "inletFaces.json";
export const FACES_DIR = DATA_DIR + "faces/";

export const CARRIER_TYPE_SINGLE = "single";
export const CARRIER_TYPE_MULTIPLE = "multiple";

export const PART_KIND_CONTOUR = "contour";
export const PART_KIND_LEFT_EYE = "left eye";
export const PART_KIND_RIGHT_EYE = "right eye";
export const PART_KIND_NOSE = "nose";
export const PART_KIND_MOUTH = "mouth";

export const PART_KIND_LIST = [
  PART_KIND_CONTOUR,
  PART_KIND_LEFT_EYE,
  PART_KIND_RIGHT_EYE,
  PART_KIND_NOSE,
  PART_KIND_MOUTH,
];


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

// debug -> server
// {
// }
export const EVENT_NOTIFY_LOAD_INLET_FACES = "notify load inlet faces";

// debug -> server
// {
// }
export const EVENT_NOTIFY_SAVE_INLET_FACES = "notify save inlet faces";


// server -> any client
// {
//   text: String,
// }
export const EVENT_NOTIFY_DISPLAY_ERROR_LOG = "notify display error log";

// server -> any client
// {
// }
export const EVENT_NOTIFY_CLEAR_ERROR_LOG = "notify clear error log";



//entry -> server
// {
//   image: base64,
//   prediction: AnnotatedPredictionValues,
// }
export const EVENT_NOTIFY_UPLOAD_FACE = "notify upload face";


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
// {
//   cars:{
//     id:String,
//     position:Vector3,
//     quaternion:Quaternion,
//     carrierId:String,
//   }[],
//   sections:{
//     id:String,
//     position:Vector3,
//     segments:{
//       indexTo:Integer,
//     }[],
//   }[],
//   carriers:{
//     id:String,
//     type:String,
//   }[],
//   parts:{
//     id:String,
//     hash:String,
//     kind:String,
//     carrierId:String,
//   }
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


