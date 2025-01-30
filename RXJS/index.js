// function Observable(observer) {
//   let count = 1;
//   const producer = setInterval(() => {
//     observer.next(count++);
//   }, 1000);

//   //   unsubscribe logic// closing logic
//   return () => {
//     clearInterval(producer);
//   };
// }
// const closeFn = Observable({
//   next: (value) => console.log(`Received: ${value}`),

//   error: (err) => console.error(`ived error: ${err}`),

//   complete: () => console.log("Sequence completed"),
// });

//

// const getData = () => {
//   const url = "https://randomuser.me/api/";
//   try {
//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data.results[0].name);
//       });
//   } catch (error) {
//     console.error(error.message);
//   }
// };

// getData();
const names = [];
function Observable(observer) {
  const url = "https://randomuser.me/api/";
  const producer = setInterval(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        names.push(data.results[0].name.first);
        observer.next(data);
      })
      .catch((error) => {
        observer.error(error);
      });
  }, 1000);

  setTimeout(() => {
    isStopped = true;
    observer.complete();
    clearInterval(producer);

    console.log("Observable has stopped");
  }, 5000);

  return () => {
    clearInterval(producer);
    observer.complete();
  };
}

const closeFn = Observable({
  next: (value) =>
    console.log(
      `Received: ${value.results[0].name.first} ${value.results[0].name.last}`
    ),

  error: (err) => console.error(`Received error: ${err.message}`),
  complete: () => console.log("Sequence completed"),
});

// Call closeFn() if you need to stop the observable (currently, it does nothing useful).
