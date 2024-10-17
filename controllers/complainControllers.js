import Complains from "../models/complainModel.js";

// const cookieOptions = {
//     secret: true,
//     maxAge: 1*24*60*60*1000,   //1 day
//     httpOnly: true
// }

const registerComplain = async (req, res) => {
    const { complainType, complainDescription, attachments } = req.body

    console.log(complainType, complainDescription, attachments);

    const complain = await Complains.create({
        complainType,
        complainDescription,
        attachments
    })

    if(!complain){
        res.status(400).json({
            success: false,
            message: "Complain registration failed, please try again."
        })
    }

    await complain.save()

    res.status(200).json({
        success: true,
        message: "Complain registered successfully!"
    })
}

export default registerComplain