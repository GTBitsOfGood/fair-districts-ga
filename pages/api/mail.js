import { parse } from "dotenv";
import nodemailer from "nodemailer";


async function handler(req, res) {
    if (req.method === "POST") {
        await emailVolunteers(req, res);
    }
};

function parseAssignments(assignments) {
    assignments = Object.values(assignments);

    let emails = {}
    for (let i = 0; i < assignments.length; ++i) {
        let email = assignments[i].volunteer.email;

        if (email in emails) {
            emails[email].newspaper.push(assignments[i].newspaper);
        } else {
            emails[email] = {
                "volunteer": assignments[i].volunteer, 
                "newspaper": [assignments[i].newspaper],
                "id": assignments[i].id
            }
        }

    }
    return emails;
}

function createMessage(email) {
    let tempString =  `
    <div dir="ltr">
        <br><br>
            <div class="gmail_quote">   
                <div dir="ltr">Thanks, ${email.volunteer.first_name}, for agreeing to submit some LTE’s. 
                We have assigned you the following for this weekend.  
                Please submit the attached letter to the newspapers listed below.  
                If you want to pass, please email me asap (julia.h.leon@gmail.com). Additional instructions:<br><br><ul><li> Feel free to edit the letter if you wish to suit your style, etc.
                        </li>
                        <li> Provide your contact information (name, city/state, phone number and email) with the submissions for verification purposes.  The newspapers will only print your name and city.</li><li> I recommend that you copy and paste this LTE into the body of your email to the newspaper.  Some editors may be concerned about a virus with an attachment.</li><li> Do NOT send this letter to any other newspapers without checking with me first. It is embarrassing to have the same letter sent to a paper from multiple people.</li><li>Sunday is usually the best time to submit.</li><li>Please email me to let me know that the letter has been submitted.</li></ul><br>Here are the papers:<br>`
                        

    let tempNewspapers = `<ol>`;

    for (let i = 0; i < email.newspaper.length; ++i) {
        let currPaper = email.newspaper[i];
        
        let temp = `<li>${currPaper.name}, `
        
        if (currPaper.submissionURL) {
            temp = temp + `Send to:  <a href="${currPaper.submissionURL}"
            target="_blank">${currPaper.submissionURL}</a></li>`
        } else {
            temp = temp + `Send to: <a href="mailto:${currPaper.email}" target="_blank">${currPaper.email}</a></li>
           `
        }

        tempNewspapers += temp;
    }

    tempNewspapers += "</ol>"


                         
    let endString=  `-- <br><div dir="ltr" data-smartmail="gmail_signature"><div dir="ltr"><div style="color:rgb(136,136,136)">Julia Leon</div><div style="color:rgb(136,136,136)">404.487.8298</div><div style="color:rgb(136,136,136)"><a href="https://www.fairdistrictsga.org/" style="color:rgb(17,85,204)" target="_blank">www.FairDistrictsGA.org</a></div><div style="color:rgb(136,136,136)">Facebook: @FairDistrictsGA</div><div style="color:rgb(136,136,136)">Twitter: @FairDistrictsGA</div><div style="color:rgb(136,136,136)"><br></div><div style="color:rgb(136,136,136)"><img src="https://docs.google.com/uc?export=download&amp;id=1pI5iB_HspXuRxHpNopw9jDc2ongQn3lj&amp;revid=0ByTb1Pi5zJ2kRnFjYmVRSHRUSkFRMEwzcGx1S3haOGMzY0xJPQ"><br></div></div></div></div>
</div><br clear="all"><div><br></div>-- <br><div dir="ltr" data-smartmail="gmail_signature"><div dir="ltr"><a href="mailto:julia.h.leon@gmail.com" target="_blank">Julia Leon</a><div><br></div><div>404.487.8298</div></div></div></div>
</div></div>`
    
    return tempString + tempNewspapers + endString;
}


async function emailVolunteers(req, res) {
    const assignments = req.body;
    const emails = parseAssignments(assignments);

    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
            user: "fair_districts@zohomail.com", 
            pass: process.env.MAIL_PASS 
        }
    });

    for (const [key, value] of Object.entries(emails)) {
        const mailOptions = {
            from: '"Fair Districts" <fair_districts@zohomail.com>',
            to: key,
            subject: "Letter-to-the-editor Submission",
            html: createMessage(value)
        };

        await transporter.sendMail(mailOptions);
        
        await prisma.assignment.update({
            where: {
              id: value.id
            },
            data: {
              emailSent: true,
            },
        });
    }

    res.status(200).json({});
};

export default handler;
