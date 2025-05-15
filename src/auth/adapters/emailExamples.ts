export const emailExamples = {
  registrationEmail(code: string) {
      return ` <h1>Thank for your registration</h1>
             <p>To finish registration please follow the link below:<br>
                <a href='https://some-front.com/confirm-registration?code=${code}'>complete registration</a>
            </p>`
  }
}
