/// //////////////////////////////////////////////
/// //////////////////////////////////////////////
// BANKIST APP

interface IAccount {
  [key: string]: any;
  owner: string;
  movements: number[];
  interestRate: number;
  pin: number;
}

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-01-01T17:01:17.194Z',
    '2022-01-02T23:36:17.929Z',
    '2022-01-04T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// DOM Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

const containerApp: HTMLElement = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer: HTMLButtonElement = document.querySelector(
  '.form__btn--transfer',
);
const btnLoan: HTMLButtonElement = document.querySelector('.form__btn--loan');
const btnClose: HTMLButtonElement = document.querySelector('.form__btn--close');
const btnSort: HTMLButtonElement = document.querySelector('.btn--sort');

const inputLoginUsername: HTMLInputElement = document.querySelector(
  '.login__input--user',
);

const inputLoginPin: HTMLInputElement =
  document.querySelector('.login__input--pin');

const inputTransferTo: HTMLInputElement =
  document.querySelector('.form__input--to');

const inputTransferAmount: HTMLInputElement = document.querySelector(
  '.form__input--amount',
);
const inputLoanAmount: HTMLInputElement = document.querySelector(
  '.form__input--loan-amount',
);

const inputCloseUsername: HTMLInputElement =
  document.querySelector('.form__input--user');

const inputClosePin: HTMLInputElement =
  document.querySelector('.form__input--pin');

/// //////////////////////////////////////////////////////
/// / FUNCTIONS

const formatMovementDate = (date: Date, locale: string) => {
  const calcDaysPassed = (date1: Date, date2: Date) =>
    Math.round(Math.abs(+date1 - +date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = (value: number, locale: string, currency: string) => {
  const formattedMov = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);

  return formattedMov;
};

const displayMovements = (acc: IAccount, sorted = false) => {
  containerMovements.innerHTML = '';

  const movs = sorted
    ? [...acc.movements].sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov: number, i: number) => {
    const movementType = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">
        ${i + 1} ${movementType.toUpperCase()}
        </div>
        <div class='movements_date'>${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = (acc: IAccount) => {
  acc.balance = acc.movements.reduce((accum, cur) => accum + cur, 0);

  const formattedMov = formatCurrency(acc.balance, acc.locale, acc.currency);

  labelBalance.textContent = `${formattedMov}`;
};

const calcDisplaySummary = (acc: IAccount) => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((accu, cur) => accu + cur, 0);

  labelSumIn.textContent = `${formatCurrency(
    incomes,
    acc.locale,
    acc.currency,
  )}`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((accu, cur) => accu + cur, 0);

  labelSumOut.textContent = `${formatCurrency(
    Math.abs(outcomes),
    acc.locale,
    acc.currency,
  )}`;

  const interests = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((accu, cur) => accu + cur);

  labelSumInterest.textContent = `${formatCurrency(
    interests,
    acc.locale,
    acc.currency,
  )}`;
};

const createUsernames = (accs: IAccount[]) => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = (acc: IAccount) => {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// EVENT HANDLERS
let currentAccount: IAccount;

currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = '100';

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc: IAccount) => acc.username === inputLoginUsername.value,
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display the UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = '100';

    // Create current date and time
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options,
    ).format(now);
    // Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update the UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc: IAccount = accounts.find(
    (acc: IAccount) => acc.username === inputTransferTo.value,
  );

  // Clear input fields
  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Create transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Create transfer date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  const accountToDelete = inputCloseUsername.value;
  const pin = +inputClosePin.value;

  // Clear input fields
  inputCloseUsername.value = '';
  inputClosePin.value = '';

  if (
    currentAccount.username === accountToDelete &&
    currentAccount.pin === pin
  ) {
    const index = accounts.findIndex(
      (acc: IAccount) => acc.username === currentAccount.username,
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide Ui
    containerApp.style.opacity = '0';
  }
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});
