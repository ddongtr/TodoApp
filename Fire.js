import firestore from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD9yn_Qz84q1wu-K-nKn7LxJQ1NlSuYTA0",
    authDomain: "todoapp-2abe7.firebaseapp.com",
    projectId: "todoapp-2abe7",
    storageBucket: "todoapp-2abe7.appspot.com",
    messagingSenderId: "917176174787",
    appId: "1:917176174787:web:5c52e57082cd3ee51aba76"
  };

class Fire {
    constructor(callback) {
        this.init(callback);
    };

    init(callback) {
        if (!firestore.apps.length) {
            firestore.initializeApp(firebaseConfig);
        };

        firestore.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null, user);
            } else {
                firestore.auth().signInAnonymously().catch(error => {
                    callback(error);
                });
            };
        });
    };

    
    getLists(callback) {
        let ref = this.ref.orderBy("name");
        
        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = [];
            
            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() });
            });
            
            callback(lists);
        });
    };

    addList(list) {
        let ref = this.ref;

        ref.add(list);
    }

    updateList(list) {
        let ref = this.ref;

        ref.doc(list.id).update(list);
    };

    deleteList(list) {
        let ref = this.ref;

        ref.doc(list.id).delete(list);
    }
    
    get userId() {
        return firestore.auth().currentUser.uid;
    };

    get ref() {
        return firestore.firestore().collection("users").doc(this.userId).collection("lists");
    }
};
export default Fire;