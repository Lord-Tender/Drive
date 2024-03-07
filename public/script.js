import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, listAll, getDownloadURL, getMetadata, deleteObject, updateMetadata } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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
        document.getElementById('verifyEmail').style.display = "block"
        document.querySelector('body').style.overflow = 'hidden'
    } else {
        document.getElementById('verifyEmail').style.display = "none"
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
                getDownloadURL(ref(itemRef))
                    .then((url) => {
                        console.log(url)
                    })
                    .catch((error) => {
                    });
                if (res.items.length > 0) {
                    document.querySelector("#image h1").style.display = 'none'
                    showFileHere.innerHTML += `
                        <p onclick="showMyFile('${itemRef}')">${index + 1}. ${itemRef.name}</p>
                    `
                }
            });
        })

    // Display video

    const listRefV = ref(storage, `${userUid}/Video/`);
    listAll(listRefV)
        .then((res) => {
            res.prefixes.forEach((folderRef) => {
                console.log(folderRef);
            });
            res.items.forEach((itemRef, index) => {
                getDownloadURL(ref(itemRef))
                    .then((url) => {
                        console.log(url)
                    })
                    .catch((error) => {
                    });
                if (res.items.length > 0) {
                    document.querySelector("#video h1").style.display = 'none'
                    showFileHere2.innerHTML += `
                        <p onclick="showMyFile('${itemRef}')">${index + 1}. ${itemRef.name}</p>
                    `
                }
            });
        })
    
    // Display Audio

    const listRefA = ref(storage, `${userUid}/Audio/`);
    listAll(listRefA)
        .then((res) => {
            res.prefixes.forEach((folderRef) => {
                console.log(folderRef);
            });
            res.items.forEach((itemRef, index) => {
                getDownloadURL(ref(itemRef))
                    .then((url) => {
                        console.log(url)
                    })
                    .catch((error) => {
                    });
                if (res.items.length > 0) {
                    document.querySelector("#audio h1").style.display = 'none'
                    showFileHere3.innerHTML += `
                        <p onclick="showMyFile('${itemRef}')">${index + 1}. ${itemRef.name}</p>
                    `
                }
            });
        })
})


// Show the exact file whether it img or whatever

let toDelete = ""
let toEdit = ""
let toUrl = ""

const showMyFile = (item) => {
    showExactFile.style.display = 'block'

    toDelete = item
    toEdit = item
    getDownloadURL(ref(storage, item))
        .then((url) => {
            toUrl = url

            const forestRef = ref(storage, `${url}`);
            getMetadata(forestRef)
                .then((metadata) => {
                    if (metadata.contentType.startsWith("image/")) {
                        exactFile.innerHTML = `<img src="${url}" alt=""/>`
                    } else if (metadata.contentType.startsWith("video/")) {
                        exactFile.innerHTML = `<video src="${url}" controls ></video>`
                    }else if (metadata.contentType.startsWith("audio/")) {
                        exactFile.innerHTML = `<audio src="${url}" controls ></audio>`
                    }
                    showExactFileName.innerHTML = `${metadata.name}`
                    let size = metadata.size
                    const kiloSize = (size / 1024).toFixed(2)
                    const megaByte = (kiloSize / 1024).toFixed(2)
                    const gByte = (megaByte / 1024).toFixed(1)
                    if (size >= 1024 && size <= 1048576) {
                        showExactSize.innerHTML = `${kiloSize}KB`
                    } else if (size >= 1048576 && size <= 1073741824) {
                        showExactSize.innerHTML = `${megaByte}MB`
                    } else if (size >= 1073741824) {
                        showExactSize.innerHTML = `${gByte}GB`
                    }
                    const userTimeZone = { timeZone: "Africa/Lagos" }

                    // Get time created in User Time Zone

                    let timeCreated = metadata.timeCreated
                    const date = new Date(timeCreated)
                    let timeCreatedConvert = date.toLocaleString('en-US', userTimeZone)
                    showExactTime.innerHTML = timeCreatedConvert

                    // Get time created in User Time Zone

                    let timeUpdated = metadata.updated
                    const date2 = new Date(timeUpdated)
                    let timeUpdatedConvert = date2.toLocaleString('en-US', userTimeZone)
                    showExactUpdated.innerHTML = timeUpdatedConvert

                })
        })
        .catch((error) => {
        });

}

window.showMyFile = showMyFile


// Delete file

const deleteFile = () => {
    const desertRef = ref(storage, `${toDelete}`);
    deleteObject(desertRef).then(() => {
        alert("Deleted")
    }).catch((error) => {
        // Uh-oh, an error occurred!
    });
}


window.deleteFile = deleteFile

// Edit file name

const editName = () => {
    const forestRef = ref(storage, `${toEdit}`);
    let newFilename = "Tender"

    forestRef.updateMetadata({ name: newFilename })
        .then((metadata) => {
            // Metadata updated successfully
            console.log('Filename updated successfully:', metadata);
        })
        .catch((error) => {
            // An error occurred while updating metadata
            console.error('Error updating filename:', error);
        });
}

window.editName = editName

onAuthStateChanged(auth, (user) => {
    if (!user) {
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


// Log out user

const logOutNow = () => {
    signOut(auth).then(() => {
        window.location.href = 'signin.html'
    }).catch((error) => {
        // An error happened.
    });
}

window.logOutNow = logOutNow

// Switching from My files and Upload File section

const showFile = () => {
    document.getElementById('myFile').style.display = 'block'
    document.getElementById('uploadFile').style.display = 'none'
    tougler.style.display = "block"
    DisTougler.style.display = 'none'
    if (window.innerWidth <= 480) {
        document.querySelector('aside').style.display = 'none'
    }
}

window.showFile = showFile

const showUpload = () => {
    document.getElementById('uploadFile').style.display = 'block'
    document.getElementById('myFile').style.display = 'none'
    tougler.style.display = "block"
    DisTougler.style.display = 'none'
    if (window.innerWidth <= 480) {
        document.querySelector('aside').style.display = 'none'
    }
}

window.showUpload = showUpload

// Show file modal cancel button

closeBtn.addEventListener('click', () => {
    showExactFile.style.display = 'none'
})

let sidebar = ""

tougler.addEventListener('click', () => {
    tougler.style.display = "none"
    DisTougler.style.display = 'block'
    sidebar = document.querySelector('aside').style.display = 'block'
    document.querySelector('body').style.overflow = 'hidden'
})

if (document.querySelector('aside').style.width == 75) {
    alert("what?")
}

DisTougler.addEventListener('click', () => {
    DisTougler.style.display = 'none'
    tougler.style.display = "block"
    document.querySelector('aside').style.display = 'none'
    document.querySelector('body').style.overflow = 'scroll'
})

