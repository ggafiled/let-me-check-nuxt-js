export default function({ store, redirect, app }) {
  // If the user is not authenticated
  if (
    store.state.authenticated.userId.length &&
    store.state.authenticated.auth
  ) {
    return redirect("/myshop");
  }
}
