import Shoutbox from "../src/index"

const shoutbox = new Shoutbox();

(async() => {
    await shoutbox.sendEmail({
      name: "Vlad",
      from: "no-reply@shoutbox.net",
      to: "test@example.com",
      subject: "A question about the meetup",
      html: "<b>Hi, Are you still going to that meetup?</b>",
    }); 
})();