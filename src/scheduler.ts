

class Records {
    records: Map<any, Record> = new Map
    add(cb: Function, params: any[] | null, uniqueId = Symbol('unique-id')) {
        this.records.set(uniqueId, {
            callbackFunction: cb,
            params
        })
    }
    clear() {
        this.records.clear()
    }
    get size(){
        return this.records.size
    }
}

export interface Record {
    callbackFunction: Function
    params: any[] | null
}


export class Layer {
    records = new Records
    beforeRecords = new Records
    afterRecords = new Records
}

export class Scheduler {
    private layerMap: Map<string, Layer> = new Map()
    private scheduled = false
    createLayer(name: string) {
        if (this.layerMap.has(name)) {
            throw `Schedule layer ${name} existed`
        }
        let layer: Layer = new Layer
        this.layerMap.set(name, layer)
        return layer
    }
    getLayer(name: string) {
        if (!this.layerMap.has(name)) {
            return this.createLayer(name)
        }
        return this.layerMap.get(name)
    }
    schedule() {
        return new Promise<null>((res) => {
            if (!this.scheduled) {
                this.scheduled = true
                let self = this
                function task() {
                    for (let ite of self.layerMap) {
                        let layer = ite[1]
                        if (layer.records.size === 0) {
                            continue
                        }
                        let records = layer.records.records
                        layer.records.clear()
                        if (records.size > 0) {
                            let beforeRecords = layer.beforeRecords
                            let afterRecords = layer.afterRecords
                            if (beforeRecords) {
                                for (let record of beforeRecords.records.values()) {
                                    record.callbackFunction.apply({}, record.params === null ? [] : record.params)
                                }
                            }
                            for (let record of records.values()) {
                                record.callbackFunction.apply({}, record.params === null ? [] : record.params)
                            }
                            if (afterRecords) {
                                for (let record of afterRecords.records.values()) {
                                    record.callbackFunction.apply({}, record.params === null ? [] : record.params)
                                }
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