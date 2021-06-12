export default async function(req, res, next) {
    const { userId, auth } = await auth.$storage.getLocalStorage("authenticated");

    console.log("*getThaichana");
    console.log(userId);

    const thaichanaUserRef = this.$fire.firestore.collection("thaichana");

    try {
        const snapshot = await thaichanaUserRef.where("userId", "==", userId).get();
        if (snapshot.empty) {
            console.log("No matching documents.");
            return [];
        }

        let myShops = [];
        snapshot.forEach(childSnapshot => {
            myShops.push({
                appId: childSnapshot.data().appId,
                businessType: childSnapshot.data().businessType,
                canCheckin: childSnapshot.data().canCheckin,
                shopId: childSnapshot.data().shopId,
                status: childSnapshot.data().status,
                subcategory: childSnapshot.data().subcategory,
                title: childSnapshot.data().title
            });
        });

        return res.status(200).json(myShops);
        next();
    } catch (e) {
        commit("SET_DIALOG", {
            isShow: true,
            title: "Thaichana history error",
            message: e.message
        });
        return;
    }
}