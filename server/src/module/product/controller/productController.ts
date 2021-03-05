import { Application as App } from 'express'

class ProductController {
    public ROUTE_BASE: string
    constructor() {
        this.ROUTE_BASE = "/product"
    }

    configureRoutes(app: App) {
        const ROUTE = this.ROUTE_BASE
        app.get(`${ROUTE}`, this.index.bind(this))
        app.get(`${ROUTE}/findByName`, this.findProductByName.bind(this))
    }

    index() {
        return "entraste al index"
    }

    findProductByName() {
        return "no implementado"
    }

}

export default ProductController