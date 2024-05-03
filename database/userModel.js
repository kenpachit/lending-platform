const bulkUpdateUsers = async (userUpdates) => {
  const updateOperations = userUpdates.map(update => ({
    updateOne: {
      filter: { _id: update.userId },
      update: { $set: update.updateData }
    }
  }));

  try {
    await UserModel.bulkWrite(updateOperations);
    console.log('Bulk update successful');
  } catch (error) {
    console.error('Bulk update error:', error);
  }
};
```
```javascript
const getUserLentItems = async (userId) => {
  const items = await UserModel.aggregate([
    { $match: { _id: userId } },
    { $unwind: '$items' },
    { $match: { 'items.status': 'lent' } },
    { $group: { _id: '$items.item', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  return items;
};