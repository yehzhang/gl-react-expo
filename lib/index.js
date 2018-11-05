"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Surface = undefined;

var _reactNative = require("react-native");

var _glReact = require("gl-react");

var _GLViewNative = require("./GLViewNative");

var _GLViewNative2 = _interopRequireDefault(_GLViewNative);

require("webgltexture-loader-expo");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RenderLessElement = _reactNative.View;

var Surface = exports.Surface = (0, _glReact.createSurface)({
  GLView: _GLViewNative2.default,
  RenderLessElement: RenderLessElement,
  requestFrame: global.requestAnimationFrame,
  cancelFrame: global.cancelAnimationFrame
});
//# sourceMappingURL=index.js.map