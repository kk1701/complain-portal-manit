import { email_logger as logger } from "./logger.js";
import transporter from "./transporter.js";
import Queue from "bull";
import dotenv from "dotenv";
dotenv.config();

const emailQueue = new Queue("emailQueue", {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
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

const MANIT_COLORS = {
    primary: '#1a4f8b',    // MANIT Blue
    secondary: '#e44d26',  // Accent Orange
    success: '#2e7d32',    // Success Green
    text: '#2d3748',       // Dark Text
    lightText: '#718096',  // Light Text
    border: '#e2e8f0'      // Border Color
};

const baseTemplate = `
    <div style="
      font-family: 'Segoe UI', Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    ">
      <header style="text-align: center; margin-bottom: 24px;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWhBHSMEY1Pa5xcGH5Pj2HLZOPlfyraJ0STQ&s" 
             alt="MANIT Bhopal Logo" 
             style="max-width: 150px; height: auto;"
        />
        <h1 style="
          color: ${MANIT_COLORS.primary};
          margin: 16px 0 8px;
          font-size: 24px;
          font-weight: 600;
        ">
          MANIT Complaint Management Portal
        </h1>
      </header>
      {{content}}
      <footer style="
        margin-top: 32px;
        padding-top: 16px;
        border-top: 1px solid ${MANIT_COLORS.border};
        text-align: center;
        font-size: 12px;
        color: ${MANIT_COLORS.lightText};
      ">
        <p>Maulana Azad National Institute of Technology</p>
        <p>Link Road Number 3, Near Kali Mata Mandir, Bhopal, Madhya Pradesh 462003</p>
        <p style="margin-top: 16px;">&copy; ${new Date().getFullYear()} MANIT Complaint Portal. All rights reserved.</p>
      </footer>
    </div>
`;

export const automateEmail = async (data) => {
    logger.info("Starting automateEmail with data:", data);
    try {
        const { category, complaint } = data;
        if (!complaint) {
            logger.warn("No complaint provided");
            throw new Error("Complaint is required");
        }

        // Get formatted date
        const submittedDate = new Date(complaint.createdAt).toLocaleString('en-IN', {
            dateStyle: 'long',
            timeStyle: 'short'
        });

        // Common details section
        const commonDetails = `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}"><strong>Scholar Number:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}">${complaint.scholarNumber}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}"><strong>Student Name:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}">${complaint.studentName}</td>
            </tr>
            ${complaint.stream ? `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}"><strong>Stream:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}">${complaint.stream}</td>
            </tr>` : ''}
            ${complaint.year ? `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}"><strong>Year:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}">${complaint.year}</td>
            </tr>` : ''}
            ${complaint.department ? `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}"><strong>Department:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}">${complaint.department}</td>
            </tr>` : ''}
            ${complaint.hostelNumber ? `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}"><strong>Hostel:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}">${complaint.hostelNumber}</td>
            </tr>` : ''}
            ${complaint.room ? `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}"><strong>Room:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}">${complaint.room}</td>
            </tr>` : ''}
            ${complaint.landmark ? `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}"><strong>Landmark:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}">${complaint.landmark}</td>
            </tr>` : ''}
            ${complaint.complainType ? `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}"><strong>Complaint Type:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}">${complaint.complainType}</td>
            </tr>` : ''}
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}"><strong>Submitted On:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid ${MANIT_COLORS.border}">${submittedDate}</td>
            </tr>
        `;

        const content = `
            <div style="color: ${MANIT_COLORS.text};">
                <div style="
                    background-color: #f7fafc;
                    border-left: 4px solid ${MANIT_COLORS.primary};
                    padding: 16px;
                    margin-bottom: 24px;
                    border-radius: 4px;
                ">
                    <h2 style="
                        color: ${MANIT_COLORS.primary};
                        margin: 0 0 8px;
                        font-size: 20px;
                    ">Complaint Submitted Successfully</h2>
                    <p style="margin: 0;">Complaint ID: <strong>#${complaint._id}</strong></p>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6;">
                    Dear <strong>${complaint.studentName}</strong>,
                </p>
                
                <div style="
                    background-color: #f8f9fa;
                    padding: 16px;
                    border-radius: 4px;
                    margin: 16px 0;
                ">
                    <h3 style="
                        color: ${MANIT_COLORS.secondary};
                        margin: 0 0 12px;
                        font-size: 18px;
                    ">Complaint Details</h3>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                        <tbody>
                            ${commonDetails}
                        </tbody>
                    </table>

                    <div style="
                        background-color: #ffffff;
                        padding: 12px;
                        border-radius: 4px;
                        border: 1px solid ${MANIT_COLORS.border};
                    ">
                        <h4 style="
                            color: ${MANIT_COLORS.text};
                            margin: 0 0 8px;
                            font-size: 16px;
                        ">Description:</h4>
                        <p style="margin: 0; line-height: 1.6;">${complaint.complainDescription}</p>
                    </div>
                </div>
                
                <p style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: ${MANIT_COLORS.success};
                    font-weight: 500;
                ">
                    Your complaint has been received and will be reviewed by the designated authority shortly.
                </p>
            </div>
        `;

        const email = complaint.useremail;
        const subject = `[MANIT Complaints] New ${category} Complaint #${complaint._id} Submitted`;
        const html = baseTemplate.replace('{{content}}', content);
        const text = `
Complaint Submitted Successfully

Complaint ID: #${complaint._id}
Category: ${category}
Scholar Number: ${complaint.scholarNumber}
Student Name: ${complaint.studentName}
${complaint.stream ? `Stream: ${complaint.stream}` : ''}
${complaint.year ? `Year: ${complaint.year}` : ''}
${complaint.department ? `Department: ${complaint.department}` : ''}
${complaint.hostelNumber ? `Hostel: ${complaint.hostelNumber}` : ''}
${complaint.room ? `Room: ${complaint.room}` : ''}
${complaint.landmark ? `Landmark: ${complaint.landmark}` : ''}
${complaint.complainType ? `Complaint Type: ${complaint.complainType}` : ''}
Submitted On: ${submittedDate}

Description:
${complaint.complainDescription}

Your complaint has been received and will be reviewed by the designated authority shortly.

Best Regards,
MANIT Support Team`;

        logger.info(`Adding email job to the queue ${complaint._id}`);
        await emailQueue.add({ email, subject, html, text });
      
    } catch (error) {
        logger.error("Error in automateEmail:", error);
        throw error;
    }
};
