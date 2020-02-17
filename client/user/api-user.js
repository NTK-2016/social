import { partials } from "handlebars";

const create = user => {
  return fetch("/api/users/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const list = () => {
  return fetch("/api/users/", {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const read = (params, credentials) => {
  return fetch("/api/users/" + params.userId, {
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

const getUsernameById = (params, credentials) => {
  return fetch("/api/find/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({ userId: params.userId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};


const readName = (params, credentials) => {
  return fetch("/api/username/" + params.userName, {
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

const update = (params, credentials, user) => {
  return fetch("/api/users/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: user
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const remove = (params, credentials) => {
  return fetch("/api/users/" + params.userId, {
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
    .catch(err => console.log(err));
};

const follow = (params, credentials, followId) => {
  return fetch("/api/users/follow/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      userId: params.userId,
      followId: followId
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const unfollow = (params, credentials, unfollowId) => {
  return fetch("/api/users/unfollow/", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      userId: params.userId,
      unfollowId: unfollowId
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const findPeople = (params, credentials) => {
  return fetch("/api/users/findpeople/" + params.userId, {
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

/* Find the stanning users */
const findStanning = (params, credentials) => {
  return fetch("/api/users/findstanning/" + params.userId, {
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

/* End find the stanning users */

/** Banner Image Update */
const updatebanner = (params, credentials, user) => {
  return fetch("/api/users/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: user
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};
const countpeople = (params, credentials) => {
  return fetch("/api/users/countfollowing/" + params.userId, {
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
/** User link Activation */
const activatelink = (params, userdata) => {
  return fetch("/api/users/activation/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      verification: {
        token: userdata.token,
        status: 1
      }
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

/** End Here */
/** Api for become Creater */
const becomecreater = (params, credentials, createrstatus) => {
  return fetch("/api/users/creater/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      creater: {
        status: createrstatus.status
      }
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};
/** Api for become Stan */
const stan = (params, credentials, standata) => {
  return fetch("/api/users/stan/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      stan: {
        status: standata.status,
        ref_id: standata.ref_id,
        amount: standata.amount
      }
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

/** Api for get Stan count and total earning */
const fetchStanCount = (params, credentials) => {
  return fetch("/api/users/stanCount/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};

/** Api for get Stan count and total earning */
const fetchFollowerCount = (params, credentials) => {
  return fetch("/api/users/followerCount/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};

const notification = (params, credentials, userprivacy) => {
  return fetch("/api/users/notification1/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: userprivacy
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const privacy = (params, credentials, userprivacy) => {
  return fetch("/api/users/privacy/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: userprivacy
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const payment = (params, credentials, paymentdetails) => {
  return fetch("/api/users/payment/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: paymentdetails
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};
/** End Here */

//  Shop module API for Product Add , update ,delete , list
const AddProduct = shop => {
  return fetch("/api/shop/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(shop)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
/* const ProductList = () =>{
    return fetch('/api/shop/', {
      method: 'GET',
    }).then(response => {
      return response.json()
    }).catch((err) => console.log(err)) 
} */
const findproduct = (params, credentials) => {
  return fetch("/api/shop/findproduct/" + params.productId, {
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
const createrCategory = (params, credentials) => {
  return fetch("/api/creatercategory/", {
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
const ProductRemove = (params, credentials) => {
  return fetch("/api/shop/" + params.productId, {
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
const ProductUpdate = (params, credentials, shop) => {
  return fetch("/api/shop/" + params.productId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: shop
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};
const ProductById = (params, credentials) => {
  return fetch("/api/shop/" + params.productId, {
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

const listChat = (params, credentials) => {
  return fetch("/api/users/chat/", {
    method: "POST",
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

const creatorcategory = (params, credentials) => {
  return fetch("/api/creatorcategory/", {
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

const topCreatorCategory = (params, credentials) => {
  return fetch("/api/topcreatorcategory/", {
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
const categoryuser = (params, credentials) => {
  return fetch("/api/categoryuser/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },

    body: JSON.stringify({
      categoryid: params.category,
      skip: params.skip,
      limit: params.limit
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
/*  Insert and find Category */
const insertcategory = (params, credentials) => {
  return fetch("/api/insertcategory/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      name: params.name
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
/* End Insert and find Category */
const searchuser = (params, credentials) => {
  return fetch("/api/searchuser/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
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
/* Check Username Exist in Database */
const checkusername = params => {
  return fetch("/api/checkusername/", {
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
/* End Check Username Exist in Database */
/* Check Username Exist in Database */
const checkCategory = params => {
  return fetch("/api/checkcategory/", {
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
/* End Check Username Exist in Database */

const subscriptionAndPitch = (params, credentials, userprivacy) => {
  return fetch("/api/users/subscriptionpitch/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: userprivacy
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

/**Api for subscription and pitch */
const fetchenableStanBtnStatus = (params, credentials) => {
  return fetch("/api/users/enableStanBtn/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};
const enableShop = (params, credentials, shopenabledata) => {
  return fetch("/api/users/enableShop/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: shopenabledata
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};
/** Get shop enable disable data */
const fetchenableShopBtnStatus = (params, credentials) => {
  return fetch("/api/users/enableShopbtn/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};
// fetch total tips by user
const fetchTipsByUser = (params, credentials) => {
  return fetch("/api/users/tipByUser/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};
const fetchTipedByme = (params, credentials) => {
  return fetch("/api/users/tippedByMe/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};

/** get total product sales */
const fetchProductSales = (params, credentials) => {
  return fetch("/api/orders/totalSales/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};

const placeorder = (credentials, order) => {
  return fetch("/api/orders/new/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + credentials.t,
      enctype: "multipart/form-data"
    },
    body: order
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

// fetch total  order on user products
const fetchmanageOrders = (params, credentials) => {
  return fetch("/api/users/manageOrders/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};

/**  fetch stanning data from user controller */
const fetchstanningdata = (params, credentials) => {
  return fetch("/api/users/staningtransaction/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};

const sendPurchaseNote = (params, credentials) => {
  return fetch("/api/orders/sendMessage/" + params.order_id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      message: params.messages,
      order_id: params.order_id
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};
/** End Here  */

const becomeStan = (params, credentials) => {
  return fetch("/api/users/becomeStan/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      userId: params.userId,
      followId: params.creatorId,
      creatorId: params.creatorId,
      userToken: params.userToken,
      amount: params.amount,
      vat: params.vat,
      countryCode: params.countryCode,
      planId: params.planId,
      email: params.email
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

const removeStan = (params, credentials) => {
  return fetch("/api/users/removeStan/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      userId: params.userId,
      unfollowId: params.creatorId,
      subscriptionId: params.subscriptionId,
      creatorId: params.creatorId
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
/* Start List Notification */
const readnotification = (params, credentials) => {
  return fetch("/api/users/readnotification/" + params.userId + "/" + params.status, {
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
/* End List Notification */

/** user shipping countries */
const fetchCountrylist = () => {
  return fetch("/api/countrieslist/", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
// add shipping options
const shippingprice = data => {
  return fetch("/api/shippingprice/", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
//end here

const checkStan = (params, credentials) => {
  return fetch("/api/users/checkStan/", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      userId: params.userId,
      sellerId: params.sellerId
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};
const stanTome = (params, credentials) => {
  return fetch("/api/users/StantoMe/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};
const fetchmyShopOrder = (params, credentials) => {
  return fetch("/api/users/myShopOrder/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};
/* Check Email Exist in Database */
const checkemail = params => {
  return fetch("/api/checkemail/", {
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
/* End Check Email Exist in Database */
/* Check Email Exist in Database */
const checkEmailById = params => {
  return fetch("/api/checkEmailById/" + params.userId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      oldEmail: params.oldEmail,
      newEmail: params.newEmail
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
/* End Check Email Exist in Database */
/* Get Total Earning */
const getEarning = (params, credentials) => {
  return fetch("/api/getearning/" + params.userId, {
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
/* End Total Earning */
/* Get Total Withdrawal */
const getTotalWithdrawal = (params, credentials) => {
  return fetch("/api/gettotalwithdrawal/" + params.userId, {
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
/* End Total Earning */

/* Check Reset Token Exist in Database */
const checkreset = params => {
  return fetch("/api/checkreset/", {
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
/* End Check Reset Token Exist in Database */

/* Check Reset Token Exist in Database */
const reset = params => {
  return fetch("/api/reset/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      newpassword: params.newpassword,
      conpassword: params.conpassword,
      token: params.token
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
/* End Check Reset Token Exist in Database */
// const withdrawAmount = data => {
//   console.log("hello");
//   console.log(data);
//   return fetch("/api/withdrawalEarning/", {
//     method: "PUT",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   })
//     .then(response => {
//       return response.json();
//     })
//     .catch(err => console.log(err));
// };
/* Start Review Submit*/
const ReviewSubmit = (params, credentials) => {
  return fetch("/api/users/reviewsubmit/" + params.userId, {
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
/* End Review Submit */
/* fetch Transaction Statement */
const getTransStatementByUser = (params, credentials) => {
  return fetch("/api/users/getTransStatementByUser/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};
/* End fetch Transaction Statement */
/* fetch Earning Filteration */
const earningStmtFilter = (params, credentials) => {
  return fetch("/api/users/earningStmtFilter/" + params.userId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      type: params.type,
      month: params.month,
      year: params.year
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};
/* End Earning Filteration */
/* fetch getTransaction Debit Statemnt By User */
const getTransDebitStmtByUser = (params, credentials) => {
  return fetch("/api/users/getTransDebitStmtByUser/" + params.userId, {
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
    .catch(err => {
      console.log(err);
    });
};
/* getTransaction Debit Statemnt By User */
/* Start Get Vat By Country */
// const getVatByCountry = (params, credentials) => {
//   console.log(params)
//   if(params.event=='click'){
//     var res = fetch("/api/users/getVatByCountry/", {
//       method: "post",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + credentials.t
//       },
//       body: JSON.stringify({
//         country: params.country,
//         ip : ip,  
//         event:event,   // this is to check whether its by ip or on change of country
//       })
//     });

//     res.then(function(response){
//       console.log("lvel2")
//       var res = response.json()
//       console.log(res);
//         return res;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }else{
//     const publicIp = require("public-ip");
//     var ip ="0";
//     publicIp.v4().then(ip=>{
//       ip=ip;
//     console.log("api-user.js",ip);
//     var res = fetch("/api/users/getVatByCountry/", {
//       method: "post",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + credentials.t
//       },
//       body: JSON.stringify({
//         country: params.country,
//         ip : ip,  
//         event:event,   // this is to check whether its by ip or on change of country
//       })
//     });
//       // setTimeout(() => {
//         res.then(function(response){
//           console.log("lvel2")
//           var res = response.json()
//           console.log(res);
//             return res;
//           })
//           .catch(err => {
//             console.log(err);
//           });
//      // }, 3000);
//     });
//   }
// };
/* End Get Vat By Country */

/* Start Get Vat By Country */
const getVatByCountry = (params, credentials) => {
  if (params.event == 'click') {
    const publicIp = require("public-ip");
    return publicIp.v4().then(ip => {
      return fetch("/api/users/getVatByCountry/", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t
        },
        body: JSON.stringify({
          country: params.country,
          ip: ip,
          event: 'click',
        })
      })
        .then((response) => {
          let res = response.json();
          return res
        }).then((res) => {
          return res
        })
        .catch(err => {
          console.log(err);
        });
    });

  } else {
    return fetch("/api/users/getVatByCountry/", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t
      },
      body: JSON.stringify({
        code: params.code
      })
    })
      .then(response => {
        return response.json();
      })
      .catch(err => {
        console.log(err);
      });
  }
};
/* End Get Vat By Country */
/** User link Activation */
const emailactivatelink = (params, userdata) => {
  return fetch("/api/users/emailactivatelink/" + params.userId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tempEmail: {
        status: 1
      }
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

/** End Here */
/* Start View Creator Space Page After Become a creator */
const getAccountIdByCodeId = (params, credentials) => {
  return fetch("/api/users/getAccountIdByCodeId/" + params.codeId, {
    method: "post",
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
/* End View Creator Space Page After Become a creator */
/*Start To Withdrawal money by given Stripe Acc Id */
const makeWithDrawalByStripeId = (params, credentials) => {
  return fetch("/api/users/makeWithDrawalByStripeId/", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      amount: params.amount,
      t_id: params.stripe_user_id,
      userId: params.userId,
      approvalStatus: params.approvalStatus,
      status: params.status,
      payouttype: params.payouttype
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};
/*End To Withdrawal money by given Stripe Acc Id */
/* Start Calculate Process Fee */
const calculateProcessFee = (params, credentials) => {
  return fetch("/api/users/calculateProcessFee/", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      amount: params.withamount,
      userId: params.userId
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};
/* End Calculate Process Fee */
/* Start of Report */
const profilereport = (params, credentials) => {
  return fetch("/api/users/report", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    },
    body: JSON.stringify({
      fromId: params.fromId,
      toId: params.toId,
      postId: params.postId,
      text: params.text,
      type: params.type
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};
/* End of Report */
/* send refer invitation in Database */
const sendreferinvitation = params => {
  return fetch("/api/sendreferinvitation/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: params.email,
      link: params.link
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
/* send refer invitation  Exist in Database */
/* send feedback in on mail */
const sendfeedback = params => {
  return fetch("/api/sendfeedback/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: params.message,
      userId: params.userId
    })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
/* send feedback in on mail */

const readprofileimage = params => {
  return fetch("/api/users/photo/" + params.userId, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export {
  create,
  list,
  read,
  readName,
  update,
  remove,
  follow,
  unfollow,
  findPeople,
  findStanning,
  updatebanner,
  AddProduct,
  // ProductList,
  findproduct,
  ProductRemove,
  ProductUpdate,
  ProductById,
  notification,
  privacy,
  payment,
  countpeople,
  activatelink,
  listChat,
  becomecreater,
  stan,
  creatorcategory,
  topCreatorCategory,
  categoryuser,
  searchuser,
  fetchStanCount,
  fetchFollowerCount,
  subscriptionAndPitch,
  fetchenableStanBtnStatus,
  checkusername,
  enableShop,
  fetchenableShopBtnStatus,
  fetchTipsByUser,
  placeorder,
  fetchmanageOrders,
  sendPurchaseNote,
  becomeStan,
  removeStan,
  readnotification,
  fetchCountrylist,
  shippingprice,
  fetchProductSales,
  checkStan,
  fetchstanningdata,
  fetchTipedByme,
  checkCategory,
  stanTome,
  fetchmyShopOrder,
  insertcategory,
  checkemail,
  checkreset,
  reset,
  ReviewSubmit,
  getEarning,
  getTotalWithdrawal,
  earningStmtFilter,
  getTransStatementByUser,
  getTransDebitStmtByUser,
  getVatByCountry,
  checkEmailById,
  emailactivatelink,
  getAccountIdByCodeId,
  makeWithDrawalByStripeId,
  profilereport,
  calculateProcessFee,
  getUsernameById,
  sendreferinvitation,
  sendfeedback,
  readprofileimage
};
