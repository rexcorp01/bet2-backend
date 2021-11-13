const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


templates = {
  forgot_password: "d-",
  new_user_invite: 'd-'
};


const sendForgotPasswordMailTemplate = async (toEmail, firstName, link) => {
  
  const forgotPasswordTemplateEmail = {
      //extract the email details
      to: toEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      templateId:process.env.SENDGRID_FORGOT_PASSWORD_TEMPLATE,
      //extract the custom fields 
      dynamic_template_data: {
        first_name: firstName,
        forgot_password_url: link
      }
    };
  
    //ES8
  (async () => {
      try {
        await sgMail.send(forgotPasswordTemplateEmail);
      } catch (error) {
        console.error("error:",error);
    
        if (error.response) {
          console.error("error response body:",error.response.body)
          return error.response.body
        }
      }
    })();
  }

const sendNewUserInviteTemplate = async (toEmail, firstName, newPassword) => {
  
    const newUserTemplateEmail = {
        //extract the email details
        to: toEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        templateId:process.env.SENDGRID_FORGOT_PASSWORD_TEMPLATE,
        //extract the custom fields 
        dynamic_template_data: {
          first_name: firstName,
          new_password: newPassword
        }
      };
    
      //ES8
    (async () => {
        try {
          await sgMail.send(newUserTemplateEmail);
        } catch (error) {
          console.error("error:",error);
      
          if (error.response) {
            console.error("error response body:",error.response.body)
            return error.response.body
          }
        }
      })();
    }

module.exports = {
    sendForgotPasswordMailTemplate,
    sendNewUserInviteTemplate
}