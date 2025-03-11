const API_BASE_URL = import.meta.env.API_BASE_URL


export const USER_API_END_POINT = `${API_BASE_URL}/user`;
export const PROJECT_API_END_POINT = `${API_BASE_URL}/project`;
export const APPLICATION_API_END_POINT = `${API_BASE_URL}/request`;
export const COMPANY_API_END_POINT = `${API_BASE_URL}/group`;
export const INVITATION_API_END_POINT = `${API_BASE_URL}/invitation`;
export const MESSAGES_API_END_POINT = `${API_BASE_URL}/project-messages`;
export const CHANNEL_API_END_POINT = `${API_BASE_URL}/channel`;
export const TASK_API_END_POINT = `${API_BASE_URL}/task`;
export const MILESTONE_API_END_POINT = `${API_BASE_URL}/milestone`;
export const FILE_API_END_POINT = `${API_BASE_URL}/files`;
export const DOCUMENTATION_API_END_POINT = `${API_BASE_URL}/documentation`;
export const INBOX_API_END_POINT = `${API_BASE_URL}/direct-messages`;
export const PROJECT_MESSAGE_API_END_POINT = `${API_BASE_URL}/project-messages`;
export const NOTIFICATION_API_END_POINT = `${API_BASE_URL}/notification`;
export const PROFESSION_API_END_POINT = `${API_BASE_URL}/professions`;


export const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const IS_PRODUCTION = import.meta.env.VITE_ENV === 'production'

export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";

export const FEATURES = {
  enableNotifications: true,
  enableRealTimeChat: true,
  enableAnalytics: IS_PRODUCTION,
};