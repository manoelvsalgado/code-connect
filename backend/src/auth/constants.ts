const isProduction = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET;

if (isProduction && !jwtSecret) {
  throw new Error('JWT_SECRET must be defined in production');
}

export const jwtConstants = {
  secret: jwtSecret || 'secretKey',
};
