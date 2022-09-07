'use strict';


// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, set) {
  console.log(`${value}`);
});

// Creating DOM Elemets


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€ </div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€ `;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€ `;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// EVENT HANDLER

// LOGGING INTO ACCOUNT
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and mesage
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
    console.log(currentAccount);
  }
});

// TRANSFERING FUNDS

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

// REQUEST LOAN

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  console.log(amount);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

// CLOSING ACCOUNT

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete account
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// PART 149 - COMPUTING USERNAMES
const user = 'Steven Thomas Williams'; // stw

createUsernames(accounts);
// console.log(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// PART 141 - SIMPLE ARRAY METHODS

// SLICE method (creates separate copy)
// let arr = ['a', 'b', 'c', 'd', 'e'];

// console.log(arr.slice(2)); // [c, d, e]
// console.log(arr.slice(2, 4)); // [c, d]
// console.log(arr.slice(-1)); // [e]
// console.log(arr.slice(-2)); //[ d, e]
// console.log(arr.slice(1, -2)); //[ b, c]

// // Using slice to create shallow copy of array
// console.log(arr.slice()); // ['a', 'b', 'c', 'd', 'e']
// // Does the same thing as spread operator
// console.log([...arr]); // ['a', 'b', 'c', 'd', 'e']

// // SPLICE - (mutates the array)
// // console.log(arr.splice(2)); // [ c, d, e]
// arr.splice(-1); // [a, b, c, d]
// console.log(arr);
// arr.splice(1, 2); // [a, d]  - 1st param is where splice starts, 2nd param how many elements after 1st param to delete
// console.log(arr);

// // REVERSE - mutates original array
// arr = ['a', 'b', 'c', 'd', 'e'];

// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT - does not mutate

// const letters = arr.concat(arr2);
// console.log(letters);
// // Same as spread operator on both arrays
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letters.join('-'));

// // PART 142 - LOOPING ARRAYS: forEach

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('------- forEACH ------------');
// movements.forEach(function (move, i, array) {
//   if (move > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${move}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(move)}`);
//   }
// });
// // How forEach works in each iteration
// // 0 : function(200)
// // 1: function(450)
// // 2: function(400)

// // 143 - forEach with Maps and Sets

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// // forEach with a Map
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // forEach with a Set

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

// Part 148 - Map method

// const euroToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUsd; // multiply each element in movements * 1.1
// });

// Line 187, but as arrow function
// const movementsUSD = movements.map(mov => mov * euroToUsd);

// console.log(movementsUSD);

// // Brain teaser
// // const movementsUSD = movements.map(function (mov) {
// //   return 23; // Every element in original array becomes 23
// // });

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * euroToUsd);
// console.log(movementsUSDfor);

// // Getting the index numbers of target array
// const movementsDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You: ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDescription);

// PART 150 - THE FILTER METHOD

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// // filtering with a for-of loop

// const depositsFor = [];

// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const widthdrawals = movements.filter(mov => mov < 0);
// console.log(widthdrawals);

// PART 151 - THE reduce() METHOD

// accumulator is like a snowball
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 100);

// reduce method using arrow function
const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);

// Mimicing reduce method with a for loop
let balance2 = 0;
for (const mov of movements) balance2 += mov;
// console.log(balance2);

// Maximum value of movements array
const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);
// console.log(max);

// PART 151 - MAGIC OF CHAINING METHODS

const euroToUsd = 1.1;

// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// PART 155 = THE find() METHOD

const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// finding a property of an object
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// PART 159 - some() and every() methods
console.log(movements);

// EQUALITY
console.log(movements.includes(-130));

// CONDITION

console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 1500);
console.log(anyDeposits);

// EVERY

// Checks that every element in the array meets the condition
console.log(movements.every(move => move > 0));
console.log(account4.movements.every(move => move > 0));

// Separate callback
const deposit = move => mov > 0;

// 160 - flat() and flatMap() method

// flat()

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const accountMovements = accounts.map(acc => acc.movements);

console.log(accountMovements);

const allMovements = accountMovements.flat();
console.log(allMovements);
const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

const overallBalanceChain = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

// flatMap();

const overallBalanceFlatMap = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalanceFlatMap);

// PART 161 - SORTING ARRAYS

// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);

// ASCENDING ORDER

// return < 0, A, B (keep order)
// return > 0, A, B (switch order)

// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });

// Simplified to return order based on result of a - b
movements.sort((a, b) => a - b);
console.log(movements);

// DESCENDING ORDER

movements.sort((a, b) => {
  if (a > b) return -1;
  if (b > a) return 1;
});

movements.sort((a, b) => b - a);
console.log(movements);

// PART 161 - MORE WAYS OF CREATING AND FILLING ARRAYS

const arrg = [1, 2, 3, 4, 5, 6, 7];
console.log(arrg);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Empty arrays + fill methods
const x = new Array(7);
console.log(x);
//
x.fill(1, 3, 5);
console.log(x);

arrg.fill(23, 4, 6);

console.log(arrg);

// Creating arrg array programatically
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

// Use case for Array.from

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);
});
