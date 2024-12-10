(function () {
  var startTime = new Date();

  function getTimeInApp() {
    var timeDiff = new Date() - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;
    // get seconds
    var seconds = Math.round(timeDiff);
    return seconds;
  }

  if (!localStorage.getItem("id")) {
    var id = "id" + Math.random().toString(16).slice(2);
    localStorage.setItem("id", id);
  }

  var sessionStart = new Date().toISOString();

  function sendData() {
    fetch("https://base-api-ts.herokuapp.com/sauron", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sesionStart: sessionStart,
        userId: localStorage.getItem("id"),
        pathName: window.location.href,
        prevPathName: "",
        pathDateTime: "",
        timeInApp: getTimeInApp(),
      }),
    });
  }

  window.setInterval(sendData, 10000);
  sendData();
})();

document.getElementById("menu-icon").addEventListener("click", function () {
  const navLinks = document.getElementById("nav-links");
  if (navLinks.style.display === "flex") {
    navLinks.style.display = "none";
  } else {
    navLinks.style.display = "flex";
  }
});

document.getElementById("nav-links").addEventListener("click", function () {
  if (window.innerWidth < 770) {
    document.getElementById("nav-links").style.display = "none";
  }
});

document
  .getElementById("mobile-nav-close")
  .addEventListener("click", function () {
    const navLinks = document.getElementById("nav-links");
    if (navLinks.style.display === "flex") {
      navLinks.style.display = "none";
    } else {
      navLinks.style.display = "flex";
    }
  });

document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    document.getElementById("contact-form").classList.add("hidden");
    document.getElementById("loading").classList.remove("hidden");
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch("https://base-api-ts.herokuapp.com/mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    })
      .then((response) => {
        if (response.ok) {
          // alert("Message sent successfully!");
          document.getElementById("loading").classList.add("hidden");
          document.getElementById("contact-success").classList.remove("hidden");
        } else {
          alert("Failed to send message.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while sending the message.");
      });
  });

fetch(
  "https://base-api-ts.herokuapp.com/publicGallery/denniscalvert/birmingham-street-photography"
).then((res) => {
  res.json().then((data) => {
    // console.log(data.gallery.images);
    // return;
    //   <div class="grid-item" style="flex: 1 1 299.5px">
    //   <img
    //     src="https://magiccityfilmmakers.s3.us-east-2.amazonaws.com/galleries/67550fea49ee574c80dfcae0/images/l/6755103749ee574c80dfcaf2.jpeg"
    //     alt="Dennis Calvert Photography"
    //   />
    // </div>
    var galleryFragment = document.createDocumentFragment();
    data.gallery.images.forEach((item) => {
      console.log(item);
      var gridItem = document.createElement("div");
      gridItem.classList.add("grid-item");
      var gridItemImg = document.createElement("img");
      gridItemImg.src =
        "https://magiccityfilmmakers.s3.us-east-2.amazonaws.com/" + item.url.s;
      gridItemImg.alt = "Gallery Storm";

      gridItem.appendChild(gridItemImg);

      gridItem.addEventListener("click", function () {
        gridItemImg.src =
          "https://magiccityfilmmakers.s3.us-east-2.amazonaws.com/" +
          item.url.l;

        if (!gridItem.classList.contains("enlarged")) {
          gridItem.classList.add("enlarged");
        } else {
          gridItem.classList.remove("enlarged");
        }
      });
      galleryFragment.appendChild(gridItem);
    });

    document.getElementById("gallery-container").appendChild(galleryFragment);
  });
});
// var images = document.querySelectorAll(".grid-item");

// images.forEach((item) => {
//   item.addEventListener("click", function () {
//     item.children[0].src = item.children[0].src.replace("images/s", "images/l");

//     if (!item.classList.contains("enlarged")) {
//       item.classList.add("enlarged");
//     } else {
//       item.classList.remove("enlarged");
//     }
//   });
// });

var largeUrls = Array.from(document.getElementsByTagName("img"))
  .filter(function (img) {
    return img.src.includes("images/s");
  })
  .map(function (img) {
    return img.src.replace("images/s", "images/l");
  });

var frag = document.createDocumentFragment();

largeUrls.forEach(function (url, index) {
  var div = document.createElement("div");
  div.style.backgroundImage = `url(${largeUrls[index]})`;
  frag.appendChild(div);
});

document.getElementById("preloadImages").appendChild(frag);
