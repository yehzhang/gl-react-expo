/**
 *
 * GLViewNative
 *
 */

import React from 'react'
import PropTypes from 'prop-types'

import { View, StyleSheet } from 'react-native'
import { GLView as EXGLView } from 'expo'

export default class GLViewNative extends React.Component {
  static propTypes = {
    onContextCreate: PropTypes.func.isRequired,
    style: PropTypes.any,
    children: PropTypes.any,
  }

  afterDraw(gl) {
    gl.flush()
    gl.endFrameEXP()
  }

  onRef = ref => (this.ref = ref)

  onContextCreate = gl => {
    const { getExtension } = gl

    // monkey patch to get a way to access the GLView
    gl.getExtension = name => {
      if (name === 'GLViewRef') {
        return this.ref
      }

      return getExtension.call(gl, name)
    }

    this.props.onContextCreate(gl)
  }

  capture = opt => {
    if (!this.ref) {
      return Promise.reject(new Error('glView is unmounted'))
    }

    return this.ref.takeSnapshotAsync(opt)
  }

  render() {
    const { style, children, ...rest } = this.props

    if (__DEV__) {
      if ('width' in rest || 'height' in rest) {
        console.warn(
          'gl-react-expo <Surface>: no such width/height prop. instead you must use the style prop like for a <View>.'
        )
      }
    }

    return (
      <View {...rest} style={[styles.container, style]}>
        <EXGLView
          style={[style, styles.glView]}
          onContextCreate={this.onContextCreate}
          ref={this.onRef}
        />

        <View style={styles.zeroOpacity}>{children}</View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },

  glView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
  },

  zeroOpacity: {
    opacity: 0,
  },
})
