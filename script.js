// // 'use strict';

// // ============================
// // ۱️⃣ کلاس پایه Workout
// // ============================
// class WorkOut {
//   date = new Date(); // تاریخ ثبت فعالیت
//   id = (Date.now() + '').slice(-10); // شناسه یکتا برای هر فعالیت

//   constructor(coords, distance, duration) {
//     this.coords = coords; // مختصات روی نقشه [lat, lng]
//     this.distance = distance; // مسافت (km)
//     this.duration = duration; // زمان (min)
//   }

//   _setDescription() {
//     // توضیح کوتاه فعالیت، مثل: Running 5 April
//     const months = [
//       'January',
//       'February',
//       'March',
//       'April',
//       'May',
//       'June',
//       'July',
//       'August',
//       'September',
//       'October',
//       'November',
//       'December',
//     ];

//     this.description = `${this.type[0].toUpperCase()}${this.type.slice(
//       1
//     )} ${this.date.getDate()} ${months[this.date.getMonth()]}`;
//   }
// }

// // ============================
// // ۲️⃣ کلاس Running
// // ============================
// class Running extends WorkOut {
//   type = 'running'; // مشخص کردن نوع فعالیت

//   constructor(coords, distance, duration, cadence) {
//     super(coords, distance, duration); // فراخوانی constructor والد
//     this.cadence = cadence; // تعداد قدم در دقیقه
//     this.calcPace(); // محاسبه pace
//     this._setDescription(); // ایجاد توضیح فعالیت
//   }

//   calcPace() {
//     this.pace = this.duration / this.distance; // pace = زمان / مسافت
//     return this.pace;
//   }
// }

// // ============================
// // ۳️⃣ کلاس Cycling
// // ============================
// class Cycling extends WorkOut {
//   type = 'cycling'; // مشخص کردن نوع فعالیت

//   constructor(coords, distance, duration, elevation) {
//     super(coords, distance, duration); // فراخوانی constructor والد
//     this.elevation = elevation; // ارتفاع صعود (m)
//     this.calcSpeed(); // محاسبه سرعت
//     this._setDescription(); // ایجاد توضیح فعالیت
//   }

//   calcSpeed() {
//     this.speed = this.distance / (this.duration / 60); // سرعت = km/h
//     return this.speed;
//   }
// }

// // ============================
// // ۴️⃣ انتخاب عناصر DOM
// // ============================
// const form = document.querySelector('.form');
// const inputType = document.querySelector('.form__input--type');
// const inputDistance = document.querySelector('.form__input--distance');
// const inputDuration = document.querySelector('.form__input--duration');
// const inputCadence = document.querySelector('.form__input--cadence');
// const inputElevation = document.querySelector('.form__input--elevation');
// const containerWorkOuts = document.querySelector('.workouts');
// // ============================
// // ۵️⃣ کلاس اصلی اپلیکیشن
// // ============================
// class App {
//   #map;
//   #mapEvent;
//   #workOuts = [];

//   constructor() {
//     this._getPosition(); // گرفتن موقعیت کاربر هنگام بارگذاری
//     // تغییر نمایش فیلدها هنگام تغییر نوع فعالیت
//     inputType.addEventListener('change', this._toggleElevationField);
//     form.addEventListener('submit', this._newWorkOut.bind(this));
//     containerWorkOuts.addEventListener('click', this._moveToPopUp.bind(this));
//   }

//   // ============================
//   // گرفتن موقعیت کاربر
//   // ============================
//   _getPosition() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         this._loadMap.bind(this),
//         function () {
//           alert('Sorry, we could not get your position.');
//         }
//       );
//     }
//   }

//   // ============================
//   // بارگذاری نقشه
//   // ============================
//   _loadMap(position) {
//     const { latitude, longitude } = position.coords;
//     const coords = [latitude, longitude];

//     this.#map = L.map('map').setView(coords, 13);

//     L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       maxZoom: 20,
//     }).addTo(this.#map);

//     // وقتی روی نقشه کلیک شد، فرم نمایش داده شود
//     this.#map.on('click', this._showForm.bind(this));
//   }

//   // ============================
//   // نمایش فرم هنگام کلیک روی نقشه
//   // ============================
//   _showForm(mapE) {
//     this.#mapEvent = mapE;
//     form.classList.remove('hidden');
//     inputDistance.focus();
//   }

