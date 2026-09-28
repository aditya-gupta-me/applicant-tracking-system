import { CreateEmailResponse, Resend } from "resend";

async function sendEmail(from: string = 'onboarding@resend.dev', to: string, subject: string, html: string): Promise<CreateEmailResponse> {
    const resend = new Resend(process.env.RESEND_EMAIL_API);

    const email = await resend.emails.send({
        from,
        to,
        subject,
        html
    })

    return email;
}


export { sendEmail };