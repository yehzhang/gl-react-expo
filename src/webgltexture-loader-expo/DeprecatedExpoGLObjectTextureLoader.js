import {
  globalRegistry,
  WebGLTextureLoaderAsyncHashCache,
} from '../webgltexture-loader'
import { NativeModules } from 'react-native'

const neverEnding = new Promise(() => {})

const available = !!(
  NativeModules.ExponentGLObjectManager &&
  NativeModules.ExponentGLObjectManager.createObjectAsync
)

let warned = false

class ExpoGLObjectTextureLoader extends WebGLTextureLoaderAsyncHashCache {
  static priority = -200

  objIds = new WeakMap()

  canLoad(input) {
    if (!available && !warned) {
      warned = true
      console.log(
        'webgltexture-loader-expo: ExponentGLObjectManager.createObjectAsync is not available. Make sure to use the correct version of Expo'
      )
    }
    return available && typeof input === 'object'
  }

  disposeTexture(texture) {
    const exglObjId = this.objIds.get(texture)
    if (exglObjId) {
      NativeModules.ExponentGLObjectManager.destroyObjectAsync(exglObjId)
    }
    this.objIds.delete(texture)
  }

  inputHash(config) {
    // JSON.stringify is a quick way to hash the config object
    return JSON.stringify(config)
  }

  loadNoCache(config) {
    const { __exglCtxId: exglCtxId } = this.gl
    let disposed = false
    const dispose = () => {
      disposed = true
    }
    const promise = NativeModules.ExponentGLObjectManager.createObjectAsync({
      exglCtxId,
      texture: config,
    }).then(({ exglObjId }) => {
      if (disposed) return neverEnding
      // $FlowFixMe
      const texture = new WebGLTexture(exglObjId)
      this.objIds.set(texture, exglObjId)
      const width = 0
      const height = 0
      // ^ unfortunately there is no way to retrieve these
      return { texture, width, height }
    })
    return { promise, dispose }
  }
}

globalRegistry.add(ExpoGLObjectTextureLoader)

export default ExpoGLObjectTextureLoader
