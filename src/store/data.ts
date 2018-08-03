import { observable, action, extendObservable, runInAction } from 'mobx'

class Data {
  @observable public count = 0

  @observable public visualizers: { [key: string]: HTMLCanvasElement } = {}

  @action
  public setVisualizer(key: string, visualizer: HTMLCanvasElement) {
    //
    runInAction(() => {
      if (this.visualizers[key] !== visualizer) {
        extendObservable(this.visualizers, { [key]: visualizer })
      }
    })
    //}
  }

  @action
  public inc(): void {
    this.count += 1
    console.log(this.count)
  }
}

export default Data
