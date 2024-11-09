
type RecordId = symbol | string
class Layer {
    records: Map<RecordId, Record> = new Map
    add(cb: Function, params: any[] | null, uniqueId: RecordId = Symbol('unique-id')) {
        this.records.set(uniqueId, {
            callbackFunction: cb,
            params
        })
    }
    clear() {
        this.records.clear()
    }
    get size() {
        return this.records.size
    }
}

export interface Record {
    callbackFunction: Function
    params: any[] | null
}


export class Scheduler {
    private layers: Map<string, Layer> = new Map()
    private scheduled = false
    createLayer(name: string) {
        if (this.layers.has(name)) {
            throw `Schedule layer ${name} existed`
        }
        let layer: Layer = new Layer
        this.layers.set(name, layer)
        return layer
    }
    getLayer(name: string) {
        if (!this.layers.has(name)) {
            return this.createLayer(name)
        }
        return this.layers.get(name)
    }
    schedule() {
        return new Promise<null>((res) => {
            if (!this.scheduled) {
                this.scheduled = true
                let self = this
                function task() {
                    for (let ite of self.layers) {
                        let layer = ite[1]
                        if (layer.records.size === 0) {
                            continue
                        }
                        let records = Array.from(layer.records.values())
                        layer.records.clear()
                        if (records.length > 0) {
                            for (let record of records) {
                                record.callbackFunction.apply({}, record.params === null ? [] : record.params)
                            }
                        }
                        run()
                        return
                    }
                    self.scheduled = false
                    res(null)
                }
                function run() {
                    window.setTimeout(task, 0)
                }
                run()
            }
            else {
                res(null)
            }
        })
    }
}