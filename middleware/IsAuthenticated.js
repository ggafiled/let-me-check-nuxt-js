export default function({ store, redirect, app }) {
  // If the user is not authenticated
  if (!window.localStorage.getItem("authenticated")) {
    return redirect("/register");
  }
}
