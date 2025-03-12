import mongoose from "mongoose"

export const connectDB = async()=> {
    await mongoose.connect('mongodb+srv://samayjain2405:Samay%402405@jainamcaterers.mah0f.mongodb.net/JAINAM_CATERERS').then(()=>console.log("DB Connected"));

}