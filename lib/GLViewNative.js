"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactNative = require("react-native");

var _expo = require("expo");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  onContextCreate: _propTypes2.default.func.isRequired,
  style: _propTypes2.default.any
};

var GLViewNative = function (_Component) {
  _inherits(GLViewNative, _Component);

  function GLViewNative() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, GLViewNative);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GLViewNative.__proto__ || Object.getPrototypeOf(GLViewNative)).call.apply(_ref, [this].concat(args))), _this), _this.onRef = function (ref) {
      _this.ref = ref;
    }, _this.onContextCreate = function (gl) {
      var getExtension = gl.getExtension;
      // monkey patch to get a way to access the EXGLView
      // $FlowFixMe

      gl.getExtension = function (name) {
        if (name === "GLViewRef") return _this.ref;
        return getExtension.call(gl, name);
      };
      _this.props.onContextCreate(gl);
    }, _this.capture = function (opt) {
      var _this2 = _this,
          ref = _this2.ref;

      if (!ref) return Promise.reject(new Error("glView is unmounted"));
      return ref.takeSnapshotAsync(opt);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GLViewNative, [{
    key: "afterDraw",
    value: function afterDraw(gl) {
      gl.flush();
      // $FlowFixMe
      gl.endFrameEXP();
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          style = _props.style,
          onContextCreate = _props.onContextCreate,
          children = _props.children,
          rest = _objectWithoutProperties(_props, ["style", "onContextCreate", "children"]);

      if (__DEV__) {
        if ("width" in rest || "height" in rest) {
          console.warn("gl-react-expo <Surface>: no such width/height prop. instead you must use the style prop like for a <View>.");
        }
      }
      return _react2.default.createElement(
        _reactNative.View,
        _extends({}, rest, {
          style: [{ position: "relative", overflow: "hidden" }, style]
        }),
        _react2.default.createElement(_expo.GLView, {
          style: [style, {
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0
          }],
          onContextCreate: this.onContextCreate,
          ref: this.onRef
        }),
        _react2.default.createElement(
          _reactNative.View,
          { style: { opacity: 0 } },
          children
        )
      );
    }
  }]);

  return GLViewNative;
}(_react.Component);

GLViewNative.propTypes = propTypes;
exports.default = GLViewNative;
//# sourceMappingURL=GLViewNative.js.map