import mitt from "mitt";

const emitter = mitt<Events>();
type Events = {
  "require-full-update": void;
  "require-post-update": void;
};
export default emitter;
