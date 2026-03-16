import { Request, Response } from "express"
import * as productService from "../services/product.service.js"

export const getProducts = async (req: Request, res: Response) => {
  try {

    const { search, category, page, limit } = req.query

    const products = await productService.getProducts(
      search as string,
      category as string,
      Number(page) || 1,
      Number(limit) || 10
    )

    res.json(products)

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" })
  }
}

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id as string)
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body)
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.updateProduct(req.params.id as string, req.body)
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.deleteProduct(req.params.id as string)
    res.json({ message: "Product deleted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" })
  }
}
