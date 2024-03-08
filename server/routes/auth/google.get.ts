export default oauth.googleEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        googleId: user.sub,
      },
    });
    return sendRedirect(event, "/");
  },

  onError(event, error) {
    console.error("GitHub OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
