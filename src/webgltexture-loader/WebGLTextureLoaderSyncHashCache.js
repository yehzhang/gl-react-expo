import WebGLTextureLoader from './WebGLTextureLoader'

class WebGLTextureLoaderSyncHashCache extends WebGLTextureLoader {
  // return a unique representation of the input (typically a hash, or anything that can be used as ref identifier)
  // +inputHash: (input: T) => *;
  // An sync load function that does not cache (WebGLTextureLoaderAsyncHashCache do the caching with inputHash)
  // +getNoCache: (input: T) => TextureAndSize;

  results = new Map()
  promises = new Map()

  _disposed = false
  dispose() {
    const { results, promises } = this
    results.forEach(r => {
      this.disposeTexture(r.texture)
    })
    results.clear()
    promises.clear()
    this._disposed = true
  }

  disposeTexture(texture) {
    this.gl.deleteTexture(texture)
  }

  get(input) {
    const hash = this.inputHash(input)
    const result = this.results.get(hash)
    if (result) return result
    const freshResult = this.getNoCache(input)
    this.results.set(hash, freshResult)
    return freshResult
  }

  // load() implementation is a dumb fallback on get() but still need to save the promise to guarantee idempotent
  load(input) {
    const hash = this.inputHash(input)
    const existing = this.promises.get(hash)
    if (existing) return existing
    const promise = Promise.resolve(this.get(input))
    this.promises.set(hash, promise)
    return promise
  }
}

export default WebGLTextureLoaderSyncHashCache