//   // ============================
//   // افزودن فعالیت جدید
//   // ============================
//   _newWorkOut(e) {
//     e.preventDefault();

//     const validInputs = (...inputs) =>
//       inputs.every(inp => Number.isFinite(inp));
//     const allPositive = (...inputs) => inputs.every(inp => inp > 0);

//     const type = inputType.value;
//     const distance = +inputDistance.value;
//     const duration = +inputDuration.value;

//     const { lat, lng } = this.#mapEvent.latlng;

//     let workout;

//     // ----------------------------
//     // اگر Running
//     // ----------------------------
//     if (type === 'running') {
//       const cadence = +inputCadence.value;
//       if (
//         !validInputs(distance, duration, cadence) ||
//         !allPositive(distance, duration, cadence)
//       ) {
//         return alert('Inputs have to be positive numbers!');
//       }
//       workout = new Running([lat, lng], distance, duration, cadence);
//     }

//     // ----------------------------
//     // اگر Cycling
//     // ----------------------------
//     if (type === 'cycling') {
//       const elevation = +inputElevation.value;
//       if (
//         !validInputs(distance, duration, elevation) ||
//         !allPositive(distance, duration)
//       ) {
//         return alert('Inputs have to be positive numbers!');
//       }
//       workout = new Cycling([lat, lng], distance, duration, elevation);
//     }

//     // ذخیره در آرایه
//     this.#workOuts.push(workout);

//     // نمایش روی نقشه و لیست
//     this._renderWorkOutMarker(workout);
//     this._renderWorkOutList(workout);

//     // پاک کردن فرم
//     inputDistance.value =
//       inputDuration.value =
//       inputCadence.value =
//       inputElevation.value =
//         '';
//   }

//   // ============================
//   // نمایش Marker روی نقشه
//   // ============================
//   _renderWorkOutMarker(workout) {
//     L.marker(workout.coords)
//       .addTo(this.#map)
//       .bindPopup(
//         L.popup({
//           maxWidth: 250,
//           minWidth: 100,
//           autoClose: false,
//           closeOnClick: false,
//           className: `${workout.type}-popup`,
//         })
//       )
//       .setPopupContent(workout.description)
//       .openPopup();
//   }

//   // ============================
//   // نمایش فعالیت در لیست
//   // ============================
//   _renderWorkOutList(workout) {
//     let html = `
//       <li class="workout workout--${workout.type}" data-id="${workout.id}">
//         <h2 class="workout__title">${workout.description}</h2>
//         <div class="workout__details">
//           <span class="workout__icon">${
//             workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
//           }</span>
//           <span class="workout__value">${workout.distance}</span>
//           <span class="workout__unit">km</span>
//         </div>
//         <div class="workout__details">
//           <span class="workout__icon">⏱</span>
//           <span class="workout__value">${workout.duration}</span>
//           <span class="workout__unit">min</span>
//         </div>
//     `;

//     if (workout.type === 'running') {
//       html += `
//         <div class="workout__details">
//           <span class="workout__icon">⚡️</span>
//           <span class="workout__value">${workout.pace.toFixed(1)}</span>
//           <span class="workout__unit">min/km</span>
//         </div>
//         <div class="workout__details">
//           <span class="workout__icon">🦶🏼</span>
//           <span class="workout__value">${workout.cadence}</span>
//           <span class="workout__unit">spm</span>
//         </div>
//       `;
//     }

//     if (workout.type === 'cycling') {
//       html += `
//         <div class="workout__details">
//           <span class="workout__icon">🚴‍♀️</span>
//           <span class="workout__value">${workout.speed.toFixed(1)}</span>
//           <span class="workout__unit">km/h</span>
//         </div>
//         <div class="workout__details">
//           <span class="workout__icon">⏱</span>
//           <span class="workout__value">${workout.elevation}</span>
//           <span class="workout__unit">m</span>
//         </div>
//       `;
//     }

//     html += `</li>`;
//     form.insertAdjacentHTML('afterend', html);
//   }

//   // ============================
//   // تغییر نمایش فیلد Cadence و Elevation
//   // ============================
//   _toggleElevationField() {
//     inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
//     inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
//   }
//   _moveToPopUp(e) {
//     const workOutEl = e.target.closest('.workout');
//     console.log(workOutEl);
//     if (!workOutEl) return;
//     const workOut = this.#workOuts.find(
//       work => work.id === workOutEl.dataset.id
//     );
//     console.log(workOut);
//   }
// }

