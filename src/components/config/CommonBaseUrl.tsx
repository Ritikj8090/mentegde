export const BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
export const WS_URL: string = import.meta.env.VITE_WS_URL;
export const UPLOAD_PHOTOS_URL: string = import.meta.env.VITE_API_UPLOAD_PHOTOS_URL;

export const TURN_CONFIG = {
  urls: [
    import.meta.env.VITE_TURN_URL,
    import.meta.env.VITE_TURN_TCP_URL,
    import.meta.env.VITE_TURN_TLS_URL,
  ].filter(Boolean),
  username: import.meta.env.VITE_TURN_USERNAME,
  credential: import.meta.env.VITE_TURN_CREDENTIAL,
};

export const STUN_CONFIG = {
  urls: import.meta.env.VITE_STUN_URL,
};
