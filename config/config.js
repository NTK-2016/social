
const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    "mongodb://" +
    (process.env.IP || "localhost") +
    ":" +
    (process.env.MONGO_PORT || "27017") +
    "/mernproject",

  // client
  stripe_connect_test_client_id: "ca_FsJ79EKbDMyL8BVabcEYkMZd9W2uJz06",
  stripe_test_secret_key: "sk_test_ETkKWUGXquMZ1mZbUaDI1Bpl00yr6VORam",
  stripe_test_api_key: "pk_test_nRpJGvU39Ijczgt3GuQcknRl00d6r1hEfi",

  // MAgento nitish
  // stripe_connect_test_client_id: "ca_FEGhnwpVReLY7wN7iOwdsecuLBPmV3VG",
  // stripe_test_secret_key: "sk_test_dUD6cIQEDXZvRCP3VkJIaWYj00XfkXYhmH",
  // stripe_test_api_key: "pk_test_3Y8GStXmEoPOic8094YHVFFZ00aEB4CUyJ",

  // local cli
  endpointSecret: "whsec_dBQV3nqAYujj0hDm8dxkzSmrvV2LII1A",

  // Zein test
  //endpointSecret:"",

  // Zein live
  // endpointSecret: "whsec_MSjXUiUuJt3ill0NIrWxbUypNyDuBJVo",




  smtp_mail_server_path: "http://localhost:3000",
  development_url: "http://localhost:3000",
  minimumAmountForCond: 200,
  ownerPer: 6, //owner percent
  ownerReferPer: 4, //owner percent if refer
  referPer: 2, //refree percent
  chargePer: 2.9, //charge percent
  extraDollar: 0.30, // extra cent charge

  withdrawalPer: 0.25,  // withdraw percent
  withdrawalChargeAmt: 0.5,// extra cent charge

  minAmtWithdraw: 10, // minimum

  maxMobileWidth: 767,

  smtpmail: "mail@stan.me",
  smptppwd: "Federica123stan",
  photoBucketURL: "https://stanmedata.s3.eu-west-2.amazonaws.com/uploads/photos/",
  audioBucketURL: "https://stanmedata.s3.eu-west-2.amazonaws.com/uploads/audios/",
  editorImageBucketURL: "https://stanmedata.s3.eu-west-2.amazonaws.com/uploads/editoruploads/",
  productBucketURL: "https://stanmedata.s3.eu-west-2.amazonaws.com/uploads/products/compress/",
  videoThumbnailBucketURL: "https://stanmedata.s3.eu-west-2.amazonaws.com/uploads/videos/thumbnail/",
  attachmentBucketURL: "https://stanmedata.s3.eu-west-2.amazonaws.com/uploads/attachments/",
  profileImageBucketURL: "https://stanmedata.s3.eu-west-2.amazonaws.com/uploads/profileimages/thumbnail/Thumbnail_",
  bannerImageBucketURL: "https://stanmedata.s3.eu-west-2.amazonaws.com/uploads/bannerimages/compressbanners/Thumbnail_",
  profileBucketKey: "uploads/profileimages/thumbnail/Thumbnail_",
  profileDefaultURL: "https://beta.stan.me/dist/profile-pic.png",
  profileDefaultPath: "/dist/profile-pic.png",
  bannerDefaultPath: "/dist/user-banner.png",
  productDefaultPath: "/dist/uploads/products/",
  accessKeyId: "AKIATW724PWSTKKMJM5S",
  secretAccessKey: "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"

};

export default config;
