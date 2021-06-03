export default function({ store, redirect, app }) {
    // If the user is not authenticated
    if (!window.localStorage.authenticated) {
        return redirect("/register");
    }
}