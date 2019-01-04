import {
  globalRegistry,
  WebGLTextureLoaderAsyncHashCache,
} from '../webgltexture-loader'
import { Image } from 'react-native'
import { Asset, FileSystem } from 'expo'
import md5 from '../md5'

const neverEnding = new Promise(() => {})

const localAsset = module => {
  const asset = Asset.fromModule(module)

  return asset.downloadAsync().then(() => asset)
}

const remoteAssetCache = {}

const remoteAsset = uri => {
  const i = uri.lastIndexOf('.')
  const ext = i !== -1 ? uri.slice(i) : '.jpg'
  const key = md5(uri)

  if (key in remoteAssetCache) {
    return Promise.resolve(remoteAssetCache[key])
  }

  const promise = Promise.all([
    new Promise((success, failure) =>
      Image.getSize(uri, (width, height) => success({ width, height }), failure)
    ),
    FileSystem.downloadAsync(
      uri,
      FileSystem.documentDirectory + `ExponentAsset-${key}${ext}`,
      {
        cache: true,
      }
    ),
  ]).then(([size, asset]) => ({ ...size, uri, localUri: asset.uri }))

  remoteAssetCache[key] = promise

  return promise
}

const localFile = uri => {
  const key = md5(uri)

  if (key in remoteAssetCache) {
    return Promise.resolve(remoteAssetCache[key])
  }

  const promise = new Promise((success, failure) =>
    Image.getSize(uri, (width, height) => success({ width, height }), failure)
  ).then(size => ({ ...size, uri, localUri: uri }))

  remoteAssetCache[key] = promise

  return promise
}

export const loadAsset = module =>
  typeof module === 'number'
    ? localAsset(module)
    : module.uri.startsWith('file:') ||
      module.uri.startsWith('data:') ||
      module.uri.startsWith('asset:') || // All local paths in Android Expo standalone app
      module.uri.startsWith('assets-library:') || // CameraRoll.getPhotos iOS
      module.uri.startsWith('content:') || // CameraRoll.getPhotos Android
      module.uri.startsWith('/') // Expo.takeSnapshotAsync in DEV in Expo 31
      ? localFile(module.uri)
      : remoteAsset(module.uri)

class ExpoModuleTextureLoader extends WebGLTextureLoaderAsyncHashCache {
  objIds = new WeakMap()

  canLoad(input) {
    return (
      typeof input === 'number' ||
      (input && typeof input === 'object' && typeof input.uri === 'string')
    )
  }

  inputHash(module) {
    return typeof module === 'number' ? module : module.uri
  }

  loadNoCache(module) {
    const { gl } = this
    let disposed = false

    const dispose = () => {
      disposed = true
    }

    const promise = loadAsset(module).then(asset => {
      if (disposed) return neverEnding
      const { width, height } = asset
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      // $FlowFixMe
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        asset
      )
      return { texture, width, height }
    })

    return { promise, dispose }
  }
}

globalRegistry.add(ExpoModuleTextureLoader)

export default ExpoModuleTextureLoader
