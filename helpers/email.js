import nodemailer from 'nodemailer';

export const emailRegister=async (data)=>{

    const{name,email,token} = data;
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST ,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user:process.env.EMAIL_USER ,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    
    //Informacion del Email
      const info = await transport.sendMail({
            from: '"EarthExplorer" <cuentas@earthExplorer.com>',
            to:email,
            subject:"EarthExplorer - Comprueba tu cuenta",
            text: "Codigo de activacion de tu cuenta en EarthExplorer",
            html:` <p>Hola: ${name} gracias por registrarte en  EarthExplorer</p>
            <p>Tu cuenta ya esta casi lista, solo debes ingresar en el siguiente codigo: </p>
            <p>${token} en el juego</p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
            
            `
      })
}


export const emailForgotPassword=async (data)=>{

  const{name,email,token} = data;
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST ,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user:process.env.EMAIL_USER ,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  


     //Informacion del Email
     const info = await transport.sendMail({
      from: '"EarthExplorer" <cuentas@earthExplorer.com>',
      to:email,
      subject:"EarthExplorer - Restablece tu Contraseña",
      text: "Restablece tu Contraseña",
      html:` <p>Hola: ${name} has solicitado restablecer tu contraseña</p>
      <p>Para recuperar tu acceso, solo debes ingresar en el siguiente codigo: </p>
      <p>${token} en el juego</p>

      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
      
      `
})
}
