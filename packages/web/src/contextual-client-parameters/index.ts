import { getGeolocation } from './geolocation';

export type ContextualClientParameters = typeof contextualClientParameters;

export const contextualClientParameters = {
  geolocation: getGeolocation,
};
