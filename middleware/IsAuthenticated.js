export default function({ store, redirect }) {
  // If the user is not authenticated
  if (!app.$cookies.get("auth") && !app.$cookies.get("userId")) {
    return redirect("/register");
  }
}
