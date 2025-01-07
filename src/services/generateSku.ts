import { generateOTP } from "./sendEmail";

function generateSKU( name:string) {

    const nameCode = name.replace(/\s+/g, '').substring(0, 3).toUpperCase(); // First 3 letters of product name
    const timestamp = Date.now().toString().substring(0,3);
    const randomDigits =  generateOTP()
  
    return `${nameCode}-${randomDigits}${timestamp}`;
  }

  export default generateSKU
  

  