const floors = document.getElementById("floor");
const lifts = document.getElementById("lift");
const liftContainer = document.querySelector(".lifts-container");
const floorsContainer = document.querySelector(".floors-container");
const submitBtn = document.getElementById("submit");
const allLifts = document.querySelectorAll(".lift");
const heading = document.querySelector(".heading");
const backBtn = document.querySelector(".back-btn");
const formContainer = document.querySelector(".form");
let noOfLifts = 0;
let noOfFloors = 0;
let liftRequestQueue = [];

floors.addEventListener("change", (e) => {
  noOfFloors = e.target.value;
});

lifts.addEventListener("change", (e) => {
  noOfLifts = e.target.value;
});

const openCloseDoors = (lift, position) => {
  const openTiming =
    2000 * Math.abs(position - Number(lift.dataset.liftPosition));
  const closeTiming =
    2000 * Math.abs(position - Number(lift.dataset.liftPosition)) + 2500;
  lift.setAttribute("data-lift-status", "busy");
  setTimeout(() => {
    lift.childNodes[0].classList.add("left-door-open");
    lift.childNodes[1].classList.add("right-door-open");
    lift.setAttribute("data-lift-position", position);
  }, openTiming);
  setTimeout(() => {
    lift.childNodes[0].classList.remove("left-door-open");
    lift.childNodes[1].classList.remove("right-door-open");
    lift.setAttribute("data-lift-status", "free");
    liftRequestQueue.length > 0 && moveLift(liftRequestQueue[0]);
  }, closeTiming);
};

const calculateClosestLift = (floorNum) => {
  const freeLifts = Array.from(document.querySelectorAll(".lift")).filter(
    (lift) => lift.dataset.liftStatus === "free"
  );
  const closest =
    freeLifts.length > 0 &&
    freeLifts.reduce(function(prev, curr) {
      return Math.abs(curr.dataset.liftPosition - floorNum) <
        Math.abs(prev.dataset.liftPosition - floorNum)
        ? curr
        : prev;
    });
  return closest;
};

const moveLift = (position) => {
  liftRequestQueue.shift();
  const distance = 165 * (position - 1);
  const freeLift = calculateClosestLift(position);
  const liftPosition = Math.abs(
    Number(freeLift.dataset.liftPosition) - position
  );
  freeLift.style.transform = `translateY(-${distance}px)`;
  freeLift.style.transition = `all ${2 * liftPosition}s linear`;
  openCloseDoors(freeLift, position);
};

const handleFloorBtn = (position) => {
  liftRequestQueue = [...liftRequestQueue, position];
  const freeLift = calculateClosestLift(position);
  if (!freeLift) {
    return;
  } else {
    moveLift(position);
  }
};

const createLifts = () => {
  for (let i = 0; i < Number(noOfLifts); i++) {
    const liftDiv = document.createElement("div");
    liftDiv.classList.add("lift", `lift-${i + 1}`);
    liftDiv.setAttribute("data-lift-status", "free");
    liftDiv.setAttribute("data-lift-position", "1");
    const left_door = document.createElement("div");
    left_door.classList.add("door", "left-door");
    const right_door = document.createElement("div");
    right_door.classList.add("door", "right-door");
    liftDiv.appendChild(left_door);
    liftDiv.appendChild(right_door);
    liftContainer.appendChild(liftDiv);
  }
};

const createFloors = () => {
  for (let i = Number(noOfFloors); i >= 1; i--) {
    const floorSection = document.createElement("section");
    floorSection.classList.add("floor", `floor-${i}`);
    const floorDetailsDiv = document.createElement("div");
    floorDetailsDiv.classList.add("floor-details");
    const floorHeader = document.createElement("h3");
    floorHeader.classList.add("floor-name");
    floorHeader.innerText = `Floor ${i}`;
    const floorBtnUp = document.createElement("button");
    floorBtnUp.classList.add("up-btn");
    floorBtnUp.innerText = "▲";
    floorBtnUp.addEventListener("click", () => {
      handleFloorBtn(i);
    });

    const floorBtnDown = document.createElement("button");
    floorBtnDown.classList.add("down-btn");
    floorBtnDown.innerText = "▼";
    floorBtnDown.addEventListener("click", () => {
      handleFloorBtn(i);
    });

    floorDetailsDiv.appendChild(floorHeader);
    i !== Number(noOfFloors) && floorDetailsDiv.appendChild(floorBtnUp);
    i !== 1 && floorDetailsDiv.appendChild(floorBtnDown);
    floorSection.appendChild(floorDetailsDiv);
    floorsContainer.appendChild(floorSection);
  }
};

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if ((noOfFloors > 15) | (noOfLifts > 8)) {
    alert("you can't create more than 15 floors and 8 lifts");
    floors.value = 0;
    lifts.value = 0;
  } else if (noOfFloors > 0 && noOfLifts > 0) {
    formContainer.style.display = "none";
    backBtn.style.display = "block";
    heading.style.display = "block";
    createFloors();
    createLifts();
  }
});

backBtn.addEventListener("click", () => {
  location.reload();
});