// // ============================
// // ۶️⃣ اجرای اپلیکیشن
// // ============================
// const app = new App();
'use strict';

// ============================
// کلاس‌های Workout / Running / Cycling
// ============================
class WorkOut {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    // مثال: "Running 5 April"
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(
      1
    )} ${this.date.getDate()} ${months[this.date.getMonth()]}`;
  }
  click() {
    this.clicks++;
  }
}

class Running extends WorkOut {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends WorkOut {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// ============================
// گرفتن عناصر DOM
// ============================
const form = document.querySelector('.form');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const containerWorkOuts = document.querySelector('.workouts');
const reset = document.querySelector('.reset');
// ============================
// اپلیکیشن
// ============================
class App {
  #map;
  #mapEvent;
  #mapZoomLevel = 13;
  #workOuts = [];

  constructor() {
    this._getLocalStorage();
    this._getPosition();
    inputType.addEventListener('change', this._toggleElevationField);
    form.addEventListener('submit', this._newWorkOut.bind(this));
    containerWorkOuts.addEventListener('click', this._moveToPopUp.bind(this));
    reset.addEventListener('click', this.reset.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Sorry, we could not get your position.');
        }
      );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
    this.#workOuts.forEach(work => {
      this._renderWorkOutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _newWorkOut(e) {
    e.preventDefault();

    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    // حتماً مطمئن شو که نقشه رو کلیک کردیم و موقعیت داریم
    if (!this.#mapEvent) {
      return alert('Please click on the map to choose a location first.');
    }

    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert('Inputs have to be positive numbers!');
      }
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert('Inputs have to be positive numbers!');
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // اطمینان از ساخته شدن workout (اگر type غیرمجاز بود، اجرا نشود)
    if (!workout) return;

    this.#workOuts.push(workout);

    // نمایش روی نقشه و لیست
    this._renderWorkOutMarker(workout);
    this._renderWorkOutList(workout);

    // پاک کردن فرم و مخفی کردن آن
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.classList.add('hidden');
    this._setLocalStorage();
  }

  _renderWorkOutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.description}`)
      .openPopup();
  }

  _renderWorkOutList(workout) {
    const html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>

        ${
          workout.type === 'running'
            ? `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        `
            : `
          <div class="workout__details">
            <span class="workout__icon">🚴‍♀️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
        `
        }
      </li>
    `;

    // Jonas از afterend استفاده می‌کنه و این اوکیه
    form.insertAdjacentHTML('afterend', html);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  // ============================
  // ایمن‌سازی شده: اگر روی لیست کلیک شد، نقشه به آن workout حرکت کند
  // ============================
  _moveToPopUp(e) {
    const workOutEl = e.target.closest('.workout');
    if (!workOutEl) return; // اگر روی workout کلیک نشده بود کاری نکن

    const workOutId = workOutEl.dataset.id;
    if (!workOutId) return; // اگر data-id نبود برگرد

    const workout = this.#workOuts.find(w => w.id === workOutId);
    if (!workout) return; // اگر در آرایه نبود برگرد

    // مطمئن شو نقشه بارگذاری شده
    if (!this.#map) return;

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
    workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workOuts));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    // Reconstruct workout instances from stored data
    this.#workOuts = data.map(work => {
      if (work.type === 'running') {
        const running = new Running(
          work.coords,
          work.distance,
          work.duration,
          work.cadence
        );
        running.id = work.id;
        running.date = new Date(work.date);
        running.clicks = work.clicks;
        running._setDescription(); // Update description with correct date
        return running;
      } else if (work.type === 'cycling') {
        const cycling = new Cycling(
          work.coords,
          work.distance,
          work.duration,
          work.elevation
        );
        cycling.id = work.id;
        cycling.date = new Date(work.date);
        cycling.clicks = work.clicks;
        cycling._setDescription(); // Update description with correct date
        return cycling;
      }
    });

    // Render workout list items (markers will be rendered after map loads)
    this.#workOuts.forEach(work => {
      this._renderWorkOutList(work);
    });
  }
  reset(e) {
    e.preventDefault();
    localStorage.removeItem('workouts');
    location.reload();
  }
}

// اجرا
const app = new App();
