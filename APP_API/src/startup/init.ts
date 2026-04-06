import { Express } from 'express';
import { ErrorMessages } from '../shared/enums/messages/error-messages.enum';
import { exceptionLogWrapper } from '../shared/helpers/exception-log-wrapper.helper';




const appSetup = async (app: Express) => {
  try {
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} 🚀🚀🚀`)
    });

 
  } catch (error: unknown) {
    console.log("error", error)
    exceptionLogWrapper(error, ErrorMessages.AppStartupFail);
  }
};

export default appSetup;
