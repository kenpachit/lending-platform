const userCache = new Map();

passport.deserializeUser((id, done) => {
  if (userCache.has(id)) {
    done(null, userCache.get(id)); // Return user from cache
  } else {
    fetchUserData(id).then(user => {
      userCache.set(id, user); // Cache the fetched user data
      done(null, user);
    }).catch(error => done(error));
  }
});

// Generic caching mechanism
const functionCache = new Map();

async function cachedFunction(key, fetchFunction) {
  if (functionCache.has(key)) {
    return functionCache.get(key);
  } else {
    try {
      const result = await fetchFunction();
      functionCache.set(key, result);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const initialDataLoader = async (req, res) => {
  try {
    // Assuming these functions are now cached
    const userProfile = await cachedFunction(`userProfile_${req.userId}`, () => fetchUserProfile(req.userId));
    const userPermissions = await cachedFunction(`userPermissions_${req.userId}`, () => fetchUserPermissions(req.userId));
    
    res.json({
      userProfile,
      userPermissions,
      // other data...
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load initial data" });
  }
};

// Placeholder implementations
async function fetchUserData(userID) {
  throw new Error("fetchUserData function not implemented.");
}

// These functions should be implemented to fetch actual data 
async function fetchUserProfile(userID) {
  throw new Error("fetchUserProfile function not implemented.");
}

async function fetchUserPermissions(userID) {
  throw new Error("fetchUserPermissions function not implemented.");
}

module.exports = {
  // existing exports,
  initialDataLoader // add this to your exports if you choose to implement
};