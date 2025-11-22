export type UserProfileToken = {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    userName: string;
  };
};


export type UserProfile = {
    email: string;
    userName: string;
};
