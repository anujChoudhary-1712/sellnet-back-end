const dotenv = require("dotenv");
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const createCheckoutSession = async(req,res) =>{
 try {
    const {products,userId} = req.body

    const lineItems = products.map((product)=>({
        price_data:{
            currency:"usd",
            product_data:{
                name:product.name,
                images:[product.imageUrl]
            },
            unit_amount:product.price
        },
        quantity:1
    }))
    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:`http://localhost:3000/success/${userId}`,
        cancel_url:`http://localhost:3000/cancel/${userId}`,
        billing_address_collection: 'auto'
    })

    return res.json({success:true,id:session.id})
 } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
 }   
}

module.exports = {createCheckoutSession}