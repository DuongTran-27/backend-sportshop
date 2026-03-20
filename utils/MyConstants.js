const MyConstants = {
 DB_SERVER : process.env.DB_SERVER ,
 DB_USER : process.env.DB_USER ,
 DB_PASS : process.env.DB_PASS ,
 DB_DATABASE : process.env.DB_DATABASE ,
 EMAIL_USER : process.env.EMAIL_USER ,
 EMAIL_PASS : process.env.EMAIL_PASS ,
 JWT_SECRET : process.env.JWT_SECRET ,
 JWT_EXPIRES : process.env.JWT_EXPIRES, // token expiry (example: '1d', '12h', or number of seconds)
};
module.exports = MyConstants;
// mongodb+srv://toilasinhvienvanlang:congnghethongtin@websport.hrlys38.mongodb.net/ 