const users = {}; // Placeholder for future user management implementation
const loans = [];
const transactionHistoryCache = {}; // Cache to store computed transaction histories

function requestLoan(requesterId, lenderId, itemId) {
  if (!requesterId || !lenderId || !itemId) {
    return { error: 'Invalid input: requesterId, lenderId, and itemId are all required.' };
  }

  const isAlreadyRequested = loans.some(
    (loan) => loan.itemId === itemId && loan.status === 'pending'
  );

  if (isAlreadyRequested) {
    return { error: 'Item is already requested by someone else.' };
  }

  const newLoanId = loans.length + 1;
  const newLoan = {
    id: newLoanId,
    itemId,
    requesterId,
    lenderId,
    status: 'pending',
  };

  loans.push(newLoan);
  invalidateCache(requesterId);
  invalidateCache(lenderId);
  return newLoan;
}

function acceptLoan(loanId) {
  if (!loanId) {
    return { error: 'Invalid input: loanId is required.' };
  }

  const loanIndex = loans.findIndex((loan) => loan.id === loanId);
  if (loanIndex === -1) {
    return { error: 'Loan request not found.' };
  }

  const loan = loans[loanIndex];
  if (loan.status !== 'pending') {
    return { error: 'Loan request is not in a pending status.' };
  }

  loan.status = 'accepted';
  invalidateCache(loan.requesterId);
  invalidateCache(loan.lenderId);
  return loan;
}

function markItemReturned(loanId) {
  if (!loanId) {
    return { error: 'Invalid input: loanId is required.' };
  }

  const loanIndex = loans.findIndex((loan) => loan.id === loanId);

  if (loanIndex === -1) {
    return { error: 'Loan request not found.' };
  }

  const loan = loans[loanIndex];
  if (loan.status !== 'accepted') {
    return { error: 'Item cannot be returned because it has not been accepted yet.' };
  }

  loan.status = 'returned';
  invalidateCache(loan.requesterId);
  invalidateCache(loan.lenderId);
  return loan;
}

function invalidateCache(userId) {
  if (!userId) {
    throw new Error('Invalid input: userId is required to invalidate cache.');
  }
  delete transactionHistoryCache[userId];
}

function getUserTransactionHistory(userId) {
  if (!userId) {
    throw new Error('Invalid input: userId is required for transaction history lookup.');
  }

  if (transactionHistoryCache[userId]) {
    return transactionHistoryCache[userId];
  }

  const history = loans.filter(
    (loan) => loan.requesterId === userId || loan.lenderId === userId
  );

  transactionHistoryCache[userId] = history;
  return history;
}

module.exports = {
  requestLoan,
  acceptLoan,
  markItemReturned,
  getUserTransactionHistory,
};