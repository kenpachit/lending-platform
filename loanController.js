const users = {}; // Placeholder for future user management implementation
const loans = [];
const transactionHistoryCache = {}; // Cache to store computed transaction histories

function requestLoan(requesterId, lenderId, itemId) {
  const isAlreadyRequested = loans.some(
    (loan) => loan.itemId === itemId && loan.status === 'pending'
  );

  if (isAlreadyRequested) {
    return { error: 'Item is already requested by someone else.' };
  }

  // Generate a new loan ID considering scalability
  const newLoan = {
    id: loans.length + 1,
    itemId,
    requesterId,
    lenderId,
    status: 'pending',
  };

  loans.push(newLoan);
  // Invalidate cache for both users involved
  invalidateCache(requesterId);
  invalidateCache(lenderId);
  return newLoan;
}

function acceptLoan(loanId) {
  const loanIndex = loans.findIndex((loan) => loan.id === loanId);

  if (loanIndex === -1) {
    return { error: 'Loan request not found.' };
  }

  const loan = loans[loanIndex];
  if (loan.status !== 'pending') {
    return { error: 'Loan request is not in a pending status.' };
  }

  loan.status = 'accepted';
  // Invalidate cache for both users involved
  invalidateCache(loan.requesterId);
  invalidateCache(loan.lenderId);
  return loan;
}

function markItemReturned(loanId) {
  const loanIndex = loans.findIndex((loan) => loan.id === loanId);

  if (loanIndex === -1) {
    return { error: 'Loan request not found.' };
  }

  const loan = loans[loanIndex];
  if (loan.status !== 'accepted') {
    return { error: 'Item cannot be returned because it has not been accepted yet.' };
  }

  loan.status = 'returned';
  // Invalidate cache for both users involved
  invalidateCache(loan.requesterId);
  invalidateCache(loan.lenderId);
  return loan;
}

function invalidateCache(userId) {
  delete transactionHistoryCache[userId];
}

function getUserTransactionHistory(userId) {
  // Check if result is already cached
  if (transactionHistoryCache[userId]) {
    return transactionHistoryCache[userId];
  }

  const history = loans.filter((loan) => loan.requesterId === userId || loan.lenderId === userId);
  // Cache the result before returning
  transactionHistoryCache[userId] = history;
  return history;
}

module.exports = {
  requestLoan,
  acceptLoan,
  markItemReturned,
  getUserTransactionHistory,
};