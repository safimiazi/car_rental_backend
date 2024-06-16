import { TErrorSource } from "../interface/error";

const handleDuplicateError = (err: any) => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSource: TErrorSource = [
    {
      path: "",
      message: `${extractedMessage} is already exist!`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Duplicate Error!",
    errorSource,
  };
};

export default handleDuplicateError;
