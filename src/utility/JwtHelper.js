import Auth from '@aws-amplify/auth';

export const authHeader = async () => {
  const {
    accessToken: { jwtToken },
  } = await Auth.currentSession();
  const au = await Auth.currentAuthenticatedUser();
  if (au && jwtToken) {
    return { Authorization: `Bearer ${jwtToken}` };
  } else {
    return;
  }
};
