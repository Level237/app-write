import nodemailer from "nodemailer"
import User from "@/models/userModel"
import bcryptjs from 'bcryptjs';

export const sendEmail=async({email,emailType,userId}:any)=>{
    try {
        const hashedToken=await bcryptjs.hash(userId.toString(),10)

        if(emailType==="VERYFY"){
            await User.findOneAndUpdate(userId,
                {
                    resetPasswordToken:hashedToken,
                    verifyTokenExpiry:Date.now() + 3600000},)
        }else if(emailType==="RESET"){
            await User.findOneAndUpdate(userId,
                {
                    forgotPasswordToken:hashedToken,
                    forgotPasswordExpire:Date.now() + 3600000},)
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "97c99a8197aa4d",
              pass: "6855a0bc7d1103"
              //TODO add these credentials to .env file
            }
          });

          const mailOptions={
            from:'level@gmail.com',
            to:email,
            subject:emailType==="VERIFY" ? "Verify your email" : "Reset your password",
            html:`<p>Click <a href="${process.env.domain}/verifyemail?token=${hashedToken}">
            Here</a> to ${emailType}==="VERIFY" ? "verify your email" : "reset your password"</p>`
          }

          const mailResponse=await transport.sendEmail(mailOptions);

          return mailResponse;
       
    } catch (error:any) {
        throw new Error(error.message)
    }
}
