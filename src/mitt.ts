import mitt from "mitt";

const emitter = mitt<Events>();
type Events = {
  "require-full-update": string;
  "require-post-update": string;
};
export default emitter;
