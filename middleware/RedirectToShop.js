export default function({ store, redirect, app }) {
  // If the user is not authenticated
  if (
    this.$store.state.authenticated.userId.length &&
    this.$store.state.authenticated.auth
  ) {
    return redirect("/myshop");
  }
}
