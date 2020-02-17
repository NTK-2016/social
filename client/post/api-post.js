const create = (params, credentials, post) => {
  return fetch("/api/posts/new/" + params.userId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t,
      enctype: "multipart/form-data"
    },
    body: post
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const repost = (params, credentials) => {
  return fetch("/api/posts/repost/" + params.userId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({ postId: params.postId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const listByUser = (params, credentials) => {
  //console.log("params.postcount " + params.postcount);
  return fetch("/api/posts/by/" + params.userId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      limit: params.limit,
      skip: params.skip,
      id: params.id,
      postcount: params.postcount
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const listScheduleByUser = (params, credentials) => {
  return fetch("/api/posts/scheduleby/" + params.userId, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const listDraftByUser = (params, credentials) => {
  return fetch("/api/posts/draftby/" + params.userId, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const listNewsFeed = (params, credentials) => {
  return fetch("/api/posts/feed/" + params.userId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({ limit: params.limit, skip: params.skip })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const loadLikedPosts = (params, credentials) => {
  return fetch("/api/posts/likedfeed/" + params.userId, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const remove = (params, credentials) => {
  return fetch("/api/posts/" + params.postId, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const like = (params, credentials, postId) => {
  return fetch("/api/posts/like/", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({ userId: params.userId, postId: postId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const unlike = (params, credentials, postId) => {
  return fetch("/api/posts/unlike/", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({ userId: params.userId, postId: postId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const comment = (params, credentials, postId, comment) => {
  return fetch("/api/posts/comment/", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      userId: params.userId,
      postId: postId,
      comment: comment
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const uncomment = (params, credentials, postId, comment) => {
  return fetch("/api/posts/uncomment/", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      userId: params.userId,
      postId: postId,
      comment: comment
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const readpost = (params, credentials) => {
  return fetch("/api/getpost/" + params.postId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({ id: params.id })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const readorder = (params, credentials) => {
  return fetch("/api/readorder/" + params.userId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({ productId: params.productId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const updatepost = (params, credentials, post) => {
  return fetch("/api/updatepost/" + params.postId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: post
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const readcategory = (params, credentials) => {
  return fetch("/api/getcategory/", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
/* Read Tag from database */
const readtag = (params, credentials) => {
  return fetch("/api/gettag/", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

/* End read tag  */

const createproduct = (params, credentials, post) => {
  return fetch("/api/product/new/" + params.userId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: post
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const listProductsByUser = (params, credentials) => {
  return fetch("/api/posts/product/" + params.userId, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const poll = (params, credentials, postId, poll) => {
  return fetch("/api/posts/poll/", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({ userId: params.userId, postId: postId, poll: poll })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const rating = (params, credentials, postId, rating) => {
  return fetch("/api/posts/rating/", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      userId: params.userId,
      postId: postId,
      rating: rating
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const countLikesByUser = (params, credentials) => {
  return fetch("/api/posts/likes/" + params.userId, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const payTip = (params, credentials) => {
  return fetch("/api/posts/payStripe/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      userId: params.userId,
      userToken: params.userToken,
      amount: params.amount,
      vat: params.vat,
      postId: params.postId
      // name: params.name,
      // street: params.street,
      // city: params.city,
      // userstate: params.userstate,
      // zipcode: params.zipcode,
      // country: params.country,
    })
    // {
    //   userId: params.userId,
    //   userToken: params.userToken
    // }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

/* Start List Shipping Charges */
const getShippingCharges = (params, credentials) => {
  return fetch("/api/users/getShippingCharges/" + params.userId, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
/* End List Shipping Charges */

/* Check digital Order Exist in Database */
const checkOrder = params => {
  return fetch("/api/checkorder/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      value: params.value
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
/* End Check digital Order Exist in Database */

export {
  listNewsFeed,
  listByUser,
  listScheduleByUser,
  listDraftByUser,
  create,
  repost,
  remove,
  like,
  unlike,
  comment,
  uncomment,
  readpost,
  updatepost,
  readcategory,
  readtag,
  createproduct,
  listProductsByUser,
  poll,
  rating,
  countLikesByUser,
  loadLikedPosts,
  payTip,
  getShippingCharges,
  readorder,
  checkOrder
};
