"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GLImage;

var _ExpoModuleTextureLoader = require("webgltexture-loader-expo/lib/ExpoModuleTextureLoader");

function GLImage() {
  console.warn("Usage of gl-react-expo Image is deprecated");
  if (!(this instanceof GLImage)) throw new Error("Failed to construct 'Image': Please use the 'new' operator.");
  this.onload = null;
  this._src = null;
}

GLImage.prototype = {
  //$FlowFixMe
  get src() {
    return this._src;
  },
  //$FlowFixMe
  set src(src) {
    var _this = this;

    if (this._src === src) return;
    delete this.localUri;
    this._src = src;

    if (src) {
      (0, _ExpoModuleTextureLoader.loadAsset)(src).then(function (_ref) {
        var localUri = _ref.localUri;

        _this.localUri = localUri;
        if (_this.onload) _this.onload();
      });
    }
  }
};
//# sourceMappingURL=Image.js.map