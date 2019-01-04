import WebGLTextureLoader from './WebGLTextureLoader'

const neverEnding = new Promise(() => {})

/**
 * A cache implementation of WebGLTextureLoader with a input hash function
 */
class WebGLTextureLoaderAsyncHashCache extends WebGLTextureLoader {
  // +inputHash: (input: T) => *
  // An async load function that does not cache (WebGLTextureLoaderAsyncHashCache do the caching with inputHash). it also should return a dispose function to cancel a pending load
  // +loadNoCache: (
  //   input: T
  // ) => { promise: Promise<TextureAndSize>, dispose: Function }

  disposes = new Map()
  inputs = new Map()
  promises = new Map()
  results = new Map()

  _disposed = false
  dispose() {
    const { promises, results, inputs, disposes } = this
    disposes.forEach(d => d())
    results.forEach(result => {
      this.disposeTexture(result.texture)
    })
    promises.clear()
    results.clear()
    inputs.clear()
    disposes.clear()
    this._disposed = true
  }

  disposeTexture(texture) {
    this.gl.deleteTexture(texture)
  }

  load(input) {
    const hash = this.inputHash(input)
    const maybePromise = this.promises.get(hash)
    if (maybePromise) return maybePromise
    const d = this.loadNoCache(input)
    this.disposes.set(hash, d.dispose)
    const promise = d.promise.then(result => {
      if (!this.promises.has(hash)) {
        return neverEnding
      }
      this.disposes.delete(hash)
      this.results.set(hash, result)
      return result
    })
    this.promises.set(hash, promise)
    return promise
  }

  get(input) {
    return this.results.get(this.inputHash(input))
  }

  cancelLoad(input) {
    const hash = this.inputHash(input)
    this.promises.delete(hash)
    const dispose = this.disposes.get(hash)
    if (dispose) {
      dispose()
      this.disposes.delete(hash)
    }
  }
}

export default WebGLTextureLoaderAsyncHashCache
