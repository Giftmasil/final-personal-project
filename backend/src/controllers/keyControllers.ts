import { Request, Response } from "express"

export const paypalKey = (req:Request, res:Response) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID || 'sb' })
}


export const googleKey = (req:Request, res:Response) => {
    res.send({ key: process.env.GOOGLE_API_KEY || 'nokey' })
}



export const stripeKey = (req:Request, res:Response) => {
    res.json({ key: process.env.STRIPE_PUBLISHABLE_KEY })
}