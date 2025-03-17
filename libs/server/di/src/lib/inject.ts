import { container } from 'tsyringe';
import { DIToken } from './DIToken.js';
import { register } from './register.js';

export const inject = <T = unknown>(token: DIToken<T>): T => {
  if (
    !container.isRegistered(token.symbol) &&
    token.defaultProvider !== undefined
  ) {
    register(token, token.defaultProvider);
  }
  return container.resolve(token.symbol);
};
