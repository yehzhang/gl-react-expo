export default class LoaderResolver {
  constructor(gl, registry) {
    this.loaders = registry.get().map(L => new L(gl))
  }

  dispose() {
    this.loaders.forEach(l => l.dispose())
  }

  resolve(input) {
    return this.loaders.find(loader => loader.canLoad(input))
  }
}
