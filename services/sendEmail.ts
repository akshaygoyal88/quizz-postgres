import sgMail from "@/utils/sendgrid";


interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

const sendEmail = async ({ to, subject, templateId, dynamicTemplateData}: EmailOptions) => {
  const msg = {
    to,
    from: 'knipoint@gmail.com',
    templateId,
    dynamicTemplateData,
    subject,
    // text,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
