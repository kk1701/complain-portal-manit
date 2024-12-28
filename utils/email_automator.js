import { email_logger as logger } from "./logger";
import transporter from "./transporter";
import Queue from "bull";
import dotenv from "dotenv";
dotenv.config();

const emailQueue = new Queue("emailQueue", {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});

const processor = async (job) => {
    logger.info(`Processing job for email to ${job.data.email}`);
    const { email, subject, html, text } = job.data;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            html,
            text,
        });
        logger.info(`Email successfully sent to ${email}`);
    } catch (err) {
        logger.error(`Error sending email to ${email}:`, err);
        throw new Error("Email sending failed");
    }
};

emailQueue.process(processor);

export const automateEmail = async (data) => {
    logger.info("Starting automateEmail with data:", data);
    try {
        const { category, complaint } = data;
        if (!complaint) {
            logger.warn("No complaint provided");
            throw new Error("Complaint is required");
        }

        const email = complaint.useremail;
        logger.info(`Preparing email for ${email}`);

        const subject = `Complaint Submission Confirmation - ${category}`;
        const html = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h2 style="color: #4CAF50;">Your Complaint Has Been Received</h2>
                <p>Dear User,</p>
                <p>Thank you for submitting your complaint regarding <strong>${category}</strong>.</p>
                <p><strong>Complaint Details:</strong></p>
                <p>${complaint}</p>
                <p>Designated Authority will review your complaint and get back to you shortly.</p>
                <br/>
                <p>Best Regards,<br/>Support Team</p>
            </div>
        `;
        const text = `Your complaint regarding ${category} has been received.\n\nComplaint Details:\n${complaint}\n\nOur team will get back to you shortly.\n\nBest Regards,\nSupport Team`;

        logger.info(`Adding email job to the queue ${complaint._id}`);
        await emailQueue.add({ email, subject, html, text });
      
    } catch (error) {
        logger.error("Error in automateEmail:", error);
        throw error;
    }
};
