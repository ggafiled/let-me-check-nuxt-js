export default function({ store, redirect }) {
  // If the user is not authenticated
  if (
    !store.state.localStorage.authenticated.auth &&
    !store.state.localStorage.authenticated.userId
  ) {
    return redirect("/register");
  }
}
