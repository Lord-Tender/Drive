import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDIpdXgMUm9V13jvxXcZZRxHO-afHNyj7M",
    authDomain: "tender-music.firebaseapp.com",
    projectId: "tender-music",
    storageBucket: "tender-music.appspot.com",
    messagingSenderId: "638236677984",
    appId: "1:638236677984:web:a788fa6913244e8fa3b005"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user.emailVerified == false) {
        document.getElementById('verifyEmail').style.display  = "block"
        document.querySelector('body').style.overflow = 'hidden'
    }else{
        document.getElementById('verifyEmail').style.display  = "none"
    }

})

const storage = getStorage();
onAuthStateChanged(auth, (user) => {
    let userUid = user.uid
    console.log(userUid);
    const listRef = ref(storage, `${userUid}/Image/`);
    listAll(listRef)
        .then((res) => {
            res.prefixes.forEach((folderRef) => {
                console.log(folderRef);
            });
            res.items.forEach((itemRef, index) => {
                showFileHere.innerHTML += `
                    <p>${index+1}. ${itemRef.name}</p>
                `
                if (res.items.length > 0) {
                    getDownloadURL(ref(itemRef))
                        .then((url) => {
                            document.querySelector("#image h1").style.display = 'none'
                            let imgDiv = document.getElementById('image')
                            // imgDiv.innerHTML += `<img src="${url}" alt="" class="images"/>`
                        })
                        .catch((error) => {
                            // Handle any errors
                        });
                }
            });
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        // console.log("I am here");
    } else {
        window.location.href = 'signin.html'
    }
})

// Change Input label to file name

file.addEventListener("change", () => {
    let file = document.getElementById('file').files
    document.getElementById('fileText').innerHTML = `${file[0].name}`
});

// Upload file 

const upLoadFile = () => {
    let fileName = document.getElementById("fileName").value
    let file = document.getElementById('file').files
    if (file.length !== 0 && fileName !== "") {
        onAuthStateChanged(auth, (user) => {
            let currentUser = user.uid
            const storage = getStorage();

            console.log(file[0].type);

            if (file[0].type.startsWith("image/")) {
                const storageRef = ref(storage, `${currentUser}/Image/${fileName}`);
                const uploadTask = uploadBytesResumable(storageRef, file[0]);
                if (uploadTask) {
                    sucMsg.style.display = "block"

                    setTimeout(() => {
                        sucMsg.style.display = "none"
                    }, 5000);
                    fileName === ""
                    document.getElementById("fileName").value == ""
                }
            } else if (file[0].type.startsWith("video/")) {
                const storageRef = ref(storage, `${currentUser}/Video/${fileName}`);
                const uploadTask = uploadBytesResumable(storageRef, file[0]);
                if (uploadTask) {
                    sucMsg.style.display = "block"

                    setTimeout(() => {
                        sucMsg.style.display = "none"
                    }, 5000);
                }
            } else if (file[0].type.startsWith("audio/")) {
                const storageRef = ref(storage, `${currentUser}/Audio/${fileName}`);
                const uploadTask = uploadBytesResumable(storageRef, file[0]);
                if (uploadTask) {
                    sucMsg.style.display = "block"

                    setTimeout(() => {
                        sucMsg.style.display = "none"
                    }, 5000);
                }
            } else {
                const storageRef = ref(storage, `${currentUser}/Document/${fileName}`);
                const uploadTask = uploadBytesResumable(storageRef, file[0]);
                if (uploadTask) {
                    sucMsg.style.display = "block"

                    setTimeout(() => {
                        sucMsg.style.display = "none"
                    }, 5000);
                }
                fileName === ""
            }

        });
    } else {
        errMsg.style.display = "block"

        setTimeout(() => {
            errMsg.style.display = "none"
        }, 3000);
    }
}

window.upLoadFile = upLoadFile;

const check = () => {
    const storage = getStorage();
    const listRef = ref(storage, 'O26keO6uRfW3tCPXj76X1dJPxDM2/Image');
    listAll(listRef)
        .then((res) => {
            res.prefixes.forEach((folderRef) => {
                console.log(folderRef);
            });
            res.items.forEach((itemRef) => {
            });
            console.log(res);
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });
}

window.check = check;



// Log out user

const logOutNow = () => {
    signOut(auth).then(() => {
        window.location.href = 'signin.html'
    }).catch((error) => {
        // An error happened.
    });
}

window.logOutNow = logOutNow

const showFile = () => {
    document.getElementById('myFile').style.display = 'block'
    document.getElementById('uploadFile').style.display = 'none'
}

window.showFile = showFile

const showUpload = () => {
    document.getElementById('uploadFile').style.display = 'block'
    document.getElementById('myFile').style.display = 'none'
}

window.showUpload = showUpload